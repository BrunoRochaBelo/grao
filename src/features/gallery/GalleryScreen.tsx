import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CalendarDays,
  ChevronRight,
  Filter,
  MapPin,
  Search,
  Tag,
  Users,
  X,
} from 'lucide-react';
import { useBabyData } from '@/lib/baby-data-context';
import type { Moment } from '@/lib/types';

interface GalleryScreenProps {
  onSelectMoment?: (moment: Moment) => void;
}

type FilterKey = 'all' | 'month' | 'people' | 'places' | 'types';

const filterChips: Array<{ id: FilterKey | 'clear'; label: string }> = [
  { id: 'all', label: 'Todos' },
  { id: 'month', label: 'Por mês' },
  { id: 'people', label: 'Pessoas' },
  { id: 'places', label: 'Lugares' },
  { id: 'types', label: 'Tipos' },
  { id: 'clear', label: 'Limpar' },
];

const formatMonthHeading = (value: Date) =>
  new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(value);

const formatDate = (value: string | Date) =>
  new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
  }).format(typeof value === 'string' ? new Date(value) : value);

const suggestionPills = ['Vovó Maria', 'Setembro 2024', 'Praia'];

export function GalleryScreen({ onSelectMoment: _ }: GalleryScreenProps) {
  const { getMoments } = useBabyData();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<FilterKey[]>(['all']);
  const [viewerState, setViewerState] = useState<{ isOpen: boolean; index: number; items: Moment[] }>({
    isOpen: false,
    index: 0,
    items: [],
  });

  const rawMoments = getMoments();

  const orderedMoments = useMemo(() => {
    return rawMoments.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [rawMoments]);

  const filteredMoments = useMemo(() => {
    return orderedMoments.filter(moment => {
      const matchesSearch = searchTerm
        ? [
            moment.title,
            moment.noteShort ?? '',
            moment.noteLong ?? '',
            moment.location ?? '',
            ...(moment.tags ?? []),
            ...(moment.people ?? []),
          ]
            .join(' ')
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        : true;

      if (!matchesSearch) return false;

      if (activeFilters.includes('people') && (!moment.people || moment.people.length === 0)) {
        return false;
      }

      if (activeFilters.includes('places') && !moment.location) {
        return false;
      }

      if (activeFilters.includes('types')) {
        const hasVideo = !!moment.hasVideo;
        if (!hasVideo) return false;
      }

      return true;
    });
  }, [orderedMoments, searchTerm, activeFilters]);

  const groupedMoments = useMemo(() => {
    const groups = new Map<string, { label: string; items: Moment[] }>();

    filteredMoments.forEach(moment => {
      const date = new Date(moment.date);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (!groups.has(key)) {
        groups.set(key, { label: formatMonthHeading(date), items: [] });
      }
      groups.get(key)?.items.push(moment);
    });

    return Array.from(groups.entries())
      .sort((a, b) => (a[0] > b[0] ? -1 : 1))
      .map(([, value]) => ({ ...value, items: value.items }));
  }, [filteredMoments]);

  const openViewer = (items: Moment[], index: number) => {
    setViewerState({ isOpen: true, index, items });
  };

  const closeViewer = () => setViewerState({ isOpen: false, index: 0, items: [] });

  useEffect(() => {
    if (!viewerState.isOpen) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeViewer();
      }
      if (event.key === 'ArrowRight') {
        setViewerState(state => ({
          ...state,
          index: Math.min(state.index + 1, state.items.length - 1),
        }));
      }
      if (event.key === 'ArrowLeft') {
        setViewerState(state => ({
          ...state,
          index: Math.max(state.index - 1, 0),
        }));
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [viewerState.isOpen]);

  const toggleFilter = (filter: FilterKey | 'clear') => {
    if (filter === 'clear') {
      setActiveFilters(['all']);
      return;
    }
    if (filter === 'all') {
      setActiveFilters(['all']);
      return;
    }
    setActiveFilters(prev => {
      const withoutAll = prev.filter(item => item !== 'all');
      if (withoutAll.includes(filter)) {
        const next = withoutAll.filter(item => item !== filter);
        return next.length ? next : ['all'];
      }
      return [...withoutAll, filter];
    });
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-3xl px-5 pb-32 pt-8">
      <header className="mb-8 space-y-4">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-zinc-400">🌸 Momentos</p>
          <h1 className="mt-2 text-3xl font-semibold text-zinc-800">Um passeio pelos primeiros 6 meses</h1>
        </div>
        <button className="flex w-full items-center justify-between rounded-3xl bg-gradient-to-br from-violet-500/10 via-transparent to-fuchsia-500/10 px-6 py-5 text-left shadow-sm transition hover:shadow-md">
          <div>
            <p className="text-sm text-violet-500">✨ Sugestão automática</p>
            <p className="text-lg font-semibold text-violet-700">"Um passeio pelos primeiros 6 meses"</p>
          </div>
          <ChevronRight className="h-5 w-5 text-violet-500" />
        </button>
      </header>

      <section className="mb-6 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-1 items-center gap-3 rounded-full bg-zinc-100 px-5 py-3">
            <Search className="h-5 w-5 text-zinc-400" />
            <input
              value={searchTerm}
              onChange={event => setSearchTerm(event.target.value)}
              placeholder="Procurar por data, pessoa, lugar..."
              className="w-full bg-transparent text-sm text-zinc-600 placeholder:text-zinc-400 focus:outline-none"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="text-zinc-400 hover:text-zinc-600">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button className="rounded-full bg-zinc-900 px-4 py-3 text-sm font-semibold text-white shadow-sm">
            <Filter className="mr-2 inline h-4 w-4" /> Filtros avançados
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestionPills.map(pill => (
            <button
              key={pill}
              onClick={() => setSearchTerm(pill)}
              className="rounded-full bg-zinc-100 px-4 py-2 text-sm text-zinc-500 hover:bg-zinc-200"
            >
              {pill}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {filterChips.map(chip => {
            const isActive = activeFilters.includes(chip.id as FilterKey) || (chip.id === 'clear' && activeFilters.length > 1);
            return (
              <button
                key={chip.id}
                onClick={() => toggleFilter(chip.id)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  isActive ? 'bg-violet-500 text-white shadow-sm' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-10">
        {groupedMoments.map(group => (
          <div key={group.label} className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-zinc-400">
                <CalendarDays className="h-4 w-4 text-violet-500" />
                {group.label}
              </div>
              <button className="rounded-full border border-dashed border-violet-300 px-4 py-2 text-sm text-violet-500 hover:bg-violet-50">
                + Nesta data
              </button>
            </div>
            <div className="columns-2 gap-3 space-y-3">
              {group.items.map((moment, index) => (
                <article
                  key={moment.id}
                  className="group break-inside-avoid overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  onClick={() => {
                    openViewer(filteredMoments, filteredMoments.indexOf(moment));
                  }}
                >
                  {moment.media?.[0] && (
                    <div className="relative">
                      <img src={moment.media[0]} alt={moment.title} className="h-full w-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/60 via-black/20 to-transparent p-3 text-xs text-white">
                        <span>{moment.age}</span>
                        {moment.hasVideo && (
                          <span className="rounded-full bg-black/50 px-3 py-1 text-[11px]">▶ Vídeo</span>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="space-y-2 p-4">
                    <h3 className="text-base font-semibold text-zinc-800">{moment.title}</h3>
                    <p className="flex items-center gap-2 text-xs text-zinc-400">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatDate(moment.date)}
                    </p>
                    {moment.location && (
                      <p className="flex items-center gap-2 text-xs text-zinc-400">
                        <MapPin className="h-3.5 w-3.5" />
                        {moment.location}
                      </p>
                    )}
                    {moment.people && moment.people.length > 0 && (
                      <p className="flex items-center gap-2 text-xs text-zinc-400">
                        <Users className="h-3.5 w-3.5" />
                        {moment.people.join(', ')}
                      </p>
                    )}
                    {moment.tags && moment.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {moment.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="rounded-full bg-zinc-100 px-3 py-1 text-[11px] text-zinc-500">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>

      <AnimatePresence>
        {viewerState.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          >
            <div className="absolute inset-0" onClick={closeViewer} />
            <div className="relative z-10 flex h-[80vh] w-[90vw] max-w-2xl flex-col overflow-hidden rounded-3xl bg-white/95 shadow-2xl">
              <button
                onClick={closeViewer}
                className="absolute right-4 top-4 z-20 rounded-full bg-black/30 p-2 text-white hover:bg-black/40"
              >
                <X className="h-5 w-5" />
              </button>
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={viewerState.index}
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.25 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -120 && viewerState.index < viewerState.items.length - 1) {
                      setViewerState(state => ({ ...state, index: state.index + 1 }));
                    }
                    if (info.offset.x > 120 && viewerState.index > 0) {
                      setViewerState(state => ({ ...state, index: state.index - 1 }));
                    }
                  }}
                  className="flex flex-1 flex-col"
                >
                  <div className="flex-1 bg-black/5">
                    {viewerState.items[viewerState.index]?.media?.[0] && (
                      <img
                        src={viewerState.items[viewerState.index].media[0]}
                        alt={viewerState.items[viewerState.index].title}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="border-t border-zinc-200 bg-white/90 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-zinc-800">
                          {viewerState.items[viewerState.index]?.title}
                        </h3>
                        <p className="text-sm text-zinc-500">
                          {formatDate(viewerState.items[viewerState.index]?.date ?? new Date())}
                          {viewerState.items[viewerState.index]?.location
                            ? ` · ${viewerState.items[viewerState.index]?.location}`
                            : ''}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button className="rounded-full border border-zinc-200 px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-100">
                          ✏️ Editar
                        </button>
                        <button className="rounded-full border border-zinc-200 px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-100">
                          🔗 Compartilhar
                        </button>
                        <button className="rounded-full border border-zinc-200 px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-100">
                          🗑️ Excluir
                        </button>
                      </div>
                    </div>
                    {viewerState.items[viewerState.index]?.noteLong && (
                      <p className="mt-4 text-sm text-zinc-600">
                        {viewerState.items[viewerState.index]?.noteLong}
                      </p>
                    )}
                    {viewerState.items[viewerState.index]?.tags && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {viewerState.items[viewerState.index]?.tags?.map(tag => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-500"
                          >
                            <Tag className="h-3 w-3" />#{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-y-0 left-3 flex items-center">
                <button
                  onClick={() =>
                    setViewerState(state => ({ ...state, index: Math.max(state.index - 1, 0) }))
                  }
                  className="rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
                >
                  ‹
                </button>
              </div>
              <div className="absolute inset-y-0 right-3 flex items-center">
                <button
                  onClick={() =>
                    setViewerState(state => ({
                      ...state,
                      index: Math.min(state.index + 1, state.items.length - 1),
                    }))
                  }
                  className="rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
                >
                  ›
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
