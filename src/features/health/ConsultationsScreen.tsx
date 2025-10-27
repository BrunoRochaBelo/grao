import { useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import {
  chapters,
  currentBaby,
  getBabyAgeInDays,
  getMoments,
  getPlaceholdersForChapter,
} from "@/lib/mockData";
import type { Chapter, PlaceholderTemplate } from "@/lib/types";
import { Progress } from "@/components/ui/progress";
import { MomentTemplateCard } from "../chapters/MomentTemplateCard";

interface ConsultationsScreenProps {
  onBack: () => void;
  onOpenTemplate: (template: PlaceholderTemplate, chapter: Chapter) => void;
}

type ConsultationFilter = "all" | "completed" | "pending";

export function ConsultationsScreen({
  onBack,
  onOpenTemplate,
}: ConsultationsScreenProps) {
  const chapter = useMemo(() => chapters.find((item) => item.id === "3"), []); // Saúde & Crescimento

  const babyAgeInDays = getBabyAgeInDays(currentBaby.birthDate);
  const moments = getMoments();

  const consultationTemplates = useMemo(() => {
    if (!chapter) {
      return [];
    }

    return getPlaceholdersForChapter(chapter.id, babyAgeInDays)
      .filter((placeholder) => placeholder.templateType === "consulta")
      .sort((a, b) => a.ageRangeStart - b.ageRangeStart)
      .map((placeholder) => {
        const moment = moments.find(
          (item) => item.templateId === placeholder.id
        );

        return {
          ...placeholder,
          isCompleted: Boolean(moment),
          thumbnail: moment?.media[0],
          moment,
        };
      });
  }, [chapter, babyAgeInDays, moments]);

  const [filter, setFilter] = useState<ConsultationFilter>("all");

  const filteredTemplates = useMemo(() => {
    return consultationTemplates.filter((template) => {
      if (filter === "all") return true;
      if (filter === "completed") return template.isCompleted;
      if (filter === "pending") return !template.isCompleted;
      return true;
    });
  }, [consultationTemplates, filter]);

  const completedCount = consultationTemplates.filter(
    (t) => t.isCompleted
  ).length;
  const totalCount = consultationTemplates.length;

  if (!chapter) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="px-4 py-4 flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 -m-2 hover:bg-muted rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold">Consultas Médicas</h1>
            <p className="text-sm text-muted-foreground">
              {completedCount} de {totalCount} realizadas
            </p>
          </div>
        </div>

        <div className="px-4 pb-4">
          <Progress
            value={totalCount > 0 ? (completedCount / totalCount) * 100 : 0}
            className="h-2"
          />
        </div>

        <div className="px-4 pb-4 flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              filter === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Todas ({totalCount})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              filter === "pending"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Pendentes ({totalCount - completedCount})
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              filter === "completed"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Realizadas ({completedCount})
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-4">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <MomentTemplateCard
                template={{
                  ...template,
                  isCompleted: template.isCompleted,
                }}
                moment={template.moment}
                chapter={chapter}
                onOpenTemplate={() => onOpenTemplate(template, chapter)}
              />
            </motion.div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {filter === "all"
                ? "Nenhuma consulta encontrada"
                : filter === "pending"
                ? "Nenhuma consulta pendente"
                : "Nenhuma consulta realizada"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
