import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getQANotes, createQANote } from '../api/releaseDeskApi';

function QANotesPanel({ issueId }) {
    const { hasRole } = useAuth();

    const canAddQANote = hasRole('Admin') || hasRole('QA');

    const [qaNotes, setQaNotes] = useState([]);
    const [formData, setFormData] = useState({
        tester_name: '',
        result: 'pass',
        notes: '',
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQANotes = async () => {
            if (!issueId) {
                return;
            }

            try {
                const notesData = await getQANotes();

                const notesForIssue = notesData.filter((note) => (
                    String(note.issue) === String(issueId)
                ));

                setQaNotes(notesForIssue);
                setError(null);
            } catch (err) {
                console.error('Error fetching QA notes:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchQANotes();
    }, [issueId]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setFormData({
            tester_name: '',
            result: 'pass',
            notes: '',
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);

        try {
            const payload = {
                ...formData,
                issue: issueId,
            };

            const newQANote = await createQANote(payload);
            setQaNotes((prevNotes) => [...prevNotes, newQANote]);
            resetForm();
            setError(null);
        } catch (err) {
            console.error('Error creating QA note:', err);
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <p>Loading QA notes...</p>;
    }

    return (
        <section className="qa-notes-panel">
            <h2>QA Notes</h2>

            {error && <p className="error-message">{error}</p>}

            {qaNotes.length === 0 ? (
                <p>No QA notes found for this issue.</p>
            ) : (
                <div className="qa-notes-list">
                    {qaNotes.map((note) => (
                        <div key={note.id} className="qa-note-card">
                            <p><strong>Tester:</strong> {note.tester_name}</p>
                            <p><strong>Result:</strong> {note.result}</p>
                            <p><strong>Notes:</strong> {note.notes}</p>
                        </div>
                    ))}
                </div>
            )}

            {canAddQANote && (
                <form onSubmit={handleSubmit} className="qa-note-form form-grid">
                    <div className="form-field">
                        <label htmlFor="tester_name">Tester Name</label>
                        <input
                            id="tester_name"
                            name="tester_name"
                            type="text"
                            value={formData.tester_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="result">Result</label>
                        <select
                            id="result"
                            name="result"
                            value={formData.result}
                            onChange={handleChange}
                            required
                        >
                            <option value="pass">Pass</option>
                            <option value="fail">Fail</option>
                            <option value="blocked">Blocked</option>
                        </select>
                    </div>

                    <div className="form-field form-field-full">
                        <label htmlFor="notes">Notes</label>
                        <textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-actions form-field-full">
                        <button type="submit" disabled={submitting}>
                            {submitting ? 'Adding...' : 'Add QA Note'}
                        </button>
                    </div>
                </form>
            )}
        </section>
    );
}

export default QANotesPanel;