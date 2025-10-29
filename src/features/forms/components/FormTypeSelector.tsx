import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { FormTemplate } from "@/types";

interface TypeSelectorProps {
  templates: FormTemplate[];
  onSelect: (template: FormTemplate) => void;
  onClose: () => void;
  title?: string;
  description?: string;
}

export function FormTypeSelector({
  templates,
  onSelect,
  onClose,
  title = "O que deseja registrar?",
  description = "Escolha o tipo de registro",
}: TypeSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Agrupar templates por categoria
  const grouped = templates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, FormTemplate[]>);

  // Filtrar templates conforme search
  const filteredGrouped = Object.entries(grouped).reduce(
    (acc, [category, items]) => {
      const filtered = items.filter(
        (template) =>
          template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          template.category.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (filtered.length > 0) {
        acc[category] = filtered;
      }

      return acc;
    },
    {} as Record<string, FormTemplate[]>
  );

  const categoryLabels: Record<
    string,
    { label: string; emoji: string; color: string }
  > = {
    saude: {
      label: "Saúde & Crescimento",
      emoji: "🏥",
      color: "from-red-500/20 to-orange-500/20",
    },
    momento: {
      label: "Momentos",
      emoji: "📸",
      color: "from-blue-500/20 to-cyan-500/20",
    },
    familia: {
      label: "Família",
      emoji: "👨‍👩‍👧‍👦",
      color: "from-green-500/20 to-emerald-500/20",
    },
    carta: {
      label: "Cartas & Memórias",
      emoji: "💌",
      color: "from-purple-500/20 to-pink-500/20",
    },
    outro: {
      label: "Outros",
      emoji: "📝",
      color: "from-gray-500/20 to-slate-500/20",
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="fixed inset-0 bg-background z-50 flex flex-col"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border/50 bg-background/80 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-bold text-xl text-foreground">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar tipo de registro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            autoFocus
          />
        </div>
      </div>

      {/* Conteúdo (scrollável) */}
      <div className="flex-1 overflow-y-auto">
        {Object.entries(filteredGrouped).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-muted-foreground mb-2">Nenhum tipo encontrado</p>
            <p className="text-sm text-muted-foreground">
              Tente uma busca diferente
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-6">
            {Object.entries(filteredGrouped).map(([category, items]) => {
              const categoryInfo =
                categoryLabels[category] || categoryLabels.outro;

              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {/* Cabeçalho da categoria */}
                  <div className="mb-3 flex items-center gap-2">
                    <span className="text-lg">{categoryInfo.emoji}</span>
                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide opacity-70">
                      {categoryInfo.label}
                    </h3>
                  </div>

                  {/* Grid de templates */}
                  <div className="grid grid-cols-2 gap-3">
                    {items.map((template, index) => (
                      <motion.button
                        key={template.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => onSelect(template)}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className={`group relative p-4 rounded-xl border-2 border-border transition-all duration-200 
                          hover:border-primary hover:shadow-md
                          bg-gradient-to-br ${categoryInfo.color}
                          overflow-hidden`}
                      >
                        {/* Background animado */}
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                        {/* Conteúdo */}
                        <div className="relative z-10">
                          <div className="text-3xl mb-2">{template.icon}</div>
                          <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors text-left">
                            {template.name}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1 text-left">
                            {template.category}
                          </p>
                        </div>

                        {/* Plus icon ao hover */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          whileHover={{ opacity: 1, scale: 1 }}
                          className="absolute top-2 right-2 bg-primary rounded-full p-1 text-primary-foreground"
                        >
                          <Plus className="w-4 h-4" />
                        </motion.div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}

