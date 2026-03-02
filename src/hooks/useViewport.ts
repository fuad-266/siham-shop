import { useState, useEffect, useCallback } from 'react';

/**
 * Breakpoint constants matching CSS media queries.
 * Mobile: 320px - 767px
 * Tablet: 768px - 1023px
 * Desktop: 1024px+
 */
const BREAKPOINTS = {
    mobile: 767,
    tablet: 1023,
} as const;

interface ViewportInfo {
    width: number;
    height: number;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
}

/**
 * useViewport Hook
 *
 * Returns current viewport dimensions and device tier flags.
 * Uses a debounced resize listener (150ms) for performance.
 * Layout updates without page reload on resize.
 *
 * Requirements: 6.5
 */
export const useViewport = (): ViewportInfo => {
    const getViewport = useCallback((): ViewportInfo => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        return {
            width,
            height,
            isMobile: width <= BREAKPOINTS.mobile,
            isTablet: width > BREAKPOINTS.mobile && width <= BREAKPOINTS.tablet,
            isDesktop: width > BREAKPOINTS.tablet,
        };
    }, []);

    const [viewport, setViewport] = useState<ViewportInfo>(getViewport);

    useEffect(() => {
        let timeoutId: number | null = null;

        const handleResize = () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = window.setTimeout(() => {
                setViewport(getViewport());
            }, 150);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [getViewport]);

    return viewport;
};
