import { useState, useRef, useEffect } from 'react';
import './LazyImage.css';

interface LazyImageProps {
    src: string;
    alt: string;
    className?: string;
    width?: number | string;
    height?: number | string;
    style?: React.CSSProperties;
    onClick?: () => void;
}

/**
 * LazyImage Component
 *
 * Loads images lazily using Intersection Observer.
 * Displays a skeleton placeholder until the image enters the viewport and loads.
 *
 * Requirements: 8.2
 */
const LazyImage: React.FC<LazyImageProps> = ({
    src,
    alt,
    className = '',
    width,
    height,
    style,
    onClick,
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = imgRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    setIsInView(true);
                    observer.unobserve(element);
                }
            },
            {
                rootMargin: '200px', // Start loading 200px before entering viewport
                threshold: 0,
            }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <div
            ref={imgRef}
            className={`lazy-image ${className}`}
            style={{
                width,
                height,
                position: 'relative',
                overflow: 'hidden',
                ...style,
            }}
            onClick={onClick}
            onKeyDown={onClick ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick();
                }
            } : undefined}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
            aria-label={onClick ? alt : undefined}
        >
            {/* Skeleton placeholder */}
            {!isLoaded && (
                <div className="lazy-image__skeleton" />
            )}

            {/* Actual image — only rendered when in view */}
            {isInView && (
                <img
                    src={src}
                    alt={alt}
                    className={`lazy-image__img ${isLoaded ? 'lazy-image__img--loaded' : ''}`}
                    onLoad={() => setIsLoaded(true)}
                    loading="lazy"
                />
            )}
        </div>
    );
};

export default LazyImage;
