import { useState } from 'react';
import { Search as SearchIcon, Calendar, User, Tag } from 'lucide-react';
import { Input } from '../ui/input';
import { getMoments, chapters } from '../../lib/mockData';
import { motion } from 'motion/react';

export function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const moments = getMoments();

  const filters = [
    { id: 'all', label: 'Todos', icon: null },
    { id: 'chapter', label: 'Capítulos', icon: Calendar },
    { id: 'date', label: 'Data', icon: Calendar },
    { id: 'people', label: 'Pessoas', icon: User },
    { id: 'tags', label: 'Tags', icon: Tag },
  ];

  const filteredMoments = moments.filter((moment) =>
    moment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    moment.noteShort?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    moment.noteLong?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pb-24 max-w-2xl mx-auto">
      {/* Search Header */}
      <div className="sticky top-0 bg-background z-10 px-4 pt-6 pb-4 border-b border-border">
        <div className="relative mb-4">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Procure por capítulo, pessoa ou tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 rounded-xl"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {filters.map((filter) => {
            const Icon = filter.icon;
            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-colors ${
                  activeFilter === filter.id
                    ? 'bg-primary text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {Icon && <Icon className="w-4 h-4" />}
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results */}
      <div className="px-4 pt-4">
        {searchQuery === '' ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <SearchIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-foreground mb-2">Buscar Memórias</h3>
            <p className="text-muted-foreground text-sm">
              Digite para encontrar momentos especiais
            </p>
          </div>
        ) : filteredMoments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum resultado encontrado</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMoments.map((moment, index) => {
              const chapter = chapters.find((ch) => ch.id === moment.chapterId);
              const hasMedia = moment.media && moment.media.length > 0;
              return (
                <motion.div
                  key={moment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card rounded-xl p-3 shadow-sm border border-border hover:shadow-md transition-shadow cursor-pointer flex gap-3"
                >
                  {hasMedia && (
                    <img
                      src={moment.media[0]}
                      alt={moment.title}
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-foreground mb-1">{moment.title}</h3>
                    <div className="flex items-center gap-2 mb-1">
                      {chapter && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-lg"
                          style={{ backgroundColor: chapter.color }}
                        >
                          {chapter.icon} {chapter.name}
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {moment.age} · {new Date(moment.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
