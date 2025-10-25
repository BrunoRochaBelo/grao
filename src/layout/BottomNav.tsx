import { useEffect, useMemo, useRef, useState, type ComponentType } from 'react';
import { Home, Flower2, Plus, Bell, Baby } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface TabConfig {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  isAction?: boolean;
}

const useScrollDirection = () => {
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (Math.abs(currentScrollY - lastScrollY.current) < 6) return;

      if (currentScrollY > lastScrollY.current) {
        setDirection('down');
      } else {
        setDirection('up');
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return direction;
};

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const direction = useScrollDirection();

  const tabs: TabConfig[] = useMemo(
    () => [
      { id: 'home', label: 'Início', icon: Home },
      { id: 'gallery', label: 'Momentos', icon: Flower2 },
      { id: 'chapters', label: 'Novo', icon: Plus, isAction: true },
      { id: 'notifications', label: 'Sussurros', icon: Bell },
      { id: 'profile', label: 'Perfil', icon: Baby },
    ],
    [],
  );

  return (
    <AnimatePresence>
      <motion.nav
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: direction === 'down' ? 120 : 0, opacity: 1 }}
        exit={{ y: 120, opacity: 0 }}
        transition={{ type: 'spring', damping: 22, stiffness: 180 }}
        className="fixed bottom-5 left-1/2 z-50 w-full max-w-xl -translate-x-1/2 px-4"
      >
        <div className="mx-auto flex w-full items-center justify-between gap-2 rounded-full bg-white/80 px-5 py-3 shadow-[0px_18px_60px_-25px_rgba(79,70,229,0.45)] backdrop-blur-xl">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            if (tab.isAction) {
              return (
                <motion.button
                  key={tab.id}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => onTabChange(tab.id)}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg"
                  aria-label={tab.label}
                >
                  <Icon className="h-7 w-7" />
                </motion.button>
              );
            }

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="group relative flex flex-1 flex-col items-center gap-1"
                aria-label={tab.label}
              >
                <Icon
                  className={`h-5 w-5 transition-transform duration-200 ${
                    isActive
                      ? 'scale-[1.05] text-violet-600'
                      : 'text-zinc-400 group-hover:text-zinc-500'
                  }`}
                />
                <span
                  className={`text-[11px] font-medium transition-colors ${
                    isActive ? 'text-violet-600' : 'text-zinc-400'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </motion.nav>
    </AnimatePresence>
  );
}
