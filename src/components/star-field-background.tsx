import { useEffect, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Night } from '@/constants/theme';

const STAR_COLORS = [
  { color: '#FFFFFF', weight: 6 },
  { color: '#FFF3DE', weight: 2 },
  { color: '#D7E6FF', weight: 2 },
  { color: '#FFE6B8', weight: 1 },
];
const STAR_COLOR_TABLE = STAR_COLORS.flatMap(({ color, weight }) => Array(weight).fill(color));

interface StarSpec {
  x: number;
  y: number;
  size: number;
  color: string;
  glow: boolean;
  delay: number;
  duration: number;
  baseOpacity: number;
}

interface ShootingStarSpec {
  x: number;
  y: number;
  angle: number;
  length: number;
  cycleDuration: number;
  startDelay: number;
}

function useStarField(count: number, width: number, height: number): StarSpec[] {
  // Generated once via the lazy useState initializer — positions/colors are
  // intentionally random but must not be recomputed on every render.
  const [stars] = useState<StarSpec[]>(() => {
    if (width === 0 || height === 0) return [];
    return Array.from({ length: count }, () => {
      const roll = Math.random();
      // Mostly faint, distant pinpoints with a handful of bright "hero" stars —
      // real skies are dominated by dim stars, not uniformly sized dots.
      const size = roll > 0.94 ? 2.4 + Math.random() * 1.4 : 0.6 + Math.random() * 1.6;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size,
        color: STAR_COLOR_TABLE[Math.floor(Math.random() * STAR_COLOR_TABLE.length)],
        glow: size > 2.6,
        delay: Math.random() * 4000,
        duration: 1800 + Math.random() * 2600,
        baseOpacity: 0.3 + Math.random() * 0.6,
      };
    });
  });
  return stars;
}

function useShootingStars(width: number, height: number, count: number): ShootingStarSpec[] {
  const [shootingStars] = useState<ShootingStarSpec[]>(() => {
    if (width === 0 || height === 0) return [];
    return Array.from({ length: count }, (_, index) => ({
      x: width * (0.15 + Math.random() * 0.6),
      y: height * (0.05 + Math.random() * 0.3),
      angle: 28 + Math.random() * 14,
      length: 90 + Math.random() * 60,
      cycleDuration: 7000 + Math.random() * 6000,
      startDelay: index * 2500 + Math.random() * 3000,
    }));
  });
  return shootingStars;
}

function TwinklingStar({ star }: { star: StarSpec }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      star.delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: star.duration, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: star.duration, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      )
    );
  }, [progress, star]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [star.baseOpacity * 0.25, star.baseOpacity]),
  }));

  return (
    <Animated.View
      style={[
        styles.star,
        animatedStyle,
        {
          left: star.x,
          top: star.y,
          width: star.size,
          height: star.size,
          borderRadius: star.size,
          backgroundColor: star.color,
        },
      ]}>
      {star.glow && (
        <View
          pointerEvents="none"
          style={[
            styles.starGlow,
            {
              width: star.size * 6,
              height: star.size * 6,
              left: -star.size * 2.5,
              top: -star.size * 2.5,
              backgroundColor: star.color,
            },
          ]}
        />
      )}
    </Animated.View>
  );
}

function ShootingStar({ spec }: { spec: ShootingStarSpec }) {
  const progress = useSharedValue(0);
  const angleRad = (spec.angle * Math.PI) / 180;

  useEffect(() => {
    progress.value = withDelay(
      spec.startDelay,
      withRepeat(withTiming(1, { duration: spec.cycleDuration, easing: Easing.linear }), -1, false)
    );
  }, [progress, spec]);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [0, 0.03, 0.09, 0.16, 1], [0, 1, 1, 0, 0]);
    const travel = interpolate(progress.value, [0, 0.16, 1], [0, spec.length * 2.4, spec.length * 2.4]);
    return {
      opacity,
      transform: [
        { translateX: travel * Math.cos(angleRad) },
        { translateY: travel * Math.sin(angleRad) },
        { rotate: `${spec.angle}deg` },
      ],
    };
  });

  return (
    <Animated.View
      style={[styles.shootingStar, { left: spec.x, top: spec.y, width: spec.length }, animatedStyle]}
    />
  );
}

export function StarFieldBackground({ density = 90 }: { density?: number }) {
  const { width, height } = useWindowDimensions();
  const stars = useStarField(density, width, height);
  const shootingStars = useShootingStars(width, height, 2);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: Night.bg0,
            // Fabric CSS gradient support — falls back to the flat backgroundColor above
            // on runtimes that don't understand the property.
            experimental_backgroundImage:
              'linear-gradient(180deg, #01020a 0%, #050818 40%, #0b1230 72%, #141b40 100%)',
          },
        ]}
      />
      <View
        style={[
          styles.nebula,
          {
            top: -height * 0.25,
            left: -width * 0.35,
            experimental_backgroundImage: `radial-gradient(circle, ${Night.accent} 0%, rgba(139,124,250,0) 70%)`,
          },
        ]}
      />
      <View
        style={[
          styles.nebula,
          {
            bottom: -height * 0.3,
            right: -width * 0.3,
            experimental_backgroundImage: `radial-gradient(circle, ${Night.accentAlt} 0%, rgba(92,201,232,0) 70%)`,
          },
        ]}
      />
      <View
        style={[
          styles.milkyWay,
          {
            left: width * 0.5 - Math.max(width, height) * 0.6,
            top: height * 0.5 - Math.max(width, height) * 0.6,
            width: Math.max(width, height) * 1.2,
            height: Math.max(width, height) * 1.2,
            transform: [{ rotate: '-28deg' }],
          },
        ]}
      />
      {stars.map((star, index) => (
        <TwinklingStar key={index} star={star} />
      ))}
      {shootingStars.map((spec, index) => (
        <ShootingStar key={index} spec={spec} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  star: {
    position: 'absolute',
  },
  starGlow: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.35,
  },
  nebula: {
    position: 'absolute',
    width: 560,
    height: 560,
    borderRadius: 280,
    opacity: 0.22,
  },
  milkyWay: {
    position: 'absolute',
    opacity: 0.1,
    experimental_backgroundImage:
      'linear-gradient(90deg, rgba(200,205,255,0) 0%, rgba(210,215,255,0.5) 46%, rgba(255,255,255,0.65) 50%, rgba(210,215,255,0.5) 54%, rgba(200,205,255,0) 100%)',
  },
  shootingStar: {
    position: 'absolute',
    height: 2,
    borderRadius: 1,
    backgroundColor: '#FFFFFF',
  },
});
