import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Bulletproof Scroll Restoration Hook
 * 
 * Solves:
 * - BentoGrid flicker on navigation
 * - Race conditions with fast-loading local images
 * - Layout calculation timing issues
 * - Inconsistent scroll positions
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
   * Wait for all images to load
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

      const checkComplete = () => {
        loadedCount++;
        if (loadedCount >= totalImages) {
          resolve();
        }
      };

      images.forEach((img) => {
        if (img.complete && img.naturalHeight !== 0) {
          checkComplete();
        } else {
          img.addEventListener('load', checkComplete, { once: true });
          img.addEventListener('error', checkComplete, { once: true });
        }
      });

      // Safety timeout
      setTimeout(resolve, 1500);
    });
  };

  /**
   * Wait for layout to stabilize
   * This is the KEY fix - waits for browser to finish painting
   */
  const waitForLayoutStability = () => {
    return new Promise((resolve) => {
      let lastHeight = document.documentElement.scrollHeight;
      let stableCount = 0;
      const checksNeeded = 3; // Height must be stable for 3 checks
      
      const checkStability = () => {
        const currentHeight = document.documentElement.scrollHeight;
        
        if (currentHeight === lastHeight) {
          stableCount++;
          if (stableCount >= checksNeeded) {
            resolve();
            return;
          }
        } else {
          stableCount = 0;
          lastHeight = currentHeight;
        }
        
        requestAnimationFrame(checkStability);
      };
      
      requestAnimationFrame(checkStability);
      
      // Maximum wait time
      setTimeout(resolve, 2000);
    });
  };

  /**
   * Restore scroll position with proper sequencing
   */
  const restoreScrollPosition = async () => {
    if (!enabled || hasRestoredRef.current) return;

    const savedData = sessionStorage.getItem(getStorageKey());
    
    if (!savedData) {
      // First visit - scroll to top
      window.scrollTo(0, 0);
      return;
    }

    try {
      const { x, y } = JSON.parse(savedData);
      
      isRestoringRef.current = true;
      hasRestoredRef.current = true;

      // Step 1: Wait for images to load
      await waitForImages();
      
      // Step 2: Wait for layout to stabilize (CRITICAL for BentoGrid)
      await waitForLayoutStability();
      
      // Step 3: One more frame to ensure paint is complete
      await new Promise(resolve => requestAnimationFrame(resolve));
      
      // Step 4: Verify we have enough height
      const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;
      const targetY = Math.min(y, Math.max(0, maxScrollY));
      
      // Step 5: Restore instantly (no smooth scroll)
      window.scrollTo(x, targetY);
      
      // Allow saving after brief delay
      setTimeout(() => {
        isRestoringRef.current = false;
      }, 150);
      
    } catch (e) {
      console.warn('Failed to restore scroll position:', e);
      isRestoringRef.current = false;
      window.scrollTo(0, 0);
    }
  };

  /**
   * Disable browser's native scroll restoration
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
   * Restore scroll on route change
   */
  useLayoutEffect(() => {
    hasRestoredRef.current = false;
    
    // Small delay to let React finish rendering
    const timer = setTimeout(() => {
      restoreScrollPosition();
    }, 0);
    
    return () => clearTimeout(timer);
  }, [location.pathname, location.search]);

  /**
   * Save scroll position on scroll
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