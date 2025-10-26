import { useMemo, useState, type ReactNode } from 'react';
import { useBabyData } from '@/lib/baby-data-context';
import type { Chapter, PlaceholderTemplate } from '@/lib/types';
import {
  BookOpen,
  CalendarClock,
  CalendarDays,
  Cake,
  ChevronDown,
  ChevronRight,
  History,
  Moon,
  Sparkles,
  Stethoscope,
  Syringe,
  TreePine,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BabySelectorModal } from '../baby/BabySelectorModal';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/components/ui/utils';

interface StatWidgetProps {
  title: string;
  icon: ReactNode;
  value: string;
  subtitle?: string;
  color: string;
  onClick?: () => void;
  className?: string;
}

function StatWidget({
  title,
  icon,
  value,
  subtitle,
  color,
  onClick,
  className,
}: StatWidgetProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      type="button"
      className={cn(
        'bg-card rounded-2xl p-4 shadow-sm border border-border hover:shadow-md transition-shadow text-left relative overflow-hidden',
        className,
      )}
      style={{ backgroundColor: `${color}12` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-xl" style={{ backgroundColor: `${color}33` }}>
          {icon}
        </div>
        {onClick && (
          <ChevronRight className="w-5 h-5 text-muted-foreground absolute top-4 right-4" />
        )}
      </div>
      <h3 className="text-muted-foreground mb-1">{title}</h3>
      <p className="text-foreground mb-0.5 text-sm sm:text-base">{value}</p>
      {subtitle && <p className="text-muted-foreground text-xs">{subtitle}</p>}
    </motion.button>
  );
}

type TimeOfDay = 'morning' | 'afternoon' | 'evening';

type WeatherDescriptor = {
  summary: string;
  detail: string;
  temperature: string;
  emoji: string;
};

type MoonDescriptor = {
  label: string;
  emoji: string;
};

const heroBackgrounds: Record<TimeOfDay, string> = {
  morning: 'from-amber-50 via-orange-100 to-sky-100',
  afternoon: 'from-sky-50 via-teal-100 to-emerald-100',
  evening: 'from-violet-100 via-indigo-100 to-rose-100',
};

const heroPhrases: Record<TimeOfDay, string> = {
  morning: 'Comece o dia registrando um abraço quentinho.',
  afternoon: 'Uma pausa doce para capturar a leveza da tarde.',
  evening: 'Feche o dia com uma memória cheia de carinho.',
};

const timeOfDayGreetings: Record<TimeOfDay, string> = {
  morning: 'Bom dia',
  afternoon: 'Boa tarde',
  evening: 'Boa noite',
};

interface HeroNarrativeOptions {
  babyName?: string;
  weather: WeatherDescriptor;
  moon: MoonDescriptor;
  location?: string;
  lastMomentTitle?: string;
  lastMomentDate?: string;
}

function getTimeOfDay(date: Date): TimeOfDay {
  const hour = date.getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

function getWeatherDescriptor(timeOfDay: TimeOfDay): WeatherDescriptor {
  switch (timeOfDay) {
    case 'morning':
      return {
        summary: 'Céu límpido',
        detail: 'Brisa suave do leste',
        temperature: '24°C',
        emoji: '🌤️',
      };
    case 'afternoon':
      return {
        summary: 'Sol confortável',
        detail: 'Nuvens algodão ao longe',
        temperature: '27°C',
        emoji: '🌞',
      };
    default:
      return {
        summary: 'Noite serena',
        detail: 'Luzes da cidade ao fundo',
        temperature: '21°C',
        emoji: '🌙',
      };
  }
}

function getMoonPhase(date: Date): MoonDescriptor {
  const synodicMonth = 29.53058867;
  const knownNewMoon = new Date('2001-01-06T18:14:00Z').getTime();
  const daysSinceNewMoon = (date.getTime() - knownNewMoon) / (1000 * 60 * 60 * 24);
  const currentPhase = daysSinceNewMoon % synodicMonth;

  if (currentPhase < 1) {
    return { label: 'Lua Nova', emoji: '🌑' };
  }
  if (currentPhase < 7.4) {
    return { label: 'Lua Crescente', emoji: '🌓' };
  }
  if (currentPhase < 14.8) {
    return { label: 'Lua Cheia', emoji: '🌕' };
  }
  if (currentPhase < 22.1) {
    return { label: 'Lua Minguante', emoji: '🌗' };
  }
  return { label: 'Lua Nova', emoji: '🌑' };
}

function formatDate(dateString?: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
  }).format(date);
}

function calculateDaysDifference(from?: string, to = new Date()) {
  if (!from) return null;
  const fromDate = new Date(from);
  const diff = to.getTime() - fromDate.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function createHeroNarrative({
  babyName,
  weather,
  moon,
  location,
  lastMomentTitle,
  lastMomentDate,
}: HeroNarrativeOptions) {
  const subject = babyName ?? 'Seu bebê';
  const cityLabel = location ? ` em ${location.split(',')[0]}` : '';
  const base = `${subject} vive um momento de ${weather.summary.toLowerCase()}${cityLabel}.`;
  const moonNote = ` A ${moon.label.toLowerCase()} convida para novas descobertas.`;
  const lastRecord = lastMomentTitle
    ? ` O último registro — "${lastMomentTitle}" — aconteceu em ${lastMomentDate}. Que tal continuar essa história hoje?`
    : ' Ainda não registramos nada por aqui. Que tal inaugurar um novo capítulo agora?';

  return `${base}${moonNote}${lastRecord}`;
}

interface SuggestionCard {
  id: string;
  title: string;
  description: string;
  accent: string;
  background: string;
  icon: React.ReactNode;
  actionLabel: string;
  onAction?: () => void;
  footer?: string;
}

export interface HomeScreenProps {
  onNavigateToGrowth?: () => void;
  onNavigateToVaccines?: () => void;
  onNavigateToConsultations?: () => void;
  onNavigateToSleepHumor?: () => void;
  onNavigateToFamily?: () => void;
  onNavigateToChapters?: () => void;
  onNavigateToMoments?: () => void;
  onOpenTemplate?: (chapterId: string, templateId: string) => void;
  onOpenChapter?: (chapter: Chapter) => void;
  onOpenMomentDetail?: (momentId: string) => void;
}

export function HomeScreen({
  onNavigateToGrowth,
  onNavigateToVaccines,
  onNavigateToConsultations,
  onNavigateToSleepHumor,
  onNavigateToFamily,
  onNavigateToChapters,
  onNavigateToMoments,
  onOpenTemplate,
  onOpenChapter,
  onOpenMomentDetail,
}: HomeScreenProps) {
  const [showBabySelector, setShowBabySelector] = useState(false);
  const [showChaptersDrawer, setShowChaptersDrawer] = useState(false);
  const [dismissedSuggestions, setDismissedSuggestions] = useState<string[]>([]);
  const [expandedMomentId, setExpandedMomentId] = useState<string | null>(null);
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

  const moments = useMemo(() => {
    return getMoments().slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [getMoments]);
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
  }, [babyAgeInDays, chapters, getPlaceholdersForChapter, moments]);

  const totals = chapterSummaries.reduce(
    (acc, item) => ({
      completed: acc.completed + item.completed,
      total: acc.total + item.total,
    }),
    { completed: 0, total: 0 },
  );

  const templateMap = useMemo(() => {
    const map = new Map<string, { template: PlaceholderTemplate; chapter: Chapter }>();
    chapters.forEach((chapter) => {
      const placeholders = getPlaceholdersForChapter(chapter.id, babyAgeInDays);
      placeholders.forEach((placeholder) => {
        map.set(placeholder.id, { template: placeholder, chapter });
      });
    });
    return map;
  }, [babyAgeInDays, chapters, getPlaceholdersForChapter]);

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
  const consultations = useMemo(() => {
    return moments.filter((moment) => {
      if (!moment.templateId) return false;
      const templateInfo = templateMap.get(moment.templateId);
      return templateInfo?.template.templateType === 'consulta';
    });
  }, [moments, templateMap]);

  const nextConsultation = useMemo(() => {
    const placeholders = Array.from(templateMap.values())
      .filter((item) => item.template.templateType === 'consulta')
      .sort((a, b) => (a.template.ageRangeStart ?? 0) - (b.template.ageRangeStart ?? 0));
    const next = placeholders.find((item) => {
      if (item.template.allowMultiple) return true;
      return !moments.some((moment) => moment.templateId === item.template.id);
    });
    if (!next) return null;
    const daysUntil = Math.max((next.template.ageRangeStart ?? babyAgeInDays) - babyAgeInDays, 0);
    return {
      templateId: next.template.id,
      chapterId: next.chapter.id,
      label:
        daysUntil === 0
          ? 'Disponível agora'
          : `em ${daysUntil} ${daysUntil === 1 ? 'dia' : 'dias'}`,
    };
  }, [babyAgeInDays, moments, templateMap]);

  const latestMoment = moments[0];
  const previousMoments = moments.slice(1, 3);
  const now = new Date();
  const timeOfDay = getTimeOfDay(now);
  const weather = getWeatherDescriptor(timeOfDay);
  const moon = getMoonPhase(now);
  const heroNarrative = createHeroNarrative({
    babyName: currentBaby?.name,
    weather,
    moon,
    location: currentBaby?.city,
    lastMomentTitle: latestMoment?.title,
    lastMomentDate: formatDate(latestMoment?.date),
  });

  const suggestions = useMemo(() => {
    const cards: SuggestionCard[] = [];
    const upcomingMilestones = Array.from(templateMap.values())
      .filter((item) => item.template.templateType === 'evento' || item.template.templateType === 'primeira-vez')
      .filter((item) => {
        if (item.template.allowMultiple) return true;
        return !moments.some((moment) => moment.templateId === item.template.id);
      })
      .map((item) => {
        const daysUntil = Math.max((item.template.ageRangeStart ?? babyAgeInDays) - babyAgeInDays, 0);
        return {
          ...item,
          daysUntil,
        };
      })
      .sort((a, b) => a.daysUntil - b.daysUntil);

    const highlightedMilestone = upcomingMilestones[0];
    if (highlightedMilestone) {
      cards.push({
        id: `milestone-${highlightedMilestone.template.id}`,
        title: 'Marco Esperado',
        description: `${highlightedMilestone.template.name} ${
          highlightedMilestone.daysUntil === 0
            ? 'já pode ser registrado.'
            : `chega ${
                highlightedMilestone.daysUntil === 1
                  ? 'amanhã'
                  : `em ${highlightedMilestone.daysUntil} dias`
              }.`
        }`,
        accent: '#7C3AED',
        background: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
        icon: <Sparkles className="w-5 h-5 text-[#7C3AED]" />,
        actionLabel: 'Registrar agora',
        onAction: highlightedMilestone.template.id
          ? () =>
              onOpenTemplate?.(highlightedMilestone.chapter.id, highlightedMilestone.template.id)
          : undefined,
        footer: highlightedMilestone.chapter.name,
      });
    }

    const monthversaryPlaceholders = Array.from(templateMap.values())
      .filter((item) => item.template.templateType === 'mesversario')
      .sort((a, b) => (a.template.ageRangeStart ?? 0) - (b.template.ageRangeStart ?? 0));
    const nextMonthversary = monthversaryPlaceholders.find((item) => {
      if (item.template.allowMultiple) return true;
      return !moments.some((moment) => moment.templateId === item.template.id);
    });
    if (nextMonthversary) {
      const monthNumber = Math.round((nextMonthversary.template.ageRangeStart ?? babyAgeInDays) / 30);
      cards.push({
        id: `monthversary-${nextMonthversary.template.id}`,
        title: 'Mêsversário Próximo',
        description: `Preparar álbum do mês ${monthNumber}`,
        accent: '#EC4899',
        background: 'linear-gradient(135deg, #FCE7F3 0%, #FBCFE8 100%)',
        icon: <Cake className="w-5 h-5 text-[#EC4899]" />,
        actionLabel: 'Criar álbum',
        onAction: () => onOpenTemplate?.(nextMonthversary.chapter.id, nextMonthversary.template.id),
        footer: 'Celebre cada mês',
      });
    }

    const daysSinceLastMoment = calculateDaysDifference(latestMoment?.date, now);
    if (daysSinceLastMoment !== null && daysSinceLastMoment >= 4) {
      cards.push({
        id: 'gap-reminder',
        title: 'Lacuna Temporal',
        description: `${daysSinceLastMoment} dias sem novos registros. Que tal um momento fofura agora?`,
        accent: '#10B981',
        background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
        icon: <CalendarClock className="w-5 h-5 text-[#0EA5E9]" />,
        actionLabel: 'Criar registro',
        onAction: onNavigateToChapters,
        footer: 'Sugestão personalizada',
      });
    }

    const retroMoment = moments.find((moment) => {
      const diff = calculateDaysDifference(moment.date, now);
      return diff !== null && diff > 30;
    });
    if (retroMoment) {
      cards.push({
        id: `retro-${retroMoment.id}`,
        title: 'Celebração Retroativa',
        description: `Revisite "${retroMoment.title}" e conte um detalhe novo.`,
        accent: '#F59E0B',
        background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
        icon: <History className="w-5 h-5 text-[#F59E0B]" />,
        actionLabel: 'Relembrar',
        onAction: onNavigateToMoments,
        footer: formatDate(retroMoment.date),
      });
    }

    if (familyMembers.length > 0) {
      const lastFamily = familyMembers[familyMembers.length - 1];
      cards.push({
        id: 'family-invite',
        title: 'Convite Familiar',
        description: `${lastFamily.name} quer participar mais das memórias. Convide para co-criar.`,
        accent: '#2563EB',
        background: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
        icon: <Users className="w-5 h-5 text-[#2563EB]" />,
        actionLabel: 'Enviar convite',
        onAction: onNavigateToFamily,
        footer: 'Fortaleça os vínculos',
      });
    }

    return cards;
  }, [
    babyAgeInDays,
    familyMembers,
    latestMoment?.date,
    moments,
    now,
    onNavigateToChapters,
    onNavigateToFamily,
    onNavigateToMoments,
    onOpenTemplate,
    templateMap,
  ]);

  const visibleSuggestions = suggestions
    .filter((card) => !dismissedSuggestions.includes(card.id))
    .slice(0, 3);

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((segment) => segment[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const toggleMoment = (momentId: string) => {
    setExpandedMomentId((prev) => (prev === momentId ? null : momentId));
  };

  const previousMomentsSummary = previousMoments
    .map((moment) => moment.title)
    .filter(Boolean)
    .join(' · ');

  const imageMomentIds = useMemo(
    () =>
      moments
        .filter((moment) => moment.media?.[0])
        .slice(0, 3)
        .map((moment) => moment.id),
    [moments],
  );

  const timelineEvents = useMemo(
    () =>
      moments.slice(0, 6).map((moment) => {
        const templateInfo = moment.templateId ? templateMap.get(moment.templateId) : undefined;
        return {
          id: moment.id,
          title: moment.title ?? 'Memória especial',
          date: moment.date,
          summary: moment.noteShort ?? moment.noteLong?.slice(0, 96),
          chapterName: templateInfo?.chapter.name ?? 'Memória livre',
          icon: templateInfo?.template.icon ?? '🗒️',
        };
      }),
    [moments, templateMap],
  );

  const handleTimelineEventClick = (momentId: string) => {
    if (onOpenMomentDetail) {
      setExpandedMomentId(momentId);
      onOpenMomentDetail(momentId);
    } else {
      toggleMoment(momentId);
    }
  };

  return (
    <div className="pb-24 px-4 pt-6 max-w-2xl mx-auto space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={cn(
          'relative overflow-hidden rounded-3xl border border-border/60 shadow-sm px-6 py-8 min-h-[40vh] flex flex-col justify-between bg-gradient-to-br',
          heroBackgrounds[timeOfDay],
        )}
      >
        <div className="absolute inset-0 pointer-events-none opacity-50">
          <div className="absolute -top-24 right-0 w-72 h-72 bg-white/40 blur-3xl rounded-full" />
        </div>
        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-start gap-6">
            <button
              type="button"
              onClick={() => setShowBabySelector(true)}
              className="flex items-center gap-4 text-left hover:opacity-90 transition-opacity"
            >
              <Avatar className="w-20 h-20 border-2 border-primary shadow-lg">
                <AvatarImage src={currentBaby?.avatar} alt={currentBaby?.name ?? 'Bebê'} />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                  {currentBaby ? getInitials(currentBaby.name) : '?'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-muted-foreground">{timeOfDayGreetings[timeOfDay]}, família!</p>
                <h1 className="text-2xl font-semibold text-foreground">
                  {currentBaby?.name ?? 'Bebê atual'}
                </h1>
                <p className="text-muted-foreground text-sm">{ageLabel}</p>
              </div>
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Frase do dia · {heroPhrases[timeOfDay]}</Badge>
            <Badge variant="outline">
              {moon.emoji} {moon.label}
            </Badge>
            {latestMoment && (
              <Badge variant="outline">
                Última memória: {latestMoment.title}
              </Badge>
            )}
          </div>

          <p className="text-base leading-relaxed text-foreground/90">
            {heroNarrative}
          </p>

          {previousMomentsSummary && (
            <p className="text-xs text-muted-foreground">
              Últimas interações: {previousMomentsSummary}
            </p>
          )}
        </div>
      </motion.section>

      {visibleSuggestions.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-foreground font-semibold text-lg">✨ Para você</h2>
            <p className="text-xs text-muted-foreground">Arraste para explorar · Swipe para dispensar</p>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
            {visibleSuggestions.map((card) => (
              <motion.div
                key={card.id}
                drag="y"
                dragSnapToOrigin
                whileTap={{ scale: 0.98 }}
                onDragEnd={(event, info) => {
                  if (Math.abs(info.offset.y) > 80) {
                    setDismissedSuggestions((prev) => [...prev, card.id]);
                  }
                }}
                className="relative min-w-[80%] sm:min-w-[260px] max-w-[320px] snap-start"
              >
                <div
                  className="h-full rounded-2xl border border-border/60 shadow-sm p-4 flex flex-col justify-between"
                  style={{ background: card.background }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className="p-2 rounded-xl"
                      style={{ backgroundColor: `${card.accent}20` }}
                    >
                      {card.icon}
                    </div>
                    <button
                      type="button"
                      onClick={() => setDismissedSuggestions((prev) => [...prev, card.id])}
                      className="p-1 rounded-full bg-white/60 text-muted-foreground hover:bg-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-4 space-y-2">
                    <h3 className="text-base font-semibold text-foreground">{card.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{card.description}</p>
                  </div>
                  {card.footer && (
                    <p className="text-xs text-muted-foreground mt-3">{card.footer}</p>
                  )}
                  <button
                    type="button"
                    onClick={card.onAction}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-foreground hover:opacity-80"
                  >
                    {card.actionLabel}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      <section className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
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
            title="Sono & Humor"
            icon={<Moon className="w-5 h-5 text-primary" />}
            value={`${averageSleep}h média`}
            subtitle="Média semanal"
            color="#6366F1"
            onClick={onNavigateToSleepHumor}
          />
          <StatWidget
            title="Consultas"
            icon={<Stethoscope className="w-5 h-5 text-primary" />}
            value={`${consultations.length} realizadas`}
            subtitle={nextConsultation ? `Próxima ${nextConsultation.label}` : 'Tudo em dia!'}
            color="#10B981"
            onClick={() => onNavigateToConsultations?.()}
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
          <div className="col-span-2">
            <motion.div
              whileTap={{ scale: 0.99 }}
              className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-emerald-50 via-emerald-100/60 to-amber-50 opacity-70" aria-hidden="true" />
              <div className="pointer-events-none absolute -bottom-16 -right-8 w-44 h-44 rounded-full bg-emerald-200/40 blur-3xl" aria-hidden="true" />
              <div className="pointer-events-none absolute -top-12 -left-10 w-32 h-32 rounded-full bg-amber-200/40 blur-2xl" aria-hidden="true" />
              <button
                type="button"
                onClick={onNavigateToFamily}
                className="relative w-full text-left p-4 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-foreground font-semibold text-lg">Família conectada</h3>
                    <p className="text-sm text-muted-foreground">
                      {familyMembers.length} membros acompanhando a jornada
                    </p>
                  </div>
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-200 via-emerald-100 to-amber-100 flex items-center justify-center text-3xl shadow-inner">
                      <TreePine className="w-9 h-9 text-emerald-700" />
                    </div>
                    <div className="absolute -bottom-2 -right-3 flex -space-x-2">
                      {familyMembers.slice(0, 3).map((member) => (
                        <Avatar key={member.id} className="w-8 h-8 border border-white shadow">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {getInitials(member.name)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Envie convites carinhosos, organize visitas e fortaleça os laços com atualizações em tempo real.
                </p>
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden"
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

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">🌸 Últimos Dias</h2>
          <button
            type="button"
            onClick={onNavigateToMoments}
            className="text-sm text-primary hover:underline"
          >
            Abrir galeria
          </button>
        </div>
        <div className="columns-2 gap-4 [column-fill:_balance]">
          {moments.map((moment) => (
            <div key={moment.id} className="mb-4 break-inside-avoid">
              <motion.button
                type="button"
                onClick={() => toggleMoment(moment.id)}
                whileTap={{ scale: 0.99 }}
                className="w-full text-left bg-card border border-border rounded-2xl shadow-sm overflow-hidden"
              >
                {imageMomentIds.includes(moment.id) && moment.media?.[0] && (
                  <div className="relative">
                    <img
                      src={moment.media[0]}
                      alt={moment.title}
                      className="w-full object-cover h-40"
                    />
                    <span className="absolute bottom-2 left-2 text-xs px-2 py-1 rounded-full bg-black/40 text-white">
                      {moment.age}
                    </span>
                  </div>
                )}
                <div className="p-4 space-y-2">
                  {!imageMomentIds.includes(moment.id) && moment.age && (
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {moment.age}
                    </p>
                  )}
                  <h3 className="text-sm font-semibold text-foreground">{moment.title ?? 'Memória especial'}</h3>
                  <p className="text-xs text-muted-foreground">{formatDate(moment.date)}</p>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {moment.noteShort ?? moment.noteLong?.slice(0, 120) ?? 'Uma lembrança cheia de carinho.'}
                  </p>
                  <AnimatePresence>
                    {expandedMomentId === moment.id && moment.noteLong && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-xs text-muted-foreground border-t border-border pt-2"
                      >
                        {moment.noteLong}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-foreground font-semibold text-base">
              📖 História de {currentBaby?.name ?? 'Aurora'}
            </h3>
            <Badge variant="outline" className="text-xs">
              Linha do tempo resumida
            </Badge>
          </div>
          <div className="relative pl-3">
            {timelineEvents.length > 1 && (
              <span
                className="absolute left-[22px] top-2 bottom-4 border-l border-border/70"
                aria-hidden="true"
              />
            )}
            <ol className="space-y-3">
              {timelineEvents.map((event) => {
                const isActive = expandedMomentId === event.id;
                return (
                  <li key={event.id} className="relative pl-10">
                    <span
                      className="absolute left-[18px] top-5 w-3 h-3 rounded-full bg-primary shadow-sm"
                      aria-hidden="true"
                    />
                    <button
                      type="button"
                      onClick={() => handleTimelineEventClick(event.id)}
                      className={cn(
                        'w-full rounded-xl border px-4 py-3 text-left transition-colors',
                        isActive
                          ? 'border-primary/50 bg-primary/10 shadow-sm'
                          : 'border-border bg-background hover:border-primary/40 hover:bg-primary/5',
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xl leading-none" aria-hidden="true">
                          {event.icon}
                        </span>
                        <div className="flex-1 space-y-1">
                          <p className="text-xs text-muted-foreground uppercase tracking-wide">
                            {formatDate(event.date)}
                          </p>
                          <p className="text-sm font-medium text-foreground">{event.title}</p>
                          <p className="text-xs text-muted-foreground">{event.chapterName}</p>
                          {event.summary && (
                            <p className="text-xs text-muted-foreground/80 line-clamp-2">{event.summary}</p>
                          )}
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground mt-1" />
                      </div>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
          <button
            type="button"
            onClick={onNavigateToMoments}
            className="w-full inline-flex items-center justify-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            Ver Momentos (Galeria)
            <CalendarDays className="w-4 h-4" />
          </button>
        </div>
      </motion.section>

      <BabySelectorModal
        isOpen={showBabySelector}
        onClose={() => setShowBabySelector(false)}
        onBabyChange={() => undefined}
      />
    </div>
  );
}
