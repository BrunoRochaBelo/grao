import { useEffect, useState } from 'react';

const SCROLL_THRESHOLD = 32;
const DEBOUNCE_MS = 120;

export function useFloatingNavVisibility() {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    let lastScrollY = window.scrollY;
    let timeoutId: number | undefined;

    const updateVisibility = () => {
      const current = window.scrollY;
      const delta = current - lastScrollY;

      if (Math.abs(delta) < SCROLL_THRESHOLD) {
        lastScrollY = current;
        return;
      }

      if (current <= SCROLL_THRESHOLD) {
        setIsHidden(false);
      } else if (delta > 0) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }

      lastScrollY = current;
    };

    const handleScroll = () => {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
      timeoutId = window.setTimeout(updateVisibility, DEBOUNCE_MS);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return { isHidden };
}
