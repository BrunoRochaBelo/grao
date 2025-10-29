import {
  addFamilyMember,
  addGrowthMeasurement,
  addMoment,
  addSleepHumorEntry,
  addSleepRecord,
  addVaccine,
  babies as mockBabies,
  chapters as mockChapters,
  deleteMoment,
  getCurrentBaby,
  getFamilyMembers,
  getGrowthMeasurements,
  getMoments,
  getSleepHumorEntries,
  getSleepRecords,
  getVaccines,
  initializeMoments,
  setCurrentBaby,
  updateMoment,
  updateVaccine,
} from "../mockData";
import {
  Baby,
  Chapter,
  FamilyMember,
  GrowthMeasurement,
  Moment,
  SleepHumorEntry,
  SleepRecord,
  VaccineRecord,
} from "@/types";

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const delay = (ms = 80) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function bootstrapMockStorage(): Promise<void> {
  initializeMoments();
}

export async function fetchBabies(): Promise<Baby[]> {
  await delay();
  return clone(mockBabies);
}

export async function fetchChapters(): Promise<Chapter[]> {
  await delay();
  return clone(mockChapters);
}

export async function fetchCurrentBaby(): Promise<Baby> {
  await delay();
  return clone(getCurrentBaby());
}

export async function selectCurrentBaby(babyId: string): Promise<Baby | null> {
  await delay();
  const existing = mockBabies.find((baby) => baby.id === babyId);
  if (!existing) {
    return null;
  }
  setCurrentBaby(babyId);
  return clone(getCurrentBaby());
}

export async function fetchMoments(): Promise<Moment[]> {
  await delay();
  return clone(getMoments());
}

export async function createMoment(
  moment: Omit<Moment, "id">
): Promise<Moment> {
  await delay();
  return clone(addMoment(moment));
}

export async function patchMoment(
  id: string,
  updates: Partial<Moment>
): Promise<Moment | null> {
  await delay();
  const updated = updateMoment(id, updates);
  return updated ? clone(updated) : null;
}

export async function removeMoment(id: string): Promise<boolean> {
  await delay();
  return deleteMoment(id);
}

export async function fetchGrowthMeasurements(): Promise<GrowthMeasurement[]> {
  await delay();
  return clone(getGrowthMeasurements());
}

export async function createGrowthMeasurement(
  measurement: Omit<GrowthMeasurement, "id">
): Promise<GrowthMeasurement> {
  await delay();
  return clone(addGrowthMeasurement(measurement));
}

export async function fetchVaccines(): Promise<VaccineRecord[]> {
  await delay();
  return clone(getVaccines());
}

export async function createVaccine(
  vaccine: Omit<VaccineRecord, "id">
): Promise<VaccineRecord> {
  await delay();
  return clone(addVaccine(vaccine));
}

export async function patchVaccine(
  id: string,
  updates: Partial<VaccineRecord>
): Promise<VaccineRecord | null> {
  await delay();
  const updated = updateVaccine(id, updates);
  return updated ? clone(updated) : null;
}

export async function fetchSleepHumorEntries(): Promise<SleepHumorEntry[]> {
  await delay();
  return clone(getSleepHumorEntries());
}

export async function createSleepHumorEntry(
  entry: Omit<SleepHumorEntry, "id">
): Promise<SleepHumorEntry> {
  await delay();
  return clone(addSleepHumorEntry(entry));
}

export async function fetchSleepRecords(): Promise<SleepRecord[]> {
  await delay();
  return clone(getSleepRecords());
}

export async function createSleepRecord(
  record: Omit<SleepRecord, "id">
): Promise<SleepRecord> {
  await delay();
  return clone(addSleepRecord(record));
}

export async function fetchFamilyMembers(): Promise<FamilyMember[]> {
  await delay();
  return clone(getFamilyMembers());
}

export async function createFamilyMember(
  member: Omit<FamilyMember, "id">
): Promise<FamilyMember> {
  await delay();
  return clone(addFamilyMember(member));
}

export type MockBackendAdapter = {
  fetchBabies: typeof fetchBabies;
  fetchChapters: typeof fetchChapters;
  fetchCurrentBaby: typeof fetchCurrentBaby;
  selectCurrentBaby: typeof selectCurrentBaby;
  fetchMoments: typeof fetchMoments;
  createMoment: typeof createMoment;
  patchMoment: typeof patchMoment;
  removeMoment: typeof removeMoment;
  fetchGrowthMeasurements: typeof fetchGrowthMeasurements;
  createGrowthMeasurement: typeof createGrowthMeasurement;
  fetchVaccines: typeof fetchVaccines;
  createVaccine: typeof createVaccine;
  patchVaccine: typeof patchVaccine;
  fetchSleepHumorEntries: typeof fetchSleepHumorEntries;
  createSleepHumorEntry: typeof createSleepHumorEntry;
  fetchSleepRecords: typeof fetchSleepRecords;
  createSleepRecord: typeof createSleepRecord;
  fetchFamilyMembers: typeof fetchFamilyMembers;
  createFamilyMember: typeof createFamilyMember;
};

export const mockBackendAdapter: MockBackendAdapter = {
  fetchBabies,
  fetchChapters,
  fetchCurrentBaby,
  selectCurrentBaby,
  fetchMoments,
  createMoment,
  patchMoment,
  removeMoment,
  fetchGrowthMeasurements,
  createGrowthMeasurement,
  fetchVaccines,
  createVaccine,
  patchVaccine,
  fetchSleepHumorEntries,
  createSleepHumorEntry,
  fetchSleepRecords,
  createSleepRecord,
  fetchFamilyMembers,
  createFamilyMember,
};
