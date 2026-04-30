import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';


function Dashboard() {
    const [stats, setStats] = useState({
                open_issues: 0,
        critical_issues: 0,
        qa_ready: 0,
        blocked: 0,
        upcoming_releases: 0,
        recent_deployments: [],
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        // Fetch dashboard stats from the backend
        const fetchStats = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/dashboard-summary/`);
                setStats(response.data);
            } catch (err) {
                console.error('Error fetching dashboard summary:', err);
                setError('Unable to load dashboard summary. Make sure the Django backend is running.');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return <div>Loading dashboard...</div>;
    }
    if (error) {
        return <div>{error}</div>;
    }
    
    return (
        <div className="dashboard">
            <h1>ReleaseDesk Dashboard</h1>
            <div className="stats">
                <div className="stat-card">
                    <h2>Open Issues</h2>
                    <p>{stats.open_issues}</p>
                </div>
                <div className="stat-card">
                    <h2>Critical Issues</h2>
                    <p>{stats.critical_issues}</p>
                </div>
                <div className="stat-card">
                    <h2>QA Ready</h2>
                    <p>{stats.qa_ready}</p>
                </div>
                <div className="stat-card">
                    <h2>Blocked</h2>
                    <p>{stats.blocked}</p>
                </div>
                    <div className="stat-card">
                    <h2>Upcoming Releases</h2>
                    <p>{stats.upcoming_releases}</p>
                </div>
            </div>

            <div className="recent-deployments">
                <h2>Recent Deployments</h2>
                {stats.recent_deployments.length === 0 ? (
                    <p>No recent deployments found.</p>
                ) : (
                    <ul>
                        {stats.recent_deployments.map((deployment) => (
                            <li key={deployment.id}>
                                {deployment.release__name} - {deployment.environment} - {deployment.status}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default Dashboard;