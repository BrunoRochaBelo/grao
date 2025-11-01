import React from "react";
import { motion } from "motion/react";
import { cn } from "@/components/ui/utils";
import { AlertCircle, Package } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: "default" | "minimal";
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  variant = "default",
}: EmptyStateProps) {
  const defaultIcon = <Package className="w-12 h-12 opacity-50" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col items-center justify-center text-center",
        variant === "default" && "py-12 px-6",
        variant === "minimal" && "py-8 px-4"
      )}
    >
      <div className="mb-4 text-4xl opacity-60">{icon || defaultIcon}</div>

      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>

      {description && (
        <p className="text-sm text-muted-foreground max-w-xs mb-6">
          {description}
        </p>
      )}

      {action && (
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={action.onClick}
          className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm transition-all duration-200 hover:bg-primary-light"
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
}
