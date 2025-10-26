import { Home, Flower2, Plus, Sparkles, Baby } from 'lucide-react';
import { motion } from 'motion/react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'momentos', label: 'Momentos', icon: Flower2 },
    { id: 'add', label: 'Novo', icon: Plus, isAction: true },
    { id: 'sussurros', label: 'Sussurros', icon: Sparkles },
    { id: 'profile', label: 'Perfil', icon: Baby },
  ];

  return (
    <nav className="fixed bottom-4 left-0 right-0 z-50 flex justify-center">
      <div
        className="flex items-center justify-around w-full max-w-[calc(100%-32px)] sm:max-w-md mx-auto h-16
                   rounded-2xl shadow-soft backdrop-blur-md
                   bg-card/70 border border-border"
      >
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isAction) {
            return (
              <button
                key={tab.id}
                id="add"
                onClick={() => onTabChange(tab.id)}
                className="flex-1 flex justify-center items-center h-full relative"
                aria-label={tab.label}
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="w-16 h-16 -translate-y-4 rounded-full flex items-center justify-center
                             bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-lg"
                >
                  <Icon className="w-7 h-7" />
                </motion.div>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex-1 flex flex-col items-center justify-center gap-1 h-full relative"
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <motion.div
                animate={{ scale: isActive ? 1.1 : 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                className={`flex flex-col items-center gap-1 ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[11px] font-medium">{tab.label}</span>
              </motion.div>
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-1 w-1.5 h-1.5 bg-primary rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
