import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/db.js';
import { handleLocationUpdate } from './controllers/locationController.js';
import {
    createProject,
    deleteProject,
    getAllProjects,
    getNearbyProjects,
    getProjectById,
    updateProject
} from './controllers/projectController.js';
import Feedback from './models/Feedback.js';
import Notification from './models/Notification.js';
import Project from './models/Project.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Base Route
app.get('/', (req, res) => {
    res.send('🏠 GeoAdTech API Status: Running Phase II');
});

/**
 * Project Routes
 */
app.get('/api/projects', getAllProjects);
app.get('/api/projects/nearby', getNearbyProjects);
app.get('/api/projects/:id', getProjectById);
app.post('/api/projects', createProject);
app.put('/api/projects/:id', updateProject);
app.delete('/api/projects/:id', deleteProject);

/**
 * Location Interaction Routes (Trigger Engine)
 */
app.post('/api/location/update', handleLocationUpdate);

/**
 * Notification History Routes
 */
app.get('/api/notifications/:userId', async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.params.userId }).sort({ timestamp: -1 });
        res.json(notifications);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Admin Stats Route
 */
app.get('/api/stats', async (req, res) => {
    try {
        const totalProjects = await Project.countDocuments();
        const totalNotifications = await Notification.countDocuments();

        // Dynamic status distribution
        const statusDistribution = await Project.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        // Dynamic category distribution
        const categoryDistribution = await Project.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);

        // Average sentiment from real feedback
        const feedbackStats = await Feedback.aggregate([
            { $group: { _id: null, avgRating: { $avg: "$rating" }, total: { $sum: 1 } } }
        ]);

        res.json({
            success: true,
            data: {
                totalProjects,
                totalNotifications,
                statusDistribution,
                categoryDistribution,
                sentimentScore: feedbackStats[0]?.avgRating || 4.5,
                totalFeedback: feedbackStats[0]?.total || 0,
                beneficiaries: totalProjects * 15000 + (totalNotifications * 5)
            }
        });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * Feedback Routes
 */
app.post('/api/feedback', async (req, res) => {
    try {
        const feedback = new Feedback(req.body);
        await feedback.save();
        res.status(201).json({ success: true, data: feedback });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/api/feedback', async (req, res) => {
    try {
        const feedbacks = await Feedback.find()
            .populate('projectId', 'name')
            .sort({ timestamp: -1 })
            .limit(20);
        res.json({ success: true, data: feedbacks });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
