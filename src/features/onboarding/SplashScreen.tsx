import { motion } from "motion/react";
import { useEffect } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFDAB9] to-[#A594F9] relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/20 rounded-full blur-xl" />
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-white/20 rounded-full blur-xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
      </motion.div>

      {/* Main content */}
      <div className="text-center z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Livro do Bebê
          </motion.h1>

          {/* Animated flower/heart icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              delay: 0.5,
              duration: 0.8,
              type: "spring",
              bounce: 0.4,
            }}
            className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
          >
            <span className="text-3xl">🌸</span>
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-white/80 text-lg font-medium"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          Guardando memórias desde o primeiro sorriso 🌱
        </motion.p>
      </div>

      {/* Loading indicator */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "60%" }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 h-1 bg-white/30 rounded-full max-w-xs"
      />
    </div>
  );
}
