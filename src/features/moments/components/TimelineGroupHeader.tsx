import { motion } from "motion/react";

interface TimelineGroupHeaderProps {
  monthYear: string;
}

export function TimelineGroupHeader({ monthYear }: TimelineGroupHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-10 bg-gradient-to-b from-background via-background to-transparent px-4 py-4 mb-4"
    >
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border"></div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          {monthYear}
        </h3>
        <div className="flex-1 h-px bg-border"></div>
      </div>
    </motion.div>
  );
}
