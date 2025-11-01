import React from "react";
import { motion } from "motion/react";
import { cn } from "@/components/ui/utils";

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "accent" | "success";
}

export function InfoCard({
  icon,
  title,
  content,
  onClick,
  variant = "default",
}: InfoCardProps) {
  const baseClasses = cn(
    "rounded-xl p-4 border transition-all duration-200",
    variant === "default" && "bg-card border-border shadow-sm",
    variant === "accent" && "bg-accent/30 border-accent/50 shadow-sm",
    variant === "success" && "bg-success/10 border-success/30 shadow-sm"
  );

  const interactive = onClick
    ? {
        whileTap: { scale: 0.98 },
        whileHover: { y: -1 },
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
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 text-lg opacity-75">{icon}</div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-foreground mb-1">
            {title}
          </h4>
          <div className="text-sm text-muted-foreground">{content}</div>
        </div>
      </div>
    </motion.div>
  );
}
