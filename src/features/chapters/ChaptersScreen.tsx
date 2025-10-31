import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";
import { useBabyData } from "@/context/baby-data-context";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchResults } from "@/components/search/SearchResults";
import { searchChaptersAndMoments } from "@/lib/mockData";
import type {
  Chapter,
  PlaceholderTemplate,
  SearchResult,
  SearchFilters,
} from "@/types";

interface ChapterCardProps {
  chapter: Chapter;
  onClick: () => void;
}

function ChapterCard({ chapter, onClick }: ChapterCardProps) {
  const { getPlaceholdersForChapter, getMoments } = useBabyData();

  // Memoizar cálculos para evitar re-computações
  const { completedCount, totalCount, percentage, pending } = useMemo(() => {
    const placeholders = getPlaceholdersForChapter(chapter.id, undefined, {
      includeAllAges: true,
    });
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

interface ChaptersScreenProps {
  onSelectChapter: (chapter: Chapter, template?: PlaceholderTemplate) => void;
  onBack?: () => void;
}

export function ChaptersScreen({ onSelectChapter, onBack }: ChaptersScreenProps) {
  const { chapters = [], status, getMoments, getPlaceholdersForChapter } =
    useBabyData();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);

  // Memoizar cálculo do total de momentos
  const totalMoments = useMemo(() => {
    return getMoments().length;
  }, [getMoments]);

  // Handle search
  const handleSearch = (query: string, filters: SearchFilters) => {
    setSearchQuery(query);
    setSearchFilters(filters);

    // Always reset to normal view when query is empty
    if (!query.trim()) {
      setSearchResult(null);
      return;
    }

    // Only perform search when there's an actual query
    const results = searchChaptersAndMoments(query, filters);
    setSearchResult(results);
  };

  // Handle opening moment (for deep linking)
  const handleOpenMoment = (momentId: string) => {
    // For now, just navigate to the chapter containing the moment
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
    if (!chapter) {
      return;
    }

    const template = getPlaceholdersForChapter(chapterId, undefined, {
      includeAllAges: true,
    }).find(
      (item: PlaceholderTemplate) => item.id === templateId
    );
    onSelectChapter(chapter, template);
  };

  // Handle opening chapter
  const handleOpenChapter = (chapterId: string) => {
    const chapter = chapters.find((c) => c.id === chapterId);
    if (chapter) {
      onSelectChapter(chapter);
    }
  };

  // Mostrar loader apenas se ainda estiver carregando
  if (status === "loading" || status === "idle") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando capítulos...</p>
        </div>
      </div>
    );
  }

  // Mostrar erro se houver
  if (status === "error") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-destructive mb-4">Erro ao carregar capítulos</p>
          <button
            onClick={() => window.location.reload()}
            className="text-primary"
          >
            Recarregar página
          </button>
        </div>
      </div>
    );
  }

  // Se capítulos estão vazios após carregamento
  if (!Array.isArray(chapters) || chapters.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Nenhum capítulo disponível</p>
      </div>
    );
  }

  const isSearchMode = searchResult !== null;

  return (
    <div className="pb-24 px-4 pt-6 max-w-2xl mx-auto">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 min-h-[44px]"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </button>
      )}

      <div className="mb-6">
        <h1 className="text-foreground mb-2">Capítulos</h1>
        <p className="text-muted-foreground">
          Organize as memórias por temas importantes
        </p>
      </div>

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
      <motion.div
        key={isSearchMode ? "search" : "chapters"}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
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
                    onClick={() => onSelectChapter(chapter)}
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
                    }. Continue preenchendo para completar o álbum da Aurora! 💛`
                  : "Comece a registrar os momentos especiais da Aurora! 💛"}
              </p>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}
