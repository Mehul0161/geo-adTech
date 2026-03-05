// ========================================
// GeoAdTech — Notification Service
// ========================================
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export async function registerForPushNotifications(): Promise<string | null> {
    if (!Device.isDevice) {
        console.log('Push notifications require a physical device');
        return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        console.log('Failed to get push notification permission');
        return null;
    }

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'Civic Updates',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#38bdf8',
        });
    }

    try {
        const tokenData = await Notifications.getExpoPushTokenAsync();
        return tokenData.data;
    } catch (e) {
        console.warn('Notification Token Error: Ensure eas.json or app.json has a projectId if not in Expo Go.', e);
        return null;
    }
}

export async function sendLocalNotification(
    title: string,
    body: string,
    data?: Record<string, unknown>
): Promise<void> {
    await Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
            data,
            sound: 'default',
        },
        trigger: null, // Immediate
    });
}

export function addNotificationListener(
    handler: (notification: Notifications.Notification) => void
): Notifications.EventSubscription {
    return Notifications.addNotificationReceivedListener(handler);
}

export function addResponseListener(
    handler: (response: Notifications.NotificationResponse) => void
): Notifications.EventSubscription {
    return Notifications.addNotificationResponseReceivedListener(handler);
}
