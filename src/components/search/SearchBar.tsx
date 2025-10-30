import { useState, useEffect, useCallback } from "react";
import { Search, X, Clock, Layers, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { SearchFilters } from "@/types";

interface SearchBarProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  placeholder?: string;
  initialQuery?: string;
  initialFilters?: SearchFilters;
}

export function SearchBar({
  onSearch,
  placeholder = "Encontre capítulos ou momentos",
  initialQuery = "",
  initialFilters = {},
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  // Debounced search
  const debouncedSearch = useCallback(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    const timer = setTimeout(() => {
      onSearch(query, filters);
    }, 250); // 250ms debounce

    setDebounceTimer(timer);
  }, [query, filters, onSearch, debounceTimer]);

  // Trigger search when query or filters change
  useEffect(() => {
    // Call immediately if query is empty (to reset to normal view)
    if (!query.trim()) {
      onSearch(query, filters);
      return;
    }

    // Otherwise, use debounce for search queries
    debouncedSearch();
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debouncedSearch, query, filters, onSearch]);

  const toggleFilter = (filterKey: keyof SearchFilters) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: !prev[filterKey],
    }));
  };

  const clearSearch = () => {
    setQuery("");
    setFilters({});
  };

  const hasActiveFilters = Object.values(filters).some(Boolean);
  const hasSearchContent = query.trim() || hasActiveFilters;

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10 h-12 text-base"
        />
        {hasSearchContent && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filters.pending ? "default" : "outline"}
          size="sm"
          onClick={() => toggleFilter("pending")}
          className="h-8 px-3 text-xs"
        >
          <AlertCircle className="w-3 h-3 mr-1" />
          Com pendências
        </Button>

        <Button
          variant={filters.series ? "default" : "outline"}
          size="sm"
          onClick={() => toggleFilter("series")}
          className="h-8 px-3 text-xs"
        >
          <Layers className="w-3 h-3 mr-1" />
          Séries
        </Button>

        <Button
          variant={filters.recent ? "default" : "outline"}
          size="sm"
          onClick={() => toggleFilter("recent")}
          className="h-8 px-3 text-xs"
        >
          <Clock className="w-3 h-3 mr-1" />
          Recentes
        </Button>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Filtros ativos:</span>
          {filters.pending && (
            <Badge variant="secondary" className="text-xs">
              Pendências
            </Badge>
          )}
          {filters.series && (
            <Badge variant="secondary" className="text-xs">
              Séries
            </Badge>
          )}
          {filters.recent && (
            <Badge variant="secondary" className="text-xs">
              Recentes
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
