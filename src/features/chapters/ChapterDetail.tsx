import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { Progress } from '../../components/ui/progress';
import { useBabyData } from '../../lib/baby-data-context';
import type { Chapter, Moment, PlaceholderTemplate } from '../../lib/types';
import { getHighlightStyle, HighlightTone } from '../../lib/highlights';
import { MomentTemplateCard } from './MomentTemplateCard';

interface ChapterDetailProps {
  chapter: Chapter;
  onBack: () => void;
  onOpenTemplate: (template: PlaceholderTemplate) => void;
}

type ChapterFilter = 'all' | 'completed' | 'pending';

type TemplateWithMoment = PlaceholderTemplate & {
  thumbnail?: string;
  moment?: Moment;
};

export function ChapterDetail({ chapter, onBack, onOpenTemplate }: ChapterDetailProps) {
  const [filter, setFilter] = useState<ChapterFilter>('all');
  const { getPlaceholdersForChapter, getMoments } = useBabyData();

  const allPlaceholders = getPlaceholdersForChapter(chapter.id);
  const moments = getMoments();

  const templates: TemplateWithMoment[] = allPlaceholders.map((placeholder) => {
    const moment = moments.find((m) => m.templateId === placeholder.id);
    const hasMoment = Boolean(moment);

    return {
      ...placeholder,
      isCompleted: hasMoment,
      thumbnail: moment?.media[0],
      moment,
    };
  });

  const completedCount = templates.filter((template) => template.isCompleted).length;
  const totalCount = templates.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredTemplates = templates.filter((template) => {
    if (filter === 'completed') {
      return template.isCompleted;
    }
    if (filter === 'pending') {
      return !template.isCompleted;
    }
    return true;
  });

  return (
    <div className="pb-24 max-w-2xl mx-auto">
      <div
        data-chapter-header
        className="sticky top-0 bg-background z-10 px-4 pt-6 pb-4 border-b border-border"
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 min-h-[44px]"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </button>

        <div className="flex items-start gap-3 mb-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
            style={{ backgroundColor: chapter.color }}
          >
            {chapter.icon}
          </div>
          <div className="flex-1">
            <h1 className="text-foreground mb-1">{chapter.name}</h1>
            <p className="text-muted-foreground">{chapter.description}</p>
          </div>
        </div>

        <div className="mb-2">
          <Progress value={percentage} className="h-2" />
        </div>
        <p className="text-muted-foreground text-sm">
          {completedCount} de {totalCount} momentos concluídos ({percentage}%)
        </p>
      </div>

      <div className="px-4 pt-4">
        <div className="flex gap-2 mb-4">
          {(
            [
              { id: 'all', label: 'Todos', tone: 'lavender' },
              { id: 'completed', label: 'Preenchidos', tone: 'mint' },
              { id: 'pending', label: 'Pendentes', tone: 'babyBlue' },
            ] satisfies { id: ChapterFilter; label: string; tone: HighlightTone }[]
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

        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {filter === 'completed'
                ? 'Nenhum momento preenchido ainda'
                : 'Nenhum momento pendente'}
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
                onOpenTemplate={() => onOpenTemplate(template)}
              />
            ))}
          </div>
        )}

        {completedCount === totalCount && totalCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 bg-success/10 border border-success/30 rounded-2xl p-6 text-center"
          >
            <h3 className="text-foreground mb-1">Capítulo completo!</h3>
            <p className="text-muted-foreground text-sm">
              Todos os momentos foram registrados com carinho.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
