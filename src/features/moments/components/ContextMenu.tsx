import { motion } from "motion/react";
import { useState } from "react";

export interface ContextMenuAction {
  id: string;
  label: string;
  icon: string;
  color?: string;
  onClick: () => void;
}

interface ContextMenuProps {
  x: number;
  y: number;
  actions: ContextMenuAction[];
  onClose: () => void;
}

export function ContextMenu({ x, y, actions, onClose }: ContextMenuProps) {
  const [isClosing, setIsClosing] = useState(false);

  const handleAction = (action: ContextMenuAction) => {
    setIsClosing(true);
    setTimeout(() => {
      action.onClick();
      onClose();
    }, 150);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.15 }}
      className="fixed z-50 bg-card border border-border rounded-2xl shadow-lg overflow-hidden"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="min-w-[180px] py-2">
        {actions.map((action) => (
          <motion.button
            key={action.id}
            onClick={() => handleAction(action)}
            whileHover={{ backgroundColor: "var(--color-muted)" }}
            className="w-full text-left px-4 py-3 flex items-center gap-2 text-sm transition-colors"
            disabled={isClosing}
          >
            <span className="text-base">{action.icon}</span>
            <span className={action.color ? action.color : "text-foreground"}>
              {action.label}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
