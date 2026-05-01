import { useEffect, useState } from 'react';
import DataTable from '../components/dataTable';
import ResourceForm from '../components/ResourceForm';
import BackButton from '../components/BackButton';
import useResourceCrud from '../hooks/useResourceCrud';
import {
    getDeploymentLogs,
    getReleases,
    createDeploymentLog,
} from '../api/releaseDeskApi';

function DeploymentLogs() {
    const [releases, setReleases] = useState([]);
    const [releaseError, setReleaseError] = useState(null);

    const initialDeploymentLogFormData = {
        release: '',
        environment: 'qa',
        status: 'started',
        notes: '',
        deployed_by: '',
    };

    const {
        items: logs,
        formData,
        loading,
        submitting,
        error,
        handleChange,
        handleSubmit,
    } = useResourceCrud({
        initialFormData: initialDeploymentLogFormData,
        getItems: getDeploymentLogs,
        createItem: createDeploymentLog,
    });

    useEffect(() => {
        const fetchReleases = async () => {
            try {
                const releasesData = await getReleases();
                setReleases(releasesData);
                setReleaseError(null);
            } catch (err) {
                console.error('Error fetching releases for deployment log dropdown:', err);
                setReleaseError(err.message);
            }
        };

        fetchReleases();
    }, []);

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
            <BackButton />
            <h1>Deployment Logs</h1>

            {error && <p className="error-message">{error}</p>}
            {releaseError && <p className="error-message">{releaseError}</p>}

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