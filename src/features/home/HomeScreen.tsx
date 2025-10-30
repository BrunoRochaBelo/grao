import { useMemo, useState, useEffect, memo, useCallback, useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { useBabyData } from "@/context/baby-data-context";
import type { Chapter, Moment, PlaceholderTemplate } from "@/types";
import {
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronRight,
  Moon,
  Syringe,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BabySelectorModal } from "../baby/BabySelectorModal";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { RecentMoments } from "@/features/home/RecentMoments";
import { ContextMenu } from "@/features/moments/components/ContextMenu";

import { toast } from "sonner";

interface StatWidgetProps {
  title: string;
  icon: React.ReactNode;
  value: string;
  subtitle?: string;
  color: string;
  onClick?: () => void;
  showChart?: boolean;
  chartData?: Array<Record<string, any>>;
  chartType?: "line" | "bar";
  emojiLine?: string[];
}

function StatWidget({
  title,
  icon,
  value,
  subtitle,
  color,
  onClick,
  showChart,
  chartData,
  chartType = "line",
  emojiLine,
}: StatWidgetProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="bg-card rounded-2xl p-4 shadow-sm border border-border hover:shadow-md transition-shadow text-left relative overflow-hidden"
      style={{ backgroundColor: `${color}20` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="p-2 rounded-xl"
          style={{ backgroundColor: `${color}40` }}
        >
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
  onNavigateToConsultations?: () => void;
  onNavigateToMoments?: () => void;
  onOpenTemplate?: (chapterId: string, templateId: string) => void;
  onOpenChapter?: (chapter: Chapter) => void;
  onOpenMoment?: (moment: Moment) => void;
}

export const HomeScreen = memo(function HomeScreen({
  onNavigateToGrowth,
  onNavigateToVaccines,
  onNavigateToSleepHumor,
  onNavigateToFamily,
  onNavigateToChapters,
  onNavigateToConsultations,
  onNavigateToMoments,
  onOpenTemplate,
  onOpenChapter,
  onOpenMoment,
}: HomeScreenProps) {
  const [showBabySelector, setShowBabySelector] = useState(false);
  const [heroCompact, setHeroCompact] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    moment: Moment;
    x: number;
    y: number;
  } | null>(null);
  const longPressTimeoutRef = useRef<number | null>(null);
  const suppressClickRef = useRef(false);
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
  const ageLabel = currentBaby ? calculateAge(currentBaby.birthDate) : "";
  const babyAgeInDays = currentBaby
    ? getBabyAgeInDays(currentBaby.birthDate)
    : 0;

  const chapterSummaries = useMemo(() => {
    return chapters.map((chapter) => {
      const placeholders = getPlaceholdersForChapter(chapter.id, babyAgeInDays);
      const completed = placeholders.filter((placeholder) =>
        moments.some((moment) => moment.templateId === placeholder.id)
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
    { completed: 0, total: 0 }
  );

  const growthMeasurements = getGrowthMeasurements();
  const latestGrowth = growthMeasurements[growthMeasurements.length - 1];
  const previousGrowth = growthMeasurements[growthMeasurements.length - 2];
  const weightChange =
    latestGrowth && previousGrowth
      ? (latestGrowth.weight - previousGrowth.weight).toFixed(1)
      : "0";

  const vaccines = getVaccines();
  const completedVaccines = vaccines.filter(
    (vaccine) => vaccine.status === "completed"
  ).length;
  const totalVaccines = vaccines.length;
  const pendingVaccines = vaccines.filter(
    (vaccine) => vaccine.status === "pending"
  ).length;

  const sleepEntries = getSleepHumorEntries();
  const averageSleep =
    sleepEntries.length > 0
      ? (
          sleepEntries.reduce((sum, entry) => sum + entry.sleepHours, 0) /
          sleepEntries.length
        ).toFixed(1)
      : "0";

  const familyMembers = getFamilyMembers();

  useEffect(() => {
    if (!contextMenu) return;

    const handleDismiss = () => setContextMenu(null);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setContextMenu(null);
      }
    };

    window.addEventListener("scroll", handleDismiss, { passive: true });
    window.addEventListener("resize", handleDismiss);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", handleDismiss);
      window.removeEventListener("resize", handleDismiss);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [contextMenu]);

  const handleNavigateToGrowth = useCallback(() => {
    onNavigateToGrowth?.();
  }, [onNavigateToGrowth]);

  const handleNavigateToSleepHumor = useCallback(() => {
    onNavigateToSleepHumor?.();
  }, [onNavigateToSleepHumor]);

  const handleNavigateToConsultations = useCallback(() => {
    onNavigateToConsultations?.();
  }, [onNavigateToConsultations]);

  const handleNavigateToVaccines = useCallback(() => {
    onNavigateToVaccines?.();
  }, [onNavigateToVaccines]);

  const handleNavigateToFamily = useCallback(() => {
    onNavigateToFamily?.();
  }, [onNavigateToFamily]);

  const handleNavigateToChapters = useCallback(() => {
    onNavigateToChapters?.();
  }, [onNavigateToChapters]);

  const handleNavigateToMoments = useCallback(() => {
    onNavigateToMoments?.();
  }, [onNavigateToMoments]);

  const handleOpenTemplate = useCallback(
    (chapterId: string, templateId: string) => {
      onOpenTemplate?.(chapterId, templateId);
    },
    [onOpenTemplate]
  );

  const handleOpenChapter = useCallback(
    (chapter: Chapter) => {
      onOpenChapter?.(chapter);
    },
    [onOpenChapter]
  );

  const handleOpenMoment = useCallback(
    (moment: Moment) => {
      onOpenMoment?.(moment);
    },
    [onOpenMoment]
  );

  const handleMomentPressStart = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>, moment: Moment) => {
      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
      }
      suppressClickRef.current = false;

      const { clientX, clientY } = event;
      const x = clientX || window.innerWidth / 2;
      const y = clientY || window.innerHeight / 2;

      longPressTimeoutRef.current = window.setTimeout(() => {
        suppressClickRef.current = true;
        setContextMenu({ moment, x, y });
        try {
          navigator.vibrate?.(12);
        } catch {
          // vibration not supported
        }
      }, 450);
    },
    []
  );

  const handleMomentPressEnd = useCallback(
    (event?: ReactPointerEvent<HTMLButtonElement>) => {
      if (longPressTimeoutRef.current) {
        clearTimeout(longPressTimeoutRef.current);
        longPressTimeoutRef.current = null;
      }

      if (suppressClickRef.current) {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }
        setTimeout(() => {
          suppressClickRef.current = false;
        }, 0);
      }
    },
    []
  );

  const handleEditMoment = useCallback(
    (moment: Moment) => {
      onOpenMoment?.(moment);
      toast.info("Modo de edição chegará em breve.");
    },
    [onOpenMoment]
  );

  const handleShareMoment = useCallback((moment: Moment) => {
    const shareData = {
      title: moment.title,
      text: moment.noteShort ?? moment.noteLong ?? "",
      url: moment.media?.[0],
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share(shareData).catch(() => {
        toast.info("Compartilhamento cancelado.");
      });
    } else {
      toast.info("Compartilhe salvando a mídia e enviando para quem ama.");
    }
  }, []);

  const handleDeleteMoment = useCallback((moment: Moment) => {
    toast.warning(`Exclusão de "${moment.title}" chegará em breve.`);
  }, []);

  // Calcula participação de cada membro da família
  const familyParticipation = useMemo(() => {
    if (familyMembers.length === 0) return [];

    const memberParticipation: Record<string, number> = {};
    familyMembers.forEach((member) => {
      memberParticipation[member.id] = 0;
    });

    // Contar menções em momentos
    moments.forEach((moment) => {
      if (moment.people) {
        moment.people.forEach((personId) => {
          if (memberParticipation.hasOwnProperty(personId)) {
            memberParticipation[personId]++;
          }
        });
      }
    });

    // Calcular percentuais
    const totalMentions = Object.values(memberParticipation).reduce(
      (a, b) => a + b,
      0
    );
    return familyMembers
      .map((member) => ({
        ...member,
        mentions: memberParticipation[member.id] || 0,
        percentage:
          totalMentions > 0
            ? Math.round((memberParticipation[member.id] / totalMentions) * 100)
            : 0,
      }))
      .sort((a, b) => b.mentions - a.mentions);
  }, [familyMembers, moments]);

  const chaptersById = useMemo(() => {
    const map = new Map<string, Chapter>();
    chapters.forEach((chapter) => {
      map.set(chapter.id, chapter);
    });
    return map;
  }, [chapters]);

  const templateIconMap = useMemo(() => {
    const map = new Map<string, string>();
    chapters.forEach((chapter) => {
      const placeholders = getPlaceholdersForChapter(chapter.id, babyAgeInDays);
      placeholders.forEach((placeholder) => {
        map.set(placeholder.id, placeholder.icon ?? "");
      });
    });
    return map;
  }, [chapters, getPlaceholdersForChapter, babyAgeInDays]);

  const latestMoments = useMemo(() => moments.slice(0, 6), [moments]);

  // Gradiente dinâmico baseado no horário
  const timeGradient = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) {
      // Manhã: pêssego suave
      return "linear-gradient(135deg, #FFE5C2 0%, #FFF5E6 100%)";
    } else if (hour >= 12 && hour < 18) {
      // Tarde: azul-céu
      return "linear-gradient(135deg, #CDE7FF 0%, #EAF7FF 100%)";
    } else {
      // Noite: lilás/índigo
      return "linear-gradient(135deg, #D6CCFF 0%, #AFA2FF 100%)";
    }
  }, []);

  // Frase contextual simulada por IA
  const contextualPhrase = useMemo(() => {
    const hour = new Date().getHours();
    const smiles = sleepEntries.filter(
      (e) => e.mood === "happy" || e.mood === "calm"
    ).length;
    const recentMoments = moments.filter((m) => {
      const momentDate = new Date(m.date);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - momentDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }).length;

    const phrases = [
      `${currentBaby?.name} sorriu ${smiles} vezes hoje 😊 — e ainda nem chegou o pôr do sol.`,
      `Semana mágica com ${recentMoments} novos momentos ✨`,
      `Crescendo forte: +${weightChange}kg este mês 💪`,
      `Família crescendo junto: ${familyMembers.length} corações conectados 💖`,
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
  }, [currentBaby, sleepEntries, moments, weightChange, familyMembers]);

  // Scroll listener otimizado com gesture smoothing e snap points - Touch optimized
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout | null = null;
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let lastTime = Date.now();

    const handleScroll = () => {
      const currentTime = Date.now();
      const timeDelta = Math.max(currentTime - lastTime, 16); // Min 16ms (60fps)
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;

      // Calcular velocidade com suavização exponencial (EMA - Exponential Moving Average)
      const smoothingFactor = 0.3;
      scrollVelocity =
        scrollVelocity * (1 - smoothingFactor) +
        (scrollDelta / timeDelta) * smoothingFactor;

      lastScrollY = currentScrollY;
      lastTime = currentTime;

      if (scrollTimeout) clearTimeout(scrollTimeout);

      // Snap points otimizados para touch
      const CLOSE_THRESHOLD = 30; // Muito mais sensível para fechar
      const REOPEN_THRESHOLD = 0; // Só abre quando scroll é zero
      const VELOCITY_THRESHOLD = 0.5; // Velocidade mínima para snap inercial

      scrollTimeout = setTimeout(() => {
        let shouldCompact = heroCompact;

        // Lógica de snap com histerese - Otimizada para touch
        if (currentScrollY === 0) {
          // Se está no topo, sempre expande
          shouldCompact = false;
        } else if (heroCompact) {
          // Se já está compacto, só expande quando volta ao topo (scroll = 0)
          shouldCompact = true;
        } else {
          // Se está expandido, compacta com threshold muito sensível
          if (Math.abs(scrollVelocity) > VELOCITY_THRESHOLD) {
            // Com velocidade, usar snap inercial mais agressivo
            if (scrollVelocity > 0) {
              // Scroll para baixo - compactar rápido
              shouldCompact = currentScrollY > CLOSE_THRESHOLD;
            } else {
              // Scroll para cima - expandir (mas só se for zero)
              shouldCompact = currentScrollY > CLOSE_THRESHOLD;
            }
          } else {
            // Sem velocidade, threshold padrão bem sensível
            shouldCompact = currentScrollY > CLOSE_THRESHOLD;
          }
        }

        if (shouldCompact !== heroCompact) {
          setHeroCompact(shouldCompact);
        }
      }, 8); // Debounce agressivo (8ms)
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [heroCompact]);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((segment) => segment[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const upcomingMilestones = useMemo(() => {
    const items: Array<{
      chapter: Chapter;
      template: PlaceholderTemplate;
      daysUntil: number;
    }> = [];

    chapters.forEach((chapter) => {
      const placeholders = getPlaceholdersForChapter(chapter.id, babyAgeInDays)
        .filter((placeholder) => {
          const hasMoment = moments.some(
            (moment) => moment.templateId === placeholder.id
          );
          if (placeholder.allowMultiple) {
            return true;
          }
          return !hasMoment;
        })
        .sort((a, b) => (a.ageRangeStart ?? 0) - (b.ageRangeStart ?? 0));

      const next = placeholders[0];
      if (next) {
        const daysUntil = Math.max(
          (next.ageRangeStart ?? babyAgeInDays) - babyAgeInDays,
          0
        );
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
            ? "Disponível agora"
            : `em ${item.daysUntil} ${item.daysUntil === 1 ? "dia" : "dias"}`,
      }));
  }, [babyAgeInDays, moments]);

  return (
    <div className="pb-24 max-w-2xl mx-auto">
      {/* Hero Contextual - Sticky */}
      <motion.div
        className="sticky top-0 z-10 rounded-b-2xl overflow-hidden"
        style={{
          background: timeGradient,
          borderRadius: "0 0 28px 28px",
        }}
        animate={{
          height: heroCompact ? 80 : "auto",
          minHeight: heroCompact ? 80 : "auto",
        }}
        transition={{
          duration: 0.35,
          ease: [0.16, 1, 0.3, 1], // Custom ease curve otimizado para smoothing
          type: "tween",
        }}
      >
        <div
          className={`flex flex-col ${
            heroCompact ? "px-6 py-2" : "p-6 pb-8"
          } gap-4`}
        >
          {/* Button do avatar e info */}
          <motion.button
            animate={
              !heroCompact
                ? {
                    scale: [1, 1.02, 1],
                  }
                : { scale: 1 }
            }
            transition={{
              duration: 3,
              repeat: !heroCompact ? Infinity : 0,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            onClick={() => setShowBabySelector(true)}
            className="flex items-stretch gap-4 w-full justify-start"
          >
            {/* Avatar wrapper com espaço fixo */}
            <div className="flex-shrink-0 flex items-center">
              <motion.div
                animate={{
                  scale: heroCompact ? 1 : 1.08,
                }}
                transition={{
                  duration: 0.35,
                  ease: [0.16, 1, 0.3, 1],
                  type: "tween",
                }}
                style={{ transformOrigin: "center center" }}
              >
                <Avatar
                  className={`${
                    heroCompact ? "w-12 h-12" : "w-20 h-20"
                  } border-2 border-white/50 shadow-lg transition-all duration-400 ease-out`}
                >
                  <AvatarImage
                    src={currentBaby?.avatar}
                    alt={currentBaby?.name ?? "Bebê"}
                  />
                  <AvatarFallback className="bg-white/20 text-white text-lg">
                    {currentBaby ? getInitials(currentBaby.name) : "?"}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
            </div>

            {/* Info quando expandido */}
            {!heroCompact && (
              <motion.div
                className="flex-1 text-left flex flex-col justify-center min-w-0"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{
                  duration: 0.4,
                  delay: 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                <motion.h1
                  animate={{
                    fontSize: "28px",
                    lineHeight: "1.2",
                    scale: 1,
                    opacity: 1,
                  }}
                  transition={{
                    duration: 0.35,
                    delay: 0.05,
                    ease: [0.16, 1, 0.3, 1],
                    type: "tween",
                  }}
                  className="font-bold text-white mb-1 leading-tight"
                >
                  {currentBaby?.name ?? "Bebê atual"}
                </motion.h1>

                <motion.div
                  animate={{
                    scale: 1,
                    opacity: 1,
                  }}
                  transition={{
                    duration: 0.4,
                    delay: 0.2,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  style={{ transformOrigin: "left center" }}
                  className="space-y-0"
                >
                  <p className="text-white/80 text-base leading-tight">
                    {ageLabel}
                  </p>
                  <p className="text-white/60 text-sm leading-tight">
                    {currentBaby?.city}
                  </p>
                </motion.div>
              </motion.div>
            )}

            {/* Nome quando reduzido */}
            {heroCompact && (
              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  duration: 0.4,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="text-base font-bold text-white flex items-center"
              >
                {currentBaby?.name ?? "Bebê atual"}
              </motion.h1>
            )}
          </motion.button>

          {/* Frase contextual abaixo */}
          {!heroCompact && (
            <motion.p
              className="text-white/90 text-center text-base mt-4"
              key={contextualPhrase}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{
                duration: 0.4,
                delay: 0.25,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              {contextualPhrase}
            </motion.p>
          )}
        </div>
      </motion.div>

      {upcomingMilestones.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8 px-4 mt-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              🎯 Próximos Marcos
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNavigateToChapters}
            >
              Ver todos
            </Button>
          </div>

          <div className="space-y-3">
            {upcomingMilestones.map((item, index) => (
              <motion.button
                key={item.template.id}
                type="button"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08, duration: 0.25 }}
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  handleOpenTemplate(item.chapter.id, item.template.id)
                }
                className="w-full text-left bg-card hover:bg-muted transition-colors rounded-xl p-4 flex items-center gap-3 border border-border/60 shadow-sm"
              >
                <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 bg-primary/10 text-primary">
                  {item.template.icon || <BookOpen className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="text-foreground truncate">
                      {item.template.name}
                    </h4>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full whitespace-nowrap">
                      {item.label}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm truncate">
                    {item.chapter.name}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Jornada */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8 px-4 mt-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">
            📊 Crescendo Juntos
          </h3>
        </div>

        {/* Widgets de Status */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <StatWidget
            title="Crescimento"
            icon={<TrendingUp className="w-5 h-5 text-primary" />}
            value={
              latestGrowth
                ? `${latestGrowth.weight} kg / ${latestGrowth.height} cm`
                : "Sem medições"
            }
            subtitle={`+${weightChange} kg este mês`}
            color="#A346E5"
            onClick={handleNavigateToGrowth}
            showChart
            chartData={growthMeasurements.map((m) => ({
              age: m.age,
              weight: m.weight,
              height: m.height,
              headCircumference: m.headCircumference,
            }))}
          />
          <StatWidget
            title="Sono & Humor"
            icon={<Moon className="w-5 h-5 text-primary" />}
            value={`${averageSleep}h média`}
            subtitle="Média semanal"
            color="#7946E5"
            onClick={handleNavigateToSleepHumor}
            showChart={true}
            chartType="bar"
            chartData={sleepEntries.slice(-7).map((entry, index) => ({
              date: new Date(entry.date).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
              }),
              hours: entry.sleepHours,
            }))}
            emojiLine={sleepEntries.slice(-7).map((entry) => {
              switch (entry.mood) {
                case "happy":
                  return "😄";
                case "calm":
                  return "😌";
                case "fussy":
                  return "😟";
                case "crying":
                  return "😭";
                case "sleepy":
                  return "😴";
                default:
                  return "😐";
              }
            })}
          />
          <StatWidget
            title="Consultas"
            icon={<Calendar className="w-5 h-5 text-primary" />}
            value="2 pendentes"
            subtitle="Próxima em 5 dias"
            color="#4F46E5"
            onClick={handleNavigateToConsultations}
          />
          <StatWidget
            title="Vacinas"
            icon={<Syringe className="w-5 h-5 text-primary" />}
            value={`${completedVaccines} de ${totalVaccines} aplicadas`}
            subtitle={
              pendingVaccines > 0
                ? `${pendingVaccines} ${
                    pendingVaccines === 1 ? "pendente" : "pendentes"
                  }`
                : "Todas em dia!"
            }
            color="#467DE5"
            onClick={handleNavigateToVaccines}
          />
        </div>

        {/* Card Árvore Familiar */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleNavigateToFamily}
          className="w-full bg-gradient-to-br from-[#46B7E5] to-[#A346E5] rounded-2xl p-6 shadow-sm border border-[#46B7E5]/30 text-left relative overflow-hidden hover:shadow-md transition-shadow"
          style={{
            backgroundColor: "rgba(70, 183, 229, 0.08)",
          }}
        >
          {familyParticipation.length > 0 ? (
            // Estado com dados
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-foreground font-semibold">
                    Sua Árvore Familiar
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Veja quem está conectado e o nível de participação na
                    história de {currentBaby?.name}.
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              </div>

              {/* Pills com membros e percentuais */}
              <div className="flex flex-wrap gap-2">
                {familyParticipation.map((member) => (
                  <div
                    key={member.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-900/50 rounded-full text-xs font-medium border border-pink-200/50 dark:border-pink-800/50"
                  >
                    <span className="text-foreground">{member.name}</span>
                    <span className="text-pink-600 dark:text-pink-400 font-bold">
                      ({member.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Estado vazio - convidativo
            <div className="space-y-3 py-2">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-pink-200/50 dark:bg-pink-800/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-pink-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-foreground font-semibold mb-1">
                    Comece a Árvore Familiar
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Convide pais, avós e familiares para acompanhar a jornada de{" "}
                    {currentBaby?.name} 👨‍👩‍👧‍👦
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end pt-2">
                <span className="text-pink-600 dark:text-pink-400 text-sm font-medium">
                  Adicionar membros →
                </span>
              </div>
            </div>
          )}
        </motion.button>
      </motion.div>

      {/* Capítulos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8 px-4 mt-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">
            📚 Capítulos
          </h3>
          <Button variant="ghost" size="sm" onClick={handleNavigateToChapters}>
            Ver todos
          </Button>
        </div>
        <div className="space-y-3">
          {chapterSummaries.map((summary, index) => (
            <motion.button
              key={summary.chapter.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              onClick={() => handleOpenChapter(summary.chapter)}
              className="w-full text-left bg-card hover:bg-muted transition-colors rounded-xl p-3 flex items-start gap-3 border border-border/50 shadow-sm"
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                style={{ backgroundColor: `${summary.chapter.color}40` }}
              >
                {summary.chapter.icon}
              </div>
              <div className="flex-1 min-w-0">
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
              <ChevronRight className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Últimos Momentos */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8 px-4 mt-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">
            💝 Últimos Momentos
          </h3>
          <Button variant="ghost" size="sm" onClick={handleNavigateToMoments}>
            Ver todos
          </Button>
        </div>
        <RecentMoments
          moments={latestMoments}
          chaptersById={chaptersById}
          templateIconMap={templateIconMap}
          onOpenMoment={handleOpenMoment}
          onLongPressStart={handleMomentPressStart}
          onLongPressEnd={handleMomentPressEnd}
          onNavigateToMoments={handleNavigateToMoments}
        />
      </motion.div>

      <BabySelectorModal
        isOpen={showBabySelector}
        onClose={() => setShowBabySelector(false)}
        onBabyChange={() => undefined}
      />

      <AnimatePresence>
        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={() => setContextMenu(null)}
            actions={[
              {
                id: "edit",
                label: "Editar",
                icon: "✏️",
                onClick: () => handleEditMoment(contextMenu.moment),
              },
              {
                id: "share",
                label: "Compartilhar",
                icon: "📤",
                onClick: () => handleShareMoment(contextMenu.moment),
              },
              {
                id: "delete",
                label: "Excluir",
                icon: "🗑️",
                color: "text-red-600",
                onClick: () => handleDeleteMoment(contextMenu.moment),
              },
            ]}
          />
        )}
      </AnimatePresence>
    </div>
  );
});
