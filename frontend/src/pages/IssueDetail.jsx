import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';   
import { getIssue } from '../api/releaseDeskApi';
import BackButton from '../components/BackButton';

function IssueDetail() {
    const { id } = useParams(); // Get issue ID from URL parameters
    const [issue, setIssue] = useState({
        id: null,
        title: '',
        description: '',
        issue_type: '',
        priority: '',
        status: '',
        reported_by: '',
        assigned_to: '',
        environment: '',
        created_at: '',
        updated_at: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    
    useEffect(() => {
        // Fetch issue details from the backend
        const fetchIssue = async () => {
            try {
                const issueData = await getIssue(id);
                setIssue(issueData);
            } catch (err) {
                console.error('Error fetching issue details:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchIssue();
    }, [id]); // Re-run effect if issueId changes
    
    if (loading) {
        return <div>Loading issue details...</div>;
    }
    if (error) {
        return <div>{error}</div>;
    }
    return (
        <div className="issue-detail">
            <BackButton label="Back to Issues" className="back-button" />
            <h1>Issue Detail</h1>
            <h2>{issue.title}</h2>
            <p><strong>Description:</strong> {issue.description}</p>
            <p><strong>Type:</strong> {issue.issue_type}</p>
            <p><strong>Priority:</strong> {issue.priority}</p>
            <p><strong>Status:</strong> {issue.status}</p>
            <p><strong>Reported By:</strong> {issue.reported_by}</p>
            <p><strong>Assigned To:</strong> {issue.assigned_to}</p>
            <p><strong>Environment:</strong> {issue.environment}</p>
            <p><strong>Created At:</strong> {issue.created_at}</p>
            <p><strong>Updated At:</strong> {issue.updated_at}</p>
        </div>
    );
}

export default IssueDetail;