import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CalendarDays,
  ChevronRight,
  MapPin,
  Moon,
  PartyPopper,
  Sparkles,
  Sprout,
  Sun,
  Wind,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BabySelectorModal } from '../baby/BabySelectorModal';
import { useBabyData } from '@/lib/baby-data-context';
import type { Chapter, PlaceholderTemplate } from '@/lib/types';

interface HomeScreenProps {
  onNavigateToGrowth?: () => void;
  onNavigateToVaccines?: () => void;
  onNavigateToSleepHumor?: () => void;
  onNavigateToFamily?: () => void;
  onNavigateToChapters?: () => void;
  onOpenTemplate?: (chapterId: string, templateId: string) => void;
} 

type SuggestionType = 'milestone' | 'monthversary' | 'gap' | 'celebration';

interface SuggestionCard {
  id: string;
  type: SuggestionType;
  title: string;
  subtitle: string;
  description: string;
  accent: string;
  icon: string;
  primaryAction?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
}

interface SparklineProps {
  values: number[];
  color: string;
}

const Sparkline = ({ values, color }: SparklineProps) => {
  if (!values.length) {
    return (
      <div className="text-xs text-muted-foreground">Sem dados recentes</div>
    );
  }

  const width = 120;
  const height = 40;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1 || 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-12 w-full">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth={2}
        points={points}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const getMoonPhaseEmoji = (date: Date) => {
  const lunarCycle = 29.53058867;
  const knownNewMoon = new Date('2001-01-01T00:00:00Z');
  const diff = date.getTime() - knownNewMoon.getTime();
  const phase = ((diff % (lunarCycle * 86400000)) / (lunarCycle * 86400000)) * 8;
  const index = Math.round(phase) % 8;
  const phases = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'];
  return phases[index];
};

const getWeatherMood = (hour: number) => {
  if (hour < 6) {
    return { temperature: '21°C', icon: '🌙', description: 'brisa calma' };
  }
  if (hour < 12) {
    return { temperature: '23°C', icon: '🌤️', description: 'céu suave' };
  }
  if (hour < 18) {
    return { temperature: '26°C', icon: '☁️', description: 'brisa leve' };
  }
  return { temperature: '22°C', icon: '🌙', description: 'noite fresca' };
};

const getHeroGradient = (hour: number) => {
  if (hour >= 5 && hour < 12) {
    return 'from-amber-50 via-orange-50 to-orange-100';
  }
  if (hour >= 12 && hour < 18) {
    return 'from-sky-50 via-blue-50 to-blue-100';
  }
  return 'from-indigo-50 via-purple-50 to-purple-100';
};

const formatDate = (value: string | Date, options?: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('pt-BR', options).format(typeof value === 'string' ? new Date(value) : value);

export function HomeScreen({
  onNavigateToGrowth,
  onNavigateToVaccines,
  onNavigateToSleepHumor,
  onNavigateToFamily,
  onNavigateToChapters,
  onOpenTemplate,
}: HomeScreenProps) {
  const [showBabySelector, setShowBabySelector] = useState(false);
  const [dismissedSuggestions, setDismissedSuggestions] = useState<string[]>([]);
  const {
    currentBaby,
    calculateAge,
    getBabyAgeInDays,
    getAgeInMonths,
    getMoments,
    chapters,
    getPlaceholdersForChapter,
    getGrowthMeasurements,
    getVaccines,
    getSleepHumorEntries,
    getFamilyMembers,
  } = useBabyData();

  const now = new Date();
  const hour = now.getHours();
  const heroGradient = getHeroGradient(hour);
  const weatherMood = getWeatherMood(hour);
  const moonPhase = getMoonPhaseEmoji(now);

  const rawMoments = getMoments();
  const moments = useMemo(() => {
    return rawMoments.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [rawMoments]);

  const latestMoment = moments[0];
  const ageLabel = currentBaby ? calculateAge(currentBaby.birthDate) : '';
  const babyAgeInDays = currentBaby ? getBabyAgeInDays(currentBaby.birthDate) : 0;

  const narrative = useMemo(() => {
    if (!currentBaby) return '';

    const monthName = formatDate(now, { month: 'long' });
    const snippet = latestMoment?.noteShort ?? 'Os detalhes simples têm roubado a cena por aqui';
    const location = currentBaby.city.split(',')[0] ?? currentBaby.city;
    return `"${monthName.charAt(0).toUpperCase() + monthName.slice(1)} tem seu charme" — ${snippet}. ${moonPhase}`;
  }, [currentBaby, latestMoment, now, moonPhase]);

  const growthMeasurements = getGrowthMeasurements();
  const sleepEntries = getSleepHumorEntries();
  const familyMembers = getFamilyMembers();
  const vaccines = getVaccines();

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map(segment => segment[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const upcomingMilestones = useMemo(() => {
    const items: Array<{
      chapter: Chapter;
      template: PlaceholderTemplate;
      daysUntil: number;
    }> = [];

    chapters.forEach(chapter => {
      const placeholders = getPlaceholdersForChapter(chapter.id, babyAgeInDays)
        .filter(placeholder => {
          if (placeholder.allowMultiple) return true;
          return !moments.some(moment => moment.templateId === placeholder.id);
        })
        .sort((a, b) => (a.ageRangeStart ?? 0) - (b.ageRangeStart ?? 0));

      const next = placeholders[0];
      if (next) {
        const targetDay = next.ageRangeStart ?? babyAgeInDays;
        const daysUntil = Math.max(targetDay - babyAgeInDays, 0);
        items.push({ chapter, template: next, daysUntil });
      }
    });

    return items
      .sort((a, b) => a.daysUntil - b.daysUntil)
      .map(item => ({
        ...item,
        label:
          item.daysUntil === 0
            ? 'Agora mesmo'
            : `em ${item.daysUntil} ${item.daysUntil === 1 ? 'dia' : 'dias'}`,
      }));
  }, [chapters, getPlaceholdersForChapter, babyAgeInDays, moments]);

  const nextMonthTemplate = useMemo(() => {
    const placeholders = getPlaceholdersForChapter('5', babyAgeInDays);
    return placeholders.find(placeholder => !moments.some(moment => moment.templateId === placeholder.id));
  }, [babyAgeInDays, getPlaceholdersForChapter, moments]);

  const nextMonthversaryCard = useMemo(() => {
    if (!currentBaby) return null;
    const birthDate = new Date(currentBaby.birthDate);
    const currentMonths = getAgeInMonths(currentBaby.birthDate);
    const nextDate = new Date(birthDate);
    nextDate.setMonth(birthDate.getMonth() + currentMonths + 1);
    if (nextDate <= now) {
      nextDate.setMonth(nextDate.getMonth() + 1);
    }
    const diffDays = Math.max(
      Math.ceil((nextDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
      0,
    );
    const monthNumber = currentMonths + 1;
    return {
      monthNumber,
      dateLabel: formatDate(nextDate, { day: 'numeric', month: 'long' }),
      diffDays,
    };
  }, [currentBaby, getAgeInMonths, now]);

  const hasRecentGap = useMemo(() => {
    const lastMoment = moments[0];
    if (!lastMoment) return true;
    const lastDate = new Date(lastMoment.date);
    const diffDays = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 3;
  }, [moments, now]);

  const retroCelebration = useMemo(() => {
    if (!moments.length) return null;
    const targetDate = new Date(now);
    targetDate.setMonth(targetDate.getMonth() - 6);
    const aroundMoment = moments
      .map(moment => ({
        moment,
        diff: Math.abs(new Date(moment.date).getTime() - targetDate.getTime()),
      }))
      .sort((a, b) => a.diff - b.diff)[0]?.moment;

    if (!aroundMoment) return null;
    return {
      title: aroundMoment.title,
      date: formatDate(aroundMoment.date, { day: 'numeric', month: 'long' }),
      id: aroundMoment.id,
    };
  }, [moments, now]);

  const suggestions = useMemo(() => {
    const cards: SuggestionCard[] = [];

    const milestone = upcomingMilestones[0];
    if (milestone) {
      cards.push({
        id: `milestone-${milestone.template.id}`,
        type: 'milestone',
        title: `${milestone.template.icon} ${milestone.template.name}`,
        subtitle: `${milestone.chapter.name}`,
        description: `${milestone.label} · ${milestone.template.description}`,
        accent: 'bg-violet-50 border-violet-200',
        icon: '✨',
        primaryAction: {
          label: 'Já aconteceu!',
          onClick: () => onOpenTemplate?.(milestone.chapter.id, milestone.template.id),
        },
        secondaryAction: {
          label: 'Ainda não',
          onClick: () => undefined,
        },
      });
    }

    if (nextMonthversaryCard) {
      cards.push({
        id: `month-${nextMonthversaryCard.monthNumber}`,
        type: 'monthversary',
        title: `🎂 ${nextMonthversaryCard.monthNumber}º mês amanhã`,
        subtitle: nextMonthversaryCard.dateLabel,
        description:
          nextMonthversaryCard.diffDays === 0
            ? 'Vamos celebrar hoje?'
            : `Faltam ${nextMonthversaryCard.diffDays} dias para registrar mais uma página do mês.`,
        accent: 'bg-rose-50 border-rose-200',
        icon: '🎂',
        primaryAction: nextMonthTemplate
          ? {
              label: 'Criar álbum do mês',
              onClick: () => onOpenTemplate?.('5', nextMonthTemplate.id),
            }
          : undefined,
        secondaryAction: {
          label: 'Dispensar',
          onClick: () => undefined,
        },
      });
    }

    if (hasRecentGap) {
      cards.push({
        id: 'gap',
        type: 'gap',
        title: '🌿 Tudo quietinho por aqui',
        subtitle: '3 dias sem novos registros',
        description: 'Que tal guardar um instante do hoje antes que ele voe? ',
        accent: 'bg-emerald-50 border-emerald-200',
        icon: '🌿',
        primaryAction: {
          label: '+ Capturar agora',
          onClick: () => onNavigateToChapters?.(),
        },
      });
    }

    if (retroCelebration) {
      cards.push({
        id: `retro-${retroCelebration.id}`,
        type: 'celebration',
        title: `🎉 ${retroCelebration.title}`,
        subtitle: `${retroCelebration.date} fez 6 meses`,
        description: 'Um carinho no tempo: que tal revisitar e escrever uma nota? ',
        accent: 'bg-amber-50 border-amber-200',
        icon: '🎉',
        primaryAction: {
          label: 'Ver memória',
          onClick: () => onNavigateToChapters?.(),
        },
        secondaryAction: {
          label: 'Escrever reflexão',
          onClick: () => onNavigateToChapters?.(),
        },
      });
    }

    return cards.filter(card => !dismissedSuggestions.includes(card.id)).slice(0, 3);
  }, [
    upcomingMilestones,
    nextMonthversaryCard,
    hasRecentGap,
    retroCelebration,
    dismissedSuggestions,
    onOpenTemplate,
    onNavigateToChapters,
    nextMonthTemplate,
  ]);

  const handleDismiss = (id: string) => {
    setDismissedSuggestions(prev => (prev.includes(id) ? prev : [...prev, id]));
  };

  const panoramaCards = [
    {
      id: 'growth',
      title: 'Crescimento',
      value: growthMeasurements.length
        ? `${growthMeasurements[growthMeasurements.length - 1].weight} kg · ${growthMeasurements[growthMeasurements.length - 1].height} cm`
        : 'Sem medições',
      caption: growthMeasurements.length > 1
        ? `↗ ${(growthMeasurements[growthMeasurements.length - 1].weight - growthMeasurements[growthMeasurements.length - 2].weight).toFixed(1)} kg`
        : 'Próxima consulta em breve',
      icon: <Sprout className="h-5 w-5" />,
      accent: 'bg-violet-100 text-violet-600',
      onClick: onNavigateToGrowth,
      sparkline: growthMeasurements.slice(-5).map(item => item.weight),
      sparkColor: '#6D28D9',
    },
    {
      id: 'sleep',
      title: 'Sono',
      value: sleepEntries.length
        ? `${(
            sleepEntries.reduce((sum, entry) => sum + entry.sleepHours, 0) / sleepEntries.length
          ).toFixed(1)} h`
        : 'Registrar noite',
      caption: 'Ritmo da última semana',
      icon: <Moon className="h-5 w-5" />,
      accent: 'bg-indigo-100 text-indigo-600',
      onClick: onNavigateToSleepHumor,
      sparkline: sleepEntries.slice(-7).map(entry => entry.sleepHours),
      sparkColor: '#4C1D95',
    },
    {
      id: 'vaccines',
      title: 'Vacinas',
      value: `${vaccines.filter(v => v.status === 'completed').length} de ${vaccines.length}`,
      caption: `${vaccines.filter(v => v.status !== 'completed').length} pendentes`,
      icon: <Sun className="h-5 w-5" />,
      accent: 'bg-rose-100 text-rose-600',
      onClick: onNavigateToVaccines,
      sparkline: vaccines.map((_v, index) => index + 1),
      sparkColor: '#BE185D',
    },
  ];

  const recentMoments = moments.slice(0, 8);

  const timelineItems = useMemo(() => {
    const anchors = [
      { label: 'Nascimento', date: '2023-08-17', status: 'done' as const },
      { label: 'Primeiro Sorriso', date: '2023-11-02', status: 'done' as const },
      { label: 'Engatinhou', date: '2024-03-12', status: 'done' as const },
      {
        label: upcomingMilestones[0]?.template.name ?? 'Primeira Palavra',
        date: upcomingMilestones[0]
          ? formatDate(new Date(now.getTime() + upcomingMilestones[0].daysUntil * 86400000), {
              month: 'short',
              day: 'numeric',
            })
          : 'Esperado',
        status: 'pending' as const,
      },
    ];
    return anchors;
  }, [upcomingMilestones, now]);

  return (
    <div className="mx-auto min-h-screen w-full max-w-3xl px-5 pb-32 pt-8">
      <div
        className={`relative mb-10 overflow-hidden rounded-[2.5rem] bg-gradient-to-br ${heroGradient} p-8 shadow-[0_25px_80px_-40px_rgba(91,33,182,0.4)]`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.6),_transparent_55%)]" />
        <div className="relative flex flex-col items-center gap-6">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowBabySelector(true)}
            className="relative"
          >
            <Avatar className="h-28 w-28 border-4 border-white/70 shadow-xl">
              <AvatarImage src={currentBaby?.avatar} alt={currentBaby?.name ?? 'Bebê atual'} />
              <AvatarFallback className="bg-white/60 text-3xl text-violet-500">
                {currentBaby ? getInitials(currentBaby.name) : '?'}
              </AvatarFallback>
            </Avatar>
          </motion.button>

          <div className="text-center text-balance">
            <h1 className="text-3xl font-semibold text-zinc-800">
              {currentBaby?.name ?? 'Bebê atual'}
            </h1>
            <p className="text-lg text-zinc-500">{ageLabel}</p>
          </div>

          <p className="max-w-lg text-center text-base text-zinc-600">
            {narrative}
          </p>

          <div className="flex items-center gap-3 text-sm text-zinc-600">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-4 py-1.5 text-zinc-700 shadow-sm">
              <MapPin className="h-4 w-4 text-violet-500" />
              {currentBaby?.city} · {weatherMood.temperature} {weatherMood.icon}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/70 px-4 py-1.5 text-zinc-700 shadow-sm">
              <Wind className="h-4 w-4 text-violet-500" /> {weatherMood.description}
            </span>
          </div>
        </div>
      </div>

      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.3em] text-zinc-400">✨ Para você</span>
        </div>
        <div className="-mx-1 flex gap-4 overflow-x-auto pb-2">
          <AnimatePresence initial={false}>
            {suggestions.map(card => (
              <motion.div
                key={card.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                onDragEnd={(_, info) => {
                  if (info.offset.y > 120) {
                    const confirmDismiss = window.confirm('Remover esta sugestão?');
                    if (confirmDismiss) {
                      handleDismiss(card.id);
                    }
                  }
                }}
                className={`w-[250px] shrink-0 rounded-3xl border-2 p-6 shadow-sm transition-[box-shadow] ${card.accent}`}
              >
                <div className="mb-4 text-3xl">{card.icon}</div>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm font-medium text-zinc-500">{card.subtitle}</p>
                    <h3 className="text-lg font-semibold text-zinc-800">{card.title}</h3>
                  </div>
                  <p className="text-sm text-zinc-600">{card.description}</p>
                </div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {card.primaryAction && (
                    <button
                      onClick={card.primaryAction.onClick}
                      className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800"
                    >
                      {card.primaryAction.label}
                    </button>
                  )}
                  {card.secondaryAction && (
                    <button
                      onClick={() => {
                        card.secondaryAction?.onClick();
                        handleDismiss(card.id);
                      }}
                      className="rounded-full border border-zinc-400/60 px-4 py-2 text-sm font-semibold text-zinc-500 hover:border-zinc-500"
                    >
                      {card.secondaryAction.label}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-zinc-700">📊 Panorama</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {panoramaCards.map(card => (
            <motion.button
              key={card.id}
              whileTap={{ scale: 0.97 }}
              onClick={card.onClick}
              className="group flex h-full flex-col rounded-2xl bg-white/90 p-4 text-left shadow-sm transition hover:shadow-md"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${card.accent}`}>
                  {card.icon}
                </span>
                <Sparkles className="h-4 w-4 text-zinc-300 opacity-0 transition group-hover:opacity-100" />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm text-zinc-500">{card.title}</h3>
                <p className="text-lg font-semibold text-zinc-800">{card.value}</p>
                <p className="text-xs text-zinc-400">{card.caption}</p>
                <Sparkline values={card.sparkline} color={card.sparkColor} />
              </div>
            </motion.button>
          ))}

          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={onNavigateToFamily}
            className="col-span-2 flex flex-col justify-between rounded-2xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 p-5 text-left shadow-inner"
          >
            <div className="flex items-center gap-3">
              <PartyPopper className="h-9 w-9 rounded-2xl bg-white/70 p-2 text-violet-600" />
              <div>
                <h3 className="text-sm font-semibold text-violet-700">Círculo familiar</h3>
                <p className="text-xs text-violet-500">{familyMembers.length} corações conectados</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-violet-700/80">
              Descubra quem ainda não registrou um carinho esta semana e convide para um sussurro coletivo.
            </p>
            <button className="mt-4 flex items-center gap-2 text-sm font-semibold text-violet-700">
              Abrir árvore completa <ChevronRight className="h-4 w-4" />
            </button>
          </motion.div>
        </div>
      </section>

      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-zinc-700">🌸 Últimos dias</span>
        </div>
        <div className="columns-2 gap-4 space-y-4">
          {recentMoments.map(moment => (
            <motion.div
              key={moment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="break-inside-avoid overflow-hidden rounded-3xl bg-white shadow-sm"
            >
              {moment.media?.[0] && (
                <div className="relative">
                  <img
                    src={moment.media[0]}
                    alt={moment.title}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-black/40 px-3 py-1 text-xs text-white backdrop-blur">
                    {moment.age}
                  </span>
                </div>
              )}
              <div className="space-y-2 p-4">
                <h3 className="text-base font-semibold text-zinc-800">{moment.title}</h3>
                <p className="text-xs text-zinc-400">{formatDate(moment.date, { day: 'numeric', month: 'long' })}</p>
                {moment.noteShort && (
                  <p className="text-sm text-zinc-600">{moment.noteShort}</p>
                )}
                {moment.tags && moment.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {moment.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="rounded-full bg-zinc-100 px-3 py-1 text-[11px] text-zinc-500"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-zinc-700">📖 História de {currentBaby?.name?.split(' ')[0] ?? 'Aurora'}</span>
        </div>
        <div className="space-y-6 rounded-3xl bg-white p-6 shadow-sm">
          <div className="relative pl-6">
            <div className="absolute left-2 top-0 h-full border-l-2 border-dashed border-violet-200" />
            <div className="space-y-6">
              {timelineItems.map((item, index) => (
                <div key={`${item.label}-${index}`} className="relative">
                  <div
                    className={`absolute -left-[1.35rem] flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                      item.status === 'done'
                        ? 'bg-violet-500 text-white'
                        : 'border-2 border-violet-300 text-violet-400'
                    }`}
                  >
                    {item.status === 'done' ? '●' : '○'}
                  </div>
                  <div className="rounded-2xl bg-violet-50/50 p-4">
                    <p className="text-sm font-semibold text-violet-700">{item.label}</p>
                    <p className="text-xs text-violet-500">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={onNavigateToChapters}
            className="flex items-center justify-between rounded-2xl bg-violet-600/10 px-4 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-600/20"
          >
            Ver linha do tempo completa <CalendarDays className="h-4 w-4" />
          </button>
        </div>
      </section>

      <BabySelectorModal
        isOpen={showBabySelector}
        onClose={() => setShowBabySelector(false)}
        onBabyChange={() => undefined}
      />
    </div>
  );
}
