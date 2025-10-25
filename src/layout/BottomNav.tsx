import { motion } from 'motion/react';
import { Baby, Bell, Flower2, Home, Plus } from 'lucide-react';
import type { ComponentType } from 'react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface NavigationItem {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  fab?: boolean;
}

const NAV_ITEMS: NavigationItem[] = [
  { id: 'home', label: 'Início', icon: Home },
  { id: 'moments', label: 'Momentos', icon: Flower2 },
  { id: 'create', label: 'Novo', icon: Plus, fab: true },
  { id: 'whispers', label: 'Sussurros', icon: Bell },
  { id: 'profile', label: 'Perfil', icon: Baby },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 w-full px-4 pointer-events-none">
      <div className="max-w-md mx-auto flex justify-center">
        <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-md border border-zinc-200 px-5 py-2 shadow">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            if (item.fab) {
              return (
                <motion.button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  whileTap={{ scale: 0.92 }}
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white flex items-center justify-center shadow-lg"
                  aria-label={item.label}
                >
                  <Icon className="w-6 h-6" />
                </motion.button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`relative flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-[56px] min-h-[44px] rounded-full transition-transform ${
                  isActive ? 'text-violet-600 scale-105' : 'text-zinc-400'
                }`}
                aria-label={item.label}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[11px] font-medium">{item.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="bottom-nav-active"
                    className="absolute inset-0 -z-10 rounded-full bg-violet-50"
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
