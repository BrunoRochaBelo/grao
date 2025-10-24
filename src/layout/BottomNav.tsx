import { Home, Image, PlusCircle, Bell, Baby } from 'lucide-react';
import { motion } from 'motion/react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'gallery', label: 'Galeria', icon: Image },
    { id: 'chapters', label: 'Capítulos', icon: PlusCircle, isAction: true },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'profile', label: 'Perfil', icon: Baby },
  ];

  return (
    <nav
      className="pointer-events-none fixed inset-x-0 bottom-2 z-50 flex justify-center px-5"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 0.5rem)' }}
      aria-label="Navegação principal"
    >
      <div className="nav-shell pointer-events-auto flex w-full max-w-xl items-center justify-between gap-1 px-3 py-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isAction) {
            return (
              <div key={tab.id} className="flex flex-1 justify-center">
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={() => onTabChange(tab.id)}
                  className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground shadow-lg shadow-primary/25"
                  aria-label={tab.label}
                >
                  <motion.span
                    layoutId="navAction"
                    className="absolute inset-0 rounded-full bg-white/20"
                    transition={{ type: 'spring', stiffness: 220, damping: 20 }}
                  />
                  <Icon className="relative z-10 h-6 w-6" />
                </motion.button>
              </div>
            );
          }

          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.94 }}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-1 flex-col items-center gap-1 rounded-2xl px-3 py-2 text-xs font-medium transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
              aria-label={tab.label}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[11px] leading-none">{tab.label}</span>
              {isActive && (
                <motion.span
                  layoutId="activeTab"
                  className="absolute bottom-1 left-1/2 h-[3px] w-12 -translate-x-1/2 rounded-full bg-primary/80"
                  transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
