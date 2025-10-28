import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronDown } from "lucide-react";
import { Chapter } from "@/lib/types";
import { FiltersState, FilterPersonOption } from "../hooks/useFilters";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AgeRange {
  label: string;
  min: number;
  max: number;
}

interface FilterChipsProps {
  chapters: Chapter[];
  filters: FiltersState;
  hasActiveFilters: boolean;
  onToggleChapter: (chapterId: string) => void;
  onTogglePerson: (person: string) => void;
  onToggleTag: (tag: string) => void;
  onSetAgeRange: (range: AgeRange | undefined) => void;
  onClearFilters: () => void;
  onToggleFavorite: () => void;
  availablePeople: FilterPersonOption[];
  availableTags: string[];
  availableAgeRanges: AgeRange[];
}

type OpenDropdown = "chapters" | "period" | "people" | null;

export function FilterChips({
  chapters,
  filters,
  hasActiveFilters,
  onToggleChapter,
  onTogglePerson,
  onToggleTag,
  onSetAgeRange,
  onClearFilters,
  onToggleFavorite,
  availablePeople,
  availableTags,
  availableAgeRanges,
}: FilterChipsProps) {
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const peopleLookup = useMemo(() => {
    const map = new Map<string, FilterPersonOption>();
    availablePeople.forEach((person) => {
      map.set(person.id, person);
    });
    return map;
  }, [availablePeople]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    }

    if (openDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [openDropdown]);

  // Contar filtros ativos de cada categoria
  const activeChaptersCount = filters.chapters.length;
  const activePeriodCount = filters.ageRange ? 1 : 0;
  const activePeopleCount = filters.people.length;

  return (
    <div ref={containerRef} className="border-b border-border bg-background">
      {/* Row 1: Botões de Categoria */}
      <div className="px-4 py-3 flex items-center gap-2 flex-wrap">
        {/* Botão: Capítulos */}
        <div className="relative">
          <motion.button
            layout
            onClick={() =>
              setOpenDropdown(openDropdown === "chapters" ? null : "chapters")
            }
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 border ${
              openDropdown === "chapters" || activeChaptersCount > 0
                ? "shadow-soft"
                : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80"
            }`}
            style={
              openDropdown === "chapters" || activeChaptersCount > 0
                ? {
                    backgroundColor: "rgb(59, 130, 246, 0.1)",
                    color: "rgb(37, 99, 235)",
                    borderColor: "rgb(147, 197, 253)",
                  }
                : undefined
            }
          >
            <span>📚 Capítulos</span>
            {activeChaptersCount > 0 && (
              <span className="text-xs font-bold bg-blue-200 text-blue-700 px-2 py-0.5 rounded-full">
                {activeChaptersCount}
              </span>
            )}
            <ChevronDown className="w-4 h-4" />
          </motion.button>

          {/* Dropdown: Capítulos */}
          <AnimatePresence>
            {openDropdown === "chapters" && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 mt-2 bg-card border border-border rounded-lg shadow-lg p-2 z-50 max-h-60 overflow-y-auto whitespace-nowrap"
              >
                {chapters.map((chapter) => {
                  const isActive = filters.chapters.includes(chapter.id);
                  return (
                    <button
                      key={chapter.id}
                      onClick={() => {
                        onToggleChapter(chapter.id);
                      }}
                      className={`w-full text-left px-3 py-3 rounded-md text-sm font-medium transition-all block my-1 ${
                        isActive
                          ? "text-white"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                      }`}
                      style={
                        isActive
                          ? { backgroundColor: chapter.color }
                          : undefined
                      }
                    >
                      {chapter.icon} {chapter.name}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Botão: Período */}
        {availableAgeRanges.length > 0 && (
          <div className="relative">
            <motion.button
              layout
              onClick={() =>
                setOpenDropdown(openDropdown === "period" ? null : "period")
              }
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 border ${
                openDropdown === "period" || activePeriodCount > 0
                  ? "shadow-soft"
                  : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80"
              }`}
              style={
                openDropdown === "period" || activePeriodCount > 0
                  ? {
                      backgroundColor: "rgb(34, 197, 94, 0.1)",
                      color: "rgb(22, 163, 74)",
                      borderColor: "rgb(134, 239, 172)",
                    }
                  : undefined
              }
            >
              <span>📅 Período</span>
              {activePeriodCount > 0 && (
                <span className="text-xs font-bold bg-green-200 text-green-700 px-2 py-0.5 rounded-full">
                  {activePeriodCount}
                </span>
              )}
              <ChevronDown className="w-4 h-4" />
            </motion.button>

            {/* Dropdown: Período */}
            <AnimatePresence>
              {openDropdown === "period" && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-2 bg-card border border-border rounded-lg shadow-lg p-2 z-50 max-h-60 overflow-y-auto whitespace-nowrap"
                >
                  {availableAgeRanges.map((range) => {
                    const isActive =
                      filters.ageRange?.min === range.min &&
                      filters.ageRange?.max === range.max;
                    return (
                      <button
                        key={`age-${range.label}`}
                        onClick={() => {
                          onSetAgeRange(isActive ? undefined : range);
                          setOpenDropdown(null);
                        }}
                        className={`w-full text-left px-3 py-3 rounded-md text-sm font-medium transition-all block my-1 ${
                          isActive
                            ? "bg-green-500 text-white"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                        }`}
                      >
                        {range.label}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Botão: Pessoas */}
        <div className="relative">
          <motion.button
            layout
            onClick={() =>
              setOpenDropdown(openDropdown === "people" ? null : "people")
            }
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 border ${
              openDropdown === "people" || activePeopleCount > 0
                ? "shadow-soft"
                : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80"
            }`}
            style={
              openDropdown === "people" || activePeopleCount > 0
                ? {
                    backgroundColor: "rgb(168, 85, 247, 0.1)",
                    color: "rgb(147, 51, 234)",
                    borderColor: "rgb(221, 214, 254)",
                  }
                : undefined
            }
          >
            <span>👤 Pessoas</span>
            {activePeopleCount > 0 && (
              <span className="text-xs font-bold bg-purple-200 text-purple-700 px-2 py-0.5 rounded-full">
                {activePeopleCount}
              </span>
            )}
            <ChevronDown className="w-4 h-4" />
          </motion.button>

          {/* Dropdown: Pessoas */}
          <AnimatePresence>
            {openDropdown === "people" && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 mt-2 bg-card border border-border rounded-lg shadow-lg p-2 z-50 max-h-60 overflow-y-auto min-w-[250px]"
              >
                {availablePeople.length === 0 ? (
                  <div className="px-3 py-4 text-sm text-muted-foreground">
                    Nenhum membro da família cadastrado
                  </div>
                ) : (
                  availablePeople.map((person) => {
                    const isActive = filters.people.includes(person.id);
                    const relationLabel =
                      person.relation ||
                      (person.isSynthetic
                        ? "Contato registrado no álbum"
                        : "Parentesco não informado");

                    const initials = person.name
                      .split(" ")
                      .map((part) => part.trim())
                      .filter(Boolean)
                      .map((part) => part[0]?.toUpperCase() ?? "")
                      .join("")
                      .slice(0, 2);

                    return (
                      <button
                        key={`person-${person.id}`}
                        onClick={() => {
                          onTogglePerson(person.id);
                        }}
                        className={`w-full text-left px-3 py-3 rounded-md text-sm transition-all block my-1 ${
                          isActive
                            ? "bg-purple-500 text-white shadow-sm"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="size-12 border border-border/40">
                            {person.avatar ? (
                              <AvatarImage
                                src={person.avatar}
                                alt={person.name}
                              />
                            ) : (
                              <AvatarFallback>
                                {initials || "👤"}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="flex flex-col items-start leading-tight">
                            <span
                              className={`font-semibold ${
                                isActive ? "text-white" : "text-foreground"
                              }`}
                            >
                              {person.name}
                            </span>
                            <span
                              className={`text-xs ${
                                isActive
                                  ? "text-white/80"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {relationLabel}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Row 2: Filtros Ativos + Botão Limpar */}
      {hasActiveFilters && (
        <div className="border-t border-border/50 relative">
          <div className="px-4 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
            {/* Container interno para scroll - os chips ficarão aqui */}
            <div className="flex items-center gap-1.5 min-w-max">
              {/* Filtros de Capítulos Ativos */}
              {filters.chapters.map((chapterId) => {
                const chapter = chapters.find((c) => c.id === chapterId);
                if (!chapter) return null;
                return (
                  <motion.button
                    key={`active-chapter-${chapterId}`}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => onToggleChapter(chapterId)}
                    className="px-3 py-1.5 rounded-full text-sm font-medium text-white shadow-sm flex items-center gap-2 flex-shrink-0 transition-all hover:opacity-80"
                    style={{ backgroundColor: chapter.color }}
                  >
                    {chapter.icon} {chapter.name}
                    <X className="w-3.5 h-3.5" />
                  </motion.button>
                );
              })}

              {/* Filtro de Período Ativo */}
              {filters.ageRange && (
                <motion.button
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => onSetAgeRange(undefined)}
                  className="px-3 py-1.5 rounded-full text-sm font-medium bg-green-500 text-white shadow-sm flex items-center gap-2 flex-shrink-0 transition-all hover:opacity-80"
                >
                  📅 {filters.ageRange.min}–{filters.ageRange.max}m
                  <X className="w-3.5 h-3.5" />
                </motion.button>
              )}

              {/* Filtros de Pessoas Ativos */}
              {filters.people.map((personId) => {
                const person = peopleLookup.get(personId);
                const label = person?.name ?? personId;
                return (
                  <motion.button
                    key={`active-person-${personId}`}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => onTogglePerson(personId)}
                    className="px-3 py-1.5 rounded-full text-sm font-medium bg-purple-500 text-white shadow-sm flex items-center gap-2 flex-shrink-0 transition-all hover:opacity-80"
                  >
                    👤 {label}
                    <X className="w-3.5 h-3.5" />
                  </motion.button>
                );
              })}

              {/* Filtros de Tags Ativos */}
              {filters.tags.map((tag) => (
                <motion.button
                  key={`active-tag-${tag}`}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => onToggleTag(tag)}
                  className="px-3 py-1.5 rounded-full text-sm font-medium bg-amber-500 text-white shadow-sm flex items-center gap-2 flex-shrink-0 transition-all hover:opacity-80"
                >
                  #{tag}
                  <X className="w-3.5 h-3.5" />
                </motion.button>
              ))}

              {/* Favoritos Ativo */}
              {filters.favorites && (
                <motion.button
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={onToggleFavorite}
                  className="px-3 py-1.5 rounded-full text-sm font-medium bg-yellow-500 text-white shadow-sm flex items-center gap-2 flex-shrink-0 transition-all hover:opacity-80"
                >
                  ⭐ Favoritos
                  <X className="w-3.5 h-3.5" />
                </motion.button>
              )}
            </div>
          </div>

          {/* Botão Limpar Filtros - sticky no canto direito */}
          <motion.button
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={onClearFilters}
            className="sticky right-4 px-3 py-1.5 rounded-full text-xs font-medium bg-red-500/15 text-red-600 hover:bg-red-500/25 transition-colors flex items-center gap-1 flex-shrink-0 ml-auto"
          >
            ✕ Limpar tudo
          </motion.button>
        </div>
      )}
    </div>
  );
}
