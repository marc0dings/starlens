import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { useIsFocused } from 'expo-router';
import { DeviceMotion } from 'expo-sensors';
import { Fragment, useEffect, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';

import { DetailSheet } from '@/components/detail-sheet';
import { PlanetSvg } from '@/components/planet-svg';
import { StarFieldBackground } from '@/components/star-field-background';
import { Night, Spacing } from '@/constants/theme';
import { constellations, getConstellationById } from '@/data/constellations';
import { getPlanetById, planets } from '@/data/planets';
import { GeoPosition, getBodyHorizontalCoords, getStarHorizontalCoords, projectToScreen } from '@/lib/astronomy';
import { useSeen } from '@/store/seen-store';

const FOV_DEGREES = 60;
const RECOMPUTE_INTERVAL_MS = 4000;
const HIT_RADIUS = 22; // ~44pt diameter invisible tap target for small sky objects

interface SkyObject {
  id: string;
  label: string;
  kind: 'star' | 'planet';
  constellationId?: string;
  az: number;
  alt: number;
  mag?: number;
}

type Selection = { kind: 'constellation'; id: string; starName: string } | { kind: 'planet'; id: string };

export default function SkyScreen() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [locationPermission, requestLocationPermission] = Location.useForegroundPermissions();

  if (!cameraPermission || !locationPermission) {
    return (
      <View style={styles.container}>
        <StarFieldBackground />
      </View>
    );
  }

  const bothGranted = cameraPermission.granted && locationPermission.granted;

  if (!bothGranted) {
    const canAskAgain = cameraPermission.canAskAgain && locationPermission.canAskAgain;

    return (
      <View style={styles.container}>
        <StarFieldBackground />
        <View style={styles.permissionGate}>
          <Text style={styles.permissionTitle}>Zugriff auf Kamera & Standort</Text>
          <Text style={styles.permissionText}>
            {canAskAgain
              ? 'StarLens braucht die Kamera, um den Himmel als Hintergrund zu zeigen, und deinen Standort, um zu berechnen, welche Sterne und Planeten gerade über dir stehen.'
              : 'Kamera- oder Standortzugriff wurde dauerhaft verweigert. Bitte aktiviere beide Berechtigungen für StarLens in den Systemeinstellungen.'}
          </Text>
          <Pressable
            style={styles.permissionButton}
            onPress={async () => {
              if (canAskAgain) {
                await requestCameraPermission();
                await requestLocationPermission();
              } else {
                await Linking.openSettings();
              }
            }}>
            <Text style={styles.permissionButtonText}>
              {canAskAgain ? 'Zugriff erlauben' : 'Einstellungen öffnen'}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return <SkyView />;
}

function SkyView() {
  const { width, height } = useWindowDimensions();
  const { isSeen, toggleSeen } = useSeen();
  const isFocused = useIsFocused();

  const [location, setLocation] = useState<GeoPosition | null>(null);
  const [locationError, setLocationError] = useState(false);
  const [locationAttempt, setLocationAttempt] = useState(0);
  const [heading, setHeading] = useState(0);
  const [deviceAltitude, setDeviceAltitude] = useState(0);
  const [skyObjects, setSkyObjects] = useState<SkyObject[]>([]);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [manualQuery, setManualQuery] = useState('');
  const [manualSearching, setManualSearching] = useState(false);
  const [manualError, setManualError] = useState<string | null>(null);

  // Pauses camera, sensors and GPS the moment the Himmel tab loses focus (the
  // native tab bar keeps every tab mounted, so without this it would keep
  // burning battery and holding the camera hardware while the user is on
  // another tab).
  useEffect(() => {
    if (!isFocused) return;

    let cancelled = false;
    let headingSubscription: Location.LocationSubscription | undefined;

    (async () => {
      try {
        const position = await Location.getCurrentPositionAsync({});
        if (cancelled) return;
        setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        setLocationError(false);
        const subscription = await Location.watchHeadingAsync((h) => {
          setHeading(h.trueHeading >= 0 ? h.trueHeading : h.magHeading);
        });
        if (cancelled) {
          subscription.remove();
          return;
        }
        headingSubscription = subscription;
      } catch {
        if (!cancelled) setLocationError(true);
      }
    })();

    DeviceMotion.setUpdateInterval(100);
    const motionSubscription = DeviceMotion.addListener((measurement) => {
      const g = measurement.accelerationIncludingGravity;
      if (!g) return;
      setDeviceAltitude((Math.atan2(-g.z, g.y) * 180) / Math.PI);
    });

    return () => {
      cancelled = true;
      headingSubscription?.remove();
      motionSubscription.remove();
    };
  }, [locationAttempt, isFocused]);

  async function searchManualLocation() {
    const query = manualQuery.trim();
    if (!query) return;
    setManualSearching(true);
    setManualError(null);
    try {
      const results = await Location.geocodeAsync(query);
      if (results.length === 0) {
        setManualError('Kein Ort gefunden.');
        return;
      }
      setLocation({ latitude: results[0].latitude, longitude: results[0].longitude });
      setLocationError(false);
    } catch {
      setManualError('Suche fehlgeschlagen.');
    } finally {
      setManualSearching(false);
    }
  }

  useEffect(() => {
    if (!location || !isFocused) return;

    function recompute() {
      if (!location) return;
      const now = new Date();
      const objects: SkyObject[] = [];

      for (const constellation of constellations) {
        constellation.stars.forEach((star, index) => {
          const { azimuth, altitude } = getStarHorizontalCoords(star.ra, star.dec, location, now);
          objects.push({
            id: `${constellation.id}:${index}`,
            label: star.name,
            kind: 'star',
            constellationId: constellation.id,
            az: azimuth,
            alt: altitude,
            mag: star.mag,
          });
        });
      }

      for (const planet of planets) {
        const { azimuth, altitude } = getBodyHorizontalCoords(planet.body, location, now);
        objects.push({ id: planet.id, label: planet.name, kind: 'planet', az: azimuth, alt: altitude });
      }

      setSkyObjects(objects);
    }

    recompute();
    const interval = setInterval(recompute, RECOMPUTE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [location, isFocused]);

  const pxPerDeg = width / FOV_DEGREES;

  const visibleObjects = skyObjects
    .map((object) => {
      const { x, y } = projectToScreen(object.az, object.alt, heading, deviceAltitude);
      return {
        ...object,
        dAz: x,
        dAlt: y,
        sx: width / 2 + x * pxPerDeg,
        sy: height / 2 - y * pxPerDeg,
      };
    })
    .filter((object) => Math.abs(object.dAz) < FOV_DEGREES * 0.75 && Math.abs(object.dAlt) < FOV_DEGREES * 0.75);

  const starsByConstellation = new Map<string, typeof visibleObjects>();
  for (const object of visibleObjects) {
    if (object.kind !== 'star' || !object.constellationId) continue;
    const list = starsByConstellation.get(object.constellationId) ?? [];
    list.push(object);
    starsByConstellation.set(object.constellationId, list);
  }

  function openConstellation(constellationId: string, starName: string) {
    setSelection({ kind: 'constellation', id: constellationId, starName });
    setSheetVisible(true);
  }

  function openPlanet(planetId: string) {
    setSelection({ kind: 'planet', id: planetId });
    setSheetVisible(true);
  }

  const selectedConstellation = selection?.kind === 'constellation' ? getConstellationById(selection.id) : undefined;
  const selectedPlanet = selection?.kind === 'planet' ? getPlanetById(selection.id) : undefined;

  return (
    <View style={styles.container}>
      {isFocused ? (
        <CameraView style={StyleSheet.absoluteFill} facing="back" />
      ) : (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: Night.bg0 }]} />
      )}

      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        {constellations.map((constellation) => {
          const stars = starsByConstellation.get(constellation.id);
          if (!stars || stars.length < 2) return null;
          const byIndex = new Map(stars.map((s) => [Number(s.id.split(':')[1]), s]));
          const seen = isSeen(constellation.id);

          return (
            <Fragment key={constellation.id}>
              {constellation.lines.map(([a, b], index) => {
                const pa = byIndex.get(a);
                const pb = byIndex.get(b);
                if (!pa || !pb) return null;
                return (
                  <Line
                    key={index}
                    x1={pa.sx}
                    y1={pa.sy}
                    x2={pb.sx}
                    y2={pb.sy}
                    stroke={seen ? Night.success : Night.line}
                    strokeWidth={1.6}
                  />
                );
              })}
              <Circle
                cx={stars[0].sx + 12}
                cy={stars[0].sy - 16}
                r={HIT_RADIUS}
                fill={Night.star}
                fillOpacity={0.001}
                onPress={() => openConstellation(constellation.id, stars[0].label)}
              />
              <SvgText
                x={stars[0].sx + 12}
                y={stars[0].sy - 12}
                fill={seen ? Night.success : Night.textSecondary}
                fontSize={13}
                onPress={() => openConstellation(constellation.id, stars[0].label)}>
                {constellation.name}
              </SvgText>
            </Fragment>
          );
        })}

        {visibleObjects.map((object) => {
          if (object.kind === 'star') {
            return (
              <Fragment key={object.id}>
                <Circle
                  cx={object.sx}
                  cy={object.sy}
                  r={HIT_RADIUS}
                  fill={Night.star}
                  fillOpacity={0.001}
                  onPress={() => openConstellation(object.constellationId!, object.label)}
                />
                <Circle
                  cx={object.sx}
                  cy={object.sy}
                  r={Math.max(2.5, 5.5 - (object.mag ?? 3))}
                  fill={Night.star}
                  onPress={() => openConstellation(object.constellationId!, object.label)}
                />
              </Fragment>
            );
          }
          const planet = getPlanetById(object.id);
          return (
            <Fragment key={object.id}>
              <Circle
                cx={object.sx}
                cy={object.sy}
                r={HIT_RADIUS}
                fill={planet?.visual.color ?? Night.gold}
                fillOpacity={0.001}
                onPress={() => openPlanet(object.id)}
              />
              <Circle
                cx={object.sx}
                cy={object.sy}
                r={9}
                fill={planet?.visual.color ?? Night.gold}
                onPress={() => openPlanet(object.id)}
              />
              <SvgText
                x={object.sx + 14}
                y={object.sy + 4}
                fill={Night.text}
                fontSize={14}
                fontWeight="700"
                onPress={() => openPlanet(object.id)}>
                {object.label}
              </SvgText>
            </Fragment>
          );
        })}
      </Svg>

      <View pointerEvents="none" style={styles.crosshair} />

      <View pointerEvents="box-none" style={styles.header}>
        <View style={styles.headerScrim}>
          <Text style={styles.headerTitle}>Himmel</Text>
          <Text style={styles.headerHint}>
            {locationError
              ? 'Standort nicht verfügbar'
              : location
                ? 'Richte die Kamera auf den Nachthimmel'
                : 'Standort wird ermittelt …'}
          </Text>
          {locationError && (
            <View style={styles.locationFallback}>
              <Pressable style={styles.retryButton} onPress={() => setLocationAttempt((n) => n + 1)}>
                <Text style={styles.retryButtonText}>Erneut versuchen</Text>
              </Pressable>
              <View style={styles.manualRow}>
                <TextInput
                  style={styles.manualInput}
                  placeholder="Oder Stadt eingeben"
                  placeholderTextColor={Night.textMuted}
                  value={manualQuery}
                  onChangeText={setManualQuery}
                  onSubmitEditing={searchManualLocation}
                  returnKeyType="search"
                />
                <Pressable style={styles.manualButton} onPress={searchManualLocation} disabled={manualSearching}>
                  <Text style={styles.manualButtonText}>{manualSearching ? '…' : 'Suchen'}</Text>
                </Pressable>
              </View>
              {manualError && <Text style={styles.manualErrorText}>{manualError}</Text>}
            </View>
          )}
        </View>
      </View>

      <DetailSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        eyebrow={selection?.kind === 'constellation' ? `Angetippt: ${selection.starName}` : undefined}
        title={selectedConstellation?.name ?? selectedPlanet?.name ?? ''}
        subtitle={
          selectedConstellation
            ? `${selectedConstellation.latinName} · ${selectedConstellation.season}`
            : selectedPlanet?.tagline
        }
        description={selectedConstellation?.mythology ?? selectedPlanet?.description}
        facts={selectedPlanet?.facts}
        illustration={selectedPlanet ? <PlanetSvg visual={selectedPlanet.visual} size={100} /> : undefined}
        seenToggle={
          selectedConstellation
            ? { isSeen: isSeen(selectedConstellation.id), onToggle: () => toggleSeen(selectedConstellation.id) }
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
  crosshair: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 10,
    height: 10,
    marginLeft: -5,
    marginTop: -5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  header: {
    position: 'absolute',
    top: Spacing.six,
    left: Spacing.four,
    right: Spacing.four,
  },
  headerScrim: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(3,4,12,0.6)',
    borderRadius: Spacing.three,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    maxWidth: '100%',
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
  locationFallback: {
    marginTop: Spacing.two,
    gap: Spacing.two,
  },
  retryButton: {
    alignSelf: 'flex-start',
    backgroundColor: Night.accent,
    borderRadius: Spacing.five,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
  },
  retryButtonText: {
    color: Night.bg0,
    fontWeight: '700',
    fontSize: 12,
  },
  manualRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    alignItems: 'center',
  },
  manualInput: {
    flex: 1,
    minWidth: 140,
    color: Night.text,
    fontSize: 13,
    backgroundColor: Night.surface,
    borderRadius: Spacing.five,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Night.border,
  },
  manualButton: {
    backgroundColor: Night.surfaceStrong,
    borderRadius: Spacing.five,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Night.border,
  },
  manualButtonText: {
    color: Night.text,
    fontWeight: '700',
    fontSize: 12,
  },
  manualErrorText: {
    color: Night.gold,
    fontSize: 11,
  },
  permissionGate: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.five,
    gap: Spacing.three,
  },
  permissionTitle: {
    color: Night.text,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  permissionText: {
    color: Night.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: Night.accent,
    borderRadius: Spacing.five,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.five,
    marginTop: Spacing.two,
  },
  permissionButtonText: {
    color: Night.bg0,
    fontWeight: '700',
    fontSize: 15,
  },
});
