import { Home, Bell, Baby, Flower, Plus } from 'lucide-react';
import { motion } from 'motion/react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'momentos', label: 'Momentos', icon: Flower },
    { id: 'add', label: 'Novo', icon: Plus, isAction: true },
    { id: 'sussurros', label: 'Sussurros', icon: Bell },
    { id: 'profile', label: 'Perfil', icon: Baby },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-3 px-3">
      <div
        className="relative bg-card/80 backdrop-blur-xl border border-border/60 shadow-lg max-w-lg mx-auto"
        style={{
          borderRadius: '25px',
        }}
      >
        <div className="flex items-center justify-around px-2 py-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            if (tab.isAction) {
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className="flex flex-col items-center gap-1 relative transform scale-115"
                  aria-label={tab.label}
                  whileTap={{ scale: 1.1 }}
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center text-white shadow-xl">
                    <Icon className="w-7 h-7" />
                  </div>
                </motion.button>
              );
            }

            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex flex-col items-center gap-1.5 px-3 py-1.5 min-w-[44px] min-h-[44px] transition-colors duration-300 ${
                  isActive ? 'text-violet-600' : 'text-zinc-400 hover:text-violet-500'
                }`}
                aria-label={tab.label}
                whileTap={{ scale: 0.95 }}
                animate={{ scale: isActive ? 1.05 : 1 }}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{tab.label}</span>
                {isActive && (
                  <motion.div
                    className="absolute -bottom-1.5 h-1 w-1 bg-violet-600 rounded-full"
                    layoutId="active-indicator"
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
