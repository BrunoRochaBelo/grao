import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Edit2,
  Share2,
  Trash2,
} from "lucide-react";
import { Moment, Chapter, Baby } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatShortDate, calculateAge } from "../utils/timelineUtils";

interface FullScreenViewerProps {
  moment: Moment;
  chapter?: Chapter;
  baby?: Baby;
  allMoments?: Moment[];
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onShare?: () => void;
  onDelete?: () => void;
}

export function FullScreenViewer({
  moment,
  chapter,
  baby,
  allMoments = [],
  isOpen,
  onClose,
  onEdit,
  onShare,
  onDelete,
}: FullScreenViewerProps) {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const lastTouchDistance = useRef(0);

  // Navegação entre mídias
  const handleNextMedia = () => {
    if (currentMediaIndex < moment.media.length - 1) {
      setCurrentMediaIndex((prev) => prev + 1);
      // Haptic feedback
      if ("vibrate" in navigator) navigator.vibrate(10);
    }
  };

  const handlePrevMedia = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex((prev) => prev - 1);
      if ("vibrate" in navigator) navigator.vibrate(10);
    }
  };

  // Swipe para fechar (down) e navegar (left/right)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;

    if (e.touches.length === 2) {
      lastTouchDistance.current = Math.hypot(
        e.touches[1].clientX - e.touches[0].clientX,
        e.touches[1].clientY - e.touches[0].clientY
      );
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;

    const deltaX = endX - touchStartX.current;
    const deltaY = endY - touchStartY.current;

    // Swipe down: fecha visualizador
    if (deltaY > 100) {
      onClose();
      return;
    }

    // Swipe left/right: navega entre mídias
    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        handlePrevMedia();
      } else {
        handleNextMedia();
      }
    }
  };

  const handlePinch = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && scale < 3) {
      const distance = Math.hypot(
        e.touches[1].clientX - e.touches[0].clientX,
        e.touches[1].clientY - e.touches[0].clientY
      );

      if (lastTouchDistance.current) {
        const ratio = distance / lastTouchDistance.current;
        setScale((prev) => Math.min(prev * ratio, 3));
      }

      lastTouchDistance.current = distance;
    }
  };

  if (!isOpen || !moment.media || moment.media.length === 0) {
    return null;
  }

  const currentMedia = moment.media[currentMediaIndex];
  const age = baby ? calculateAge(baby.birthDate, moment.date) : "";
  const dateFormatted = formatShortDate(moment.date);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/95 z-50 flex flex-col"
      >
        {/* Header com botão fechar */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent">
          <h3 className="text-white font-semibold flex-1 line-clamp-1">
            {moment.title}
          </h3>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Media Container */}
        <div
          ref={containerRef}
          className="flex-1 flex items-center justify-center overflow-hidden relative"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handlePinch}
        >
          <motion.img
            key={currentMediaIndex}
            src={currentMedia}
            alt={moment.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              scale,
              maxWidth: "100%",
              maxHeight: "100%",
            }}
            className="object-contain cursor-grab active:cursor-grabbing"
          />

          {/* Navigation Arrows */}
          {moment.media.length > 1 && (
            <>
              {currentMediaIndex > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevMedia();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors text-white"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}
              {currentMediaIndex < moment.media.length - 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextMedia();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors text-white"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}

              {/* Counter */}
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 text-white text-xs font-medium">
                {currentMediaIndex + 1} / {moment.media.length}
              </div>
            </>
          )}

          {/* Reset zoom hint */}
          {scale > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setScale(1);
              }}
              className="absolute top-16 right-4 text-xs text-white/70 hover:text-white transition-colors"
            >
              Duplo-tap para resetar zoom
            </button>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent pt-8 px-4 pb-4">
          <div className="space-y-3">
            {/* Info */}
            <div className="flex items-center gap-2 text-white text-sm">
              <span className="font-medium">{dateFormatted}</span>
              <span className="text-white/50">·</span>
              <span className="text-white/70">{age}</span>
              {moment.location && (
                <>
                  <span className="text-white/50">·</span>
                  <span className="text-white/70 line-clamp-1">
                    📍 {moment.location}
                  </span>
                </>
              )}
            </div>

            {/* Chapter */}
            {chapter && (
              <Badge
                className="text-white text-xs inline-block"
                style={{ backgroundColor: chapter.color }}
              >
                {chapter.icon} {chapter.name}
              </Badge>
            )}

            {/* Tags */}
            {moment.tags && moment.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {moment.tags.map((tag, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="text-xs bg-white/20 text-white"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              {onEdit && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                >
                  <Edit2 className="w-3 h-3" />
                  Editar
                </Button>
              )}
              {onShare && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onShare();
                  }}
                >
                  <Share2 className="w-3 h-3" />
                  Compartilhar
                </Button>
              )}
              {onDelete && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs gap-1 text-red-600 hover:text-red-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                  Excluir
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
