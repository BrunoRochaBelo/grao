// Utilitários para organização e formatação da timeline de momentos

import { Moment, PlaceholderTemplate } from "@/types";

export interface TimelineGroup {
  monthYear: string;
  month: number;
  year: number;
  date: Date;
  moments: Moment[];
}

export interface DayGroup {
  date: string;
  moments: Moment[];
}

/**
 * Agrupa momentos por mês e ano, em ordem decrescente (mais recente primeiro)
 */
export function groupMomentsByMonth(moments: Moment[]): TimelineGroup[] {
  const grouped = new Map<string, Moment[]>();

  // Agrupar por mês/ano
  moments.forEach((moment) => {
    const date = new Date(moment.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(moment);
  });

  // Converter para array e ordenar (mais recente primeiro)
  const result: TimelineGroup[] = Array.from(grouped.entries())
    .map(([key, moments]) => {
      const [year, month] = key.split("-").map(Number);
      const date = new Date(year, month - 1, 1);
      return {
        monthYear: formatMonthYear(date),
        month,
        year,
        date,
        moments: moments.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        ),
      };
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  return result;
}

/**
 * Formata data para exibição no padrão "Outubro 2025"
 */
export function formatMonthYear(date: Date): string {
  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * Formata data curta (ex: "12/10/2025")
 */
export function formatShortDate(dateString: string): string {
  const date = new Date(dateString);
  return `${String(date.getDate()).padStart(2, "0")}/${String(
    date.getMonth() + 1
  ).padStart(2, "0")}/${date.getFullYear()}`;
}

/**
 * Calcula idade formatada baseada em data de nascimento e data do evento
 */
export function calculateAge(birthDate: string, eventDate: string): string {
  const birth = new Date(birthDate);
  const event = new Date(eventDate);

  let days = Math.floor(
    (event.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (days < 0) return "data inválida";

  if (days < 30) return `${days}d`;

  const months = Math.floor(days / 30);
  const remainingDays = days % 30;

  if (months < 12) {
    return remainingDays > 0 ? `${months}m ${remainingDays}d` : `${months}m`;
  }

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (remainingMonths > 0) {
    return `${years}a ${remainingMonths}m`;
  }

  return `${years}a`;
}

/**
 * Retorna o tipo/ícone do momento baseado no template ID ou capítulo
 */
export function getMomentTypeIcon(
  templateId?: string,
  chapterId?: string
): string {
  const typeMap: Record<string, string> = {
    mesversario: "🎂",
    "primeira-vez": "💫",
    consulta: "👨‍⚕️",
    vacina: "💉",
    medida: "📏",
    carta: "✉️",
    nota: "📝",
    evento: "🎉",
    arte: "🎨",
    visita: "👥",
    foto: "📸",
  };

  const chapterIconMap: Record<string, string> = {
    "1": "🌱",
    "2": "🩺",
    "3": "📸",
    "4": "🩺",
    "5": "🎉",
    "6": "🎓",
    "7": "💤",
    "8": "🌙",
  };

  if (templateId) {
    for (const [key, icon] of Object.entries(typeMap)) {
      if (templateId.includes(key)) {
        return icon;
      }
    }
  }

  // Default baseado no capítulo
  if (chapterId && chapterIconMap[chapterId]) {
    return chapterIconMap[chapterId];
  }

  return "📸";
}

/**
 * Extrai primeira linha de texto (máx. 1-2 linhas)
 */
export function getTextPreview(
  text: string | undefined,
  maxChars = 100
): string {
  if (!text) return "";
  const lines = text.split("\n");
  const preview = lines[0].substring(0, maxChars);
  return preview.length < text.length ? `${preview}...` : preview;
}

/**
 * Filtra momentos baseado em critérios
 */
export interface FilterCriteria {
  chapters?: string[];
  types?: string[];
  ageRange?: { min: number; max: number };
  people?: string[];
  tags?: string[];
  isFavorite?: boolean;
}

export function filterMoments(
  moments: Moment[],
  criteria: FilterCriteria,
  birthDate?: string
): Moment[] {
  return moments.filter((moment) => {
    // Filtro de capítulos
    if (
      criteria.chapters &&
      criteria.chapters.length > 0 &&
      !criteria.chapters.includes(moment.chapterId)
    ) {
      return false;
    }

    // Filtro de tags
    if (criteria.tags && criteria.tags.length > 0) {
      if (
        !moment.tags ||
        !moment.tags.some((tag) => criteria.tags!.includes(tag))
      ) {
        return false;
      }
    }

    // Filtro de pessoas
    if (criteria.people && criteria.people.length > 0) {
      if (
        !moment.people ||
        !moment.people.some((person) => criteria.people!.includes(person))
      ) {
        return false;
      }
    }

    // Filtro de intervalo de idade
    if (criteria.ageRange && birthDate) {
      const ageInDays = Math.floor(
        (new Date(moment.date).getTime() - new Date(birthDate).getTime()) /
          (1000 * 60 * 60 * 24)
      );
      const ageInMonths = Math.floor(ageInDays / 30);
      if (
        ageInMonths < criteria.ageRange.min ||
        ageInMonths > criteria.ageRange.max
      ) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Agrupa momentos vazios (placeholders) por tipo para exibição
 */
export function groupPlaceholdersByType(
  placeholders: PlaceholderTemplate[]
): Record<string, PlaceholderTemplate[]> {
  const grouped: Record<string, PlaceholderTemplate[]> = {};

  placeholders.forEach((placeholder) => {
    if (!grouped[placeholder.templateType]) {
      grouped[placeholder.templateType] = [];
    }
    grouped[placeholder.templateType].push(placeholder);
  });

  return grouped;
}

/**
 * Detecta se é um momento "série" (Mêsversário)
 */
export function isSeriesMoment(templateId?: string): boolean {
  return templateId?.includes("mesversario") ?? false;
}
