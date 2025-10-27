import { useMemo } from "react";
import { Moment } from "@/lib/types";
import { groupMomentsByMonth, TimelineGroup } from "../utils/timelineUtils";

export function useTimelineGroups(moments: Moment[]): TimelineGroup[] {
  return useMemo(() => {
    // Apenas momentos publicados
    const published = moments.filter((m) => m.status === "published");
    return groupMomentsByMonth(published);
  }, [moments]);
}
