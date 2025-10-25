import { useCallback, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { toast } from 'sonner';
import { ChevronRight, Clock, MapPin, Sparkles, TrendingUp, Syringe, Moon, X, Share2, Pencil, Trash2 } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BabySelectorModal } from '../baby/BabySelectorModal';
import { useBabyData } from '@/lib/baby-data-context';
import type { Chapter, Moment, PlaceholderTemplate } from '@/lib/types';
import { useTheme } from '@/lib/theme-context';

interface HomeScreenProps {
  onNavigateToGrowth?: () => void;
  onNavigateToVaccines?: () => void;
  onNavigateToSleepHumor?: () => void;
  onNavigateToFamily?: () => void;
  onNavigateToChapters?: () => void;
  onOpenTemplate?: (chapterId: string, templateId: string) => void;
  onOpenChapter?: (chapter: Chapter) => void;
}

type SuggestionType = 'milestone' | 'monthiversary' | 'gap' | 'celebration';

interface SuggestionCardData {
  id: string;
  type: SuggestionType;
  title: string;
  description: string;
  accent: string;
  actions: Array<{
    label: string;
    variant?: 'primary' | 'ghost';
    onClick: () => void;
  }>;
}

const SUGGESTION_COLORS: Record<SuggestionType, string> = {
  milestone: 'from-violet-500/90 to-purple-500/80',
  monthiversary: 'from-rose-400/90 to-pink-400/80',
  gap: 'from-emerald-400/90 to-teal-400/80',
  celebration: 'from-amber-400/90 to-orange-400/80',
};

function Sparkline({ values }: { values: number[] }) {
  if (values.length === 0) return null;

  const max = Math.max(...values);
  const min = Math.min(...values);

  const points = values
    .map((value, index) => {
      const x = values.length === 1 ? 100 : (index / (values.length - 1)) * 100;
      const y = max === min ? 50 : ((max - value) / (max - min)) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-10 w-full" role="presentation">
      <defs>
        <linearGradient id="sparklineGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(109,40,217,0.35)" />
          <stop offset="100%" stopColor="rgba(109,40,217,0)" />
        </linearGradient>
      </defs>
      <polyline
        points={points}
        fill="none"
        stroke="rgba(109,40,217,0.65)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
});

const longDateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

function formatShortDate(date: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return dateFormatter.format(parsed);
}

function formatLongDate(date: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return longDateFormatter.format(parsed);
}

function getPrivacyBadge(privacy: Moment['privacy']) {
  switch (privacy) {
    case 'private':
      return '🔒 Privado';
    case 'link':
      return '🔗 Público';
    default:
      return '👨‍👩‍👧 Família';
  }
}

function getPeriodGradient(theme: 'light' | 'dark', hour: number) {
  if (hour >= 18 || hour < 5) {
    return theme === 'dark'
      ? 'from-indigo-900/60 via-purple-900/40 to-purple-800/30'
      : 'from-indigo-50 via-purple-50 to-purple-100';
  }
  if (hour >= 12) {
    return theme === 'dark'
      ? 'from-sky-900/40 via-indigo-900/40 to-indigo-800/30'
      : 'from-sky-50 via-blue-50 to-indigo-100';
  }
  return theme === 'dark'
    ? 'from-amber-900/40 via-orange-900/30 to-rose-900/20'
    : 'from-amber-50 via-orange-50 to-rose-50';
}

function getMockWeather(city?: string | null) {
  if (!city) return null;
  const icons = ['☀️', '🌤️', '⛅️', '☁️'];
  const index = Math.abs(city.length % icons.length);
  const baseTemp = 20 + (city.charCodeAt(0) % 8);
  return {
    icon: icons[index],
    temperature: baseTemp,
  };
}

function buildNarrative({
  babyName,
  latestMoment,
  periodLabel,
  ageDescription,
}: {
  babyName: string;
  latestMoment?: Moment;
  periodLabel: string;
  ageDescription: string;
}) {
  const base = `${babyName} ilumina este ${periodLabel.toLowerCase()} com ${ageDescription}.`;
  if (!latestMoment) {
    return `${base} Que tal registrar um novo capítulo hoje?`;
  }
  const title = latestMoment.title.toLowerCase();
  return `${base} A última memória foi “${title}” — vamos continuar a história?`;
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
  const [expandedMoment, setExpandedMoment] = useState<Moment | null>(null);
  const [dismissedSuggestions, setDismissedSuggestions] = useState<string[]>([]);

  const dismissSuggestion = useCallback((id: string) => {
    setDismissedSuggestions(prev => [...prev, id]);
    toast('Sugestão dispensada', {
      duration: 5000,
      action: {
        label: 'Desfazer',
        onClick: () => {
          setDismissedSuggestions(prev => prev.filter(item => item !== id));
        },
      },
    });
  }, [setDismissedSuggestions]);

  const {
    currentBaby,
    chapters,
    calculateAge,
    getAgeInMonths,
    getBabyAgeInDays,
    getMoments,
    getPlaceholdersForChapter,
    getGrowthMeasurements,
    getVaccines,
    getSleepHumorEntries,
    getFamilyMembers,
  } = useBabyData();
  const { theme } = useTheme();

  const moments = getMoments();
  const sortedMoments = useMemo(
    () => [...moments].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [moments],
  );
  const chaptersById = useMemo(() =>
    chapters.reduce<Record<string, Chapter>>((acc, chapter) => {
      acc[chapter.id] = chapter;
      return acc;
    }, {}), [chapters]);

  const ageLabel = currentBaby ? calculateAge(currentBaby.birthDate) : '';
  const ageInDays = currentBaby ? getBabyAgeInDays(currentBaby.birthDate) : 0;
  const ageInMonths = currentBaby ? getAgeInMonths(currentBaby.birthDate) : 0;
  const heroWeather = getMockWeather(currentBaby?.city);
  const heroGradient = getPeriodGradient(theme, new Date().getHours());
  const periodLabel = new Date().getHours() >= 18
    ? 'Noite macia'
    : new Date().getHours() >= 12
      ? 'Tarde iluminada'
      : 'Manhã suave';

  const narrative = currentBaby
    ? buildNarrative({
        babyName: currentBaby.name,
        latestMoment: sortedMoments[0],
        periodLabel,
        ageDescription: `${ageInMonths} mês${ageInMonths === 1 ? '' : 'es'}`,
      })
    : 'Bem-vindo(a)! Vamos guardar memórias com carinho.';

  const growthMeasurements = getGrowthMeasurements();
  const latestGrowth = growthMeasurements[growthMeasurements.length - 1];
  const previousGrowth = growthMeasurements[growthMeasurements.length - 2];
  const weightVariation = latestGrowth && previousGrowth
    ? (latestGrowth.weight - previousGrowth.weight).toFixed(1)
    : null;

  const vaccines = getVaccines();
  const completedVaccines = vaccines.filter(v => v.status === 'completed').length;
  const pendingVaccines = vaccines.filter(v => v.status !== 'completed').length;

  const sleepEntries = getSleepHumorEntries();
  const averageSleep = sleepEntries.length
    ? (sleepEntries.reduce((sum, entry) => sum + entry.sleepHours, 0) / sleepEntries.length).toFixed(1)
    : null;
  const familyMembers = getFamilyMembers();
  const upcomingAppointment = upcomingMilestones.find(
    item => item.template.templateType === 'consulta',
  );
  const appointmentValue = upcomingAppointment
    ? upcomingAppointment.template.name
    : familyMembers.length
      ? `${familyMembers.length} membro${familyMembers.length === 1 ? '' : 's'}`
      : 'Nenhum compromisso';
  const appointmentSubtitle = upcomingAppointment
    ? upcomingAppointment.label
    : 'Adicionar compromisso';

  const upcomingMilestones = useMemo(() => {
    const items: Array<{ chapter: Chapter; template: PlaceholderTemplate; daysUntil: number }> = [];

    chapters.forEach(chapter => {
      const placeholders = getPlaceholdersForChapter(chapter.id, ageInDays)
        .filter(template => {
          if (template.allowMultiple) return true;
          return !moments.some(moment => moment.templateId === template.id);
        })
        .sort((a, b) => (a.ageRangeStart ?? 0) - (b.ageRangeStart ?? 0));

      if (placeholders[0]) {
        const target = placeholders[0];
        const daysUntil = Math.max((target.ageRangeStart ?? ageInDays) - ageInDays, 0);
        items.push({ chapter, template: target, daysUntil });
      }
    });

    return items
      .sort((a, b) => a.daysUntil - b.daysUntil)
      .slice(0, 3)
      .map(item => ({
        ...item,
        label: item.daysUntil === 0
          ? 'Disponível agora'
          : `em ${item.daysUntil} dia${item.daysUntil === 1 ? '' : 's'}`,
      }));
  }, [chapters, getPlaceholdersForChapter, moments, ageInDays]);

  const nextMonthiversary = useMemo(() => {
    if (!currentBaby) return null;
    const birthDate = new Date(currentBaby.birthDate);
    const today = new Date();
    const next = new Date(birthDate);
    next.setMonth(birthDate.getMonth() + ageInMonths + 1);
    if (next < today) {
      next.setMonth(next.getMonth() + 1);
    }
    const diff = Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return {
      date: next,
      daysRemaining: diff,
    };
  }, [currentBaby, ageInMonths]);

  const lastMomentDate = sortedMoments[0]?.date ? new Date(sortedMoments[0].date) : null;
  const daysSinceLastMoment = lastMomentDate
    ? Math.floor((Date.now() - lastMomentDate.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const retrospectiveMoment = sortedMoments.find(moment => {
    const momentDate = new Date(moment.date);
    return Date.now() - momentDate.getTime() > 1000 * 60 * 60 * 24 * 180;
  });

  const suggestions = useMemo<SuggestionCardData[]>(() => {
    const list: SuggestionCardData[] = [];

    if (upcomingMilestones[0]) {
      const { chapter, template, label } = upcomingMilestones[0];
      list.push({
        id: `milestone-${template.id}`,
        type: 'milestone',
        title: `Marco esperado: ${template.name}`,
        description: `${chapter.name} · ${label}`,
        accent: SUGGESTION_COLORS.milestone,
        actions: [
          {
            label: 'Já aconteceu!',
            variant: 'primary',
            onClick: () => {
              if (onOpenTemplate) {
                onOpenTemplate(chapter.id, template.id);
              }
              toast.success('Preparando registro do marco ✨');
            },
          },
          {
            label: 'Ainda não',
            onClick: () => toast('Lembraremos disso daqui a 7 dias.'),
          },
        ],
      });
    }

    if (nextMonthiversary) {
      list.push({
        id: 'monthiversary',
        type: 'monthiversary',
        title: 'Mêsversário chegando',
        description: `Faltam ${Math.max(nextMonthiversary.daysRemaining, 0)} dia${
          nextMonthiversary.daysRemaining === 1 ? '' : 's'
        } para comemorar.`,
        accent: SUGGESTION_COLORS.monthiversary,
        actions: [
          {
            label: 'Criar álbum do mês',
            variant: 'primary',
            onClick: () => {
              const monthChapter = chapters.find(chapter => /m[eê]svers/i.test(chapter.name));
              if (monthChapter && onOpenChapter) {
                onOpenChapter(monthChapter);
              }
              toast.success('Vamos preparar o álbum do mês 💜');
            },
          },
          { label: 'Dispensar', onClick: () => dismissSuggestion('monthiversary') },
        ],
      });
    }

    if (daysSinceLastMoment !== null && daysSinceLastMoment >= 3) {
      list.push({
        id: 'gap',
        type: 'gap',
        title: 'Faz um tempinho...',
        description: `Há ${daysSinceLastMoment} dia${daysSinceLastMoment === 1 ? '' : 's'} sem novos registros.`,
        accent: SUGGESTION_COLORS.gap,
        actions: [
          {
            label: '+ Capturar agora',
            variant: 'primary',
            onClick: () => {
              if (onNavigateToChapters) {
                onNavigateToChapters();
              }
            },
          },
        ],
      });
    }

    if (retrospectiveMoment) {
      list.push({
        id: `celebration-${retrospectiveMoment.id}`,
        type: 'celebration',
        title: `Faz 6 meses de ${retrospectiveMoment.title}!`,
        description: 'Reviva esse momento ou escreva uma reflexão especial.',
        accent: SUGGESTION_COLORS.celebration,
        actions: [
          {
            label: 'Ver memória',
            variant: 'primary',
            onClick: () => setExpandedMoment(retrospectiveMoment),
          },
          {
            label: 'Escrever reflexão',
            onClick: () => toast('Abrindo espaço para reflexão...'),
          },
        ],
      });
    }

    return list.filter(item => !dismissedSuggestions.includes(item.id)).slice(0, 3);
  }, [
    chapters,
    dismissedSuggestions,
    dismissSuggestion,
    nextMonthiversary,
    onNavigateToChapters,
    onOpenChapter,
    onOpenTemplate,
    retrospectiveMoment,
    daysSinceLastMoment,
    upcomingMilestones,
    setExpandedMoment,
  ]);

  const widgetCards = [
    {
      id: 'growth',
      title: 'Crescimento',
      icon: <TrendingUp className="h-5 w-5 text-violet-500" />,
      value: latestGrowth ? `${latestGrowth.weight} kg · ${latestGrowth.height} cm` : 'Sem medições',
      subtitle: weightVariation ? `↗︎ +${weightVariation} kg este mês` : undefined,
      onClick: onNavigateToGrowth,
      extra: <Sparkline values={growthMeasurements.map(item => item.weight)} />,
    },
    {
      id: 'vaccines',
      title: 'Vacinas',
      icon: <Syringe className="h-5 w-5 text-rose-500" />,
      value: `${completedVaccines} de ${vaccines.length}`,
      subtitle: pendingVaccines ? `${pendingVaccines} pendente${pendingVaccines === 1 ? '' : 's'}` : 'Tudo em dia!',
      onClick: onNavigateToVaccines,
    },
    {
      id: 'sleep',
      title: 'Sono',
      icon: <Moon className="h-5 w-5 text-blue-500" />,
      value: averageSleep ? `${averageSleep}h média` : 'Sem registros',
      subtitle: 'Últimos 7 dias',
      onClick: onNavigateToSleepHumor,
    },
    {
      id: 'family',
      title: 'Próximo compromisso',
      icon: <Clock className="h-5 w-5 text-emerald-500" />,
      value: appointmentValue,
      subtitle: appointmentSubtitle,
      onClick: onNavigateToFamily,
    },
  ];

  const timelineShortcutVisible = sortedMoments.length >= 4;

  const isEmptyHome = sortedMoments.length === 0;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-8 px-4 pb-36 pt-8">
      <section
        className={`relative overflow-hidden rounded-[32px] border border-white/60 bg-gradient-to-br ${heroGradient} p-8 text-center shadow-soft dark:border-white/10`}
        style={{ minHeight: '40vh' }}
      >
        <div className="absolute inset-0 bg-white/30 backdrop-blur-xl dark:bg-white/5" aria-hidden="true" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-4">
          <button
            type="button"
            className="rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-violet-700 shadow-sm backdrop-blur hover:scale-[1.02] transition-transform dark:bg-white/20 dark:text-violet-200"
            onClick={() => setShowBabySelector(true)}
          >
            Trocar bebê
          </button>
          <Avatar className="h-28 w-28 border-4 border-white/70 shadow-soft">
            <AvatarImage src={currentBaby?.avatar} alt={currentBaby?.name ?? 'Bebê atual'} />
            <AvatarFallback className="bg-violet-500/20 text-3xl text-violet-600">
              {currentBaby?.name?.slice(0, 2).toUpperCase() ?? 'BB'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-semibold text-violet-900 dark:text-violet-100">
              {currentBaby?.name ?? 'Bebê atual'} · {ageLabel}
            </h1>
            {currentBaby?.city && (
              <p className="mt-1 flex items-center justify-center gap-2 text-sm text-violet-800/80 dark:text-violet-200/70">
                <MapPin className="h-4 w-4" />
                <span>
                  {currentBaby.city}
                  {heroWeather ? ` · ${heroWeather.temperature}°C ${heroWeather.icon}` : ''}
                </span>
              </p>
            )}
          </div>
          <p className="max-w-xl text-base text-violet-900/80 dark:text-violet-100/70">
            {narrative}
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs uppercase tracking-[0.3em] text-zinc-400">✨ Para você</span>
          {suggestions.length > 0 && (
            <span className="text-xs text-zinc-400">
              {suggestions.length} sugestão{suggestions.length === 1 ? '' : 'es'}
            </span>
          )}
        </div>
        {suggestions.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-violet-200/80 bg-violet-50/60 p-6 text-center text-sm text-violet-700 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-100">
            Estamos acompanhando. Novas sugestões aparecerão conforme a rotina.
          </div>
        ) : (
          <div className="flex snap-x gap-4 overflow-x-auto pb-2">
            {suggestions.map(suggestion => (
              <motion.article
                key={suggestion.id}
                layout
                className={`relative w-[260px] shrink-0 snap-start overflow-hidden rounded-3xl bg-white/90 p-5 shadow-soft backdrop-blur-lg transition-[transform,box-shadow] hover:-translate-y-1 hover:shadow-soft-hover dark:bg-zinc-900/70`}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${suggestion.accent}`} aria-hidden="true" />
                <div className="flex items-center gap-2 text-sm font-medium text-white drop-shadow">
                  <Sparkles className="h-4 w-4" />
                  {suggestion.title}
                </div>
                <p className="mt-3 text-sm text-white/90">{suggestion.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {suggestion.actions.map(action => (
                    <button
                      key={`${suggestion.id}-${action.label}`}
                      type="button"
                      onClick={action.onClick}
                      className={`rounded-full px-4 py-2 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
                        action.variant === 'primary'
                          ? 'bg-white text-violet-600 shadow-sm hover:bg-violet-100'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {action.label}
                    </button>
                  ))}
                  {!suggestion.actions.some(action => action.label.toLowerCase().includes('dispensar')) && (
                    <button
                      type="button"
                      onClick={() => dismissSuggestion(suggestion.id)}
                      className="rounded-full bg-white/10 px-3 py-2 text-xs text-white/70 transition hover:bg-white/20"
                    >
                      Dispensar
                    </button>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-semibold text-foreground">📊 Panorama</h2>
          <button
            type="button"
            onClick={() => onNavigateToChapters?.()}
            className="text-sm text-violet-600 hover:text-violet-700 focus:outline-none"
          >
            Ver capítulos
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {widgetCards.map(widget => (
            <motion.button
              key={widget.id}
              type="button"
              onClick={widget.onClick}
              className="flex h-full flex-col gap-3 rounded-3xl border border-white/70 bg-white/80 p-4 text-left shadow-soft backdrop-blur dark:border-white/10 dark:bg-zinc-900/60"
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 shadow-sm dark:bg-white/10">
                    {widget.icon}
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-zinc-400">{widget.title}</p>
                    <p className="text-lg font-semibold text-foreground">{widget.value}</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-400" />
              </div>
              {widget.subtitle && <p className="text-sm text-zinc-500 dark:text-zinc-400">{widget.subtitle}</p>}
              {widget.extra}
            </motion.button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-semibold text-foreground">🌸 Últimos dias</h2>
          <button
            type="button"
            onClick={() => onNavigateToChapters?.()}
            className="text-sm text-violet-600 hover:text-violet-700 focus:outline-none"
          >
            Linha do tempo
          </button>
        </div>

        {isEmptyHome ? (
          <div className="rounded-3xl border border-dashed border-violet-200/80 bg-white/70 p-6 text-center shadow-soft dark:border-violet-500/30 dark:bg-white/5">
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              Nenhuma memória por aqui ainda. Que tal adicionar o nascimento ou contar a história do nome?
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => onNavigateToChapters?.()}
                className="rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 px-5 py-2 text-sm font-medium text-white shadow-sm"
              >
                Adicionar primeira memória
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="columns-2 gap-4 [column-fill:_balance]">
              {sortedMoments.map(moment => (
                <motion.article
                  key={moment.id}
                  layout
                  className="mb-4 break-inside-avoid rounded-3xl border border-white/70 bg-white/80 shadow-soft transition hover:-translate-y-1 hover:shadow-soft-hover dark:border-white/10 dark:bg-zinc-900/60"
                >
                  <button
                    type="button"
                    className="w-full text-left"
                    onClick={() => setExpandedMoment(moment)}
                  >
                    {moment.media?.[0] && (
                      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-t-3xl">
                        <img
                          src={`${moment.media[0]}&auto=format&fit=crop&w=600`}
                          alt={moment.title}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="space-y-2 p-4">
                      <div className="flex items-center justify-between text-xs text-zinc-500">
                        <span>{formatShortDate(moment.date)}</span>
                        <span className="rounded-full bg-violet-100 px-3 py-1 text-[11px] font-medium text-violet-700 dark:bg-violet-500/10 dark:text-violet-200">
                          {getPrivacyBadge(moment.privacy)}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-foreground">{moment.title}</h3>
                      {moment.noteShort && (
                        <p
                          className="text-sm text-zinc-600 dark:text-zinc-300"
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {moment.noteShort}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 text-[11px] text-zinc-500">
                        <span className="rounded-full bg-zinc-100 px-3 py-1 dark:bg-white/10">
                          {chaptersById[moment.chapterId]?.name ?? 'Capítulo'}
                        </span>
                        {moment.tags?.slice(0, 2).map(tag => (
                          <span key={tag} className="rounded-full bg-zinc-100 px-3 py-1 dark:bg-white/10">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                </motion.article>
              ))}
            </div>

            {timelineShortcutVisible && (
              <button
                type="button"
                onClick={() => onNavigateToChapters?.()}
                className="flex w-full items-center justify-between gap-3 rounded-3xl border border-violet-200 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 p-5 text-left shadow-soft transition hover:-translate-y-1 hover:shadow-soft-hover dark:border-violet-500/30 dark:bg-violet-500/10"
              >
                <div>
                  <h3 className="text-base font-semibold text-violet-700 dark:text-violet-200">📖 Ver linha do tempo completa</h3>
                  <p className="text-sm text-violet-600/80 dark:text-violet-100/70">
                    Revise tudo em ordem cronológica e encontre memórias por filtros.
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-violet-500" />
              </button>
            )}
          </>
        )}
      </section>

      <BabySelectorModal
        isOpen={showBabySelector}
        onClose={() => setShowBabySelector(false)}
        onBabyChange={() => undefined}
      />

      <AnimatePresence>
        {expandedMoment && (
          <motion.div
            key={expandedMoment.id}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedMoment(null)}
          >
            <motion.div
              className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-card p-6 shadow-soft"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={event => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setExpandedMoment(null)}
                className="absolute right-4 top-4 rounded-full bg-zinc-100 p-2 text-zinc-500 transition hover:bg-zinc-200 dark:bg-white/10 dark:text-zinc-300 dark:hover:bg-white/20"
                aria-label="Fechar"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="space-y-4">
                {expandedMoment.media?.length ? (
                  <div className="flex snap-x gap-4 overflow-x-auto rounded-2xl">
                    {expandedMoment.media.map(src => (
                      <img
                        key={src}
                        src={`${src}&auto=format&fit=crop&w=800`}
                        alt={expandedMoment.title}
                        className="h-56 w-72 shrink-0 rounded-2xl object-cover"
                      />
                    ))}
                  </div>
                ) : null}

                <div className="space-y-2">
                  <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700 dark:bg-violet-500/10 dark:text-violet-200">
                    {getPrivacyBadge(expandedMoment.privacy)}
                  </span>
                  <h3 className="text-xl font-semibold text-foreground">{expandedMoment.title}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-300">
                    {formatLongDate(expandedMoment.date)} · {expandedMoment.location ?? 'Local não informado'}
                  </p>
                  {expandedMoment.noteLong && (
                    <p className="text-sm leading-relaxed text-foreground/80">
                      {expandedMoment.noteLong}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                  {expandedMoment.people?.map(person => (
                    <span key={person} className="rounded-full bg-zinc-100 px-3 py-1 dark:bg-white/10">
                      {person}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-full bg-violet-100 px-4 py-2 text-sm font-medium text-violet-700 transition hover:bg-violet-200 dark:bg-violet-500/10 dark:text-violet-200"
                    onClick={() => toast('Editar memória em breve!')}
                  >
                    <Pencil className="h-4 w-4" />
                    Editar
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-violet-600 shadow-sm transition hover:bg-violet-50 dark:bg-white/10 dark:text-violet-200"
                    onClick={() => toast.success('Link copiado com expiração em 24h!')}
                  >
                    <Share2 className="h-4 w-4" />
                    Compartilhar
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-100 dark:bg-red-500/10 dark:text-red-200"
                    onClick={() => toast('Memória enviada para lixeira por 5 segundos')}
                  >
                    <Trash2 className="h-4 w-4" />
                    Excluir
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
