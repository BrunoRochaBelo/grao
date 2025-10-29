import { motion } from "motion/react";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";
import { useBabyData } from "@/lib/baby-data-context";
import type { Chapter } from "@/lib/types";

interface ChapterCardProps {
  chapter: Chapter;
  onClick: () => void;
}

function ChapterCard({ chapter, onClick }: ChapterCardProps) {
  const { getPlaceholdersForChapter, getMoments } = useBabyData();
  const placeholders = getPlaceholdersForChapter(chapter.id);
  const moments = getMoments();

  const completedCount = placeholders.filter((p) =>
    moments.some((m) => m.templateId === p.id)
  ).length;
  const totalCount = placeholders.length;

  const percentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const pending = totalCount - completedCount;

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="bg-card rounded-2xl p-4 shadow-sm border border-border hover:shadow-md transition-shadow text-left w-full"
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ backgroundColor: chapter.color }}
        >
          {chapter.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-foreground mb-1">{chapter.name}</h3>
          <p className="text-muted-foreground text-sm">{chapter.description}</p>
        </div>
      </div>

      <div className="mb-2">
        <Progress value={percentage} className="h-2" />
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {completedCount} de {totalCount} preenchidos
        </span>
        {pending > 0 && (
          <span className="bg-warning/20 text-warning px-2 py-0.5 rounded-lg">
            {pending} {pending === 1 ? "pendente" : "pendentes"}
          </span>
        )}
      </div>
    </motion.button>
  );
}

interface ChaptersScreenProps {
  onSelectChapter: (chapter: Chapter) => void;
  onBack?: () => void;
}

export function ChaptersScreen({
  onSelectChapter,
  onBack,
}: ChaptersScreenProps) {
  const { chapters, getMoments } = useBabyData();
  const moments = getMoments();
  const totalMoments = moments.length;

  console.log("ChaptersScreen rendered with chapters:", chapters);

  return (
    <div className="pb-24 px-4 pt-6 max-w-2xl mx-auto">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 min-h-[44px]"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </button>
      )}

      <div className="mb-6">
        <h1 className="text-foreground mb-2">Capítulos</h1>
        <p className="text-muted-foreground">
          Organize as memórias por temas importantes
        </p>
      </div>

      {chapters.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Carregando capítulos...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {chapters.map((chapter, index) => (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ChapterCard
                chapter={chapter}
                onClick={() => onSelectChapter(chapter)}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 bg-primary/5 rounded-2xl p-4 border border-primary/20"
      >
        <p className="text-center text-muted-foreground">
          {totalMoments > 0
            ? `${totalMoments} ${
                totalMoments === 1
                  ? "momento registrado"
                  : "momentos registrados"
              }. Continue preenchendo para completar o álbum da Aurora! 💛`
            : "Comece a registrar os momentos especiais da Aurora! 💛"}
        </p>
      </motion.div>
    </div>
  );
}
