import {
  Home,
  GalleryVerticalEnd,
  Plus,
  Bell,
  User,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useScrollDirection } from '../lib/hooks/useScrollDirection';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const scrollDirection = useScrollDirection();

  const tabs = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'gallery', label: 'Momentos', icon: GalleryVerticalEnd },
    { id: 'add', label: 'Novo', icon: Plus, isAction: true },
    { id: 'notifications', label: 'Sussurros', icon: Bell },
    { id: 'profile', label: 'Jornada', icon: User },
  ];

  return (
    <nav
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 transition-transform duration-300 ${
        scrollDirection === 'down' ? 'translate-y-24' : 'translate-y-0'
      }`}
    >
      <div className="flex items-center justify-center gap-2 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-xl rounded-full p-2 shadow-2xl">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isAction) {
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="flex flex-col items-center justify-center gap-1 relative"
                aria-label={tab.label}
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white shadow-lg transform scale-115"
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
              className={`flex flex-col items-center justify-center gap-1 px-4 py-2 min-w-[60px] min-h-[44px] transition-all duration-300 rounded-full ${
                isActive
                  ? 'text-violet-600'
                  : 'text-zinc-400 dark:text-zinc-500'
              }`}
              aria-label={tab.label}
            >
              <motion.div
                animate={{ scale: isActive ? 1.05 : 1 }}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              >
                <Icon className="w-5 h-5" />
              </motion.div>
              <span className="text-[11px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
