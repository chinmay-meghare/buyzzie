import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Dead Simple Scroll Restoration
 * 
 * Strategy: Save on scroll, restore on next render cycle
 * No complex timing, no race conditions, just works.
 */
const useScrollRestoration = () => {
  const location = useLocation();
  const saveTimeoutRef = useRef(null);
  const hasRestoredRef = useRef(false);

  // Unique key per route
  const storageKey = `scroll_${location.pathname}${location.search}`;

  // Restore scroll ONCE when component mounts or route changes
  useEffect(() => {
    // Reset flag on route change
    hasRestoredRef.current = false;

    const restore = () => {
      if (hasRestoredRef.current) return;
      hasRestoredRef.current = true;

      const saved = sessionStorage.getItem(storageKey);
      if (!saved) {
        window.scrollTo(0, 0);
        return;
      }

      try {
        const { x, y } = JSON.parse(saved);
        
        // Wait for content to render, then restore
        const attemptRestore = (attempt = 0) => {
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          
          if (maxScroll >= y || attempt > 20) {
            // Can scroll to position or gave up trying
            window.scrollTo(x, Math.min(y, maxScroll));
          } else {
            // Not tall enough yet, try again
            setTimeout(() => attemptRestore(attempt + 1), 50);
          }
        };

        // Start restoration after next paint
        requestAnimationFrame(() => {
          setTimeout(attemptRestore, 100);
        });
      } catch (e) {
        window.scrollTo(0, 0);
      }
    };

    restore();
  }, [location.pathname, location.search, storageKey]);

  // Save scroll position (debounced)
  useEffect(() => {
    const handleScroll = () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      
      saveTimeoutRef.current = setTimeout(() => {
        try {
          sessionStorage.setItem(storageKey, JSON.stringify({
            x: window.scrollX,
            y: window.scrollY,
            timestamp: Date.now()
          }));
        } catch (e) {
          // Ignore storage errors
        }
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [storageKey]);

  // Disable browser's scroll restoration
  useEffect(() => {
    if (window.history.scrollRestoration) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  return null;
};

export default useScrollRestoration;