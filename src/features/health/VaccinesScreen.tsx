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
import type { Chapter, PlaceholderTemplate } from "@/types";
import { Progress } from "@/components/ui/progress";
import { getHighlightStyle, HighlightTone } from "@/lib/highlights";
import { MomentTemplateCard } from "../chapters/MomentTemplateCard";

interface VaccinesScreenProps {
  onBack: () => void;
  onOpenTemplate: (template: PlaceholderTemplate, chapter: Chapter) => void;
}

type VaccineFilter = "all" | "completed" | "pending";

export function VaccinesScreen({
  onBack,
  onOpenTemplate,
}: VaccinesScreenProps) {
  // Carrega dados do capítulo "Saúde & Crescimento"
  const chapter = useMemo(() => chapters.find((item) => item.id === "3"), []);

  const babyAgeInDays = getBabyAgeInDays(currentBaby.birthDate);
  const moments = getMoments();

  const vaccineTemplates = useMemo(() => {
    if (!chapter) {
      return [];
    }

    return getPlaceholdersForChapter(chapter.id, babyAgeInDays)
      .filter((placeholder) => placeholder.templateType === "vacina")
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
  }, [babyAgeInDays, chapter, moments]);

  if (!chapter) {
    return null;
  }

  const completedCount = vaccineTemplates.filter(
    (template) => template.isCompleted
  ).length;
  const totalCount = vaccineTemplates.length;
  const pendingCount = totalCount - completedCount;
  const percentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const [filter, setFilter] = useState<VaccineFilter>("all");

  const filteredTemplates = vaccineTemplates.filter((template) => {
    if (filter === "completed") {
      return template.isCompleted;
    }
    if (filter === "pending") {
      return !template.isCompleted;
    }
    return true;
  });

  return (
    <div className="pb-24 max-w-2xl mx-auto">
      <div className="sticky top-0 bg-background z-10 px-4 pt-6 pb-4 border-b border-border">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 min-h-[44px]"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </button>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-foreground mb-1">Vacinas</h1>
            <p className="text-muted-foreground">Calendário de vacinação</p>
          </div>
        </div>

        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-foreground">
              {completedCount} de {totalCount} vacinas registradas
            </span>
            <span className="text-primary">{percentage}%</span>
          </div>
          <Progress value={percentage} className="h-2 mb-2" />
          <p className="text-muted-foreground text-sm">
            {pendingCount > 0
              ? `${pendingCount} ${
                  pendingCount === 1 ? "pendente" : "pendentes"
                }`
              : "Todas em dia!"}
          </p>
        </div>
      </div>

      <div className="px-4 pt-4">
        <div className="flex gap-2 mb-4">
          {(
            [
              { id: "all", label: "Todas", tone: "lavender" },
              { id: "completed", label: "Feitas", tone: "mint" },
              { id: "pending", label: "Pendentes", tone: "babyBlue" },
            ] satisfies {
              id: VaccineFilter;
              label: string;
              tone: HighlightTone;
            }[]
          ).map((option) => {
            const isActive = filter === option.id;
            return (
              <button
                key={option.id}
                onClick={() => setFilter(option.id)}
                className={`px-4 py-2 rounded-xl text-sm transition-colors border ${
                  isActive
                    ? "shadow-soft"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 border-transparent"
                }`}
                style={isActive ? getHighlightStyle(option.tone) : undefined}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {filter === "completed"
                ? "Nenhuma vacina registrada ainda."
                : "Nenhuma vacina pendente!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredTemplates.map((template) => (
              <MomentTemplateCard
                key={template.id}
                template={template}
                moment={template.moment}
                chapter={chapter}
                onOpenTemplate={() => onOpenTemplate(template, chapter)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
