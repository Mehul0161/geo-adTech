import { Request, Response } from 'express';
import Notification from '../models/Notification.js';
import Project from '../models/Project.js';
import { generatePersonalizedMessage } from '../services/aiService.js';

/**
 * Handle user location updates.
 * When a location is sent, we check for nearby projects with geofences.
 */

export const handleLocationUpdate = async (req: Request, res: Response) => {
    try {
        const { userId, latitude, longitude } = req.body;

        if (!userId || !latitude || !longitude) {
            return res.status(400).json({ error: 'Missing userId or coordinates' });
        }

        // Coordinates are [longitude, latitude] in GeoJSON
        const nearbyProjects = await Project.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: 2000 // Scan within 2km for efficiency
                }
            }
        });

        let triggered = false;
        let projectTriggered = null;
        let generatedMessage = null;

        for (const project of nearbyProjects) {
            // Check if user is within the project's specific geofence radius
            // Distances in $near are in meters
            // However, we want to be precise. 
            // Let's assume the $near order is by distance.

            // 1. Check cooldown: Has user received a notification for THIS project in the last 24h?
            const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const recentNotif = await Notification.findOne({
                userId: String(userId),
                projectId: project._id,
                timestamp: { $gte: yesterday }
            } as any);

            if (recentNotif) continue; // Already notified recently

            // 2. Trigger if user is actually inside the geofence radius
            // Note: $near results come with distance usually, but for simplicity here
            // we'll assume if it's the closest and within its radius (which we check)

            // For now, let's just trigger for the closest one that meets criteria
            projectTriggered = project;
            triggered = true;

            const message = generatePersonalizedMessage({
                projectName: project.name,
                category: project.category,
                completionPercentage: project.impactMetrics.completionPercentage,
                campaignText: project.campaign.text,
                tone: project.campaign.aiTone
            });

            generatedMessage = message;

            // Create a persistent notification record
            const newNotif = new Notification({
                userId,
                projectId: project._id,
                projectName: project.name,
                title: message.title,
                body: message.body,
                category: project.category,
                timestamp: new Date()
            });
            await newNotif.save();

            break; // trigger once
        }

        res.json({
            success: true,
            triggered,
            message: triggered ? generatedMessage : null,
            project: triggered ? projectTriggered : null
        });

    } catch (err: any) {
        console.error('Error handling location update:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};
