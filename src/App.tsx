import { useEffect, useState } from 'react';
import { BottomNav } from './components/layout/BottomNav';
import { HomeScreen } from './components/home/HomeScreen';
import { GalleryScreen } from './components/gallery/GalleryScreen';
import { ChaptersScreen } from './components/chapters/ChaptersScreen';
import { ChapterDetail } from './components/chapters/ChapterDetail';
import { NotificationsScreen } from './components/notifications/NotificationsScreen';
import { ProfileScreen } from './components/profile/ProfileScreen';
import { AddMomentSheet } from './components/chapters/AddMomentSheet';
import { MomentForm } from './components/moments/MomentForm';
import { MomentDetailScreen } from './components/moments/MomentDetailScreen';
import { GrowthScreen } from './components/health/GrowthScreen';
import { VaccinesScreen } from './components/health/VaccinesScreen';
import { SleepHumorScreen } from './components/health/SleepHumorScreen';
import { FamilyTreeScreen } from './components/family/FamilyTreeScreen';
import { motion, AnimatePresence } from 'motion/react';
import { Toaster } from './components/ui/sonner';
import {
  Chapter,
  PlaceholderTemplate,
  Moment,
  FamilyMember,
  chapters,
  currentBaby,
  getBabyAgeInDays,
  getMoments,
  getPlaceholdersForChapter,
} from './lib/mockData';
import { ThemeProvider } from './lib/theme-context';
import { FamilyMemberDetailScreen } from './components/family/FamilyMemberDetailScreen';

type Screen = 'home' | 'gallery' | 'chapters' | 'notifications' | 'profile';
type ViewState = 
  | { type: 'main'; screen: Screen }
  | { type: 'chapter-detail'; chapter: Chapter }
  | { type: 'moment-form'; template: PlaceholderTemplate; chapter: Chapter }
  | { type: 'moment-detail'; moment: Moment }
  | { type: 'growth' }
  | { type: 'vaccines' }
  | { type: 'sleep-humor' }
  | { type: 'family-tree' }
  | { type: 'family-member-detail'; member: FamilyMember };

export default function App() {
  const [viewStack, setViewStack] = useState<ViewState[]>([{ type: 'main', screen: 'home' }]);
  const [showAddMoment, setShowAddMoment] = useState(false);

  const currentView = viewStack[viewStack.length - 1];

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [currentView]);

  const navigateTo = (view: ViewState) => {
    setViewStack(prev => [...prev, view]);
  };

  const goBack = () => {
    if (viewStack.length > 1) {
      setViewStack(prev => prev.slice(0, -1));
    }
  };

  const navigateToMain = (screen: Screen) => {
    setViewStack([{ type: 'main', screen }]);
  };

  const openChapter = (chapterId: string) => {
    const chapterData = chapters.find(chapter => chapter.id === chapterId);
    if (!chapterData) return;
    navigateTo({ type: 'chapter-detail', chapter: chapterData });
  };

  const openChapterTemplate = (chapterId: string, templateId: string) => {
    const chapterData = chapters.find(chapter => chapter.id === chapterId);
    if (!chapterData) return;

    const placeholders = getPlaceholdersForChapter(
      chapterId,
      getBabyAgeInDays(currentBaby.birthDate),
    );
    const template = placeholders.find(item => item.id === templateId);

    navigateTo({ type: 'chapter-detail', chapter: chapterData });

    if (template) {
      navigateTo({ type: 'moment-form', template, chapter: chapterData });
    }
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'chapters') {
      setShowAddMoment(true);
    } else {
      navigateToMain(tab as Screen);
    }
  };

  const isNavigatedToChapters = () => {
    // Check if we navigated to chapters from another screen (not from bottom nav)
    return currentView.type === 'main' && currentView.screen === 'chapters' && viewStack.length > 1;
  };

  const handleSelectChapter = (chapter: Chapter) => {
    navigateTo({ type: 'chapter-detail', chapter });
  };

  const handleOpenTemplate = (template: PlaceholderTemplate, chapter: Chapter) => {
    navigateTo({ type: 'moment-form', template, chapter });
  };

  const handleMomentSaved = () => {
    // Refresh the view by going back
    goBack();
  };

  const renderCurrentView = () => {
    if (currentView.type === 'main') {
      switch (currentView.screen) {
        case 'home':
          return (
            <HomeScreen
              onNavigateToGrowth={() => navigateTo({ type: 'growth' })}
              onNavigateToVaccines={() => navigateTo({ type: 'vaccines' })}
              onNavigateToSleepHumor={() => navigateTo({ type: 'sleep-humor' })}
              onNavigateToFamily={() => navigateTo({ type: 'family-tree' })}
              onNavigateToChapters={() => navigateTo({ type: 'main', screen: 'chapters' })}
              onOpenTemplate={openChapterTemplate}
              onOpenChapter={handleSelectChapter}
            />
          );
        case 'gallery':
          return <GalleryScreen onSelectMoment={(moment) => navigateTo({ type: 'moment-detail', moment })} />;
        case 'chapters':
          return <ChaptersScreen onSelectChapter={handleSelectChapter} onBack={isNavigatedToChapters() ? goBack : undefined} />;
        case 'notifications':
          return <NotificationsScreen />;
        case 'profile':
          return <ProfileScreen />;
      }
    } else if (currentView.type === 'chapter-detail') {
      return (
        <ChapterDetail
          chapter={currentView.chapter}
          onBack={goBack}
          onOpenTemplate={(template) => handleOpenTemplate(template, currentView.chapter)}
        />
      );
    } else if (currentView.type === 'growth') {
      return <GrowthScreen onBack={goBack} />;
    } else if (currentView.type === 'vaccines') {
      return (
        <VaccinesScreen
          onBack={goBack}
          onOpenTemplate={(template, chapter) => handleOpenTemplate(template, chapter)}
        />
      );
    } else if (currentView.type === 'sleep-humor') {
      return <SleepHumorScreen onBack={goBack} />;
    } else if (currentView.type === 'family-tree') {
      return (
        <FamilyTreeScreen
          onBack={goBack}
          onOpenTemplate={(chapterId, templateId) => openChapterTemplate(chapterId, templateId)}
          onSelectMember={(member) => navigateTo({ type: 'family-member-detail', member })}
        />
      );
    } else if (currentView.type === 'family-member-detail') {
      return (
        <FamilyMemberDetailScreen
          member={currentView.member}
          onBack={goBack}
          onSelectMoment={(momentId) => {
            const moment = getMoments().find((m) => m.id === momentId);
            if (moment) {
              navigateTo({ type: 'moment-detail', moment });
            }
          }}
        />
      );
    } else if (currentView.type === 'moment-detail') {
      return <MomentDetailScreen moment={currentView.moment} onBack={goBack} />;
    }
    return null;
  };

  const getCurrentTab = (): string => {
    if (currentView.type === 'main') {
      return currentView.screen;
    } else if (currentView.type === 'chapter-detail') {
      return 'chapters';
    }
    return 'home';
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <AnimatePresence mode="wait">
          <motion.div
            key={viewStack.length}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="min-h-screen"
          >
            {renderCurrentView()}
          </motion.div>
        </AnimatePresence>

        {/* Only show bottom nav on main screens */}
        {currentView.type === 'main' && (
          <BottomNav activeTab={getCurrentTab()} onTabChange={handleTabChange} />
        )}

        <AddMomentSheet
          isOpen={showAddMoment}
          onClose={() => setShowAddMoment(false)}
          onSelectChapter={(chapter) => {
            setShowAddMoment(false);
            handleSelectChapter(chapter);
          }}
        />

        {currentView.type === 'moment-form' && (
          <MomentForm
            isOpen={true}
            onClose={goBack}
            template={currentView.template}
            chapter={currentView.chapter}
            onSave={handleMomentSaved}
          />
        )}

        <Toaster />
      </div>
    </ThemeProvider>
  );
}
