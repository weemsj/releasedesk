import DataTable from '../components/dataTable';
import ResourceForm from '../components/ResourceForm';
import useResourceCrud from '../hooks/useResourceCrud';
import BackButton from '../components/BackButton';
import {
    getReleases,
    createRelease,
    updateRelease,
} from '../api/releaseDeskApi';

function Release() {
    const initialReleaseFormData = {
        name: '',
        release_date: '',
        status: 'planned',
        summary: '',
    };

    const {
        items: releases,
        formData,
        loading,
        submitting,
        error,
        editingItemId: editingReleaseId,
        handleChange,
        resetForm,
        handleEditClick,
        handleSubmit,
    } = useResourceCrud({
        initialFormData: initialReleaseFormData,
        getItems: getReleases,
        createItem: createRelease,
        updateItem: updateRelease,
        mapItemToForm: (release) => ({
            name: release.name || '',
            release_date: release.release_date || '',
            status: release.status || 'planned',
            summary: release.summary || '',
        }),
    });

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
                <button type="button" onClick={() => handleEditClick(release)}>
                    Edit
                </button>
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
            <BackButton />
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