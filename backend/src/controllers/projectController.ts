import { Request, Response } from 'express';
import Project from '../models/Project.js';

/**
 * Project Controller for citizen views and admin CRUD.
 */

export const getAllProjects = async (req: Request, res: Response) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const getProjectById = async (req: Request, res: Response) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json(project);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

export const createProject = async (req: Request, res: Response) => {
    try {
        const newProject = new Project(req.body);
        await newProject.save();
        res.status(201).json(newProject);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

export const updateProject = async (req: Request, res: Response) => {
    try {
        const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ error: 'Project not found' });
        res.json(updated);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
};

export const deleteProject = async (req: Request, res: Response) => {
    try {
        const deleted = await Project.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Project not found' });
        res.json({ message: 'Project deleted' });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Filter projects by proximity (alternate way if handleLocationUpdate is not used)
 */
export const getNearbyProjects = async (req: Request, res: Response) => {
    try {
        const { lat, lng, radius } = req.query;
        if (!lat || !lng) return res.status(400).json({ error: 'Missing coordinates' });

        const projects = await Project.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [Number(lng), Number(lat)]
                    },
                    $maxDistance: Number(radius) || 5000
                }
            }
        });
        res.json(projects);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
