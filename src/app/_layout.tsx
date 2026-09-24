import { DarkTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { SeenStoreProvider } from '@/store/seen-store';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={DarkTheme}>
        <SeenStoreProvider>
          <AnimatedSplashOverlay />
          <AppTabs />
        </SeenStoreProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
