import type { ComponentType, CSSProperties } from 'react';
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

const bottomOffset = 'calc(env(safe-area-inset-bottom, 0px) + 16px)';

const surfaceStyles: CSSProperties = {
  background:
    'color-mix(in srgb, hsl(var(--background)) 82%, transparent 18%)',
};

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav
      aria-label="Navegação principal"
      className="fixed left-1/2 z-[999] flex w-full max-w-none -translate-x-1/2 justify-center px-4 pb-2 pt-4"
      style={{ bottom: bottomOffset }}
    >
      <div className="w-full max-w-[700px] isolate">
        <div
          className="relative flex items-end justify-between gap-2 rounded-[28px] border border-border/40 bg-background/75 px-4 py-3 shadow-[0_24px_68px_-28px_rgba(15,23,42,0.65)] backdrop-blur-2xl transition-all duration-200 ease-out dark:border-white/10 dark:bg-background/60"
          style={{
            ...surfaceStyles,
            boxShadow:
              '0 24px 80px -28px rgba(15, 23, 42, 0.52), 0 18px 38px -28px rgba(15, 23, 42, 0.35)',
          }}
        >
          <div className="pointer-events-none absolute inset-x-6 bottom-1 -z-10 h-4 rounded-full bg-primary/15 blur-[22px]" />
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
                    className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_24px_42px_-18px_rgba(15,23,42,0.55)] transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    aria-label="Criar novo momento"
                    style={{
                      background:
                        'linear-gradient(140deg, hsl(var(--primary)) 12%, color-mix(in srgb, hsl(var(--primary)) 55%, white 45%) 88%)',
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
                  <span className="text-[11px] font-medium text-muted-foreground">{item.label}</span>
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
                  isActive ? 'text-primary' : 'text-muted-foreground/85'
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
                        className="absolute inset-0 rounded-full bg-primary/18 shadow-[0_8px_16px_-12px_rgba(15,23,42,0.45)]"
                        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
                      />
                    )}
                  </AnimatePresence>
                  <Icon
                    className={`${
                      isActive ? 'h-[22px] w-[22px]' : 'h-5 w-5'
                    } relative transition-all duration-150`}
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
    </nav>
  );
}
