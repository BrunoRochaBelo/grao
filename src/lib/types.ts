// Shared domain types for the baby data layer

export interface Baby {
  id: string;
  name: string;
  birthDate: string;
  city: string;
  avatar: string;
  gender?: 'male' | 'female' | 'other';
  isActive?: boolean;
  notes?: string;
}

export interface GrowthMeasurement {
  id: string;
  date: string;
  age: string;
  weight: number;
  height: number;
  headCircumference?: number;
  notes?: string;
}

export interface VaccineRecord {
  id: string;
  name: string;
  date?: string;
  ageRecommended: number;
  dose: string;
  lot?: string;
  location?: string;
  status: 'completed' | 'pending' | 'scheduled';
  notes?: string;
}

export interface SleepHumorEntry {
  id: string;
  date: string;
  sleepHours: number;
  sleepQuality: 'excellent' | 'good' | 'fair' | 'poor';
  mood: 'happy' | 'calm' | 'fussy' | 'crying' | 'sleepy';
  notes?: string;
}

export interface SleepRecord {
  id: string;
  date: string;
  type: 'sleep' | 'nap';
  duration: number;
  mood: string;
  notes?: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  birthDate?: string;
  avatar?: string;
  parentId?: string;
  order?: number;
}

export interface Chapter {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  total: number;
  completed: number;
  cover?: string;
}

export interface PlaceholderTemplate {
  id: string;
  name: string;
  icon: string;
  description: string;
  templateType:
    | 'mesversario'
    | 'primeira-vez'
    | 'consulta'
    | 'vacina'
    | 'medida'
    | 'carta'
    | 'nota'
    | 'evento'
    | 'arte';
  ageRangeStart: number;
  ageRangeEnd?: number;
  isCompleted: boolean;
  momentId?: string;
  allowMultiple?: boolean;
}

export interface Moment {
  id: string;
  chapterId: string;
  templateId?: string;
  title: string;
  date: string;
  age: string;
  location?: string;
  people?: string[];
  media: string[];
  noteShort?: string;
  noteLong?: string;
  tags?: string[];
  isPrivate?: boolean;
  hasVideo?: boolean;
  privacy: 'private' | 'people' | 'link';
  status: 'published' | 'draft';
  extraData?: Record<string, unknown>;
}
