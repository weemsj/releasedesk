import { useEffect, useState } from 'react';
import DataTable from '../components/dataTable';
import ResourceForm from '../components/ResourceForm';
import {
    getDeploymentLogs,
    getReleases,
    createDeploymentLog,
} from '../api/releaseDeskApi';

function DeploymentLogs() {
    const [logs, setLogs] = useState([]);
    const [releases, setReleases] = useState([]);
    const [formData, setFormData] = useState({
        release: '',
        environment: 'qa',
        status: 'started',
        notes: '',
        deployed_by: '',
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPageData = async () => {
            try {
                const [logsData, releasesData] = await Promise.all([
                    getDeploymentLogs(),
                    getReleases(),
                ]);

                setLogs(logsData);
                setReleases(releasesData);
            } catch (err) {
                console.error('Error fetching deployment log page data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPageData();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setFormData({
            release: '',
            environment: 'qa',
            status: 'started',
            notes: '',
            deployed_by: '',
        });
    };

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) {
            return 'N/A';
        }

        return new Intl.DateTimeFormat('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(new Date(dateTimeString));
    };

    const getReleaseName = (releaseId) => {
        const matchingRelease = releases.find((release) => String(release.id) === String(releaseId));
        return matchingRelease ? matchingRelease.name : `Release #${releaseId}`;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);

        try {
            const newDeploymentLog = await createDeploymentLog(formData);
            setLogs((prevLogs) => [...prevLogs, newDeploymentLog]);
            resetForm();
            setError(null);
        } catch (err) {
            console.error('Error creating deployment log:', err);
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const deploymentLogColumns = [
        { key: 'id', header: 'ID' },
        { key: 'release', header: 'Release' },
        { key: 'environment', header: 'Environment' },
        { key: 'status', header: 'Status' },
        { key: 'deployed_by', header: 'Deployed By' },
        { key: 'notes', header: 'Notes' },
        { key: 'created_at', header: 'Created At' },
    ];

    const deploymentLogFields = [
        {
            name: 'release',
            label: 'Release',
            type: 'select',
            required: true,
            options: [
                { value: '', label: 'Select a release' },
                ...releases.map((release) => ({
                    value: release.id,
                    label: release.name,
                })),
            ],
        },
        {
            name: 'environment',
            label: 'Environment',
            type: 'select',
            options: [
                { value: 'qa', label: 'QA' },
                { value: 'prod_test', label: 'Prod Test' },
                { value: 'production', label: 'Production' },
            ],
        },
        {
            name: 'status',
            label: 'Status',
            type: 'select',
            options: [
                { value: 'started', label: 'Started' },
                { value: 'successful', label: 'Successful' },
                { value: 'failed', label: 'Failed' },
            ],
        },
        {
            name: 'deployed_by',
            label: 'Deployed By',
            type: 'text',
            required: true,
        },
        {
            name: 'notes',
            label: 'Notes',
            type: 'textarea',
            required: true,
            fullWidth: true,
        },
    ];

    if (loading) {
        return <div>Loading deployment logs...</div>;
    }

    return (
        <div className="deployment-logs">
            <h1>Deployment Logs</h1>

            {error && <p className="error-message">{error}</p>}

            <ResourceForm
                title="Create Deployment Log"
                fields={deploymentLogFields}
                formData={formData}
                onChange={handleChange}
                onSubmit={handleSubmit}
                submitting={submitting}
                submitLabel="Create Deployment Log"
                submittingLabel="Creating..."
                className="deployment-log-form"
            />

            <section className="deployment-log-list-section">
                <h2>Deployment Log List</h2>

                <DataTable
                    columns={deploymentLogColumns}
                    data={logs.map((log) => ({
                        ...log,
                        release: getReleaseName(log.release),
                        created_at: formatDateTime(log.created_at),
                    }))}
                    emptyMessage="No deployment logs found."
                />
            </section>
        </div>
    );
}

export default DeploymentLogs;