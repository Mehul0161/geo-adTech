import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
    name: string;
    description: string;
    shortDescription: string;
    category: string;
    location: {
        type: string;
        coordinates: number[]; // [lng, lat]
    };
    geofence: {
        type: string; // 'circle' | 'polygon'
        radius: number; // in meters for circle
        polygon?: number[][]; // for polygon
    };
    status: string;
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
    };
    leadership: {
        name: string;
        title: string;
    };
}

const ProjectSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    category: { type: String, required: true },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true } // [longitude, latitude]
    },
    geofence: {
        type: { type: String, enum: ['circle', 'polygon'], required: true },
        radius: { type: Number, required: true },
        polygon: { type: [[Number]] }
    },
    status: { type: String, required: true },
    images: { type: [String], default: [] },
    impactMetrics: {
        beneficiaries: { type: Number },
        budget: { type: String },
        completionPercentage: { type: Number },
        startDate: { type: String },
        expectedCompletion: { type: String }
    },
    campaign: {
        text: { type: String },
        aiTone: { type: String }
    },
    leadership: {
        name: { type: String },
        title: { type: String }
    }
}, { timestamps: true });

// Create 2dsphere index for location
ProjectSchema.index({ location: '2dsphere' });

export default mongoose.model<IProject>('Project', ProjectSchema);
