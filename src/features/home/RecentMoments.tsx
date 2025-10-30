import { motion } from "motion/react";
import { RecentMomentCard } from "@/features/home/RecentMomentCard";
import { Button } from "@/components/ui/button";
import type { Moment, Chapter } from "@/types";
import {
  getMomentTypeIcon,
  getTextPreview,
} from "@/features/moments/utils/timelineUtils";

import type { PointerEvent as ReactPointerEvent } from "react";

interface RecentMomentsProps {
  moments: Moment[];
  chaptersById: Map<string, Chapter>;
  templateIconMap: Map<string, string>;
  onOpenMoment: (moment: Moment) => void;
  onLongPressStart: (
    event: ReactPointerEvent<HTMLButtonElement>,
    moment: Moment
  ) => void;
  onLongPressEnd: (event?: ReactPointerEvent<HTMLButtonElement>) => void;
  onNavigateToMoments: () => void;
}

export function RecentMoments({
  moments,
  chaptersById,
  templateIconMap,
  onOpenMoment,
  onLongPressStart,
  onLongPressEnd,
  onNavigateToMoments,
}: RecentMomentsProps) {
  if (moments.length === 0) {
    return (
      <motion.button
        onClick={onNavigateToMoments}
        whileTap={{ scale: 0.97 }}
        className="w-full bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-2xl p-8 shadow-sm border border-blue-200/50 dark:border-blue-800/50 text-left relative overflow-hidden"
      >
        <div className="space-y-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 mb-4">
              <span className="text-3xl">📸</span>
            </div>
            <h3 className="text-foreground font-semibold text-lg mb-2">
              Crie o primeiro momento
            </h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              Capture as primeiras fotos, vídeos e histórias. Cada momento é
              único e merece ser recordado ✨
            </p>
          </div>
          <div className="flex items-center justify-center pt-2">
            <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
              Começar agora →
            </span>
          </div>
        </div>
      </motion.button>
    );
  }

  return (
    <>
      <div className="mb-4 space-y-1">
        <p className="text-sm text-muted-foreground">
          🌸 Últimos dias repletos de sorrisos.
        </p>
        <p className="text-xs text-muted-foreground/80">Toque para reviver.</p>
      </div>

      <div
        className="grid grid-cols-2 gap-4 mb-4"
        style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}
      >
        {moments.map((moment, index) => {
          const chapter = chaptersById.get(moment.chapterId);
          const templateEmoji =
            (moment.templateId && templateIconMap.get(moment.templateId)) ||
            getMomentTypeIcon(moment.templateId, moment.chapterId);
          const dateLabel = new Date(moment.date).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
          });
          const captionSource =
            moment.noteShort?.trim() || moment.noteLong?.trim() || moment.title;
          const caption = getTextPreview(captionSource, 70);

          return (
            <RecentMomentCard
              key={moment.id}
              moment={moment}
              chapter={chapter}
              icon={templateEmoji}
              caption={caption}
              dateLabel={dateLabel}
              delay={index}
              media={moment.media}
              onOpen={() => onOpenMoment(moment)}
              onLongPressStart={onLongPressStart}
              onLongPressEnd={onLongPressEnd}
            />
          );
        })}
      </div>

      <Button
        variant="outline"
        size="lg"
        className="w-full rounded-2xl bg-gradient-to-r from-primary/15 via-primary/5 to-transparent text-primary shadow-sm hover:from-primary/25 hover:via-primary/10"
        onClick={onNavigateToMoments}
      >
        Ver todos os Momentos
      </Button>
    </>
  );
}
