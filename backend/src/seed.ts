import connectDB from './config/db.js';
import Project from './models/Project.js';

const seedProjects = async () => {
    try {
        await connectDB();

        // Remove existing projects
        await Project.deleteMany({});
        console.log('🧹 Existing projects cleared.');

        const projects = [
            {
                name: 'New Delhi Metro Extension — Phase IV',
                description: 'The Delhi Metro Phase IV project covers 65 km of new corridors connecting underserved areas of the city. This initiative will add 45 new stations, significantly reducing commute times and traffic congestion.',
                shortDescription: 'Metro extension covering 65 km with 45 new stations.',
                category: 'metro',
                location: { type: 'Point', coordinates: [77.2090, 28.6139] },
                geofence: { type: 'circle', radius: 500 },
                status: 'in-progress',
                images: [],
                impactMetrics: {
                    beneficiaries: 5000000,
                    budget: '₹24,948 Cr',
                    completionPercentage: 42,
                    startDate: '2022-03-15',
                    expectedCompletion: '2028-06-30',
                },
                campaign: {
                    text: 'Building the future of urban transit — one station at a time.',
                    aiTone: 'inspirational',
                },
                leadership: {
                    name: 'Shri Manoj Joshi',
                    title: 'Secretary, Ministry of Urban Development',
                }
            },
            {
                name: 'Dwarka Expressway — NH-248BB',
                description: 'A 29 km, 14-lane access-controlled expressway connecting Dwarka to Gurugram. Features India\'s first 8-lane elevated highway, multiple interchanges, and a cloverleaf junction.',
                shortDescription: '29 km, 14-lane expressway connecting Dwarka to Gurugram.',
                category: 'road',
                location: { type: 'Point', coordinates: [77.0266, 28.5702] },
                geofence: { type: 'circle', radius: 700 },
                status: 'completed',
                images: [],
                impactMetrics: {
                    beneficiaries: 3000000,
                    budget: '₹9,000 Cr',
                    completionPercentage: 100,
                    startDate: '2019-02-15',
                    expectedCompletion: '2024-03-11',
                },
                campaign: {
                    text: 'Faster commutes, bigger dreams.',
                    aiTone: 'dynamic',
                },
                leadership: {
                    name: 'Shri Nitin Gadkari',
                    title: 'Minister of Road Transport & Highways',
                }
            },
            {
                name: 'Centennial Park Revitalization',
                description: 'A cornerstone of our green initiative, Centennial Park is being transformed into a sustainable urban oasis. The project includes planting 500+ trees, restoring 12 acres of wetland, and creating 45 new local jobs.',
                shortDescription: 'Sustainable urban oasis with 500+ new trees.',
                category: 'other',
                location: { type: 'Point', coordinates: [77.2167, 28.6270] },
                geofence: { type: 'circle', radius: 400 },
                status: 'in-progress',
                images: [],
                impactMetrics: {
                    beneficiaries: 1200000,
                    budget: '₹420 Cr',
                    completionPercentage: 65,
                    startDate: '2023-10-01',
                    expectedCompletion: '2025-05-30',
                },
                campaign: {
                    text: 'Bringing nature back to the city.',
                    aiTone: 'inspirational',
                },
                leadership: {
                    name: 'Sarah Jenkins',
                    title: 'City Council Rep, District 4',
                }
            },
            {
                name: 'AIIMS Trauma Center II',
                description: 'Expansion of the Apex Trauma Center to include 300 additional ICU beds and state-of-the-art robotic surgery suites. This facility will serve as the primary emergency hub for Northern India.',
                shortDescription: '300-bed ICU expansion with robotic surgery suites.',
                category: 'hospital',
                location: { type: 'Point', coordinates: [77.2100, 28.5672] },
                geofence: { type: 'circle', radius: 300 },
                status: 'in-progress',
                images: [],
                impactMetrics: {
                    beneficiaries: 8000000,
                    budget: '₹1,200 Cr',
                    completionPercentage: 82,
                    startDate: '2021-08-15',
                    expectedCompletion: '2025-01-20',
                },
                campaign: {
                    text: 'Your health, our priority.',
                    aiTone: 'empathetic',
                },
                leadership: {
                    name: 'Dr. M. Srinivas',
                    title: 'Director, AIIMS Delhi',
                }
            }
        ];

        await Project.insertMany(projects);
        console.log('🌱 Projects seeded successfully.');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedProjects();
