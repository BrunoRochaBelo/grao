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
    <nav className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 sm:bottom-6 sm:px-6">
      <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-1.5 rounded-full border border-zinc-200/70 bg-white/90 px-3 py-2 shadow-[0_18px_45px_-20px_rgba(91,33,182,0.55)] backdrop-blur-xl transition-all dark:border-white/10 dark:bg-zinc-900/80">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isAction) {
            return (
              <motion.button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className="-translate-y-6 flex shrink-0 items-center justify-center"
                aria-label={tab.label}
                whileTap={{ scale: 0.92 }}
              >
                <motion.div
                  layout
                  animate={{ scale: 1.15 }}
                  className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-[0_12px_30px_-12px_rgba(217,70,239,0.65)]"
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
              className="relative flex flex-1 flex-col items-center gap-1.5 px-3 py-2"
              aria-label={tab.label}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                animate={{ scale: isActive ? 1.05 : 1 }}
                className={`transition-colors ${
                  isActive
                    ? 'text-violet-600 dark:text-violet-400'
                    : 'text-zinc-400 dark:text-zinc-500'
                }`}
              >
                <Icon className="h-5 w-5" />
              </motion.span>
              <span
                className={`text-[11px] font-medium leading-4 transition-colors ${
                  isActive
                    ? 'text-foreground'
                    : 'text-zinc-400 dark:text-zinc-500'
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
