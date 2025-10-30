// Search synonyms utility for Portuguese baby book terms
import type { SynonymMap } from "@/types";

export const SYNONYMS: SynonymMap = {
  // Família / Parentesco
  vovó: ["vo", "vovo", "avó", "avo", "vozinha"],
  vovô: ["vô", "vo", "avô", "avo", "vozinh"],
  madrinha: ["dinda"],
  padrinho: ["dindo"],
  mãe: ["mamãe", "mamae", "mamãe"],
  pai: ["papai", "painho"],
  titia: ["tia"],
  dindo: ["padrinho"],
  avó: ["vovó", "vo", "vovo", "avo", "vozinha"],
  avô: ["vovô", "vô", "vo", "vozinh"],

  // Datas e celebrações
  mesversario: ["mêsversario", "mesversário", "mêsversário", "mesversary"],
  aniversario: ["aniversário", "niver", "bday"],
  "festa junina": ["sao joao", "são joão"],
  carnaval: ["matinê"],
  batizado: ["crisma"],
  crisma: ["batizado"],

  // Saúde / SUS
  pediatra: ["médico infantil", "medica infantil", "pediatria"],
  vacina: ["vacinação", "imunização", "imunizacao", "vacinaçao"],
  "cartão de vacina": ["caderneta", "carteirinha de vacina"],
  consulta: ["acompanhamento", "puericultura"],
  medida: ["crescimento", "peso e altura"],
  dentista: ["odontopediatra", "odonto infantil"],

  // Desenvolvimento / Primeiras vezes
  "primeiro dente": ["dentinho"],
  "primeiro passo": ["andou", "andou sozinho"],
  "primeira palavra": ["falou", "falou primeiro"],
  engatinhar: ["gatinhar"],
  "primeira comida": ["introdução alimentar", "papinha"],
  "primeiro banho": ["banhozinho"],

  // Escola / Social
  creche: ["berçario", "berçário"],
  escolinha: ["escola"],
  amiguinho: ["amigo", "colega"],
  "evento escolar": ["festa da escola", "apresentação"],

  // Arte / Produção
  rabisco: ["desenho", "doodle"],
  "pintura de dedo": ["pintura com dedos", "pintura a dedo"],
  "arte da escola": ["produção escolar"],

  // Notas / Diário
  nota: ["anotação", "lembrete"],
  diario: ["relato", "registro"],
  pensamento: ["reflexão"],
};

/**
 * Normalize text for search: lowercase, remove accents, trim
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .trim();
}

/**
 * Expand query with synonyms
 * Example: "mesversario 6" -> ["mesversario", "mêsversario", "mesversário", "mesversary", "6"]
 */
export function expandWithSynonyms(query: string): string[] {
  const words = query.split(/\s+/).filter((word) => word.length > 0);
  const expanded: string[] = [];

  words.forEach((word) => {
    const normalized = normalizeText(word);
    expanded.push(normalized);

    // Add synonyms if they exist
    Object.entries(SYNONYMS).forEach(([key, synonyms]) => {
      if (normalizeText(key) === normalized) {
        synonyms.forEach((synonym) => {
          if (!expanded.includes(normalizeText(synonym))) {
            expanded.push(normalizeText(synonym));
          }
        });
      }
    });
  });

  return expanded;
}

/**
 * Check if text matches any of the search terms (with synonyms)
 */
export function matchesSearchTerms(
  text: string,
  searchTerms: string[]
): boolean {
  const normalizedText = normalizeText(text);
  return searchTerms.some(
    (term) => normalizedText.includes(term) || term.includes(normalizedText) // Also check reverse for partial matches
  );
}

/**
 * Highlight matching text in a string
 */
export function highlightText(text: string, searchTerms: string[]): string {
  if (!searchTerms.length) return text;

  let highlighted = text;
  searchTerms.forEach((term) => {
    const regex = new RegExp(`(${term})`, "gi");
    highlighted = highlighted.replace(regex, "**$1**");
  });

  return highlighted;
}
