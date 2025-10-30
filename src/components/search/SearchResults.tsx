import { motion } from "motion/react";
import { ChevronRight, CheckCircle, Circle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type {
  SearchResult,
  SearchChapterResult,
  SearchMomentResult,
} from "@/types";

interface SearchResultsProps {
  results: SearchResult;
  onOpenMoment?: (momentId: string) => void;
  onOpenChapter?: (chapterId: string) => void;
  onOpenTemplate?: (chapterId: string, templateId: string) => void;
}

function getMomentIcon(type: string) {
  const iconMap: Record<string, string> = {
    mesversario: "🎂",
    primeiraVez: "✨",
    consulta: "🩺",
    vacina: "💉",
    medida: "📏",
    carta: "💌",
    nota: "📝",
    evento: "🎉",
    arte: "🎨",
    triagem: "🔍",
    registro: "📋",
  };

  return iconMap[type] || "📌";
}

function MomentResultItem({
  moment,
  onOpenMoment,
  onOpenTemplate,
}: {
  moment: SearchMomentResult;
  onOpenMoment?: (momentId: string) => void;
  onOpenTemplate?: (chapterId: string, templateId: string) => void;
}) {
  const isCompleted = moment.status === "published";
  const isSuggested = moment.kind === "suggested";

  const handleClick = () => {
    if (isSuggested && onOpenTemplate) {
      onOpenTemplate(moment.chapterId, moment.templateId || "");
    } else if (onOpenMoment) {
      onOpenMoment(moment.id);
    }
  };

  return (
    <motion.button
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      className="w-full text-left bg-card hover:bg-muted transition-colors rounded-xl p-4 flex items-center gap-3 border border-border/60 shadow-sm"
    >
      {/* Status Icon */}
      <div className="flex-shrink-0">
        {isCompleted ? (
          <CheckCircle className="w-5 h-5 text-green-600" />
        ) : (
          <Circle className="w-5 h-5 text-muted-foreground" />
        )}
      </div>

      {/* Moment Icon */}
      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0 bg-primary/10">
        {getMomentIcon(moment.type)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h4 className="text-foreground truncate font-medium">
            {moment.highlightedTitle || moment.title}
          </h4>
          {moment.seriesId && (
            <Badge variant="outline" className="text-xs px-2 py-0.5">
              Série
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {moment.date && (
            <>
              <Calendar className="w-3 h-3" />
              <span>{new Date(moment.date).toLocaleDateString("pt-BR")}</span>
            </>
          )}
          {moment.age && <span>• {moment.age}</span>}
          <span>• {isSuggested ? "Sugerido" : "Registrado"}</span>
        </div>
      </div>

      {/* Action */}
      <div className="flex-shrink-0">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.button>
  );
}

function ChapterResultGroup({
  chapter,
  onOpenMoment,
  onOpenChapter,
  onOpenTemplate,
}: {
  chapter: SearchChapterResult;
  onOpenMoment?: (momentId: string) => void;
  onOpenChapter?: (chapterId: string) => void;
  onOpenTemplate?: (chapterId: string, templateId: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {/* Chapter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ backgroundColor: chapter.chapterColor }}
          >
            {chapter.chapterIcon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {chapter.chapterName}
            </h3>
            <p className="text-sm text-muted-foreground">
              {chapter.resultsCount} resultado
              {chapter.resultsCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onOpenChapter?.(chapter.chapterId)}
          className="text-sm"
        >
          Ver capítulo
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Moments List */}
      <div className="space-y-2 pl-13">
        {chapter.moments.map((moment, index) => (
          <motion.div
            key={moment.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <MomentResultItem
              moment={moment}
              onOpenMoment={onOpenMoment}
              onOpenTemplate={onOpenTemplate}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export function SearchResults({
  results,
  onOpenMoment,
  onOpenChapter,
  onOpenTemplate,
}: SearchResultsProps) {
  if (results.totalResults === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Nada por aqui
        </h3>
        <p className="text-muted-foreground">
          Tenta outro nome ou limpa os filtros.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Summary */}
      <div className="text-center py-4">
        <p className="text-muted-foreground">
          {results.totalResults} resultado
          {results.totalResults !== 1 ? "s" : ""} encontrado
          {results.totalResults !== 1 ? "s" : ""}
          {results.query && (
            <span>
              {" "}
              para "<strong>{results.query}</strong>"
            </span>
          )}
        </p>
      </div>

      {/* Results Groups */}
      <div className="space-y-8">
        {results.results.map((chapter, index) => (
          <motion.div
            key={chapter.chapterId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ChapterResultGroup
              chapter={chapter}
              onOpenMoment={onOpenMoment}
              onOpenChapter={onOpenChapter}
              onOpenTemplate={onOpenTemplate}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
