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

// Store current baby selection
let currentBabyId = "1";

export const babies: Baby[] = [
  {
    id: "1",
    name: "Aurora",
    birthDate: "2024-03-17",
    city: "São Paulo, SP",
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
      currentBabyId = stored;
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

export const chapters: Chapter[] = [
  {
    id: "1",
    name: "Gestação & Chegada",
    description: "Da espera até o grande dia",
    icon: "🌱",
    color: "#A7F3D0",
    total: 7,
    completed: 5,
  },
  {
    id: "2",
    name: "Triagens do RN & Registros",
    description: "Exames e documentação neonatal",
    icon: "🩺",
    color: "#FED7D7",
    total: 6,
    completed: 0,
  },
  {
    id: "3",
    name: "Primeiras Vezes & Descobertas",
    description: "Todas as estreias especiais",
    icon: "💫",
    color: "#FDE68A",
    total: 12,
    completed: 3,
  },
  {
    id: "4",
    name: "Saúde & Crescimento",
    description: "Acompanhamento e cuidados",
    icon: "📏",
    color: "#BFDBFE",
    total: 15,
    completed: 6,
  },
  {
    id: "5",
    name: "Família & Visitas",
    description: "Vínculos e encontros",
    icon: "👨‍👩‍👧",
    color: "#FBCFE8",
    total: 6,
    completed: 4,
  },
  {
    id: "6",
    name: "Mêsversários & Resumos",
    description: "Cada mês é uma conquista",
    icon: "🎂",
    color: "#DDD6FE",
    total: 24,
    completed: 7,
  },
  {
    id: "7",
    name: "Cartas & Cápsulas do Tempo",
    description: "Mensagens para o futuro",
    icon: "✉️",
    color: "#FECACA",
    total: 6,
    completed: 1,
  },
  {
    id: "8",
    name: "Arte & Desenhos",
    description: "Expressão criativa",
    icon: "🎨",
    color: "#C7D2FE",
    total: 5,
    completed: 0,
  },
  {
    id: "9",
    name: "Datas Especiais",
    description: "Momentos marcantes",
    icon: "🎉",
    color: "#FDE2E2",
    total: 5,
    completed: 0,
  },
  {
    id: "10",
    name: "Pensamentos & Observações",
    description: "Reflexões e lembretes",
    icon: "💭",
    color: "#E0E7FF",
    total: 4,
    completed: 0,
  },
  {
    id: "11",
    name: "Escola & Aprendizados",
    description: "Primeiras experiências educacionais",
    icon: "📚",
    color: "#D1FAE5",
    total: 5,
    completed: 0,
  },
  {
    id: "12",
    name: "Capítulos Custom",
    description: "Momentos personalizados",
    icon: "⭐",
    color: "#FEF3C7",
    total: 0,
    completed: 0,
  },
];

// Initial moments - will be stored in localStorage
let storedMoments: Moment[] = [];

const initialMoments: Moment[] = [
  {
    id: "1",
    chapterId: "1",
    templateId: "p1-3",
    title: "O Grande Dia",
    date: "2024-03-17T08:30:00",
    age: "0 dias",
    location: "Hospital São Luiz",
    people: ["Mamãe", "Papai"],
    media: [
      "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&h=600&fit=crop",
    ],
    noteShort: "Aurora nasceu às 8h30",
    noteLong:
      "Aurora nasceu às 8h30, pesando 3.2kg e 49cm. Foi um parto cesárea tranquilo. Está tudo bem com mãe e bebê. O momento mais especial das nossas vidas!",
    tags: ["nascimento", "hospital"],
    privacy: "private",
    status: "published",
    extraData: { weight: 3.2, height: 49 },
  },
  {
    id: "2",
    chapterId: "1",
    templateId: "p1-4",
    title: "Chegada em Casa",
    date: "2024-03-19T14:00:00",
    age: "2 dias",
    location: "Nossa Casa",
    people: ["Mamãe", "Papai", "Vovó"],
    media: [
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&h=600&fit=crop",
    ],
    noteShort: "Primeiro dia no nosso lar",
    noteLong:
      "Finalmente em casa! A vovó preparou tudo com muito carinho. Aurora conheceu seu quartinho e dormiu tranquila.",
    tags: ["casa", "família"],
    privacy: "private",
    status: "published",
  },
  {
    id: "3",
    chapterId: "2",
    templateId: "p2-2",
    title: "Primeiro Sorriso",
    date: "2024-04-20T10:15:00",
    age: "1 mês e 3 dias",
    media: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=600&fit=crop",
    ],
    noteShort: "O sorriso mais lindo do mundo!",
    noteLong:
      "Hoje a Aurora nos deu o primeiro sorriso social! Foi durante a troca de fralda, quando o papai fez uma careta engraçada. Nossos corações derreteram!",
    tags: ["marco", "alegria", "desenvolvimento"],
    privacy: "private",
    status: "published",
  },
  {
    id: "4",
    chapterId: "3",
    templateId: "p3-2",
    title: "Primeira Vacina - BCG",
    date: "2024-03-18T09:00:00",
    age: "1 dia",
    location: "Hospital São Luiz",
    people: ["Mamãe", "Papai"],
    media: [
      "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=800&h=600&fit=crop",
    ],
    noteShort: "Primeira dose aplicada com sucesso",
    noteLong:
      "BCG aplicada ainda na maternidade. Aurora foi muito corajosa, chorou só um pouquinho.",
    tags: ["saúde", "vacina", "BCG"],
    privacy: "private",
    status: "published",
    extraData: { vaccineName: "BCG", dose: "1ª dose", lot: "BCG123456" },
  },
  {
    id: "5",
    chapterId: "5",
    templateId: "p5-1",
    title: "1º Mêsversário",
    date: "2024-04-17T00:00:00",
    age: "1 mês",
    media: [
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&h=600&fit=crop",
    ],
    noteShort: "Um mês de muito amor",
    noteLong:
      "Completou 1 mês de vida! Já cresceu tanto, está com 3.8kg e 52cm. A cada dia nos apaixonamos mais.",
    tags: ["mêsversário", "celebração"],
    privacy: "private",
    status: "published",
    extraData: {
      weight: 3.8,
      height: 52,
      milestone: "Sorriso social começando",
    },
  },
  {
    id: "6",
    chapterId: "5",
    templateId: "p5-2",
    title: "2º Mêsversário",
    date: "2024-05-17T00:00:00",
    age: "2 meses",
    media: [
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop",
    ],
    noteShort: "Dois meses de pura felicidade",
    noteLong:
      "Já são 2 meses! Aurora está mais interativa, acompanha com os olhos e adora conversar com a gente. Pesando 4.5kg e 55cm.",
    tags: ["mêsversário", "celebração", "desenvolvimento"],
    privacy: "private",
    status: "published",
    extraData: { weight: 4.5, height: 55, milestone: "Segura a cabeça" },
  },
];

// Initialize from localStorage or use initial data
export function initializeMoments(): Moment[] {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("babybook_moments");
    if (stored) {
      storedMoments = JSON.parse(stored);
      return storedMoments;
    }
  }
  storedMoments = [...initialMoments];
  saveMomentsToStorage();
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
  return storedMoments[index];
}

export function deleteMoment(id: string): boolean {
  const index = storedMoments.findIndex((m) => m.id === id);
  if (index === -1) return false;

  storedMoments.splice(index, 1);
  saveMomentsToStorage();
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
    age: "1 mês",
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
    dose: "Dose única",
    status: "completed",
    lot: "BCG123456",
  },
  {
    id: "v2",
    name: "Hepatite B",
    date: "2024-03-18",
    ageRecommended: 0,
    dose: "1ª dose",
    status: "completed",
  },
  {
    id: "v3",
    name: "Pentavalente",
    date: "2024-05-17",
    ageRecommended: 60,
    dose: "1ª dose",
    status: "completed",
  },
  {
    id: "v4",
    name: "VIP (Poliomielite)",
    date: "2024-05-17",
    ageRecommended: 60,
    dose: "1ª dose",
    status: "completed",
  },
  {
    id: "v5",
    name: "Rotavírus",
    date: "2024-05-17",
    ageRecommended: 60,
    dose: "1ª dose",
    status: "completed",
  },
  {
    id: "v6",
    name: "Pentavalente",
    date: "2024-07-17",
    ageRecommended: 120,
    dose: "2ª dose",
    status: "completed",
  },
  {
    id: "v7",
    name: "VIP (Poliomielite)",
    date: "2024-07-17",
    ageRecommended: 120,
    dose: "2ª dose",
    status: "completed",
  },
  {
    id: "v8",
    name: "Rotavírus",
    date: "2024-07-17",
    ageRecommended: 120,
    dose: "2ª dose",
    status: "completed",
  },
  {
    id: "v9",
    name: "Pentavalente",
    ageRecommended: 180,
    dose: "3ª dose",
    status: "pending",
  },
  {
    id: "v10",
    name: "VIP (Poliomielite)",
    ageRecommended: 180,
    dose: "3ª dose",
    status: "pending",
  },
  {
    id: "v11",
    name: "Meningocócica C",
    ageRecommended: 90,
    dose: "1ª dose",
    status: "pending",
  },
  {
    id: "v12",
    name: "Pneumocócica 10",
    ageRecommended: 60,
    dose: "1ª dose",
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
    relation: "Mãe",
    birthDate: "1990-05-15",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
  },
  {
    id: "f2",
    name: "João Silva",
    relation: "Pai",
    birthDate: "1988-03-22",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
  },
  {
    id: "f3",
    name: "Ana Santos",
    relation: "Avó Materna",
    birthDate: "1965-08-10",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    parentId: "f1",
  },
  {
    id: "f4",
    name: "Carlos Santos",
    relation: "Avô Materno",
    birthDate: "1963-11-30",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    parentId: "f1",
  },
  {
    id: "f5",
    name: "Helena Silva",
    relation: "Avó Paterna",
    birthDate: "1967-02-18",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop",
    parentId: "f2",
  },
  {
    id: "f6",
    name: "Pedro Silva",
    relation: "Avô Paterno",
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
    return "Data inválida";
  }

  if (totalDays === 0) {
    return "0 dias";
  }

  const months = Math.floor(totalDays / 30);
  const days = totalDays % 30;

  if (months === 0) {
    return `${days} ${days === 1 ? "dia" : "dias"}`;
  }

  return `${months} ${months === 1 ? "mês" : "meses"} e ${days} ${
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

// Generate placeholders based on baby's age
export function getPlaceholdersForChapter(
  chapterId: string,
  babyAgeInDays: number
): PlaceholderTemplate[] {
  const placeholdersByChapter: Record<string, PlaceholderTemplate[]> = {
    "1": [
      // Gestação & Chegada
      {
        id: "p1-1",
        name: "Descoberta da Gravidez",
        icon: "🌱",
        description: "Quando tudo começou",
        templateType: "primeira-vez",
        ageRangeStart: -180,
        ageRangeEnd: -30,
        isCompleted: true,
        momentId: "1",
      },
      {
        id: "p1-2",
        name: "Diário da Barriga",
        icon: "📔",
        description: "Registro mensal da gestação",
        templateType: "nota",
        ageRangeStart: -180,
        ageRangeEnd: 0,
        allowMultiple: true,
        isCompleted: false,
      },
      {
        id: "p1-3",
        name: "História do Nome",
        icon: "🧩",
        description: "Por que escolhemos esse nome",
        templateType: "nota",
        ageRangeStart: -90,
        ageRangeEnd: 0,
        isCompleted: true,
        momentId: "2",
      },
      {
        id: "p1-4",
        name: "Chá de Bebê / Ensaio",
        icon: "🎁",
        description: "Festa e fotos pré-nascimento",
        templateType: "evento",
        ageRangeStart: -60,
        ageRangeEnd: 0,
        isCompleted: false,
      },
      {
        id: "p1-5",
        name: "Nascimento",
        icon: "🎉",
        description: "O grande dia",
        templateType: "evento",
        ageRangeStart: 0,
        isCompleted: true,
        momentId: "1",
      },
      {
        id: "p1-6",
        name: "Chegada em Casa",
        icon: "🏡",
        description: "Primeiros instantes em casa",
        templateType: "primeira-vez",
        ageRangeStart: 0,
        ageRangeEnd: 30,
        isCompleted: true,
        momentId: "2",
      },
      {
        id: "p1-7",
        name: "Plano de Parto",
        icon: "📋",
        description: "Decisões e expectativas",
        templateType: "nota",
        ageRangeStart: -90,
        ageRangeEnd: 0,
        isCompleted: false,
      },
      {
        id: "p1-8",
        name: "Lista da Maternidade",
        icon: "🛍️",
        description: "Preparativos e necessidades",
        templateType: "nota",
        ageRangeStart: -60,
        ageRangeEnd: 0,
        isCompleted: false,
      },
    ],
    "2": [
      // Triagens do RN & Registros
      {
        id: "p2-1",
        name: "Teste do Pezinho",
        icon: "🦶",
        description: "Triagem neonatal para doenças",
        templateType: "triagem",
        ageRangeStart: 0,
        ageRangeEnd: 30,
        isCompleted: false,
      },
      {
        id: "p2-2",
        name: "Teste da Orelhinha (EOA)",
        icon: "👂",
        description: "Exame de emissões otoacústicas",
        templateType: "triagem",
        ageRangeStart: 0,
        ageRangeEnd: 30,
        isCompleted: false,
      },
      {
        id: "p2-3",
        name: "Teste do Olhinho",
        icon: "👁️",
        description: "Reflexo vermelho e fundo de olho",
        templateType: "triagem",
        ageRangeStart: 0,
        ageRangeEnd: 30,
        isCompleted: false,
      },
      {
        id: "p2-4",
        name: "Oximetria de Pulso",
        icon: "❤️",
        description: "Teste do coraçãozinho",
        templateType: "triagem",
        ageRangeStart: 0,
        ageRangeEnd: 30,
        isCompleted: false,
      },
      {
        id: "p2-5",
        name: "Registro Civil",
        icon: "📄",
        description: "Certidão de nascimento e documentos",
        templateType: "registro",
        ageRangeStart: 0,
        ageRangeEnd: 90,
        isCompleted: false,
      },
      {
        id: "p2-6",
        name: "Primeira Foto de Documento",
        icon: "📷",
        description: "Foto para RG e documentos",
        templateType: "registro",
        ageRangeStart: 0,
        ageRangeEnd: 180,
        isCompleted: false,
      },
    ],
    "3": [
      // Primeiras Vezes & Descobertas
      {
        id: "p3-1",
        name: "Primeiro Banho",
        icon: "🛁",
        description: "O primeiro banho do bebê",
        templateType: "primeira-vez",
        ageRangeStart: 0,
        ageRangeEnd: 30,
        isCompleted: false,
      },
      {
        id: "p3-2",
        name: "Primeiro Colo Fora da Maternidade",
        icon: "🤗",
        description: "Primeiro contato fora do hospital",
        templateType: "primeira-vez",
        ageRangeStart: 0,
        ageRangeEnd: 30,
        isCompleted: false,
      },
      {
        id: "p3-3",
        name: "Primeiro Sorriso",
        icon: "😊",
        description: "A primeira risada registrada",
        templateType: "primeira-vez",
        ageRangeStart: 30,
        ageRangeEnd: 60,
        isCompleted: true,
        momentId: "3",
      },
      {
        id: "p3-4",
        name: "Primeira Viagem/Passeio",
        icon: "🚗",
        description: "Primeira aventura fora de casa",
        templateType: "primeira-vez",
        ageRangeStart: 60,
        ageRangeEnd: 90,
        isCompleted: false,
      },
      {
        id: "p3-5",
        name: "Primeiro Som/Balbucio",
        icon: "🗣️",
        description: "Primeiros sons e balbucios",
        templateType: "primeira-vez",
        ageRangeStart: 90,
        ageRangeEnd: 120,
        isCompleted: false,
      },
      {
        id: "p3-6",
        name: "Primeiro Rolamento",
        icon: "🔄",
        description: "Quando começou a rolar",
        templateType: "primeira-vez",
        ageRangeStart: 120,
        ageRangeEnd: 150,
        isCompleted: false,
      },
      {
        id: "p3-7",
        name: "Primeiro Dente",
        icon: "🦷",
        description: "Nasceu o primeiro dentinho",
        templateType: "primeira-vez",
        ageRangeStart: 150,
        ageRangeEnd: 180,
        isCompleted: false,
      },
      {
        id: "p3-8",
        name: "Primeira Comida",
        icon: "🥣",
        description: "Início da introdução alimentar",
        templateType: "primeira-vez",
        ageRangeStart: 150,
        ageRangeEnd: 180,
        isCompleted: false,
      },
      {
        id: "p3-9",
        name: "Primeiro Engatinhar",
        icon: "🐛",
        description: "Primeiros movimentos de engatinhar",
        templateType: "primeira-vez",
        ageRangeStart: 210,
        ageRangeEnd: 240,
        isCompleted: false,
      },
      {
        id: "p3-10",
        name: "Primeira Palavra",
        icon: "🗣️",
        description: "Quando falou pela primeira vez",
        templateType: "primeira-vez",
        ageRangeStart: 240,
        ageRangeEnd: 300,
        isCompleted: false,
      },
      {
        id: "p3-11",
        name: "Primeiros Passos",
        icon: "👣",
        description: "Quando começou a andar",
        templateType: "primeira-vez",
        ageRangeStart: 300,
        ageRangeEnd: 365,
        isCompleted: false,
      },
      {
        id: "p3-12",
        name: "Primeira Viagem Longa",
        icon: "✈️",
        description: "Primeira viagem mais distante",
        templateType: "primeira-vez",
        ageRangeStart: 300,
        ageRangeEnd: 365,
        isCompleted: false,
      },
    ],
    "4": [
      // Saúde & Crescimento
      {
        id: "p4-1",
        name: "Consulta RN (1ª semana)",
        icon: "🩺",
        description: "Primeira consulta neonatal",
        templateType: "consulta",
        ageRangeStart: 0,
        ageRangeEnd: 7,
        isCompleted: false,
      },
      {
        id: "p4-2",
        name: "Consulta 1 mês",
        icon: "🩺",
        description: "Acompanhamento mensal",
        templateType: "consulta",
        ageRangeStart: 30,
        ageRangeEnd: 35,
        isCompleted: true,
      },
      {
        id: "p4-3",
        name: "Consulta 2 meses",
        icon: "🩺",
        description: "Checagem de desenvolvimento",
        templateType: "consulta",
        ageRangeStart: 60,
        ageRangeEnd: 65,
        isCompleted: false,
      },
      {
        id: "p4-4",
        name: "Consulta 4 meses",
        icon: "🩺",
        description: "Acompanhamento trimestral",
        templateType: "consulta",
        ageRangeStart: 120,
        ageRangeEnd: 125,
        isCompleted: false,
      },
      {
        id: "p4-5",
        name: "Consulta 6 meses",
        icon: "🩺",
        description: "Meio ano de vida",
        templateType: "consulta",
        ageRangeStart: 180,
        ageRangeEnd: 185,
        isCompleted: false,
      },
      {
        id: "p4-6",
        name: "Consulta 9 meses",
        icon: "🩺",
        description: "Terceiro trimestre",
        templateType: "consulta",
        ageRangeStart: 270,
        ageRangeEnd: 275,
        isCompleted: false,
      },
      {
        id: "p4-7",
        name: "Consulta 12 meses",
        icon: "🩺",
        description: "Primeiro aniversário",
        templateType: "consulta",
        ageRangeStart: 365,
        ageRangeEnd: 370,
        isCompleted: false,
      },
      {
        id: "p4-8",
        name: "Consulta 18 meses",
        icon: "🩺",
        description: "Um ano e meio",
        templateType: "consulta",
        ageRangeStart: 540,
        ageRangeEnd: 545,
        isCompleted: false,
      },
      {
        id: "p4-9",
        name: "Consulta 24 meses",
        icon: "🩺",
        description: "Dois anos de vida",
        templateType: "consulta",
        ageRangeStart: 730,
        ageRangeEnd: 735,
        isCompleted: false,
      },
      {
        id: "p4-10",
        name: "Dentista (avaliação inicial)",
        icon: "🦷",
        description: "Primeira avaliação odontológica",
        templateType: "consulta",
        ageRangeStart: 240,
        ageRangeEnd: 365,
        isCompleted: false,
      },
      {
        id: "p4-11",
        name: "Sono & Humor",
        icon: "😴",
        description: "Registro de sono e humor",
        templateType: "nota",
        ageRangeStart: 0,
        allowMultiple: true,
        isCompleted: false,
      },
      {
        id: "p4-12",
        name: "Vacina BCG",
        icon: "💉",
        description: "Ao nascer",
        templateType: "vacina",
        ageRangeStart: 0,
        ageRangeEnd: 1,
        isCompleted: true,
        momentId: "4",
      },
      {
        id: "p4-13",
        name: "Vacina Hepatite B (nascimento)",
        icon: "💉",
        description: "Primeira dose",
        templateType: "vacina",
        ageRangeStart: 0,
        ageRangeEnd: 1,
        isCompleted: false,
      },
      {
        id: "p4-14",
        name: "Vacinas 2 meses",
        icon: "💉",
        description: "Penta, VIP, Pneumo10, Rotavírus",
        templateType: "vacina",
        ageRangeStart: 60,
        ageRangeEnd: 62,
        isCompleted: true,
      },
      {
        id: "p4-15",
        name: "Vacina Meningo C (1ª)",
        icon: "💉",
        description: "3 meses",
        templateType: "vacina",
        ageRangeStart: 90,
        ageRangeEnd: 92,
        isCompleted: false,
      },
      {
        id: "p4-16",
        name: "Vacinas 4 meses",
        icon: "💉",
        description: "Reforços Penta, VIP, Pneumo10, Rotavírus",
        templateType: "vacina",
        ageRangeStart: 120,
        ageRangeEnd: 122,
        isCompleted: true,
      },
      {
        id: "p4-17",
        name: "Vacina Meningo C (2ª)",
        icon: "💉",
        description: "5 meses",
        templateType: "vacina",
        ageRangeStart: 150,
        ageRangeEnd: 152,
        isCompleted: false,
      },
      {
        id: "p4-18",
        name: "Vacinas 6 meses",
        icon: "💉",
        description: "Reforços finais + Influenza",
        templateType: "vacina",
        ageRangeStart: 180,
        ageRangeEnd: 182,
        isCompleted: true,
      },
      {
        id: "p4-19",
        name: "Vacina Febre Amarela",
        icon: "💉",
        description: "9 meses (conforme região)",
        templateType: "vacina",
        ageRangeStart: 270,
        ageRangeEnd: 275,
        isCompleted: false,
      },
      {
        id: "p4-20",
        name: "Vacinas 12 meses",
        icon: "💉",
        description:
          "Tríplice Viral, Pneumo10 reforço, Meningo C reforço, Hepatite A",
        templateType: "vacina",
        ageRangeStart: 365,
        ageRangeEnd: 367,
        isCompleted: false,
      },
      {
        id: "p4-21",
        name: "Vacinas 15 meses",
        icon: "💉",
        description: "DTP reforço, VIP reforço, Tetraviral",
        templateType: "vacina",
        ageRangeStart: 450,
        ageRangeEnd: 455,
        isCompleted: false,
      },
      {
        id: "p4-22",
        name: "Medidas de Crescimento",
        icon: "📏",
        description: "Peso, altura, perímetro cefálico",
        templateType: "medida",
        ageRangeStart: 0,
        allowMultiple: true,
        isCompleted: false,
      },
    ],
    "5": [
      // Família & Visitas
      {
        id: "p5-1",
        name: "Primeira Visita dos Avós",
        icon: "👵",
        description: "Os primeiros avós a conhecer",
        templateType: "primeira-vez",
        ageRangeStart: 0,
        isCompleted: true,
      },
      {
        id: "p5-2",
        name: "Conhecendo os Padrinhos",
        icon: "🎁",
        description: "Quem escolhemos para cuidar junto",
        templateType: "primeira-vez",
        ageRangeStart: 0,
        isCompleted: true,
      },
      {
        id: "p5-3",
        name: "Encontro com Primos",
        icon: "👶",
        description: "Primeiras brincadeiras",
        templateType: "evento",
        ageRangeStart: 60,
        isCompleted: true,
      },
      {
        id: "p5-4",
        name: "Visita Especial",
        icon: "🚪",
        description: "Amigos e familiares",
        templateType: "evento",
        ageRangeStart: 0,
        allowMultiple: true,
        isCompleted: true,
      },
      {
        id: "p5-5",
        name: "Foto de Família",
        icon: "📸",
        description: "Registros em família",
        templateType: "evento",
        ageRangeStart: 0,
        allowMultiple: true,
        isCompleted: false,
      },
      {
        id: "p5-6",
        name: "Árvore da Família",
        icon: "🌳",
        description: "Genealogia e vínculos",
        templateType: "nota",
        ageRangeStart: 0,
        isCompleted: false,
      },
    ],
    "6": [
      // Mêsversários & Resumos
      {
        id: "p6-1",
        name: "1º Mêsversário",
        icon: "🎂",
        description: "Um mês de vida",
        templateType: "mesversario",
        ageRangeStart: 30,
        isCompleted: true,
        momentId: "5",
      },
      {
        id: "p6-2",
        name: "2º Mêsversário",
        icon: "🎂",
        description: "Dois meses de vida",
        templateType: "mesversario",
        ageRangeStart: 60,
        isCompleted: true,
        momentId: "6",
      },
      {
        id: "p6-3",
        name: "3º Mêsversário",
        icon: "🎂",
        description: "Três meses de vida",
        templateType: "mesversario",
        ageRangeStart: 90,
        isCompleted: true,
      },
      {
        id: "p6-4",
        name: "4º Mêsversário",
        icon: "🎂",
        description: "Quatro meses de vida",
        templateType: "mesversario",
        ageRangeStart: 120,
        isCompleted: true,
      },
      {
        id: "p6-5",
        name: "5º Mêsversário",
        icon: "🎂",
        description: "Cinco meses de vida",
        templateType: "mesversario",
        ageRangeStart: 150,
        isCompleted: true,
      },
      {
        id: "p6-6",
        name: "6º Mêsversário",
        icon: "🎂",
        description: "Meio ano de vida",
        templateType: "mesversario",
        ageRangeStart: 180,
        isCompleted: true,
      },
      {
        id: "p6-7",
        name: "7º Mêsversário",
        icon: "🎂",
        description: "Sete meses de vida",
        templateType: "mesversario",
        ageRangeStart: 210,
        isCompleted: true,
      },
      {
        id: "p6-8",
        name: "8º Mêsversário",
        icon: "🎂",
        description: "Oito meses de vida",
        templateType: "mesversario",
        ageRangeStart: 240,
        isCompleted: false,
      },
      {
        id: "p6-9",
        name: "9º Mêsversário",
        icon: "🎂",
        description: "Nove meses de vida",
        templateType: "mesversario",
        ageRangeStart: 270,
        isCompleted: false,
      },
      {
        id: "p6-10",
        name: "10º Mêsversário",
        icon: "🎂",
        description: "Dez meses de vida",
        templateType: "mesversario",
        ageRangeStart: 300,
        isCompleted: false,
      },
      {
        id: "p6-11",
        name: "11º Mêsversário",
        icon: "🎂",
        description: "Onze meses de vida",
        templateType: "mesversario",
        ageRangeStart: 330,
        isCompleted: false,
      },
      {
        id: "p6-12",
        name: "12º Mêsversário / 1º Aniversário",
        icon: "🎂",
        description: "Um ano de vida!",
        templateType: "mesversario",
        ageRangeStart: 365,
        isCompleted: false,
      },
      {
        id: "p6-13",
        name: "13º Mêsversário",
        icon: "🎂",
        description: "Treze meses de vida",
        templateType: "mesversario",
        ageRangeStart: 395,
        isCompleted: false,
      },
      {
        id: "p6-14",
        name: "14º Mêsversário",
        icon: "🎂",
        description: "Quatorze meses de vida",
        templateType: "mesversario",
        ageRangeStart: 425,
        isCompleted: false,
      },
      {
        id: "p6-15",
        name: "15º Mêsversário",
        icon: "🎂",
        description: "Quinze meses de vida",
        templateType: "mesversario",
        ageRangeStart: 455,
        isCompleted: false,
      },
      {
        id: "p6-16",
        name: "16º Mêsversário",
        icon: "🎂",
        description: "Dezesseis meses de vida",
        templateType: "mesversario",
        ageRangeStart: 485,
        isCompleted: false,
      },
      {
        id: "p6-17",
        name: "17º Mêsversário",
        icon: "🎂",
        description: "Dezessete meses de vida",
        templateType: "mesversario",
        ageRangeStart: 515,
        isCompleted: false,
      },
      {
        id: "p6-18",
        name: "18º Mêsversário",
        icon: "🎂",
        description: "Dezoito meses de vida",
        templateType: "mesversario",
        ageRangeStart: 545,
        isCompleted: false,
      },
      {
        id: "p6-19",
        name: "19º Mêsversário",
        icon: "🎂",
        description: "Dezenove meses de vida",
        templateType: "mesversario",
        ageRangeStart: 575,
        isCompleted: false,
      },
      {
        id: "p6-20",
        name: "20º Mêsversário",
        icon: "🎂",
        description: "Vinte meses de vida",
        templateType: "mesversario",
        ageRangeStart: 605,
        isCompleted: false,
      },
      {
        id: "p6-21",
        name: "21º Mêsversário",
        icon: "🎂",
        description: "Vinte e um meses de vida",
        templateType: "mesversario",
        ageRangeStart: 635,
        isCompleted: false,
      },
      {
        id: "p6-22",
        name: "22º Mêsversário",
        icon: "🎂",
        description: "Vinte e dois meses de vida",
        templateType: "mesversario",
        ageRangeStart: 665,
        isCompleted: false,
      },
      {
        id: "p6-23",
        name: "23º Mêsversário",
        icon: "🎂",
        description: "Vinte e três meses de vida",
        templateType: "mesversario",
        ageRangeStart: 695,
        isCompleted: false,
      },
      {
        id: "p6-24",
        name: "24º Mêsversário / 2º Aniversário",
        icon: "🎂",
        description: "Dois anos de vida!",
        templateType: "mesversario",
        ageRangeStart: 730,
        isCompleted: false,
      },
      {
        id: "p6-25",
        name: "Resumo do 1º Mês",
        icon: "📝",
        description: "Destaques e conquistas",
        templateType: "nota",
        ageRangeStart: 30,
        isCompleted: false,
      },
      {
        id: "p6-26",
        name: "Resumo do 2º Mês",
        icon: "📝",
        description: "Destaques e conquistas",
        templateType: "nota",
        ageRangeStart: 60,
        isCompleted: false,
      },
      {
        id: "p6-27",
        name: "Resumo do 3º Mês",
        icon: "📝",
        description: "Destaques e conquistas",
        templateType: "nota",
        ageRangeStart: 90,
        isCompleted: false,
      },
      {
        id: "p6-28",
        name: "Resumo do 4º Mês",
        icon: "📝",
        description: "Destaques e conquistas",
        templateType: "nota",
        ageRangeStart: 120,
        isCompleted: false,
      },
      {
        id: "p6-29",
        name: "Resumo do 5º Mês",
        icon: "📝",
        description: "Destaques e conquistas",
        templateType: "nota",
        ageRangeStart: 150,
        isCompleted: false,
      },
      {
        id: "p6-30",
        name: "Resumo do 6º Mês",
        icon: "📝",
        description: "Destaques e conquistas",
        templateType: "nota",
        ageRangeStart: 180,
        isCompleted: false,
      },
      {
        id: "p6-31",
        name: "Resumo do 7º Mês",
        icon: "📝",
        description: "Destaques e conquistas",
        templateType: "nota",
        ageRangeStart: 210,
        isCompleted: false,
      },
      {
        id: "p6-32",
        name: "Resumo do 8º Mês",
        icon: "📝",
        description: "Destaques e conquistas",
        templateType: "nota",
        ageRangeStart: 240,
        isCompleted: false,
      },
      {
        id: "p6-33",
        name: "Resumo do 9º Mês",
        icon: "📝",
        description: "Destaques e conquistas",
        templateType: "nota",
        ageRangeStart: 270,
        isCompleted: false,
      },
      {
        id: "p6-34",
        name: "Resumo do 10º Mês",
        icon: "📝",
        description: "Destaques e conquistas",
        templateType: "nota",
        ageRangeStart: 300,
        isCompleted: false,
      },
      {
        id: "p6-35",
        name: "Resumo do 11º Mês",
        icon: "📝",
        description: "Destaques e conquistas",
        templateType: "nota",
        ageRangeStart: 330,
        isCompleted: false,
      },
      {
        id: "p6-36",
        name: "Resumo do 12º Mês",
        icon: "📝",
        description: "Destaques e conquistas",
        templateType: "nota",
        ageRangeStart: 365,
        isCompleted: false,
      },
      {
        id: "p6-37",
        name: "Resumo do 13º Mês",
        icon: "📝",
        description: "Destaques e conquistas",
        templateType: "nota",
        ageRangeStart: 395,
        isCompleted: false,
      },
      {
        id: "p6-38",
        name: "Resumo do 14º Mês",
        icon: "📝",
        description: "Destaques e conquistas",
        templateType: "nota",
        ageRangeStart: 425,
        isCompleted: false,
      },
      {
        id: "p6-39",
        name: "Resumo do 15º Mês",
        icon: "📝",
        description: "Destaques e conquistas",
        templateType: "nota",
        ageRangeStart: 455,
        isCompleted: false,
      },
      {
        id: "p6-40",
        name: "Resumo do 16º Mês",
        icon: "📝",
        description: "Destaques e conquistas",
        templateType: "nota",
        ageRangeStart: 485,
        isCompleted: false,
      },
      {
        id: "p6-41",
        name: "Resumo do 17º Mês",
        icon: "📝",
        description: "Destaques e conquistas",
        templateType: "nota",
        ageRangeStart: 515,
        isCompleted: false,
      },
      {
        id: "p6-42",
        name: "Resumo do 18º Mês",
        icon: "📝",
        description: "Destaques e conquistas",
        templateType: "nota",
        ageRangeStart: 545,
        isCompleted: false,
      },
      {
        id: "p6-43",
        name: "Resumo do 19º Mês",
        icon: "📝",
        description: "Destaques e conquistas",
        templateType: "nota",
        ageRangeStart: 575,
        isCompleted: false,
      },
      {
        id: "p6-44",
        name: "Resumo do 20º Mês",
        icon: "📝",
        description: "Destaques e conquistas",
        templateType: "nota",
        ageRangeStart: 605,
        isCompleted: false,
      },
      {
        id: "p6-45",
        name: "Resumo do 21º Mês",
        icon: "📝",
        description: "Destaques e conquistas",
        templateType: "nota",
        ageRangeStart: 635,
        isCompleted: false,
      },
      {
        id: "p6-46",
        name: "Resumo do 22º Mês",
        icon: "📝",
        description: "Destaques e conquistas",
        templateType: "nota",
        ageRangeStart: 665,
        isCompleted: false,
      },
      {
        id: "p6-47",
        name: "Resumo do 23º Mês",
        icon: "📝",
        description: "Destaques e conquistas",
        templateType: "nota",
        ageRangeStart: 695,
        isCompleted: false,
      },
      {
        id: "p6-48",
        name: "Resumo do 24º Mês",
        icon: "📝",
        description: "Destaques e conquistas",
        templateType: "nota",
        ageRangeStart: 730,
        isCompleted: false,
      },
    ],
    "7": [
      // Cartas & Cápsulas do Tempo
      {
        id: "p7-1",
        name: "Carta de Boas-Vindas",
        icon: "👋",
        description: "Mensagem de acolhimento",
        templateType: "carta",
        ageRangeStart: 0,
        ageRangeEnd: 30,
        isCompleted: false,
      },
      {
        id: "p7-2",
        name: "Carta de Meio Ano",
        icon: "🎂",
        description: "Reflexões aos 6 meses",
        templateType: "carta",
        ageRangeStart: 180,
        ageRangeEnd: 185,
        isCompleted: false,
      },
      {
        id: "p7-3",
        name: "Carta de 1 Ano",
        icon: "🎉",
        description: "Mensagem especial de aniversário",
        templateType: "carta",
        ageRangeStart: 365,
        ageRangeEnd: 370,
        isCompleted: false,
      },
      {
        id: "p7-4",
        name: "Carta de 18 Meses",
        icon: "📝",
        description: "Atualização e reflexões",
        templateType: "carta",
        ageRangeStart: 540,
        ageRangeEnd: 545,
        isCompleted: false,
      },
      {
        id: "p7-5",
        name: "Carta de 2 Anos",
        icon: "🎈",
        description: "Celebração dos 2 anos",
        templateType: "carta",
        ageRangeStart: 730,
        ageRangeEnd: 735,
        isCompleted: false,
      },
      {
        id: "p7-6",
        name: "Carta para o Futuro",
        icon: "✉️",
        description: "Mensagem para ler aos 18 anos",
        templateType: "carta",
        ageRangeStart: 0,
        isCompleted: true,
      },
    ],
    "8": [
      // Arte & Desenhos
      {
        id: "p8-1",
        name: "Primeiro Rabisco",
        icon: "✏️",
        description: "Primeiras marcas no papel",
        templateType: "arte",
        ageRangeStart: 330,
        ageRangeEnd: 365,
        isCompleted: false,
      },
      {
        id: "p8-2",
        name: "Colagem / Pintura de Dedo",
        icon: "🖌️",
        description: "Arte com as mãozinhas",
        templateType: "arte",
        ageRangeStart: 365,
        ageRangeEnd: 545,
        isCompleted: false,
      },
      {
        id: "p8-3",
        name: "Desenho com Formas Simples",
        icon: "🎨",
        description: "Primeiras formas reconhecíveis",
        templateType: "arte",
        ageRangeStart: 545,
        ageRangeEnd: 730,
        isCompleted: false,
      },
      {
        id: "p8-4",
        name: "Meu Primeiro Autorretrato",
        icon: "👶",
        description: "Auto-representação artística",
        templateType: "arte",
        ageRangeStart: 700,
        ageRangeEnd: 730,
        isCompleted: false,
      },
      {
        id: "p8-5",
        name: "Arte da Escola",
        icon: "🏫",
        description: "Produções escolares",
        templateType: "arte",
        ageRangeStart: 365,
        allowMultiple: true,
        isCompleted: false,
      },
    ],
    "9": [
      // Datas Especiais
      {
        id: "p9-1",
        name: "Primeiro Natal",
        icon: "🎄",
        description: "Celebração natalina",
        templateType: "evento",
        ageRangeStart: 0,
        ageRangeEnd: 365,
        isCompleted: false,
      },
      {
        id: "p9-2",
        name: "Primeira Páscoa",
        icon: "🐰",
        description: "Festa da páscoa",
        templateType: "evento",
        ageRangeStart: 0,
        ageRangeEnd: 365,
        isCompleted: false,
      },
      {
        id: "p9-3",
        name: "Carnaval / São João",
        icon: "🎭",
        description: "Festas populares",
        templateType: "evento",
        ageRangeStart: 0,
        ageRangeEnd: 730,
        isCompleted: false,
      },
      {
        id: "p9-4",
        name: "Batizado",
        icon: "⛪",
        description: "Cerimônia religiosa",
        templateType: "evento",
        ageRangeStart: 0,
        ageRangeEnd: 365,
        isCompleted: false,
      },
      {
        id: "p9-5",
        name: "Evento Especial",
        icon: "🎉",
        description: "Momentos marcantes customizados",
        templateType: "evento",
        ageRangeStart: 0,
        allowMultiple: true,
        isCompleted: false,
      },
    ],
    "10": [
      // Pensamentos & Observações
      {
        id: "p10-1",
        name: "Momento Livre",
        icon: "💭",
        description: "Registro personalizado",
        templateType: "nota",
        ageRangeStart: 0,
        allowMultiple: true,
        isCompleted: false,
      },
      {
        id: "p10-2",
        name: "Pensamento do Dia",
        icon: "💡",
        description: "Reflexões diárias",
        templateType: "nota",
        ageRangeStart: 0,
        allowMultiple: true,
        isCompleted: false,
      },
      {
        id: "p10-3",
        name: "Lembrete Médico",
        icon: "🏥",
        description: "Anotações sobre saúde",
        templateType: "nota",
        ageRangeStart: 0,
        allowMultiple: true,
        isCompleted: false,
      },
      {
        id: "p10-4",
        name: "Humor do Dia",
        icon: "😊",
        description: "Registro de emoções",
        templateType: "nota",
        ageRangeStart: 0,
        allowMultiple: true,
        isCompleted: false,
      },
    ],
    "11": [
      // Escola & Aprendizados
      {
        id: "p11-1",
        name: "Primeiro Dia na Escola/Creche",
        icon: "🎒",
        description: "Início da jornada educacional",
        templateType: "evento",
        ageRangeStart: 365,
        ageRangeEnd: 730,
        isCompleted: false,
      },
      {
        id: "p11-2",
        name: "Produções Escolares",
        icon: "📚",
        description: "Trabalhos e atividades",
        templateType: "nota",
        ageRangeStart: 365,
        allowMultiple: true,
        isCompleted: false,
      },
      {
        id: "p11-3",
        name: "Evento Escolar/Festa",
        icon: "🎊",
        description: "Celebrações escolares",
        templateType: "evento",
        ageRangeStart: 365,
        allowMultiple: true,
        isCompleted: false,
      },
      {
        id: "p11-4",
        name: "Amigos da Escola",
        icon: "👫",
        description: "Primeiras amizades",
        templateType: "nota",
        ageRangeStart: 365,
        allowMultiple: true,
        isCompleted: false,
      },
      {
        id: "p11-5",
        name: "Bilhetes/Anexos",
        icon: "📎",
        description: "Documentos e comunicados",
        templateType: "nota",
        ageRangeStart: 365,
        allowMultiple: true,
        isCompleted: false,
      },
    ],
    "12": [
      // Capítulos Custom
      {
        id: "p12-1",
        name: "Evento Personalizado",
        icon: "⭐",
        description: "Momentos customizados",
        templateType: "evento",
        ageRangeStart: 0,
        allowMultiple: true,
        isCompleted: false,
      },
      {
        id: "p12-2",
        name: "Nota Personalizada",
        icon: "📝",
        description: "Registros personalizados",
        templateType: "nota",
        ageRangeStart: 0,
        allowMultiple: true,
        isCompleted: false,
      },
      {
        id: "p12-3",
        name: "Foto/Vídeo Personalizado",
        icon: "📸",
        description: "Mídias personalizadas",
        templateType: "evento",
        ageRangeStart: 0,
        allowMultiple: true,
        isCompleted: false,
      },
    ],
  };

  return placeholdersByChapter[chapterId] || [];
}

// Group moments by series
export function getMomentsBySeries(): Record<string, Moment[]> {
  const moments = getMoments();
  const seriesMap: Record<string, Moment[]> = {};

  moments.forEach((moment) => {
    if (moment.seriesId) {
      if (!seriesMap[moment.seriesId]) {
        seriesMap[moment.seriesId] = [];
      }
      seriesMap[moment.seriesId].push(moment);
    }
  });

  return seriesMap;
}

// Get series info for a template
export function getSeriesInfo(templateId: string, chapterId: string) {
  const moments = getMoments();
  const seriesMoments = moments.filter(
    (m) => m.templateId === templateId && m.seriesId
  );
  const placeholders = getPlaceholdersForChapter(chapterId, 0);
  const template = placeholders.find((p) => p.id === templateId);

  if (!template?.allowMultiple) {
    return null;
  }

  const seriesId = seriesMoments.length > 0 ? seriesMoments[0].seriesId : null;
  const completed = seriesMoments.filter(
    (m) => m.status === "published"
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

// Get all series for a chapter
export function getChapterSeries(chapterId: string) {
  const placeholders = getPlaceholdersForChapter(chapterId, 0);
  const seriesTemplates = placeholders.filter((p) => p.allowMultiple);

  return seriesTemplates
    .map((template) => getSeriesInfo(template.id, chapterId))
    .filter(Boolean);
}
