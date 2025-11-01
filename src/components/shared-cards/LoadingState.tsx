import React from "react";
import { motion } from "motion/react";
import { cn } from "@/components/ui/utils";
import { Loader } from "lucide-react";

interface LoadingStateProps {
  title?: string;
  description?: string;
  variant?: "card" | "full" | "minimal" | "overlay";
  showProgress?: boolean;
  progress?: number;
}

export function LoadingState({
  title = "Carregando...",
  description,
  variant = "card",
  showProgress = false,
  progress = 0,
}: LoadingStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn(
        "flex items-center justify-center",
        variant === "full" && "min-h-screen",
        variant === "card" && "py-8 px-6",
        variant === "minimal" && "py-4 px-4",
        variant === "overlay" &&
          "fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
      )}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Animated spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader className="w-8 h-8 text-primary" />
        </motion.div>

        {title && (
          <p className="text-sm font-medium text-foreground text-center">
            {title}
          </p>
        )}

        {description && (
          <p className="text-xs text-muted-foreground text-center max-w-sm">
            {description}
          </p>
        )}

        {showProgress && (
          <div className="w-32 h-1 bg-muted rounded-full overflow-hidden mt-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(progress, 10)}%` }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className="h-full bg-primary"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
