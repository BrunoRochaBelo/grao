import { createContext, useContext } from "react";
import type { Chapter, Moment } from "@/types";

interface NavigationActions {
  goToGrowth?: () => void;
  goToVaccines?: () => void;
  goToConsultations?: () => void;
  goToSleepHumor?: () => void;
  goToFamilyTree?: () => void;
  goToChapters?: () => void;
  goToMomentsGallery?: () => void;
  openTemplate?: (chapterId: string, templateId: string) => void;
  openChapter?: (chapter: Chapter) => void;
  openMoment?: (moment: Moment) => void;
}

const NavigationContext = createContext<NavigationActions>({});

export function NavigationProvider({
  value,
  children,
}: {
  value: NavigationActions;
  children: React.ReactNode;
}) {
  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigationActions(): NavigationActions {
  return useContext(NavigationContext);
}

