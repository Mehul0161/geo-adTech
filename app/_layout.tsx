import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { Colors } from '@/constants/theme';
import { requestLocationPermissions } from '@/services/location';
import { registerForPushNotifications } from '@/services/notifications';

// Custom dark theme matching our design
const GeoAdTechTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.primary,
    background: Colors.background,
    card: Colors.surface,
    text: Colors.text,
    border: Colors.border,
    notification: Colors.primary,
  },
};

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  useEffect(() => {
    // Request permissions on app start
    requestLocationPermissions();
    registerForPushNotifications();
  }, []);

  return (
    <ThemeProvider value={GeoAdTechTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="project/[id]"
          options={{
            headerShown: true,
            headerTransparent: true,
            headerTitle: '',
            headerTintColor: Colors.text,
            headerStyle: { backgroundColor: 'transparent' },
          }}
        />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
