import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colors, fontAssets } from '@/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts(fontAssets);
  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);
  if (!loaded && !error) return null;

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {/* On the web the prototype is shown as a phone-width column. */}
      <View style={{ flex: 1, backgroundColor: Platform.OS === 'web' ? '#E3EAF3' : colors.bg }}>
        <View style={{ flex: 1, width: '100%', maxWidth: 440, alignSelf: 'center', backgroundColor: colors.bg, overflow: 'hidden' }}>
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }} />
        </View>
      </View>
    </SafeAreaProvider>
  );
}
