import { motion } from 'framer-motion';
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
 * Respects user's prefers-reduced-motion preference.
 *
 * Requirements: 8.3, 9.4
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'medium',
    message,
}) => {
    // Check for prefers-reduced-motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    return (
        <motion.div
            className={`loading-spinner loading-spinner--${size}`}
            role="status"
            aria-live="polite"
            initial={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
        >
            <div className="loading-spinner__circle" />
            {message && <p className="loading-spinner__message">{message}</p>}
            <span className="loading-spinner__sr-only">Loading...</span>
        </motion.div>
    );
};

export default LoadingSpinner;
