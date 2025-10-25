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
        className="relative bg-card/75 backdrop-blur-lg border border-border/50 shadow-lg"
        style={{
          borderRadius: '25px',
          maxWidth: '700px',
          margin: '0 auto',
        }}
      >
        <div className="flex items-center justify-around px-2 py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            if (tab.isAction) {
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className="flex flex-col items-center gap-1 relative transform active:scale-95 transition-transform scale-115"
                  aria-label={tab.label}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white shadow-lg">
                    <Icon className="w-7 h-7" />
                  </div>
                </button>
              );
            }

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center gap-1.5 px-3 py-1.5 min-w-[44px] min-h-[44px] transition-all duration-300 ease-in-out ${
                  isActive ? 'text-violet-600 scale-105' : 'text-zinc-400'
                }`}
                aria-label={tab.label}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
