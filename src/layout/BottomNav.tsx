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
    { id: "whispers", label: "Notificações", icon: Bell },
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

  return (
    <>
      {/* Overlay para fechar FAB menu */}
      <AnimatePresence>
        {isFabExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFabExpanded(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 touch-none"
          />
        )}
      </AnimatePresence>

      {/* Menu do FAB - Expandível */}
      <AnimatePresence>
        {isFabExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 250 }}
            className="fixed z-50 left-1/2 -translate-x-1/2 pointer-events-auto"
            style={{
              bottom: "calc(80px + 20px)",
            }}
          >
            <motion.div className="bg-card border border-border rounded-2xl p-3 shadow-xl dark:shadow-2xl">
              <div className="flex flex-col gap-2">
                {fabOptions.map((option, index) => {
                  const Icon = option.icon;
                  return (
                    <motion.button
                      key={option.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{
                        delay: isFabExpanded ? index * 0.06 : 0,
                        duration: 0.2,
                      }}
                      onClick={() => {
                        setIsFabExpanded(false);
                        if (option.id === "moment") {
                          onNewAction?.("moment");
                        } else {
                          onNewAction?.(option.id);
                        }
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent/70 active:bg-accent transition-colors touch-manipulation min-h-12"
                    >
                      <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm font-medium whitespace-nowrap">
                        {option.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Barra de navegação fixa na base */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 px-4 py-2">
        <div className="w-full max-w-2xl mx-auto">
          <div className="glass-nav border rounded-3xl shadow-lg px-4 py-2">
            <div className="flex items-center justify-between">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                if (tab.isFab) {
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={handleFabClick}
                      whileTap={{ scale: 0.92 }}
                      whileHover={{ scale: 1.05 }}
                      className="relative -mt-10 flex items-center justify-center touch-manipulation cursor-pointer"
                      aria-label={tab.label}
                    >
                      {/* Glow effect */}
                      <motion.div
                        animate={{
                          opacity: isFabExpanded ? 0.7 : 0.4,
                          scale: isFabExpanded ? 1.2 : 1,
                        }}
                        transition={{
                          type: "spring",
                          damping: 20,
                          stiffness: 250,
                        }}
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/30 to-blue-400/30 blur-xl"
                      />

                      {/* Button */}
                      <motion.div
                        animate={{
                          rotate: isFabExpanded ? 45 : 0,
                          scale: isFabExpanded ? 1.1 : 1,
                        }}
                        transition={{
                          type: "spring",
                          damping: 22,
                          stiffness: 280,
                        }}
                        className="fab-button relative w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-xl hover:shadow-2xl transition-all duration-200"
                        style={{
                          boxShadow: isFabExpanded
                            ? "0 20px 40px rgba(37, 99, 235, 0.6)"
                            : "0 10px 25px rgba(37, 99, 235, 0.4)",
                        }}
                      >
                        <Icon className="w-7 h-7" />
                      </motion.div>
                    </motion.button>
                  );
                }

                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => {
                      onTabChange(tab.id);
                      setIsFabExpanded(false);
                    }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex flex-col items-center justify-center gap-1 px-2 py-3 min-h-12 min-w-[56px] rounded-xl transition-all duration-150 touch-manipulation relative ${
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground/70"
                    }`}
                    aria-label={tab.label}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <motion.div
                      animate={{
                        scale: isActive ? 1.1 : 1,
                        color: isActive
                          ? "var(--primary)"
                          : "var(--muted-foreground)",
                      }}
                      transition={{ type: "spring", damping: 20 }}
                    >
                      <Icon className="w-6 h-6" />
                    </motion.div>
                    <span className="text-xs font-semibold leading-tight line-clamp-1">
                      {tab.label}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-1 bg-primary rounded-t-full"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.5,
                        }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer para não sobrepor conteúdo */}
      <div className="h-24" />
    </>
  );
}
