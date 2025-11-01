import React from "react";
import { motion } from "motion/react";
import { cn } from "@/components/ui/utils";

interface LoadingStateProps {
  title?: string;
  description?: string;
  variant?: "card" | "full" | "minimal";
}

export function LoadingState({
  title = "Carregando...",
  description,
  variant = "card",
}: LoadingStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        variant === "full" && "flex items-center justify-center min-h-screen",
        variant === "card" && "py-8 px-6",
        variant === "minimal" && "py-4 px-4"
      )}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Animated spinner */}
        <div className="relative w-10 h-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-3 border-transparent border-t-primary border-r-primary/50"
          />
        </div>

        {title && (
          <p className="text-sm font-medium text-foreground">{title}</p>
        )}

        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </motion.div>
  );
}
