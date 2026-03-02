import './LoadingSpinner.css';

interface LoadingSpinnerProps {
    size?: 'small' | 'medium' | 'large';
    message?: string;
}

/**
 * LoadingSpinner Component
 *
 * Displays a loading spinner with zoom animation effect.
 * Used for async operations and page transitions.
 *
 * Requirements: 8.3
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'medium',
    message,
}) => {
    return (
        <div className={`loading-spinner loading-spinner--${size}`} role="status" aria-live="polite">
            <div className="loading-spinner__circle" />
            {message && <p className="loading-spinner__message">{message}</p>}
            <span className="loading-spinner__sr-only">Loading...</span>
        </div>
    );
};

export default LoadingSpinner;
