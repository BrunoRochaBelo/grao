import { X, ArrowLeft, ChevronRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useBabyData } from "@/context/baby-data-context";
import { useState, useMemo } from "react";
import { Progress } from "@/components/ui/progress";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchResults } from "@/components/search/SearchResults";
import { searchChaptersAndMoments } from "@/lib/mockData";
import { MomentTemplateCard } from "./MomentTemplateCard";
import { BlankMomentForm } from "../moments/BlankMomentForm";
import { getHighlightStyle, HighlightTone } from "@/lib/highlights";
import type {
  Chapter,
  PlaceholderTemplate,
  SearchResult,
  SearchFilters,
  Moment,
} from "@/types";

type TemplateFilter = "all" | "completed" | "pending";

interface AddMomentSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChapter: (chapter: Chapter, template?: PlaceholderTemplate) => void;
}

// ChapterCard component (replicado do ChaptersScreen)
interface ChapterCardProps {
  chapter: Chapter;
  onClick: () => void;
}

function ChapterCard({ chapter, onClick }: ChapterCardProps) {
  const { getPlaceholdersForChapter, getMoments } = useBabyData();

  const { completedCount, totalCount, percentage, pending } = useMemo(() => {
    const placeholders = getPlaceholdersForChapter(chapter.id);
    const moments = getMoments();

    const total = placeholders.length;
    const completed = placeholders.filter((p) =>
      moments.some((m) => m.templateId === p.id)
    ).length;
    const perc = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      completedCount: completed,
      totalCount: total,
      percentage: perc,
      pending: total - completed,
    };
  }, [chapter.id, getPlaceholdersForChapter, getMoments]);

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="bg-card rounded-2xl p-4 shadow-sm border border-border hover:shadow-md transition-shadow text-left w-full"
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ backgroundColor: chapter.color }}
        >
          {chapter.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-foreground mb-1">{chapter.name}</h3>
          <p className="text-muted-foreground text-sm">{chapter.description}</p>
        </div>
      </div>

      <div className="mb-2">
        <Progress value={percentage} className="h-2" />
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {completedCount} de {totalCount} preenchidos
        </span>
        {pending > 0 && (
          <span className="bg-warning/20 text-warning px-2 py-0.5 rounded-lg">
            {pending} {pending === 1 ? "pendente" : "pendentes"}
          </span>
        )}
      </div>
    </motion.button>
  );
}

export function AddMomentSheet({
  isOpen,
  onClose,
  onSelectChapter,
}: AddMomentSheetProps) {
  const {
    chapters = [],
    getMoments,
    getPlaceholdersForChapter,
  } = useBabyData();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "detail">("list");
  const [templateFilter, setTemplateFilter] =
    useState<TemplateFilter>("pending"); // Inicia com "pendentes"
  const [showBlankMomentForm, setShowBlankMomentForm] = useState(false);

  const totalMoments = useMemo(() => {
    return getMoments().length;
  }, [getMoments]);

  // Templates do capítulo selecionado
  const chapterTemplates = useMemo(() => {
    if (!selectedChapter) return [];

    const allPlaceholders = getPlaceholdersForChapter(selectedChapter.id);
    const moments = getMoments();

    return allPlaceholders.map((placeholder) => {
      const moment = moments.find((m) => m.templateId === placeholder.id);
      const hasMoment = Boolean(moment);

      return {
        ...placeholder,
        isCompleted: hasMoment,
        thumbnail: moment?.media[0],
        moment,
      };
    });
  }, [selectedChapter, getPlaceholdersForChapter, getMoments]);

  const completedCount = chapterTemplates.filter((t) => t.isCompleted).length;
  const totalCount = chapterTemplates.length;
  const percentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Filtrar templates baseado no filtro selecionado
  const filteredTemplates = useMemo(() => {
    return chapterTemplates.filter((template) => {
      if (templateFilter === "completed") {
        return template.isCompleted;
      }
      if (templateFilter === "pending") {
        return !template.isCompleted;
      }
      return true; // "all"
    });
  }, [chapterTemplates, templateFilter]);

  // Handle search (igual ao ChaptersScreen)
  const handleSearch = (query: string, filters: SearchFilters) => {
    setSearchQuery(query);
    setSearchFilters(filters);

    if (!query.trim()) {
      setSearchResult(null);
      return;
    }

    const results = searchChaptersAndMoments(query, filters);
    setSearchResult(results);
  };

  // Handle opening moment
  const handleOpenMoment = (momentId: string) => {
    const moment = getMoments().find((m) => m.id === momentId);
    if (moment) {
      const chapter = chapters.find((c) => c.id === moment.chapterId);
      if (chapter) {
        onSelectChapter(chapter);
      }
    }
  };

  // Handle opening template
  const handleOpenTemplate = (chapterId: string, templateId: string) => {
    const chapter = chapters.find((c) => c.id === chapterId);
    if (chapter) {
      onSelectChapter(chapter);
    }
  };

  // Handle opening chapter - navegar para detalhe
  const handleOpenChapter = (chapterId: string) => {
    const chapter = chapters.find((c) => c.id === chapterId);
    if (chapter) {
      setSelectedChapter(chapter);
      setViewMode("detail");
      setSearchQuery("");
      setSearchFilters({});
      setSearchResult(null);
      setTemplateFilter("pending"); // Reset para pendentes
    }
  };

  // Handle clicking on a chapter card
  const handleChapterClick = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setViewMode("detail");
    setSearchQuery("");
    setSearchFilters({});
    setSearchResult(null);
    setTemplateFilter("pending"); // Reset para pendentes
  };

  // Handle back to chapters list
  const handleBackToList = () => {
    setViewMode("list");
    setSelectedChapter(null);
    setSearchQuery("");
    setSearchFilters({});
    setSearchResult(null);
    setTemplateFilter("pending"); // Reset para pendentes
  };

  // Handle selecting a template
  const handleSelectTemplate = (
    template: PlaceholderTemplate & { moment?: Moment }
  ) => {
    if (selectedChapter) {
      onSelectChapter(selectedChapter, template);
    }
  };

  const handleCloseSheet = () => {
    setViewMode("list");
    setSelectedChapter(null);
    setSearchQuery("");
    setSearchFilters({});
    setSearchResult(null);
    setTemplateFilter("pending"); // Reset para pendentes
    onClose();
  };

  const isSearchMode = searchResult !== null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseSheet}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-background rounded-t-3xl z-50 max-h-[85vh] overflow-hidden flex flex-col max-w-2xl mx-auto"
          >
            {/* Header com Breadcrumb */}
            <div className="px-4 py-4 border-b border-border bg-background">
              {/* Breadcrumb */}
              {viewMode === "detail" && selectedChapter && (
                <div className="mb-3 flex items-center gap-2 text-sm">
                  <button
                    onClick={handleBackToList}
                    className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                  >
                    Capítulos
                  </button>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground font-medium truncate">
                    {selectedChapter.name}
                  </span>
                </div>
              )}

              {/* Header principal */}
              <div className="flex items-center gap-3">
                {viewMode === "detail" && (
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleBackToList}
                    className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors"
                    aria-label="Voltar"
                  >
                    <ArrowLeft className="w-5 h-5 text-foreground" />
                  </motion.button>
                )}
                <h2 className="text-lg font-semibold text-foreground flex-1">
                  {viewMode === "list"
                    ? "Selecione um Capítulo"
                    : "Escolha um Momento"}
                </h2>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCloseSheet}
                  className="p-2 -mr-2 hover:bg-muted rounded-lg transition-colors"
                  aria-label="Fechar"
                >
                  <X className="w-5 h-5 text-foreground" />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <AnimatePresence mode="wait">
                {viewMode === "list" ? (
                  /* Lista de Capítulos */
                  <motion.div
                    key="chapters-list"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Search Bar */}
                    <div className="mb-6">
                      <SearchBar
                        onSearch={handleSearch}
                        placeholder="Encontre capítulos ou momentos"
                        initialQuery={searchQuery}
                        initialFilters={searchFilters}
                      />
                    </div>

                    {/* Content: Search Results or Normal Chapters Grid */}
                    {isSearchMode ? (
                      <SearchResults
                        results={searchResult}
                        onOpenMoment={handleOpenMoment}
                        onOpenChapter={handleOpenChapter}
                        onOpenTemplate={handleOpenTemplate}
                      />
                    ) : (
                      <>
                        {/* Normal Chapters Grid */}
                        <div className="grid grid-cols-1 gap-3 mb-6">
                          {chapters.map((chapter, index) => (
                            <motion.div
                              key={chapter.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <ChapterCard
                                chapter={chapter}
                                onClick={() => handleChapterClick(chapter)}
                              />
                            </motion.div>
                          ))}
                        </div>

                        {/* Summary */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="bg-primary/5 rounded-2xl p-4 border border-primary/20"
                        >
                          <p className="text-center text-muted-foreground">
                            {totalMoments > 0
                              ? `${totalMoments} ${
                                  totalMoments === 1
                                    ? "momento registrado"
                                    : "momentos registrados"
                                }. Continue preenchendo para completar o álbum! 💛`
                              : "Comece a registrar os momentos especiais! 💛"}
                          </p>
                        </motion.div>
                      </>
                    )}
                  </motion.div>
                ) : (
                  /* Detalhe do Capítulo */
                  <motion.div
                    key="chapter-detail"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {selectedChapter && (
                      <>
                        {/* Chapter Info Card */}
                        <div className="mb-6">
                          <div className="bg-card rounded-2xl p-4 border border-border">
                            <div className="flex items-start gap-3 mb-4">
                              <div
                                className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
                                style={{
                                  backgroundColor: selectedChapter.color,
                                }}
                              >
                                {selectedChapter.icon}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-foreground mb-1 font-semibold">
                                  {selectedChapter.name}
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                  {selectedChapter.description}
                                </p>
                              </div>
                            </div>

                            <div className="mb-2">
                              <Progress value={percentage} className="h-2" />
                            </div>

                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">
                                {completedCount} de {totalCount} preenchidos
                              </span>
                              {totalCount - completedCount > 0 && (
                                <span className="bg-warning/20 text-warning px-2 py-0.5 rounded-lg text-xs">
                                  {totalCount - completedCount}{" "}
                                  {totalCount - completedCount === 1
                                    ? "pendente"
                                    : "pendentes"}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Botão Momento em Branco */}
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setShowBlankMomentForm(true)}
                          className="w-full mb-4 px-4 py-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 transition-colors flex items-center justify-center gap-2"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span className="font-medium">
                            Criar Momento em Branco
                          </span>
                        </motion.button>

                        {/* Filtros de Templates */}
                        <div className="mb-4">
                          <div className="flex gap-2">
                            {(
                              [
                                {
                                  id: "pending",
                                  label: "Pendentes",
                                  tone: "babyBlue",
                                },
                                { id: "all", label: "Todos", tone: "lavender" },
                                {
                                  id: "completed",
                                  label: "Preenchidos",
                                  tone: "mint",
                                },
                              ] satisfies {
                                id: TemplateFilter;
                                label: string;
                                tone: HighlightTone;
                              }[]
                            ).map((option) => {
                              const isActive = templateFilter === option.id;
                              const count =
                                option.id === "all"
                                  ? totalCount
                                  : option.id === "completed"
                                  ? completedCount
                                  : totalCount - completedCount;

                              return (
                                <button
                                  key={option.id}
                                  onClick={() => setTemplateFilter(option.id)}
                                  className={`px-4 py-2 rounded-xl text-sm transition-colors border ${
                                    isActive
                                      ? "shadow-soft"
                                      : "bg-muted text-muted-foreground hover:bg-muted/80 border-transparent"
                                  }`}
                                  style={
                                    isActive
                                      ? getHighlightStyle(option.tone)
                                      : undefined
                                  }
                                >
                                  {option.label} ({count})
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Templates List */}
                        {filteredTemplates.length === 0 ? (
                          <div className="text-center py-12">
                            <p className="text-muted-foreground">
                              {templateFilter === "completed"
                                ? "Nenhum momento preenchido ainda"
                                : templateFilter === "pending"
                                ? "Parabéns! Todos os momentos foram preenchidos! 🎉"
                                : "Nenhum momento disponível neste capítulo"}
                            </p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 gap-3">
                            {filteredTemplates.map((template) => (
                              <MomentTemplateCard
                                key={template.id}
                                template={template}
                                moment={template.moment}
                                chapter={selectedChapter}
                                onOpenTemplate={() =>
                                  handleSelectTemplate(template)
                                }
                              />
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}

      {/* Blank Moment Form */}
      <BlankMomentForm
        isOpen={showBlankMomentForm}
        onClose={() => setShowBlankMomentForm(false)}
        chapter={selectedChapter || chapters[0]} // Fallback to first chapter
        onSave={() => {
          setShowBlankMomentForm(false);
        }}
      />
    </AnimatePresence>
  );
}
