// ========================================
// GeoAdTech — Location Service
// ========================================
import * as Location from 'expo-location';

export async function requestLocationPermissions(): Promise<boolean> {
    const { status: foreground } = await Location.requestForegroundPermissionsAsync();
    if (foreground !== 'granted') return false;

    const { status: background } = await Location.requestBackgroundPermissionsAsync();
    // Background is optional but preferred
    return foreground === 'granted';
}

export async function getCurrentLocation(): Promise<Location.LocationObject | null> {
    try {
        const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
        });
        return location;
    } catch (error) {
        console.error('Error getting location:', error);
        return null;
    }
}

export function watchLocation(
    callback: (location: Location.LocationObject) => void,
    intervalMs: number = 10000
): Promise<Location.LocationSubscription> {
    return Location.watchPositionAsync(
        {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: intervalMs,
            distanceInterval: 50, // meters
        },
        callback
    );
}

export function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}
