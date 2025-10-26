import { useMemo, useState } from 'react';
import { ArrowLeft, CalendarClock, Stethoscope } from 'lucide-react';
import { motion } from 'motion/react';
import { useBabyData } from '@/lib/baby-data-context';
import type { Chapter, PlaceholderTemplate } from '@/lib/types';
import { Progress } from '@/components/ui/progress';
import { getHighlightStyle, HighlightTone } from '@/lib/highlights';
import { MomentTemplateCard } from '../chapters/MomentTemplateCard';

interface ConsultationsScreenProps {
  onBack: () => void;
  onOpenTemplate: (template: PlaceholderTemplate, chapter: Chapter) => void;
}

type ConsultationFilter = 'all' | 'completed' | 'upcoming';

export function ConsultationsScreen({ onBack, onOpenTemplate }: ConsultationsScreenProps) {
  const {
    chapters,
    currentBaby,
    getBabyAgeInDays,
    getMoments,
    getPlaceholdersForChapter,
  } = useBabyData();

  const babyAgeInDays = currentBaby ? getBabyAgeInDays(currentBaby.birthDate) : 0;
  const moments = getMoments();

  const consultationEntries = useMemo(() => {
    const items = chapters.flatMap((chapter) => {
      const placeholders = getPlaceholdersForChapter(chapter.id, babyAgeInDays)
        .filter((placeholder) => placeholder.templateType === 'consulta')
        .sort((a, b) => (a.ageRangeStart ?? 0) - (b.ageRangeStart ?? 0));

      return placeholders.map((placeholder) => {
        const relatedMoment = moments.find((moment) => moment.templateId === placeholder.id);
        return {
          chapter,
          template: { ...placeholder, thumbnail: relatedMoment?.media?.[0] },
          moment: relatedMoment,
          isCompleted: Boolean(relatedMoment),
        };
      });
    });

    return items.sort(
      (a, b) => (a.template.ageRangeStart ?? 0) - (b.template.ageRangeStart ?? 0),
    );
  }, [babyAgeInDays, chapters, getPlaceholdersForChapter, moments]);

  const completedCount = consultationEntries.filter((item) => item.isCompleted).length;
  const totalCount = consultationEntries.length;
  const upcomingCount = totalCount - completedCount;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const nextPending = consultationEntries.find((item) => !item.isCompleted);

  const nextPendingLabel = nextPending
    ? (() => {
        if (nextPending.template.ageRangeStart === undefined) {
          return 'Próxima consulta disponível';
        }
        const days = Math.max(nextPending.template.ageRangeStart - babyAgeInDays, 0);
        if (days === 0) {
          return 'Consulta disponível agora';
        }
        return `Próxima em ${days} ${days === 1 ? 'dia' : 'dias'}`;
      })()
    : upcomingCount > 0
    ? `${upcomingCount} ${upcomingCount === 1 ? 'consulta pendente' : 'consultas pendentes'}`
    : 'Tudo em dia!';

  const [filter, setFilter] = useState<ConsultationFilter>('all');

  const filteredEntries = consultationEntries.filter((item) => {
    if (filter === 'completed') {
      return item.isCompleted;
    }
    if (filter === 'upcoming') {
      return !item.isCompleted;
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
            <h1 className="text-foreground mb-1">Consultas</h1>
            <p className="text-muted-foreground">Acompanhe o calendário do pediatra</p>
          </div>
        </div>

        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-foreground">
              {completedCount} de {totalCount} consultas registradas
            </span>
            <span className="text-primary">{percentage}%</span>
          </div>
          <Progress value={percentage} className="h-2 mb-2" />
          <p className="text-muted-foreground text-sm">{nextPendingLabel}</p>
        </div>
      </div>

      <div className="px-4 pt-4">
        <div className="flex gap-2 mb-4">
          {(
            [
              { id: 'all', label: 'Todas', tone: 'lavender' },
              { id: 'completed', label: 'Realizadas', tone: 'mint' },
              { id: 'upcoming', label: 'Pendentes', tone: 'babyBlue' },
            ] satisfies {
              id: ConsultationFilter;
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
                    ? 'shadow-soft'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 border-transparent'
                }`}
                style={isActive ? getHighlightStyle(option.tone) : undefined}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        {filteredEntries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Stethoscope className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">
              {filter === 'completed'
                ? 'Nenhuma consulta registrada ainda.'
                : 'Sem consultas pendentes no momento.'}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredEntries.map(({ template, chapter, moment, isCompleted }) => (
              <div key={template.id} className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wide">
                    <CalendarClock className="w-4 h-4" />
                    <span>
                      {template.ageRangeStart === undefined
                        ? 'Quando quiser'
                        : (() => {
                            const days = Math.max(
                              template.ageRangeStart - babyAgeInDays,
                              0,
                            );
                            if (days === 0) {
                              return 'Hoje';
                            }
                            return `Em ${days} ${days === 1 ? 'dia' : 'dias'}`;
                          })()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Stethoscope className="w-3 h-3" />
                    <span>{isCompleted ? 'Registrada' : 'A registrar'}</span>
                  </div>
                </div>
                <MomentTemplateCard
                  template={template}
                  moment={moment}
                  chapter={chapter}
                  onOpenTemplate={() => onOpenTemplate(template, chapter)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
