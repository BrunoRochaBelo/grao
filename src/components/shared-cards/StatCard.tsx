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
    "rounded-xl p-6 border-2 transition-all duration-200",
    "touch-manipulation select-none min-h-[120px] flex items-center",
    variant === "default" && "bg-card border-border shadow-md hover:shadow-lg",
    variant === "elevated" && "bg-card border-border shadow-lg hover:shadow-xl",
    variant === "highlighted" &&
      "bg-gradient-to-br from-primary/10 to-accent/10 border-primary/40 shadow-md hover:shadow-lg"
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
          "cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary hover:scale-102 active:scale-98"
      )}
    >
      <div className="flex items-center justify-between gap-4 w-full">
        {icon && (
          <div className="text-3xl flex-shrink-0 opacity-80">{icon}</div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-2">
            {label}
          </p>
          {loading ? (
            <div className="h-10 bg-muted rounded-md animate-pulse" />
          ) : (
            <p className="text-4xl font-extrabold text-foreground tracking-tight">{value}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
