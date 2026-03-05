import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { updateLocation } from '@/services/api';
import { requestLocationPermissions, watchLocation } from '@/services/location';
import { sendLocalNotification } from '@/services/notifications';

const GeoAdTechTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.primary,
    background: Colors.background,
    card: Colors.white,
    text: Colors.text,
    border: Colors.border,
    notification: Colors.primary,
  },
};

// Inner layout that has access to AuthContext
function AppLayout() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // Memoize path info to prevent re-triggering redirect logic on every segment array change
  const currentSegments = useMemo(() => segments.join('/'), [segments]);

  // Navigation Logic
  useEffect(() => {
    if (loading) return;

    const isAuthPath = segments[0] === 'auth';

    if (!user && !isAuthPath) {
      console.log('🛡️ Auth Status: Unverified. Routing to Gateway...');
      router.replace('/auth');
    } else if (user && isAuthPath) {
      console.log('🛡️ Auth Status: Verified. Routing to Command Hub...');
      router.replace('/');
    }
  }, [user, loading, currentSegments]);

  // App initialization (location tracking, etc)
  useEffect(() => {
    if (!user || loading) return;
    let subscription: any;

    async function setupApp() {
      try {
        console.log('📡 Civic Engine: Initializing Secure Node...');
        // registerForPushNotifications(); // Standby

        const hasPermission = await requestLocationPermissions();
        if (hasPermission) {
          subscription = await watchLocation(async (location) => {
            if (!user) return;
            const { latitude, longitude } = location.coords;
            const res = await updateLocation(user._id, latitude, longitude);
            if (res.triggered && res.message) {
              sendLocalNotification(res.message.title, res.message.body);
            }
          }, 120000); // Efficient 2-minute sync
          console.log('🟢 Nodal Sync: Established');
        }
      } catch (err) {
        console.warn('🟡 Civic Engine: Partial initialization');
      }
    }

    setupApp();
    return () => {
      if (subscription) {
        console.log('🔴 Nodal Sync: Terminated');
        subscription.remove();
      }
    };
  }, [user, loading]);

  // Show splash while restoring session
  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.white} />
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
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
      <Stack.Screen name="auth" />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    console.log('🚀 App Mounting...');
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ThemeProvider value={GeoAdTechTheme}>
          <AppLayout />
          <StatusBar style="auto" />
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
