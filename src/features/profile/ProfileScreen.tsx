import type { ReactNode } from 'react';
import {
  getCurrentBaby,
  calculateAge,
  chapters,
  getMoments,
  getPlaceholdersForChapter,
  getBabyAgeInDays,
} from '../../lib/mockData';
import {
  Download,
  Settings,
  Bell,
  HelpCircle,
  ChevronRight,
  Users,
  Moon,
  Sun,
  RefreshCcw,
  UserPlus,
  Shuffle,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Avatar, AvatarImage, AvatarFallback } from '../../components/ui/avatar';
import { Switch } from '../../components/ui/switch';
import { useTheme } from '../../lib/theme-context';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

interface ProfileScreenProps {
  onNavigateToManageBabies: () => void;
  onNavigateToExportAlbum: () => void;
  onNavigateToManageAccount: () => void;
  onNavigateToNotificationsSettings: () => void;
  onNavigateToHelpAndSupport: () => void;
  onNavigateToAddBaby: () => void;
  onNavigateToMoments: () => void;
  onNavigateToChapters: () => void;
  onNavigateToMedia: () => void;
  onEditBaby: () => void;
}

interface ActionCardProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  onClick?: () => void;
  showChevron?: boolean;
}

function ActionCard({ icon, title, subtitle, onClick, showChevron = true }: ActionCardProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      type="button"
      onClick={onClick}
      className="bg-card rounded-xl p-4 shadow-sm border border-border hover:shadow-md transition-shadow text-left w-full flex items-center gap-3"
    >
      <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0 text-primary">{icon}</div>
      <div className="flex-1 min-w-0 text-left">
        <p className="text-foreground text-sm font-medium">{title}</p>
        {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
      </div>
      {showChevron && <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />}
    </motion.button>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  onClick?: () => void;
}

function StatCard({ label, value, onClick }: StatCardProps) {
  if (onClick) {
    return (
      <motion.button
        whileTap={{ scale: 0.97 }}
        type="button"
        onClick={onClick}
        className="bg-card rounded-xl p-4 shadow-sm border border-border text-center hover:shadow-md transition-shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <p className="text-2xl text-foreground mb-1">{value}</p>
        <p className="text-muted-foreground text-sm">{label}</p>
      </motion.button>
    );
  }

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
  onNavigateToMoments,
  onNavigateToChapters,
  onNavigateToMedia,
  onEditBaby,
}: ProfileScreenProps) {
  const currentBaby = getCurrentBaby();
  const { theme, toggleTheme } = useTheme();

  const age = calculateAge(currentBaby.birthDate);
  const moments = getMoments();
  const babyAgeInDays = getBabyAgeInDays(currentBaby.birthDate);

  let totalCompleted = 0;
  let totalMoments = 0;

  chapters.forEach((chapter) => {
    const placeholders = getPlaceholdersForChapter(chapter.id, babyAgeInDays);
    const completed = placeholders.filter((placeholder) =>
      moments.some((moment) => moment.templateId === placeholder.id),
    ).length;

    totalCompleted += completed;
    totalMoments += placeholders.length;
  });

  const completionPercentage =
    totalMoments > 0 ? Math.round((totalCompleted / totalMoments) * 100) : 0;
  const totalMedia = moments.reduce((sum, moment) => sum + moment.media.length, 0);

  const appVersion = 'v1.0.2 build 67';
  const updateAvailable = true;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="pb-24 px-4 pt-6 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <button
          type="button"
          onClick={onNavigateToManageBabies}
          className="relative inline-block mb-4 group"
          aria-label="Trocar bebe"
        >
          <Avatar className="w-24 h-24 border-4 border-primary mx-auto shadow-lg">
            <AvatarImage src={currentBaby.avatar} alt={currentBaby.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-3xl">
              {getInitials(currentBaby.name)}
            </AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg group-hover:bg-primary/90 transition-colors">
            <Users className="w-4 h-4" />
          </div>
        </button>
        <h1 className="text-foreground mb-1 text-xl font-semibold">{currentBaby.name}</h1>
        <p className="text-muted-foreground">{age}</p>
        <p className="text-muted-foreground text-sm">{currentBaby.city}</p>
        <div className="mt-4 flex items-center justify-center">
          <Button size="sm" variant="outline" onClick={onEditBaby}>
            Editar informacoes do bebe
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-3 mb-8"
      >
        <StatCard label="Momentos" value={moments.length} onClick={onNavigateToMoments} />
        <StatCard
          label="Capitulos concluidos"
          value={`${completionPercentage}%`}
          onClick={onNavigateToChapters}
        />
        <StatCard label="Midias" value={totalMedia} onClick={onNavigateToMedia} />
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8 space-y-3"
      >
        <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium uppercase tracking-wide">
          <RefreshCcw className="w-4 h-4" />
          <span>Resumo e acoes rapidas</span>
        </div>
        <div className="space-y-2">
          <ActionCard
            icon={<Download className="w-5 h-5" />}
            title="Exportar album em PDF"
            subtitle="Monte um album completo ou por serie"
            onClick={onNavigateToExportAlbum}
          />
          <ActionCard
            icon={<UserPlus className="w-5 h-5" />}
            title="Adicionar bebe"
            subtitle="Cadastre um novo perfil em instantes"
            onClick={onNavigateToAddBaby}
          />
          <ActionCard
            icon={<Shuffle className="w-5 h-5" />}
            title="Trocar bebe"
            subtitle="Selecione rapidamente outro contexto"
            onClick={onNavigateToManageBabies}
          />
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mb-8 space-y-3"
      >
        <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium uppercase tracking-wide">
          <Moon className="w-4 h-4" />
          <span>Tema e preferencias</span>
        </div>
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-foreground text-sm font-medium">Tema escuro</p>
              <p className="text-muted-foreground text-sm">
                {theme === 'dark' ? 'Ativado' : 'Desativado'}
              </p>
            </div>
          </div>
          <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} aria-label="Alternar tema" />
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8 space-y-3"
      >
        <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium uppercase tracking-wide">
          <Settings className="w-4 h-4" />
          <span>Conta e configuracoes</span>
        </div>
        <div className="space-y-2">
          <ActionCard
            icon={<Settings className="w-5 h-5" />}
            title="Gerenciar conta"
            subtitle="Dados do responsavel, seguranca e acesso"
            onClick={onNavigateToManageAccount}
          />
          <ActionCard
            icon={<Bell className="w-5 h-5" />}
            title="Notificacoes e preferencias"
            subtitle="Alertas, idioma, backup e exibicao"
            onClick={onNavigateToNotificationsSettings}
          />
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mb-8 space-y-3"
      >
        <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium uppercase tracking-wide">
          <HelpCircle className="w-4 h-4" />
          <span>Suporte e ajuda</span>
        </div>
        <ActionCard
          icon={<HelpCircle className="w-5 h-5" />}
          title="Ajuda e suporte"
          subtitle="Perguntas frequentes, contato e politicas"
          onClick={onNavigateToHelpAndSupport}
        />
      </motion.section>

      <div className="text-center mt-8 text-muted-foreground text-sm space-y-2">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-foreground">
            <span>Livro do Bebe {appVersion}</span>
            {updateAvailable && <Badge variant="secondary">Atualizacao disponivel</Badge>}
          </div>
          <button
            type="button"
            onClick={onNavigateToHelpAndSupport}
            className="text-primary text-sm font-medium hover:underline"
          >
            Ajuda
          </button>
        </div>
      </div>
    </div>
  );
}
