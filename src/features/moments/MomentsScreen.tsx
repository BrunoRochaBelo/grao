import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useBabyData } from "@/lib/baby-data-context";
import { Moment } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { FilterChips } from "./components/FilterChips";
import { TimelineGroupHeader } from "./components/TimelineGroupHeader";
import { TimelineCard } from "./components/TimelineCard";
import { EmptyPlaceholder } from "./components/EmptyPlaceholder";
import { ContextMenu, ContextMenuAction } from "./components/ContextMenu";
import { FullScreenViewer } from "./components/FullScreenViewer";
import { useFilters } from "./hooks/useFilters";
import { useTimelineGroups } from "./hooks/useTimelineGroups";

interface MomentsScreenProps {
  onBack: () => void;
  onEditMoment?: (moment: Moment) => void;
}

export function MomentsScreen({ onBack, onEditMoment }: MomentsScreenProps) {
  const {
    chapters,
    currentBaby,
    getMoments,
    getPlaceholdersForChapter,
    deleteMoment,
  } = useBabyData();

  const moments = getMoments();
  const {
    filters,
    filteredMoments,
    availableFilters,
    toggleChapter,
    togglePerson,
    toggleTag,
    clearFilters,
    toggleFavorite,
    hasActiveFilters,
  } = useFilters(moments, currentBaby?.birthDate);

  const timelineGroups = useTimelineGroups(filteredMoments);

  // Estados para interações
  const [selectedMoment, setSelectedMoment] = useState<Moment | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    moment: Moment;
  } | null>(null);
  const [fullScreenMoment, setFullScreenMoment] = useState<Moment | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Moment | null>(
    null
  );

  // Ações do menu contextual
  const handleContextMenu = useCallback(
    (e: React.MouseEvent, moment: Moment) => {
      e.preventDefault();
      e.stopPropagation();
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        moment,
      });
    },
    []
  );

  const handleDelete = useCallback((moment: Moment) => {
    setShowDeleteConfirm(moment);
    setContextMenu(null);
  }, []);

  const confirmDelete = useCallback(
    (moment: Moment) => {
      deleteMoment(moment.id);
      setShowDeleteConfirm(null);
      toast.success("Lembrança removida com carinho 💭");
    },
    [deleteMoment]
  );

  const handleShare = useCallback((moment: Moment) => {
    setContextMenu(null);
    // TODO: Implementar compartilhamento
    toast.info("Funcionalidade de compartilhamento em breve 🔗");
  }, []);

  const handleEdit = useCallback(
    (moment: Moment) => {
      setContextMenu(null);
      onEditMoment?.(moment);
    },
    [onEditMoment]
  );

  if (!currentBaby) {
    return (
      <div className="flex items-center justify-center min-h-screen text-muted-foreground">
        Nenhum bebê selecionado
      </div>
    );
  }

  // Determina se mostra placeholders
  const singleChapterFilter =
    filters.chapters.length === 1 ? filters.chapters[0] : null;
  const placeholders = singleChapterFilter
    ? getPlaceholdersForChapter(singleChapterFilter)
    : [];

  return (
    <div className="pb-24 max-w-2xl mx-auto">
      {/* Header fixo */}
      <div className="sticky top-0 z-20 bg-background border-b border-border">
        {/* Top bar com voltar */}
        <div className="px-4 pt-6 pb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 min-h-[44px]"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>

          {/* Título e subtitle */}
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              📖 História de {currentBaby.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              Desde{" "}
              {new Date(currentBaby.birthDate).toLocaleDateString("pt-BR")} até
              hoje
            </p>
          </div>
        </div>

        {/* Filtros */}
        <FilterChips
          chapters={chapters}
          filters={filters}
          hasActiveFilters={hasActiveFilters}
          onToggleChapter={toggleChapter}
          onTogglePerson={togglePerson}
          onToggleTag={toggleTag}
          onClearFilters={clearFilters}
          onToggleFavorite={toggleFavorite}
          availablePeople={availableFilters.people}
          availableTags={availableFilters.tags}
        />
      </div>

      {/* Timeline */}
      <div className="px-4 py-6 space-y-8">
        <AnimatePresence mode="popLayout">
          {timelineGroups.length > 0 ? (
            timelineGroups.map((group) => (
              <motion.div key={group.monthYear} layout>
                <TimelineGroupHeader monthYear={group.monthYear} />

                <div className="space-y-4">
                  {group.moments.map((moment) => {
                    const chapter = chapters.find(
                      (c) => c.id === moment.chapterId
                    );
                    return (
                      <TimelineCard
                        key={moment.id}
                        moment={moment}
                        chapter={chapter}
                        baby={currentBaby}
                        onTap={() => setSelectedMoment(moment)}
                        onLongPress={(e) => handleContextMenu(e, moment)}
                        onDoubleTap={() => setFullScreenMoment(moment)}
                        onEdit={() => handleEdit(moment)}
                        onShare={() => handleShare(moment)}
                        onDelete={() => handleDelete(moment)}
                      />
                    );
                  })}
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-4xl mb-3">📸</div>
              <h3 className="font-semibold text-foreground mb-1">
                Nenhum momento registrado
              </h3>
              <p className="text-sm text-muted-foreground">
                Comece a registrar os momentos especiais de {currentBaby.name}
              </p>
            </motion.div>
          )}

          {/* Placeholders quando filtrado por capítulo */}
          {singleChapterFilter && placeholders.length > 0 && (
            <motion.div
              key="placeholders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.2 }}
              layout
            >
              <div className="bg-muted/30 rounded-2xl p-6 mb-6">
                <h3 className="font-semibold text-foreground mb-4">
                  Momentos esperados
                </h3>
                <div className="space-y-3">
                  {placeholders
                    .filter((p) => !p.isCompleted)
                    .map((placeholder) => (
                      <EmptyPlaceholder
                        key={placeholder.id}
                        name={placeholder.name}
                        templateType={placeholder.templateType}
                        onTap={() => {
                          // TODO: Abrir formulário para registrar este momento
                          toast.info(`Registrar: ${placeholder.name}`);
                        }}
                      />
                    ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          actions={[
            {
              id: "edit",
              label: "Editar",
              icon: "✏️",
              onClick: () => handleEdit(contextMenu.moment),
            },
            {
              id: "share",
              label: "Compartilhar",
              icon: "🔗",
              onClick: () => handleShare(contextMenu.moment),
            },
            {
              id: "delete",
              label: "Excluir",
              icon: "🗑️",
              color: "text-red-600",
              onClick: () => handleDelete(contextMenu.moment),
            },
          ]}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowDeleteConfirm(null)}
          className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full shadow-xl"
          >
            <h3 className="font-semibold text-foreground mb-2">
              Excluir momento?
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Esta ação não pode ser desfeita. O momento "
              {showDeleteConfirm.title}" será removido permanentemente.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={() => confirmDelete(showDeleteConfirm)}
                className="flex-1"
              >
                Excluir
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Full Screen Viewer */}
      {fullScreenMoment && (
        <FullScreenViewer
          moment={fullScreenMoment}
          chapter={chapters.find((c) => c.id === fullScreenMoment.chapterId)}
          baby={currentBaby}
          allMoments={moments}
          isOpen={true}
          onClose={() => setFullScreenMoment(null)}
          onEdit={() => handleEdit(fullScreenMoment)}
          onShare={() => handleShare(fullScreenMoment)}
          onDelete={() => handleDelete(fullScreenMoment)}
        />
      )}
    </div>
  );
}
