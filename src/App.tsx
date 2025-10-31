import {
  useCallback,
  useEffect,
  useState,
  lazy,
  Suspense,
  Component,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import { BottomNav } from "./layout/BottomNav";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { ThemeProvider } from "@/context/theme-context";
import { BabyDataProvider, useBabyData } from "@/context/baby-data-context";
import { NavigationProvider } from "@/context/navigation-context";
import {
  Baby,
  Chapter,
  FamilyMember,
  Moment,
  PlaceholderTemplate,
} from "@/types";
import { SplashScreen } from "./features/onboarding/SplashScreen";
import { AuthScreen } from "./features/onboarding/AuthScreen";
import type { Screen, ViewState } from "@/routes/types";
import { useViewStack } from "@/routes/useViewStack";
import { useBottomNavVisibility } from "@/routes/useBottomNavVisibility";

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
const BlankMomentForm = lazy(() =>
  import("./features/moments/BlankMomentForm").then((m) => ({
    default: m.BlankMomentForm,
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
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p className="text-sm text-muted-foreground">Carregando...</p>
    </div>
  </div>
);

// Error Boundary para capturar erros
class ErrorBoundary extends Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("❌ ErrorBoundary caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-destructive mb-4">Erro ao carregar a página</p>
            <p className="text-muted-foreground text-sm mb-4">
              {this.state.error?.message}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="text-primary hover:underline"
            >
              Recarregar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Pré-carregar chunks críticos para melhor performance
const preloadChunks = () => {
  if (typeof window === "undefined") return;

  // Pré-load das telas principais após um pequeno delay
  setTimeout(() => {
    import("./features/home/HomeScreen");
    import("./features/chapters/ChaptersScreen");
    import("./features/gallery/GalleryScreen");
    import("./features/moments/MomentsScreen");
  }, 1000);
};

function AppContent() {
  const initialViews: ViewState[] =
    process.env.NODE_ENV === "development"
      ? [{ type: "main", screen: "home" }]
      : [{ type: "splash" }];
  const { stack: viewStack, current: currentView, push, pop, replaceMain } =
    useViewStack(initialViews);
  const [showAddMoment, setShowAddMoment] = useState(false);
  const { isVisible: isNavVisible } = useBottomNavVisibility(currentView);
  const {
    status,
    error,
    chapters,
    currentBaby,
    getMoments,
    getPlaceholdersForChapter,
    refreshMoments,
  } = useBabyData();

  // Pré-carregar chunks críticos para melhor performance
  useEffect(() => {
    preloadChunks();
  }, []);

  const navigateTo = useCallback(
    (view: ViewState) => {
      push(view);
    },
    [push]
  );

  const goBack = useCallback(() => {
    pop();
  }, [pop]);

  const navigateToMain = useCallback(
    (screen: Screen) => {
      replaceMain(screen);
    },
    [replaceMain]
  );

  const handleTabChange = useCallback(
    (tab: string) => {
      if (tab === "chapters") {
        setShowAddMoment(true);
        return;
      }

      const screenMap: Record<string, Screen> = {
        home: "home",
        gallery: "gallery",
        moments: "moments",
        whispers: "notifications",
        profile: "profile",
      };
      navigateToMain(screenMap[tab] || "home");
    },
    [navigateToMain]
  );

  const isNavigatedToChapters = () => {
    return (
      currentView.type === "main" &&
      currentView.screen === "chapters" &&
      viewStack.length > 1
    );
  };

  const handleOpenTemplate = useCallback(
    (template: PlaceholderTemplate, chapter: Chapter) => {
      navigateTo({ type: "moment-form", template, chapter });
    },
    [navigateTo]
  );

  const handleSelectChapter = useCallback(
    (chapter: Chapter, template?: PlaceholderTemplate) => {
      if (template) {
        handleOpenTemplate(template, chapter);
      } else {
        navigateTo({ type: "chapter-detail", chapter });
      }
    },
    [handleOpenTemplate, navigateTo]
  );

  const openChapterTemplate = useCallback(
    (chapterId: string, templateId: string) => {
      const chapterData = chapters.find((chapter) => chapter.id === chapterId);
      if (!chapterData) {
        return;
      }

      navigateTo({ type: "chapter-detail", chapter: chapterData });

      const placeholders = getPlaceholdersForChapter(chapterId);
      const template = placeholders.find((item) => item.id === templateId);
      if (template) {
        handleOpenTemplate(template, chapterData);
      }
    },
    [chapters, getPlaceholdersForChapter, handleOpenTemplate, navigateTo]
  );

  const navigationActions = useMemo(
    () => ({
      goToGrowth: () => navigateTo({ type: "growth" }),
      goToVaccines: () => navigateTo({ type: "vaccines" }),
      goToConsultations: () => navigateTo({ type: "consultations" }),
      goToSleepHumor: () => navigateTo({ type: "sleep-humor" }),
      goToFamilyTree: () => navigateTo({ type: "family-tree" }),
      goToChapters: () => navigateTo({ type: "main", screen: "chapters" }),
      goToMomentsGallery: () => navigateToMain("gallery"),
      openTemplate: openChapterTemplate,
      openChapter: handleSelectChapter,
      openMoment: (moment: Moment) =>
        navigateTo({ type: "moment-detail", moment }),
    }),
    [navigateTo, navigateToMain, openChapterTemplate, handleSelectChapter]
  );

  const handleMomentSaved = useCallback(async () => {
    await refreshMoments();
    goBack();
  }, [goBack, refreshMoments]);

  const handleSplashComplete = useCallback(() => {
    navigateTo({ type: "auth" });
  }, [navigateTo]);

  const handleLogin = useCallback(
    async (_email: string, _password: string) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setTimeout(() => {
        navigateToMain("home");
      }, 100);
    },
    [navigateToMain]
  );

  const handleSignup = useCallback(
    async (_email: string, _password: string) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setTimeout(() => {
        navigateToMain("home");
      }, 100);
    },
    [navigateToMain]
  );

  const handleNewAction = useCallback(
    (action: string) => {
      if (action === "moment") {
        setShowAddMoment(true);
        return;
      }

      if (action === "note") {
        if (chapters.length > 0) {
          navigateTo({ type: "blank-moment", chapter: chapters[0] });
        } else {
          toast.error("Nenhum capítulo disponível");
        }
        return;
      }

      toast.info(`${action} em desenvolvimento`);
    },
    [chapters, navigateTo]
  );

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
            onNavigateToGrowth: navigationActions.goToGrowth,
            onNavigateToVaccines: navigationActions.goToVaccines,
            onNavigateToConsultations: navigationActions.goToConsultations,
            onNavigateToSleepHumor: navigationActions.goToSleepHumor,
            onNavigateToFamily: navigationActions.goToFamilyTree,
            onNavigateToChapters: navigationActions.goToChapters,
            onNavigateToMoments: navigationActions.goToMomentsGallery,
            onOpenTemplate: navigationActions.openTemplate,
            onOpenChapter: navigationActions.openChapter,
            onOpenMoment: navigationActions.openMoment,
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
    <NavigationProvider value={navigationActions}>
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
            <ErrorBoundary>{renderCurrentView()}</ErrorBoundary>
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
          onSelectChapter={(chapter, template) => {
            setShowAddMoment(false);
            handleSelectChapter(chapter, template);
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

        {currentView.type === "blank-moment" && (
          <Suspense fallback={<ScreenLoader />}>
            <BlankMomentForm
              isOpen={true}
              onClose={goBack}
              chapter={currentView.chapter}
              onSave={handleMomentSaved}
            />
          </Suspense>
        )}

        <Toaster />
      </div>
    </NavigationProvider>
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
