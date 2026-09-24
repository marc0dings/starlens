import { StyleSheet, Text, View } from 'react-native';

import { Night, Spacing } from '@/constants/theme';

export function SeenBadge({ label = 'Gesehen' }: { label?: string }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.check}>✓</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: Spacing.half,
    backgroundColor: 'rgba(62,214,168,0.16)',
    borderColor: Night.success,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Spacing.five,
    paddingVertical: Spacing.half,
    paddingHorizontal: Spacing.two,
  },
  check: {
    color: Night.success,
    fontSize: 12,
    fontWeight: '700',
  },
  label: {
    color: Night.success,
    fontSize: 12,
    fontWeight: '600',
  },
});
