import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { PlanetSvg } from '@/components/planet-svg';
import { MaxContentWidth, Night, Spacing } from '@/constants/theme';
import { getPlanetById } from '@/data/planets';

export default function PlanetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const planet = getPlanetById(id);

  if (!planet) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFound}>Himmelskörper nicht gefunden.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: planet.name }} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.illustration}>
          <PlanetSvg visual={planet.visual} size={180} />
        </View>

        <Text style={styles.eyebrow}>{planet.tagline}</Text>
        <Text style={styles.title}>{planet.name}</Text>
        <Text style={styles.paragraph}>{planet.description}</Text>

        <View style={styles.factsGrid}>
          {planet.facts.map((fact) => (
            <View key={fact.label} style={styles.factItem}>
              <Text style={styles.factLabel}>{fact.label}</Text>
              <Text style={styles.factValue}>{fact.value}</Text>
            </View>
          ))}
        </View>
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
    marginBottom: Spacing.two,
  },
  paragraph: {
    color: Night.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: Spacing.two,
  },
  factsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
    marginTop: Spacing.two,
  },
  factItem: {
    minWidth: '42%',
    flexGrow: 1,
    backgroundColor: Night.surface,
    borderRadius: Spacing.three,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Night.border,
    padding: Spacing.three,
  },
  factLabel: {
    color: Night.textMuted,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  factValue: {
    color: Night.text,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 2,
  },
});
