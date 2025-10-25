import { motion } from 'motion/react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isHidden?: boolean;
}

const tabs = [
  { id: 'home', label: 'Início', icon: '🏠' },
  { id: 'gallery', label: 'Momentos', icon: '🌸' },
  { id: 'chapters', label: 'Novo', icon: '➕', isAction: true },
  { id: 'notifications', label: 'Sussurros', icon: '🔔' },
  { id: 'profile', label: 'Jornada', icon: '👶' },
];

export function BottomNav({ activeTab, onTabChange, isHidden = false }: BottomNavProps) {
  return (
    <motion.nav
      initial={{ y: 120, opacity: 0 }}
      animate={{ y: isHidden ? 120 : 0, opacity: isHidden ? 0 : 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 30 }}
      className="fixed inset-x-0 bottom-5 z-50 flex justify-center px-4 pointer-events-none"
      aria-label="Navegação principal"
    >
      <div
        className="pointer-events-auto flex w-full max-w-xl items-center justify-between gap-1 rounded-full border border-white/40 bg-white/80 px-2 py-2 shadow-lg shadow-black/5 backdrop-blur-xl transition-colors dark:border-white/10 dark:bg-zinc-900/80"
      >
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;

          if (tab.isAction) {
            return (
              <motion.button
                key={tab.id}
                whileTap={{ scale: 0.94 }}
                onClick={() => onTabChange(tab.id)}
                className="flex h-16 w-16 items-center justify-center"
                aria-label={tab.label}
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-2xl text-white shadow-lg shadow-violet-500/40">
                  {tab.icon}
                </span>
              </motion.button>
            );
          }

          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.98 }}
              animate={{ scale: isActive ? 1.05 : 1 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              onClick={() => onTabChange(tab.id)}
              className={`flex min-h-[44px] min-w-[56px] flex-col items-center rounded-full px-3 py-2 text-[11px] font-medium transition-colors ${
                isActive ? 'text-violet-600 dark:text-violet-300' : 'text-zinc-400 dark:text-zinc-500'
              }`}
              aria-label={tab.label}
            >
              <span className="text-xl leading-none">{tab.icon}</span>
              <span className="mt-1">{tab.label}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
}
