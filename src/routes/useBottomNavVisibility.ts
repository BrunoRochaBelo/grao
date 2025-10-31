import { useEffect, useRef, useState } from "react";
import type { ViewState } from "./types";

const MIN_SCROLL_DELTA = 5;
const HIDE_SCROLL_THRESHOLD = 30;
const SHOW_SCROLL_THRESHOLD = -20;
const SAFE_ZONE = 300;

export function useBottomNavVisibility(currentView: ViewState) {
  const [isVisible, setIsVisible] = useState(true);
  const accumulatedRef = useRef(0);
  const lastScrollRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.scrollTo({ top: 0, behavior: "auto" });
    setIsVisible(true);
    accumulatedRef.current = 0;
    lastScrollRef.current = window.scrollY ?? 0;
  }, [currentView]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleScroll = () => {
      if (rafRef.current !== null) {
        return;
      }

      rafRef.current = window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY ?? 0;
        const delta = currentScrollY - lastScrollRef.current;

        if (Math.abs(delta) < MIN_SCROLL_DELTA) {
          rafRef.current = null;
          return;
        }

        const accumulated = accumulatedRef.current;
        const hasChangedDirection =
          (delta > 0 && accumulated < 0) || (delta < 0 && accumulated > 0);
        const nextAccumulated = hasChangedDirection
          ? delta
          : accumulated + delta;

        const shouldHide =
          nextAccumulated > HIDE_SCROLL_THRESHOLD &&
          currentScrollY > SAFE_ZONE &&
          isVisible;
        const shouldShow =
          (nextAccumulated < SHOW_SCROLL_THRESHOLD ||
            currentScrollY <= SAFE_ZONE) &&
          !isVisible;

        if (shouldHide) {
          setIsVisible(false);
          accumulatedRef.current = 0;
        } else if (shouldShow) {
          setIsVisible(true);
          accumulatedRef.current = 0;
        } else {
          accumulatedRef.current = nextAccumulated;
        }

        lastScrollRef.current = currentScrollY;
        rafRef.current = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isVisible]);

  return { isVisible, setIsVisible };
}
