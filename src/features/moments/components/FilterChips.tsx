import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Chapter } from "@/lib/types";
import { FiltersState } from "../hooks/useFilters";

interface FilterChipsProps {
  chapters: Chapter[];
  filters: FiltersState;
  hasActiveFilters: boolean;
  onToggleChapter: (chapterId: string) => void;
  onTogglePerson: (person: string) => void;
  onToggleTag: (tag: string) => void;
  onClearFilters: () => void;
  onToggleFavorite: () => void;
  availablePeople: string[];
  availableTags: string[];
}

export function FilterChips({
  chapters,
  filters,
  hasActiveFilters,
  onToggleChapter,
  onTogglePerson,
  onToggleTag,
  onClearFilters,
  onToggleFavorite,
  availablePeople,
  availableTags,
}: FilterChipsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll para mostrar botão "Limpar filtros"
    if (scrollContainerRef.current && hasActiveFilters) {
      const container = scrollContainerRef.current;
      container.scrollLeft = container.scrollWidth;
    }
  }, [hasActiveFilters]);

  return (
    <div className="px-4 py-3 border-b border-border overflow-x-auto">
      <div
        ref={scrollContainerRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide pb-2"
      >
        {/* Capítulos */}
        {chapters.map((chapter) => {
          const isActive = filters.chapters.includes(chapter.id);
          return (
            <motion.button
              key={chapter.id}
              layout
              onClick={() => onToggleChapter(chapter.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1 ${
                isActive
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              style={isActive ? { backgroundColor: chapter.color } : undefined}
            >
              <span>{chapter.icon}</span>
              <span>{chapter.name}</span>
              {isActive && <X className="w-3 h-3 ml-1" />}
            </motion.button>
          );
        })}

        {/* Pessoas */}
        {availablePeople.map((person) => {
          const isActive = filters.people.includes(person);
          return (
            <motion.button
              key={`person-${person}`}
              layout
              onClick={() => onTogglePerson(person)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1 ${
                isActive
                  ? "bg-blue-500 text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              👤 {person}
              {isActive && <X className="w-3 h-3 ml-1" />}
            </motion.button>
          );
        })}

        {/* Tags */}
        {availableTags.map((tag) => {
          const isActive = filters.tags.includes(tag);
          return (
            <motion.button
              key={`tag-${tag}`}
              layout
              onClick={() => onToggleTag(tag)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1 ${
                isActive
                  ? "bg-purple-500 text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              #{tag}
              {isActive && <X className="w-3 h-3 ml-1" />}
            </motion.button>
          );
        })}

        {/* Favoritos */}
        {(availablePeople.length > 0 ||
          availableTags.length > 0 ||
          chapters.length > 0) && (
          <motion.button
            layout
            onClick={onToggleFavorite}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1 ${
              filters.isFavorite
                ? "bg-amber-500 text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            ⭐ Favoritos
            {filters.isFavorite && <X className="w-3 h-3 ml-1" />}
          </motion.button>
        )}

        {/* Botão Limpar Filtros */}
        {hasActiveFilters && (
          <motion.button
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={onClearFilters}
            className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors flex items-center gap-1"
          >
            ✕ Limpar
          </motion.button>
        )}
      </div>
    </div>
  );
}
