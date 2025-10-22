import { createContext, useContext, useState, ReactNode } from 'react';
import { Chapter, PlaceholderTemplate } from './mockData';

interface NavigationState {
  screen: 'home' | 'gallery' | 'chapters' | 'search' | 'profile' | 'chapter-detail' | 'moment-form' | 'moment-view';
  chapterDetail?: Chapter;
  templateDetail?: PlaceholderTemplate;
  momentId?: string;
  retroactiveDate?: string;
}

interface NavigationContextType {
  state: NavigationState;
  navigateTo: (screen: NavigationState['screen'], data?: Partial<NavigationState>) => void;
  goBack: () => void;
  canGoBack: boolean;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<NavigationState[]>([{ screen: 'home' }]);

  const navigateTo = (screen: NavigationState['screen'], data?: Partial<NavigationState>) => {
    const newState: NavigationState = { screen, ...data };
    setHistory(prev => [...prev, newState]);
  };

  const goBack = () => {
    if (history.length > 1) {
      setHistory(prev => prev.slice(0, -1));
    }
  };

  const currentState = history[history.length - 1];
  const canGoBack = history.length > 1;

  return (
    <NavigationContext.Provider value={{ state: currentState, navigateTo, goBack, canGoBack }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}
