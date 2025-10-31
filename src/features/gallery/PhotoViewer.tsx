import { X, Share2, Edit, Trash2, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';

interface Photo {
  id: string;
  url: string;
  title: string;
  date: string;
  age: string;
  location?: string;
  note?: string;
  tags?: string[];
  chapterName: string;
  chapterColor: string;
}

interface PhotoViewerProps {
  isOpen: boolean;
  photos: Photo[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function PhotoViewer({ isOpen, photos, currentIndex, onClose, onNext, onPrevious }: PhotoViewerProps) {
  const [showInfo, setShowInfo] = useState(true);
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset zoom when changing photos
  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [currentIndex]);

  // Handle swipe gestures
  const handleTouchStart = useRef({ x: 0, y: 0, time: 0 });
  
  const onTouchStart = (e: React.TouchEvent) => {
    if (scale === 1) {
      handleTouchStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
      };
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (scale === 1) {
      const deltaX = e.changedTouches[0].clientX - handleTouchStart.current.x;
      const deltaY = e.changedTouches[0].clientY - handleTouchStart.current.y;
      const deltaTime = Date.now() - handleTouchStart.current.time;

      // Swipe down to close
      if (Math.abs(deltaY) > 100 && Math.abs(deltaY) > Math.abs(deltaX) && deltaTime < 300) {
        if (deltaY > 0) {
          onClose();
        }
      }
      // Swipe left/right to navigate
      else if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) && deltaTime < 300) {
        if (deltaX > 0 && currentIndex > 0) {
          onPrevious();
        } else if (deltaX < 0 && currentIndex < photos.length - 1) {
          onNext();
        }
      }
    }
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => {
      const newScale = Math.max(prev - 0.5, 1);
      if (newScale === 1) {
        setPosition({ x: 0, y: 0 });
      }
      return newScale;
    });
  };

  if (!isOpen || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-50 flex flex-col"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/90 to-transparent">
            <div className="flex items-center justify-between p-4">
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center transition-colors"
                aria-label="Fechar"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              <div className="flex gap-2">
                {scale > 1 ? (
                  <>
                    <button
                      onClick={handleZoomOut}
                      className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center transition-colors"
                      aria-label="Diminuir zoom"
                    >
                      <ZoomOut className="w-5 h-5 text-white" />
                    </button>
                    <button
                      onClick={handleZoomIn}
                      className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center transition-colors"
                      aria-label="Aumentar zoom"
                      disabled={scale >= 3}
                    >
                      <ZoomIn className="w-5 h-5 text-white" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleZoomIn}
                      className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center transition-colors"
                      aria-label="Zoom"
                    >
                      <ZoomIn className="w-5 h-5 text-white" />
                    </button>
                    <button
                      className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center transition-colors"
                      aria-label="Compartilhar"
                    >
                      <Share2 className="w-5 h-5 text-white" />
                    </button>
                    <button
                      className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center transition-colors"
                      aria-label="Editar"
                    >
                      <Edit className="w-5 h-5 text-white" />
                    </button>
                    <button
                      className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center transition-colors"
                      aria-label="Excluir"
                    >
                      <Trash2 className="w-5 h-5 text-white" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Photo */}
          <div 
            ref={containerRef}
            className="flex-1 flex items-center justify-center relative overflow-hidden touch-none"
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={currentPhoto.id}
                src={currentPhoto.url}
                alt={currentPhoto.title}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: 1,
                  scale: scale,
                  x: position.x,
                  y: position.y,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="max-w-full max-h-full object-contain select-none"
                style={{
                  cursor:
                    scale > 1 ? (isDragging ? "grabbing" : "grab") : "default",
                }}
                drag={scale > 1}
                dragConstraints={containerRef}
                dragElastic={0.1}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={() => setIsDragging(false)}
              />
            </AnimatePresence>

            {/* Navigation */}
            {photos.length > 1 && scale === 1 && (
              <>
                <button
                  onClick={onPrevious}
                  className="absolute left-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center transition-colors disabled:opacity-30"
                  aria-label="Anterior"
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={onNext}
                  className="absolute right-4 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center transition-colors disabled:opacity-30"
                  aria-label="Próxima"
                  disabled={currentIndex === photos.length - 1}
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}
          </div>

          {/* Info Footer */}
          <AnimatePresence>
            {showInfo && (
              <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                exit={{ y: 100 }}
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent"
              >
                <div className="p-4 max-w-2xl mx-auto">
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="px-3 py-1 rounded-lg text-xs text-white"
                      style={{ backgroundColor: currentPhoto.chapterColor }}
                    >
                      {currentPhoto.chapterName}
                    </div>
                    <span className="text-white/70 text-sm">
                      {currentIndex + 1} / {photos.length}
                    </span>
                  </div>

                  <h3 className="text-white mb-1">{currentPhoto.title}</h3>
                  <p className="text-white/70 text-sm mb-2">
                    {currentPhoto.age} · {currentPhoto.date}
                  </p>

                  {currentPhoto.location && (
                    <p className="text-white/70 text-sm mb-2">{currentPhoto.location}</p>
                  )}

                  {currentPhoto.note && (
                    <p className="text-white/90 text-sm mb-3">{currentPhoto.note}</p>
                  )}

                  {currentPhoto.tags && currentPhoto.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {currentPhoto.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-white/20 text-white border-0">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toggle info button */}
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="absolute bottom-4 right-4 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white text-sm transition-colors"
          >
            {showInfo ? 'Ocultar' : 'Mostrar'} info
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
