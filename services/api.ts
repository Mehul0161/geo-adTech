// ========================================
// GeoAdTech — API Service (Mock for MVP)
// ========================================
import { MOCK_NOTIFICATIONS, MOCK_PROJECTS } from '@/constants/mockData';
import { FeedbackPayload, NotificationItem, Project } from '@/types';

// const API_BASE = 'https://your-backend.onrender.com/api';

/**
 * For MVP, all API calls return mock data.
 * Replace with real fetch() calls when backend is ready.
 */

export async function getNearbyProjects(
    lat: number,
    lng: number,
    radius: number = 5000
): Promise<Project[]> {
    // TODO: Replace with real API call
    // const res = await fetch(`${API_BASE}/projects/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
    await simulateDelay();
    return MOCK_PROJECTS;
}

export async function getProjectById(id: string): Promise<Project | undefined> {
    await simulateDelay();
    return MOCK_PROJECTS.find((p) => p._id === id);
}

export async function getNotificationHistory(): Promise<NotificationItem[]> {
    await simulateDelay();
    return MOCK_NOTIFICATIONS;
}

export async function submitFeedback(payload: FeedbackPayload): Promise<boolean> {
    await simulateDelay();
    console.log('Feedback submitted:', payload);
    return true;
}

export async function updateLocation(lat: number, lng: number): Promise<{
    triggered: boolean;
    project?: Project;
}> {
    // TODO: Replace with real geo-fence check API
    await simulateDelay();
    return { triggered: false };
}

function simulateDelay(ms: number = 300): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
