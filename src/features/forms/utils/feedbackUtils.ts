/**
 * Utilitários para microinterações: sons, vibrações, animações
 */

/**
 * Sons suaves para feedback
 */
export const FEEDBACK_SOUNDS = {
  // Som de sucesso (sine wave, 440Hz + 554Hz, 200ms)
  success: () => playTone({ frequencies: [440, 554], duration: 200 }),

  // Som de erro (sine wave, 220Hz, 300ms)
  error: () => playTone({ frequencies: [220], duration: 300 }),

  // Som de popup suave (440Hz, 100ms)
  pop: () => playTone({ frequencies: [440], duration: 100 }),

  // Som de validação (três tons: 523, 659, 783)
  validation: () => playTone({ frequencies: [523, 659, 783], duration: 150 }),

  // Som de tap suave
  tap: () => playTone({ frequencies: [330], duration: 50 }),

  // Som de autosave (sino suave)
  autosave: () => playTone({ frequencies: [587, 659], duration: 100 }),
};

interface ToneOptions {
  frequencies: number[];
  duration: number;
}

function playTone({ frequencies, duration }: ToneOptions) {
  if (!("AudioContext" in window || "webkitAudioContext" in window)) {
    return;
  }

  try {
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const now = audioContext.currentTime;
    const gain = audioContext.createGain();
    gain.connect(audioContext.destination);

    frequencies.forEach((freq, index) => {
      const osc = audioContext.createOscillator();
      osc.frequency.value = freq;
      osc.connect(gain);

      const startTime = now + (index * duration) / frequencies.length / 1000;
      const endTime = startTime + duration / frequencies.length / 1000;

      osc.start(startTime);
      osc.stop(endTime);
    });

    // Envelope ADSR suave
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration / 1000);
  } catch (error) {
    console.warn("Audio feedback not available:", error);
  }
}

/**
 * Vibrações hápticas
 */
export const HAPTIC_FEEDBACK = {
  // Vibração suave de sucesso
  success: () => vibrate([50, 100, 50]),

  // Vibração de erro (mais longa e forte)
  error: () => vibrate([100, 50, 100]),

  // Vibração de tap
  tap: () => vibrate([10]),

  // Vibração de seleção
  select: () => vibrate([20, 30]),

  // Vibração dupla
  double: () => vibrate([30, 50, 30]),
};

function vibrate(pattern: number | number[]) {
  if ("vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}

/**
 * Utilitário para combinar som + vibração
 */
export function triggerFeedback(
  type: "success" | "error" | "tap" | "pop" | "validation"
) {
  const soundMap = {
    success: FEEDBACK_SOUNDS.success,
    error: FEEDBACK_SOUNDS.error,
    tap: FEEDBACK_SOUNDS.tap,
    pop: FEEDBACK_SOUNDS.pop,
    validation: FEEDBACK_SOUNDS.validation,
  };

  const hapticMap = {
    success: HAPTIC_FEEDBACK.success,
    error: HAPTIC_FEEDBACK.error,
    tap: HAPTIC_FEEDBACK.tap,
    pop: HAPTIC_FEEDBACK.tap,
    validation: HAPTIC_FEEDBACK.double,
  };

  // Executar ambos em paralelo
  soundMap[type]?.();
  hapticMap[type]?.();
}

/**
 * Animar dissolução de elemento (memória não registrada)
 */
export const animationVariants = {
  // Dissolução de partículas
  dissolve: {
    initial: { opacity: 1, scale: 1 },
    exit: {
      opacity: 0,
      scale: 0.5,
      filter: "blur(4px)",
      transition: { duration: 0.6, ease: "easeInOut" },
    },
  },

  // Entrada com bounce
  entryBounce: {
    initial: { opacity: 0, scale: 0.8, y: 20 },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 260, damping: 20 },
    },
  },

  // Fade suave
  fadeSoft: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  },

  // Label flutuante
  floatingLabel: {
    focused: { y: -24, scale: 0.9, color: "rgb(165, 148, 249)" },
    unfocused: { y: 0, scale: 1, color: "rgb(107, 114, 128)" },
  },

  // Shimmer (carregamento)
  shimmer: {
    animate: {
      backgroundPosition: ["200% 0", "-200% 0"],
      transition: { duration: 2, repeat: Infinity, ease: "linear" },
    },
  },

  // Pulse sutil
  pulse: {
    animate: {
      opacity: [0.8, 1, 0.8],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
    },
  },

  // Rotação de spinner
  spin: {
    animate: {
      rotate: 360,
      transition: { duration: 1, repeat: Infinity, ease: "linear" },
    },
  },
};

/**
 * Gerar feedback de validação com animação
 */
export function getValidationFeedback(
  isValid: boolean,
  fieldValue: any
): {
  icon?: React.ReactNode;
  color: string;
  animate?: Record<string, any>;
} {
  if (!fieldValue) {
    return { color: "text-muted-foreground" };
  }

  if (isValid) {
    return {
      color: "text-success",
      animate: { scale: [0, 1.2, 1], opacity: 1 },
    };
  }

  return {
    color: "text-destructive",
    animate: { x: [-8, 8, -8, 8, 0] },
  };
}

/**
 * Util para criar mensagens de sucesso contextualizadas
 */
export const SUCCESS_MESSAGES: Record<string, string> = {
  growth: "Crescimento atualizado 📈",
  vaccine: "Vacina registrada 💉",
  "sleep-humor": "Registrado com bom humor ☀️",
  monthsary: "Mais um mês de amor 🎂",
  letter: "Carta selada para o futuro 💌",
  "family-member": "Novo ramo na árvore 🌿",
  "free-note": "Momento capturado ✨",
  moment: "Momento adicionado à história 🌸",
};

/**
 * Delay para criar efeito de timing
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
