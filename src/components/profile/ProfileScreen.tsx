import { useState } from 'react';
import { getCurrentBaby, calculateAge, chapters, getMoments, getPlaceholdersForChapter, getBabyAgeInDays } from '../../lib/mockData';
import { Download, Settings, Bell, HelpCircle, ChevronRight, Users, Moon, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Switch } from '../ui/switch';
import { useTheme } from '../../lib/theme-context';

interface ProfileScreenProps {
  onNavigateToManageBabies: () => void;
  onNavigateToExportAlbum: () => void;
  onNavigateToManageAccount: () => void;
  onNavigateToNotificationsSettings: () => void;
  onNavigateToHelpAndSupport: () => void;
  onNavigateToAddBaby: () => void;
}

interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onClick?: () => void;
}

function ActionCard({ icon, title, subtitle, onClick }: ActionCardProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="bg-card rounded-xl p-4 shadow-sm border border-border hover:shadow-md transition-shadow text-left w-full flex items-center gap-3"
    >
      <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-foreground">{title}</p>
        {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
      </div>
      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
    </motion.button>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="bg-card rounded-xl p-4 shadow-sm border border-border text-center">
      <p className="text-2xl text-foreground mb-1">{value}</p>
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
}

export function ProfileScreen({
  onNavigateToManageBabies,
  onNavigateToExportAlbum,
  onNavigateToManageAccount,
  onNavigateToNotificationsSettings,
  onNavigateToHelpAndSupport,
  onNavigateToAddBaby,
}: ProfileScreenProps) {
  const [currentBaby] = useState(getCurrentBaby());
  const { theme, toggleTheme } = useTheme();

  const age = calculateAge(currentBaby.birthDate);
  const moments = getMoments();
  const babyAgeInDays = getBabyAgeInDays(currentBaby.birthDate);
  
  // Calculate actual progress
  let totalCompleted = 0;
  let totalMoments = 0;
  
  chapters.forEach(chapter => {
    const placeholders = getPlaceholdersForChapter(chapter.id, babyAgeInDays);
    const completed = placeholders.filter(p => moments.some(m => m.templateId === p.id)).length;
    totalCompleted += completed;
    totalMoments += placeholders.length;
  });
  
  const completionPercentage = totalMoments > 0 ? Math.round((totalCompleted / totalMoments) * 100) : 0;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="pb-24 px-4 pt-6 max-w-2xl mx-auto">
      {/* Baby Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <button onClick={onNavigateToManageBabies} className="relative inline-block mb-4 group">
          <Avatar className="w-24 h-24 border-4 border-primary mx-auto">
            <AvatarImage src={currentBaby.avatar} alt={currentBaby.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-3xl">
              {getInitials(currentBaby.name)}
            </AvatarFallback>
          </Avatar>
          <div
            className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg group-hover:bg-primary/90 transition-colors"
            aria-label="Trocar bebê"
          >
            <Users className="w-4 h-4" />
          </div>
        </button>
        <h1 className="text-foreground mb-1">{currentBaby.name}</h1>
        <p className="text-muted-foreground">{age}</p>
        <p className="text-muted-foreground text-sm">{currentBaby.city}</p>
      </motion.div>

      {/* Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-3 mb-6"
      >
        <StatCard label="Momentos" value={moments.length} />
        <StatCard label="Capítulos" value={`${completionPercentage}%`} />
        <StatCard label="Mídias" value={moments.reduce((sum, m) => sum + m.media.length, 0)} />
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <h2 className="text-foreground mb-3">Ações rápidas</h2>
        <div className="space-y-2">
          <ActionCard
            icon={<Download className="w-5 h-5 text-primary" />}
            title="Exportar álbum em PDF"
            subtitle="Baixe todas as memórias"
            onClick={onNavigateToExportAlbum}
          />
          <ActionCard
            icon={<Users className="w-5 h-5 text-primary" />}
            title="Adicionar bebê"
            subtitle="Crie outro álbum"
            onClick={onNavigateToAddBaby}
          />
        </div>
      </motion.div>

      {/* Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-foreground mb-3">Configurações</h2>
        <div className="space-y-2">
          {/* Theme Toggle */}
          <div className="bg-card rounded-xl p-4 shadow-sm border border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-primary" />
                ) : (
                  <Sun className="w-5 h-5 text-primary" />
                )}
              </div>
              <div>
                <p className="text-foreground">Tema Escuro</p>
                <p className="text-muted-foreground text-sm">
                  {theme === 'dark' ? 'Ativado' : 'Desativado'}
                </p>
              </div>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
              aria-label="Alternar tema"
            />
          </div>

          <ActionCard
            icon={<Settings className="w-5 h-5 text-primary" />}
            title="Gerenciar conta"
            subtitle="Dados pessoais e preferências"
            onClick={onNavigateToManageAccount}
          />
          <ActionCard
            icon={<Bell className="w-5 h-5 text-primary" />}
            title="Notificações e Preferências"
            subtitle="Ajuste os alertas e mais"
            onClick={onNavigateToNotificationsSettings}
          />
          <ActionCard
            icon={<HelpCircle className="w-5 h-5 text-primary" />}
            title="Ajuda e suporte"
            subtitle="Dúvidas e feedback"
            onClick={onNavigateToHelpAndSupport}
          />
        </div>
      </motion.div>

      {/* App Version */}
      <div className="text-center mt-8 text-muted-foreground text-sm">
        <p>Livro do Bebê v1.0.0</p>
      </div>
    </div>
  );
}
