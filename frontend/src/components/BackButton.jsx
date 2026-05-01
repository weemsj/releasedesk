import { useNavigate } from 'react-router-dom';

function BackButton({ label = 'Back', className = 'back-button' }) {
    const navigate = useNavigate();

    return (
        <div className="back-button-wrapper">
            <button
                type="button"
                className={className}
                onClick={() => navigate(-1)}
            >
                ← {label}
            </button>
        </div>
    );
}

export default BackButton;