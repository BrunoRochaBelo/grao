import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useBabyData } from "@/context/baby-data-context";
import { Moment } from "@/types";
import { Button } from "@/components/ui/button";
import { FilterChips } from "./components/FilterChips";
import { TimelineGroupHeader } from "./components/TimelineGroupHeader";
import { TimelineCard } from "./components/TimelineCard";
import { EmptyPlaceholder } from "./components/EmptyPlaceholder";
import { ContextMenu } from "./components/ContextMenu";
import { FullScreenViewer } from "./components/FullScreenViewer";
import { useFilters } from "./hooks/useFilters";
import { useTimelineGroups } from "./hooks/useTimelineGroups";

interface MomentsScreenProps {
  onEditMoment?: (moment: Moment) => void;
}

export function MomentsScreen({ onEditMoment }: MomentsScreenProps) {
  const {
    chapters,
    currentBaby,
    getMoments,
    getPlaceholdersForChapter,
    deleteMoment,
    getFamilyMembers,
  } = useBabyData();

  const moments = getMoments();
  const familyMembers = getFamilyMembers();
  const {
    filters,
    filteredMoments,
    availableFilters,
    toggleChapter,
    togglePerson,
    toggleTag,
    setAgeRange,
    clearFilters,
    toggleFavorite,
    hasActiveFilters,
  } = useFilters(moments, currentBaby?.birthDate, familyMembers);

  const timelineGroups = useTimelineGroups(filteredMoments);

  // Estados para interações
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
    const hint = moment.title || moment.noteShort || "momento";
    toast.info(`Compartilhamento de "${hint}" disponível em breve ✨`);
  }, []);

  const handleEdit = useCallback(
    (moment: Moment) => {
      setContextMenu(null);
      onEditMoment?.(moment);
    },
    [onEditMoment]
  );

  // Wrapper para limpar filtros com toast
  const handleClearFilters = useCallback(() => {
    clearFilters();
    toast.success("Voltando à linha completa do tempo ⏳");
  }, [clearFilters]);

  // Navegar entre momentos do mesmo grupo
  const handleNavigateBetweenMoments = useCallback(
    (currentMoment: Moment, direction: "previous" | "next") => {
      // Encontrar o grupo que contém este momento
      const currentGroup = timelineGroups.find((g) =>
        g.moments.some((m) => m.id === currentMoment.id)
      );

      if (!currentGroup) return;

      const momentIndex = currentGroup.moments.findIndex(
        (m) => m.id === currentMoment.id
      );

      if (
        direction === "next" &&
        momentIndex < currentGroup.moments.length - 1
      ) {
        setFullScreenMoment(currentGroup.moments[momentIndex + 1]);
      } else if (direction === "previous" && momentIndex > 0) {
        setFullScreenMoment(currentGroup.moments[momentIndex - 1]);
      }
    },
    [timelineGroups]
  );

  if (!currentBaby) {
    return (
      <div className="flex items-center justify-center min-h-screen text-muted-foreground">
        Nenhum bebê selecionado
      </div>
    );
  }

  return (
    <div className="pb-24 max-w-2xl mx-auto">
      {/* Header com título */}
      <div className="sticky top-0 z-30 bg-background px-4 pt-6 pb-4 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground">
          História de {currentBaby.name}
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Desde {new Date(currentBaby.birthDate).toLocaleDateString("pt-BR")}{" "}
          até hoje
        </p>
      </div>

      {/* Filtros sticky */}
      <div className="sticky top-[78px] z-20 bg-background">
        <FilterChips
          chapters={chapters}
          filters={filters}
          hasActiveFilters={hasActiveFilters}
          onToggleChapter={toggleChapter}
          onTogglePerson={togglePerson}
          onToggleTag={toggleTag}
          onSetAgeRange={setAgeRange}
          onClearFilters={handleClearFilters}
          onToggleFavorite={toggleFavorite}
          availablePeople={availableFilters.people}
          availableAgeRanges={availableFilters.ageRanges}
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
                  {group.moments.map((moment, idx) => {
                    const chapter = chapters.find(
                      (c) => c.id === moment.chapterId
                    );
                    const hasPrevious = idx > 0;
                    const hasNext = idx < group.moments.length - 1;

                    return (
                      <TimelineCard
                        key={moment.id}
                        moment={moment}
                        chapter={chapter}
                        baby={currentBaby}
                        onTap={() => setFullScreenMoment(moment)}
                        onLongPress={(e) => handleContextMenu(e, moment)}
                        onDoubleTap={() => setFullScreenMoment(moment)}
                        onEdit={() => handleEdit(moment)}
                        onShare={() => handleShare(moment)}
                        onDelete={() => handleDelete(moment)}
                        onNavigatePrevious={
                          hasPrevious
                            ? () =>
                                handleNavigateBetweenMoments(moment, "previous")
                            : undefined
                        }
                        onNavigateNext={
                          hasNext
                            ? () => handleNavigateBetweenMoments(moment, "next")
                            : undefined
                        }
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

          {/* Placeholders quando filtrado por um capítulo */}
          {filters.chapters.length === 1 && timelineGroups.length > 0 && (
            <motion.div
              key="placeholders"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.2 }}
              layout
            >
              {(() => {
                const placeholders = getPlaceholdersForChapter(
                  filters.chapters[0]
                );
                const uncompletedPlaceholders = placeholders.filter(
                  (p) => !p.isCompleted
                );

                if (uncompletedPlaceholders.length === 0) return null;

                return (
                  <div className="space-y-4">
                    <div className="pt-4">
                      <h3 className="text-sm font-semibold text-muted-foreground px-4 mb-3">
                        ✨ Momentos esperados
                      </h3>
                      <div className="space-y-3">
                        {uncompletedPlaceholders.map((placeholder) => (
                          <EmptyPlaceholder
                            key={placeholder.id}
                            name={placeholder.name}
                            templateType={placeholder.templateType}
                            onTap={() => {
                              toast.info(`📝 Registrar: ${placeholder.name}`, {
                                description:
                                  "Abra o formulário para adicionar este momento",
                              });
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
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
            className="bg-card border border-border rounded-2xl px-4 py-6 max-w-2xl w-full shadow-xl"
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
