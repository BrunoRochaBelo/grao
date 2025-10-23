import { ArrowLeft, CheckCircle2, Circle, Edit, Share2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Progress } from '../ui/progress';
import {
  Chapter,
  PlaceholderTemplate,
  currentBaby,
  getBabyAgeInDays,
  getMoments,
  getPlaceholdersForChapter,
  Moment,
} from '../../lib/mockData';
import { useEffect, useRef, useState } from 'react';
import { Badge } from '../ui/badge';
import { MediaCarousel } from '../shared/MediaCarousel';

interface ChapterDetailProps {
  chapter: Chapter;
  onBack: () => void;
  onOpenTemplate: (template: PlaceholderTemplate) => void;
}

interface ExpandableMomentCardProps {
  template: PlaceholderTemplate & { thumbnail?: string };
  moment: Moment | undefined;
  chapter: Chapter;
  onClick: () => void;
}

function ExpandableMomentCard({ template, moment, chapter, onClick }: ExpandableMomentCardProps) {
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  if (!template.isCompleted || !moment) {
    // Empty template - just show the placeholder
    return (
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={onClick}
        className="bg-card rounded-2xl p-4 shadow-sm border border-border hover:shadow-md transition-shadow text-left flex items-center gap-3"
      >
        <div
          className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
          style={{ backgroundColor: chapter.color + '40' }}
        >
          {template.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-foreground">{template.name}</h3>
            <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          </div>
          <p className="text-muted-foreground text-sm">{template.description}</p>
          <p className="text-primary text-sm mt-1">Tocar para registrar</p>
        </div>
      </motion.button>
    );
  }

  const hasMedia = moment.media && moment.media.length > 0;

  useEffect(() => {
    if (!expanded || !cardRef.current || typeof window === 'undefined') {
      return;
    }

    const ensureCardInView = () => {
      if (!cardRef.current) return;

      const headerElement = document.querySelector<HTMLElement>('[data-chapter-header]');
      const headerOffset = (headerElement?.getBoundingClientRect().height ?? 96) + 16;
      const rect = cardRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY;

      if (rect.top < headerOffset) {
        const targetTop = Math.max(rect.top + scrollY - headerOffset, 0);
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
        return;
      }

      if (rect.bottom > viewportHeight) {
        const targetBottom = rect.bottom + scrollY - viewportHeight + 16;
        window.scrollTo({ top: Math.max(targetBottom, 0), behavior: 'smooth' });
      }
    };

    const raf = window.requestAnimationFrame(ensureCardInView);
    const timeoutId = window.setTimeout(ensureCardInView, 350);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(timeoutId);
    };
  }, [expanded]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl shadow-sm border border-success/30 overflow-hidden"
      ref={cardRef}
    >
      {/* Header - Always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center gap-3 text-left hover:bg-muted/50 transition-colors"
      >
        {hasMedia ? (
          <img
            src={moment.media[0]}
            alt={moment.title}
            className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
          />
        ) : (
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
            style={{ backgroundColor: chapter.color + '40' }}
          >
            {template.icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-foreground">{moment.title}</h3>
            <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
          </div>
          <p className="text-muted-foreground text-sm">
            {moment.age} · {new Date(moment.date).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {/* Media Carousel */}
            {hasMedia && (
              <MediaCarousel
                items={moment.media}
                className="px-4 pt-4"
                aspectRatioClass="aspect-[16/10]"
              />
            )}

            {/* Details */}
            <div className="p-4 space-y-3">
              {moment.location && (
                <p className="text-muted-foreground text-sm">📍 {moment.location}</p>
              )}

              {moment.people && moment.people.length > 0 && (
                <p className="text-muted-foreground text-sm">👥 {moment.people.join(', ')}</p>
              )}

              {moment.noteShort && (
                <p className="text-foreground text-sm">{moment.noteShort}</p>
              )}

              {moment.noteLong && (
                <p className="text-foreground text-sm">{moment.noteLong}</p>
              )}

              {moment.tags && moment.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {moment.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-border hover:bg-muted transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span className="text-sm">Editar</span>
                </button>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-border hover:bg-muted transition-colors"
                  aria-label="Compartilhar"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors"
                  aria-label="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function ChapterDetail({ chapter, onBack, onOpenTemplate }: ChapterDetailProps) {
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  
  const babyAgeInDays = getBabyAgeInDays(currentBaby.birthDate);
  const allPlaceholders = getPlaceholdersForChapter(chapter.id, babyAgeInDays);
  const moments = getMoments();
  
  // Update completion status based on actual moments
  const templates = allPlaceholders.map(placeholder => {
    const moment = moments.find(m => m.templateId === placeholder.id);
    const hasMoment = !!moment;
    return {
      ...placeholder,
      isCompleted: hasMoment,
      thumbnail: moment?.media[0],
      moment,
    };
  });
  
  const completedCount = templates.filter(t => t.isCompleted).length;
  const totalCount = templates.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  const filteredTemplates = templates.filter(t => {
    if (filter === 'completed') return t.isCompleted;
    if (filter === 'pending') return !t.isCompleted;
    return true;
  });

  return (
    <div className="pb-24 max-w-2xl mx-auto">
      {/* Header */}
      <div data-chapter-header className="sticky top-0 bg-background z-10 px-4 pt-6 pb-4 border-b border-border">
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

      {/* Templates Grid */}
      <div className="px-4 pt-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl text-sm transition-colors ${
              filter === 'all' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-xl text-sm transition-colors ${
              filter === 'completed' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Preenchidos
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-xl text-sm transition-colors ${
              filter === 'pending' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Pendentes
          </button>
        </div>

        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {filter === 'completed' ? 'Nenhum momento preenchido ainda' : 'Nenhum momento pendente'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredTemplates.map((template) => (
              <ExpandableMomentCard
                key={template.id}
                template={template}
                moment={template.moment}
                chapter={chapter}
                onClick={() => onOpenTemplate(template)}
              />
            ))}
          </div>
        )}

        {/* Complete Chapter Message */}
        {completedCount === totalCount && totalCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 bg-success/10 border border-success/30 rounded-2xl p-6 text-center"
          >
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-foreground mb-1">Capítulo Completo!</h3>
            <p className="text-muted-foreground text-sm">
              Todos os momentos foram registrados com carinho
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
