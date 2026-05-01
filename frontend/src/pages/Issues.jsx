import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DataTable from '../components/dataTable';
import ResourceForm from '../components/ResourceForm';
import {
    getIssues,
    createIssue,
    updateIssue,
    deleteIssue,
} from '../api/releaseDeskApi';

function Issues() {
    const [issues, setIssues] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        issue_type: 'bug',
        priority: 'medium',
        status: 'new',
        reported_by: '',
        assigned_to: '',
        environment: 'qa',
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [editingIssueId, setEditingIssueId] = useState(null);

    useEffect(() => {
        // Fetch issues from the backend
        const fetchIssues = async () => {
            try {
                const issuesData = await getIssues();
                setIssues(issuesData);
            } catch (err) {
                console.error('Error fetching issues:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchIssues();
    }, []);

    // Handle form input changes for both creating and editing issues    
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Reset form to initial state and clear editing state
    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            issue_type: 'bug',
            priority: 'medium',
            status: 'new',
            reported_by: '',
            assigned_to: '',
            environment: 'qa',
        });
        setEditingIssueId(null);
    };

    // Handle edit button click - populate form with issue data and set editing state
    const handleEditClick = (issue) => {
        setEditingIssueId(issue.id);
        setFormData({
            title: issue.title,
            description: issue.description,
            issue_type: issue.issue_type,
            priority: issue.priority,
            status: issue.status,
            reported_by: issue.reported_by,
            assigned_to: issue.assigned_to,
            environment: issue.environment,
        });
        setError(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle delete button click - delete issue and update state
    const handleDeleteClick = async (issue) => {
        const confirmed = window.confirm(`Are you sure you want to delete issue #${issue.id}?`);
        if (!confirmed) return;
        
        try {
            await deleteIssue(issue.id);
            setIssues((prevIssues) => prevIssues.filter((currentIssue) => currentIssue.id !== issue.id));

            if (editingIssueId === issue.id) {
                resetForm();
            }
            setError(null);
        } catch (err) {
            console.error('Error deleting issue:', err);
            setError(err.message);
        }
    };
    
    // Handle form submission for both creating new issues and updating existing ones
    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);

        try {
            if (editingIssueId) {
                const updatedIssue = await updateIssue(editingIssueId, formData);
                setIssues((prevIssues) => (
                    prevIssues.map((issue) => (
                        issue.id === editingIssueId ? updatedIssue : issue
                    ))
                ));
            } else {
                const newIssue = await createIssue(formData);
                setIssues((prevIssues) => [...prevIssues, newIssue]);
            }

            resetForm();
            setError(null);
        } catch (err) {
            console.error('Error saving issue:', err);
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const issueColumns = [
        { key: 'id', header: 'ID' },
        { key: 'title', header: 'Title' },
        { key: 'issue_type', header: 'Type' },
        { key: 'priority', header: 'Priority' },
        { key: 'status', header: 'Status' },
        { key: 'environment', header: 'Environment' },
        {
            key: 'actions',
            header: 'Actions',
            render: (issue) => (
                <>
                    <Link to={`/issues/${issue.id}`}>View</Link>
                    {' | '}
                    <button type="button" onClick={() => handleEditClick(issue)}>Edit</button>
                    {' | '}
                    <button type="button" onClick={() => handleDeleteClick(issue)}>Delete</button>
                </>
            ),
        },
    ];

    const issueFields = [
        {
            name: 'title',
            label: 'Title',
            type: 'text',
            required: true,
        },
        {
            name: 'issue_type',
            label: 'Issue Type',
            type: 'select',
            options: [
                { value: 'bug', label: 'Bug' },
                { value: 'feature', label: 'Feature' },
                { value: 'support', label: 'Support' },
            ],
        },
        {
            name: 'priority',
            label: 'Priority',
            type: 'select',
            options: [
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
                { value: 'critical', label: 'Critical' },
            ],
        },
        {
            name: 'status',
            label: 'Status',
            type: 'select',
            options: [
                { value: 'new', label: 'New' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'qa_ready', label: 'QA Ready' },
                { value: 'validated', label: 'Validated' },
                { value: 'released', label: 'Released' },
                { value: 'blocked', label: 'Blocked' },
            ],
        },
        {
            name: 'reported_by',
            label: 'Reported By',
            type: 'text',
            required: true,
        },
        {
            name: 'assigned_to',
            label: 'Assigned To',
            type: 'text',
        },
        {
            name: 'environment',
            label: 'Environment',
            type: 'select',
            options: [
                { value: 'dev', label: 'Dev' },
                { value: 'qa', label: 'QA' },
                { value: 'prod_test', label: 'Prod Test' },
                { value: 'production', label: 'Production' },
            ],
        },
        {
            name: 'description',
            label: 'Description',
            type: 'textarea',
            required: true,
            fullWidth: true,
        },
    ];

    if (loading) {
        return <p>Loading issues...</p>;
    }

    return (
        <div className="issues-page">
            <h1>Issues</h1>

            {error && <p className="error-message">{error}</p>}

            <ResourceForm
                title={editingIssueId ? 'Edit Issue' : 'Create Issue'}
                fields={issueFields}
                formData={formData}
                onChange={handleChange}
                onSubmit={handleSubmit}
                submitting={submitting}
                submitLabel={editingIssueId ? 'Update Issue' : 'Create Issue'}
                submittingLabel={editingIssueId ? 'Updating...' : 'Creating...'}
                showCancel={Boolean(editingIssueId)}
                onCancel={resetForm}
                cancelLabel="Cancel Edit"
                className="create-issue-form"
            />

            <section className="issues-list-section">
                <h2>Issue List</h2>

                <DataTable
                    columns={issueColumns}
                    data={issues}
                    emptyMessage="No issues found."
                />
            </section>
        </div>
    );
}

export default Issues;