import {
  Home,
  Flower,
  Plus,
  Bell,
  Baby,
  FileText,
  Camera,
  Heart,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onNewAction?: (action: string) => void;
}

export function BottomNav({
  activeTab,
  onTabChange,
  onNewAction,
}: BottomNavProps) {
  const [isFabExpanded, setIsFabExpanded] = useState(false);

  const tabs = [
    { id: "home", label: "Início", icon: Home },
    { id: "moments", label: "Momentos", icon: Flower },
    { id: "new", label: "Novo", icon: Plus, isFab: true },
    { id: "whispers", label: "Sussurros", icon: Bell },
    { id: "profile", label: "Perfil", icon: Baby },
  ];

  const fabOptions = [
    { id: "note", label: "Momento em Branco", icon: FileText },
    { id: "moment", label: "Momento Sugerido", icon: Camera },
    { id: "letter", label: "Carta ou Cápsula", icon: Heart },
  ];

  const handleFabClick = () => {
    setIsFabExpanded(!isFabExpanded);
  };

  const handleFabOptionClick = (optionId: string) => {
    setIsFabExpanded(false);
    onNewAction?.(optionId);
  };

  return (
    <>
      {/* Opções do FAB */}
      <AnimatePresence>
        {isFabExpanded && (
          <>
            {/* Overlay clicável */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setIsFabExpanded(false)}
              style={{ pointerEvents: "auto" }}
            />
            {/* Menu do FAB */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed z-50 left-1/2 -translate-x-1/2"
              style={{
                bottom: "calc(100px + 1rem)", // Altura da barra (80px) + FAB (-32px) + gap
                pointerEvents: "auto",
              }}
            >
              <div className="bg-card border border-border rounded-2xl p-4 shadow-lg">
                <div className="flex flex-col gap-3">
                  {fabOptions.map((option, index) => {
                    const Icon = option.icon;
                    return (
                      <motion.button
                        key={option.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => {
                          setIsFabExpanded(false);
                          // Corrige: "moment" abre o modal de template
                          if (option.id === "moment") {
                            onNewAction?.("moment");
                          } else {
                            onNewAction?.(option.id);
                          }
                        }}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-accent transition-colors"
                      >
                        <Icon className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium">
                          {option.label}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Barra de navegação */}
      <nav className="w-full flex justify-center pb-4 px-4">
        <div
          className="w-full max-w-2xl border border-border rounded-3xl shadow-2xl px-6 py-3"
          style={{
            background: "var(--card)",
            backgroundColor: "var(--card)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            boxShadow:
              "0 8px 32px 0 rgba(31, 38, 135, 0.10), 0 1.5px 6px 0 rgba(0,0,0,0.04)",
          }}
        >
          <div className="flex items-center justify-between">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              if (tab.isFab) {
                return (
                  <motion.button
                    key={tab.id}
                    onClick={handleFabClick}
                    whileTap={{ scale: 0.95 }}
                    className="relative -mt-8 flex items-center justify-center"
                    aria-label={tab.label}
                  >
                    <motion.div
                      animate={{
                        rotate: isFabExpanded ? 45 : 0,
                        scale: isFabExpanded ? 1.1 : 1,
                      }}
                      transition={{ type: "spring", damping: 20 }}
                      className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white shadow-lg"
                    >
                      <Icon className="w-6 h-6" />
                    </motion.div>
                  </motion.button>
                );
              }

              return (
                <motion.button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  whileTap={{ scale: 1.05 }}
                  className={`flex flex-col items-center gap-1 px-3 py-2 min-w-[60px] transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                  aria-label={tab.label}
                >
                  <motion.div
                    animate={{
                      color: isActive
                        ? "var(--primary)"
                        : "var(--muted-foreground)",
                      filter: isActive
                        ? "drop-shadow(0 0 8px rgba(165, 148, 249, 0.5))"
                        : "none",
                    }}
                  >
                    <Icon className="w-6 h-6" />
                  </motion.div>
                  <span className="text-xs font-medium">{tab.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-primary to-secondary rounded-t-full"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
