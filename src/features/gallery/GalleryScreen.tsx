import { useMemo, useState } from 'react';
import { useBabyData } from '../../lib/baby-data-context';
import type { Chapter, Moment, PlaceholderTemplate } from '../../lib/types';
import {
  Baby,
  Calendar,
  ChevronDown,
  ChevronUp,
  Filter,
  FolderOpen,
  Image as ImageIcon,
  Lock,
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

interface PhotoCardProps {
  moment: Moment;
  chapter: Chapter;
  onClick: () => void;
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

function FilterOptionPanel({ id, title, options, onSelect, onClear }: FilterOptionPanelProps) {
  return (
    <div className="rounded-2xl border border-border bg-card/95 p-3 shadow-soft">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {onClear && (
          <button
            onClick={() => onClear?.()}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Limpar
          </button>
        )}
      </div>
      <div className="space-y-1">
        {options.map(option => (
          <button
            key={`${id}-${option.id}`}
            onClick={() => onSelect(option.id)}
            className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors ${
              option.isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
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

function PhotoCard({ moment, chapter, onClick }: PhotoCardProps) {
  const [expanded, setExpanded] = useState(false);
  const mediaItems = moment.media ?? [];
  const hasMedia = mediaItems.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
    >
      {hasMedia ? (
        <div className="relative" onClick={onClick}>
          <MediaCarousel
            items={mediaItems}
            aspectRatioClass="aspect-[4/3]"
            roundedClass="rounded-2xl"
            onItemClick={onClick}
            overlay={() => (
              <>
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                <div
                  className="pointer-events-none absolute left-2 top-2 rounded-lg px-2 py-1 text-xs text-white backdrop-blur"
                  style={{ backgroundColor: chapter.color + 'E6' }}
                >
                  {chapter.icon} {chapter.name}
                </div>
                <div className="pointer-events-none absolute right-2 top-2 flex gap-1">
                  {moment.hasVideo && (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black/50 backdrop-blur">
                      <Video className="h-4 w-4 text-white" />
                    </div>
                  )}
                  {moment.privacy === 'private' && (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black/50 backdrop-blur">
                      <Lock className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              </>
            )}
          />
        </div>
      ) : (
        <button
          onClick={onClick}
          className="flex aspect-[4/3] w-full items-center justify-center bg-muted"
        >
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
        </button>
      )}

      <div className="space-y-3 p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground">{moment.title}</h3>
            <p className="text-xs text-muted-foreground">
              {moment.age} · {new Date(moment.date).toLocaleDateString('pt-BR')}
            </p>
          </div>
          <button
            onClick={event => {
              event.stopPropagation();
              setExpanded(prev => !prev);
            }}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
            aria-label={expanded ? 'Recolher' : 'Expandir'}
          >
            {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>
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
              {moment.location && (
                <p className="text-xs text-muted-foreground">{moment.location}</p>
              )}
              {moment.noteShort && <p>{moment.noteShort}</p>}
              {moment.noteLong && <p className="text-muted-foreground">{moment.noteLong}</p>}
              {moment.people && moment.people.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {moment.people.map(person => (
                    <Badge key={person} variant="secondary" className="text-[11px]">
                      {person}
                    </Badge>
                  ))}
                </div>
              )}
              {moment.tags && moment.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {moment.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-[11px]">
                      #{tag}
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

  const groupedMoments = useMemo(() => {
    return filteredMoments.reduce((acc, moment) => {
      const date = new Date(moment.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(moment);
      return acc;
    }, {} as Record<string, Moment[]>);
  }, [filteredMoments]);

  const monthKeys = Object.keys(groupedMoments).sort().reverse();

  const getMonthLabel = (key: string) => {
    const [year, month] = key.split('-');
    const date = new Date(Number(year), Number(month) - 1);
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  const getAgeForMonth = (key: string) => {
    if (!currentBaby) return '';
    const [year, month] = key.split('-');
    const referenceDate = new Date(Number(year), Number(month) - 1, 1);
    return calculateAge(currentBaby.birthDate, referenceDate.toISOString());
  };

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

  return (
    <div className="pb-24">
      <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-2xl px-4 pb-4 pt-6">
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
        <div className="mx-auto max-w-2xl px-4 pb-4">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {availableFilters.map(filter => {
              const style = filter.active ? getHighlightStyle(filter.tone) : undefined;
              return (
                <button
                  key={filter.id}
                  onClick={() => toggleFilterPanel(filter.id)}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-2 text-sm transition-colors ${
                    filter.active
                      ? 'shadow-soft'
                      : 'border border-transparent bg-muted/60 text-muted-foreground hover:bg-muted'
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
              className="flex items-center gap-1 whitespace-nowrap rounded-xl border border-border px-3 py-2 text-xs text-muted-foreground hover:bg-muted/80"
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
              className="mx-auto max-w-2xl px-4 pb-4"
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

      <div className="mx-auto max-w-2xl px-4 pt-4">
        {monthKeys.length === 0 ? (
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
          monthKeys.map(monthKey => (
            <section key={monthKey} className="mb-8">
              <div className="sticky top-28 z-0 -mx-4 rounded-xl bg-background/90 px-4 py-2 backdrop-blur">
                <h2 className="text-base font-semibold capitalize text-foreground">
                  {getMonthLabel(monthKey)}
                </h2>
                {currentBaby && (
                  <p className="text-xs text-muted-foreground">
                    {getAgeForMonth(monthKey)} · {groupedMoments[monthKey].length}{' '}
                    {groupedMoments[monthKey].length === 1 ? 'história' : 'histórias'}
                  </p>
                )}
              </div>
              <div className="mt-3 grid grid-cols-1 gap-4">
                {groupedMoments[monthKey].map(moment => {
                  const chapter = chapterMap.get(moment.chapterId);
                  if (!chapter) return null;
                  return (
                    <PhotoCard
                      key={moment.id}
                      moment={moment}
                      chapter={chapter}
                      onClick={() => onSelectMoment?.(moment)}
                    />
                  );
                })}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
