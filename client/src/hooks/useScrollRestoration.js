import { useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook for persisting and restoring scroll positions across page navigation
 * 
 * Features:
 * - Debounced scroll saving for optimal performance
 * - sessionStorage persistence (clears on tab close)
 * - Data-aware restoration (waits for content to load)
 * - Smooth scroll transitions (configurable)
 * - ResizeObserver integration for dynamic content
 * - Support for both window and custom scroll containers
 * 
 * @param {Object} options - Configuration options
 * @param {boolean} options.smooth - Enable smooth scrolling (default: true)
 * @param {number} options.debounceMs - Debounce time for scroll saving (default: 100ms)
 * @param {Array} options.dependencies - Additional dependencies to trigger scroll restoration
 * @param {RefObject} options.scrollContainerRef - Optional custom scroll container ref
 * @param {boolean} options.enabled - Enable/disable the hook (default: true)
 * 
 * @example
 * // Basic usage
 * useScrollRestoration();
 * 
 * @example
 * // With data dependencies
 * useScrollRestoration({ 
 *   smooth: true,
 *   dependencies: [products, isLoading]
 * });
 * 
 * @example
 * // Custom scroll container
 * const containerRef = useRef(null);
 * useScrollRestoration({ 
 *   scrollContainerRef: containerRef 
 * });
 */
const useScrollRestoration = (options = {}) => {
  const { 
    smooth = true, 
    debounceMs = 100,
    dependencies = [],
    scrollContainerRef = null,
    enabled = true
  } = options;

  const location = useLocation();
  const scrollTimeoutRef = useRef(null);
  const isRestoringRef = useRef(false);
  const resizeObserverRef = useRef(null);
  const lastScrollPositionRef = useRef({ x: 0, y: 0 });

  // Disable browser's default scroll restoration
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      const originalScrollRestoration = window.history.scrollRestoration;
      window.history.scrollRestoration = 'manual';
      
      return () => {
        window.history.scrollRestoration = originalScrollRestoration;
      };
    }
  }, []);

  /**
   * Generate unique storage key based on current route
   */
  const getScrollKey = useCallback(() => {
    return `scroll_position_${location.pathname}${location.search}`;
  }, [location.pathname, location.search]);

  /**
   * Get scroll container (window or custom element)
   */
  const getScrollContainer = useCallback(() => {
    return scrollContainerRef?.current || window;
  }, [scrollContainerRef]);

  /**
   * Get current scroll position from container
   */
  const getCurrentScrollPosition = useCallback(() => {
    const container = getScrollContainer();
    
    if (container === window) {
      return {
        x: window.scrollX || window.pageXOffset,
        y: window.scrollY || window.pageYOffset
      };
    } else {
      return {
        x: container.scrollLeft,
        y: container.scrollTop
      };
    }
  }, [getScrollContainer]);

  /**
   * Save scroll position to sessionStorage with error handling
   */
  const saveScrollPosition = useCallback(() => {
    if (!enabled || isRestoringRef.current) return;

    const scrollKey = getScrollKey();
    const position = getCurrentScrollPosition();
    
    // Update last known position
    lastScrollPositionRef.current = position;

    const scrollData = {
      x: position.x,
      y: position.y,
      timestamp: Date.now(),
      pathname: location.pathname
    };
    
    try {
      sessionStorage.setItem(scrollKey, JSON.stringify(scrollData));
    } catch (error) {
      // Handle quota exceeded or other storage errors
      console.warn('[useScrollRestoration] Failed to save scroll position:', error);
      
      // Try to clear old entries if quota exceeded
      if (error.name === 'QuotaExceededError') {
        try {
          const keys = Object.keys(sessionStorage);
          const scrollKeys = keys.filter(key => key.startsWith('scroll_position_'));
          
          // Remove oldest entries (keep last 10)
          if (scrollKeys.length > 10) {
            scrollKeys
              .slice(0, scrollKeys.length - 10)
              .forEach(key => sessionStorage.removeItem(key));
            
            // Retry save
            sessionStorage.setItem(scrollKey, JSON.stringify(scrollData));
          }
        } catch (cleanupError) {
          console.warn('[useScrollRestoration] Cleanup failed:', cleanupError);
        }
      }
    }
  }, [enabled, getScrollKey, getCurrentScrollPosition, location.pathname]);

  /**
   * Restore scroll position from sessionStorage
   */
  const restoreScrollPosition = useCallback(() => {
    if (!enabled) return;

    const scrollKey = getScrollKey();
    
    try {
      const savedScroll = sessionStorage.getItem(scrollKey);
      
      if (savedScroll) {
        const { x, y, pathname } = JSON.parse(savedScroll);
        
        // Verify the saved position is for the current pathname
        if (pathname !== location.pathname) {
          return;
        }
        
        isRestoringRef.current = true;
        const container = getScrollContainer();
        
        // Restore scroll position
        if (container === window) {
          window.scrollTo({
            top: y,
            left: x,
            behavior: smooth ? 'smooth' : 'auto'
          });
        } else {
          container.scrollTo({
            top: y,
            left: x,
            behavior: smooth ? 'smooth' : 'auto'
          });
        }

        // Update last known position
        lastScrollPositionRef.current = { x, y };

        // Reset restoring flag after scroll animation completes
        setTimeout(() => {
          isRestoringRef.current = false;
        }, smooth ? 500 : 100);
      } else {
        // No saved scroll position - scroll to top
        const container = getScrollContainer();
        
        if (container === window) {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: smooth ? 'smooth' : 'auto'
          });
        } else {
          container.scrollTo({
            top: 0,
            left: 0,
            behavior: smooth ? 'smooth' : 'auto'
          });
        }
      }
    } catch (error) {
      console.warn('[useScrollRestoration] Failed to restore scroll position:', error);
      // Fallback to top on error
      const container = getScrollContainer();
      if (container === window) {
        window.scrollTo(0, 0);
      } else {
        container.scrollTop = 0;
        container.scrollLeft = 0;
      }
    }
  }, [enabled, getScrollKey, getScrollContainer, smooth, location.pathname]);

  /**
   * Debounced scroll handler for performance optimization
   */
  const handleScroll = useCallback(() => {
    if (!enabled) return;

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      saveScrollPosition();
    }, debounceMs);
  }, [enabled, debounceMs, saveScrollPosition]);

  /**
   * Clear scroll position from storage
   */
  const clearScrollPosition = useCallback(() => {
    const scrollKey = getScrollKey();
    try {
      sessionStorage.removeItem(scrollKey);
    } catch (error) {
      console.warn('[useScrollRestoration] Failed to clear scroll position:', error);
    }
  }, [getScrollKey]);

  /**
   * Setup ResizeObserver to handle dynamic content changes
   */
  useEffect(() => {
    if (!enabled) return;

    const container = getScrollContainer();
    const targetElement = container === window ? document.body : container;

    if (!targetElement || !('ResizeObserver' in window)) return;

    // Create ResizeObserver to detect content height changes
    resizeObserverRef.current = new ResizeObserver((entries) => {
      // Only restore if content has grown and we have a saved position
      const entry = entries[0];
      if (entry && !isRestoringRef.current) {
        const scrollKey = getScrollKey();
        const savedScroll = sessionStorage.getItem(scrollKey);
        
        if (savedScroll) {
          const { y } = JSON.parse(savedScroll);
          const currentPosition = getCurrentScrollPosition();
          
          // If we're at the top but should be scrolled down, restore
          if (currentPosition.y === 0 && y > 0) {
            restoreScrollPosition();
          }
        }
      }
    });

    resizeObserverRef.current.observe(targetElement);

    return () => {
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, [enabled, getScrollContainer, getScrollKey, getCurrentScrollPosition, restoreScrollPosition]);

  /**
   * Restore scroll position on mount (using useLayoutEffect to prevent flicker)
   */
  useLayoutEffect(() => {
    if (!enabled) return;

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      restoreScrollPosition();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [enabled, location.pathname, location.search, ...dependencies]);

  /**
   * Setup scroll listener and cleanup
   */
  useEffect(() => {
    if (!enabled) return;

    const container = getScrollContainer();
    const scrollTarget = container === window ? window : container;

    if (!scrollTarget) return;

    // Add scroll event listener with passive flag for better performance
    scrollTarget.addEventListener('scroll', handleScroll, { passive: true });

    // Save scroll position before user navigates away
    return () => {
      scrollTarget.removeEventListener('scroll', handleScroll);
      
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Final save before unmount
      saveScrollPosition();
    };
  }, [enabled, handleScroll, saveScrollPosition, getScrollContainer]);

  // Return utility functions for manual control
  return {
    saveScrollPosition,
    restoreScrollPosition,
    clearScrollPosition,
    getCurrentPosition: getCurrentScrollPosition
  };
};

export default useScrollRestoration;
