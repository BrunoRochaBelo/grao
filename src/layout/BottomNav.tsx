import { Home, Flower2, Plus, Bell, Baby } from 'lucide-react';
import { motion } from 'motion/react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'gallery', label: 'Momentos', icon: Flower2 },
    { id: 'new', label: 'Novo', icon: Plus, isAction: true },
    { id: 'notifications', label: 'Sussurros', icon: Bell },
    { id: 'profile', label: 'Perfil', icon: Baby },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-4 z-50 px-4 sm:bottom-6">
      <div className="mx-auto flex w-full max-w-lg items-center justify-between gap-2 rounded-3xl border border-border/60 bg-card/95 px-5 py-3 shadow-2xl backdrop-blur">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isAction) {
            return (
              <motion.button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className="-translate-y-3 flex flex-col items-center gap-1.5 shrink-0"
                aria-label={tab.label}
                whileTap={{ scale: 0.92 }}
              >
                <motion.div
                  layout
                  className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg"
                  animate={{ scale: 1.15 }}
                  style={{
                    background:
                      'linear-gradient(135deg, var(--highlight-lavender), #f6a1d4)',
                  }}
                >
                  <Icon className="h-7 w-7" />
                </motion.div>
              </motion.button>
            );
          }

          return (
            <motion.button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-1 flex-col items-center gap-1.5 px-2.5 py-1.5"
              aria-label={tab.label}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                animate={{ scale: isActive ? 1.05 : 1 }}
                className={`transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Icon className="h-5 w-5" />
              </motion.span>
              <span
                className={`text-[11px] font-medium leading-4 transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
