import { useMemo, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Baby,
  CalendarDays,
  Camera,
  ChevronRight,
  Cake,
  Flower2,
  Leaf,
  MoonStar,
  PartyPopper,
  Sparkles,
  Sun,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BabySelectorModal } from '../baby/BabySelectorModal';
import { useBabyData } from '@/lib/baby-data-context';
import type { Chapter, Moment, PlaceholderTemplate } from '@/lib/types';
import { Sparkline } from '@/components/shared/Sparkline';

interface HomeScreenProps {
  onNavigateToGrowth?: () => void;
  onNavigateToVaccines?: () => void;
  onNavigateToSleepHumor?: () => void;
  onNavigateToFamily?: () => void;
  onNavigateToChapters?: () => void;
  onOpenTemplate?: (chapterId: string, templateId: string) => void;
  onOpenChapter?: (chapter: Chapter) => void;
  onOpenMoment?: (moment: Moment) => void;
}

type TimePeriod = 'morning' | 'afternoon' | 'night';

type SuggestionId =
  | 'marco_esperado'
  | 'mesversario_proximo'
  | 'lacuna_temporal'
  | 'celebracao_retroativa';

interface SuggestionCard {
  id: SuggestionId;
  title: string;
  description?: string;
  icon: ReactNode;
  style: string;
  cta: Array<{ label: string; onClick?: () => void; variant?: 'primary' | 'ghost' }>;
}

const HERO_GRADIENTS: Record<TimePeriod, string> = {
  morning: 'from-amber-50 to-orange-50',
  afternoon: 'from-sky-50 to-blue-50',
  night: 'from-indigo-50 to-purple-50',
};

function getTimePeriod(date: Date): TimePeriod {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  return 'night';
}

function getDaysBetween(dateA: Date, dateB: Date) {
  const diff = dateA.getTime() - dateB.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function formatDateTime(dateString: string) {
  const formatter = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
  });
  return formatter.format(new Date(dateString));
}

function formatTime(dateString: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
}

function getInitials(name?: string) {
  if (!name) return '?';
  return name
    .split(' ')
    .map(part => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function calculateDaysUntilMonthiversary(birthDate: string) {
  const birth = new Date(birthDate);
  const now = new Date();
  const monthsAlive =
    now.getFullYear() * 12 + now.getMonth() - (birth.getFullYear() * 12 + birth.getMonth());
  const nextMonthiversary = new Date(birth);
  nextMonthiversary.setMonth(birth.getMonth() + monthsAlive + 1);
  const diff = Math.ceil((nextMonthiversary.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return { diff, date: nextMonthiversary };
}

function findCelebrationMoment(moments: Moment[]): Moment | null {
  const now = new Date();
  const celebratoryIntervals = [30, 90, 180, 365];

  for (const moment of moments) {
    const momentDate = new Date(moment.date);
    const daysAgo = getDaysBetween(now, momentDate);
    if (celebratoryIntervals.some(interval => Math.abs(daysAgo - interval) <= 1)) {
      return moment;
    }
  }

  return null;
}

export function HomeScreen({
  onNavigateToGrowth,
  onNavigateToVaccines,
  onNavigateToSleepHumor,
  onNavigateToFamily,
  onNavigateToChapters,
  onOpenTemplate,
  onOpenChapter,
  onOpenMoment,
}: HomeScreenProps) {
  const [showBabySelector, setShowBabySelector] = useState(false);
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
    return getMoments()
      .slice()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [getMoments]);

  const now = new Date();
  const timePeriod = getTimePeriod(now);
  const heroGradient = HERO_GRADIENTS[timePeriod];
  const ageLabel = currentBaby ? calculateAge(currentBaby.birthDate) : '';
  const city = currentBaby?.city ?? 'São Paulo, SP';
  const lastMoment = moments[0];

  const narrative = useMemo(() => {
    if (!currentBaby) {
      return 'Acompanhe os detalhes do seu bebê com carinho todos os dias.';
    }

    const babyName = currentBaby.name.split(' ')[0];
    const weatherIcon = timePeriod === 'night' ? '🌙' : timePeriod === 'afternoon' ? '🌤️' : '☀️';
    const moonPhase = 'Lua Crescente';
    const lastMemory = lastMoment ? `A última memória foi “${lastMoment.title}”.` : 'Vamos registrar um momento hoje?';

    return `${babyName} aproveita o ${weatherIcon} em ${city.split(',')[0]}. ${moonPhase} ilumina a noite. ${lastMemory}`;
  }, [city, currentBaby, lastMoment, timePeriod]);

  const babyAgeInDays = currentBaby ? getBabyAgeInDays(currentBaby.birthDate) : 0;

  const upcomingMilestones = useMemo(() => {
    const items: Array<{
      chapter: Chapter;
      template: PlaceholderTemplate;
      daysUntil: number;
    }> = [];

    chapters.forEach(chapter => {
      const placeholders = getPlaceholdersForChapter(chapter.id, babyAgeInDays)
        .filter(template => {
          if (template.allowMultiple) return true;
          return !moments.some(moment => moment.templateId === template.id);
        })
        .sort((a, b) => (a.ageRangeStart ?? 0) - (b.ageRangeStart ?? 0));

      const next = placeholders[0];
      if (next) {
        const daysUntil = Math.max((next.ageRangeStart ?? babyAgeInDays) - babyAgeInDays, 0);
        items.push({ chapter, template: next, daysUntil });
      }
    });

    return items.sort((a, b) => a.daysUntil - b.daysUntil);
  }, [babyAgeInDays, chapters, getPlaceholdersForChapter, moments]);

  const growthMeasurements = getGrowthMeasurements();
  const growthTrend = growthMeasurements.slice(-6).map(item => item.weight);
  const latestGrowth = growthMeasurements[growthMeasurements.length - 1];
  const previousGrowth = growthMeasurements[growthMeasurements.length - 2];
  const weightChange =
    latestGrowth && previousGrowth
      ? (latestGrowth.weight - previousGrowth.weight).toFixed(1)
      : '0';

  const vaccines = getVaccines();
  const completedVaccines = vaccines.filter(vaccine => vaccine.status === 'completed').length;
  const totalVaccines = vaccines.length;
  const pendingVaccines = vaccines.filter(vaccine => vaccine.status !== 'completed').length;

  const sleepEntries = getSleepHumorEntries();
  const sleepTrend = sleepEntries.slice(-7).map(entry => entry.sleepHours);
  const averageSleep =
    sleepEntries.length > 0
      ? (sleepEntries.reduce((sum, entry) => sum + entry.sleepHours, 0) / sleepEntries.length).toFixed(1)
      : '0';

  const familyMembers = getFamilyMembers();

  const { diff: daysUntilMonthiversary, date: nextMonthiversaryDate } = currentBaby
    ? calculateDaysUntilMonthiversary(currentBaby.birthDate)
    : { diff: Infinity, date: new Date() };

  const daysSinceLastMoment = lastMoment ? getDaysBetween(now, new Date(lastMoment.date)) : Infinity;
  const celebrationMoment = findCelebrationMoment(moments);

  const suggestions = useMemo(() => {
    const currentDate = new Date();
    const list: SuggestionCard[] = [];

    const nextMilestone = upcomingMilestones[0];
    if (nextMilestone) {
      list.push({
        id: 'marco_esperado',
        title: nextMilestone.template.name,
        description: `${nextMilestone.chapter.name} · janela ${nextMilestone.template.ageRangeStart}-${nextMilestone.template.ageRangeEnd ?? nextMilestone.template.ageRangeStart} dias`,
        icon: <Sparkles className="w-5 h-5 text-violet-600" aria-hidden />,
        style: 'bg-violet-50/50 border-2 border-violet-200',
        cta: [
          {
            label: 'Já aconteceu!',
            onClick: () =>
              onOpenTemplate?.(nextMilestone.chapter.id, nextMilestone.template.id),
            variant: 'primary',
          },
          {
            label: 'Ainda não',
            onClick: () => undefined,
            variant: 'ghost',
          },
        ],
      });
    }

    if (daysUntilMonthiversary === 1 && currentBaby) {
      const formatted = new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'long',
      }).format(nextMonthiversaryDate);
      list.push({
        id: 'mesversario_proximo',
        title: `${calculateAge(currentBaby.birthDate).split(' ')[0]} meses amanhã`,
        description: formatted,
        icon: <Cake className="w-5 h-5 text-rose-500" aria-hidden />,
        style: 'bg-rose-50/50 border-2 border-rose-200',
        cta: [
          {
            label: 'Criar álbum do mês',
            onClick: () => onNavigateToChapters?.(),
            variant: 'primary',
          },
          { label: 'Dispensar', onClick: () => undefined, variant: 'ghost' },
        ],
      });
    }

    if (daysSinceLastMoment >= 3) {
      list.push({
        id: 'lacuna_temporal',
        title: 'Que tal guardar um momento de hoje?',
        description: 'Estamos há alguns dias sem novos registros.',
        icon: <Leaf className="w-5 h-5 text-emerald-600" aria-hidden />,
        style: 'bg-emerald-50/50 border-2 border-emerald-200',
        cta: [
          {
            label: '＋ Capturar agora',
            onClick: () => onNavigateToChapters?.(),
            variant: 'primary',
          },
        ],
      });
    }

    if (celebrationMoment) {
      list.push({
        id: 'celebracao_retroativa',
        title: `Faz ${getDaysBetween(currentDate, new Date(celebrationMoment.date))} dias desde ${celebrationMoment.title}`,
        description: 'Reviva a memória ou escreva uma reflexão.',
        icon: <PartyPopper className="w-5 h-5 text-amber-600" aria-hidden />,
        style: 'bg-amber-50/50 border-2 border-amber-200',
        cta: [
          { label: 'Ver memória', onClick: () => onOpenMoment?.(celebrationMoment), variant: 'primary' },
          { label: 'Escrever reflexão', onClick: () => onNavigateToChapters?.(), variant: 'ghost' },
        ],
      });
    }

    return list.slice(0, 3);
  }, [
    celebrationMoment,
    currentBaby,
    upcomingMilestones,
    daysSinceLastMoment,
    daysUntilMonthiversary,
    nextMonthiversaryDate,
    onNavigateToChapters,
    onOpenMoment,
    onOpenTemplate,
    calculateAge,
  ]);

  const timelineItems = useMemo(() => {
    return moments.slice(0, 5).map(moment => ({
      id: moment.id,
      title: moment.title,
      subtitle: moment.age,
      date: new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }).format(new Date(moment.date)),
      moment,
    }));
  }, [moments]);

  return (
    <div className="pb-32 px-4 pt-6 max-w-3xl mx-auto space-y-10">
      <motion.button
        onClick={() => setShowBabySelector(true)}
        className="flex items-center gap-4 w-full text-left hover:opacity-90 transition-opacity"
        whileTap={{ scale: 0.98 }}
      >
        <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
          <AvatarImage src={currentBaby?.avatar} alt={currentBaby?.name ?? 'Bebê atual'} />
          <AvatarFallback className="bg-primary/10 text-primary text-3xl">
            {getInitials(currentBaby?.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="text-sm uppercase tracking-wide text-zinc-400">bebê do dia</p>
          <h1 className="text-3xl font-semibold text-zinc-900 dark:text-white">{currentBaby?.name ?? 'Bebê atual'}</h1>
          <p className="text-zinc-600 dark:text-zinc-300">{ageLabel}</p>
        </div>
        <ChevronRight className="w-6 h-6 text-zinc-400" aria-hidden />
      </motion.button>

      <section
        className={`relative rounded-3xl p-6 min-h-[40vh] bg-gradient-to-br ${heroGradient} overflow-hidden`}
        aria-label="Resumo contextual do dia"
      >
        <div className="absolute inset-0 bg-white/40 mix-blend-overlay" aria-hidden />
        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-zinc-500">{city}</p>
              <p className="text-5xl font-light text-zinc-900 dark:text-zinc-900">
                {timePeriod === 'night' ? 'Boa noite' : timePeriod === 'afternoon' ? 'Boa tarde' : 'Bom dia'}
              </p>
              <p className="text-zinc-600 max-w-lg leading-relaxed mt-3">{narrative}</p>
            </div>
            <div className="hidden md:block rounded-2xl overflow-hidden shadow-lg">
              {lastMoment ? (
                <img
                  src={lastMoment.media[0]}
                  alt={lastMoment.title}
                  className="w-40 h-40 object-cover"
                />
              ) : (
                <div className="w-40 h-40 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                  <Camera className="w-10 h-10 text-zinc-400" aria-hidden />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-3 bg-white/70 backdrop-blur-md rounded-2xl p-3">
              <Sun className="w-5 h-5 text-amber-500" aria-hidden />
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-400">Agora</p>
                <p className="text-sm text-zinc-700">{new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(now)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/70 backdrop-blur-md rounded-2xl p-3">
              <MoonStar className="w-5 h-5 text-indigo-500" aria-hidden />
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-400">Fase da lua</p>
                <p className="text-sm text-zinc-700">Lua Crescente</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/70 backdrop-blur-md rounded-2xl p-3">
              <Flower2 className="w-5 h-5 text-violet-500" aria-hidden />
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-400">Última memória</p>
                <p className="text-sm text-zinc-700">
                  {lastMoment ? formatDateTime(lastMoment.date) : 'Registre um momento'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="suggestions-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <p id="suggestions-heading" className="text-sm uppercase tracking-wide text-zinc-400">
            Para você
          </p>
          <span className="text-xs text-zinc-400">Sugestões suaves, no seu ritmo</span>
        </div>
        <div className="-mx-4 px-4">
          <div className="flex gap-4 overflow-x-auto snap-x pb-1">
            {suggestions.map(card => (
              <motion.div
                key={card.id}
                className={`snap-start min-w-[260px] rounded-3xl p-6 border ${card.style} shadow-sm flex flex-col justify-between`}
                whileHover={{ translateY: -4 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              >
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-2xl bg-white/70 shadow-sm">{card.icon}</div>
                  <div>
                    <p className="font-medium text-zinc-900">{card.title}</p>
                    {card.description && (
                      <p className="text-sm text-zinc-600 mt-1">{card.description}</p>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {card.cta.map(action => (
                    <button
                      key={action.label}
                      onClick={action.onClick}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors min-w-[44px] min-h-[40px] ${
                        action.variant === 'primary'
                          ? 'bg-zinc-900 text-white hover:bg-zinc-800'
                          : 'bg-white/80 text-zinc-600 hover:bg-white'
                      }`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            ))}
            {suggestions.length === 0 && (
              <div className="text-zinc-500 text-sm">Tudo em dia! Voltamos com novas sugestões em breve.</div>
            )}
          </div>
        </div>
      </section>

      <section aria-labelledby="panorama-heading" className="space-y-4">
        <p id="panorama-heading" className="text-sm uppercase tracking-wide text-zinc-400">
          Panorama
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onNavigateToGrowth}
            className="bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-sm border border-zinc-200/70 dark:border-zinc-800 text-left flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-400">Crescimento</p>
                <p className="text-lg text-zinc-900 dark:text-white">
                  {latestGrowth
                    ? `${latestGrowth.weight} kg · ${latestGrowth.height} cm`
                    : 'Sem medições'}
                </p>
                <p className="text-sm text-emerald-600">+{weightChange} kg este mês</p>
              </div>
              <Baby className="w-6 h-6 text-violet-500" aria-hidden />
            </div>
            <Sparkline data={growthTrend} stroke="#7C3AED" fill="#7C3AED" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onNavigateToSleepHumor}
            className="bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-sm border border-zinc-200/70 dark:border-zinc-800 text-left flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-400">Sono</p>
                <p className="text-lg text-zinc-900 dark:text-white">{averageSleep}h por noite</p>
                <p className="text-sm text-zinc-500">Média dos últimos registros</p>
              </div>
              <MoonStar className="w-6 h-6 text-indigo-500" aria-hidden />
            </div>
            <Sparkline data={sleepTrend} stroke="#6366F1" fill="#6366F1" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onNavigateToVaccines}
            className="bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-sm border border-zinc-200/70 dark:border-zinc-800 text-left flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-400">Vacinas</p>
                <p className="text-lg text-zinc-900 dark:text-white">
                  {completedVaccines} de {totalVaccines}
                </p>
                <p className="text-sm text-zinc-500">
                  {pendingVaccines === 0
                    ? 'Tudo em dia!'
                    : `${pendingVaccines} ${pendingVaccines === 1 ? 'pendente' : 'pendentes'}`}
                </p>
              </div>
              <CalendarDays className="w-6 h-6 text-fuchsia-500" aria-hidden />
            </div>
          </motion.button>

          <motion.div
            className="bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-sm border border-zinc-200/70 dark:border-zinc-800 flex flex-col gap-4 col-span-1 sm:col-span-2"
            whileHover={{ translateY: -2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-400">Família</p>
                <p className="text-lg text-zinc-900 dark:text-white">{familyMembers.length} pessoas conectadas</p>
                <p className="text-sm text-zinc-500">Árvore viva de afetos</p>
              </div>
              <button
                onClick={onNavigateToFamily}
                className="rounded-full px-4 py-2 bg-violet-100 text-violet-700 text-sm font-medium hover:bg-violet-200 transition-colors"
              >
                Ver árvore →
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {familyMembers.slice(0, 5).map(member => (
                <div
                  key={member.id}
                  className="flex items-center gap-2 bg-zinc-100/70 dark:bg-zinc-800/80 rounded-full px-3 py-1.5"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <p className="text-zinc-800 dark:text-zinc-100 font-medium leading-tight">{member.name}</p>
                    <p className="text-zinc-500 text-xs">{member.relation}</p>
                  </div>
                </div>
              ))}
              {familyMembers.length === 0 && (
                <p className="text-sm text-zinc-500">Convide familiares para acompanhar por aqui.</p>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <section aria-labelledby="recent-heading" className="space-y-4">
        <p id="recent-heading" className="text-sm uppercase tracking-wide text-zinc-400">
          Últimos dias
        </p>
        <div className="columns-2 gap-4 [column-fill:_balance]">
          {moments.slice(0, 8).map(moment => (
            <button
              key={moment.id}
              onClick={() => onOpenMoment?.(moment)}
              className="mb-4 w-full text-left break-inside-avoid rounded-2xl overflow-hidden shadow-sm border border-zinc-200/80 hover:-translate-y-1 transition-transform"
            >
              <div className="relative">
                {moment.media[0] ? (
                  <img src={moment.media[0]} alt={moment.title} className="w-full h-auto object-cover" />
                ) : (
                  <div className="w-full h-40 bg-zinc-100 flex items-center justify-center">
                    <Camera className="w-8 h-8 text-zinc-400" aria-hidden />
                  </div>
                )}
                {moment.hasVideo && (
                  <span className="absolute top-3 left-3 px-2 py-1 rounded-full bg-black/70 text-white text-xs flex items-center gap-1">
                    ▶ Vídeo
                  </span>
                )}
                {moment.tags?.includes('marco') && (
                  <span className="absolute top-3 right-3 px-2 py-1 rounded-full bg-violet-600 text-white text-xs">
                    🌙 Marco
                  </span>
                )}
              </div>
              <div className="p-3 bg-white">
                <p className="font-medium text-zinc-900">{moment.title}</p>
                <p className="text-sm text-zinc-500">
                  {formatDateTime(moment.date)} · {moment.location ?? 'Lar'} · {formatTime(moment.date)}
                </p>
              </div>
            </button>
          ))}
          {moments.length === 0 && (
            <p className="text-sm text-zinc-500">Quando você registrar novos momentos eles aparecerão aqui.</p>
          )}
        </div>
      </section>

      <section aria-labelledby="timeline-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 id="timeline-heading" className="text-lg font-semibold text-zinc-900 dark:text-white">
            História de {currentBaby?.name?.split(' ')[0] ?? 'Aurora'}
          </h2>
          <button
            onClick={onNavigateToChapters}
            className="text-sm text-violet-600 hover:text-violet-700"
          >
            Ver linha do tempo completa →
          </button>
        </div>
        <div className="relative pl-6">
          <span className="absolute left-2 top-1 bottom-1 w-0.5 bg-violet-200" aria-hidden />
          <div className="space-y-6">
            {timelineItems.map((item, index) => (
              <div key={item.id} className="relative">
                <span
                  className={`absolute -left-[14px] mt-1 w-3 h-3 rounded-full border-2 ${
                    index === 0 ? 'bg-violet-500 border-violet-500' : 'border-violet-300 bg-white'
                  }`}
                  aria-hidden
                />
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 p-4 shadow-sm">
                  <p className="text-sm uppercase tracking-wide text-zinc-400">{item.date}</p>
                  <p className="text-lg text-zinc-900 dark:text-white">{item.title}</p>
                  <p className="text-sm text-zinc-500">{item.subtitle}</p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => onOpenMoment?.(item.moment)}
                      className="px-3 py-1.5 text-sm rounded-full bg-violet-100 text-violet-700 hover:bg-violet-200"
                    >
                      Rever
                    </button>
                    <button
                      onClick={() => {
                        const chapter = chapters.find(chapter => chapter.id === item.moment.chapterId);
                        if (chapter) {
                          onOpenChapter?.(chapter);
                        }
                      }}
                      className="px-3 py-1.5 text-sm rounded-full bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                    >
                      Capítulo
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {showBabySelector && (
          <BabySelectorModal
            isOpen={showBabySelector}
            onClose={() => setShowBabySelector(false)}
            onBabyChange={() => undefined}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

