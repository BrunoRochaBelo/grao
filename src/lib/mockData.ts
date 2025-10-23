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
} from './types';

// Store current baby selection
let currentBabyId = '1';

export const babies: Baby[] = [
  {
    id: '1',
    name: 'Aurora',
    birthDate: '2024-03-17',
    city: 'São Paulo, SP',
    avatar: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop',
    gender: 'female',
    isActive: true,
  },
  {
    id: '2',
    name: 'Miguel',
    birthDate: '2023-08-22',
    city: 'Rio de Janeiro, RJ',
    avatar: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=400&fit=crop',
    gender: 'male',
    isActive: false,
  },
];

export function getCurrentBaby(): Baby {
  return babies.find(b => b.isActive) || babies[0];
}

export function setCurrentBaby(babyId: string): void {
  babies.forEach(b => (b.isActive = b.id === babyId));
  if (typeof window !== 'undefined') {
    localStorage.setItem('babybook_current_baby', babyId);
  }
}

export function initializeCurrentBaby(): void {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('babybook_current_baby');
    if (stored) {
      currentBabyId = stored;
    }
  }
}

export const currentBaby = getCurrentBaby();

export const chapters: Chapter[] = [
  {
    id: '1',
    name: 'Gestação & Chegada',
    description: 'Da espera até o grande dia',
    icon: '🌱',
    color: '#A7F3D0',
    total: 7,
    completed: 5,
  },
  {
    id: '2',
    name: 'Primeiras Vezes',
    description: 'Todas as estreias especiais',
    icon: '💫',
    color: '#FDE68A',
    total: 8,
    completed: 3,
  },
  {
    id: '3',
    name: 'Saúde & Crescimento',
    description: 'Acompanhamento e cuidados',
    icon: '📏',
    color: '#BFDBFE',
    total: 7,
    completed: 6,
  },
  {
    id: '4',
    name: 'Família & Visitas',
    description: 'Vínculos e encontros',
    icon: '👨‍👩‍👧',
    color: '#FBCFE8',
    total: 6,
    completed: 4,
  },
  {
    id: '5',
    name: 'Mêsversários',
    description: 'Cada mês é uma conquista',
    icon: '🎂',
    color: '#DDD6FE',
    total: 12,
    completed: 7,
  },
  {
    id: '6',
    name: 'Cartas & Memórias',
    description: 'Mensagens para o futuro',
    icon: '✉️',
    color: '#FECACA',
    total: 4,
    completed: 1,
  },
];

// Initial moments - will be stored in localStorage
let storedMoments: Moment[] = [];

const initialMoments: Moment[] = [
  {
    id: '1',
    chapterId: '1',
    templateId: 'p1-3',
    title: 'O Grande Dia',
    date: '2024-03-17T08:30:00',
    age: '0 dias',
    location: 'Hospital São Luiz',
    people: ['Mamãe', 'Papai'],
    media: ['https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&h=600&fit=crop'],
    noteShort: 'Aurora nasceu às 8h30',
    noteLong: 'Aurora nasceu às 8h30, pesando 3.2kg e 49cm. Foi um parto cesárea tranquilo. Está tudo bem com mãe e bebê. O momento mais especial das nossas vidas!',
    tags: ['nascimento', 'hospital'],
    privacy: 'private',
    status: 'published',
    extraData: { weight: 3.2, height: 49 },
  },
  {
    id: '2',
    chapterId: '1',
    templateId: 'p1-4',
    title: 'Chegada em Casa',
    date: '2024-03-19T14:00:00',
    age: '2 dias',
    location: 'Nossa Casa',
    people: ['Mamãe', 'Papai', 'Vovó'],
    media: ['https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&h=600&fit=crop'],
    noteShort: 'Primeiro dia no nosso lar',
    noteLong: 'Finalmente em casa! A vovó preparou tudo com muito carinho. Aurora conheceu seu quartinho e dormiu tranquila.',
    tags: ['casa', 'família'],
    privacy: 'private',
    status: 'published',
  },
  {
    id: '3',
    chapterId: '2',
    templateId: 'p2-2',
    title: 'Primeiro Sorriso',
    date: '2024-04-20T10:15:00',
    age: '1 mês e 3 dias',
    media: ['https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=600&fit=crop'],
    noteShort: 'O sorriso mais lindo do mundo!',
    noteLong: 'Hoje a Aurora nos deu o primeiro sorriso social! Foi durante a troca de fralda, quando o papai fez uma careta engraçada. Nossos corações derreteram!',
    tags: ['marco', 'alegria', 'desenvolvimento'],
    privacy: 'private',
    status: 'published',
  },
  {
    id: '4',
    chapterId: '3',
    templateId: 'p3-2',
    title: 'Primeira Vacina - BCG',
    date: '2024-03-18T09:00:00',
    age: '1 dia',
    location: 'Hospital São Luiz',
    people: ['Mamãe', 'Papai'],
    media: ['https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=800&h=600&fit=crop'],
    noteShort: 'Primeira dose aplicada com sucesso',
    noteLong: 'BCG aplicada ainda na maternidade. Aurora foi muito corajosa, chorou só um pouquinho.',
    tags: ['saúde', 'vacina', 'BCG'],
    privacy: 'private',
    status: 'published',
    extraData: { vaccineName: 'BCG', dose: '1ª dose', lot: 'BCG123456' },
  },
  {
    id: '5',
    chapterId: '5',
    templateId: 'p5-1',
    title: '1º Mêsversário',
    date: '2024-04-17T00:00:00',
    age: '1 mês',
    media: ['https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&h=600&fit=crop'],
    noteShort: 'Um mês de muito amor',
    noteLong: 'Completou 1 mês de vida! Já cresceu tanto, está com 3.8kg e 52cm. A cada dia nos apaixonamos mais.',
    tags: ['mêsversário', 'celebração'],
    privacy: 'private',
    status: 'published',
    extraData: { weight: 3.8, height: 52, milestone: 'Sorriso social começando' },
  },
  {
    id: '6',
    chapterId: '5',
    templateId: 'p5-2',
    title: '2º Mêsversário',
    date: '2024-05-17T00:00:00',
    age: '2 meses',
    media: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop'],
    noteShort: 'Dois meses de pura felicidade',
    noteLong: 'Já são 2 meses! Aurora está mais interativa, acompanha com os olhos e adora conversar com a gente. Pesando 4.5kg e 55cm.',
    tags: ['mêsversário', 'celebração', 'desenvolvimento'],
    privacy: 'private',
    status: 'published',
    extraData: { weight: 4.5, height: 55, milestone: 'Segura a cabeça' },
  },
];

// Initialize from localStorage or use initial data
export function initializeMoments(): Moment[] {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('babybook_moments');
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

export function addMoment(moment: Omit<Moment, 'id'>): Moment {
  const newMoment: Moment = {
    ...moment,
    id: `moment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  };
  storedMoments.push(newMoment);
  saveMomentsToStorage();
  return newMoment;
}

export function updateMoment(id: string, updates: Partial<Moment>): Moment | null {
  const index = storedMoments.findIndex(m => m.id === id);
  if (index === -1) return null;
  
  storedMoments[index] = { ...storedMoments[index], ...updates };
  saveMomentsToStorage();
  return storedMoments[index];
}

export function deleteMoment(id: string): boolean {
  const index = storedMoments.findIndex(m => m.id === id);
  if (index === -1) return false;
  
  storedMoments.splice(index, 1);
  saveMomentsToStorage();
  return true;
}

function saveMomentsToStorage(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('babybook_moments', JSON.stringify(storedMoments));
  }
}

export const moments = getMoments();

// Growth measurements data
export const growthMeasurements: GrowthMeasurement[] = [
  { id: 'g1', date: '2024-03-17', age: '0 dias', weight: 3.2, height: 49, headCircumference: 35, notes: 'Nascimento' },
  { id: 'g2', date: '2024-04-17', age: '1 mês', weight: 3.8, height: 52, headCircumference: 36.5 },
  { id: 'g3', date: '2024-05-17', age: '2 meses', weight: 4.5, height: 55, headCircumference: 38 },
  { id: 'g4', date: '2024-06-17', age: '3 meses', weight: 5.2, height: 58, headCircumference: 39.5 },
  { id: 'g5', date: '2024-07-17', age: '4 meses', weight: 5.8, height: 61, headCircumference: 40.5 },
  { id: 'g6', date: '2024-08-17', age: '5 meses', weight: 6.4, height: 64, headCircumference: 41.5 },
  { id: 'g7', date: '2024-09-17', age: '6 meses', weight: 7.0, height: 66, headCircumference: 42.5 },
  { id: 'g8', date: '2024-10-17', age: '7 meses', weight: 7.6, height: 68, headCircumference: 43.2 },
];

export function getGrowthMeasurements(): GrowthMeasurement[] {
  return growthMeasurements;
}

export function addGrowthMeasurement(measurement: Omit<GrowthMeasurement, 'id'>): GrowthMeasurement {
  const newMeasurement: GrowthMeasurement = {
    ...measurement,
    id: `g-${Date.now()}`,
  };
  growthMeasurements.push(newMeasurement);
  return newMeasurement;
}

// Vaccine records data
export const vaccines: VaccineRecord[] = [
  { id: 'v1', name: 'BCG', date: '2024-03-18', ageRecommended: 0, dose: 'Dose única', status: 'completed', lot: 'BCG123456' },
  { id: 'v2', name: 'Hepatite B', date: '2024-03-18', ageRecommended: 0, dose: '1ª dose', status: 'completed' },
  { id: 'v3', name: 'Pentavalente', date: '2024-05-17', ageRecommended: 60, dose: '1ª dose', status: 'completed' },
  { id: 'v4', name: 'VIP (Poliomielite)', date: '2024-05-17', ageRecommended: 60, dose: '1ª dose', status: 'completed' },
  { id: 'v5', name: 'Rotavírus', date: '2024-05-17', ageRecommended: 60, dose: '1ª dose', status: 'completed' },
  { id: 'v6', name: 'Pentavalente', date: '2024-07-17', ageRecommended: 120, dose: '2ª dose', status: 'completed' },
  { id: 'v7', name: 'VIP (Poliomielite)', date: '2024-07-17', ageRecommended: 120, dose: '2ª dose', status: 'completed' },
  { id: 'v8', name: 'Rotavírus', date: '2024-07-17', ageRecommended: 120, dose: '2ª dose', status: 'completed' },
  { id: 'v9', name: 'Pentavalente', ageRecommended: 180, dose: '3ª dose', status: 'pending' },
  { id: 'v10', name: 'VIP (Poliomielite)', ageRecommended: 180, dose: '3ª dose', status: 'pending' },
  { id: 'v11', name: 'Meningocócica C', ageRecommended: 90, dose: '1ª dose', status: 'pending' },
  { id: 'v12', name: 'Pneumocócica 10', ageRecommended: 60, dose: '1ª dose', status: 'pending' },
];

export function getVaccines(): VaccineRecord[] {
  return vaccines;
}

export function addVaccine(vaccine: Omit<VaccineRecord, 'id'>): VaccineRecord {
  const newVaccine: VaccineRecord = {
    ...vaccine,
    id: `v-${Date.now()}`,
  };
  vaccines.push(newVaccine);
  return newVaccine;
}

export function updateVaccine(id: string, updates: Partial<VaccineRecord>): VaccineRecord | null {
  const index = vaccines.findIndex(v => v.id === id);
  if (index === -1) return null;
  vaccines[index] = { ...vaccines[index], ...updates };
  return vaccines[index];
}

// Sleep & Humor data
export const sleepHumorEntries: SleepHumorEntry[] = [
  { id: 's1', date: '2024-10-15', sleepHours: 11, sleepQuality: 'excellent', mood: 'happy' },
  { id: 's2', date: '2024-10-16', sleepHours: 9.5, sleepQuality: 'good', mood: 'calm' },
  { id: 's3', date: '2024-10-17', sleepHours: 8, sleepQuality: 'fair', mood: 'fussy' },
  { id: 's4', date: '2024-10-18', sleepHours: 10, sleepQuality: 'good', mood: 'happy' },
  { id: 's5', date: '2024-10-19', sleepHours: 11.5, sleepQuality: 'excellent', mood: 'sleepy' },
  { id: 's6', date: '2024-10-20', sleepHours: 10.5, sleepQuality: 'excellent', mood: 'happy' },
  { id: 's7', date: '2024-10-21', sleepHours: 9, sleepQuality: 'good', mood: 'calm' },
];

export function getSleepHumorEntries(): SleepHumorEntry[] {
  return sleepHumorEntries;
}

export function addSleepHumorEntry(entry: Omit<SleepHumorEntry, 'id'>): SleepHumorEntry {
  const newEntry: SleepHumorEntry = {
    ...entry,
    id: `s-${Date.now()}`,
  };
  sleepHumorEntries.push(newEntry);
  return newEntry;
}

// Sleep records data (new format)
export const sleepRecords: SleepRecord[] = [
  { id: 'sr1', date: '2024-10-15', type: 'sleep', duration: 11, mood: 'feliz' },
  { id: 'sr2', date: '2024-10-16', type: 'sleep', duration: 9.5, mood: 'calmo' },
  { id: 'sr3', date: '2024-10-16', type: 'nap', duration: 2, mood: 'calmo', notes: 'Soneca da tarde' },
  { id: 'sr4', date: '2024-10-17', type: 'sleep', duration: 8, mood: 'irritado' },
  { id: 'sr5', date: '2024-10-18', type: 'sleep', duration: 10, mood: 'feliz' },
  { id: 'sr6', date: '2024-10-19', type: 'sleep', duration: 11.5, mood: 'calmo' },
  { id: 'sr7', date: '2024-10-20', type: 'sleep', duration: 10.5, mood: 'feliz' },
  { id: 'sr8', date: '2024-10-21', type: 'sleep', duration: 9, mood: 'calmo' },
];

export function getSleepRecords(): SleepRecord[] {
  return sleepRecords;
}

export function addSleepRecord(record: Omit<SleepRecord, 'id'>): SleepRecord {
  const newRecord: SleepRecord = {
    ...record,
    id: `sr-${Date.now()}`,
  };
  sleepRecords.push(newRecord);
  return newRecord;
}

// Family members data
export const familyMembers: FamilyMember[] = [
  { id: 'f1', name: 'Maria Silva', relation: 'Mãe', birthDate: '1990-05-15', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop' },
  { id: 'f2', name: 'João Silva', relation: 'Pai', birthDate: '1988-03-22', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop' },
  { id: 'f3', name: 'Ana Santos', relation: 'Avó Materna', birthDate: '1965-08-10', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop', parentId: 'f1' },
  { id: 'f4', name: 'Carlos Santos', relation: 'Avô Materno', birthDate: '1963-11-30', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop', parentId: 'f1' },
  { id: 'f5', name: 'Helena Silva', relation: 'Avó Paterna', birthDate: '1967-02-18', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop', parentId: 'f2' },
  { id: 'f6', name: 'Pedro Silva', relation: 'Avô Paterno', birthDate: '1965-07-25', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop', parentId: 'f2' },
];

export function getFamilyMembers(): FamilyMember[] {
  return familyMembers;
}

export function addFamilyMember(member: Omit<FamilyMember, 'id'>): FamilyMember {
  const newMember: FamilyMember = {
    ...member,
    id: `f-${Date.now()}`,
  };
  familyMembers.push(newMember);
  return newMember;
}
