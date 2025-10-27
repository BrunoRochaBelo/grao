import { useState, useMemo, useCallback } from "react";
import { Moment } from "@/lib/types";

export interface AgeRange {
  label: string;
  min: number;
  max: number;
}

export interface FiltersState {
  chapters: string[];
  people: string[];
  tags: string[];
  ageRange?: AgeRange;
  favorites: boolean;
}

interface AvailableFilters {
  people: string[];
  tags: string[];
  types: string[];
  ageRanges: AgeRange[];
}

const DEFAULT_AGE_RANGES: AgeRange[] = [
  { label: "0–3 meses", min: 0, max: 90 },
  { label: "3–6 meses", min: 90, max: 180 },
  { label: "6–12 meses", min: 180, max: 365 },
  { label: "1–2 anos", min: 365, max: 730 },
];

/**
 * Hook para gerenciar filtros da timeline de momentos
 * Retorna estado de filtros, momentos filtrados e ações para alterar filtros
 */
export function useFilters(moments: Moment[], babyBirthDate?: string) {
  const [filters, setFilters] = useState<FiltersState>({
    chapters: [],
    people: [],
    tags: [],
    favorites: false,
  });

  // Extrair filtros disponíveis dos momentos
  const availableFilters = useMemo((): AvailableFilters => {
    const people = new Set<string>();
    const tags = new Set<string>();
    const types = new Set<string>();

    moments.forEach((moment) => {
      if (moment.people) {
        moment.people.forEach((p) => people.add(p));
      }
      if (moment.tags) {
        moment.tags.forEach((t) => tags.add(t));
      }
      types.add(moment.templateId || "nota");
    });

    return {
      people: Array.from(people).sort(),
      tags: Array.from(tags).sort(),
      types: Array.from(types).sort(),
      ageRanges: DEFAULT_AGE_RANGES,
    };
  }, [moments]);

  // Calcular idade em dias a partir da data de nascimento
  const calculateAgeInDays = useCallback(
    (dateString: string): number => {
      if (!babyBirthDate) return 0;
      const birth = new Date(babyBirthDate);
      const eventDate = new Date(dateString);
      return Math.floor(
        (eventDate.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24)
      );
    },
    [babyBirthDate]
  );

  // Aplicar filtros aos momentos
  const filteredMoments = useMemo(() => {
    let result = moments.filter((m) => m.status === "published");

    // Filtro por capítulo
    if (filters.chapters.length > 0) {
      result = result.filter((m) => filters.chapters.includes(m.chapterId));
    }

    // Filtro por pessoas
    if (filters.people.length > 0) {
      result = result.filter((m) =>
        m.people?.some((p) => filters.people.includes(p))
      );
    }

    // Filtro por tags
    if (filters.tags.length > 0) {
      result = result.filter((m) =>
        m.tags?.some((t) => filters.tags.includes(t))
      );
    }

    // Filtro por idade
    if (filters.ageRange) {
      result = result.filter((m) => {
        const ageInDays = calculateAgeInDays(m.date);
        return (
          ageInDays >= filters.ageRange!.min &&
          ageInDays <= filters.ageRange!.max
        );
      });
    }

    // Filtro por favoritos
    if (filters.favorites) {
      result = result.filter((m) => {
        if (typeof window === "undefined") return false;
        const favoritesStr = localStorage.getItem("babybook_favorites");
        const favorites = favoritesStr ? JSON.parse(favoritesStr) : [];
        return favorites.includes(m.id);
      });
    }

    // Ordenar por data decrescente (mais recente primeiro)
    return result.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [moments, filters, calculateAgeInDays]);

  // Ações de filtro
  const toggleChapter = useCallback((chapterId: string) => {
    setFilters((prev) => ({
      ...prev,
      chapters: prev.chapters.includes(chapterId)
        ? prev.chapters.filter((id) => id !== chapterId)
        : [...prev.chapters, chapterId],
    }));
  }, []);

  const togglePerson = useCallback((person: string) => {
    setFilters((prev) => ({
      ...prev,
      people: prev.people.includes(person)
        ? prev.people.filter((p) => p !== person)
        : [...prev.people, person],
    }));
  }, []);

  const toggleTag = useCallback((tag: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  }, []);

  const setAgeRange = useCallback((range: AgeRange | undefined) => {
    setFilters((prev) => ({
      ...prev,
      ageRange: range,
    }));
  }, []);

  const toggleFavorite = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      favorites: !prev.favorites,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      chapters: [],
      people: [],
      tags: [],
      favorites: false,
    });
  }, []);

  const hasActiveFilters = Boolean(
    filters.chapters.length > 0 ||
      filters.people.length > 0 ||
      filters.tags.length > 0 ||
      filters.ageRange ||
      filters.favorites
  );

  return {
    filters,
    filteredMoments,
    availableFilters,
    toggleChapter,
    togglePerson,
    toggleTag,
    setAgeRange,
    toggleFavorite,
    clearFilters,
    hasActiveFilters,
  };
}
