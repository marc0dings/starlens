import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StarFieldBackground } from '@/components/star-field-background';
import { StarLensMark } from '@/components/starlens-mark';
import { BottomTabInset, MaxContentWidth, Night, Spacing } from '@/constants/theme';
import { constellations } from '@/data/constellations';
import { useSeen } from '@/store/seen-store';

interface HubCard {
  href: '/sky' | '/library' | '/map';
  icon: string;
  accent: string;
  title: string;
  description: string;
}

const cards: HubCard[] = [
  {
    href: '/sky',
    icon: '✦',
    accent: Night.accentAlt,
    title: 'Himmel',
    description: 'Kamera auf den Nachthimmel richten und Sternbilder & Planeten live erkennen.',
  },
  {
    href: '/library',
    icon: '☾',
    accent: Night.gold,
    title: 'Lexikon',
    description: 'Sternbilder, Planeten und Astronomie-Themen zum Nachlesen und Entdecken.',
  },
  {
    href: '/map',
    icon: '⊹',
    accent: Night.accent,
    title: 'Karte',
    description: 'Der ganze Sternenhimmel zum Erkunden — antippen, hervorheben, mehr erfahren.',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { seenCount, isLoaded } = useSeen();

  return (
    <View style={styles.container}>
      <StarFieldBackground density={110} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.hero}>
          <Animated.View entering={FadeIn.duration(900)} style={styles.markGlowWrap}>
            <View style={styles.markGlow} />
            <StarLensMark size={76} />
          </Animated.View>
          <Animated.Text entering={FadeInDown.delay(150).duration(700)} style={styles.title}>
            StarLens
          </Animated.Text>
          <Animated.Text entering={FadeInDown.delay(280).duration(700)} style={styles.tagline}>
            Dein Fenster zum Nachthimmel
          </Animated.Text>
          {isLoaded && (
            <Animated.Text entering={FadeIn.delay(500).duration(700)} style={styles.progress}>
              {seenCount} von {constellations.length} Sternbildern entdeckt
            </Animated.Text>
          )}
        </View>

        <View style={styles.cards}>
          {cards.map((card, index) => (
            <Animated.View key={card.href} entering={FadeInUp.delay(400 + index * 120).duration(600)}>
              <Pressable
                style={({ pressed }) => [
                  styles.card,
                  { borderColor: pressed ? card.accent : Night.border },
                  pressed && styles.cardPressed,
                ]}
                onPress={() => router.push(card.href)}>
                <View style={[styles.cardIconBadge, { borderColor: card.accent }]}>
                  <Text style={[styles.cardIcon, { color: card.accent }]}>{card.icon}</Text>
                </View>
                <View style={styles.cardTextWrap}>
                  <Text style={styles.cardTitle}>{card.title}</Text>
                  <Text style={styles.cardDescription}>{card.description}</Text>
                </View>
                <Text style={styles.cardChevron}>›</Text>
              </Pressable>
            </Animated.View>
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Night.bg0,
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.three,
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.two,
  },
  markGlowWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 160,
    height: 160,
  },
  markGlow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    opacity: 0.55,
    experimental_backgroundImage: `radial-gradient(circle, ${Night.accent} 0%, rgba(139,124,250,0) 68%)`,
  },
  title: {
    color: Night.text,
    fontSize: 44,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: Spacing.two,
    textShadowColor: 'rgba(139,124,250,0.45)',
    textShadowRadius: 18,
    textShadowOffset: { width: 0, height: 0 },
  },
  tagline: {
    color: Night.textSecondary,
    fontSize: 16,
  },
  progress: {
    color: Night.accentAlt,
    fontSize: 13,
    marginTop: Spacing.three,
    fontWeight: '600',
  },
  cards: {
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.three,
    paddingBottom: Spacing.four,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    backgroundColor: Night.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Spacing.four,
    padding: Spacing.four,
  },
  cardPressed: {
    backgroundColor: Night.surfaceStrong,
  },
  cardIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Night.surfaceStrong,
  },
  cardIcon: {
    fontSize: 20,
  },
  cardTextWrap: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    color: Night.text,
    fontSize: 18,
    fontWeight: '700',
  },
  cardDescription: {
    color: Night.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  cardChevron: {
    color: Night.textMuted,
    fontSize: 22,
  },
});
