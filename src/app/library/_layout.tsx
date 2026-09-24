import { Stack, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet } from 'react-native';

import { Night, Spacing } from '@/constants/theme';

export default function LibraryLayout() {
  const router = useRouter();

  // Icon-only back control, matching the platform's normal back-button look —
  // just wired to an explicit router.back() so it reliably returns to the
  // Lexikon list no matter how the surrounding tab bar is set up.
  const backButton = () => (
    <Pressable
      onPress={() => (router.canGoBack() ? router.back() : router.replace('/library'))}
      hitSlop={12}
      style={styles.backButton}>
      <SymbolView
        name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
        size={22}
        tintColor={Night.text}
      />
    </Pressable>
  );

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Night.bg1 },
        headerTintColor: Night.text,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: Night.bg0 },
      }}>
      <Stack.Screen name="index" options={{ title: 'Lexikon' }} />
      <Stack.Screen name="constellation/[id]" options={{ title: '', headerLeft: backButton }} />
      <Stack.Screen name="planet/[id]" options={{ title: '', headerLeft: backButton }} />
      <Stack.Screen name="topic/[id]" options={{ title: '', headerLeft: backButton }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  backButton: {
    paddingVertical: Spacing.one,
    paddingRight: Spacing.three,
  },
});
