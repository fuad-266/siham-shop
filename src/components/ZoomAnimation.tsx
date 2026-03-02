import { motion, useInView, Variants } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

interface ZoomAnimationProps {
  children: React.ReactNode;
  trigger: 'hover' | 'click' | 'inView';
  scale?: number;
  duration?: number;
}

/**
 * ZoomAnimation wrapper component
 * 
 * Provides configurable zoom animation effects with accessibility support.
 * Respects user's prefers-reduced-motion preference.
 * 
 * @param trigger - Animation trigger mode: 'hover', 'click', or 'inView'
 * @param scale - Target scale factor (default: 1.05)
 * @param duration - Animation duration in seconds (default: 0.3, max: 0.5)
 */
export const ZoomAnimation: React.FC<ZoomAnimationProps> = ({
  children,
  trigger,
  scale = 1.05,
  duration = 0.3,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [isClicked, setIsClicked] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for prefers-reduced-motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Ensure duration doesn't exceed 500ms (0.5s)
  const constrainedDuration = Math.min(duration, 0.5);

  // If reduced motion is preferred, disable animations
  const effectiveScale = prefersReducedMotion ? 1 : scale;
  const effectiveDuration = prefersReducedMotion ? 0 : constrainedDuration;

  const variants: Variants = {
    initial: { scale: 1 },
    animate: { scale: effectiveScale },
  };

  const handleClick = () => {
    if (trigger === 'click') {
      setIsClicked(!isClicked);
    }
  };

  // Hover trigger
  if (trigger === 'hover') {
    return (
      <motion.div
        ref={ref}
        initial="initial"
        whileHover="animate"
        variants={variants}
        transition={{ duration: effectiveDuration }}
        style={{ display: 'inline-block' }}
      >
        {children}
      </motion.div>
    );
  }

  // Click trigger
  if (trigger === 'click') {
    return (
      <motion.div
        ref={ref}
        initial="initial"
        animate={isClicked ? 'animate' : 'initial'}
        variants={variants}
        transition={{ duration: effectiveDuration }}
        onClick={handleClick}
        style={{ display: 'inline-block', cursor: 'pointer' }}
      >
        {children}
      </motion.div>
    );
  }

  // InView trigger
  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate={isInView ? 'animate' : 'initial'}
      variants={variants}
      transition={{ duration: effectiveDuration }}
      style={{ display: 'inline-block' }}
    >
      {children}
    </motion.div>
  );
};
