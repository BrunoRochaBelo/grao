
import {
  Baby,
  Chapter,
  FamilyMember,
  GrowthMeasurement,
  Moment,
  SleepHumorEntry,
  SleepRecord,
  VaccineRecord,
} from '../types';
import {
  babies,
  chapters,
  familyMembers,
  growthMeasurements,
  moments,
  sleepHumorEntries,
  sleepRecords,
  vaccines,
  getCurrentBaby,
  setCurrentBaby,
  addMoment,
  updateMoment,
  deleteMoment,
  addGrowthMeasurement,
  addVaccine,
  updateVaccine,
  addSleepHumorEntry,
  addSleepRecord,
  addFamilyMember,
} from '../mockData';

// This is a placeholder for a future API client.
// For now, it will just simulate API calls with a delay.

const MOCK_DELAY = 500;

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const apiClient = {
  async getBabies(): Promise<Baby[]> {
    await delay(MOCK_DELAY);
    return babies;
  },
  async getChapters(): Promise<Chapter[]> {
    await delay(MOCK_DELAY);
    return chapters;
  },
  async getCurrentBaby(): Promise<Baby | null> {
    await delay(MOCK_DELAY);
    return getCurrentBaby();
  },
  async selectCurrentBaby(babyId: string): Promise<Baby | null> {
    await delay(MOCK_DELAY);
    setCurrentBaby(babyId);
    return getCurrentBaby();
  },
  async getMoments(): Promise<Moment[]> {
    await delay(MOCK_DELAY);
    return moments;
  },
  async createMoment(moment: Omit<Moment, 'id'>): Promise<Moment | null> {
    await delay(MOCK_DELAY);
    return addMoment(moment);
  },
  async updateMoment(id: string, updates: Partial<Moment>): Promise<Moment | null> {
    await delay(MOCK_DELAY);
    return updateMoment(id, updates);
  },
  async deleteMoment(id: string): Promise<boolean> {
    await delay(MOCK_DELAY);
    return deleteMoment(id);
  },
  async getGrowthMeasurements(): Promise<GrowthMeasurement[]> {
    await delay(MOCK_DELAY);
    return growthMeasurements;
  },
  async createGrowthMeasurement(measurement: Omit<GrowthMeasurement, 'id'>): Promise<GrowthMeasurement | null> {
    await delay(MOCK_DELAY);
    return addGrowthMeasurement(measurement);
  },
  async getVaccines(): Promise<VaccineRecord[]> {
    await delay(MOCK_DELAY);
    return vaccines;
  },
  async createVaccine(vaccine: Omit<VaccineRecord, 'id'>): Promise<VaccineRecord | null> {
    await delay(MOCK_DELAY);
    return addVaccine(vaccine);
  },
  async updateVaccine(id: string, updates: Partial<VaccineRecord>): Promise<VaccineRecord | null> {
    await delay(MOCK_DELAY);
    return updateVaccine(id, updates);
  },
  async getSleepHumorEntries(): Promise<SleepHumorEntry[]> {
    await delay(MOCK_DELAY);
    return sleepHumorEntries;
  },
  async createSleepHumorEntry(entry: Omit<SleepHumorEntry, 'id'>): Promise<SleepHumorEntry | null> {
    await delay(MOCK_DELAY);
    return addSleepHumorEntry(entry);
  },
  async getSleepRecords(): Promise<SleepRecord[]> {
    await delay(MOCK_DELAY);
    return sleepRecords;
  },
  async createSleepRecord(record: Omit<SleepRecord, 'id'>): Promise<SleepRecord | null> {
    await delay(MOCK_DELAY);
    return addSleepRecord(record);
  },
  async getFamilyMembers(): Promise<FamilyMember[]> {
    await delay(MOCK_DELAY);
    return familyMembers;
  },
  async createFamilyMember(member: Omit<FamilyMember, 'id'>): Promise<FamilyMember | null> {
    await delay(MOCK_DELAY);
    return addFamilyMember(member);
  },
};
