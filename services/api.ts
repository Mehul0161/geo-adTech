// ========================================
// GeoAdTech — API Service
// ========================================
import { FeedbackPayload, NotificationItem, Project } from '@/types';

// Replace with your real backend URL
// For Android Emulator to access host PC, use 10.0.2.2 instead of localhost
const API_BASE = 'http://10.0.2.2:5000/api';

/**
 * Real API calls for production.
 * Falls back to simulation during local dev if needed.
 */

export async function getNearbyProjects(
    lat: number,
    lng: number,
    radius: number = 5000
): Promise<Project[]> {
    try {
        const res = await fetch(`${API_BASE}/projects/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
        if (!res.ok) throw new Error('API Error');
        return await res.json();
    } catch (err) {
        console.warn('API Error in getNearbyProjects, falling back to mock');
        return [];
    }
}

export async function getProjectById(id: string): Promise<Project | undefined> {
    try {
        const res = await fetch(`${API_BASE}/projects/${id}`);
        if (!res.ok) throw new Error('API Error');
        return await res.json();
    } catch (err) {
        console.warn(`API Error in getProjectById for ${id}`);
        return undefined;
    }
}

export async function getNotificationHistory(userId: string = 'user_123'): Promise<NotificationItem[]> {
    try {
        const res = await fetch(`${API_BASE}/notifications/${userId}`);
        if (!res.ok) throw new Error('API Error');
        return await res.json();
    } catch (err) {
        console.warn('API Error in getNotificationHistory');
        return [];
    }
}

export async function submitFeedback(payload: FeedbackPayload): Promise<boolean> {
    try {
        const res = await fetch(`${API_BASE}/feedback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        return res.ok;
    } catch (err) {
        console.error('Feedback submission failed');
        return false;
    }
}

export async function updateLocation(
    userId: string = 'user_123',
    lat: number,
    lng: number
): Promise<{
    triggered: boolean;
    project?: Project;
    message?: { title: string; body: string };
}> {
    try {
        const res = await fetch(`${API_BASE}/location/update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, latitude: lat, longitude: lng })
        });
        if (!res.ok) throw new Error('Location update failed');
        return await res.json();
    } catch (err) {
        console.warn('Location update server unreachable');
        return { triggered: false };
    }
}
