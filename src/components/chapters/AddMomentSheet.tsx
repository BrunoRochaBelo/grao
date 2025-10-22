import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { chapters, Chapter, getPlaceholdersForChapter, getBabyAgeInDays, currentBaby, getMoments } from '../../lib/mockData';

interface AddMomentSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChapter: (chapter: Chapter) => void;
}

export function AddMomentSheet({ isOpen, onClose, onSelectChapter }: AddMomentSheetProps) {
  const babyAgeInDays = getBabyAgeInDays(currentBaby.birthDate);
  const moments = getMoments();
  
  const chaptersWithCounts = chapters.map(chapter => {
    const placeholders = getPlaceholdersForChapter(chapter.id, babyAgeInDays);
    const completedCount = placeholders.filter(p => 
      moments.some(m => m.templateId === p.id)
    ).length;
    return {
      ...chapter,
      completedCount,
      totalCount: placeholders.length,
    };
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-background rounded-t-3xl z-50 max-h-[85vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-foreground">Adicionar Momento</h2>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
                aria-label="Fechar"
              >
                <X className="w-6 h-6 text-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="max-w-2xl mx-auto">
                <div className="mb-4">
                  <button className="w-full bg-card rounded-xl p-4 shadow-sm border border-border hover:shadow-md transition-shadow text-left">
                    <h3 className="text-foreground mb-1">📝 Nota Livre</h3>
                    <p className="text-muted-foreground text-sm">
                      Registre um momento especial sem template
                    </p>
                  </button>
                </div>

                <div className="mb-3">
                  <h3 className="text-foreground">Ou escolha um capítulo:</h3>
                </div>

                <div className="space-y-2">
                  {chaptersWithCounts.map((chapter) => (
                    <motion.button
                      key={chapter.id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        onSelectChapter(chapter);
                        onClose();
                      }}
                      className="w-full bg-card rounded-xl p-4 shadow-sm border border-border hover:shadow-md transition-shadow text-left flex items-center gap-3"
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                        style={{ backgroundColor: chapter.color }}
                      >
                        {chapter.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-foreground mb-0.5">{chapter.name}</h3>
                        <p className="text-muted-foreground text-sm">
                          {chapter.completedCount} de {chapter.totalCount} preenchidos
                        </p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
