import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Production-Ready Scroll Restoration Hook
 * 
 * Handles:
 * - Image loading delays (BentoGrid, lazy images, etc.)
 * - Dynamic content height changes
 * - Instant restoration without visual flash
 * - Works with any layout structure
 */
const useScrollRestoration = (options = {}) => {
  const { 
    debounceMs = 150,
    enabled = true
  } = options;

  const location = useLocation();
  const saveTimeoutRef = useRef(null);
  const isRestoringRef = useRef(false);
  const hasRestoredRef = useRef(false);
  const restoreAttemptRef = useRef(0);
  const maxAttemptsRef = useRef(20); // Try up to 20 times (2 seconds)

  /**
   * Generate unique storage key for current route
   */
  const getStorageKey = () => {
    return `scroll_${location.pathname}${location.search}`;
  };

  /**
   * Save current scroll position to sessionStorage (debounced)
   */
  const saveScrollPosition = () => {
    if (!enabled || isRestoringRef.current) return;

    const position = {
      x: window.scrollX,
      y: window.scrollY,
      timestamp: Date.now()
    };

    try {
      sessionStorage.setItem(getStorageKey(), JSON.stringify(position));
    } catch (e) {
      console.warn('Failed to save scroll position:', e);
    }
  };

  /**
   * Wait for images to load before restoring scroll
   * This prevents the "stops at CategoryPreview" bug
   */
  const waitForImages = () => {
    return new Promise((resolve) => {
      const images = document.querySelectorAll('img');
      
      if (images.length === 0) {
        resolve();
        return;
      }

      let loadedCount = 0;
      const totalImages = images.length;

      const checkAllLoaded = () => {
        loadedCount++;
        if (loadedCount >= totalImages) {
          resolve();
        }
      };

      images.forEach((img) => {
        if (img.complete) {
          checkAllLoaded();
        } else {
          img.addEventListener('load', checkAllLoaded, { once: true });
          img.addEventListener('error', checkAllLoaded, { once: true });
        }
      });

      // Fallback timeout - don't wait forever
      setTimeout(resolve, 2000);
    });
  };

  /**
   * Restore scroll position with retry mechanism
   * Keeps trying until page height is sufficient or max attempts reached
   */
  const restoreScrollPosition = async () => {
    if (!enabled || hasRestoredRef.current) return;

    const savedData = sessionStorage.getItem(getStorageKey());
    if (!savedData) {
      // First visit - ensure we're at top
      window.scrollTo(0, 0);
      return;
    }

    try {
      const { x, y } = JSON.parse(savedData);
      
      // Mark as restoring to prevent save during restoration
      isRestoringRef.current = true;
      hasRestoredRef.current = true;

      // Wait for initial render
      await new Promise(resolve => requestAnimationFrame(resolve));
      
      // Wait for images to load
      await waitForImages();

      // Retry mechanism - wait for page to be tall enough
      const attemptRestore = () => {
        const docHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        const maxScrollY = docHeight - windowHeight;
        
        // If page is tall enough OR we've tried enough times, restore now
        if (maxScrollY >= y || restoreAttemptRef.current >= maxAttemptsRef.current) {
          const targetY = Math.min(y, Math.max(0, maxScrollY));
          
          // Instant scroll (no smooth animation)
          window.scrollTo(x, targetY);
          
          // Allow saving again after restoration completes
          setTimeout(() => {
            isRestoringRef.current = false;
          }, 100);
        } else {
          // Page not tall enough yet, try again
          restoreAttemptRef.current++;
          setTimeout(attemptRestore, 100);
        }
      };

      attemptRestore();
      
    } catch (e) {
      console.warn('Failed to restore scroll position:', e);
      isRestoringRef.current = false;
      // Ensure first visit starts at top
      window.scrollTo(0, 0);
    }
  };

  /**
   * Step 1: Disable browser's native scroll restoration
   */
  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      const original = window.history.scrollRestoration;
      window.history.scrollRestoration = 'manual';
      return () => {
        window.history.scrollRestoration = original;
      };
    }
  }, []);

  /**
   * Step 2: Restore scroll position on mount (layout effect for no flicker)
   */
  useLayoutEffect(() => {
    // Reset flags on route change
    hasRestoredRef.current = false;
    restoreAttemptRef.current = 0;
    
    restoreScrollPosition();
  }, [location.pathname, location.search]);

  /**
   * Step 3: Save scroll position on scroll (debounced)
   */
  useEffect(() => {
    if (!enabled) return;

    const handleScroll = () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = setTimeout(() => {
        saveScrollPosition();
      }, debounceMs);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      // Final save on unmount
      saveScrollPosition();
    };
  }, [enabled, debounceMs, location.pathname, location.search]);

  return {
    clearScrollPosition: () => {
      sessionStorage.removeItem(getStorageKey());
    }
  };
};

export default useScrollRestoration;