import { useRef, useCallback, useState, useEffect } from "react";

interface GestureHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onLongPress?: () => void;
  onDoubleTap?: () => void;
}

interface SwipeThresholds {
  distance?: number; // pixels
  time?: number; // milliseconds
}

/**
 * Hook para gerenciar gestos no mobile e desktop
 * Suporta: swipe, long press, double tap
 */
export function useGestures(
  handlers: GestureHandlers,
  thresholds: SwipeThresholds = {}
) {
  const { distance = 50, time = 300 } = thresholds;

  // References para rastrear estado de toque
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(
    null
  );
  const lastTapRef = useRef<{ time: number; x: number; y: number } | null>(
    null
  );
  const longPressTimerRef = useRef<number | null>(null);

  const [isLongPressing, setIsLongPressing] = useState(false);

  // Limpar timers ao desmontar
  const cleanup = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
  }, []);

  // Handle touch start
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };

      // Setup long press timer (400ms padrão)
      longPressTimerRef.current = window.setTimeout(() => {
        setIsLongPressing(true);
        handlers.onLongPress?.();
      }, 400);
    },
    [handlers]
  );

  // Handle touch move (cancel long press se houver movimento)
  const handleTouchMove = useCallback(() => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      setIsLongPressing(false);
    }
  }, []);

  // Handle touch end
  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStartRef.current) return;

      // Limpar long press timer
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
      setIsLongPressing(false);

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      const deltaTime = Date.now() - touchStartRef.current.time;

      // Swipe detection
      if (deltaTime < time) {
        // Swipe esquerda (movimento negativo em X)
        if (
          Math.abs(deltaX) > distance &&
          Math.abs(deltaX) > Math.abs(deltaY)
        ) {
          if (deltaX < 0) {
            handlers.onSwipeLeft?.();
          } else {
            handlers.onSwipeRight?.();
          }
        }

        // Swipe vertical
        if (
          Math.abs(deltaY) > distance &&
          Math.abs(deltaY) > Math.abs(deltaX)
        ) {
          if (deltaY < 0) {
            handlers.onSwipeUp?.();
          } else {
            handlers.onSwipeDown?.();
          }
        }

        // Double tap detection
        if (lastTapRef.current && deltaX === 0 && deltaY === 0) {
          const timeDiff = Date.now() - lastTapRef.current.time;
          const posDiff = Math.sqrt(
            Math.pow(touch.clientX - lastTapRef.current.x, 2) +
              Math.pow(touch.clientY - lastTapRef.current.y, 2)
          );

          if (timeDiff < 300 && posDiff < 50) {
            handlers.onDoubleTap?.();
          }
        }
      }

      lastTapRef.current = {
        time: Date.now(),
        x: touch.clientX,
        y: touch.clientY,
      };

      touchStartRef.current = null;
    },
    [handlers, distance, time]
  );

  return {
    isLongPressing,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    cleanup,
  };
}

/**
 * Hook para debounce
 * Útil para busca, validação, etc
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook para throttle
 * Útil para scroll, resize events
 */
export function useThrottle<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastUpdatedRef = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();

    if (now >= lastUpdatedRef.current + interval) {
      lastUpdatedRef.current = now;
      setThrottledValue(value);
    } else {
      const handler = setTimeout(() => {
        lastUpdatedRef.current = Date.now();
        setThrottledValue(value);
      }, interval - (now - lastUpdatedRef.current));

      return () => clearTimeout(handler);
    }
  }, [value, interval]);

  return throttledValue;
}
