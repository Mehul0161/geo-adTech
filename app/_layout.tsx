import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { Colors } from '@/constants/theme';
import { updateLocation } from '@/services/api';
import { requestLocationPermissions, watchLocation } from '@/services/location';
import { registerForPushNotifications, sendLocalNotification } from '@/services/notifications';

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
    let subscription: any;

    async function setupApp() {
      // Setup notifications
      registerForPushNotifications();

      // Request permissions
      const hasPermission = await requestLocationPermissions();
      if (hasPermission) {
        // Start watching location and send to backend
        subscription = await watchLocation(async (location) => {
          const { latitude, longitude } = location.coords;

          // Call backend to check for geofence entry
          const result = await updateLocation('user_123', latitude, longitude);

          // If a new notification was triggered, show it locally
          if (result.triggered && result.message) {
            sendLocalNotification(result.message.title, result.message.body);
          }
        }, 30000); // Check every 30 seconds to save battery
      }
    }

    setupApp();

    return () => {
      if (subscription) subscription.remove();
    };
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
