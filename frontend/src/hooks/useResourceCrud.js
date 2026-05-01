import { useEffect, useState } from 'react';

function useResourceCrud({
    initialFormData,
    getItems,
    createItem,
    updateItem,
    deleteItem,
    mapItemToForm,
    getDeleteMessage,
}) {
    const [items, setItems] = useState([]);
    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [editingItemId, setEditingItemId] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const data = await getItems();
                setItems(data);
            } catch (err) {
                console.error('Error loading resource data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, [getItems]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setEditingItemId(null);
    };

    const handleEditClick = (item) => {
        setEditingItemId(item.id);

        if (mapItemToForm) {
            setFormData(mapItemToForm(item));
        } else {
            setFormData(item);
        }

        setError(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteClick = async (item) => {
        if (!deleteItem) {
            return;
        }

        const message = getDeleteMessage
            ? getDeleteMessage(item)
            : `Are you sure you want to delete this record?`;

        const confirmed = window.confirm(message);

        if (!confirmed) {
            return;
        }

        try {
            await deleteItem(item.id);

            setItems((prevItems) => (
                prevItems.filter((currentItem) => currentItem.id !== item.id)
            ));

            if (editingItemId === item.id) {
                resetForm();
            }

            setError(null);
        } catch (err) {
            console.error('Error deleting resource:', err);
            setError(err.message);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);

        try {
            if (editingItemId && updateItem) {
                const updatedItem = await updateItem(editingItemId, formData);

                setItems((prevItems) => (
                    prevItems.map((item) => (
                        item.id === editingItemId ? updatedItem : item
                    ))
                ));
            } else {
                const newItem = await createItem(formData);
                setItems((prevItems) => [...prevItems, newItem]);
            }

            resetForm();
            setError(null);
        } catch (err) {
            console.error('Error saving resource:', err);
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return {
        items,
        setItems,
        formData,
        setFormData,
        loading,
        submitting,
        error,
        setError,
        editingItemId,
        handleChange,
        resetForm,
        handleEditClick,
        handleDeleteClick,
        handleSubmit,
    };
}

export default useResourceCrud;