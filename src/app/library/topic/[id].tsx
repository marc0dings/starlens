import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { MaxContentWidth, Night, Spacing } from '@/constants/theme';
import { getTopicById } from '@/data/topics';

export default function TopicDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const topic = getTopicById(id);

  if (!topic) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFound}>Thema nicht gefunden.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: topic.title }} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.glyph}>✦</Text>
        <Text style={styles.title}>{topic.title}</Text>
        {topic.paragraphs.map((paragraph, index) => (
          <Text key={index} style={styles.paragraph}>
            {paragraph}
          </Text>
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
    gap: Spacing.three,
  },
  notFound: {
    color: Night.textSecondary,
    padding: Spacing.four,
  },
  glyph: {
    color: Night.gold,
    fontSize: 28,
  },
  title: {
    color: Night.text,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: Spacing.two,
  },
  paragraph: {
    color: Night.textSecondary,
    fontSize: 15,
    lineHeight: 23,
  },
});
