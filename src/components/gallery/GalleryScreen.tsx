import { useState } from 'react';
import { getMoments, chapters, Moment } from '../../lib/mockData';
import { Lock, Video, ChevronDown, ChevronUp, Filter, X, Calendar, Users, Tag, Image as ImageIcon, FolderOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from '../ui/badge';

const moments = getMoments();

interface GalleryScreenProps {
  onSelectMoment?: (moment: Moment) => void;
}

interface PhotoCardProps {
  moment: typeof moments[0];
  chapter: typeof chapters[0];
  onClick: () => void;
}

interface FilterOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  type: 'chapter' | 'type' | 'period' | 'people' | 'tags' | 'media' | 'privacy';
}

function PhotoCard({ moment, chapter, onClick }: PhotoCardProps) {
  const [expanded, setExpanded] = useState(false);
  const hasMedia = moment.media && moment.media.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border"
    >
      {hasMedia && (
        <div className="relative aspect-[4/3] overflow-hidden" onClick={onClick}>
          <img
            src={moment.media[0]}
            alt={moment.title}
            className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
          
          {/* Chapter Badge */}
          <div
            className="absolute top-2 left-2 px-2 py-1 rounded-lg text-xs backdrop-blur-sm"
            style={{ backgroundColor: chapter.color + 'DD' }}
          >
            {chapter.icon} {chapter.name}
          </div>

          {/* Icons */}
          <div className="absolute top-2 right-2 flex gap-1">
            {moment.hasVideo && (
              <div className="w-7 h-7 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Video className="w-4 h-4 text-white" />
              </div>
            )}
            {moment.privacy === 'private' && (
              <div className="w-7 h-7 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Lock className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-3">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="text-foreground mb-1">{moment.title}</h3>
            <p className="text-muted-foreground text-sm">{moment.age} · {new Date(moment.date).toLocaleDateString('pt-BR')}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
            aria-label={expanded ? 'Recolher' : 'Expandir'}
          >
            {expanded ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </button>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {moment.noteShort && (
                <p className="text-foreground text-sm mb-2">{moment.noteShort}</p>
              )}
              {moment.noteLong && (
                <p className="text-foreground text-sm mb-2">{moment.noteLong}</p>
              )}
              {moment.tags && moment.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {moment.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
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
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [mediaFilter, setMediaFilter] = useState<'all' | 'photo' | 'video'>('all');

  const availableFilters: FilterOption[] = [
    { id: 'chapter', label: 'Capítulo', icon: <FolderOpen className="w-4 h-4" />, active: !!selectedChapter, type: 'chapter' },
    { id: 'period', label: 'Período', icon: <Calendar className="w-4 h-4" />, active: !!selectedPeriod, type: 'period' },
    { id: 'media', label: 'Mídia', icon: <ImageIcon className="w-4 h-4" />, active: mediaFilter !== 'all', type: 'media' },
    { id: 'people', label: 'Pessoas', icon: <Users className="w-4 h-4" />, active: false, type: 'people' },
    { id: 'tags', label: 'Tags', icon: <Tag className="w-4 h-4" />, active: false, type: 'tags' },
  ];

  const toggleFilter = (filterId: string) => {
    if (filterId === 'chapter') {
      // Open chapter selector (for now, just toggle)
      setSelectedChapter(selectedChapter ? null : chapters[0].id);
    } else if (filterId === 'period') {
      setSelectedPeriod(selectedPeriod ? null : 'last-month');
    } else if (filterId === 'media') {
      setMediaFilter(mediaFilter === 'all' ? 'photo' : mediaFilter === 'photo' ? 'video' : 'all');
    }
  };

  const clearAllFilters = () => {
    setSelectedChapter(null);
    setSelectedPeriod(null);
    setMediaFilter('all');
  };

  const hasActiveFilters = selectedChapter || selectedPeriod || mediaFilter !== 'all';

  // Filter moments
  let filteredMoments = [...moments];
  if (selectedChapter) {
    filteredMoments = filteredMoments.filter(m => m.chapterId === selectedChapter);
  }
  if (mediaFilter === 'photo') {
    filteredMoments = filteredMoments.filter(m => !m.hasVideo);
  } else if (mediaFilter === 'video') {
    filteredMoments = filteredMoments.filter(m => m.hasVideo);
  }

  // Group moments by month
  const groupedMoments = filteredMoments.reduce((acc, moment) => {
    const date = new Date(moment.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(moment);
    return acc;
  }, {} as Record<string, typeof moments>);

  const getMonthLabel = (key: string) => {
    const [year, month] = key.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="pb-24 max-w-2xl mx-auto">
      {/* Header with title */}
      <div className="px-4 pt-6 pb-3">
        <h1 className="text-foreground mb-1">Galeria</h1>
        <p className="text-muted-foreground text-sm">
          {filteredMoments.length} {filteredMoments.length === 1 ? 'momento' : 'momentos'}
        </p>
      </div>

      {/* Filters */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10 px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide flex-1">
            {availableFilters.map((filterOption) => (
              <button
                key={filterOption.id}
                onClick={() => toggleFilter(filterOption.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm whitespace-nowrap transition-colors ${
                  filterOption.active
                    ? 'bg-primary text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <div className={filterOption.active ? 'text-white' : 'text-muted-foreground'}>
                  {filterOption.icon}
                </div>
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
            Limpar filtros
          </button>
        )}
      </div>

      {/* Gallery Grid */}
      <div className="px-4 pt-4">
        {Object.keys(groupedMoments).length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-foreground mb-2">Nenhum momento encontrado</h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-4">
              {hasActiveFilters ? 'Tente ajustar os filtros' : 'Comece registrando momentos especiais'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-primary hover:underline text-sm"
              >
                Limpar filtros
              </button>
            )}
          </div>
        ) : (
          Object.keys(groupedMoments)
            .sort()
            .reverse()
            .map((monthKey) => (
              <div key={monthKey} className="mb-6">
                <h2 className="text-foreground mb-3 capitalize sticky top-24 bg-background py-2">
                  {getMonthLabel(monthKey)}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {groupedMoments[monthKey].map((moment) => {
                    const chapter = chapters.find((ch) => ch.id === moment.chapterId);
                    return chapter ? (
                      <PhotoCard
                        key={moment.id}
                        moment={moment}
                        chapter={chapter}
                        onClick={() => onSelectMoment?.(moment)}
                      />
                    ) : null;
                  })}
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
