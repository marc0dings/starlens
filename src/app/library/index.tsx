import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ConstellationSvg } from '@/components/constellation-svg';
import { PlanetSvg } from '@/components/planet-svg';
import { SeenBadge } from '@/components/seen-badge';
import { MaxContentWidth, Night, Spacing } from '@/constants/theme';
import { constellations } from '@/data/constellations';
import { planets } from '@/data/planets';
import { topics } from '@/data/topics';
import { useSeen } from '@/store/seen-store';

type Section = 'constellations' | 'planets' | 'topics';

const sectionLabels: Record<Section, string> = {
  constellations: 'Sternbilder',
  planets: 'Planeten',
  topics: 'Themen',
};

export default function LibraryScreen() {
  const [section, setSection] = useState<Section>('constellations');
  const router = useRouter();
  const { isSeen } = useSeen();

  return (
    <View style={styles.container}>
      <View style={styles.segmentRow}>
        {(Object.keys(sectionLabels) as Section[]).map((key) => (
          <Pressable
            key={key}
            style={[styles.segment, section === key && styles.segmentActive]}
            onPress={() => setSection(key)}>
            <Text style={[styles.segmentText, section === key && styles.segmentTextActive]}>
              {sectionLabels[key]}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {section === 'constellations' &&
          constellations.map((c) => (
            <Pressable
              key={c.id}
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
              onPress={() => router.push(`/library/constellation/${c.id}`)}>
              <View style={styles.thumb}>
                <ConstellationSvg constellation={c} size={56} />
              </View>
              <View style={styles.cardTextWrap}>
                <Text style={styles.cardTitle}>{c.name}</Text>
                <Text style={styles.cardSubtitle}>
                  {c.latinName} · {c.season}
                </Text>
              </View>
              {isSeen(c.id) && <SeenBadge />}
            </Pressable>
          ))}

        {section === 'planets' &&
          planets.map((p) => (
            <Pressable
              key={p.id}
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
              onPress={() => router.push(`/library/planet/${p.id}`)}>
              <View style={styles.thumb}>
                <PlanetSvg visual={p.visual} size={56} />
              </View>
              <View style={styles.cardTextWrap}>
                <Text style={styles.cardTitle}>{p.name}</Text>
                <Text style={styles.cardSubtitle}>{p.tagline}</Text>
              </View>
            </Pressable>
          ))}

        {section === 'topics' &&
          topics.map((t) => (
            <Pressable
              key={t.id}
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
              onPress={() => router.push(`/library/topic/${t.id}`)}>
              <View style={[styles.thumb, styles.topicThumb]}>
                <Text style={styles.topicGlyph}>✦</Text>
              </View>
              <View style={styles.cardTextWrap}>
                <Text style={styles.cardTitle}>{t.title}</Text>
                <Text style={styles.cardSubtitle}>{t.teaser}</Text>
              </View>
            </Pressable>
          ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Night.bg0,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    padding: Spacing.three,
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  segment: {
    flex: 1,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.five,
    alignItems: 'center',
    backgroundColor: Night.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Night.border,
  },
  segmentActive: {
    backgroundColor: Night.accent,
    borderColor: Night.accent,
  },
  segmentText: {
    color: Night.textSecondary,
    fontWeight: '600',
    fontSize: 13,
  },
  segmentTextActive: {
    color: Night.bg0,
  },
  list: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    backgroundColor: Night.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Night.border,
    borderRadius: Spacing.three,
    padding: Spacing.two,
  },
  cardPressed: {
    backgroundColor: Night.surfaceStrong,
  },
  thumb: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicThumb: {
    backgroundColor: Night.bg2,
    borderRadius: Spacing.three,
  },
  topicGlyph: {
    color: Night.gold,
    fontSize: 22,
  },
  cardTextWrap: {
    flex: 1,
    gap: 2,
  },
  cardTitle: {
    color: Night.text,
    fontSize: 16,
    fontWeight: '700',
  },
  cardSubtitle: {
    color: Night.textSecondary,
    fontSize: 12,
  },
});
