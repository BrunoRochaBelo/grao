import { useState, useMemo, useCallback } from "react";
import { FamilyMember, Moment } from "@/lib/types";

export interface FilterPersonOption {
  id: string;
  name: string;
  relation?: string;
  avatar?: string;
  /** Indica opções derivadas dos próprios momentos para manter compatibilidade */
  isSynthetic?: boolean;
}

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
  people: FilterPersonOption[];
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
export function useFilters(
  moments: Moment[],
  babyBirthDate?: string,
  familyMembers: FamilyMember[] = []
) {
  const [filters, setFilters] = useState<FiltersState>({
    chapters: [],
    people: [],
    tags: [],
    favorites: false,
  });

  const normalizeLabel = useCallback((value: string) => {
    return value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }, []);

  const buildPersonOptions = useMemo<FilterPersonOption[]>(() => {
    if (familyMembers.length > 0) {
      return [...familyMembers]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((member) => ({
          id: member.id,
          name: member.name,
          relation: member.relation,
          avatar: member.avatar,
        }));
    }

    const derivedPeople = new Set<string>();
    moments.forEach((moment) => {
      moment.people?.forEach((person) => {
        derivedPeople.add(person);
      });
    });

    return Array.from(derivedPeople)
      .sort((a, b) => a.localeCompare(b))
      .map((label) => ({
        id: `moment-${normalizeLabel(label)}`,
        name: label,
        isSynthetic: true,
      }));
  }, [familyMembers, moments, normalizeLabel]);

  const personMatchers = useMemo(() => {
    const relationSynonyms = (
      relation?: string,
      option?: FilterPersonOption
    ): string[] => {
      if (!relation) return [];

      const normalizedRelation = normalizeLabel(relation);
      const base: string[] = [relation];

      if (normalizedRelation.includes("mae")) {
        base.push("Mamãe", "Mamae", "Mãe", "Mae");
      }

      if (normalizedRelation.includes("pai")) {
        base.push("Papai", "Pai", "Paizinho");
      }

      if (normalizedRelation.includes("avo")) {
        const isGrandmother = /avó/i.test(relation);
        const isGrandfather = /avô/i.test(relation);
        const isMaternal = normalizedRelation.includes("mater");
        const isPaternal = normalizedRelation.includes("pater");

        if (isGrandmother) {
          base.push("Vovó", "Vovo");
          if (isMaternal) {
            base.push("Vovó Materna", "Vovo Materna");
          }
          if (isPaternal) {
            base.push("Vovó Paterna", "Vovo Paterna");
          }
        }

        if (isGrandfather) {
          base.push("Vovô", "Vovo");
          if (isMaternal) {
            base.push("Vovô Materno", "Vovo Materno");
          }
          if (isPaternal) {
            base.push("Vovô Paterno", "Vovo Paterno");
          }
        }

        if (!isGrandmother && !isGrandfather) {
          base.push("Vovô", "Vovó", "Vovo");
        }
      }

      if (normalizedRelation.includes("tia")) {
        base.push("Tia");
      }

      if (normalizedRelation.includes("tio")) {
        base.push("Tio");
      }

      if (option?.name) {
        base.push(option.name);
      }

      return base;
    };

    return buildPersonOptions.reduce(
      (acc, option) => {
        const tokens = new Set<string>();

        tokens.add(normalizeLabel(option.name));

        option.name
          .split(" ")
          .map((part) => part.trim())
          .filter(Boolean)
          .forEach((part) => tokens.add(normalizeLabel(part)));

        relationSynonyms(option.relation, option).forEach((value) => {
          tokens.add(normalizeLabel(value));
        });

        acc.set(option.id, {
          option,
          tokens: Array.from(tokens),
        });

        return acc;
      },
      new Map<
        string,
        {
          option: FilterPersonOption;
          tokens: string[];
        }
      >()
    );
  }, [buildPersonOptions, normalizeLabel]);

  // Extrair filtros disponíveis dos momentos
  const availableFilters = useMemo((): AvailableFilters => {
    const tags = new Set<string>();
    const types = new Set<string>();

    moments.forEach((moment) => {
      if (moment.tags) {
        moment.tags.forEach((t) => tags.add(t));
      }
      types.add(moment.templateId || "nota");
    });

    return {
      people: buildPersonOptions,
      tags: Array.from(tags).sort(),
      types: Array.from(types).sort(),
      ageRanges: DEFAULT_AGE_RANGES,
    };
  }, [moments, buildPersonOptions]);

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
      result = result.filter((moment) => {
        if (!moment.people?.length) {
          return false;
        }

        const normalizedMomentPeople = moment.people.map((label) =>
          normalizeLabel(label)
        );

        return filters.people.some((personId) => {
          const matcher = personMatchers.get(personId);

          if (!matcher) {
            return normalizedMomentPeople.includes(normalizeLabel(personId));
          }

          return normalizedMomentPeople.some((label) =>
            matcher.tokens.includes(label)
          );
        });
      });
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
  }, [moments, filters, calculateAgeInDays, normalizeLabel, personMatchers]);

  // Ações de filtro
  const toggleChapter = useCallback((chapterId: string) => {
    setFilters((prev) => ({
      ...prev,
      chapters: prev.chapters.includes(chapterId)
        ? prev.chapters.filter((id) => id !== chapterId)
        : [...prev.chapters, chapterId],
    }));
  }, []);

  const togglePerson = useCallback((personId: string) => {
    setFilters((prev) => ({
      ...prev,
      people: prev.people.includes(personId)
        ? prev.people.filter((p) => p !== personId)
        : [...prev.people, personId],
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
