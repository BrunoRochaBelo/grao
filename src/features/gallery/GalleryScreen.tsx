import { useCallback, useMemo, useState } from 'react';
import { useBabyData } from '../../lib/baby-data-context';
import type { Chapter, Moment, PlaceholderTemplate } from '../../lib/types';
import {
  Baby,
  Calendar,
  ChevronDown,
  ChevronUp,
  Clock,
  Filter,
  FolderOpen,
  Image as ImageIcon,
  MapPin,
  Lock,
  Sparkles,
  Syringe,
  Tag,
  Users,
  Video,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from '../../components/ui/badge';
import { MediaCarousel } from '../../components/shared/MediaCarousel';
import { getHighlightStyle, HighlightTone } from '../../lib/highlights';

interface GalleryScreenProps {
  onSelectMoment?: (moment: Moment) => void;
}

interface TimelineMomentCardProps {
  moment: Moment;
  chapter: Chapter;
  onOpen: () => void;
}

interface TimelineDayGroup {
  key: string;
  date: Date;
  label: string;
  weekdayShort: string;
  relativeLabel: string;
  ageLabel?: string;
  total: number;
  mediaCount: number;
  videoCount: number;
  moments: Moment[];
}

interface TimelineMonthGroup {
  key: string;
  anchorId: string;
  monthDate: Date;
  monthLabel: string;
  monthShort: string;
  yearLabel: string;
  ageLabel?: string;
  collage: string[];
  counts: {
    moments: number;
    milestones: number;
    vaccines: number;
  };
  phrase?: string;
  days: TimelineDayGroup[];
}

interface MonthCoverProps {
  month: TimelineMonthGroup;
  onAnchor: () => void;
}

interface FilterOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  tone: HighlightTone;
}

interface FilterOptionPanelProps {
  id: string;
  title: string;
  options: Array<{
    id: string;
    label: string;
    description?: string;
    isActive: boolean;
  }>;
  onSelect: (id: string) => void;
  onClear?: () => void;
}

const periodOptions = [
  { id: 'this-month', label: 'Este mês' },
  { id: 'last-90', label: 'Últimos 90 dias' },
  { id: 'first-year', label: 'Primeiro ano' },
];

const privacyLabels: Record<Moment['privacy'], string> = {
  private: 'Privado',
  people: 'Compartilhado com família',
  link: 'Link público',
};

const templateTypeLabels: Record<string, string> = {
  'primeira-vez': 'Primeira vez',
  mesversario: 'Mêsversário',
  consulta: 'Consulta',
  vacina: 'Vacina',
  medida: 'Medidas',
  carta: 'Carta',
  nota: 'Nota',
  evento: 'Evento',
  arte: 'Arte',
  livre: 'Momentos livres',
};

function getTemplateTypeLabel(type?: string) {
  if (!type) return templateTypeLabels.livre;
  return templateTypeLabels[type] ?? type;
}

function getRelativeLabel(date: Date) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTarget = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffMs = startOfToday.getTime() - startOfTarget.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hoje';
  if (diffDays === 1) return 'Ontem';
  if (diffDays === -1) return 'Amanhã';
  if (diffDays > 1 && diffDays < 7) return `${diffDays} dias atrás`;

  if (diffDays >= 7 && diffDays < 30) {
    const weeks = Math.round(diffDays / 7);
    return `${weeks} ${weeks === 1 ? 'semana' : 'semanas'} atrás`;
  }

  if (diffDays < 0 && diffDays > -7) {
    return `Em ${Math.abs(diffDays)} dias`;
  }

  return '';
}

function buildMonthPhrase({
  babyName,
  ageLabel,
  monthLabel,
  counts,
}: {
  babyName?: string;
  ageLabel?: string;
  monthLabel: string;
  counts: { moments: number; milestones: number; vaccines: number };
}): string | undefined {
  const firstName = babyName ? babyName.split(' ')[0] : 'O bebê';
  const parts: string[] = [];

  if (counts.milestones > 0) {
    parts.push(`${counts.milestones} ${counts.milestones === 1 ? 'marco' : 'marcos'}`);
  }

  if (counts.vaccines > 0) {
    parts.push(`${counts.vaccines} ${counts.vaccines === 1 ? 'vacina' : 'vacinas'}`);
  }

  if (counts.moments > 0) {
    parts.push(`${counts.moments} ${counts.moments === 1 ? 'história' : 'histórias'}`);
  }

  const highlight = parts.join(' · ');

  if (highlight && ageLabel) {
    return `${firstName} com ${ageLabel}: ${highlight}.`;
  }

  if (highlight) {
    return `${highlight} em ${monthLabel}.`;
  }

  if (ageLabel) {
    return `${firstName} com ${ageLabel}.`;
  }

  return undefined;
}

function FilterOptionPanel({ id, title, options, onSelect, onClear }: FilterOptionPanelProps) {
  return (
    <div className="rounded-3xl border border-border/60 bg-card/95 p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {onClear && (
          <button
            onClick={() => onClear?.()}
            className="rounded-full px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
          >
            Limpar
          </button>
        )}
      </div>
      <div className="space-y-1.5">
        {options.map(option => (
          <button
            key={`${id}-${option.id}`}
            onClick={() => onSelect(option.id)}
            className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left text-sm transition-colors ${
              option.isActive ? 'border border-primary/30 bg-primary/10 text-primary' : 'border border-transparent hover:border-border/60 hover:bg-muted/70'
            }`}
          >
            <span>{option.label}</span>
            {option.description && (
              <span className="text-xs text-muted-foreground">{option.description}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function MonthCover({ month, onAnchor }: MonthCoverProps) {
  const { monthLabel, yearLabel, collage, counts, phrase, ageLabel } = month;

  return (
    <button
      onClick={onAnchor}
      className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
    >
      <div className="rounded-3xl border border-border/60 bg-card/95 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground/70">{yearLabel}</p>
            <h2 className="text-lg font-semibold capitalize text-foreground">{monthLabel}</h2>
            {ageLabel && <p className="mt-1 text-xs text-muted-foreground">Idade: {ageLabel}</p>}
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {counts.moments} {counts.moments === 1 ? 'história' : 'histórias'}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-muted/30 p-2">
          {collage.length > 0 ? (
            collage.map((src, index) => (
              <div
                key={`${src}-${index}`}
                className={`relative h-24 rounded-xl bg-cover bg-center ${collage.length === 1 ? 'col-span-2' : ''}`}
                style={{ backgroundImage: `url(${src})` }}
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/25 via-black/5 to-transparent" />
              </div>
            ))
          ) : (
            <div className="col-span-2 flex h-24 items-center justify-center rounded-xl border border-dashed border-border/60 text-xs text-muted-foreground">
              Sem mídia neste mês
            </div>
          )}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline" className="border-border/60 bg-muted/60">
            <Baby className="mr-1 h-3.5 w-3.5" />
            {counts.moments} {counts.moments === 1 ? 'história' : 'histórias'}
          </Badge>
          {counts.milestones > 0 && (
            <Badge variant="outline" className="border-border/60 bg-primary/10 text-primary">
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              {counts.milestones} {counts.milestones === 1 ? 'marco' : 'marcos'}
            </Badge>
          )}
          {counts.vaccines > 0 && (
            <Badge variant="outline" className="border-border/60 bg-muted/60">
              <Syringe className="mr-1 h-3.5 w-3.5" />
              {counts.vaccines} {counts.vaccines === 1 ? 'vacina' : 'vacinas'}
            </Badge>
          )}
        </div>
        {phrase && <p className="mt-3 text-sm text-muted-foreground/90">{phrase}</p>}
      </div>
    </button>
  );
}

function TimelineMomentCard({ moment, chapter, onOpen }: TimelineMomentCardProps) {
  const [expanded, setExpanded] = useState(false);
  const mediaItems = moment.media ?? [];
  const hasMedia = mediaItems.length > 0;
  const eventDate = new Date(moment.date);
  const timeLabel = eventDate.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border/60 bg-card/95 p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-soft"
    >
      <div className="flex flex-col gap-3">
        {hasMedia ? (
          <button
            onClick={onOpen}
            className="group relative overflow-hidden rounded-2xl"
            aria-label={`Abrir ${moment.title}`}
          >
            <MediaCarousel
              items={mediaItems}
              aspectRatioClass="aspect-[4/3]"
              roundedClass="rounded-2xl"
              onItemClick={onOpen}
              overlay={() => (
                <>
                  <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-black/30 via-black/5 to-transparent" />
                  <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2 rounded-full bg-white/75 px-3 py-1 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm dark:bg-white/10 dark:text-white">
                    <span>{chapter.icon}</span>
                    {chapter.name}
                  </div>
                  <div className="pointer-events-none absolute right-3 top-3 flex gap-1">
                    {moment.hasVideo && (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur">
                        <Video className="h-4 w-4" />
                      </div>
                    )}
                    {moment.privacy === 'private' && (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur">
                        <Lock className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/40 px-3 py-1 text-xs text-white backdrop-blur">
                    <Clock className="h-3.5 w-3.5" />
                    {timeLabel}
                  </div>
                </>
              )}
            />
          </button>
        ) : (
          <button
            onClick={onOpen}
            className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl bg-muted/70 text-muted-foreground"
          >
            <ImageIcon className="h-8 w-8" />
          </button>
        )}

        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div>
              <h3 className="text-sm font-semibold text-foreground">{moment.title}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {timeLabel}
                </span>
                <span className="flex items-center gap-1">
                  {chapter.icon}
                  {chapter.name}
                </span>
                {moment.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {moment.location}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="secondary" className="bg-primary/10 text-[11px] text-primary">
                {moment.age}
              </Badge>
              {moment.tags?.slice(0, 2).map(tag => (
                <Badge key={tag} variant="outline" className="text-[11px]">
                  #{tag}
                </Badge>
              ))}
              {moment.tags && moment.tags.length > 2 && (
                <Badge variant="outline" className="text-[11px]">
                  +{moment.tags.length - 2}
                </Badge>
              )}
            </div>
            {moment.noteShort && (
              <p className="text-sm text-foreground">{moment.noteShort}</p>
            )}
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <button
              onClick={event => {
                event.stopPropagation();
                setExpanded(prev => !prev);
              }}
              className="rounded-full p-1.5 transition-colors hover:bg-muted/60"
              aria-label={expanded ? 'Recolher detalhes' : 'Ver detalhes'}
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-2 overflow-hidden text-sm text-foreground"
            >
              {moment.noteLong && <p className="text-muted-foreground">{moment.noteLong}</p>}
              {moment.people && moment.people.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {moment.people.map(person => (
                    <Badge key={person} variant="secondary" className="text-[11px]">
                      {person}
                    </Badge>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function GalleryScreen({ onSelectMoment }: GalleryScreenProps) {
  const {
    chapters,
    getMoments,
    currentBaby,
    calculateAge,
    getBabyAgeInDays,
    getPlaceholdersForChapter,
    getVaccines,
  } = useBabyData();

  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [mediaFilter, setMediaFilter] = useState<'all' | 'photo' | 'video'>('all');
  const [privacyFilter, setPrivacyFilter] = useState<'all' | Moment['privacy']>('all');
  const [activeFilterPanel, setActiveFilterPanel] = useState<string | null>(null);

  const babyAgeInDays = currentBaby ? getBabyAgeInDays(currentBaby.birthDate) : 0;
  const moments = getMoments();

  const sortedMoments = useMemo(() => {
    return [...moments].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [moments]);

  const chapterMap = useMemo(() => {
    return new Map(chapters.map(chapter => [chapter.id, chapter] as const));
  }, [chapters]);

  const placeholderMap = useMemo(() => {
    const map = new Map<string, PlaceholderTemplate>();
    chapters.forEach(chapter => {
      getPlaceholdersForChapter(chapter.id, babyAgeInDays).forEach(template => {
        map.set(template.id, template);
      });
    });
    return map;
  }, [chapters, getPlaceholdersForChapter, babyAgeInDays]);

  const typeOptions = useMemo(() => {
    const counts = new Map<string, number>();
    sortedMoments.forEach(moment => {
      const templateType = moment.templateId
        ? placeholderMap.get(moment.templateId)?.templateType ?? 'livre'
        : 'livre';
      counts.set(templateType, (counts.get(templateType) ?? 0) + 1);
    });
    return Array.from(counts.entries()).map(([type, count]) => ({
      id: type,
      label: `${getTemplateTypeLabel(type)} (${count})`,
    }));
  }, [placeholderMap, sortedMoments]);

  const peopleOptions = useMemo(() => {
    const counts = new Map<string, number>();
    sortedMoments.forEach(moment => {
      moment.people?.forEach(person => {
        counts.set(person, (counts.get(person) ?? 0) + 1);
      });
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([person, count]) => ({ id: person, label: `${person} (${count})` }));
  }, [sortedMoments]);

  const tagOptions = useMemo(() => {
    const counts = new Map<string, number>();
    sortedMoments.forEach(moment => {
      moment.tags?.forEach(tag => {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      });
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([tag, count]) => ({ id: tag, label: `#${tag} (${count})` }));
  }, [sortedMoments]);

  const availableFilters: FilterOption[] = [
    {
      id: 'chapter',
      label: selectedChapter
        ? `Capítulo: ${chapterMap.get(selectedChapter)?.name ?? 'Todos'}`
        : 'Capítulo',
      icon: <FolderOpen className="h-4 w-4" />,
      active: !!selectedChapter,
      tone: 'lavender',
    },
    {
      id: 'type',
      label: selectedType ? getTemplateTypeLabel(selectedType) : 'Tipo',
      icon: <Filter className="h-4 w-4" />,
      active: !!selectedType,
      tone: 'babyBlue',
    },
    {
      id: 'period',
      label: selectedPeriod ? periodOptions.find(option => option.id === selectedPeriod)?.label ?? 'Período' : 'Período',
      icon: <Calendar className="h-4 w-4" />,
      active: !!selectedPeriod,
      tone: 'mint',
    },
    {
      id: 'people',
      label: selectedPerson ? `Com ${selectedPerson}` : 'Pessoas',
      icon: <Users className="h-4 w-4" />,
      active: !!selectedPerson,
      tone: 'mint',
    },
    {
      id: 'tags',
      label: selectedTag ? `#${selectedTag}` : 'Tags',
      icon: <Tag className="h-4 w-4" />,
      active: !!selectedTag,
      tone: 'babyBlue',
    },
    {
      id: 'media',
      label:
        mediaFilter === 'all'
          ? 'Mídia'
          : mediaFilter === 'photo'
          ? 'Fotos'
          : 'Vídeos',
      icon: <ImageIcon className="h-4 w-4" />,
      active: mediaFilter !== 'all',
      tone: 'mint',
    },
    {
      id: 'privacy',
      label: privacyFilter === 'all' ? 'Privacidade' : privacyLabels[privacyFilter],
      icon: <Lock className="h-4 w-4" />,
      active: privacyFilter !== 'all',
      tone: 'lavender',
    },
  ];

  const toggleFilterPanel = (filterId: string) => {
    setActiveFilterPanel(prev => (prev === filterId ? null : filterId));
  };

  const clearAllFilters = () => {
    setSelectedChapter(null);
    setSelectedType(null);
    setSelectedPeriod(null);
    setSelectedPerson(null);
    setSelectedTag(null);
    setMediaFilter('all');
    setPrivacyFilter('all');
    setActiveFilterPanel(null);
  };

  const filteredMoments = sortedMoments.filter(moment => {
    if (selectedChapter && moment.chapterId !== selectedChapter) return false;
    if (selectedType) {
      const templateType = moment.templateId
        ? placeholderMap.get(moment.templateId)?.templateType ?? 'livre'
        : 'livre';
      if (templateType !== selectedType) return false;
    }
    if (selectedPerson && !(moment.people ?? []).includes(selectedPerson)) return false;
    if (selectedTag && !(moment.tags ?? []).includes(selectedTag)) return false;
    if (mediaFilter === 'photo' && moment.hasVideo) return false;
    if (mediaFilter === 'video' && !moment.hasVideo) return false;
    if (privacyFilter !== 'all' && moment.privacy !== privacyFilter) return false;
    if (selectedPeriod) {
      const momentDate = new Date(moment.date);
      const now = new Date();
      if (selectedPeriod === 'this-month') {
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        if (!(momentDate >= start && momentDate < end)) return false;
      } else if (selectedPeriod === 'last-90') {
        const start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        if (momentDate < start) return false;
      } else if (selectedPeriod === 'first-year') {
        if (currentBaby) {
          const firstYearEnd = new Date(currentBaby.birthDate);
          firstYearEnd.setFullYear(firstYearEnd.getFullYear() + 1);
          if (momentDate >= firstYearEnd) return false;
        }
      }
    }
    return true;
  });

  const vaccines = getVaccines();

  const vaccinesByMonth = useMemo(() => {
    const map = new Map<string, number>();
    vaccines.forEach(vaccine => {
      if (!vaccine.date) return;
      const date = new Date(vaccine.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return map;
  }, [vaccines]);

  const timelineMonths = useMemo(() => {
    const monthMap = new Map<
      string,
      {
        monthDate: Date;
        moments: Moment[];
      }
    >();

    filteredMoments.forEach(moment => {
      const date = new Date(moment.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthMap.has(key)) {
        monthMap.set(key, { monthDate: new Date(date.getFullYear(), date.getMonth(), 1), moments: [] });
      }
      monthMap.get(key)!.moments.push(moment);
    });

    return Array.from(monthMap.entries())
      .map(([key, group]) => {
        const sortedMomentsForMonth = [...group.moments].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );

        const dayMap = new Map<string, Moment[]>();
        sortedMomentsForMonth.forEach(moment => {
          const date = new Date(moment.date);
          const dayKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
            date.getDate(),
          ).padStart(2, '0')}`;
          if (!dayMap.has(dayKey)) {
            dayMap.set(dayKey, []);
          }
          dayMap.get(dayKey)!.push(moment);
        });

        const days: TimelineDayGroup[] = Array.from(dayMap.entries())
          .map(([dayKey, dayMoments]) => {
            const [year, month, day] = dayKey.split('-').map(Number);
            const dayDate = new Date(year, month - 1, day);
            const sortedDayMoments = [...dayMoments].sort(
              (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
            );
            const mediaCount = sortedDayMoments.reduce((acc, moment) => {
              const count = moment.media?.length ?? 0;
              return acc + (count > 0 ? count : 1);
            }, 0);
            const videoCount = sortedDayMoments.filter(moment => moment.hasVideo).length;
            const label = dayDate.toLocaleDateString('pt-BR', {
              weekday: 'long',
              day: '2-digit',
              month: 'long',
            });
            const weekdayShort = dayDate.toLocaleDateString('pt-BR', { weekday: 'short' });
            const relativeLabel = getRelativeLabel(dayDate);
            const ageLabel = currentBaby
              ? calculateAge(currentBaby.birthDate, sortedDayMoments[sortedDayMoments.length - 1].date)
              : undefined;

            return {
              key: dayKey,
              date: dayDate,
              label,
              weekdayShort,
              relativeLabel,
              ageLabel,
              total: sortedDayMoments.length,
              mediaCount,
              videoCount,
              moments: sortedDayMoments,
            } as TimelineDayGroup;
          })
          .sort((a, b) => b.date.getTime() - a.date.getTime());

        const collageSources: string[] = [];
        sortedMomentsForMonth.forEach(moment => {
          moment.media?.forEach(src => {
            if (src && collageSources.length < 4 && !collageSources.includes(src)) {
              collageSources.push(src);
            }
          });
        });

        const milestoneCount = sortedMomentsForMonth.reduce((count, moment) => {
          const templateType = moment.templateId
            ? placeholderMap.get(moment.templateId)?.templateType
            : undefined;
          const hasMilestoneTag = (moment.tags ?? []).some(tag => tag.toLowerCase().includes('marco'));
          return count + (templateType === 'primeira-vez' || templateType === 'mesversario' || hasMilestoneTag ? 1 : 0);
        }, 0);

        const vaccinesCount = vaccinesByMonth.get(key) ?? 0;

        const monthLabel = group.monthDate.toLocaleDateString('pt-BR', { month: 'long' });
        const monthShort = group.monthDate
          .toLocaleDateString('pt-BR', { month: 'short' })
          .replace('.', '')
          .toUpperCase();
        const yearLabel = String(group.monthDate.getFullYear());
        const monthEnd = new Date(group.monthDate.getFullYear(), group.monthDate.getMonth() + 1, 0);
        const ageLabel = currentBaby
          ? calculateAge(currentBaby.birthDate, monthEnd.toISOString())
          : undefined;

        const counts = {
          moments: sortedMomentsForMonth.length,
          milestones: milestoneCount,
          vaccines: vaccinesCount,
        };

        const phrase = buildMonthPhrase({
          babyName: currentBaby?.name,
          ageLabel,
          monthLabel,
          counts,
        });

        return {
          key,
          anchorId: `mes-${key}`,
          monthDate: group.monthDate,
          monthLabel,
          monthShort,
          yearLabel,
          ageLabel,
          collage: collageSources,
          counts,
          phrase,
          days,
        } as TimelineMonthGroup;
      })
      .sort((a, b) => b.monthDate.getTime() - a.monthDate.getTime());
  }, [filteredMoments, placeholderMap, currentBaby, calculateAge, vaccinesByMonth]);

  const totalPhotos = filteredMoments.reduce((count, moment) => {
    if (moment.hasVideo) return count;
    const mediaCount = moment.media?.length ?? 0;
    return count + (mediaCount > 0 ? mediaCount : 1);
  }, 0);

  const totalVideos = filteredMoments.filter(moment => moment.hasVideo).length;

  const hasActiveFilters =
    !!selectedChapter ||
    !!selectedType ||
    !!selectedPeriod ||
    !!selectedPerson ||
    !!selectedTag ||
    mediaFilter !== 'all' ||
    privacyFilter !== 'all';

  const summaryLine = `${filteredMoments.length} ${filteredMoments.length === 1 ? 'momento' : 'momentos'} · ${totalPhotos} ${
    totalPhotos === 1 ? 'foto' : 'fotos'
  }${totalVideos ? ` · ${totalVideos} ${totalVideos === 1 ? 'vídeo' : 'vídeos'}` : ''}`;

  const scrollToMonth = useCallback((anchorId: string) => {
    const element = document.getElementById(anchorId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return (
    <div className="pb-24">
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-3xl px-5 pb-4 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-foreground">Galeria</h1>
              <p className="text-sm text-muted-foreground">{summaryLine}</p>
            </div>
            {currentBaby && (
              <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                <Baby className="h-4 w-4" />
                <span>{currentBaby.name}</span>
              </div>
            )}
          </div>
        </div>
        <div className="mx-auto max-w-3xl px-5 pb-4">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {availableFilters.map(filter => {
              const style = filter.active ? getHighlightStyle(filter.tone) : undefined;
              return (
                <button
                  key={filter.id}
                  onClick={() => toggleFilterPanel(filter.id)}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    filter.active
                      ? 'border border-transparent shadow-sm'
                      : 'border border-border/60 bg-card/80 text-muted-foreground hover:border-primary/20 hover:text-foreground'
                  }`}
                  style={style}
                >
                  <span className={filter.active ? 'text-inherit' : 'text-muted-foreground'}>{filter.icon}</span>
                  {filter.label}
                </button>
              );
            })}
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1 whitespace-nowrap rounded-full border border-border/60 bg-card/80 px-4 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/20 hover:text-foreground"
            >
              <Filter className="h-3.5 w-3.5" />
              Limpar
            </button>
          </div>
        </div>
        <AnimatePresence initial={false}>
          {activeFilterPanel && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mx-auto max-w-3xl px-5 pb-4"
            >
              {activeFilterPanel === 'chapter' && (
                <FilterOptionPanel
                  id="chapter"
                  title="Capítulos"
                  options={chapters.map(chapter => ({
                    id: chapter.id,
                    label: chapter.name,
                    description: `${chapter.completed}/${chapter.total} momentos`,
                    isActive: selectedChapter === chapter.id,
                  }))}
                  onSelect={chapterId => {
                    setSelectedChapter(prev => (prev === chapterId ? null : chapterId));
                    setActiveFilterPanel(null);
                  }}
                  onClear={() => setSelectedChapter(null)}
                />
              )}
              {activeFilterPanel === 'type' && (
                <FilterOptionPanel
                  id="type"
                  title="Tipo de registro"
                  options={typeOptions.map(option => ({
                    id: option.id,
                    label: option.label,
                    isActive: selectedType === option.id,
                  }))}
                  onSelect={typeId => {
                    setSelectedType(prev => (prev === typeId ? null : typeId));
                    setActiveFilterPanel(null);
                  }}
                  onClear={() => setSelectedType(null)}
                />
              )}
              {activeFilterPanel === 'period' && (
                <FilterOptionPanel
                  id="period"
                  title="Período"
                  options={periodOptions.map(option => ({
                    id: option.id,
                    label: option.label,
                    isActive: selectedPeriod === option.id,
                  }))}
                  onSelect={periodId => {
                    setSelectedPeriod(prev => (prev === periodId ? null : periodId));
                    setActiveFilterPanel(null);
                  }}
                  onClear={() => setSelectedPeriod(null)}
                />
              )}
              {activeFilterPanel === 'people' && (
                <FilterOptionPanel
                  id="people"
                  title="Pessoas queridas"
                  options={peopleOptions.map(option => ({
                    id: option.id,
                    label: option.label,
                    isActive: selectedPerson === option.id,
                  }))}
                  onSelect={personId => {
                    setSelectedPerson(prev => (prev === personId ? null : personId));
                    setActiveFilterPanel(null);
                  }}
                  onClear={() => setSelectedPerson(null)}
                />
              )}
              {activeFilterPanel === 'tags' && (
                <FilterOptionPanel
                  id="tags"
                  title="Tags"
                  options={tagOptions.map(option => ({
                    id: option.id,
                    label: option.label,
                    isActive: selectedTag === option.id,
                  }))}
                  onSelect={tagId => {
                    setSelectedTag(prev => (prev === tagId ? null : tagId));
                    setActiveFilterPanel(null);
                  }}
                  onClear={() => setSelectedTag(null)}
                />
              )}
              {activeFilterPanel === 'media' && (
                <FilterOptionPanel
                  id="media"
                  title="Tipo de mídia"
                  options={[
                    { id: 'all', label: 'Fotos e vídeos', isActive: mediaFilter === 'all' },
                    { id: 'photo', label: 'Só fotos', isActive: mediaFilter === 'photo' },
                    { id: 'video', label: 'Só vídeos', isActive: mediaFilter === 'video' },
                  ]}
                  onSelect={filterId => {
                    setMediaFilter(prev => (prev === filterId ? 'all' : (filterId as typeof mediaFilter)));
                    setActiveFilterPanel(null);
                  }}
                  onClear={() => setMediaFilter('all')}
                />
              )}
              {activeFilterPanel === 'privacy' && (
                <FilterOptionPanel
                  id="privacy"
                  title="Privacidade"
                  options={[
                    { id: 'all', label: 'Todos', isActive: privacyFilter === 'all' },
                    { id: 'private', label: 'Privados', isActive: privacyFilter === 'private' },
                    { id: 'people', label: 'Compartilhados', isActive: privacyFilter === 'people' },
                    { id: 'link', label: 'Com link', isActive: privacyFilter === 'link' },
                  ]}
                  onSelect={filterId => {
                    setPrivacyFilter(prev =>
                      prev === filterId
                        ? 'all'
                        : (filterId as typeof privacyFilter),
                    );
                    setActiveFilterPanel(null);
                  }}
                  onClear={() => setPrivacyFilter('all')}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mx-auto max-w-3xl px-5 pt-4">
        {timelineMonths.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <ImageIcon className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold text-foreground">Nenhum momento encontrado</h3>
            <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">
              {hasActiveFilters
                ? 'Tente ajustar os filtros para reencontrar suas memórias.'
                : 'Comece registrando seus capítulos favoritos.'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="mt-4 text-sm text-primary hover:underline"
              >
                Limpar filtros
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex gap-2 overflow-x-auto pb-3">
              {timelineMonths.map(month => (
                <button
                  key={month.key}
                  onClick={() => scrollToMonth(month.anchorId)}
                  className="rounded-full border border-border/60 bg-card/80 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
                >
                  {month.monthShort} · {month.yearLabel}
                </button>
              ))}
            </div>
            <div className="space-y-12">
              {timelineMonths.map(month => (
                <section key={month.key} id={month.anchorId} className="relative scroll-mt-28">
                  <div className="flex items-start gap-3">
                    <div className="hidden h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background text-xs font-semibold uppercase text-muted-foreground sm:flex">
                      {month.monthShort}
                    </div>
                    <MonthCover month={month} onAnchor={() => scrollToMonth(month.anchorId)} />
                  </div>
                  <div className="relative mt-6 pl-4 sm:pl-12">
                    <div className="pointer-events-none absolute left-1 top-0 bottom-0 w-px bg-border/50 sm:left-4" />
                    <div className="space-y-10">
                      {month.days.map(day => (
                        <article key={day.key} className="relative pl-6 sm:pl-10">
                          <div className="absolute -left-3 top-2 flex h-6 w-6 items-center justify-center rounded-full border border-primary/30 bg-background text-[11px] font-semibold text-primary">
                            {String(day.date.getDate()).padStart(2, '0')}
                          </div>
                          <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                            <div className="sm:w-48">
                              <div className="rounded-2xl border border-border/60 bg-muted/40 px-3 py-3 text-center sm:text-left">
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/80">
                                  {day.weekdayShort}
                                </p>
                                <p className="text-sm font-medium capitalize text-foreground">{day.label}</p>
                                {day.ageLabel && <p className="mt-1 text-xs text-muted-foreground">{day.ageLabel}</p>}
                                {day.relativeLabel && (
                                  <p className="mt-1 text-[11px] text-muted-foreground">{day.relativeLabel}</p>
                                )}
                                <div className="mt-2 flex flex-wrap justify-center gap-2 text-[11px] text-muted-foreground sm:justify-start">
                                  <Badge variant="outline" className="border-border/60 bg-muted/60">
                                    {day.mediaCount} {day.mediaCount === 1 ? 'mídia' : 'mídias'}
                                  </Badge>
                                  {day.videoCount > 0 && (
                                    <Badge variant="outline" className="border-border/60 bg-muted/60">
                                      {day.videoCount} {day.videoCount === 1 ? 'vídeo' : 'vídeos'}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex-1 space-y-3">
                              {day.moments.map(moment => {
                                const chapter = chapterMap.get(moment.chapterId);
                                if (!chapter) return null;
                                return (
                                  <TimelineMomentCard
                                    key={moment.id}
                                    moment={moment}
                                    chapter={chapter}
                                    onOpen={() => onSelectMoment?.(moment)}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                </section>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
