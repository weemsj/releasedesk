function DashboardCard({ label, value }) {
    return (
        <div className="dashboard-card">
            <span className="dashboard-card-label">{label}</span>
            <span className="dashboard-card-separator">: </span>
            <span className="dashboard-card-value">{value}</span>
        </div>
    );
}

export default DashboardCard;
