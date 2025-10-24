import { Baby, Bell, Flower2, Home, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/components/ui/utils';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenCreate: () => void;
  isHidden?: boolean;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Início', icon: Home },
  { id: 'gallery', label: 'Momentos', icon: Flower2 },
  { id: 'notifications', label: 'Sussurros', icon: Bell },
  { id: 'profile', label: 'Jornada', icon: Baby },
];

export function BottomNav({ activeTab, onTabChange, onOpenCreate, isHidden = false }: BottomNavProps) {
  const leftItems = NAV_ITEMS.slice(0, 2);
  const rightItems = NAV_ITEMS.slice(2);

  const renderItem = (item: (typeof NAV_ITEMS)[number]) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;

    return (
      <button
        key={item.id}
        type="button"
        onClick={() => onTabChange(item.id)}
        className={cn(
          'flex flex-col items-center gap-1 rounded-full px-3 py-2 text-xs font-medium transition-all duration-200',
          'text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300',
          isActive && 'text-violet-600 dark:text-violet-400 scale-[1.05]'
        )}
        aria-pressed={isActive}
        aria-label={item.label}
      >
        <Icon className={cn('h-5 w-5 transition-transform', isActive ? 'scale-105' : 'scale-100')} />
        <span>{item.label}</span>
      </button>
    );
  };

  return (
    <motion.nav
      initial={{ y: 120, opacity: 0 }}
      animate={{ y: isHidden ? 120 : 0, opacity: isHidden ? 0 : 1 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-4"
    >
      <div
        className="pointer-events-auto relative flex w-full max-w-xl items-center justify-between rounded-full border border-white/60 bg-white/80 px-4 py-2 shadow-[0_20px_45px_-25px_rgba(79,70,229,0.55)] backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/80"
      >
        <div className="flex flex-1 items-center justify-start gap-3">{leftItems.map(renderItem)}</div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          onClick={onOpenCreate}
          className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-xl shadow-fuchsia-400/40"
          aria-label="Novo momento"
        >
          <Plus className="h-7 w-7" />
        </motion.button>
        <div className="flex flex-1 items-center justify-end gap-3">{rightItems.map(renderItem)}</div>
      </div>
    </motion.nav>
  );
}
