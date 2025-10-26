import type { ComponentType, CSSProperties } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Baby, BellRing, Flower2, Home, Plus } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

type BottomNavTab = 'home' | 'moments' | 'whispers' | 'profile';
type BottomNavAction = BottomNavTab | 'create';

interface BottomNavProps {
  activeTab: BottomNavTab;
  onTabChange: (tab: BottomNavAction) => void;
}

const items: { id: BottomNavAction; label: string; icon: ComponentType<{ className?: string }>; isAction?: boolean }[] = [
  { id: 'home', label: 'Início', icon: Home },
  { id: 'moments', label: 'Momentos', icon: Flower2 },
  { id: 'create', label: 'Novo', icon: Plus, isAction: true },
  { id: 'whispers', label: 'Sussurros', icon: BellRing },
  { id: 'profile', label: 'Perfil', icon: Baby },
];

const bottomOffset = 'calc(env(safe-area-inset-bottom, 0px) + 8px)';

const surfaceStyles: CSSProperties = {
  background:
    'linear-gradient(145deg, color-mix(in srgb, hsl(var(--background)) 88%, transparent 12%), color-mix(in srgb, hsl(var(--background)) 72%, transparent 28%))',
};

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const hiddenRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    lastScrollY.current = window.scrollY;

    const updateVisibility = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      const isScrollingDown = delta > 6;
      const isScrollingUp = delta < -6;
      const nearTop = currentY < 40;
      const viewportHeight = window.innerHeight;
      const doc = document.documentElement || document.body;
      const docHeight = doc?.scrollHeight ?? 0;
      const atBottom = viewportHeight + currentY >= docHeight - 32;

      if (atBottom || isScrollingUp || nearTop) {
        if (hiddenRef.current) {
          hiddenRef.current = false;
          setIsHidden(false);
        }
      } else if (isScrollingDown) {
        if (!hiddenRef.current) {
          hiddenRef.current = true;
          setIsHidden(true);
        }
      }

      lastScrollY.current = currentY;
    };

    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          updateVisibility();
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <motion.nav
      aria-label="Navegação principal"
      className="fixed left-1/2 z-[1100] flex w-full max-w-none -translate-x-1/2 justify-center px-4 pb-2 pt-4"
      style={{ bottom: bottomOffset }}
      initial={{ opacity: 0, y: 32 }}
      animate={isHidden ? { opacity: 0, y: 96 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.26, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="w-full max-w-[700px] isolate">
        <div
          className="relative flex items-end justify-between gap-2 rounded-[25px] border border-border/30 bg-background/70 px-4 py-3 shadow-[0_30px_70px_-28px_rgba(15,23,42,0.55)] backdrop-blur-2xl transition-all duration-200 ease-out dark:border-white/12 dark:bg-background/50"
          style={{
            ...surfaceStyles,
            boxShadow:
              '0 28px 84px -28px rgba(15, 23, 42, 0.52), 0 18px 42px -28px rgba(15, 23, 42, 0.38)',
          }}
        >
          <div className="pointer-events-none absolute inset-x-6 bottom-1 -z-10 h-4 rounded-full bg-primary/25 blur-[26px]" />
          {items.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            if (item.isAction) {
              return (
                <div key={item.id} className="flex flex-1 flex-col items-center gap-1">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.93 }}
                    onClick={() => onTabChange(item.id)}
                    className="relative flex h-16 w-16 items-center justify-center rounded-full text-primary-foreground shadow-[0_28px_48px_-18px_rgba(15,23,42,0.58)] transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    aria-label="Criar novo momento"
                    style={{
                      background:
                        'linear-gradient(145deg, hsl(var(--primary)) 0%, color-mix(in srgb, hsl(var(--primary)) 64%, white 36%) 42%, color-mix(in srgb, hsl(var(--primary)) 58%, black 8%) 100%)',
                    }}
                  >
                    <motion.span
                      initial={{ scale: 0.92 }}
                      animate={{ scale: 1 }}
                      className="flex items-center justify-center"
                    >
                      <Icon className="h-8 w-8" strokeWidth={2.4} />
                    </motion.span>
                    <span className="sr-only">{item.label}</span>
                  </motion.button>
                  <span className="text-[11px] font-medium text-muted-foreground/90">{item.label}</span>
                </div>
              );
            }

            return (
              <motion.button
                key={item.id}
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => onTabChange(item.id)}
                className={`relative flex flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-1.5 text-[11px] font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  isActive ? 'text-primary' : 'text-muted-foreground/80'
                }`}
                aria-current={isActive ? 'page' : undefined}
                aria-label={item.label}
              >
                <motion.span
                  layout
                  className="relative flex h-11 w-11 items-center justify-center"
                >
                  <AnimatePresence>
                    {isActive && (
                      <motion.span
                        layoutId="bottom-nav-pill"
                        className="absolute inset-0 rounded-full bg-primary/22 shadow-[0_10px_20px_-12px_rgba(15,23,42,0.45)]"
                        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
                      />
                    )}
                  </AnimatePresence>
                  <Icon
                    className={`${
                      isActive ? 'h-[22px] w-[22px]' : 'h-5 w-5'
                    } relative transition-all duration-150`}
                    strokeWidth={isActive ? 2.2 : 1.9}
                  />
                </motion.span>
                <span className="text-[11px]">
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
