import { useState } from 'react';
import BackButton from '../components/BackButton';
import { useAuth } from '../context/AuthContext';
import AuthStatus from '../components/AuthStatus';

function Account() {
    const { user, updateAccount } = useAuth();

    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);

        try {
            await updateAccount(formData);
            setMessage('Account updated successfully.');
            setError(null);
        } catch (err) {
            setError(err.message || 'Unable to update account.');
            setMessage(null);
        } finally {
            setSubmitting(false);
        }
    };

    if (!user) {
        return (
            <div className="account-page">
                <p>You must be logged in to view your account.</p>
            </div>
        );
    }

    return (
        <div className="account-page">
            <AuthStatus/>
            <BackButton />

            <h1>Account</h1>

            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}

            <section className="account-summary">
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email || 'N/A'}</p>
                <p><strong>Roles:</strong> {user.roles?.join(', ') || 'No roles assigned'}</p>
            </section>

            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-field">
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="first_name">First Name</label>
                    <input
                        id="first_name"
                        name="first_name"
                        type="text"
                        value={formData.first_name}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="last_name">Last Name</label>
                    <input
                        id="last_name"
                        name="last_name"
                        type="text"
                        value={formData.last_name}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" disabled={submitting}>
                    {submitting ? 'Saving...' : 'Save Account'}
                </button>
            </form>
        </div>
    );
}

export default Account;