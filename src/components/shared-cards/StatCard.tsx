import React from "react";
import { motion } from "motion/react";
import { cn } from "@/components/ui/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "elevated" | "highlighted";
  loading?: boolean;
}

export function StatCard({
  label,
  value,
  icon,
  onClick,
  variant = "default",
  loading = false,
}: StatCardProps) {
  const baseClasses = cn(
    "rounded-xl p-5 border transition-all duration-200",
    "touch-manipulation select-none",
    variant === "default" && "bg-card border-border shadow-sm hover:shadow-md",
    variant === "elevated" && "bg-card border-border shadow-md hover:shadow-lg",
    variant === "highlighted" &&
      "bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30 shadow-sm"
  );

  const interactive = onClick
    ? {
        whileTap: { scale: 0.98 },
        whileHover: { y: -2 },
        as: "button",
        onClick,
      }
    : { as: "div" };

  return (
    <motion.div
      {...(interactive as any)}
      className={cn(
        baseClasses,
        onClick &&
          "cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        {icon && (
          <div className="text-2xl flex-shrink-0 opacity-75">{icon}</div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1.5">
            {label}
          </p>
          {loading ? (
            <div className="h-8 bg-muted rounded-md animate-pulse" />
          ) : (
            <p className="text-3xl font-bold text-foreground">{value}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
