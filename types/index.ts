// ========================================
// GeoAdTech — Type Definitions
// ========================================

export interface Project {
    _id: string;
    name: string;
    description: string;
    shortDescription: string;
    location: {
        type: 'Point';
        coordinates: [number, number]; // [longitude, latitude]
    };
    geofence: {
        type: 'circle' | 'polygon';
        radius: number; // meters
        polygon?: number[][];
    };
    status: 'planned' | 'in-progress' | 'completed';
    category: 'hospital' | 'bridge' | 'college' | 'metro' | 'road' | 'government' | 'other';
    images: string[];
    impactMetrics: {
        beneficiaries: number;
        budget: string;
        completionPercentage: number;
        startDate: string;
        expectedCompletion: string;
    };
    campaign: {
        text: string;
        aiTone?: string;
        language?: string;
    };
    leadership: {
        name: string;
        title: string;
        image?: string;
    };
    rating: number;
    totalRatings: number;
    createdAt: string;
    updatedAt: string;
}

export interface UserLocation {
    latitude: number;
    longitude: number;
    timestamp: number;
}

export interface NotificationItem {
    id: string;
    projectId: string;
    projectName: string;
    title: string;
    body: string;
    category: Project['category'];
    timestamp: string;
    read: boolean;
}

export interface FeedbackPayload {
    projectId: string;
    rating: number;
    comment?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}
