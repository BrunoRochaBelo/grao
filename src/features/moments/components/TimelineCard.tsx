import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Moment, Chapter, Baby } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  formatShortDate,
  calculateAge,
  getMomentTypeIcon,
  getTextPreview,
} from "../utils/timelineUtils";

interface TimelineCardProps {
  moment: Moment;
  chapter: Chapter | undefined;
  baby: Baby;
  onTap?: () => void;
  onLongPress?: (e: React.MouseEvent) => void;
  onDoubleTap?: () => void;
  onEdit?: () => void;
  onShare?: () => void;
  onDelete?: () => void;
  onNavigatePrevious?: () => void;
  onNavigateNext?: () => void;
}

export function TimelineCard({
  moment,
  chapter,
  baby,
  onTap,
  onLongPress,
  onDoubleTap,
  onEdit,
  onShare,
  onDelete,
  onNavigatePrevious,
  onNavigateNext,
}: TimelineCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [, setTapCount] = useState(0);
  const [swipeStart, setSwipeStart] = useState<number | null>(null);
  const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const longPressRef = useRef<NodeJS.Timeout | null>(null);

  // Detecta duplo-tap
  const handleTap = (e: React.MouseEvent) => {
    // Duplo-tap em imagem abre fullscreen
    if ((e.target as HTMLElement).closest("img")) {
      setTapCount((prev) => {
        if (prev === 1) {
          onDoubleTap?.();
          setTapCount(0);
          return 0;
        }
        return prev + 1;
      });

      if (tapTimeoutRef.current) clearTimeout(tapTimeoutRef.current);
      tapTimeoutRef.current = setTimeout(() => setTapCount(0), 300);
    } else {
      // Tap simples no card = expande
      setIsExpanded(!isExpanded);
      onTap?.();
    }
  };

  // Long-press (abre menu contextual)
  const handleMouseDown = () => {
    longPressRef.current = setTimeout(() => {
      const event = new MouseEvent("contextmenu", {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      onLongPress?.(event as any);
    }, 500);
  };

  const handleMouseUp = () => {
    if (longPressRef.current) clearTimeout(longPressRef.current);
  };

  // Swipe detection
  const handleTouchStart = (e: React.TouchEvent) => {
    setSwipeStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (swipeStart === null) return;

    const swipeEnd = e.changedTouches[0].clientX;
    const diff = swipeStart - swipeEnd;

    // Threshold: 50px para considerar swipe
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe esquerda -> próximo
        onNavigateNext?.();
      } else {
        // Swipe direita -> anterior
        onNavigatePrevious?.();
      }
    }

    setSwipeStart(null);
  };

  const age = calculateAge(baby.birthDate, moment.date);
  const typeIcon = getMomentTypeIcon(moment.templateId, moment.chapterId);
  const dateFormatted = formatShortDate(moment.date);
  const textPreview = getTextPreview(moment.noteLong || moment.noteShort);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleTap}
      className="cursor-pointer group"
    >
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">
        {/* Media Container */}
        <div className="relative aspect-video bg-muted overflow-hidden">
          {moment.media && moment.media.length > 0 ? (
            <>
              <img
                src={moment.media[0]}
                alt={moment.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {moment.media.length > 1 && (
                <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                  +{moment.media.length - 1}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">
              {typeIcon}
            </div>
          )}

          {/* Overlay: Type Icon + Chapter Badge */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute top-2 left-2 flex items-center gap-2">
            <span className="text-2xl">{typeIcon}</span>
          </div>

          {chapter && (
            <div className="absolute top-2 right-2">
              <Badge
                className="text-white text-xs"
                style={{ backgroundColor: chapter.color }}
              >
                {chapter.icon} {chapter.name}
              </Badge>
            </div>
          )}

          {/* Swipe Navigation Hints */}
          {(onNavigatePrevious || onNavigateNext) && (
            <>
              {onNavigatePrevious && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronLeft className="w-8 h-8 text-white drop-shadow-lg ml-2" />
                </div>
              )}
              {onNavigateNext && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="w-8 h-8 text-white drop-shadow-lg mr-2" />
                </div>
              )}
            </>
          )}
        </div>

        {/* Card Body */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
            {moment.title}
          </h3>

          {/* Footer: Date + Age */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
            <span className="font-medium">{dateFormatted}</span>
            <span>·</span>
            <span>{age}</span>
            {moment.location && (
              <>
                <span>·</span>
                <MapPin className="w-3 h-3" />
                <span className="line-clamp-1">{moment.location}</span>
              </>
            )}
          </div>

          {/* Text Preview */}
          {textPreview && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {textPreview}
            </p>
          )}

          {/* Avatares das pessoas (se houver) */}
          {moment.people && moment.people.length > 0 && (
            <div className="flex items-center gap-1 mb-3">
              <Users className="w-3 h-3 text-muted-foreground" />
              <div className="flex flex-wrap gap-1">
                {moment.people.map((person, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full"
                  >
                    {person}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Ver mais / Expandir */}
          {(moment.noteLong || moment.tags?.length) && !isExpanded && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(true);
              }}
              className="text-xs text-primary font-medium flex items-center gap-1 hover:opacity-70 transition-opacity"
            >
              ↓ Ver mais
            </button>
          )}
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-border overflow-hidden"
            >
              <div className="p-4 bg-muted/30 space-y-3">
                {/* Full note */}
                {moment.noteLong && (
                  <div>
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {moment.noteLong}
                    </p>
                  </div>
                )}

                {/* Tags */}
                {moment.tags && moment.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {moment.tags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  {onEdit && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsExpanded(false);
                        onEdit();
                      }}
                      className="text-xs px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                      ✏️ Editar
                    </button>
                  )}
                  {onShare && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsExpanded(false);
                        onShare();
                      }}
                      className="text-xs px-3 py-2 rounded-lg bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 transition-colors"
                    >
                      🔗 Compartilhar
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsExpanded(false);
                        onDelete();
                      }}
                      className="text-xs px-3 py-2 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors"
                    >
                      🗑️ Excluir
                    </button>
                  )}
                </div>

                {/* Fechar */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(false);
                  }}
                  className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-2"
                >
                  ↑ Fechar
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

