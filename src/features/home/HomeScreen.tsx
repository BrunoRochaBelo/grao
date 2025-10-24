import { useMemo, useState } from 'react';
import {
  Baby,
  Chapter,
  PlaceholderTemplate,
  SleepHumorEntry,
} from '../../lib/types';
import { useBabyData } from '../../lib/baby-data-context';
import {
  ArrowUpRight,
  Baby as BabyIcon,
  BookOpen,
  Calendar,
  Camera,
  ChevronRight,
  FileDown,
  MapPin,
  Moon,
  Sparkles,
  Syringe,
  TrendingUp,
  Users,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { BabySelectorModal } from '../baby/BabySelectorModal';
import { Progress } from '../../components/ui/progress';

interface HomeScreenProps {
  onNavigateToGrowth?: () => void;
  onNavigateToVaccines?: () => void;
  onNavigateToSleepHumor?: () => void;
  onNavigateToFamily?: () => void;
  onNavigateToChapters?: () => void;
  onOpenTemplate?: (chapterId: string, templateId: string) => void;
  onOpenChapter?: (chapter: Chapter) => void;
}

interface StatWidgetProps {
  title: string;
  icon: React.ReactNode;
  accent: string;
  highlight: string;
  description?: string;
  onClick?: () => void;
}

interface InsightChipProps {
  icon: React.ReactNode;
  label: string;
}

const cityAtmospheres: Record<string, string[]> = {
  'são paulo': [
    'amanheceu com uma brisa suave',
    'está com céu aberto convidando um passeio curto',
    'tem garoa leve — ótimo para um abraço quentinho',
  ],
  recife: [
    'tem cheiro de mar e luz dourada',
    'sorri com um vento morno de tarde',
    'está ensolarada e fresca como um início de história',
  ],
  'rio de janeiro': [
    'traz o brilho do mar na janela',
    'está dourado por um sol gentil',
    'acorda com brisa salgada e música ao fundo',
  ],
};

const fallbackAtmosphere = [
  'pede fotos na luz suave do dia',
  'combina com histórias contadas baixinho',
  'está sereno — perfeito para cochilos longos',
];

function getAtmosphereForCity(city?: string, seed = 0): string {
  if (!city) return fallbackAtmosphere[seed % fallbackAtmosphere.length];
  const cityKey = city.split(',')[0]?.trim().toLowerCase() ?? '';
  const options = cityAtmospheres[cityKey];
  if (!options) {
    return fallbackAtmosphere[seed % fallbackAtmosphere.length];
  }
  return options[seed % options.length];
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map(segment => segment[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function StatWidget({ title, icon, accent, highlight, description, onClick }: StatWidgetProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="relative overflow-hidden rounded-2xl border border-border bg-card p-4 text-left shadow-soft"
      style={{ boxShadow: `0 12px 24px -18px ${accent}` }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background: `linear-gradient(135deg, transparent 20%, ${accent}18 100%)`,
        }}
      />
      <div className="relative flex items-start justify-between gap-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${accent}22`, color: accent }}
        >
          {icon}
        </div>
        {onClick && <ArrowUpRight className="mt-0.5 h-5 w-5 text-muted-foreground" />}
      </div>
      <div className="relative mt-3 space-y-1.5">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-base text-foreground font-semibold leading-tight">{highlight}</p>
        {description && <p className="text-xs text-muted-foreground leading-tight">{description}</p>}
      </div>
    </motion.button>
  );
}

function InsightChip({ icon, label }: InsightChipProps) {
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
      {icon}
      <span>{label}</span>
    </div>
  );
}

function buildSummarySentence({
  baby,
  ageLabel,
  atmosphere,
  dateLabel,
  summaryItems,
}: {
  baby: Baby | null;
  ageLabel: string;
  atmosphere: string;
  dateLabel: string;
  summaryItems: string[];
}) {
  const firstName = baby?.name.split(' ')[0] ?? 'O bebê';
  const meaningSegment = baby?.nameMeaning
    ? `${firstName} significa “${baby.nameMeaning}”.`
    : `${firstName} está crescendo bonito.`;
  const locationSegment = baby?.city
    ? `${dateLabel} em ${baby.city.split(',')[0]}, ${atmosphere}`
    : `${dateLabel}, ${atmosphere}`;
  const ageSegment = ageLabel ? `${ageLabel}: ${summaryItems.join(' · ')}` : summaryItems.join(' · ');
  return `${meaningSegment} ${locationSegment} — ${ageSegment}.`;
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
  const babyAgeLabel = currentBaby ? calculateAge(currentBaby.birthDate) : '';
  const babyAgeInDays = currentBaby ? getBabyAgeInDays(currentBaby.birthDate) : 0;
  const today = new Date();
  const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const previousMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);

  const placeholderMap = useMemo(() => {
    const map = new Map<string, PlaceholderTemplate>();
    chapters.forEach(chapter => {
      getPlaceholdersForChapter(chapter.id, babyAgeInDays).forEach(template => {
        map.set(template.id, template);
      });
    });
    return map;
  }, [chapters, babyAgeInDays, getPlaceholdersForChapter]);

  const momentsThisMonth = moments.filter(moment => {
    const momentDate = new Date(moment.date);
    return momentDate >= currentMonthStart && momentDate < nextMonthStart;
  });

  const momentsLastMonth = moments.filter(moment => {
    const momentDate = new Date(moment.date);
    return momentDate >= previousMonthStart && momentDate < currentMonthStart;
  });

  const milestoneMomentsThisMonth = momentsThisMonth.filter(moment => {
    if (moment.templateId) {
      const template = placeholderMap.get(moment.templateId);
      if (template?.templateType === 'primeira-vez') return true;
    }
    return moment.tags?.some(tag => tag.toLowerCase().includes('marco')) ?? false;
  });

  const familyMembers = getFamilyMembers();
  const growthMeasurements = getGrowthMeasurements();
  const latestGrowth = growthMeasurements[growthMeasurements.length - 1];
  const previousGrowth = growthMeasurements[growthMeasurements.length - 2];
  const vaccines = getVaccines();
  const sleepEntries = getSleepHumorEntries();

  const weightDelta = latestGrowth && previousGrowth
    ? (latestGrowth.weight - previousGrowth.weight).toFixed(1)
    : null;

  const completedVaccines = vaccines.filter(vaccine => vaccine.status === 'completed').length;
  const totalVaccines = vaccines.length;
  const pendingVaccines = vaccines.filter(vaccine => vaccine.status !== 'completed');
  const vaccinesPercent = totalVaccines > 0
    ? Math.round((completedVaccines / totalVaccines) * 100)
    : 0;

  const averageSleep = sleepEntries.length > 0
    ? (sleepEntries.reduce((sum, entry) => sum + entry.sleepHours, 0) / sleepEntries.length).toFixed(1)
    : null;

  const moodEmojis: Record<SleepHumorEntry['mood'], string> = {
    happy: '😊',
    calm: '🙂',
    fussy: '😕',
    crying: '😢',
    sleepy: '😴',
  };

  const lastFiveMoods = sleepEntries
    .slice(-5)
    .map(entry => moodEmojis[entry.mood])
    .join(' ');

  const topPerson = useMemo(() => {
    const counter = new Map<string, number>();
    moments.forEach(moment => {
      moment.people?.forEach(person => {
        counter.set(person, (counter.get(person) ?? 0) + 1);
      });
    });
    let maxPerson: string | null = null;
    let maxCount = 0;
    counter.forEach((count, person) => {
      if (count > maxCount) {
        maxCount = count;
        maxPerson = person;
      }
    });
    return maxPerson ? { person: maxPerson, count: maxCount } : null;
  }, [moments]);

  const chapterSummaries = useMemo(() => {
    return chapters.map(chapter => {
      const placeholders = getPlaceholdersForChapter(chapter.id, babyAgeInDays);
      const completed = placeholders.filter(placeholder =>
        moments.some(moment => moment.templateId === placeholder.id),
      ).length;
      const total = placeholders.length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { chapter, completed, total, percentage };
    });
  }, [chapters, getPlaceholdersForChapter, babyAgeInDays, moments]);

  const totals = chapterSummaries.reduce(
    (acc, item) => ({
      completed: acc.completed + item.completed,
      total: acc.total + item.total,
    }),
    { completed: 0, total: 0 },
  );

  const atmosphere = getAtmosphereForCity(currentBaby?.city, today.getDate());
  const dateLabel = today.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
  });

  const monthDiff = momentsThisMonth.length - momentsLastMonth.length;
  const summaryItems = [
    milestoneMomentsThisMonth.length > 0
      ? `${milestoneMomentsThisMonth.length} marcos este mês`
      : null,
    `Vacinas ${vaccinesPercent}% concluídas` + (pendingVaccines.length ? ` · ${pendingVaccines.length} pendentes` : ''),
    `${monthDiff >= 0 ? '+' : ''}${monthDiff} fotos vs. mês anterior`,
  ].filter(Boolean) as string[];

  const contextualSentence = buildSummarySentence({
    baby: currentBaby,
    ageLabel: babyAgeLabel,
    atmosphere,
    dateLabel,
    summaryItems,
  });

  const quickActions = [
    {
      id: 'new-moment',
      label: 'Novo momento',
      icon: <Sparkles className="h-4 w-4" />,
      action: () => onNavigateToChapters?.(),
    },
    {
      id: 'export',
      label: 'Exportar PDF',
      icon: <FileDown className="h-4 w-4" />,
      action: () => {
        if (typeof window !== 'undefined') {
          window.print();
        }
      },
    },
  ];

  const upcomingMilestones = useMemo(() => {
    const items: Array<{
      chapter: Chapter;
      template: PlaceholderTemplate;
      daysUntil: number;
    }> = [];

    chapters.forEach(chapter => {
      const placeholders = getPlaceholdersForChapter(chapter.id, babyAgeInDays)
        .filter(placeholder => {
          const hasMoment = moments.some(moment => moment.templateId === placeholder.id);
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
      .map(item => ({
        ...item,
        label:
          item.daysUntil === 0
            ? 'Pronto para registrar agora'
            : `em ${item.daysUntil} ${item.daysUntil === 1 ? 'dia' : 'dias'}`,
      }));
  }, [chapters, getPlaceholdersForChapter, babyAgeInDays, moments]);

  const storyCards: Array<{
    id: string;
    title: string;
    icon: React.ReactNode;
    body: string;
    footer?: string;
  }> = [];

  if (currentBaby?.nameMeaning) {
    storyCards.push({
      id: 'name-story',
      title: 'Origem do nome',
      icon: <BabyIcon className="h-4 w-4" />,
      body: `${currentBaby.nameOrigin ? `${currentBaby.nameOrigin} · ` : ''}"${currentBaby.nameMeaning}"`,
      footer: currentBaby.favoriteSong
        ? `Hoje a trilha é “${currentBaby.favoriteSong}”`
        : undefined,
    });
  }

  if (topPerson) {
    storyCards.push({
      id: 'family-highlight',
      title: 'Presenças queridas',
      icon: <Users className="h-4 w-4" />,
      body: `${topPerson.person} aparece em ${topPerson.count} registros recentes`,
      footer: 'Que tal convidá-lo para deixar uma dedicatória?'
    });
  }

  if (momentsThisMonth.length > 0) {
    storyCards.push({
      id: 'media-highlight',
      title: 'Galeria do mês',
      icon: <Camera className="h-4 w-4" />,
      body: `${momentsThisMonth.length} momentos registrados`,
      footer: `${monthDiff >= 0 ? '+' : ''}${monthDiff} em relação ao mês anterior`,
    });
  }

  return (
    <div className="pb-24">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="mx-auto flex max-w-2xl items-center gap-4 px-4 pb-4 pt-6">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowBabySelector(true)}
            className="flex items-center gap-4 text-left flex-1"
            aria-label="Trocar bebê"
          >
            <Avatar className="h-16 w-16 border-2 border-primary">
              <AvatarImage src={currentBaby?.avatar} alt={currentBaby?.name ?? 'Bebê'} />
              <AvatarFallback className="bg-primary/10 text-primary text-xl">
                {currentBaby ? getInitials(currentBaby.name) : '?'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{currentBaby?.city ?? 'Cidade não informada'}</span>
              </div>
              <h1 className="text-lg font-semibold text-foreground leading-tight">
                {currentBaby?.name ?? 'Bebê atual'}
              </h1>
              <p className="text-sm text-muted-foreground">{babyAgeLabel}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </motion.button>
        </div>
        <div className="mx-auto max-w-2xl px-4 pb-4">
          <p className="text-sm text-muted-foreground leading-snug">
            {contextualSentence}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 pt-6">
        <div className="flex flex-wrap gap-2">
          {summaryItems.slice(0, 3).map((item, index) => (
            <InsightChip
              key={item}
              icon={<Sparkles className="h-3 w-3" />}
              label={item}
            />
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <StatWidget
            title="Crescimento"
            icon={<TrendingUp className="h-5 w-5" />}
            accent="#4F46E5"
            highlight={
              latestGrowth
                ? `${latestGrowth.weight} kg · ${latestGrowth.height} cm`
                : 'Sem medições recentes'
            }
            description={weightDelta ? `+${weightDelta} kg desde a última consulta` : undefined}
            onClick={onNavigateToGrowth}
          />
          <StatWidget
            title="Vacinas"
            icon={<Syringe className="h-5 w-5" />}
            accent="#8B5CF6"
            highlight={`${completedVaccines}/${totalVaccines} no 1º ano`}
            description={
              pendingVaccines.length
                ? `${pendingVaccines.length} ${pendingVaccines.length === 1 ? 'pendente' : 'pendentes'}`
                : 'Todas em dia, parabéns!'
            }
            onClick={onNavigateToVaccines}
          />
          <StatWidget
            title="Sono & Humor"
            icon={<Moon className="h-5 w-5" />}
            accent="#6366F1"
            highlight={averageSleep ? `${averageSleep}h de média` : 'Registre um novo dia'}
            description={lastFiveMoods ? `Semana: ${lastFiveMoods}` : 'Adicione notas de humor'}
            onClick={onNavigateToSleepHumor}
          />
          <StatWidget
            title="Família conectada"
            icon={<Users className="h-5 w-5" />}
            accent="#22C55E"
            highlight={`${familyMembers.length} pessoas próximas`}
            description={topPerson ? `${topPerson.person} lidera aparições` : 'Convide alguém especial'}
            onClick={onNavigateToFamily}
          />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {quickActions.map(action => (
            <motion.button
              key={action.id}
              whileTap={{ scale: 0.97 }}
              onClick={action.action}
              className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-primary/20 bg-primary/5 text-sm font-medium text-primary shadow-soft"
            >
              {action.icon}
              {action.label}
            </motion.button>
          ))}
        </div>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-2xl border border-border bg-card"
        >
          <button
            onClick={() => setShowChaptersDrawer(prev => !prev)}
            className="flex w-full items-center gap-3 px-4 py-4 text-left"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-foreground">Capítulos</h2>
                <span className="text-sm text-muted-foreground">
                  {totals.completed}/{totals.total}
                </span>
              </div>
              <Progress
                value={totals.total > 0 ? (totals.completed / totals.total) * 100 : 0}
                className="mt-2 h-2"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {totals.total > 0
                  ? `${Math.round((totals.completed / totals.total) * 100)}% do álbum vivo`
                  : 'Comece registrando o primeiro capítulo'}
              </p>
            </div>
            <motion.div animate={{ rotate: showChaptersDrawer ? 180 : 0 }}>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </motion.div>
          </button>

          <AnimatePresence initial={false}>
            {showChaptersDrawer && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-border"
              >
                <div className="space-y-3 px-4 py-4">
                  {chapterSummaries.map(summary => (
                    <button
                      key={summary.chapter.id}
                      onClick={() => onOpenChapter?.(summary.chapter)}
                      className="flex w-full items-start gap-3 rounded-xl border border-border bg-muted/30 p-3 text-left transition-colors hover:bg-muted/60"
                    >
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-lg text-xl"
                        style={{ backgroundColor: `${summary.chapter.color}33` }}
                      >
                        {summary.chapter.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-sm font-medium text-foreground">
                          <span>{summary.chapter.name}</span>
                          <span className="text-muted-foreground">
                            {summary.completed}/{summary.total}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {summary.chapter.description}
                        </p>
                        <Progress value={summary.percentage} className="mt-2 h-1.5" />
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={onNavigateToChapters}
                    className="h-11 w-full rounded-xl border border-border text-sm text-muted-foreground transition-colors hover:bg-muted/50"
                  >
                    Ver todos os capítulos
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Próximos marcos</h2>
          </div>
          <div className="mt-3 space-y-2">
            {upcomingMilestones.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhum marco pendente. Explore os capítulos para desbloquear novas histórias.
              </p>
            ) : (
              upcomingMilestones.map(item => (
                <motion.button
                  key={item.template.id}
                  whileTap={{ scale: 0.99 }}
                  onClick={() =>
                    onOpenTemplate
                      ? onOpenTemplate(item.chapter.id, item.template.id)
                      : onNavigateToChapters?.()
                  }
                  className="flex w-full items-center gap-3 rounded-xl border border-border bg-card/80 px-3 py-3 text-left shadow-soft"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{item.template.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.chapter.name} · {item.label}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </motion.button>
              ))
            )}
          </div>
        </section>

        {storyCards.length > 0 && (
          <section className="mt-6">
            <h2 className="text-base font-semibold text-foreground">Histórias vivas</h2>
            <div className="mt-3 grid grid-cols-1 gap-3">
              {storyCards.map(card => (
                <div
                  key={card.id}
                  className="rounded-2xl border border-border bg-card/90 p-4 shadow-soft"
                >
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      {card.icon}
                    </span>
                    {card.title}
                  </div>
                  <p className="mt-2 text-sm text-foreground">{card.body}</p>
                  {card.footer && (
                    <p className="mt-1 text-xs text-muted-foreground">{card.footer}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <BabySelectorModal
        isOpen={showBabySelector}
        onClose={() => setShowBabySelector(false)}
        onBabyChange={() => undefined}
      />
    </div>
  );
}
