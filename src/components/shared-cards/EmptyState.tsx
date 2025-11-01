import React from "react";
import { motion } from "motion/react";
import { cn } from "@/components/ui/utils";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: React.ReactNode;
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
  variant?: "default" | "minimal" | "full";
  fullScreen?: boolean;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  variant = "default",
  fullScreen = false,
}: EmptyStateProps) {
  const defaultIcon = <Package className="w-12 h-12 opacity-50" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex flex-col items-center justify-center text-center",
        variant === "default" && "py-12 px-6",
        variant === "minimal" && "py-8 px-4",
        variant === "full" && "py-16 px-6",
        fullScreen && "min-h-screen"
      )}
    >
      {/* Animated Icon */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", damping: 20, stiffness: 200 }}
        className="mb-4 p-4 rounded-full bg-primary/10"
      >
        <div className="text-4xl text-primary opacity-70">
          {icon || defaultIcon}
        </div>
      </motion.div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-lg font-semibold text-foreground mb-2"
      >
        {title}
      </motion.h3>

      {/* Description */}
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-muted-foreground max-w-xs mb-6"
        >
          {description}
        </motion.p>
      )}

      {/* Actions */}
      {(action || secondaryAction) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex flex-col gap-2 sm:flex-row sm:gap-3"
        >
          {action && (
            <Button
              onClick={action.onClick}
              variant={action.variant || "default"}
              size="sm"
              className="min-h-10"
            >
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              variant="outline"
              size="sm"
              className="min-h-10"
            >
              {secondaryAction.label}
            </Button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
