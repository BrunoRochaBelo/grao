import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useBabyData } from '@/lib/baby-data-context';
import type { Chapter, Moment, PlaceholderTemplate } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { BabySelectorModal } from '../baby/BabySelectorModal';
import { ChevronRight, MapPin, Sparkles, X } from 'lucide-react';

const DAY_IN_MS = 86_400_000;

const SUGGESTION_THEMES = {
  milestone: {
    bg: 'bg-violet-50/70 dark:bg-violet-500/10',
    border: 'border-violet-200/80 dark:border-violet-500/30',
    accent: 'text-violet-600 dark:text-violet-200',
    pill: 'bg-violet-100 text-violet-600 dark:bg-violet-500/30 dark:text-violet-100',
  },
  monthversary: {
    bg: 'bg-rose-50/70 dark:bg-rose-500/10',
    border: 'border-rose-200/80 dark:border-rose-500/30',
    accent: 'text-rose-600 dark:text-rose-200',
    pill: 'bg-rose-100 text-rose-600 dark:bg-rose-500/30 dark:text-rose-100',
  },
  gap: {
    bg: 'bg-emerald-50/70 dark:bg-emerald-500/10',
    border: 'border-emerald-200/80 dark:border-emerald-500/30',
    accent: 'text-emerald-600 dark:text-emerald-200',
    pill: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/30 dark:text-emerald-100',
  },
  celebration: {
    bg: 'bg-amber-50/70 dark:bg-amber-500/10',
    border: 'border-amber-200/80 dark:border-amber-500/30',
    accent: 'text-amber-600 dark:text-amber-200',
    pill: 'bg-amber-100 text-amber-600 dark:bg-amber-500/30 dark:text-amber-100',
  },
} as const;

type SuggestionTheme = keyof typeof SUGGESTION_THEMES;

const MOOD_EMOJI: Record<string, string> = {
  happy: '😊',
  calm: '😌',
  fussy: '😕',
  crying: '😢',
  sleepy: '😴',
};

function getHeroGradient() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return 'from-amber-50 to-orange-50';
  }
  if (hour >= 12 && hour < 18) {
    return 'from-sky-50 to-blue-50';
  }
  return 'from-indigo-50 to-purple-50';
}

function formatDate(date: Date, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('pt-BR', options).format(date);
}

function formatShortDate(date: Date) {
  return formatDate(date, { day: '2-digit', month: 'short' })
    .replace('.', '')
    .replace(' de ', ' ');
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function addDays(base: Date, days: number) {
  const clone = new Date(base);
  clone.setDate(clone.getDate() + days);
  return clone;
}

function differenceInDays(from: Date, to: Date) {
  return Math.floor((from.getTime() - to.getTime()) / DAY_IN_MS);
}

function differenceInMonths(from: Date, to: Date) {
  const years = from.getFullYear() - to.getFullYear();
  const months = years * 12 + (from.getMonth() - to.getMonth());
  return months <= 0 ? 0 : months;
}

function formatAgeRange(start?: number, end?: number) {
  if (start == null && end == null) return '';
  const startMonths = Math.max(Math.round((start ?? 0) / 30), 0);
  if (end == null) {
    return `${startMonths}+ meses`;
  }
  const endMonths = Math.max(Math.round(end / 30), startMonths + 1);
  return `${startMonths}-${endMonths} meses`;
}

interface SuggestionActionBase {
  label: string;
}

type SuggestionAction =
  | (SuggestionActionBase & {
      kind: 'open-template';
      chapterId: string;
      templateId: string;
      options?: { titleOverride?: string; accentColor?: string };
    })
  | (SuggestionActionBase & { kind: 'open-moment'; momentId: string })
  | (SuggestionActionBase & { kind: 'request-create' })
  | (SuggestionActionBase & { kind: 'navigate'; destination: 'chapters' })
  | (SuggestionActionBase & { kind: 'snooze'; days: number })
  | (SuggestionActionBase & { kind: 'dismiss' });

interface SuggestionCardData {
  id: string;
  type: SuggestionTheme;
  icon: string;
  title: string;
  description: string;
  metadata?: string;
  actions: SuggestionAction[];
}

interface StatusCardConfig {
  id: string;
  icon: string;
  title: string;
  value: string;
  subtitle?: string;
  onClick?: () => void;
}

interface HomeScreenProps {
  onNavigateToGrowth?: () => void;
  onNavigateToVaccines?: () => void;
  onNavigateToSleepHumor?: () => void;
  onNavigateToFamily?: () => void;
  onNavigateToChapters?: () => void;
  onOpenTemplate?: (
    chapterId: string,
    templateId: string,
    options?: { titleOverride?: string; accentColor?: string },
  ) => void;
  onOpenMoment?: (moment: Moment) => void;
  onRequestCreate?: () => void;
}
function StatusCard({ icon, title, value, subtitle, onClick }: StatusCardConfig) {
  const content = (
    <motion.div
      whileTap={{ scale: onClick ? 0.97 : 1 }}
      className="flex h-full flex-col justify-between rounded-2xl border border-white/60 bg-white/80 p-5 text-left shadow-sm shadow-violet-200/30 backdrop-blur-md transition-transform hover:-translate-y-0.5 dark:border-white/10 dark:bg-zinc-900/80"
    >
      <div className="flex items-start justify-between">
        <span className="text-2xl">{icon}</span>
        <ChevronRight className="h-4 w-4 text-zinc-400" />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-400">{title}</p>
        <p className="mt-2 text-lg font-semibold text-zinc-800 dark:text-zinc-50">{value}</p>
        {subtitle && <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-300">{subtitle}</p>}
      </div>
    </motion.div>
  );

  if (onClick) {
    return (
      <button type="button" className="text-left" onClick={onClick}>
        {content}
      </button>
    );
  }

  return content;
}

interface MemoryCardProps {
  moment: Moment;
  onExpand: (moment: Moment) => void;
}

function MemoryCard({ moment, onExpand }: MemoryCardProps) {
  const date = new Date(moment.date);
  const cover = moment.media?.[0];

  return (
    <motion.button
      type="button"
      layout
      whileTap={{ scale: 0.98 }}
      onClick={() => onExpand(moment)}
      className="mb-4 w-full break-inside-avoid rounded-3xl bg-white/90 text-left shadow-sm shadow-zinc-200/40 transition-transform hover:-translate-y-0.5 dark:bg-zinc-900/80"
    >
      {cover && (
        <div className="overflow-hidden">
          <img
            src={cover}
            alt={moment.title}
            className="h-auto w-full object-cover"
          />
        </div>
      )}
      <div className="space-y-2 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">
          {`${formatShortDate(date)} · ${formatTime(date)}`}
        </p>
        <p className="text-base font-semibold text-zinc-800 dark:text-zinc-100">
          {moment.title}
        </p>
        {moment.noteShort && (
          <p className="text-sm text-zinc-600 line-clamp-3 dark:text-zinc-300">{moment.noteShort}</p>
        )}
        {moment.location && (
          <p className="flex items-center gap-1 text-xs text-zinc-400">
            <MapPin className="h-3.5 w-3.5" /> {moment.location}
          </p>
        )}
        {moment.tags && moment.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {moment.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="rounded-full bg-violet-100 px-2 py-0.5 text-xs text-violet-600">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </motion.button>
  );
}

interface ExpandedMomentProps {
  moment: Moment;
  onClose: () => void;
  onOpen?: (moment: Moment) => void;
}

function ExpandedMoment({ moment, onClose, onOpen }: ExpandedMomentProps) {
  const date = new Date(moment.date);
  const cover = moment.media?.[0];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-x-5 top-20 z-50 max-h-[80vh] overflow-hidden rounded-3xl bg-white shadow-2xl shadow-violet-300/30 dark:bg-zinc-900"
      >
        <div className="flex items-center justify-between border-b border-white/60 px-5 py-4 dark:border-zinc-700">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
              {`${formatShortDate(date)} · ${formatTime(date)}`}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-zinc-800 dark:text-zinc-100">
              {moment.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 pb-6">
          {cover && (
            <img
              src={cover}
              alt={moment.title}
              className="mt-4 w-full rounded-2xl object-cover"
            />
          )}
          {moment.noteLong && (
            <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
              {moment.noteLong}
            </p>
          )}
          {moment.tags && moment.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {moment.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="rounded-full bg-violet-100 px-3 py-1 text-xs text-violet-600">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            {onOpen && (
              <button
                type="button"
                onClick={() => onOpen(moment)}
                className="rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-violet-500/30"
              >
                Abrir memória completa
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-zinc-200 px-5 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Fechar
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
export function HomeScreen({
  onNavigateToGrowth,
  onNavigateToVaccines,
  onNavigateToSleepHumor,
  onNavigateToFamily,
  onNavigateToChapters,
  onOpenTemplate,
  onOpenMoment,
  onRequestCreate,
}: HomeScreenProps) {
  const [showBabySelector, setShowBabySelector] = useState(false);
  const [expandedMoment, setExpandedMoment] = useState<Moment | null>(null);
  const [dismissedSuggestions, setDismissedSuggestions] = useState<string[]>([]);
  const [snoozedUntil, setSnoozedUntil] = useState<Record<string, number>>({});

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
  } = useBabyData();

  const ageLabel = currentBaby ? calculateAge(currentBaby.birthDate) : '';
  const babyAgeInDays = currentBaby ? getBabyAgeInDays(currentBaby.birthDate) : 0;
  const moments = getMoments();
  const sortedMoments = useMemo(
    () => [...moments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [moments],
  );
  const recentMoments = sortedMoments.slice(0, 8);

  const placeholderLookup = useMemo(() => {
    const map = new Map<string, { template: PlaceholderTemplate; chapter: Chapter }>();
    chapters.forEach(chapter => {
      const placeholders = getPlaceholdersForChapter(chapter.id, babyAgeInDays);
      placeholders.forEach(template => {
        map.set(template.id, { template, chapter });
      });
    });
    return map;
  }, [chapters, getPlaceholdersForChapter, babyAgeInDays]);

  const completedTemplates = useMemo(() => {
    const ids = new Set<string>();
    moments.forEach(moment => {
      if (moment.templateId) {
        ids.add(moment.templateId);
      }
    });
    return ids;
  }, [moments]);

  const growthMeasurements = getGrowthMeasurements();
  const latestGrowth = growthMeasurements[growthMeasurements.length - 1];
  const previousGrowth = growthMeasurements[growthMeasurements.length - 2];
  const vaccines = getVaccines();
  const sleepEntries = getSleepHumorEntries();
  const heroNarrative = useMemo(() => {
    if (!currentBaby) return '';
    const monthName = formatDate(new Date(), { month: 'long' });
    const highlight = recentMoments[0];
    if (highlight?.noteShort) {
      return `Os dias de ${monthName} têm um charme especial — ${currentBaby.name} ${highlight.noteShort.toLowerCase()}`;
    }
    if (highlight?.noteLong) {
      return `Os dias de ${monthName} têm um charme especial — ${highlight.noteLong}`;
    }
    return `Os dias de ${monthName} têm um charme especial — ${currentBaby.name} está descobrindo o mundo com ${moments.length} memórias guardadas.`;
  }, [currentBaby, recentMoments, moments.length]);

  const heroLocation = `${currentBaby?.city ?? 'São Paulo, SP'} · 23°C ☁️`;

  const growthSubtitle = latestGrowth && previousGrowth
    ? `↗ +${(latestGrowth.weight - previousGrowth.weight).toFixed(1)} kg este mês`
    : 'Acompanhe as medidas';

  const vaccineProgress = `${vaccines.filter(v => v.status === 'completed').length} de ${vaccines.length}`;
  const pendingVaccines = vaccines.filter(v => v.status !== 'completed').length;

  const averageSleep =
    sleepEntries.length > 0
      ? (sleepEntries.reduce((sum, entry) => sum + entry.sleepHours, 0) / sleepEntries.length).toFixed(1)
      : '0';
  const recentMoods = sleepEntries.slice(-5).map(entry => MOOD_EMOJI[entry.mood] ?? '💤');

  const upcomingHealth = useMemo(() => {
    const items = Array.from(placeholderLookup.values())
      .filter(item => item.template.templateType === 'consulta' || item.template.templateType === 'vacina')
      .filter(item => item.template.allowMultiple || !completedTemplates.has(item.template.id))
      .sort((a, b) => (a.template.ageRangeStart ?? 9999) - (b.template.ageRangeStart ?? 9999));

    const next = items.find(entry => (entry.template.ageRangeStart ?? babyAgeInDays) >= babyAgeInDays) ?? items[0];
    if (!next || !currentBaby) return null;

    const baseDate = addDays(new Date(currentBaby.birthDate), next.template.ageRangeStart ?? babyAgeInDays);
    const daysUntil = Math.max(differenceInDays(baseDate, new Date()), 0);

    return {
      label: next.template.name,
      dateLabel: formatShortDate(baseDate),
      daysUntil,
    };
  }, [babyAgeInDays, completedTemplates, currentBaby, placeholderLookup]);

  const statusCards: StatusCardConfig[] = [
    {
      id: 'growth',
      icon: '🌿',
      title: 'Crescimento',
      value: latestGrowth ? `${latestGrowth.weight.toFixed(1)}kg · ${latestGrowth.height.toFixed(0)}cm` : 'Sem registros',
      subtitle: growthSubtitle,
      onClick: onNavigateToGrowth,
    },
    {
      id: 'vaccines',
      icon: '💉',
      title: 'Vacinas',
      value: vaccineProgress,
      subtitle: pendingVaccines > 0 ? `${pendingVaccines} pendentes` : 'Tudo em dia',
      onClick: onNavigateToVaccines,
    },
    {
      id: 'sleep',
      icon: '😴',
      title: 'Sono & Humor',
      value: `${averageSleep}h / noite`,
      subtitle: recentMoods.join(' '),
      onClick: onNavigateToSleepHumor,
    },
    {
      id: 'upcoming',
      icon: '📅',
      title: 'Próximo cuidado',
      value: upcomingHealth ? upcomingHealth.label : 'Nenhum agendado',
      subtitle: upcomingHealth ? `Em ${upcomingHealth.daysUntil} dias · ${upcomingHealth.dateLabel}` : 'Tudo tranquilo',
      onClick: onNavigateToFamily,
    },
  ];
  const rawSuggestions = useMemo(() => {
    if (!currentBaby) return [] as SuggestionCardData[];
    const suggestions: SuggestionCardData[] = [];
    const now = new Date();

    // Upcoming milestone
    const milestoneCandidates = Array.from(placeholderLookup.values())
      .filter(entry => entry.template.templateType === 'primeira-vez')
      .filter(entry => entry.template.allowMultiple || !completedTemplates.has(entry.template.id))
      .sort((a, b) => (a.template.ageRangeStart ?? 0) - (b.template.ageRangeStart ?? 0));

    if (milestoneCandidates.length > 0) {
      const nextMilestone =
        milestoneCandidates.find(candidate => (candidate.template.ageRangeStart ?? babyAgeInDays) >= babyAgeInDays) ??
        milestoneCandidates[0];
      const rangeLabel = formatAgeRange(nextMilestone.template.ageRangeStart, nextMilestone.template.ageRangeEnd);
      const daysUntil = Math.max((nextMilestone.template.ageRangeStart ?? babyAgeInDays) - babyAgeInDays, 0);

      suggestions.push({
        id: `milestone-${nextMilestone.template.id}`,
        type: 'milestone',
        icon: '✨',
        title: nextMilestone.template.name,
        description: rangeLabel ? `Esperado entre ${rangeLabel}` : 'Novo marco à vista',
        metadata:
          daysUntil === 0
            ? 'Disponível agora'
            : `em ${daysUntil} ${daysUntil === 1 ? 'dia' : 'dias'}`,
        actions: [
          {
            kind: 'open-template',
            label: 'Já aconteceu!',
            chapterId: nextMilestone.chapter.id,
            templateId: nextMilestone.template.id,
            options: { titleOverride: nextMilestone.template.name, accentColor: '#7c3aed' },
          },
          { kind: 'snooze', label: 'Ainda não', days: 7 },
        ],
      });
    }

    // Monthversary
    const monthPlaceholders = Array.from(placeholderLookup.values())
      .filter(entry => entry.template.templateType === 'mesversario')
      .filter(entry => entry.template.allowMultiple || !completedTemplates.has(entry.template.id))
      .sort((a, b) => (a.template.ageRangeStart ?? 0) - (b.template.ageRangeStart ?? 0));

    if (monthPlaceholders.length > 0) {
      const nextMonth = monthPlaceholders[0];
      const targetDate = addDays(new Date(currentBaby.birthDate), nextMonth.template.ageRangeStart ?? babyAgeInDays);
      const monthAge = Math.max(Math.round((nextMonth.template.ageRangeStart ?? babyAgeInDays) / 30), 0);

      suggestions.push({
        id: `month-${nextMonth.template.id}`,
        type: 'monthversary',
        icon: '🎂',
        title: `${monthAge} meses chegando`,
        description: formatDate(targetDate, { day: '2-digit', month: 'long' }),
        metadata: 'Celebre com um álbum do mês',
        actions: [
          {
            kind: 'open-template',
            label: 'Criar álbum do mês',
            chapterId: nextMonth.chapter.id,
            templateId: nextMonth.template.id,
            options: { titleOverride: nextMonth.template.name, accentColor: '#ec4899' },
          },
          { kind: 'dismiss', label: 'Dispensar' },
        ],
      });
    }

    // Capture gap
    const latestMoment = sortedMoments[0];
    if (latestMoment) {
      const lastDate = new Date(latestMoment.date);
      const daysSince = differenceInDays(now, lastDate);
      if (daysSince >= 3) {
        suggestions.push({
          id: 'capture-gap',
          type: 'gap',
          icon: '🌿',
          title: 'Que tal guardar um momento de hoje?',
          description: `Último registro há ${daysSince} dias`,
          actions: [
            { kind: 'request-create', label: 'Capturar agora' },
            { kind: 'dismiss', label: 'Dispensar' },
          ],
        });
      }
    }

    // Celebration retrospective
    const milestoneMoments = sortedMoments
      .map(moment => ({ moment, info: moment.templateId ? placeholderLookup.get(moment.templateId) : null }))
      .filter(item => item.info?.template.templateType === 'primeira-vez');

    const celebrationCandidate = milestoneMoments.find(item => {
      const monthsAgo = differenceInMonths(now, new Date(item.moment.date));
      return monthsAgo >= 3 && monthsAgo % 3 === 0;
    });

    if (celebrationCandidate?.info) {
      const monthsAgo = differenceInMonths(now, new Date(celebrationCandidate.moment.date));
      suggestions.push({
        id: `celebration-${celebrationCandidate.moment.id}`,
        type: 'celebration',
        icon: '🎉',
        title: `Faz ${monthsAgo} meses de ${celebrationCandidate.info.template.name.toLowerCase()}!`,
        description: 'Que tal revisitar e escrever uma reflexão?',
        actions: [
          { kind: 'open-moment', label: 'Ver memória', momentId: celebrationCandidate.moment.id },
          {
            kind: 'open-template',
            label: 'Escrever reflexão',
            chapterId: '6',
            templateId: 'p6-4',
            options: {
              titleOverride: 'Reflexão especial',
              accentColor: '#f59e0b',
            },
          },
        ],
      });
    }

    return suggestions;
  }, [babyAgeInDays, completedTemplates, currentBaby, placeholderLookup, sortedMoments]);
  const suggestions = useMemo(() => {
    const now = Date.now();
    return rawSuggestions
      .filter(item => !dismissedSuggestions.includes(item.id))
      .filter(item => !snoozedUntil[item.id] || snoozedUntil[item.id] <= now)
      .slice(0, 3);
  }, [dismissedSuggestions, rawSuggestions, snoozedUntil]);

  const handleSuggestionAction = (suggestionId: string, action: SuggestionAction) => {
    switch (action.kind) {
      case 'open-template':
        if (onOpenTemplate) {
          onOpenTemplate(action.chapterId, action.templateId, action.options);
          setDismissedSuggestions(prev => (prev.includes(suggestionId) ? prev : [...prev, suggestionId]));
        } else {
          onNavigateToChapters?.();
        }
        break;
      case 'open-moment': {
        const target = moments.find(moment => moment.id === action.momentId);
        if (target && onOpenMoment) {
          onOpenMoment(target);
          setDismissedSuggestions(prev => (prev.includes(suggestionId) ? prev : [...prev, suggestionId]));
        }
        break;
      }
      case 'request-create':
        onRequestCreate?.();
        setDismissedSuggestions(prev => (prev.includes(suggestionId) ? prev : [...prev, suggestionId]));
        break;
      case 'navigate':
        if (action.destination === 'chapters') {
          onNavigateToChapters?.();
        }
        break;
      case 'snooze':
        setSnoozedUntil(prev => ({ ...prev, [suggestionId]: Date.now() + action.days * DAY_IN_MS }));
        break;
      case 'dismiss':
        setDismissedSuggestions(prev => (prev.includes(suggestionId) ? prev : [...prev, suggestionId]));
        break;
      default:
        break;
    }
  };
  const getInitials = (name: string) =>
    name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  return (
    <div className="mx-auto max-w-2xl px-5 pb-32 pt-6">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${getHeroGradient()} px-6 pb-10 pt-12 shadow-lg shadow-violet-200/40`}
      >
        <button
          type="button"
          onClick={() => setShowBabySelector(true)}
          className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 text-sm font-medium text-violet-600 shadow-sm shadow-white/30 backdrop-blur"
        >
          <Sparkles className="h-4 w-4" /> Trocar bebê
        </button>
        <div className="flex flex-col items-center gap-6 text-center">
          <Avatar className="h-28 w-28 border-4 border-white shadow-xl">
            <AvatarImage src={currentBaby?.avatar} alt={currentBaby?.name ?? 'Bebê'} />
            <AvatarFallback className="bg-white/40 text-2xl text-violet-600">
              {currentBaby ? getInitials(currentBaby.name) : '?'}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1 text-zinc-700">
            <h1 className="text-2xl font-semibold text-zinc-800">{currentBaby?.name ?? 'Bebê atual'}</h1>
            <p className="text-sm text-zinc-600">{ageLabel}</p>
            <p className="text-sm text-zinc-600">{heroLocation}</p>
          </div>
          {heroNarrative && (
            <p className="max-w-xl text-base leading-relaxed text-zinc-600">
              “{heroNarrative}”
            </p>
          )}
        </div>
      </motion.section>

      <section className="mt-8">
        <p className="text-[11px] uppercase tracking-[0.4em] text-zinc-400">✨ Para você</p>
        <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
          {suggestions.length === 0 && (
            <div className="flex min-h-[160px] w-full items-center justify-center rounded-3xl border border-dashed border-zinc-200 text-sm text-zinc-400 dark:border-zinc-700 dark:text-zinc-500">
              Tudo em paz por aqui. Explore os capítulos para novos registros.
            </div>
          )}
          {suggestions.map(suggestion => {
            const theme = SUGGESTION_THEMES[suggestion.type];
            return (
              <motion.div
                key={suggestion.id}
                layout
                className={`flex w-[260px] flex-col justify-between rounded-3xl border px-5 py-6 shadow-sm shadow-violet-200/30 ${theme.bg} ${theme.border}`}
              >
                <div className="space-y-3">
                  <span className={`text-2xl ${theme.accent}`}>{suggestion.icon}</span>
                  <div>
                    <p className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">{suggestion.title}</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300">{suggestion.description}</p>
                    {suggestion.metadata && (
                      <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-medium ${theme.pill}`}>
                        {suggestion.metadata}
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-6 space-y-2">
                  {suggestion.actions.map(action => (
                    <button
                      key={`${suggestion.id}-${action.label}`}
                      type="button"
                      onClick={() => handleSuggestionAction(suggestion.id, action)}
                      className={`w-full rounded-full px-4 py-2 text-sm font-medium transition ${
                        action.kind === 'open-template' || action.kind === 'open-moment'
                          ? 'bg-white/80 text-violet-600 shadow-sm hover:bg-white/90'
                          : 'border border-white/70 bg-transparent text-zinc-600 hover:bg-white/20'
                      }`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="mt-10">
        <p className="text-[11px] uppercase tracking-[0.4em] text-zinc-400">📊 Panorama</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {statusCards.map(card => (
            <StatusCard key={card.id} {...card} />
          ))}
        </div>
      </section>
      <section className="mt-12">
        <div className="flex items-center justify-between">
          <p className="text-[11px] uppercase tracking-[0.4em] text-zinc-400">🌸 Últimos dias</p>
          <button
            type="button"
            onClick={() => onNavigateToChapters?.()}
            className="text-xs font-medium text-violet-600 hover:underline"
          >
            Ver capítulos
          </button>
        </div>
        <div className="mt-4 columns-2 gap-4 [column-fill:_balance]">
          {recentMoments.map(moment => (
            <MemoryCard key={moment.id} moment={moment} onExpand={setExpandedMoment} />
          ))}
        </div>
        {recentMoments.length >= 5 && (
          <button
            type="button"
            onClick={() => onNavigateToChapters?.()}
            className="mt-6 w-full rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 px-5 py-4 text-sm font-medium text-violet-600 shadow-sm hover:from-violet-500/15 hover:to-fuchsia-500/15"
          >
            📖 Ver linha do tempo completa →
          </button>
        )}
      </section>

      <BabySelectorModal
        isOpen={showBabySelector}
        onClose={() => setShowBabySelector(false)}
        onBabyChange={() => undefined}
      />

      <AnimatePresence>
        {expandedMoment && (
          <ExpandedMoment
            key={expandedMoment.id}
            moment={expandedMoment}
            onClose={() => setExpandedMoment(null)}
            onOpen={onOpenMoment}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
