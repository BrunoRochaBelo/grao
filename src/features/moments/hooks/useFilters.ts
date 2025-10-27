import { useState, useCallback, useMemo } from "react";
import { Moment } from "@/lib/types";
import { filterMoments, FilterCriteria } from "../utils/timelineUtils";

export interface FiltersState {
  chapters: string[];
  types: string[];
  ageRange?: { min: number; max: number };
  people: string[];
  familyMembers: string[];
  tags: string[];
  isFavorite: boolean;
}

export function useFilters(moments: Moment[], birthDate?: string) {
  const [filters, setFilters] = useState<FiltersState>({
    chapters: [],
    types: [],
    people: [],
    familyMembers: [],
    tags: [],
    isFavorite: false,
  });

  // Extrai valores únicos para cada filtro
  const availableFilters = useMemo(() => {
    const people = new Set<string>();
    const tags = new Set<string>();
    const types = new Set<string>();

    moments.forEach((moment) => {
      moment.people?.forEach((p) => people.add(p));
      moment.tags?.forEach((t) => tags.add(t));
      if (moment.templateId) {
        types.add(moment.templateId);
      }
    });

    return {
      people: Array.from(people).sort(),
      tags: Array.from(tags).sort(),
      types: Array.from(types).sort(),
      ageRanges: [
        { label: "0–3m", min: 0, max: 3 },
        { label: "3–6m", min: 3, max: 6 },
        { label: "6–12m", min: 6, max: 12 },
        { label: "1–2a", min: 12, max: 24 },
      ],
    };
  }, [moments]);

  // Momentos filtrados
  const filteredMoments = useMemo(() => {
    const criteria: FilterCriteria = {
      chapters: filters.chapters.length > 0 ? filters.chapters : undefined,
      types: filters.types.length > 0 ? filters.types : undefined,
      ageRange: filters.ageRange,
      people: filters.people.length > 0 ? filters.people : undefined,
      tags: filters.tags.length > 0 ? filters.tags : undefined,
      isFavorite: filters.isFavorite || undefined,
    };

    return filterMoments(moments, criteria, birthDate);
  }, [moments, filters, birthDate]);

  // Atualiza filtros individuais
  const toggleChapter = useCallback((chapterId: string) => {
    setFilters((prev) => ({
      ...prev,
      chapters: prev.chapters.includes(chapterId)
        ? prev.chapters.filter((id) => id !== chapterId)
        : [...prev.chapters, chapterId],
    }));
  }, []);

  const toggleType = useCallback((type: string) => {
    setFilters((prev) => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter((t) => t !== type)
        : [...prev.types, type],
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

  const toggleFamilyMember = useCallback((memberId: string) => {
    setFilters((prev) => ({
      ...prev,
      familyMembers: prev.familyMembers.includes(memberId)
        ? prev.familyMembers.filter((id) => id !== memberId)
        : [...prev.familyMembers, memberId],
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

  const setAgeRange = useCallback(
    (range: { min: number; max: number } | undefined) => {
      setFilters((prev) => ({
        ...prev,
        ageRange: range,
      }));
    },
    []
  );

  const toggleFavorite = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      isFavorite: !prev.isFavorite,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      chapters: [],
      types: [],
      people: [],
      familyMembers: [],
      tags: [],
      isFavorite: false,
    });
  }, []);

  const hasActiveFilters =
    filters.chapters.length > 0 ||
    filters.types.length > 0 ||
    filters.people.length > 0 ||
    filters.familyMembers.length > 0 ||
    filters.tags.length > 0 ||
    filters.ageRange !== undefined ||
    filters.isFavorite;

  return {
    filters,
    filteredMoments,
    availableFilters,
    toggleChapter,
    toggleType,
    togglePerson,
    toggleFamilyMember,
    toggleTag,
    setAgeRange,
    toggleFavorite,
    clearFilters,
    hasActiveFilters,
  };
}
