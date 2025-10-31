import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import { mockBackendAdapter } from "../lib/adapters/mockBackend";
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
} from "@/types";
import {
  calculateAge,
  getBabyAgeInDays,
  getAgeInMonths,
  getPlaceholdersForChapter as getPlaceholdersForChapterSource,
  babies as mockBabies,
  getChapters,
  getCurrentBaby,
  getMoments as getMockMoments,
  getGrowthMeasurements as getMockGrowthMeasurements,
  getVaccines as getMockVaccines,
  getSleepHumorEntries as getMockSleepHumorEntries,
  getSleepRecords as getMockSleepRecords,
  getFamilyMembers as getMockFamilyMembers,
} from "../lib/mockData";

type DataStatus = "idle" | "loading" | "ready" | "error";

interface BabyDataState {
  status: DataStatus;
  error?: string;
  babies: Baby[];
  chapters: Chapter[];
  currentBaby: Baby | null;
  moments: Moment[];
  growthMeasurements: GrowthMeasurement[];
  vaccines: VaccineRecord[];
  sleepHumorEntries: SleepHumorEntry[];
  sleepRecords: SleepRecord[];
  familyMembers: FamilyMember[];
}

const initialState: BabyDataState = {
  status: "idle",
  error: undefined,
  babies: [],
  chapters: [],
  currentBaby: null,
  moments: [],
  growthMeasurements: [],
  vaccines: [],
  sleepHumorEntries: [],
  sleepRecords: [],
  familyMembers: [],
};

type Action =
  | { type: "INIT_START" }
  | {
      type: "INIT_SUCCESS";
      payload: Omit<BabyDataState, "status" | "error">;
    }
  | { type: "INIT_FAILURE"; error: string }
  | { type: "SET_CURRENT_BABY"; payload: { babyId: string; baby: Baby } }
  | { type: "UPSERT_MOMENT"; payload: Moment }
  | { type: "DELETE_MOMENT"; payload: string }
  | { type: "SET_MOMENTS"; payload: Moment[] }
  | { type: "ADD_GROWTH_MEASUREMENT"; payload: GrowthMeasurement }
  | { type: "ADD_VACCINE"; payload: VaccineRecord }
  | { type: "UPDATE_VACCINE"; payload: VaccineRecord }
  | { type: "ADD_SLEEP_HUMOR_ENTRY"; payload: SleepHumorEntry }
  | { type: "ADD_SLEEP_RECORD"; payload: SleepRecord }
  | { type: "ADD_FAMILY_MEMBER"; payload: FamilyMember };

function reducer(state: BabyDataState, action: Action): BabyDataState {
  switch (action.type) {
    case "INIT_START":
      return { ...state, status: "loading", error: undefined };
    case "INIT_SUCCESS":
      return {
        status: "ready",
        error: undefined,
        ...action.payload,
      };
    case "INIT_FAILURE":
      return { ...state, status: "error", error: action.error };
    case "SET_CURRENT_BABY": {
      const { babyId, baby } = action.payload;
      return {
        ...state,
        currentBaby: baby,
        babies: state.babies.map((item) => ({
          ...item,
          isActive: item.id === babyId,
        })),
      };
    }
    case "UPSERT_MOMENT": {
      const existingIndex = state.moments.findIndex(
        (m) => m.id === action.payload.id
      );
      if (existingIndex === -1) {
        return { ...state, moments: [...state.moments, action.payload] };
      }
      const nextMoments = [...state.moments];
      nextMoments[existingIndex] = action.payload;
      return { ...state, moments: nextMoments };
    }
    case "SET_MOMENTS":
      return { ...state, moments: action.payload };
    case "DELETE_MOMENT":
      return {
        ...state,
        moments: state.moments.filter((moment) => moment.id !== action.payload),
      };
    case "ADD_GROWTH_MEASUREMENT":
      return {
        ...state,
        growthMeasurements: [...state.growthMeasurements, action.payload],
      };
    case "ADD_VACCINE":
      return {
        ...state,
        vaccines: [...state.vaccines, action.payload],
      };
    case "UPDATE_VACCINE":
      return {
        ...state,
        vaccines: state.vaccines.map((vaccine) =>
          vaccine.id === action.payload.id ? action.payload : vaccine
        ),
      };
    case "ADD_SLEEP_HUMOR_ENTRY":
      return {
        ...state,
        sleepHumorEntries: [...state.sleepHumorEntries, action.payload],
      };
    case "ADD_SLEEP_RECORD":
      return {
        ...state,
        sleepRecords: [...state.sleepRecords, action.payload],
      };
    case "ADD_FAMILY_MEMBER":
      return {
        ...state,
        familyMembers: [...state.familyMembers, action.payload],
      };
    default:
      return state;
  }
}

interface BabyDataContextValue extends BabyDataState {
  refreshMoments: () => Promise<void>;
  setCurrentBaby: (babyId: string) => Promise<Baby | null>;
  addMoment: (moment: Omit<Moment, "id">) => Promise<Moment | null>;
  updateMoment: (
    id: string,
    updates: Partial<Moment>
  ) => Promise<Moment | null>;
  deleteMoment: (id: string) => Promise<boolean>;
  addGrowthMeasurement: (
    measurement: Omit<GrowthMeasurement, "id">
  ) => Promise<GrowthMeasurement | null>;
  addVaccine: (
    vaccine: Omit<VaccineRecord, "id">
  ) => Promise<VaccineRecord | null>;
  updateVaccineRecord: (
    id: string,
    updates: Partial<VaccineRecord>
  ) => Promise<VaccineRecord | null>;
  addSleepHumorEntry: (
    entry: Omit<SleepHumorEntry, "id">
  ) => Promise<SleepHumorEntry | null>;
  addSleepRecord: (
    record: Omit<SleepRecord, "id">
  ) => Promise<SleepRecord | null>;
  addFamilyMember: (
    member: Omit<FamilyMember, "id">
  ) => Promise<FamilyMember | null>;
  getMoments: () => Moment[];
  getGrowthMeasurements: () => GrowthMeasurement[];
  getVaccines: () => VaccineRecord[];
  getSleepHumorEntries: () => SleepHumorEntry[];
  getSleepRecords: () => SleepRecord[];
  getFamilyMembers: () => FamilyMember[];
  getPlaceholdersForChapter: (
    chapterId: string,
    babyAgeInDaysOverride?: number
  ) => PlaceholderTemplate[];
  calculateAge: typeof calculateAge;
  getBabyAgeInDays: typeof getBabyAgeInDays;
  getAgeInMonths: typeof getAgeInMonths;
}

const BabyDataContext = createContext<BabyDataContextValue | undefined>(
  undefined
);

export function BabyDataProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // Carregar dados mock de forma assíncrona mas imediata para dev
    const loadData = () => {
      dispatch({ type: "INIT_START" });

      try {
        const babies = mockBabies;
        const currentBaby = getCurrentBaby();
        const moments = getMockMoments();
        const chapters = getChapters();
        const growthMeasurements = getMockGrowthMeasurements();
        const vaccines = getMockVaccines();
        const sleepHumorEntries = getMockSleepHumorEntries();
        const sleepRecords = getMockSleepRecords();
        const familyMembers = getMockFamilyMembers();

        dispatch({
          type: "INIT_SUCCESS",
          payload: {
            babies,
            chapters,
            currentBaby,
            moments,
            growthMeasurements,
            vaccines,
            sleepHumorEntries,
            sleepRecords,
            familyMembers,
          },
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Falha ao carregar dados iniciais";
        dispatch({ type: "INIT_FAILURE", error: message });
      }
    };

    // Carregar imediatamente
    loadData();
  }, []);

  const refreshMoments = useCallback(async () => {
    const moments = await mockBackendAdapter.fetchMoments();
    dispatch({ type: "SET_MOMENTS", payload: moments });
  }, []);

  const setCurrentBaby = useCallback(async (babyId: string) => {
    const baby = await mockBackendAdapter.selectCurrentBaby(babyId);
    if (!baby) return null;
    dispatch({ type: "SET_CURRENT_BABY", payload: { babyId, baby } });
    return baby;
  }, []);

  const addMoment = useCallback(async (moment: Omit<Moment, "id">) => {
    const created = await mockBackendAdapter.createMoment(moment);
    if (!created) return null;
    dispatch({ type: "UPSERT_MOMENT", payload: created });
    return created;
  }, []);

  const updateMoment = useCallback(
    async (id: string, updates: Partial<Moment>) => {
      const updated = await mockBackendAdapter.patchMoment(id, updates);
      if (!updated) return null;
      dispatch({ type: "UPSERT_MOMENT", payload: updated });
      return updated;
    },
    []
  );

  const deleteMoment = useCallback(async (id: string) => {
    const success = await mockBackendAdapter.removeMoment(id);
    if (success) {
      dispatch({ type: "DELETE_MOMENT", payload: id });
    }
    return success;
  }, []);

  const addGrowthMeasurement = useCallback(
    async (measurement: Omit<GrowthMeasurement, "id">) => {
      const created = await mockBackendAdapter.createGrowthMeasurement(
        measurement
      );
      if (!created) return null;
      dispatch({ type: "ADD_GROWTH_MEASUREMENT", payload: created });
      return created;
    },
    []
  );

  const addVaccine = useCallback(async (vaccine: Omit<VaccineRecord, "id">) => {
    const created = await mockBackendAdapter.createVaccine(vaccine);
    if (!created) return null;
    dispatch({ type: "ADD_VACCINE", payload: created });
    return created;
  }, []);

  const updateVaccineRecord = useCallback(
    async (id: string, updates: Partial<VaccineRecord>) => {
      const updated = await mockBackendAdapter.patchVaccine(id, updates);
      if (!updated) return null;
      dispatch({ type: "UPDATE_VACCINE", payload: updated });
      return updated;
    },
    []
  );

  const addSleepHumorEntry = useCallback(
    async (entry: Omit<SleepHumorEntry, "id">) => {
      const created = await mockBackendAdapter.createSleepHumorEntry(entry);
      if (!created) return null;
      dispatch({ type: "ADD_SLEEP_HUMOR_ENTRY", payload: created });
      return created;
    },
    []
  );

  const addSleepRecord = useCallback(
    async (record: Omit<SleepRecord, "id">) => {
      const created = await mockBackendAdapter.createSleepRecord(record);
      if (!created) return null;
      dispatch({ type: "ADD_SLEEP_RECORD", payload: created });
      return created;
    },
    []
  );

  const addFamilyMember = useCallback(
    async (member: Omit<FamilyMember, "id">) => {
      const created = await mockBackendAdapter.createFamilyMember(member);
      if (!created) return null;
      dispatch({ type: "ADD_FAMILY_MEMBER", payload: created });
      return created;
    },
    []
  );

  const getMoments = useCallback(() => state.moments, [state.moments]);
  const getGrowthMeasurements = useCallback(
    () => state.growthMeasurements,
    [state.growthMeasurements]
  );
  const getVaccines = useCallback(() => state.vaccines, [state.vaccines]);
  const getSleepHumorEntries = useCallback(
    () => state.sleepHumorEntries,
    [state.sleepHumorEntries]
  );
  const getSleepRecords = useCallback(
    () => state.sleepRecords,
    [state.sleepRecords]
  );
  const getFamilyMembers = useCallback(
    () => state.familyMembers,
    [state.familyMembers]
  );

  const getPlaceholdersForChapter = useCallback(
    (chapterId: string, babyAgeInDaysOverride?: number) => {
      const babyAge =
        babyAgeInDaysOverride ??
        (state.currentBaby ? getBabyAgeInDays(state.currentBaby.birthDate) : 0);
      return getPlaceholdersForChapterSource(chapterId, babyAge);
    },
    [state.currentBaby]
  );

  const value = useMemo<BabyDataContextValue>(
    () => ({
      ...state,
      refreshMoments,
      setCurrentBaby,
      addMoment,
      updateMoment,
      deleteMoment,
      addGrowthMeasurement,
      addVaccine,
      updateVaccineRecord,
      addSleepHumorEntry,
      addSleepRecord,
      addFamilyMember,
      getMoments,
      getGrowthMeasurements,
      getVaccines,
      getSleepHumorEntries,
      getSleepRecords,
      getFamilyMembers,
      getPlaceholdersForChapter,
      calculateAge,
      getBabyAgeInDays,
      getAgeInMonths,
    }),
    [
      state,
      refreshMoments,
      setCurrentBaby,
      addMoment,
      updateMoment,
      deleteMoment,
      addGrowthMeasurement,
      addVaccine,
      updateVaccineRecord,
      addSleepHumorEntry,
      addSleepRecord,
      addFamilyMember,
      getMoments,
      getGrowthMeasurements,
      getVaccines,
      getSleepHumorEntries,
      getSleepRecords,
      getFamilyMembers,
      getPlaceholdersForChapter,
    ]
  );

  return (
    <BabyDataContext.Provider value={value}>
      {children}
    </BabyDataContext.Provider>
  );
}

export function useBabyData(): BabyDataContextValue {
  const context = useContext(BabyDataContext);
  if (!context) {
    throw new Error(
      "useBabyData deve ser utilizado dentro de BabyDataProvider"
    );
  }
  return context;
}

