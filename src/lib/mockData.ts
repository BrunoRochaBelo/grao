// Mock data for Baby Book app
import {
  Baby,
  Chapter,
  FamilyMember,
  GrowthMeasurement,
  Moment,
  PlaceholderTemplate,
  SleepHumorEntry,
  SleepRecord,
  VaccineRecord,
} from "../types";
import {
  catalogChapters,
  filterPlaceholdersByAge,
  getCatalogPlaceholders,
  type PlaceholderQueryOptions,
} from "./catalog";

// Store current baby selection
export const babies: Baby[] = [
  {
    id: "1",
    name: "Aurora",
    birthDate: "2024-03-17",
    city: "S├úo Paulo, SP",
    avatar:
      "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop",
    gender: "female",
    isActive: true,
  },
  {
    id: "2",
    name: "Miguel",
    birthDate: "2023-08-22",
    city: "Rio de Janeiro, RJ",
    avatar:
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=400&fit=crop",
    gender: "male",
    isActive: false,
  },
];

export function getCurrentBaby(): Baby {
  return babies.find((b) => b.isActive) || babies[0];
}

export function setCurrentBaby(babyId: string): void {
  babies.forEach((b) => (b.isActive = b.id === babyId));
  if (typeof window !== "undefined") {
    localStorage.setItem("babybook_current_baby", babyId);
  }
}

export function initializeCurrentBaby(): void {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("babybook_current_baby");
    if (stored) {
    }
  }
}

export const currentBaby = getCurrentBaby();

// Helper to get baby age in days
export function getBabyAgeInDays(birthDate: string): number {
  const birth = new Date(birthDate);
  const now = new Date();
  return Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
}

// Initial moments - will be stored in localStorage
let storedMoments: Moment[] = [];

const initialMoments: Moment[] = [
  {
    id: "1",
    chapterId: "1",
    templateId: "gestacao-nascimento",
    title: "O Grande Dia",
    date: "2024-03-17T08:30:00",
    age: "0 dias",
    location: "Hospital S├úo Luiz",
    people: ["Mam├úe", "Papai"],
    media: [
      "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&h=600&fit=crop",
    ],
    noteShort: "Aurora nasceu ├ás 8h30",
    noteLong:
      "Aurora nasceu ├ás 8h30, pesando 3.2kg e 49cm. Foi um parto ces├írea tranquilo. Est├í tudo bem com m├úe e beb├¬. O momento mais especial das nossas vidas!",
    tags: ["nascimento", "hospital"],
    privacy: "private",
    status: "published",
    extraData: { weight: 3.2, height: 49 },
  },
  {
    id: "2",
    chapterId: "1",
    templateId: "gestacao-chegada-casa",
    title: "Chegada em Casa",
    date: "2024-03-19T14:00:00",
    age: "2 dias",
    location: "Nossa Casa",
    people: ["Mam├úe", "Papai", "Vov├│"],
    media: [
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&h=600&fit=crop",
    ],
    noteShort: "Primeiro dia no nosso lar",
    noteLong:
      "Finalmente em casa! A vov├│ preparou tudo com muito carinho. Aurora conheceu seu quartinho e dormiu tranquila.",
    tags: ["casa", "fam├¡lia"],
    privacy: "private",
    status: "published",
  },
  {
    id: "3",
    chapterId: "3",
    templateId: "primeiras-primeiro-sorriso",
    title: "Primeiro Sorriso",
    date: "2024-04-20T10:15:00",
    age: "1 m├¬s e 3 dias",
    media: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=600&fit=crop",
    ],
    noteShort: "O sorriso mais lindo do mundo!",
    noteLong:
      "Hoje a Aurora nos deu o primeiro sorriso social! Foi durante a troca de fralda, quando o papai fez uma careta engra├ºada. Nossos cora├º├Áes derreteram!",
    tags: ["marco", "alegria", "desenvolvimento"],
    privacy: "private",
    status: "published",
  },
  {
    id: "4",
    chapterId: "4",
    templateId: "vacina-bcg",
    title: "Primeira Vacina - BCG",
    date: "2024-03-18T09:00:00",
    age: "1 dia",
    location: "Hospital S├úo Luiz",
    people: ["Mam├úe", "Papai"],
    media: [
      "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=800&h=600&fit=crop",
    ],
    noteShort: "Primeira dose aplicada com sucesso",
    noteLong:
      "BCG aplicada ainda na maternidade. Aurora foi muito corajosa, chorou s├│ um pouquinho.",
    tags: ["sa├║de", "vacina", "BCG"],
    privacy: "private",
    status: "published",
    extraData: { vaccineName: "BCG", dose: "1┬¬ dose", lot: "BCG123456" },
  },
  {
    id: "5",
    chapterId: "6",
    templateId: "mesversario-01",
    title: "1┬║ M├¬svers├írio",
    date: "2024-04-17T00:00:00",
    age: "1 m├¬s",
    media: [
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&h=600&fit=crop",
    ],
    noteShort: "Um m├¬s de muito amor",
    noteLong:
      "Completou 1 m├¬s de vida! J├í cresceu tanto, est├í com 3.8kg e 52cm. A cada dia nos apaixonamos mais.",
    tags: ["m├¬svers├írio", "celebra├º├úo"],
    privacy: "private",
    status: "published",
    extraData: {
      weight: 3.8,
      height: 52,
      milestone: "Sorriso social come├ºando",
    },
  },
  {
    id: "6",
    chapterId: "6",
    templateId: "mesversario-02",
    title: "2┬║ M├¬svers├írio",
    date: "2024-05-17T00:00:00",
    age: "2 meses",
    media: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop",
    ],
    noteShort: "Dois meses de pura felicidade",
    noteLong:
      "J├í s├úo 2 meses! Aurora est├í mais interativa, acompanha com os olhos e adora conversar com a gente. Pesando 4.5kg e 55cm.",
    tags: ["m├¬svers├írio", "celebra├º├úo", "desenvolvimento"],
    privacy: "private",
    status: "published",
    extraData: { weight: 4.5, height: 55, milestone: "Segura a cabe├ºa" },
  },
];

const buildChapterSummaries = (moments: Moment[]): Chapter[] => {
  const momentsByChapter = new Map<string, Moment[]>();
  moments.forEach((moment) => {
    const existing = momentsByChapter.get(moment.chapterId);
    if (existing) {
      existing.push(moment);
    } else {
      momentsByChapter.set(moment.chapterId, [moment]);
    }
  });

  return catalogChapters.map((chapter) => {
    const placeholders = getCatalogPlaceholders(chapter.id);
    const completedTemplates = new Set(
      (momentsByChapter.get(chapter.id) ?? [])
        .map((moment) => moment.templateId)
        .filter((id): id is string => Boolean(id))
    );

    return {
      id: chapter.id,
      name: chapter.name,
      description: chapter.description,
      objective: chapter.objective,
      viewer: chapter.viewer,
      icon: chapter.icon,
      color: chapter.color,
      total: placeholders.length,
      completed: completedTemplates.size,
    };
  });
};

export let chapters: Chapter[] = buildChapterSummaries(initialMoments);

const syncChapterSummaries = () => {
  chapters = buildChapterSummaries(storedMoments);
};

export const getChapters = (): Chapter[] => chapters;

// Initialize from localStorage or use initial data
export function initializeMoments(): Moment[] {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("babybook_moments");
    if (stored) {
      storedMoments = JSON.parse(stored);
      syncChapterSummaries();
      return storedMoments;
    }
  }
  storedMoments = [...initialMoments];
  saveMomentsToStorage();
  syncChapterSummaries();
  return storedMoments;
}

export function getMoments(): Moment[] {
  if (storedMoments.length === 0) {
    return initializeMoments();
  }
  return storedMoments;
}

export function addMoment(moment: Omit<Moment, "id">): Moment {
  const newMoment: Moment = {
    ...moment,
    id: `moment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  };
  storedMoments.push(newMoment);
  saveMomentsToStorage();
  syncChapterSummaries();
  return newMoment;
}

export function updateMoment(
  id: string,
  updates: Partial<Moment>
): Moment | null {
  const index = storedMoments.findIndex((m) => m.id === id);
  if (index === -1) return null;

  storedMoments[index] = { ...storedMoments[index], ...updates };
  saveMomentsToStorage();
  syncChapterSummaries();
  return storedMoments[index];
}

export function deleteMoment(id: string): boolean {
  const index = storedMoments.findIndex((m) => m.id === id);
  if (index === -1) return false;

  storedMoments.splice(index, 1);
  saveMomentsToStorage();
  syncChapterSummaries();
  return true;
}

function saveMomentsToStorage(): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("babybook_moments", JSON.stringify(storedMoments));
  }
}

export const moments = getMoments();

// Growth measurements data
const growthMeasurements: GrowthMeasurement[] = [
  {
    id: "g1",
    date: "2024-03-17",
    age: "0 dias",
    weight: 3.2,
    height: 49,
    headCircumference: 35,
    notes: "Nascimento",
  },
  {
    id: "g2",
    date: "2024-04-17",
    age: "1 m├¬s",
    weight: 3.8,
    height: 52,
    headCircumference: 36.5,
  },
  {
    id: "g3",
    date: "2024-05-17",
    age: "2 meses",
    weight: 4.5,
    height: 55,
    headCircumference: 38,
  },
  {
    id: "g4",
    date: "2024-06-17",
    age: "3 meses",
    weight: 5.2,
    height: 58,
    headCircumference: 39.5,
  },
  {
    id: "g5",
    date: "2024-07-17",
    age: "4 meses",
    weight: 5.8,
    height: 61,
    headCircumference: 40.5,
  },
  {
    id: "g6",
    date: "2024-08-17",
    age: "5 meses",
    weight: 6.4,
    height: 64,
    headCircumference: 41.5,
  },
  {
    id: "g7",
    date: "2024-09-17",
    age: "6 meses",
    weight: 7.0,
    height: 66,
    headCircumference: 42.5,
  },
  {
    id: "g8",
    date: "2024-10-17",
    age: "7 meses",
    weight: 7.6,
    height: 68,
    headCircumference: 43.2,
  },
];

export function getGrowthMeasurements(): GrowthMeasurement[] {
  return growthMeasurements;
}

export function addGrowthMeasurement(
  measurement: Omit<GrowthMeasurement, "id">
): GrowthMeasurement {
  const newMeasurement: GrowthMeasurement = {
    ...measurement,
    id: `g-${Date.now()}`,
  };
  growthMeasurements.push(newMeasurement);
  return newMeasurement;
}

// Vaccine records data
const vaccines: VaccineRecord[] = [
  {
    id: "v1",
    name: "BCG",
    date: "2024-03-18",
    ageRecommended: 0,
    dose: "Dose ├║nica",
    status: "completed",
    lot: "BCG123456",
  },
  {
    id: "v2",
    name: "Hepatite B",
    date: "2024-03-18",
    ageRecommended: 0,
    dose: "1┬¬ dose",
    status: "completed",
  },
  {
    id: "v3",
    name: "Pentavalente",
    date: "2024-05-17",
    ageRecommended: 60,
    dose: "1┬¬ dose",
    status: "completed",
  },
  {
    id: "v4",
    name: "VIP (Poliomielite)",
    date: "2024-05-17",
    ageRecommended: 60,
    dose: "1┬¬ dose",
    status: "completed",
  },
  {
    id: "v5",
    name: "Rotav├¡rus",
    date: "2024-05-17",
    ageRecommended: 60,
    dose: "1┬¬ dose",
    status: "completed",
  },
  {
    id: "v6",
    name: "Pentavalente",
    date: "2024-07-17",
    ageRecommended: 120,
    dose: "2┬¬ dose",
    status: "completed",
  },
  {
    id: "v7",
    name: "VIP (Poliomielite)",
    date: "2024-07-17",
    ageRecommended: 120,
    dose: "2┬¬ dose",
    status: "completed",
  },
  {
    id: "v8",
    name: "Rotav├¡rus",
    date: "2024-07-17",
    ageRecommended: 120,
    dose: "2┬¬ dose",
    status: "completed",
  },
  {
    id: "v9",
    name: "Pentavalente",
    ageRecommended: 180,
    dose: "3┬¬ dose",
    status: "pending",
  },
  {
    id: "v10",
    name: "VIP (Poliomielite)",
    ageRecommended: 180,
    dose: "3┬¬ dose",
    status: "pending",
  },
  {
    id: "v11",
    name: "Meningoc├│cica C",
    ageRecommended: 90,
    dose: "1┬¬ dose",
    status: "pending",
  },
  {
    id: "v12",
    name: "Pneumoc├│cica 10",
    ageRecommended: 60,
    dose: "1┬¬ dose",
    status: "pending",
  },
];

export function getVaccines(): VaccineRecord[] {
  return vaccines;
}

export function addVaccine(vaccine: Omit<VaccineRecord, "id">): VaccineRecord {
  const newVaccine: VaccineRecord = {
    ...vaccine,
    id: `v-${Date.now()}`,
  };
  vaccines.push(newVaccine);
  return newVaccine;
}

export function updateVaccine(
  id: string,
  updates: Partial<VaccineRecord>
): VaccineRecord | null {
  const index = vaccines.findIndex((v) => v.id === id);
  if (index === -1) return null;
  vaccines[index] = { ...vaccines[index], ...updates };
  return vaccines[index];
}

// Sleep & Humor data
const sleepHumorEntries: SleepHumorEntry[] = [
  {
    id: "s1",
    date: "2024-10-15",
    sleepHours: 11,
    sleepQuality: "excellent",
    mood: "happy",
  },
  {
    id: "s2",
    date: "2024-10-16",
    sleepHours: 9.5,
    sleepQuality: "good",
    mood: "calm",
  },
  {
    id: "s3",
    date: "2024-10-17",
    sleepHours: 8,
    sleepQuality: "fair",
    mood: "fussy",
  },
  {
    id: "s4",
    date: "2024-10-18",
    sleepHours: 10,
    sleepQuality: "good",
    mood: "happy",
  },
  {
    id: "s5",
    date: "2024-10-19",
    sleepHours: 11.5,
    sleepQuality: "excellent",
    mood: "sleepy",
  },
  {
    id: "s6",
    date: "2024-10-20",
    sleepHours: 10.5,
    sleepQuality: "excellent",
    mood: "happy",
  },
  {
    id: "s7",
    date: "2024-10-21",
    sleepHours: 9,
    sleepQuality: "good",
    mood: "calm",
  },
];

export function getSleepHumorEntries(): SleepHumorEntry[] {
  return sleepHumorEntries;
}

export function addSleepHumorEntry(
  entry: Omit<SleepHumorEntry, "id">
): SleepHumorEntry {
  const newEntry: SleepHumorEntry = {
    ...entry,
    id: `s-${Date.now()}`,
  };
  sleepHumorEntries.push(newEntry);
  return newEntry;
}

// Sleep records data (new format)
const sleepRecords: SleepRecord[] = [
  { id: "sr1", date: "2024-10-15", type: "sleep", duration: 11, mood: "feliz" },
  {
    id: "sr2",
    date: "2024-10-16",
    type: "sleep",
    duration: 9.5,
    mood: "calmo",
  },
  {
    id: "sr3",
    date: "2024-10-16",
    type: "nap",
    duration: 2,
    mood: "calmo",
    notes: "Soneca da tarde",
  },
  {
    id: "sr4",
    date: "2024-10-17",
    type: "sleep",
    duration: 8,
    mood: "irritado",
  },
  { id: "sr5", date: "2024-10-18", type: "sleep", duration: 10, mood: "feliz" },
  {
    id: "sr6",
    date: "2024-10-19",
    type: "sleep",
    duration: 11.5,
    mood: "calmo",
  },
  {
    id: "sr7",
    date: "2024-10-20",
    type: "sleep",
    duration: 10.5,
    mood: "feliz",
  },
  { id: "sr8", date: "2024-10-21", type: "sleep", duration: 9, mood: "calmo" },
];

export function getSleepRecords(): SleepRecord[] {
  return sleepRecords;
}

export function addSleepRecord(record: Omit<SleepRecord, "id">): SleepRecord {
  const newRecord: SleepRecord = {
    ...record,
    id: `sr-${Date.now()}`,
  };
  sleepRecords.push(newRecord);
  return newRecord;
}

// Family members data
const familyMembers: FamilyMember[] = [
  {
    id: "f1",
    name: "Maria Silva",
    relation: "M├úe",
    birthDate: "1990-05-15",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
  },
  {
    id: "f2",
    name: "Jo├úo Silva",
    relation: "Pai",
    birthDate: "1988-03-22",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
  },
  {
    id: "f3",
    name: "Ana Santos",
    relation: "Av├│ Materna",
    birthDate: "1965-08-10",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    parentId: "f1",
  },
  {
    id: "f4",
    name: "Carlos Santos",
    relation: "Av├┤ Materno",
    birthDate: "1963-11-30",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    parentId: "f1",
  },
  {
    id: "f5",
    name: "Helena Silva",
    relation: "Av├│ Paterna",
    birthDate: "1967-02-18",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop",
    parentId: "f2",
  },
  {
    id: "f6",
    name: "Pedro Silva",
    relation: "Av├┤ Paterno",
    birthDate: "1965-07-25",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    parentId: "f2",
  },
];

export function getFamilyMembers(): FamilyMember[] {
  return familyMembers;
}

export function addFamilyMember(
  member: Omit<FamilyMember, "id">
): FamilyMember {
  const newMember: FamilyMember = {
    ...member,
    id: `f-${Date.now()}`,
  };
  familyMembers.push(newMember);
  return newMember;
}

// Calculate age from birth date to a specific date
export function calculateAge(birthDate: string, targetDate?: string): string {
  const birth = new Date(birthDate);
  const target = targetDate ? new Date(targetDate) : new Date();

  const totalDays = Math.floor(
    (target.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (totalDays < 0) {
    return "Data inv├ílida";
  }

  if (totalDays === 0) {
    return "0 dias";
  }

  const months = Math.floor(totalDays / 30);
  const days = totalDays % 30;

  if (months === 0) {
    return `${days} ${days === 1 ? "dia" : "dias"}`;
  }

  return `${months} ${months === 1 ? "m├¬s" : "meses"} e ${days} ${
    days === 1 ? "dia" : "dias"
  }`;
}

// Get age in months for milestone tracking
export function getAgeInMonths(birthDate: string, targetDate?: string): number {
  const birth = new Date(birthDate);
  const target = targetDate ? new Date(targetDate) : new Date();

  let months = (target.getFullYear() - birth.getFullYear()) * 12;
  months -= birth.getMonth();
  months += target.getMonth();

  return Math.max(0, months);
}

// Generate or get existing series ID for recurring moments
export function generateSeriesId(
  templateId: string,
  chapterId: string
): string {
  const existingSeries = getMoments().find(
    (m) => m.templateId === templateId && m.seriesId
  );

  if (existingSeries?.seriesId) {
    return existingSeries.seriesId;
  }

  // Generate new series ID
  return `series-${templateId}-${chapterId}-${Date.now()}`;
}

export function getPlaceholdersForChapter(
  chapterId: string,
  babyAgeInDays: number = 0,
  options?: PlaceholderQueryOptions
): PlaceholderTemplate[] {
  const baseTemplates = getCatalogPlaceholders(chapterId).map((template) => ({
    ...template,
  }));

  const filteredByAge = options?.includeAllAges
    ? baseTemplates
    : filterPlaceholdersByAge(baseTemplates, babyAgeInDays);

  const relevantMoments = getMoments().filter(
    (moment) => moment.chapterId === chapterId
  );

  const completedTemplateIds = new Set(
    relevantMoments
      .map((moment) => moment.templateId)
      .filter((id): id is string => Boolean(id))
  );

  const templateMomentMap = new Map<string, string>();
  relevantMoments.forEach((moment) => {
    if (moment.templateId) {
      templateMomentMap.set(moment.templateId, moment.id);
    }
  });

  return filteredByAge.map((template) => ({
    ...template,
    isCompleted: completedTemplateIds.has(template.id),
    momentId: templateMomentMap.get(template.id),
  }));
}

export function getSeriesInfo(templateId: string, chapterId: string) {
  const moments = getMoments();
  const seriesMoments = moments.filter(
    (moment) => moment.templateId === templateId && moment.seriesId
  );
  const placeholders = getPlaceholdersForChapter(chapterId, 0, {
    includeAllAges: true,
  });
  const template = placeholders.find((item) => item.id === templateId);

  if (!template?.allowMultiple) {
    return null;
  }

  const seriesId = seriesMoments.length > 0 ? seriesMoments[0].seriesId : null;
  const completed = seriesMoments.filter(
    (moment) => moment.status === "published"
  ).length;

  return {
    seriesId,
    templateId,
    templateName: template.name,
    completed,
    total: seriesMoments.length,
    moments: seriesMoments.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    ),
  };
}

// Generate placeholders based on baby's age
export function getChapterSeries(chapterId: string) {
  const placeholders = getPlaceholdersForChapter(chapterId, 0);
  const seriesTemplates = placeholders.filter((p) => p.allowMultiple);

  return seriesTemplates
    .map((template) => getSeriesInfo(template.id, chapterId))
    .filter(Boolean);
}

// ==================== Search Functions ====================

import {
  expandWithSynonyms,
  matchesSearchTerms,
  highlightText,
} from "../utils/searchSynonyms";
import type {
  SearchResult,
  SearchChapterResult,
  SearchMomentResult,
  SearchFilters,
} from "../types";

/**
 * Search chapters && moments with unified query
 */
export function searchChaptersAndMoments(
  query: string,
  filters: SearchFilters = {}
): SearchResult {
  const searchTerms = expandWithSynonyms(query);
  const results: SearchChapterResult[] = [];
  const allChapters = chapters;
  const allMoments = getMoments();

  // Search through chapters
  allChapters.forEach((chapter) => {
    const chapterMoments: SearchMomentResult[] = [];
    const placeholders = getPlaceholdersForChapter(chapter.id, 0);

    // Check if chapter matches
    const chapterMatches = matchesSearchTerms(
      `${chapter.name} ${chapter.description}`,
      searchTerms
    );

    // Search moments in this chapter
    allMoments
      .filter((moment) => moment.chapterId === chapter.id)
      .forEach((moment) => {
        const momentText = [
          moment.title,
          moment.noteShort || "",
          moment.noteLong || "",
          moment.location || "",
          moment.tags?.join(" ") || "",
          moment.people?.join(" ") || "",
        ].join(" ");

        if (matchesSearchTerms(momentText, searchTerms)) {
          const template = placeholders.find((p) => p.id === moment.templateId);
          const isSuggested = !moment.id; // If no ID, it's a suggested template

          chapterMoments.push({
            id: moment.id,
            title: moment.title,
            status: moment.status,
            date: moment.date,
            age: moment.age,
            kind: isSuggested ? "suggested" : "published",
            type: template?.templateType || "outro",
            templateId: moment.templateId,
            seriesId: moment.seriesId,
            highlightedTitle: highlightText(moment.title, searchTerms),
            chapterId: chapter.id,
          });
        }
      });

    // Search suggested templates (placeholders without moments)
    placeholders.forEach((placeholder) => {
      const hasMoment = allMoments.some(
        (m) => m.templateId === placeholder.id && m.chapterId === chapter.id
      );

      if (!hasMoment) {
        const templateText = `${placeholder.name} ${placeholder.description}`;

        if (matchesSearchTerms(templateText, searchTerms)) {
          chapterMoments.push({
            id: `suggested-${placeholder.id}`,
            title: placeholder.name,
            status: "draft", // Suggested are always pending
            date: "", // No date yet
            age: "", // No age yet
            kind: "suggested",
            type: placeholder.templateType,
            templateId: placeholder.id,
            highlightedTitle: highlightText(placeholder.name, searchTerms),
            chapterId: chapter.id,
          });
        }
      }
    });

    // Apply filters
    let filteredMoments = chapterMoments;

    if (filters.pending) {
      filteredMoments = filteredMoments.filter(
        (m) => m.status === "draft" || m.kind === "suggested"
      );
    }

    if (filters.series) {
      filteredMoments = filteredMoments.filter((m) => m.seriesId);
    }

    if (filters.recent) {
      // Sort by date (most recent first), put suggested at end
      filteredMoments.sort((a, b) => {
        if (a.kind === "suggested" && b.kind !== "suggested") return 1;
        if (b.kind === "suggested" && a.kind !== "suggested") return -1;

        if (a.date && b.date) {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        return 0;
      });
    }

    // Only include chapter if it has matches or chapter itself matches
    if (chapterMatches || filteredMoments.length > 0) {
      const chapterSeries = getChapterSeries(chapter.id);
      const hasSeries = chapterSeries.length > 0;

      results.push({
        chapterId: chapter.id,
        chapterName: chapter.name,
        chapterIcon: chapter.icon,
        chapterColor: chapter.color,
        resultsCount: filteredMoments.length,
        moments: filteredMoments,
        hasSeries,
        lastUpdatedAt:
          chapterSeries.length > 0
            ? chapterSeries[0]?.moments?.[0]?.date
            : undefined,
      });
    }
  });

  // Sort results by relevance (chapters with more matches first)
  results.sort((a, b) => b.resultsCount - a.resultsCount);

  // If recent filter, sort chapters by last update
  if (filters.recent) {
    results.sort((a, b) => {
      if (a.lastUpdatedAt && b.lastUpdatedAt) {
        return (
          new Date(b.lastUpdatedAt).getTime() -
          new Date(a.lastUpdatedAt).getTime()
        );
      }
      if (a.lastUpdatedAt) return -1;
      if (b.lastUpdatedAt) return 1;
      return 0;
    });
  }

  const totalResults = results.reduce((sum, r) => sum + r.resultsCount, 0);

  return {
    query,
    filters,
    results,
    totalResults,
    hasMore: false, // For now, no pagination
  };
}

