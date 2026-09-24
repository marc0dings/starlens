import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ConstellationSvg } from '@/components/constellation-svg';
import { MaxContentWidth, Night, Spacing } from '@/constants/theme';
import { getConstellationById } from '@/data/constellations';
import { useSeen } from '@/store/seen-store';

export default function ConstellationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const constellation = getConstellationById(id);
  const { isSeen, toggleSeen } = useSeen();

  if (!constellation) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFound}>Sternbild nicht gefunden.</Text>
      </View>
    );
  }

  const seen = isSeen(constellation.id);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: constellation.name }} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.illustration}>
          <ConstellationSvg constellation={constellation} size={220} />
        </View>

        <Text style={styles.eyebrow}>
          {constellation.latinName} · {constellation.abbr}
        </Text>
        <Text style={styles.title}>{constellation.name}</Text>
        <Text style={styles.subtitle}>
          Beste Sichtbarkeit: {constellation.season} · {constellation.hemisphere}halbkugel
        </Text>

        <Text
          onPress={() => toggleSeen(constellation.id)}
          style={[styles.seenButton, seen && styles.seenButtonActive]}>
          {seen ? '✓ Als gesehen markiert' : 'Als gesehen markieren'}
        </Text>

        <Text style={styles.sectionHeading}>Mythologie</Text>
        <Text style={styles.paragraph}>{constellation.mythology}</Text>

        <Text style={styles.sectionHeading}>Wissenswertes</Text>
        {constellation.facts.map((fact, index) => (
          <View key={index} style={styles.factRow}>
            <Text style={styles.factBullet}>✦</Text>
            <Text style={styles.factText}>{fact}</Text>
          </View>
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
  content: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  notFound: {
    color: Night.textSecondary,
    padding: Spacing.four,
  },
  illustration: {
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  eyebrow: {
    color: Night.accentAlt,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    color: Night.text,
    fontSize: 30,
    fontWeight: '700',
  },
  subtitle: {
    color: Night.textSecondary,
    fontSize: 14,
    marginBottom: Spacing.two,
  },
  seenButton: {
    alignSelf: 'flex-start',
    color: Night.text,
    fontWeight: '600',
    fontSize: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Night.border,
    backgroundColor: Night.surface,
    borderRadius: Spacing.five,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    marginBottom: Spacing.three,
    overflow: 'hidden',
  },
  seenButtonActive: {
    color: Night.success,
    backgroundColor: 'rgba(62,214,168,0.16)',
    borderColor: Night.success,
  },
  sectionHeading: {
    color: Night.text,
    fontSize: 17,
    fontWeight: '700',
    marginTop: Spacing.three,
    marginBottom: Spacing.one,
  },
  paragraph: {
    color: Night.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  factRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  factBullet: {
    color: Night.gold,
    fontSize: 13,
    marginTop: 2,
  },
  factText: {
    flex: 1,
    color: Night.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
});
