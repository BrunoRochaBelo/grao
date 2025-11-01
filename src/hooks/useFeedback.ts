import { useCallback } from "react";
import { toast } from "sonner";

interface FeedbackOptions {
  haptic?: "light" | "medium" | "heavy" | "selection" | "warning" | "error";
  sound?: "success" | "error" | "warning" | "notification";
  showToast?: boolean;
  duration?: number;
}

/**
 * Hook para feedback visual, sensorial (vibração) e sonoro
 * Segue boas práticas de UX com feedback imediato
 */
export function useFeedback() {
  // Trigger haptic feedback (vibração)
  const triggerHaptic = useCallback(
    (type: FeedbackOptions["haptic"] = "light") => {
      if (!navigator.vibrate) return;

      const patterns: Record<
        Exclude<FeedbackOptions["haptic"], undefined>,
        number | number[]
      > = {
        light: 10,
        medium: 20,
        heavy: 40,
        selection: [10, 10, 10],
        warning: [30, 10, 30],
        error: [50, 50, 50],
      };

      try {
        navigator.vibrate(patterns[type]);
      } catch (err) {
        // Silently fail if vibrate not supported
      }
    },
    []
  );

  // Play audio feedback
  const playSound = useCallback(
    (type: FeedbackOptions["sound"] = "success") => {
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

      try {
        const soundType = type || "success";
        const frequencies: Record<string, number[]> = {
          success: [800, 1000],
          error: [400, 200],
          warning: [600, 400],
          notification: [500],
        };

        const freqs = frequencies[soundType] || frequencies.success;
        const duration = 0.15;
        const now = audioContext.currentTime;

        freqs.forEach((freq, i) => {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();

          osc.connect(gain);
          gain.connect(audioContext.destination);

          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

          osc.start(now + i * (duration / freqs.length));
          osc.stop(now + (i + 1) * (duration / freqs.length));
        });
      } catch (err) {
        // Silently fail if audio context not available
      }
    },
    []
  );

  // Success feedback: toast + haptic + sound
  const success = useCallback(
    (message: string, options?: FeedbackOptions & { title?: string }) => {
      const { haptic = "light", sound = "success", ...rest } = options || {};

      triggerHaptic(haptic);
      playSound(sound);

      if (options?.showToast !== false) {
        toast.success(message, {
          duration: options?.duration || 2000,
          ...rest,
        });
      }
    },
    [triggerHaptic, playSound]
  );

  // Error feedback: toast + haptic + sound
  const error = useCallback(
    (message: string, options?: FeedbackOptions & { description?: string }) => {
      const { haptic = "error", sound = "error", ...rest } = options || {};

      triggerHaptic(haptic);
      playSound(sound);

      if (options?.showToast !== false) {
        toast.error(message, {
          duration: options?.duration || 3000,
          ...rest,
        });
      }
    },
    [triggerHaptic, playSound]
  );

  // Warning feedback
  const warning = useCallback(
    (message: string, options?: FeedbackOptions & { description?: string }) => {
      const { haptic = "warning", sound = "warning", ...rest } = options || {};

      triggerHaptic(haptic);
      playSound(sound);

      if (options?.showToast !== false) {
        toast.warning(message, {
          duration: options?.duration || 3000,
          ...rest,
        });
      }
    },
    [triggerHaptic, playSound]
  );

  // Info feedback
  const info = useCallback(
    (message: string, options?: FeedbackOptions) => {
      const { haptic = "light", ...rest } = options || {};

      triggerHaptic(haptic);

      if (options?.showToast !== false) {
        toast(message, {
          duration: options?.duration || 2000,
          ...rest,
        });
      }
    },
    [triggerHaptic]
  );

  // Confirmation feedback (strong)
  const confirm = useCallback(
    (message: string, options?: FeedbackOptions) => {
      triggerHaptic("medium");
      playSound("success");

      if (options?.showToast !== false) {
        toast.success(message, {
          duration: options?.duration || 1500,
        });
      }
    },
    [triggerHaptic, playSound]
  );

  // Selection feedback (light)
  const select = useCallback(() => {
    triggerHaptic("selection");
  }, [triggerHaptic]);

  return {
    triggerHaptic,
    playSound,
    success,
    error,
    warning,
    info,
    confirm,
    select,
  };
}
