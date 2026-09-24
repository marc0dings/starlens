import { ReactNode } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Night, Spacing } from '@/constants/theme';

interface DetailSheetProps {
  visible: boolean;
  onClose: () => void;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  description?: string;
  facts?: { label: string; value: string }[];
  seenToggle?: { isSeen: boolean; onToggle: () => void };
  illustration?: ReactNode;
  primaryAction?: { label: string; onPress: () => void };
}

export function DetailSheet({
  visible,
  onClose,
  eyebrow,
  title,
  subtitle,
  description,
  facts,
  seenToggle,
  illustration,
  primaryAction,
}: DetailSheetProps) {
  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <Animated.View
        entering={SlideInDown.duration(280)}
        exiting={SlideOutDown.duration(200)}
        style={styles.sheet}>
        <SafeAreaView edges={['bottom']}>
          <View style={styles.handle} />
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            {illustration && <View style={styles.illustration}>{illustration}</View>}
            {eyebrow && <Text style={styles.eyebrow}>{eyebrow}</Text>}
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

            {seenToggle && (
              <Pressable
                style={[styles.seenButton, seenToggle.isSeen && styles.seenButtonActive]}
                onPress={seenToggle.onToggle}>
                <Text style={[styles.seenButtonText, seenToggle.isSeen && styles.seenButtonTextActive]}>
                  {seenToggle.isSeen ? '✓ Als gesehen markiert' : 'Als gesehen markieren'}
                </Text>
              </Pressable>
            )}

            {description && <Text style={styles.description}>{description}</Text>}

            {facts && facts.length > 0 && (
              <View style={styles.factsGrid}>
                {facts.map((fact) => (
                  <View key={fact.label} style={styles.factItem}>
                    <Text style={styles.factLabel}>{fact.label}</Text>
                    <Text style={styles.factValue}>{fact.value}</Text>
                  </View>
                ))}
              </View>
            )}

            {primaryAction && (
              <Pressable style={styles.primaryButton} onPress={primaryAction.onPress}>
                <Text style={styles.primaryButtonText}>{primaryAction.label}</Text>
              </Pressable>
            )}

            <Pressable style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Schließen</Text>
            </Pressable>
          </ScrollView>
        </SafeAreaView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(2,3,10,0.6)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: '82%',
    backgroundColor: Night.bg2,
    borderTopLeftRadius: Spacing.five,
    borderTopRightRadius: Spacing.five,
    borderColor: Night.border,
    borderWidth: StyleSheet.hairlineWidth,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Night.border,
    marginTop: Spacing.two,
  },
  content: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  illustration: {
    alignItems: 'center',
    marginBottom: Spacing.two,
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
    fontSize: 26,
    fontWeight: '700',
  },
  subtitle: {
    color: Night.textSecondary,
    fontSize: 15,
    marginTop: -Spacing.two,
  },
  description: {
    color: Night.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  factsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  factItem: {
    minWidth: '42%',
    flexGrow: 1,
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
  seenButton: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.five,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Night.border,
    backgroundColor: Night.surface,
  },
  seenButtonActive: {
    backgroundColor: 'rgba(62,214,168,0.16)',
    borderColor: Night.success,
  },
  seenButtonText: {
    color: Night.text,
    fontWeight: '600',
    fontSize: 14,
  },
  seenButtonTextActive: {
    color: Night.success,
  },
  primaryButton: {
    backgroundColor: Night.accent,
    borderRadius: Spacing.five,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: Night.bg0,
    fontWeight: '700',
    fontSize: 15,
  },
  closeButton: {
    alignItems: 'center',
    paddingVertical: Spacing.two,
  },
  closeButtonText: {
    color: Night.textMuted,
    fontSize: 14,
  },
});
