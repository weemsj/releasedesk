import { useEffect, useState } from 'react';
import DataTable from '../components/dataTable';
import ResourceForm from '../components/ResourceForm';
import {
    getReleases,
    createRelease,
    updateRelease,
} from '../api/releaseDeskApi';

function Release() {
    const [releases, setReleases] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        release_date: '',
        status: 'planned',
        summary: '',
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [editingReleaseId, setEditingReleaseId] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReleases = async () => {
            try {
                const releasesData = await getReleases();
                setReleases(releasesData);
            } catch (err) {
                console.error('Error fetching releases:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReleases();
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
            name: '',
            release_date: '',
            status: 'planned',
            summary: '',
        });
        setEditingReleaseId(null);
    };

    const handleEditClick = (release) => {
        setEditingReleaseId(release.id);
        setFormData({
            name: release.name || '',
            release_date: release.release_date || '',
            status: release.status || 'planned',
            summary: release.summary || '',
        });
        setError(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);

        try {
            if (editingReleaseId) {
                const updatedRelease = await updateRelease(editingReleaseId, formData);

                setReleases((prevReleases) => (
                    prevReleases.map((release) => (
                        release.id === editingReleaseId ? updatedRelease : release
                    ))
                ));
            } else {
                const newRelease = await createRelease(formData);
                setReleases((prevReleases) => [...prevReleases, newRelease]);
            }

            resetForm();
            setError(null);
        } catch (err) {
            console.error('Error saving release:', err);
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const releaseColumns = [
        { key: 'id', header: 'ID' },
        { key: 'name', header: 'Name' },
        { key: 'release_date', header: 'Release Date' },
        { key: 'status', header: 'Status' },
        { key: 'summary', header: 'Summary' },
        {
            key: 'actions',
            header: 'Actions',
            render: (release) => (
                <>
                <button type="button" onClick={() => handleEditClick(release)}>
                    Edit
                </button>
                </>
            ),
        },
    ];

    const releaseFields = [
        {
            name: 'name',
            label: 'Name',
            type: 'text',
            required: true,
        },
        {
            name: 'release_date',
            label: 'Release Date',
            type: 'date',
            required: true,
        },
        {
            name: 'status',
            label: 'Status',
            type: 'select',
            options: [
                { value: 'planned', label: 'Planned' },
                { value: 'qa_testing', label: 'QA Testing' },
                { value: 'prod_test', label: 'Prod Test' },
                { value: 'deployed', label: 'Deployed' },
                { value: 'rollback_needed', label: 'Rollback Needed' },
            ],
        },
        {
            name: 'summary',
            label: 'Summary',
            type: 'textarea',
            required: true,
            fullWidth: true,
        },
    ];

    if (loading) {
        return <div>Loading releases...</div>;
    }

    return (
        <div className="releases">
            <h1>Releases</h1>

            {error && <p className="error-message">{error}</p>}

            <ResourceForm
                title={editingReleaseId ? `Edit Release #${editingReleaseId}` : 'Create Release'}
                fields={releaseFields}
                formData={formData}
                onChange={handleChange}
                onSubmit={handleSubmit}
                submitting={submitting}
                submitLabel={editingReleaseId ? 'Save Changes' : 'Create Release'}
                submittingLabel={editingReleaseId ? 'Saving...' : 'Creating...'}
                showCancel={Boolean(editingReleaseId)}
                onCancel={resetForm}
                cancelLabel="Cancel Edit"
                className="release-form"
            />

            <section className="release-list-section">
                <h2>Release List</h2>

                <DataTable
                    columns={releaseColumns}
                    data={releases}
                    emptyMessage="No releases found."
                />
            </section>
        </div>
    );
}

export default Release;