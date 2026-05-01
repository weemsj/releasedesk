function ResourceForm({
    title,
    fields,
    formData,
    onChange,
    onSubmit,
    submitting = false,
    submitLabel = 'Submit',
    submittingLabel = 'Saving...',
    onCancel,
    showCancel = false,
    cancelLabel = 'Cancel',
    className = 'resource-form',
}) {
    const renderField = (field) => {
        const commonProps = {
            id: field.name,
            name: field.name,
            value: formData[field.name] || '',
            onChange,
            required: field.required || false,
        };

        if (field.type === 'textarea') {
            return (
                <textarea
                    {...commonProps}
                    placeholder={field.placeholder || ''}
                    rows={field.rows || 3}
                />
            );
        }

        if (field.type === 'select') {
            return (
                <select {...commonProps}>
                    {field.options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            );
        }

        return (
            <input
                {...commonProps}
                type={field.type || 'text'}
                placeholder={field.placeholder || ''}
            />
        );
    };

    return (
        <section className={`${className}-section form-panel`}>
            <h2>{title}</h2>

            <form onSubmit={onSubmit} className={`${className} form-grid`}>
                {fields.map((field) => (
                    <div
                        key={field.name}
                        className={`form-field ${field.fullWidth ? 'form-field-full' : ''}`}
                    >
                        <label htmlFor={field.name}>{field.label}</label>
                        {renderField(field)}
                    </div>
                ))}

                <div className="form-actions form-field-full">
                    <button type="submit" disabled={submitting}>
                        {submitting ? submittingLabel : submitLabel}
                    </button>

                    {showCancel && (
                        <button type="button" onClick={onCancel} disabled={submitting}>
                            {cancelLabel}
                        </button>
                    )}
                </div>
            </form>
        </section>
    );
}

export default ResourceForm;