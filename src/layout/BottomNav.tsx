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
    <nav className="fixed bottom-6 left-1/2 z-50 w-full max-w-xl -translate-x-1/2 px-4">
      <div className="flex items-end justify-between gap-1 rounded-full border border-zinc-200/70 bg-background/95 px-4 py-3 shadow-xl shadow-violet-900/20 backdrop-blur-xl transition-shadow dark:border-zinc-800/70">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isAction) {
            return (
              <motion.button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className="flex flex-col items-center gap-2 -mt-8"
                aria-label={tab.label}
                whileTap={{ scale: 0.92 }}
              >
                <motion.div
                  layout
                  className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg"
                  animate={{ scale: 1.15 }}
                >
                  <Icon className="h-7 w-7" />
                </motion.div>
                <span className="text-[11px] font-medium text-violet-600">{tab.label}</span>
              </motion.button>
            );
          }

          return (
            <motion.button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center gap-1 px-3 pt-1 pb-0"
              aria-label={tab.label}
              whileTap={{ scale: 0.95 }}
            >
              <Icon
                className={`h-5 w-5 transition-transform ${
                  isActive
                    ? 'scale-105 text-violet-600'
                    : 'text-zinc-400'
                }`}
              />
              <span
                className={`text-[11px] font-medium transition-colors ${
                  isActive ? 'text-violet-600' : 'text-zinc-500'
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
