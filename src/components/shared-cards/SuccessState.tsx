import React from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { cn } from "@/components/ui/utils";
import { Button } from "@/components/ui/button";

interface SuccessStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline";
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  variant?: "card" | "inline" | "full";
  fullScreen?: boolean;
}

export function SuccessState({
  title,
  description,
  action,
  secondaryAction,
  variant = "card",
  fullScreen = false,
}: SuccessStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex items-start gap-3 rounded-lg border border-success/30 bg-success/10 p-4",
        variant === "card" && "flex-col",
        variant === "inline" && "flex-row",
        variant === "full" && "flex-col p-6 rounded-xl",
        fullScreen && "min-h-screen flex justify-center items-center"
      )}
    >
      {/* Icon with animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          delay: 0.1,
          type: "spring",
          damping: 15,
          stiffness: 200,
        }}
        className="p-1"
      >
        <motion.div
          animate={{ rotate: [0, 15, -10, 0] }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Check className="w-5 h-5 text-success flex-shrink-0" />
        </motion.div>
      </motion.div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <motion.h3
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="font-semibold text-sm text-success mb-1"
        >
          {title}
        </motion.h3>

        {description && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xs text-success/80 mb-3"
          >
            {description}
          </motion.p>
        )}

        {/* Actions */}
        {(action || secondaryAction) && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex flex-col gap-2 sm:flex-row sm:gap-2"
          >
            {action && (
              <Button
                onClick={action.onClick}
                variant={action.variant || "outline"}
                size="sm"
                className="min-h-9 text-xs"
              >
                {action.label}
              </Button>
            )}
            {secondaryAction && (
              <Button
                onClick={secondaryAction.onClick}
                variant="ghost"
                size="sm"
                className="min-h-9 text-xs"
              >
                {secondaryAction.label}
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
