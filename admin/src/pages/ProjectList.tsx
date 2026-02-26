import {
    Calendar,
    Edit2,
    ExternalLink,
    MapPin,
    Plus,
    Search,
    Trash2
} from 'lucide-react';
import React, { useState } from 'react';

const ProjectList: React.FC = () => {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    React.useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/projects');
                const data = await response.json();
                setProjects(data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    if (loading) return <div className="animate-fade-in"><h1>Loading projects...</h1></div>;

    const filteredProjects = projects.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-fade-in">
            <header className="header">
                <div>
                    <h1>Project Management</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage development sites and geo-campaigns</p>
                </div>
                <button className="btn btn-primary">
                    <Plus size={18} />
                    Create New Project
                </button>
            </header>

            <div className="stat-card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Search size={18} style={{ position: 'absolute', left: '1rem', color: 'var(--text-muted)' }} />
                    <input
                        type="text"
                        placeholder="Search projects by name, category, or location..."
                        className="form-input"
                        style={{ paddingLeft: '3rem' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="data-table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Project Name</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Budget</th>
                            <th>Progress</th>
                            <th>Last Updated</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProjects.map((project) => (
                            <tr key={project._id}>
                                <td>
                                    <div style={{ fontWeight: 600 }}>{project.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <MapPin size={10} />
                                        {project.location.coordinates[1].toFixed(4)}, {project.location.coordinates[0].toFixed(4)}
                                    </div>
                                </td>
                                <td>
                                    <span className="badge badge-info">{project.category}</span>
                                </td>
                                <td>
                                    <span className={`badge ${project.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                                        {project.status.toUpperCase()}
                                    </span>
                                </td>
                                <td style={{ fontWeight: 500 }}>{project.impactMetrics?.budget || 'N/A'}</td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ flex: 1, height: '6px', backgroundColor: 'var(--background)', borderRadius: '3px', overflow: 'hidden' }}>
                                            <div style={{ width: `${project.impactMetrics?.completionPercentage || 0}%`, height: '100%', backgroundColor: 'var(--primary)' }}></div>
                                        </div>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{project.impactMetrics?.completionPercentage || 0}%</span>
                                    </div>
                                </td>
                                <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Calendar size={14} />
                                        {new Date(project.updatedAt).toLocaleDateString()}
                                    </div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button className="btn btn-secondary" style={{ padding: '0.5rem' }} title="Edit">
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="btn btn-secondary" style={{ padding: '0.5rem' }} title="View Map">
                                            <ExternalLink size={16} />
                                        </button>
                                        <button className="btn btn-secondary" style={{ padding: '0.5rem', color: 'var(--error)' }} title="Delete">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProjectList;
