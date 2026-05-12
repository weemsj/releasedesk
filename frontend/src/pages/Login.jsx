import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const from = location.state?.from?.pathname || '/';

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
            await login(formData);
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message || 'Unable to log in.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-page">
            <h1>Login</h1>

            {error && <p className="error-message">{error}</p>}

            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-field">
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleChange}
                        autoComplete='username'
                        required
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete='current-password'
                        required
                    />
                </div>

                <button type="submit" disabled={submitting}>
                    {submitting ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
}

export default Login;