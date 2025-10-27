import { motion } from "motion/react";
import { getMomentTypeIcon } from "../utils/timelineUtils";

interface EmptyPlaceholderProps {
  name: string;
  templateType: string;
  onTap?: () => void;
}

export function EmptyPlaceholder({
  name,
  templateType,
  onTap,
}: EmptyPlaceholderProps) {
  const icon = getMomentTypeIcon(undefined, templateType);

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      onClick={onTap}
      className="w-full"
    >
      <div className="bg-card border-2 border-dashed border-border rounded-2xl p-6 hover:border-primary/50 hover:bg-muted/30 transition-all">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Icon */}
          <div className="text-4xl mb-3">{icon}</div>

          {/* Name */}
          <h4 className="font-semibold text-foreground mb-2">{name}</h4>

          {/* Status Badge */}
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
            ○ Não registrado
          </div>

          {/* Hint */}
          <p className="text-xs text-muted-foreground mt-3">
            Toque para registrar este momento
          </p>
        </div>
      </div>
    </motion.button>
  );
}
