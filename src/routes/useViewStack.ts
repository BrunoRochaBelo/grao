import { useCallback, useMemo, useState } from "react";
import type { Screen, ViewState } from "./types";

export interface ViewStackController {
  stack: ViewState[];
  current: ViewState;
  push: (view: ViewState) => void;
  pop: () => void;
  replaceMain: (screen: Screen) => void;
}

export function useViewStack(initialViews: ViewState[]): ViewStackController {
  const [stack, setStack] = useState<ViewState[]>(() => initialViews);

  const push = useCallback((view: ViewState) => {
    setStack((prev) => [...prev, view]);
  }, []);

  const pop = useCallback(() => {
    setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  const replaceMain = useCallback((screen: Screen) => {
    setStack([{ type: "main", screen }]);
  }, []);

  const current = useMemo(
    () => stack[stack.length - 1],
    [stack, stack.length]
  );

  return { stack, current, push, pop, replaceMain };
}
