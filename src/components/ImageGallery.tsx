import { useState } from 'react';
import { ZoomAnimation } from './ZoomAnimation';
import './ImageGallery.css';

interface ImageGalleryProps {
    images: string[];
    productName: string;
}

/**
 * ImageGallery Component
 *
 * Displays product images with thumbnail navigation and click-to-zoom modal.
 * Requirements: 3.2, 3.3
 */
export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, productName }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);

    const handleThumbnailClick = (index: number) => {
        setSelectedIndex(index);
    };

    const handleMainImageClick = () => {
        setIsZoomed(true);
    };

    const handleCloseZoom = () => {
        setIsZoomed(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') setIsZoomed(false);
        if (e.key === 'ArrowLeft' && selectedIndex > 0) setSelectedIndex(selectedIndex - 1);
        if (e.key === 'ArrowRight' && selectedIndex < images.length - 1) setSelectedIndex(selectedIndex + 1);
    };

    return (
        <div className="image-gallery" onKeyDown={handleKeyDown} tabIndex={0}>
            {/* Main Image */}
            <div className="image-gallery__main" onClick={handleMainImageClick}>
                <ZoomAnimation trigger="hover" scale={1.03} duration={0.3}>
                    <img
                        src={images[selectedIndex]}
                        alt={`${productName} - Image ${selectedIndex + 1}`}
                        className="image-gallery__main-img"
                    />
                </ZoomAnimation>
                <span className="image-gallery__zoom-hint" aria-hidden="true">Click to zoom</span>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="image-gallery__thumbnails" role="tablist" aria-label="Product images">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            className={`image-gallery__thumbnail ${index === selectedIndex ? 'image-gallery__thumbnail--active' : ''}`}
                            onClick={() => handleThumbnailClick(index)}
                            role="tab"
                            aria-selected={index === selectedIndex}
                            aria-label={`View image ${index + 1}`}
                        >
                            <img src={image} alt={`${productName} thumbnail ${index + 1}`} />
                        </button>
                    ))}
                </div>
            )}

            {/* Zoom Modal */}
            {isZoomed && (
                <div
                    className="image-gallery__modal"
                    onClick={handleCloseZoom}
                    role="dialog"
                    aria-label="Zoomed product image"
                >
                    <div className="image-gallery__modal-content" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="image-gallery__modal-close"
                            onClick={handleCloseZoom}
                            aria-label="Close zoom"
                        >
                            &times;
                        </button>
                        <ZoomAnimation trigger="click" scale={1.5} duration={0.3}>
                            <img
                                src={images[selectedIndex]}
                                alt={`${productName} - Zoomed view`}
                                className="image-gallery__modal-img"
                            />
                        </ZoomAnimation>
                    </div>
                </div>
            )}
        </div>
    );
};
