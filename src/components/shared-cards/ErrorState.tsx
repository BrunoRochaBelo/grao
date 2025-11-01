import React from "react";
import { motion } from "motion/react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/components/ui/utils";

interface ErrorStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: "card" | "inline";
}

export function ErrorState({
  title,
  description,
  action,
  variant = "card",
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4",
        variant === "card" && "flex-col"
      )}
    >
      <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm text-destructive mb-1">{title}</h3>

        {description && (
          <p className="text-xs text-destructive/80 mb-3">{description}</p>
        )}

        {action && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={action.onClick}
            className="text-xs font-semibold text-destructive hover:text-destructive/80 transition-colors"
          >
            {action.label}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
