import { Link } from 'react-router-dom';
import DataTable from '../components/dataTable';
import ResourceForm from '../components/ResourceForm';
import useResourceCrud from '../hooks/useResourceCrud';
import BackButton from '../components/BackButton';
import {
    getIssues,
    createIssue,
    updateIssue,
    deleteIssue,
} from '../api/releaseDeskApi';

function Issues() {
    const initialIssueFormData = {
        title: '',
        description: '',
        issue_type: 'bug',
        priority: 'medium',
        status: 'new',
        reported_by: '',
        assigned_to: '',
        environment: 'qa',
    };

    const {
        items: issues,
        formData,
        loading,
        submitting,
        error,
        editingItemId: editingIssueId,
        handleChange,
        resetForm,
        handleEditClick,
        handleDeleteClick,
        handleSubmit,
    } = useResourceCrud({
        initialFormData: initialIssueFormData,
        getItems: getIssues,
        createItem: createIssue,
        updateItem: updateIssue,
        deleteItem: deleteIssue,
        mapItemToForm: (issue) => ({
            title: issue.title || '',
            description: issue.description || '',
            issue_type: issue.issue_type || 'bug',
            priority: issue.priority || 'medium',
            status: issue.status || 'new',
            reported_by: issue.reported_by || '',
            assigned_to: issue.assigned_to || '',
            environment: issue.environment || 'qa',
        }),
        getDeleteMessage: (issue) => (
            `Are you sure you want to delete Issue #${issue.id}: "${issue.title}"?`
        ),
    });

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
        <BackButton />
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