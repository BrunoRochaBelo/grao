import { useEffect, useState, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BottomNav } from "./layout/BottomNav";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { ThemeProvider } from "./lib/theme-context";
import { BabyDataProvider, useBabyData } from "./lib/baby-data-context";
import {
  Baby,
  Chapter,
  FamilyMember,
  Moment,
  PlaceholderTemplate,
} from "./lib/types";
import { SplashScreen } from "./features/onboarding/SplashScreen";
import { AuthScreen } from "./features/onboarding/AuthScreen";
import { BabySelectorModal } from "./features/baby/BabySelectorModal";

// Lazy load todas as telas principais para melhor performance
const HomeScreen = lazy(() =>
  import("./features/home/HomeScreen").then((m) => ({ default: m.HomeScreen }))
);
const GalleryScreen = lazy(() =>
  import("./features/gallery/GalleryScreen").then((m) => ({
    default: m.GalleryScreen,
  }))
);
const ChaptersScreen = lazy(() =>
  import("./features/chapters/ChaptersScreen").then((m) => ({
    default: m.ChaptersScreen,
  }))
);
const ChapterDetail = lazy(() =>
  import("./features/chapters/ChapterDetail").then((m) => ({
    default: m.ChapterDetail,
  }))
);
const NotificationsScreen = lazy(() =>
  import("./features/notifications/NotificationsScreen").then((m) => ({
    default: m.NotificationsScreen,
  }))
);
const ProfileScreen = lazy(() =>
  import("./features/profile/ProfileScreen").then((m) => ({
    default: m.ProfileScreen,
  }))
);
const ManageBabiesScreen = lazy(() =>
  import("./features/profile/ManageBabiesScreen").then((m) => ({
    default: m.ManageBabiesScreen,
  }))
);
const EditBabyScreen = lazy(() =>
  import("./features/profile/EditBabyScreen").then((m) => ({
    default: m.EditBabyScreen,
  }))
);
const ExportAlbumScreen = lazy(() =>
  import("./features/profile/ExportAlbumScreen").then((m) => ({
    default: m.ExportAlbumScreen,
  }))
);
const ManageAccountScreen = lazy(() =>
  import("./features/profile/ManageAccountScreen").then((m) => ({
    default: m.ManageAccountScreen,
  }))
);
const NotificationsSettingsScreen = lazy(() =>
  import("./features/profile/NotificationsSettingsScreen").then((m) => ({
    default: m.NotificationsSettingsScreen,
  }))
);
const HelpAndSupportScreen = lazy(() =>
  import("./features/profile/HelpAndSupportScreen").then((m) => ({
    default: m.HelpAndSupportScreen,
  }))
);
const AddMomentSheet = lazy(() =>
  import("./features/chapters/AddMomentSheet").then((m) => ({
    default: m.AddMomentSheet,
  }))
);
const MomentForm = lazy(() =>
  import("./features/moments/MomentForm").then((m) => ({
    default: m.MomentForm,
  }))
);
const MomentDetailScreen = lazy(() =>
  import("./features/moments/MomentDetailScreen").then((m) => ({
    default: m.MomentDetailScreen,
  }))
);
const MomentsScreen = lazy(() =>
  import("./features/moments/MomentsScreen").then((m) => ({
    default: m.MomentsScreen,
  }))
);
const GrowthScreen = lazy(() =>
  import("./features/health/GrowthScreen").then((m) => ({
    default: m.GrowthScreen,
  }))
);
const VaccinesScreen = lazy(() =>
  import("./features/health/VaccinesScreen").then((m) => ({
    default: m.VaccinesScreen,
  }))
);
const ConsultationsScreen = lazy(() =>
  import("./features/health/ConsultationsScreen").then((m) => ({
    default: m.ConsultationsScreen,
  }))
);
const SleepHumorScreen = lazy(() =>
  import("./features/health/SleepHumorScreen").then((m) => ({
    default: m.SleepHumorScreen,
  }))
);
const FamilyTreeScreen = lazy(() =>
  import("./features/family/FamilyTreeScreen").then((m) => ({
    default: m.FamilyTreeScreen,
  }))
);
const FamilyMemberDetailScreen = lazy(() =>
  import("./features/family/FamilyMemberDetailScreen").then((m) => ({
    default: m.FamilyMemberDetailScreen,
  }))
);

// Loading fallback component
const ScreenLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

type Screen =
  | "home"
  | "gallery"
  | "moments"
  | "chapters"
  | "notifications"
  | "profile";
type ViewState =
  | { type: "main"; screen: Screen }
  | { type: "chapter-detail"; chapter: Chapter }
  | { type: "moment-form"; template: PlaceholderTemplate; chapter: Chapter }
  | { type: "moment-detail"; moment: Moment }
  | { type: "growth" }
  | { type: "vaccines" }
  | { type: "consultations" }
  | { type: "sleep-humor" }
  | { type: "family-tree" }
  | { type: "family-member-detail"; member: FamilyMember }
  | { type: "manage-babies" }
  | { type: "edit-baby"; baby: Baby }
  | { type: "add-baby" }
  | { type: "export-album" }
  | { type: "manage-account" }
  | { type: "notifications-settings" }
  | { type: "help-and-support" }
  | { type: "splash" }
  | { type: "auth" }
  | { type: "baby-selector" };

function AppContent() {
  const [viewStack, setViewStack] = useState<ViewState[]>(
    process.env.NODE_ENV === "development"
      ? [{ type: "main", screen: "home" }]
      : [{ type: "splash" }]
  );
  const [showAddMoment, setShowAddMoment] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null);
  const [accumulatedScroll, setAccumulatedScroll] = useState(0);

  const {
    status,
    error,
    chapters,
    currentBaby,
    getMoments,
    getPlaceholdersForChapter,
    refreshMoments,
  } = useBabyData();

  const currentView = viewStack[viewStack.length - 1];

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "auto" });
    // Garante que a nav está visível ao mudar de tela
    setIsNavVisible(true);
  }, [currentView]);

  const navigateTo = (view: ViewState) => {
    setViewStack((prev) => [...prev, view]);
  };

  const goBack = () => {
    if (viewStack.length > 1) {
      setViewStack((prev) => prev.slice(0, -1));
    }
  };

  const navigateToMain = (screen: Screen) => {
    setViewStack([{ type: "main", screen }]);
  };

  const openChapter = (chapterId: string) => {
    const chapterData = chapters.find((chapter) => chapter.id === chapterId);
    if (!chapterData) return;
    navigateTo({ type: "chapter-detail", chapter: chapterData });
  };

  const openChapterTemplate = (chapterId: string, templateId: string) => {
    const chapterData = chapters.find((chapter) => chapter.id === chapterId);
    if (!chapterData) return;

    const placeholders = getPlaceholdersForChapter(chapterId);
    const template = placeholders.find((item) => item.id === templateId);

    navigateTo({ type: "chapter-detail", chapter: chapterData });

    if (template) {
      navigateTo({ type: "moment-form", template, chapter: chapterData });
    }
  };

  const handleTabChange = (tab: string) => {
    if (tab === "chapters") {
      setShowAddMoment(true);
    } else {
      const screenMap: Record<string, Screen> = {
        home: "home",
        gallery: "gallery",
        moments: "moments",
        whispers: "notifications",
        profile: "profile",
      };
      navigateToMain(screenMap[tab] || "home");
    }
  };

  const isNavigatedToChapters = () => {
    return (
      currentView.type === "main" &&
      currentView.screen === "chapters" &&
      viewStack.length > 1
    );
  };

  const handleSelectChapter = (chapter: Chapter) => {
    navigateTo({ type: "chapter-detail", chapter });
  };

  const handleOpenTemplate = (
    template: PlaceholderTemplate,
    chapter: Chapter
  ) => {
    navigateTo({ type: "moment-form", template, chapter });
  };

  const handleMomentSaved = async () => {
    await refreshMoments();
    goBack();
  };

  const handleSplashComplete = () => {
    navigateTo({ type: "auth" });
  };

  const handleLogin = async (email: string, password: string) => {
    // Simulate login
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Aguardar um pouco para a animação de saída completar
    setTimeout(() => {
      navigateToMain("home");
    }, 100);
  };

  const handleSignup = async (email: string, password: string) => {
    // Simulate signup
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Aguardar um pouco para a animação de saída completar
    setTimeout(() => {
      navigateToMain("home");
    }, 100);
  };

  const handleNewAction = (action: string) => {
    // Handle FAB actions: 'note', 'moment', 'letter'
    if (action === "moment") {
      setShowAddMoment(true);
    } else {
      toast.info(`${action} em desenvolvimento`);
    }
  };

  // Helper para envolver componentes lazy em Suspense
  const renderWithSuspense = (
    Component: React.LazyExoticComponent<any>,
    props: any
  ) => (
    <Suspense fallback={<ScreenLoader />}>
      <Component {...props} />
    </Suspense>
  );

  const renderCurrentView = () => {
    if (currentView.type === "splash") {
      return <SplashScreen onComplete={handleSplashComplete} />;
    }

    if (process.env.NODE_ENV !== "development" && currentView.type === "auth") {
      return <AuthScreen onLogin={handleLogin} onSignup={handleSignup} />;
    }

    if (currentView.type === "main") {
      switch (currentView.screen) {
        case "home":
          return renderWithSuspense(HomeScreen, {
            onNavigateToGrowth: () => navigateTo({ type: "growth" }),
            onNavigateToVaccines: () => navigateTo({ type: "vaccines" }),
            onNavigateToConsultations: () =>
              navigateTo({ type: "consultations" }),
            onNavigateToSleepHumor: () => navigateTo({ type: "sleep-humor" }),
            onNavigateToFamily: () => navigateTo({ type: "family-tree" }),
            onNavigateToChapters: () =>
              navigateTo({ type: "main", screen: "chapters" }),
            onNavigateToMoments: () => navigateToMain("gallery"),
            onOpenTemplate: openChapterTemplate,
            onOpenChapter: handleSelectChapter,
          });
        case "gallery":
          return renderWithSuspense(GalleryScreen, {
            onSelectMoment: (moment: Moment) =>
              navigateTo({ type: "moment-detail", moment }),
          });
        case "moments":
          return renderWithSuspense(MomentsScreen, {
            onBack: goBack,
            onEditMoment: (moment: Moment) =>
              navigateTo({ type: "moment-detail", moment }),
          });
        case "chapters":
          return renderWithSuspense(ChaptersScreen, {
            onSelectChapter: handleSelectChapter,
            onBack: isNavigatedToChapters() ? goBack : undefined,
          });
        case "notifications":
          return renderWithSuspense(NotificationsScreen, {});
        case "profile":
          return renderWithSuspense(ProfileScreen, {
            onNavigateToManageBabies: () =>
              navigateTo({ type: "manage-babies" }),
            onNavigateToExportAlbum: () => navigateTo({ type: "export-album" }),
            onNavigateToManageAccount: () =>
              navigateTo({ type: "manage-account" }),
            onNavigateToNotificationsSettings: () =>
              navigateTo({ type: "notifications-settings" }),
            onNavigateToHelpAndSupport: () =>
              navigateTo({ type: "help-and-support" }),
            onNavigateToAddBaby: () => navigateTo({ type: "add-baby" }),
            onNavigateToMoments: () => navigateToMain("gallery"),
            onNavigateToChapters: () => navigateToMain("chapters"),
            onNavigateToMedia: () => navigateToMain("gallery"),
            onEditBaby: () => {
              if (currentBaby) {
                navigateTo({ type: "edit-baby", baby: currentBaby });
              }
            },
          });
      }
    } else if (currentView.type === "chapter-detail") {
      return renderWithSuspense(ChapterDetail, {
        chapter: currentView.chapter,
        onBack: goBack,
        onOpenTemplate: (template: PlaceholderTemplate) =>
          handleOpenTemplate(template, currentView.chapter),
      });
    } else if (currentView.type === "growth") {
      return renderWithSuspense(GrowthScreen, { onBack: goBack });
    } else if (currentView.type === "vaccines") {
      return renderWithSuspense(VaccinesScreen, {
        onBack: goBack,
        onOpenTemplate: (template: PlaceholderTemplate, chapter: Chapter) =>
          handleOpenTemplate(template, chapter),
      });
    } else if (currentView.type === "consultations") {
      return renderWithSuspense(ConsultationsScreen, {
        onBack: goBack,
        onOpenTemplate: (template: PlaceholderTemplate, chapter: Chapter) =>
          handleOpenTemplate(template, chapter),
      });
    } else if (currentView.type === "sleep-humor") {
      return renderWithSuspense(SleepHumorScreen, { onBack: goBack });
    } else if (currentView.type === "family-tree") {
      return renderWithSuspense(FamilyTreeScreen, {
        onBack: goBack,
        onOpenTemplate: (chapterId: string, templateId: string) =>
          openChapterTemplate(chapterId, templateId),
        onSelectMember: (member: FamilyMember) =>
          navigateTo({ type: "family-member-detail", member }),
      });
    } else if (currentView.type === "family-member-detail") {
      return renderWithSuspense(FamilyMemberDetailScreen, {
        member: currentView.member,
        onBack: goBack,
        onSelectMoment: (momentId: string) => {
          const moment = getMoments().find((m) => m.id === momentId);
          if (moment) {
            navigateTo({ type: "moment-detail", moment });
          }
        },
      });
    } else if (currentView.type === "moment-detail") {
      return renderWithSuspense(MomentDetailScreen, {
        moment: currentView.moment,
        onBack: goBack,
      });
    } else if (currentView.type === "manage-babies") {
      return renderWithSuspense(ManageBabiesScreen, {
        onBack: goBack,
        onAddBaby: () => navigateTo({ type: "add-baby" }),
        onEditBaby: (baby: Baby) => navigateTo({ type: "edit-baby", baby }),
      });
    } else if (currentView.type === "edit-baby") {
      return renderWithSuspense(EditBabyScreen, {
        baby: currentView.baby,
        onBack: goBack,
        onSave: goBack,
      });
    } else if (currentView.type === "add-baby") {
      const newBaby: Baby = {
        id: "",
        name: "",
        birthDate: "",
        city: "",
        avatar: "",
      };
      return renderWithSuspense(EditBabyScreen, {
        baby: newBaby,
        onBack: goBack,
        onSave: goBack,
      });
    } else if (currentView.type === "export-album") {
      return renderWithSuspense(ExportAlbumScreen, { onBack: goBack });
    } else if (currentView.type === "manage-account") {
      return renderWithSuspense(ManageAccountScreen, { onBack: goBack });
    } else if (currentView.type === "notifications-settings") {
      return renderWithSuspense(NotificationsSettingsScreen, {
        onBack: goBack,
      });
    } else if (currentView.type === "help-and-support") {
      return renderWithSuspense(HelpAndSupportScreen, { onBack: goBack });
    }
    return null;
  };

  const getCurrentTab = (): string => {
    if (currentView.type === "main") {
      const tabMap: Record<Screen, string> = {
        home: "home",
        gallery: "gallery",
        moments: "moments",
        chapters: "chapters",
        notifications: "whispers",
        profile: "profile",
      };
      return tabMap[currentView.screen] || "home";
    } else if (currentView.type === "chapter-detail") {
      return "chapters";
    }
    return "home";
  };

  useEffect(() => {
    let lastProcessedScrollY = 0;
    let currentAccumulated = 0;
    let hideTimeoutId: NodeJS.Timeout | null = null;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDifference = currentScrollY - lastProcessedScrollY;

      // Ignora movimentos muito pequenos (<5px) para evitar jitter
      if (Math.abs(scrollDifference) < 5) {
        return;
      }

      // Acumula o scroll para detectar intenção clara
      // Reset se mudar de direção
      if (
        (scrollDifference > 0 && currentAccumulated < 0) ||
        (scrollDifference < 0 && currentAccumulated > 0)
      ) {
        currentAccumulated = scrollDifference;
      } else {
        currentAccumulated += scrollDifference;
      }

      // Limpa timeout anterior para não conflitar
      if (hideTimeoutId) {
        clearTimeout(hideTimeoutId);
      }

      // CRITÉRIO PARA ESCONDER (seguindo padrão iOS/Material Design):
      // - Scroll para baixo acumulado > 30px
      // - Além de 300px do topo (zona segura)
      // - NÃO precisa ser rápido, apenas intencional
      if (currentAccumulated > 30 && currentScrollY > 300 && isNavVisible) {
        setIsNavVisible(false);
        currentAccumulated = 0;
      }

      // CRITÉRIO PARA MOSTRAR:
      // - Scroll para cima acumulado > 20px
      // - OU está no topo (<300px)
      if (
        (currentAccumulated < -20 || currentScrollY <= 300) &&
        !isNavVisible
      ) {
        setIsNavVisible(true);
        currentAccumulated = 0;
      }

      lastProcessedScrollY = currentScrollY;
      setAccumulatedScroll(currentAccumulated);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (hideTimeoutId) {
        clearTimeout(hideTimeoutId);
      }
    };
  }, [isNavVisible]);

  if (status !== "ready") {
    return (
      <div className="min-h-screen bg-background text-muted-foreground flex items-center justify-center px-6 text-center">
        {status === "error"
          ? `Falha ao carregar dados: ${error ?? "tente novamente mais tarde."}`
          : "Carregando dados..."}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        <motion.div
          key={
            currentView.type === "main"
              ? `main-${currentView.screen}`
              : currentView.type
          }
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="min-h-screen"
        >
          {renderCurrentView()}
        </motion.div>
      </AnimatePresence>

      {currentView.type === "main" && (
        <AnimatePresence mode="wait">
          {isNavVisible && (
            <motion.div
              initial={{ y: "100%", opacity: 0, scale: 0.85 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: "100%", opacity: 0, scale: 0.85 }}
              transition={{
                y: { type: "spring", damping: 40, stiffness: 300, mass: 0.5 },
                scale: {
                  type: "spring",
                  damping: 40,
                  stiffness: 300,
                  mass: 0.5,
                },
                opacity: { type: "tween", duration: 0.15 },
              }}
              style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 30,
                pointerEvents: "auto",
                transformOrigin: "bottom center",
              }}
            >
              <BottomNav
                activeTab={getCurrentTab()}
                onTabChange={handleTabChange}
                onNewAction={handleNewAction}
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      <AddMomentSheet
        isOpen={showAddMoment}
        onClose={() => setShowAddMoment(false)}
        onSelectChapter={(chapter) => {
          setShowAddMoment(false);
          handleSelectChapter(chapter);
        }}
      />

      {currentView.type === "moment-form" && (
        <Suspense fallback={<ScreenLoader />}>
          <MomentForm
            isOpen={true}
            onClose={goBack}
            template={currentView.template}
            chapter={currentView.chapter}
            onSave={handleMomentSaved}
          />
        </Suspense>
      )}

      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BabyDataProvider>
        <AppContent />
      </BabyDataProvider>
    </ThemeProvider>
  );
}
