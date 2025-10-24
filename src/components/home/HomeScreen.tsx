import { useMemo, useState } from 'react';
import { useBabyData } from '../../lib/baby-data-context';
import type { Chapter, PlaceholderTemplate } from '../../lib/types';
import {
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronRight,
  Moon,
  Syringe,
  TrendingUp,
  Users,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { BabySelectorModal } from '../baby/BabySelectorModal';
import { Progress } from '../ui/progress';

interface StatWidgetProps {
  title: string;
  icon: React.ReactNode;
  value: string;
  subtitle?: string;
  color: string;
  onClick?: () => void;
}

function StatWidget({ title, icon, value, subtitle, color, onClick }: StatWidgetProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="bg-card rounded-2xl p-4 shadow-sm border border-border hover:shadow-md transition-shadow text-left relative overflow-hidden"
      style={{ backgroundColor: `${color}20` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-xl" style={{ backgroundColor: `${color}40` }}>
          {icon}
        </div>
        {onClick && (
          <ChevronRight className="w-5 h-5 text-muted-foreground absolute top-4 right-4" />
        )}
      </div>
      <h3 className="text-muted-foreground mb-1">{title}</h3>
      <p className="text-foreground mb-0.5">{value}</p>
      {subtitle && <p className="text-muted-foreground text-xs">{subtitle}</p>}
    </motion.button>
  );
}

interface HomeScreenProps {
  onNavigateToGrowth?: () => void;
  onNavigateToVaccines?: () => void;
  onNavigateToSleepHumor?: () => void;
  onNavigateToFamily?: () => void;
  onNavigateToChapters?: () => void;
  onOpenTemplate?: (chapterId: string, templateId: string) => void;
  onOpenChapter?: (chapter: Chapter) => void;
}

export function HomeScreen({
  onNavigateToGrowth,
  onNavigateToVaccines,
  onNavigateToSleepHumor,
  onNavigateToFamily,
  onNavigateToChapters,
  onOpenTemplate,
  onOpenChapter,
}: HomeScreenProps) {
  const [showBabySelector, setShowBabySelector] = useState(false);
  const [showChaptersDrawer, setShowChaptersDrawer] = useState(false);
  const {
    currentBaby,
    chapters,
    calculateAge,
    getBabyAgeInDays,
    getMoments,
    getPlaceholdersForChapter,
    getGrowthMeasurements,
    getVaccines,
    getSleepHumorEntries,
    getFamilyMembers,
  } = useBabyData();

  const moments = getMoments();
  const ageLabel = currentBaby ? calculateAge(currentBaby.birthDate) : '';
  const babyAgeInDays = currentBaby ? getBabyAgeInDays(currentBaby.birthDate) : 0;

  const chapterSummaries = useMemo(() => {
    return chapters.map((chapter) => {
      const placeholders = getPlaceholdersForChapter(chapter.id, babyAgeInDays);
      const completed = placeholders.filter((placeholder) =>
        moments.some((moment) => moment.templateId === placeholder.id),
      ).length;
      const total = placeholders.length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { chapter, completed, total, percentage };
    });
  }, [babyAgeInDays, moments]);

  const totals = chapterSummaries.reduce(
    (acc, item) => ({
      completed: acc.completed + item.completed,
      total: acc.total + item.total,
    }),
    { completed: 0, total: 0 },
  );

  const growthMeasurements = getGrowthMeasurements();
  const latestGrowth = growthMeasurements[growthMeasurements.length - 1];
  const previousGrowth = growthMeasurements[growthMeasurements.length - 2];
  const weightChange =
    latestGrowth && previousGrowth
      ? (latestGrowth.weight - previousGrowth.weight).toFixed(1)
      : '0';

  const vaccines = getVaccines();
  const completedVaccines = vaccines.filter((vaccine) => vaccine.status === 'completed').length;
  const totalVaccines = vaccines.length;
  const pendingVaccines = vaccines.filter((vaccine) => vaccine.status === 'pending').length;

  const sleepEntries = getSleepHumorEntries();
  const averageSleep =
    sleepEntries.length > 0
      ? (sleepEntries.reduce((sum, entry) => sum + entry.sleepHours, 0) / sleepEntries.length).toFixed(1)
      : '0';

  const familyMembers = getFamilyMembers();

  const upcomingMilestones = useMemo(() => {
    const items: Array<{
      chapter: Chapter;
      template: PlaceholderTemplate;
      daysUntil: number;
    }> = [];

    chapters.forEach((chapter) => {
      const placeholders = getPlaceholdersForChapter(chapter.id, babyAgeInDays)
        .filter((placeholder) => {
          const hasMoment = moments.some((moment) => moment.templateId === placeholder.id);
          if (placeholder.allowMultiple) {
            return true;
          }
          return !hasMoment;
        })
        .sort((a, b) => (a.ageRangeStart ?? 0) - (b.ageRangeStart ?? 0));

      const next = placeholders[0];
      if (next) {
        const daysUntil = Math.max((next.ageRangeStart ?? babyAgeInDays) - babyAgeInDays, 0);
        items.push({ chapter, template: next, daysUntil });
      }
    });

    return items
      .sort((a, b) => a.daysUntil - b.daysUntil)
      .slice(0, 3)
      .map((item) => ({
        ...item,
        label:
          item.daysUntil === 0
            ? 'Disponível agora'
            : `em ${item.daysUntil} ${item.daysUntil === 1 ? 'dia' : 'dias'}`,
      }));
  }, [babyAgeInDays, moments]);

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((segment) => segment[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="pb-24 px-4 pt-6 max-w-2xl mx-auto">
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => setShowBabySelector(true)}
        className="flex items-center gap-4 mb-6 w-full text-left hover:opacity-80 transition-opacity"
      >
        <Avatar className="w-20 h-20 border-2 border-primary">
          <AvatarImage src={currentBaby?.avatar} alt={currentBaby?.name ?? 'Bebê'} />
          <AvatarFallback className="bg-primary/10 text-primary text-2xl">
            {currentBaby ? getInitials(currentBaby.name) : '?'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-foreground mb-1">{currentBaby?.name ?? 'Bebê atual'}</h1>
          <p className="text-muted-foreground">{ageLabel}</p>
          <p className="text-muted-foreground text-sm">{currentBaby?.city}</p>
        </div>
        <ChevronRight className="w-6 h-6 text-muted-foreground" />
      </motion.button>

      <p className="text-muted-foreground text-center mb-6">
        Pequenas grandes memórias de cada dia.
      </p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatWidget
          title="Crescimento"
          icon={<TrendingUp className="w-5 h-5 text-primary" />}
          value={
            latestGrowth
              ? `${latestGrowth.weight} kg · ${latestGrowth.height} cm`
              : 'Sem medições'
          }
          subtitle={`+${weightChange} kg este mês`}
          color="#4F46E5"
          onClick={onNavigateToGrowth}
        />
        <StatWidget
          title="Vacinas"
          icon={<Syringe className="w-5 h-5 text-primary" />}
          value={`${completedVaccines} de ${totalVaccines} aplicadas`}
          subtitle={
            pendingVaccines > 0
              ? `${pendingVaccines} ${pendingVaccines === 1 ? 'pendente' : 'pendentes'}`
              : 'Todas em dia!'
          }
          color="#8B5CF6"
          onClick={onNavigateToVaccines}
        />
        <StatWidget
          title="Sono & Humor"
          icon={<Moon className="w-5 h-5 text-primary" />}
          value={`${averageSleep}h média`}
          subtitle="Média semanal"
          color="#6366F1"
          onClick={onNavigateToSleepHumor}
        />
        <StatWidget
          title="Família"
          icon={<Users className="w-5 h-5 text-primary" />}
          value={`${familyMembers.length} membros`}
          subtitle="Ver árvore"
          color="#EC4899"
          onClick={onNavigateToFamily}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl shadow-sm border border-border mb-4 overflow-hidden"
      >
        <button
          onClick={() => setShowChaptersDrawer((prev) => !prev)}
          className="w-full p-4 flex items-center gap-3 text-left hover:bg-muted/70 transition-colors"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-foreground">Capítulos</h3>
              <span className="text-muted-foreground text-sm">
                {totals.completed} de {totals.total}
              </span>
            </div>
            <Progress
              value={totals.total > 0 ? (totals.completed / totals.total) * 100 : 0}
              className="h-2 mb-1"
            />
            <p className="text-muted-foreground text-sm">
              {totals.total > 0 ? Math.round((totals.completed / totals.total) * 100) : 0}% completo
            </p>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-muted-foreground transition-transform ${
              showChaptersDrawer ? 'rotate-180' : ''
            }`}
          />
        </button>

        <AnimatePresence initial={false}>
          {showChaptersDrawer && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-border"
            >
              <div className="p-4 space-y-3">
                {chapterSummaries.map((summary) => (
                  <button
                    key={summary.chapter.id}
                    onClick={() => onOpenChapter?.(summary.chapter)}
                    className="w-full text-left bg-muted/40 hover:bg-muted transition-colors rounded-xl p-3 flex items-start gap-3 border border-border"
                  >
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
                      style={{ backgroundColor: `${summary.chapter.color}40` }}
                    >
                      {summary.chapter.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-foreground">{summary.chapter.name}</h4>
                        <span className="text-muted-foreground text-sm">
                          {summary.completed}/{summary.total}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm mb-2">
                        {summary.chapter.description}
                      </p>
                      <Progress value={summary.percentage} className="h-1.5" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground mt-1" />
                  </button>
                ))}
                <button
                  onClick={onNavigateToChapters}
                  className="w-full h-11 rounded-xl border border-border text-sm text-muted-foreground hover:bg-muted transition-colors"
                >
                  Ver todos os capítulos
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <h3 className="text-foreground mb-3">Próximos marcos</h3>
        {upcomingMilestones.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Sem marcos pendentes no momento. Explore os capítulos para criar novos registros.
          </p>
        ) : (
          <div className="space-y-2">
            {upcomingMilestones.map((item) => (
              <button
                key={item.template.id}
                onClick={() =>
                  onOpenTemplate
                    ? onOpenTemplate(item.chapter.id, item.template.id)
                    : onNavigateToChapters?.()
                }
                className="w-full bg-card rounded-xl p-3 shadow-sm border border-border flex items-center gap-3 hover:shadow-md transition-shadow text-left"
              >
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-foreground">{item.template.name}</p>
                  <p className="text-muted-foreground text-sm">
                    {item.chapter.name} — {item.label}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            ))}
          </div>
        )}
      </motion.div>

      <BabySelectorModal
        isOpen={showBabySelector}
        onClose={() => setShowBabySelector(false)}
        onBabyChange={() => undefined}
      />
    </div>
  );
}
