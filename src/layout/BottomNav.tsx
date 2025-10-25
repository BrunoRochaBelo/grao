import { Home, Image, PlusCircle, Bell, Baby } from 'lucide-react';
import { motion } from 'motion/react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'gallery', label: 'Galeria', icon: Image },
    { id: 'chapters', label: 'Capítulos', icon: PlusCircle, isAction: true },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'profile', label: 'Perfil', icon: Baby },
  ];

  return (
    <nav
      className="fixed bottom-[10px] left-1/2 z-50 w-full max-w-none -translate-x-1/2 transform bg-card border border-border shadow-2xl backdrop-blur-md overflow-hidden"
      style={{
        borderRadius: '25px',
        maxWidth: '700px',
        width: 'calc(100% - 32px)',
        margin: '0 auto 10px',
      }}
    >
      <div className="flex items-center justify-around px-3 py-2 w-full">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isAction) {
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="flex flex-col items-center gap-1 relative"
                aria-label={tab.label}
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white shadow-lg"
                >
                  <Icon className="w-6 h-6" />
                </motion.div>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 min-w-[44px] min-h-[44px] transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
              aria-label={tab.label}
            >
              <Icon className="w-6 h-6" />
              <span className="text-[11px]">{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-t-full"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
