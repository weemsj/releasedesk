import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardSummary } from '../api/releaseDeskApi';
import DashboardCard from '../components/DashboardCard';

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
                const summary = await getDashboardSummary();
                setStats(summary);
            } catch (err) {
                console.error('Error fetching dashboard summary:', err);
                setError(err.message);
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
            <div className="dashboard-layout-grid">
                <div className="dashboard-stat-row dashboard-stat-row-two-columns">
                    <Link to="/issues" className="dashboard-link-card">
                        <div className="dashboard-stat-group">
                            <DashboardCard label="Open Issues" value={stats.open_issues} />
                            <DashboardCard label="Critical Issues" value={stats.critical_issues} />
                        </div>
                    </Link>

                    <div className="dashboard-stat-group">
                        <DashboardCard label="QA Ready" value={stats.qa_ready} />
                        <DashboardCard label="Blocked" value={stats.blocked} />
                    </div>
                </div>

                <div className="dashboard-stat-row">
                    <Link to="/releases" className="dashboard-link-card dashboard-stat-group-single-link">
                        <div className="dashboard-stat-group dashboard-stat-group-single">
                            <DashboardCard label="Upcoming Releases" value={stats.upcoming_releases} />
                        </div>
                    </Link>
                </div>

                <Link to="/deployment-logs" className="dashboard-link-card dashboard-row-full-link">
                    <div className="recent-deployments dashboard-row-full">
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
                </Link>
            </div>
        </div>
    );
}

export default Dashboard;