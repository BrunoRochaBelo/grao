import React from "react";
import { motion } from "motion/react";
import { cn } from "@/components/ui/utils";

interface ActionCardProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  onClick: () => void;
  rightElement?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
}

export function ActionCard({
  icon,
  title,
  subtitle,
  onClick,
  rightElement,
  loading = false,
  disabled = false,
}: ActionCardProps) {
  return (
    <motion.button
      whileTap={disabled ? undefined : { scale: 0.97 }}
      whileHover={disabled ? undefined : { y: -2 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "w-full flex items-center gap-3 p-4 rounded-lg border transition-all duration-200",
        "text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        disabled || loading
          ? "bg-muted border-border opacity-50 cursor-not-allowed"
          : "bg-card border-border hover:shadow-md hover:border-border/60 cursor-pointer"
      )}
    >
      {icon && <div className="flex-shrink-0 text-xl opacity-75">{icon}</div>}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-base text-foreground mb-0.5 line-clamp-1">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-muted-foreground line-clamp-1">
            {subtitle}
          </p>
        )}
      </div>
      {rightElement && (
        <div className="flex-shrink-0 text-muted-foreground">
          {rightElement}
        </div>
      )}
    </motion.button>
  );
}
