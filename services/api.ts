// ========================================
// GeoAdTech — API Service (Full)
// ========================================
import { FeedbackPayload, NotificationItem, Project } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Use your computer's local IP address so physical phones on the same Wi-Fi can connect.
// To find your IP, run 'ipconfig' in terminal and look for IPv4 Address.
const LOCAL_IP = '192.168.1.19';

const getApiBase = () => {
    if (Platform.OS === 'android') {
        // If on emulator, 10.0.2.2 points to host. 
        // But the local IP usually works too if the firewall allows it.
        return `http://${LOCAL_IP}:5000/api`;
    }
    return `http://${LOCAL_IP}:5000/api`;
};

const API_BASE = getApiBase();

// ──────────────────────────────────────────
// AUTH TOKEN HELPERS
// ──────────────────────────────────────────
export const getToken = async (): Promise<string | null> => {
    return AsyncStorage.getItem('geo_token');
};

export const setToken = async (token: string): Promise<void> => {
    await AsyncStorage.setItem('geo_token', token);
};

export const clearToken = async (): Promise<void> => {
    await AsyncStorage.removeItem('geo_token');
    await AsyncStorage.removeItem('geo_user');
};

const authHeaders = async () => {
    const token = await getToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

// Helper for timeout to prevent app hanging on bad network
async function fetchWithTimeout(url: string, options: any, timeout = 8000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(id);
        return response;
    } catch (e) {
        clearTimeout(id);
        throw e;
    }
}

// ──────────────────────────────────────────
// AUTH APIs
// ──────────────────────────────────────────
export async function registerUser(data: { name: string; email: string; password: string; phone?: string; city?: string }) {
    try {
        const res = await fetchWithTimeout(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return res.json();
    } catch (e) {
        return { success: false, message: 'Connection timed out' };
    }
}

export async function loginUser(email: string, password: string) {
    try {
        const res = await fetchWithTimeout(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        return res.json();
    } catch (e) {
        return { success: false, message: 'Connection timed out' };
    }
}

export async function fetchMe() {
    try {
        const headers = await authHeaders();
        const res = await fetchWithTimeout(`${API_BASE}/auth/me`, { headers });
        return res.json();
    } catch (err) {
        console.warn('API: fetchMe failed or timed out');
        return { success: false, message: 'Network error or timeout' };
    }
}

export async function updateProfileAPI(data: { name: string; phone?: string; city?: string }) {
    try {
        const headers = await authHeaders();
        const res = await fetchWithTimeout(`${API_BASE}/auth/profile`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(data),
        });
        return res.json();
    } catch (e) { return { success: false }; }
}

export async function incrementStatAPI(stat: 'sitesTracked' | 'feedbackGiven' | 'zonesEntered') {
    try {
        const headers = await authHeaders();
        const res = await fetchWithTimeout(`${API_BASE}/auth/stats`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ stat }),
        });
        return res.json();
    } catch (e) { return { success: false }; }
}

// ──────────────────────────────────────────
// PROJECT APIs
// ──────────────────────────────────────────
export async function getNearbyProjects(lat: number, lng: number, radius: number = 5000): Promise<Project[]> {
    try {
        const res = await fetchWithTimeout(`${API_BASE}/projects/nearby?lat=${lat}&lng=${lng}&radius=${radius}`, {});
        return await res.json();
    } catch (err) {
        console.warn('API Error in getNearbyProjects, falling back to mock');
        return [];
    }
}

export async function getAllProjectsAPI(): Promise<Project[]> {
    try {
        const res = await fetchWithTimeout(`${API_BASE}/projects`, {});
        return await res.json();
    } catch {
        return [];
    }
}

export async function getProjectById(id: string): Promise<Project | undefined> {
    try {
        const res = await fetchWithTimeout(`${API_BASE}/projects/${id}`, {});
        return await res.json();
    } catch (err) {
        console.warn(`API Error in getProjectById for ${id}`);
        return undefined;
    }
}

// ──────────────────────────────────────────
// NOTIFICATION APIs
// ──────────────────────────────────────────
export async function getNotificationHistory(userId: string = 'user_123'): Promise<NotificationItem[]> {
    try {
        const res = await fetchWithTimeout(`${API_BASE}/notifications/${userId}`, {});
        return await res.json();
    } catch (err) {
        console.warn('API Error in getNotificationHistory');
        return [];
    }
}

// ──────────────────────────────────────────
// FEEDBACK APIs
// ──────────────────────────────────────────
export async function submitFeedback(payload: FeedbackPayload): Promise<boolean> {
    try {
        const headers = await authHeaders();
        const res = await fetchWithTimeout(`${API_BASE}/feedback`, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload),
        });
        if (res.ok) await incrementStatAPI('feedbackGiven');
        return res.ok;
    } catch (err) {
        console.error('Feedback submission failed');
        return false;
    }
}

// ──────────────────────────────────────────
// REPORT APIs
// ──────────────────────────────────────────
export async function submitReport(payload: {
    userId: string;
    issueType: string;
    severity: string;
    description: string;
    location?: string;
    lat?: number;
    lng?: number;
}): Promise<{ success: boolean; referenceId?: string }> {
    try {
        const headers = await authHeaders();
        const res = await fetchWithTimeout(`${API_BASE}/reports`, {
            method: 'POST',
            headers,
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        return { success: res.ok, referenceId: data?.data?._id?.toString().slice(-6).toUpperCase() };
    } catch {
        return { success: false };
    }
}

export async function getActivityFeed(): Promise<any[]> {
    try {
        const res = await fetchWithTimeout(`${API_BASE}/activity`, {});
        const data = await res.json();
        return data.success ? data.data : [];
    } catch {
        return [];
    }
}

// ──────────────────────────────────────────
// LOCATION APIs
// ──────────────────────────────────────────
export async function updateLocation(userId: string = 'user_123', lat: number, lng: number): Promise<{
    triggered: boolean;
    project?: Project;
    message?: { title: string; body: string };
}> {
    try {
        const res = await fetchWithTimeout(`${API_BASE}/location/update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, latitude: lat, longitude: lng }),
        });
        if (!res.ok) throw new Error('Location update failed');
        return await res.json();
    } catch (err) {
        console.warn('Location update server unreachable');
        return { triggered: false };
    }
}
