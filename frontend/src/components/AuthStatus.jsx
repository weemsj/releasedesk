import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AuthStatus() {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    if (!isAuthenticated) {
        return (
            <div className="auth-status">
                <Link to="/login" className="login-link">
                    Login
                </Link>
            </div>
        );
    }

    return (
        <div className="auth-status">
            <span>Logged in as </span>
            <Link to="/account" className="username-link">
                {user.username}
            </Link>
            <button type="button" onClick={handleLogout} className="logout-button">
                Logout
            </button>
        </div>
    );
}

export default AuthStatus;