import {
    ArcElement,
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from 'chart.js';
import {
    Activity,
    ArrowUpRight,
    MapPin,
    TrendingUp,
    Users
} from 'lucide-react';
import React from 'react';
import { Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ArcElement
);

const Dashboard: React.FC = () => {
    const [stats, setStats] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/stats');
                const json = await response.json();
                if (json.success) {
                    setStats(json.data);
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading || !stats) return <div className="animate-fade-in"><h1>Loading operational metrics...</h1></div>;

    const lineData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Engagement Entries',
            data: [120, 190, 300, 500, 200, 300],
            borderColor: '#38bdf8',
            backgroundColor: 'rgba(56, 189, 248, 0.1)',
            fill: true,
            tension: 0.4
        }]
    };

    const statusCounts = stats.statusDistribution.reduce((acc: any, curr: any) => {
        acc[curr._id] = curr.count;
        return acc;
    }, { 'completed': 0, 'in-progress': 0, 'planned': 0 });

    const doughnutData = {
        labels: ['Completed', 'In Progress', 'Planned'],
        datasets: [{
            data: [statusCounts['completed'], statusCounts['in-progress'], statusCounts['planned']],
            backgroundColor: ['#22c55e', '#38bdf8', '#f59e0b'],
            borderWidth: 0
        }]
    };

    return (
        <div className="animate-fade-in">
            <header className="header">
                <div>
                    <h1>Operations Overview</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Geo-fencing and AI campaign metrics</p>
                </div>
                <button className="btn btn-primary">
                    Generate Report
                    <ArrowUpRight size={16} />
                </button>
            </header>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <span>Total Beneficiaries</span>
                        <Users size={18} />
                    </div>
                    <div className="stat-value">{stats.beneficiaries.toLocaleString()}</div>
                    <div className="stat-trend trend-up">
                        <ArrowUpRight size={14} />
                        <span>+12.5%</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <span>Active Projects</span>
                        <MapPin size={18} />
                    </div>
                    <div className="stat-value">{stats.totalProjects}</div>
                    <div className="stat-trend trend-up">
                        <ArrowUpRight size={14} />
                        <span>Live</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <span>Notifications Sent</span>
                        <Activity size={18} />
                    </div>
                    <div className="stat-value">{stats.totalNotifications.toLocaleString()}</div>
                    <div className="stat-trend trend-up">
                        <ArrowUpRight size={14} />
                        <span>+8.2%</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <span>Sentiment Score</span>
                        <TrendingUp size={18} />
                    </div>
                    <div className="stat-value">{Number(stats.sentimentScore).toFixed(1)}/5.0</div>
                    <div className="stat-trend trend-up">
                        <ArrowUpRight size={14} />
                        <span>{stats.totalFeedback} Feedbacks</span>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginTop: '2.5rem' }}>
                <div className="stat-card" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Geofence Engagement Traffic</h3>
                    <div style={{ height: '300px' }}>
                        <Line
                            data={lineData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    y: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } },
                                    x: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } }
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="stat-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Project Distribution</h3>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Doughnut data={doughnutData} options={{ cutout: '76%' }} />
                    </div>
                    <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#22c55e' }} /> Completed</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#38bdf8' }} /> Active</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#f59e0b' }} /> Planned</div>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '2.5rem' }}>
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Activity size={20} color="var(--primary)" />
                    Recent Citizen Interactions
                </h3>
                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Project</th>
                                <th>Type</th>
                                <th>Rating</th>
                                <th>Comment</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* In a real app, this would be fetched from /api/feedback or /api/recent */}
                            <tr>
                                <td>Anonymous</td>
                                <td>New Delhi Metro Phase IV</td>
                                <td><span className="badge badge-success">FEEDBACK</span></td>
                                <td style={{ color: '#f59e0b' }}>★★★★★</td>
                                <td>Great progress on the station!</td>
                                <td style={{ color: 'var(--text-muted)' }}>12 mins ago</td>
                            </tr>
                            <tr>
                                <td>User_492</td>
                                <td>Dwarka Expressway</td>
                                <td><span className="badge badge-info">GEOFENCE</span></td>
                                <td style={{ color: 'var(--text-muted)' }}>-</td>
                                <td>Triggered geofence at Sector 21</td>
                                <td style={{ color: 'var(--text-muted)' }}>45 mins ago</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
