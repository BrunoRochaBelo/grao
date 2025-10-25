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
    <nav className="fixed inset-x-0 bottom-3 z-50 px-4">
      <div className="mx-auto flex max-w-md items-end justify-between gap-2 rounded-full border border-border bg-card px-4 py-2 shadow-2xl backdrop-blur-sm">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isAction) {
            return (
              <motion.button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className="flex flex-col items-center gap-1 -translate-y-1/2 flex-shrink-0"
                aria-label={tab.label}
                whileTap={{ scale: 0.92 }}
              >
                <motion.div
                  layout
                  className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg"
                  animate={{ scale: 1.12 }}
                  style={{
                    background:
                      'linear-gradient(135deg, var(--highlight-lavender), #f6a1d4)',
                  }}
                >
                  <Icon className="h-7 w-7" />
                </motion.div>
                <span className="text-xs font-medium text-primary">{tab.label}</span>
              </motion.button>
            );
          }

          return (
            <motion.button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-1 flex-col items-center gap-1 px-3 py-1"
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
                className={`text-xs font-medium transition-colors ${
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
