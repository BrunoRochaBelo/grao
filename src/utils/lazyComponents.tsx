// src/utils/lazyComponents.tsx
// 🚀 Lazy Loading Automático de Componentes para Melhor Performance

import { lazy, Suspense } from "react";
import React from "react";

// Loading Fallback Simples
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

/**
 * Cria componente lazy-loaded com fallback
 * Uso:
 * const HomeScreen = lazyComponent(() => import('./features/home/HomeScreen').then(m => ({ default: m.HomeScreen })))
 */
export const lazyComponent = (
  importFunc: () => Promise<{ default: React.ComponentType<any> }>
) => {
  const Component = lazy(importFunc);
  return (props: any) => (
    <Suspense fallback={<LoadingFallback />}>
      <Component {...props} />
    </Suspense>
  );
};

/**
 * Importações lazy de telas (use conforme necessário)
 * Descomente e use quando quiser ativar code-splitting
 */

// Exemplos - descomente conforme necessário
export const LazyHomeScreen = lazy(() =>
  import("../features/home/HomeScreen").then((m) => ({ default: m.HomeScreen }))
);

export const LazyGalleryScreen = lazy(() =>
  import("../features/gallery/GalleryScreen").then((m) => ({
    default: m.GalleryScreen,
  }))
);

export const LazyChaptersScreen = lazy(() =>
  import("../features/chapters/ChaptersScreen").then((m) => ({
    default: m.ChaptersScreen,
  }))
);

export const LazyMomentForm = lazy(() =>
  import("../features/moments/MomentForm").then((m) => ({
    default: m.MomentForm,
  }))
);

export const LazyFamilyTreeScreen = lazy(() =>
  import("../features/family/FamilyTreeScreen").then((m) => ({
    default: m.FamilyTreeScreen,
  }))
);

export const LazyProfileScreen = lazy(() =>
  import("../features/profile/ProfileScreen").then((m) => ({
    default: m.ProfileScreen,
  }))
);

export const LazyGrowthScreen = lazy(() =>
  import("../features/health/GrowthScreen").then((m) => ({
    default: m.GrowthScreen,
  }))
);

export const LazyVaccinesScreen = lazy(() =>
  import("../features/health/VaccinesScreen").then((m) => ({
    default: m.VaccinesScreen,
  }))
);

/**
 * Com Suspense wrapper automático
 */
export const HomeScreenWithLoading = lazyComponent(() =>
  import("../features/home/HomeScreen").then((m) => ({ default: m.HomeScreen }))
);

export const GalleryScreenWithLoading = lazyComponent(() =>
  import("../features/gallery/GalleryScreen").then((m) => ({
    default: m.GalleryScreen,
  }))
);

export const ChaptersScreenWithLoading = lazyComponent(() =>
  import("../features/chapters/ChaptersScreen").then((m) => ({
    default: m.ChaptersScreen,
  }))
);
