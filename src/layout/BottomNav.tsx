import { useEffect, useRef, useState } from 'react';
import { Baby, Bell, Flower2, Home, Plus } from 'lucide-react';
import { motion } from 'motion/react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    lastScrollYRef.current = window.scrollY;

    const updateScroll = () => {
      const currentScrollY = window.scrollY;
      const lastScrollY = lastScrollYRef.current;
      const delta = currentScrollY - lastScrollY;

      if (currentScrollY < 40) {
        setIsHidden(false);
      } else if (delta > 6) {
        setIsHidden(true);
      } else if (delta < -6) {
        setIsHidden(false);
      }

      lastScrollYRef.current = currentScrollY;
      tickingRef.current = false;
    };

    const handleScroll = () => {
      if (!tickingRef.current) {
        window.requestAnimationFrame(updateScroll);
        tickingRef.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tabs = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'gallery', label: 'Momentos', icon: Flower2 },
    { id: 'chapters', label: 'Novo', icon: Plus, isAction: true },
    { id: 'notifications', label: 'Sussurros', icon: Bell },
    { id: 'profile', label: 'Jornada', icon: Baby },
  ];

  return (
    <motion.nav
      initial={{ y: 0, opacity: 1 }}
      animate={{ y: isHidden ? 120 : 0, opacity: isHidden ? 0 : 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center"
    >
      <div className="pointer-events-auto w-[95%] max-w-xl">
        <div className="flex items-center justify-between gap-2 rounded-full bg-white/80 p-3 shadow-[0_20px_60px_rgba(167,139,250,0.25)] backdrop-blur-md ring-1 ring-white/50 transition-colors dark:bg-zinc-900/70 dark:shadow-[0_20px_60px_rgba(129,140,248,0.15)] dark:ring-white/5">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            if (tab.isAction) {
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className="relative flex flex-col items-center"
                  aria-label={tab.label}
                >
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-fuchsia-400 text-white shadow-[0_18px_45px_rgba(236,72,153,0.45)]"
                  >
                    <Icon className="h-7 w-7" strokeWidth={2.5} />
                  </motion.div>
                  <span className="mt-2 text-[11px] font-medium text-foreground/80">
                    {tab.label}
                  </span>
                </button>
              );
            }

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex flex-1 flex-col items-center gap-1 rounded-2xl px-4 py-2 text-[11px] font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                aria-label={tab.label}
              >
                <span
                  className={`grid h-11 w-11 place-items-center rounded-2xl transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'bg-transparent text-muted-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span>{tab.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="activeTabIndicator"
                    className="absolute -bottom-1 h-1.5 w-8 rounded-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-500"
                    transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
