import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Circle, Edit, Share2, Trash2 } from 'lucide-react';
import type { Chapter, Moment, PlaceholderTemplate } from '@/types';
import { MediaCarousel } from '@/components/shared/MediaCarousel';
import { Badge } from '@/components/ui/badge';

export interface MomentTemplateCardProps {
  template: PlaceholderTemplate & { thumbnail?: string };
  moment: Moment | undefined;
  chapter: Chapter;
  onOpenTemplate: () => void;
}

export function MomentTemplateCard({
  template,
  moment,
  chapter,
  onOpenTemplate,
}: MomentTemplateCardProps) {
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  if (!template.isCompleted || !moment) {
    return (
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={onOpenTemplate}
        className="bg-card rounded-2xl p-4 shadow-sm border border-border hover:shadow-md transition-shadow text-left flex items-center gap-3"
      >
        <div
          className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
          style={{ backgroundColor: `${chapter.color}40` }}
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
            style={{ backgroundColor: `${chapter.color}40` }}
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
            {moment.age} • {new Date(moment.date).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {hasMedia && (
              <MediaCarousel
                items={moment.media}
                className="px-4 pt-4"
                aspectRatioClass="aspect-[16/10]"
              />
            )}

            <div className="p-4 space-y-3">
              {moment.location && (
                <p className="text-muted-foreground text-sm">Local: {moment.location}</p>
              )}

              {moment.people && moment.people.length > 0 && (
                <p className="text-muted-foreground text-sm">
                  Pessoas: {moment.people.join(', ')}
                </p>
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

              <div className="flex gap-2 pt-2">
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    onOpenTemplate();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-border hover:bg-muted transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span className="text-sm">Editar</span>
                </button>
                <button
                  onClick={(event) => event.stopPropagation()}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-border hover:bg-muted transition-colors"
                  aria-label="Compartilhar"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={(event) => event.stopPropagation()}
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

