import { Fragment, useState } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedProps, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Circle, Defs, Ellipse, Line, LinearGradient, RadialGradient, Rect, Stop, Text as SvgText } from 'react-native-svg';

import { DetailSheet } from '@/components/detail-sheet';
import { Night, Spacing } from '@/constants/theme';
import { constellations } from '@/data/constellations';
import { WORLD_HEIGHT, WORLD_WIDTH, worldPosition } from '@/lib/star-chart';
import { useSeen } from '@/store/seen-store';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 6;
const HIT_RADIUS_PX = 34;
const FILLER_STAR_COUNT = 900;
const FILLER_STAR_COLORS = ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFF3DE', '#D7E6FF', '#FFE6B8'];

interface Selection {
  constellationId: string;
  starName: string;
}

function starRadius(mag: number) {
  return Math.max(4.5, 8 - mag);
}

function distanceToSegment(px: number, py: number, x1: number, y1: number, x2: number, y2: number) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSq = dx * dx + dy * dy;
  if (lengthSq === 0) return Math.hypot(px - x1, py - y1);
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / lengthSq));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

function centroidWorld(id: string) {
  const c = constellations.find((x) => x.id === id)!;
  const ra = c.stars.reduce((sum, s) => sum + s.ra, 0) / c.stars.length;
  const dec = c.stars.reduce((sum, s) => sum + s.dec, 0) / c.stars.length;
  return worldPosition(ra, dec);
}

function midpointWorld(idA: string, idB: string) {
  const a = centroidWorld(idA);
  const b = centroidWorld(idB);
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

// Rough hazy patches standing in for the Milky Way, anchored on the real constellations
// it actually passes through — not a physically continuous band (our flat, unwrapped
// RA/Dec map can't represent the wrap at 0h/24h without visual artifacts).
const MILKY_WAY_PATCHES = [
  { ...centroidWorld('cassiopeia'), rx: 260, ry: 420 },
  { ...centroidWorld('perseus'), rx: 220, ry: 360 },
  { ...centroidWorld('cygnus'), rx: 280, ry: 460 },
  { ...midpointWorld('sagittarius', 'scorpius'), rx: 320, ry: 500 },
];

interface FillerStar {
  x: number;
  y: number;
  r: number;
  color: string;
  opacity: number;
}

export default function MapScreen() {
  const { width, height } = useWindowDimensions();
  const { isSeen, toggleSeen } = useSeen();

  const [selection, setSelection] = useState<Selection | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);

  // Generated once — a dense field of uncatalogued background stars so the chart reads
  // as a real sky photo instead of a dozen isolated constellations on empty space.
  const [fillerStars] = useState<FillerStar[]>(() =>
    Array.from({ length: FILLER_STAR_COUNT }, () => ({
      x: Math.random() * WORLD_WIDTH,
      y: Math.random() * WORLD_HEIGHT,
      r: Math.random() > 0.92 ? 1.6 + Math.random() * 1.2 : 0.5 + Math.random() * 1,
      color: FILLER_STAR_COLORS[Math.floor(Math.random() * FILLER_STAR_COLORS.length)],
      opacity: 0.25 + Math.random() * 0.55,
    }))
  );

  const initialOriginX = WORLD_WIDTH / 2 - width / 2;
  const initialOriginY = WORLD_HEIGHT / 2 - height / 2;

  const originX = useSharedValue(initialOriginX);
  const originY = useSharedValue(initialOriginY);
  const zoom = useSharedValue(1);

  const panStartX = useSharedValue(0);
  const panStartY = useSharedValue(0);
  const panZoomSnapshot = useSharedValue(1);

  const pinchStartZoom = useSharedValue(1);
  const pinchFocalWorldX = useSharedValue(0);
  const pinchFocalWorldY = useSharedValue(0);

  function handleTap(screenX: number, screenY: number, curOriginX: number, curOriginY: number, curZoom: number) {
    const worldX = curOriginX + screenX / curZoom;
    const worldY = curOriginY + screenY / curZoom;
    const thresholdWorld = HIT_RADIUS_PX / curZoom;

    let best: { id: string; name: string; dist: number } | null = null;

    for (const c of constellations) {
      // Stars — the precise, named hit points.
      for (const star of c.stars) {
        const p = worldPosition(star.ra, star.dec);
        const dist = Math.hypot(p.x - worldX, p.y - worldY);
        if (dist < thresholdWorld && (!best || dist < best.dist)) {
          best = { id: c.id, name: star.name, dist };
        }
      }
      // Connecting lines — tapping anywhere on the drawn shape should also count,
      // not just the tiny star dots at its endpoints.
      for (const [a, b] of c.lines) {
        const pa = worldPosition(c.stars[a].ra, c.stars[a].dec);
        const pb = worldPosition(c.stars[b].ra, c.stars[b].dec);
        const dist = distanceToSegment(worldX, worldY, pa.x, pa.y, pb.x, pb.y);
        if (dist < thresholdWorld && (!best || dist < best.dist)) {
          const nearer = Math.hypot(pa.x - worldX, pa.y - worldY) < Math.hypot(pb.x - worldX, pb.y - worldY);
          best = { id: c.id, name: nearer ? c.stars[a].name : c.stars[b].name, dist };
        }
      }
    }

    if (best) {
      setSelection({ constellationId: best.id, starName: best.name });
      setSheetVisible(true);
    } else {
      // Tapped empty space — give focus back to the whole map instead of leaving
      // the previous constellation highlighted.
      setSelection(null);
      setSheetVisible(false);
    }
  }

  const panGesture = Gesture.Pan()
    .minDistance(6)
    .onStart(() => {
      panStartX.value = originX.value;
      panStartY.value = originY.value;
      panZoomSnapshot.value = zoom.value;
    })
    .onUpdate((e) => {
      originX.value = panStartX.value - e.translationX / panZoomSnapshot.value;
      originY.value = panStartY.value - e.translationY / panZoomSnapshot.value;
    });

  const pinchGesture = Gesture.Pinch()
    .onStart((e) => {
      pinchStartZoom.value = zoom.value;
      pinchFocalWorldX.value = originX.value + e.focalX / zoom.value;
      pinchFocalWorldY.value = originY.value + e.focalY / zoom.value;
    })
    .onUpdate((e) => {
      const nextZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, pinchStartZoom.value * e.scale));
      zoom.value = nextZoom;
      originX.value = pinchFocalWorldX.value - e.focalX / nextZoom;
      originY.value = pinchFocalWorldY.value - e.focalY / nextZoom;
    });

  const tapGesture = Gesture.Tap()
    .maxDuration(250)
    .maxDistance(10)
    .onEnd((e, success) => {
      if (!success) return;
      runOnJS(handleTap)(e.x, e.y, originX.value, originY.value, zoom.value);
    });

  const composedGesture = Gesture.Simultaneous(panGesture, pinchGesture, tapGesture);

  const animatedProps = useAnimatedProps(() => {
    const w = width / zoom.value;
    const h = height / zoom.value;
    return {
      viewBox: `${originX.value} ${originY.value} ${w} ${h}`,
    };
  });

  function handleReset() {
    zoom.value = withTiming(1, { duration: 300 });
    originX.value = withTiming(initialOriginX, { duration: 300 });
    originY.value = withTiming(initialOriginY, { duration: 300 });
  }

  const selectedConstellation = selection
    ? constellations.find((c) => c.id === selection.constellationId)
    : undefined;

  return (
    <View style={styles.container}>
      <GestureDetector gesture={composedGesture}>
        <View style={{ width, height }}>
          <AnimatedSvg width={width} height={height} animatedProps={animatedProps}>
            <Defs>
              <LinearGradient id="skyBackground" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#05070f" />
                <Stop offset="45%" stopColor="#0a0e22" />
                <Stop offset="100%" stopColor="#141c3f" />
              </LinearGradient>
              <RadialGradient id="milkyWayGlow" cx="50%" cy="50%" r="50%">
                <Stop offset="0%" stopColor="#d9def0" stopOpacity={0.4} />
                <Stop offset="100%" stopColor="#d9def0" stopOpacity={0} />
              </RadialGradient>
            </Defs>

            <Rect x={0} y={0} width={WORLD_WIDTH} height={WORLD_HEIGHT} fill="url(#skyBackground)" />

            {MILKY_WAY_PATCHES.map((patch, index) => (
              <Ellipse
                key={index}
                cx={patch.x}
                cy={patch.y}
                rx={patch.rx}
                ry={patch.ry}
                fill="url(#milkyWayGlow)"
              />
            ))}

            {fillerStars.map((star, index) => (
              <Circle key={index} cx={star.x} cy={star.y} r={star.r} fill={star.color} opacity={star.opacity} />
            ))}

            {constellations.map((c) => {
              const isSelected = selection?.constellationId === c.id;
              const dimmed = !!selection && !isSelected;
              const lineColor = isSelected ? Night.gold : dimmed ? 'rgba(139,148,255,0.15)' : Night.line;
              const starColor = isSelected ? Night.gold : dimmed ? 'rgba(255,255,255,0.22)' : Night.star;
              const labelColor = isSelected
                ? Night.gold
                : dimmed
                  ? 'rgba(169,175,204,0.25)'
                  : Night.textSecondary;
              const labelAnchor = worldPosition(c.stars[0].ra, c.stars[0].dec);

              return (
                <Fragment key={c.id}>
                  {c.lines.map(([a, b], index) => {
                    const pa = worldPosition(c.stars[a].ra, c.stars[a].dec);
                    const pb = worldPosition(c.stars[b].ra, c.stars[b].dec);
                    return (
                      <Line
                        key={index}
                        x1={pa.x}
                        y1={pa.y}
                        x2={pb.x}
                        y2={pb.y}
                        stroke={lineColor}
                        strokeWidth={isSelected ? 2.4 : 1.4}
                      />
                    );
                  })}
                  {c.stars.map((star, index) => {
                    const p = worldPosition(star.ra, star.dec);
                    const r = starRadius(star.mag);
                    return (
                      <Fragment key={index}>
                        <Circle cx={p.x} cy={p.y} r={r * 2.4} fill={starColor} opacity={0.18} />
                        <Circle cx={p.x} cy={p.y} r={r} fill={starColor} />
                      </Fragment>
                    );
                  })}
                  <SvgText x={labelAnchor.x + 14} y={labelAnchor.y - 10} fill={labelColor} fontSize={22}>
                    {c.name}
                  </SvgText>
                </Fragment>
              );
            })}
          </AnimatedSvg>
        </View>
      </GestureDetector>

      <View pointerEvents="box-none" style={styles.header}>
        <Text style={styles.headerTitle}>Sternenkarte</Text>
        <Text style={styles.headerHint}>Ziehen zum Erkunden · Zwei Finger zum Zoomen · Antippen für Details</Text>
      </View>

      <Pressable style={styles.resetButton} onPress={handleReset}>
        <Text style={styles.resetButtonText}>⊙</Text>
      </Pressable>

      <DetailSheet
        visible={sheetVisible}
        onClose={() => {
          setSheetVisible(false);
          setSelection(null);
        }}
        eyebrow={selection ? `Angetippt: ${selection.starName}` : undefined}
        title={selectedConstellation?.name ?? ''}
        subtitle={
          selectedConstellation
            ? `${selectedConstellation.latinName} · ${selectedConstellation.season}`
            : undefined
        }
        description={selectedConstellation?.mythology}
        seenToggle={
          selectedConstellation
            ? {
                isSeen: isSeen(selectedConstellation.id),
                onToggle: () => toggleSeen(selectedConstellation.id),
              }
            : undefined
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Night.bg0,
  },
  header: {
    position: 'absolute',
    top: Spacing.six,
    left: Spacing.four,
    right: Spacing.four,
  },
  headerTitle: {
    color: Night.text,
    fontSize: 22,
    fontWeight: '700',
  },
  headerHint: {
    color: Night.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  resetButton: {
    position: 'absolute',
    right: Spacing.four,
    bottom: Spacing.six,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Night.surfaceStrong,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Night.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    color: Night.text,
    fontSize: 20,
  },
});
