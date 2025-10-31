import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronDown, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { FormFieldConfig } from "@/types";

interface FormFieldProps {
  config: FormFieldConfig;
  value: any;
  error?: string | null;
  onChange: (value: any) => void;
  onBlur?: () => void;
  disabled?: boolean;
}

/**
 * Campo Select (dropdown)
 */
export function FormSelectField({
  config,
  value,
  error,
  onChange,
  onBlur,
  disabled,
}: FormFieldProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = config.options?.find((opt) => opt.value === value);

  return (
    <div className="space-y-2">
      <Label className="text-sm text-muted-foreground">
        {config.label}
        {config.required && <span className="text-red-500"> *</span>}
      </Label>

      <div className="relative">
        <motion.button
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 flex items-center justify-between
            ${
              error
                ? "border-red-500 bg-red-50/30"
                : isOpen
                ? "border-primary shadow-md"
                : "border-border bg-muted/30 hover:bg-muted/50"
            }
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          `}
          disabled={disabled}
        >
          <span
            className={
              selectedOption ? "text-foreground" : "text-muted-foreground"
            }
          >
            {selectedOption ? (
              <span className="flex items-center gap-2">
                {selectedOption.emoji && <span>{selectedOption.emoji}</span>}
                {selectedOption.label}
              </span>
            ) : (
              config.placeholder || "Selecione uma opção"
            )}
          </span>
          <ChevronDown
            className={`w-5 h-5 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </motion.button>

        {/* Backdrop blur */}
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 z-40"
              />

              {/* Dropdown menu */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute top-full left-0 right-0 mt-2 bg-background border-2 border-border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
              >
                {config.options?.map((option) => (
                  <motion.button
                    key={option.value}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                      onBlur?.();
                    }}
                    className={`w-full px-4 py-3 text-left transition-colors duration-200 flex items-center gap-2 border-b border-border last:border-b-0
                      ${
                        value === option.value
                          ? "bg-primary/10 text-primary font-semibold"
                          : "hover:bg-muted"
                      }
                    `}
                    whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                  >
                    {option.emoji && (
                      <span className="text-lg">{option.emoji}</span>
                    )}
                    {option.label}
                    {value === option.value && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto w-2 h-2 rounded-full bg-primary"
                      />
                    )}
                  </motion.button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

/**
 * Campo de Tags reutilizável
 */
export function FormTagsField({
  config,
  value = [],
  error,
  onChange,
  onBlur,
  disabled,
}: FormFieldProps) {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const tags = Array.isArray(value) ? value : [];

  const handleAddTag = () => {
    if (inputValue.trim() && !tags.includes(inputValue.trim())) {
      onChange([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm text-muted-foreground">
        {config.label}
        {config.required && <span className="text-red-500"> *</span>}
      </Label>

      <div
        className={`p-3 rounded-lg border-2 transition-all duration-200
          ${
            error
              ? "border-red-500 bg-red-50/30"
              : isFocused
              ? "border-primary shadow-md ring-1 ring-primary/20"
              : "border-border bg-muted/30"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        {/* Tags exibidas */}
        <div className="flex flex-wrap gap-2 mb-2">
          <AnimatePresence>
            {tags.map((tag, index) => (
              <motion.div
                key={`${tag}-${index}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <Badge
                  variant="secondary"
                  className="flex items-center gap-2 cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  onClick={() => !disabled && handleRemoveTag(tag)}
                >
                  {tag}
                  <X className="w-3 h-3" />
                </Badge>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Input para adicionar tags */}
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false);
              onBlur?.();
            }}
            disabled={disabled}
            placeholder={
              config.placeholder || "Adicione uma tag e pressione Enter"
            }
            className="flex-1 bg-transparent outline-none text-sm"
          />
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={handleAddTag}
            disabled={disabled || !inputValue.trim()}
            className="px-2"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

/**
 * Componente EmojiSlider para Humor/Estado
 */
export function FormEmojiSliderField({
  config,
  value,
  error,
  onChange,
  onBlur,
  disabled,
}: FormFieldProps) {
  const emojis = config.options || [
    { value: "very-happy", label: "Muito feliz", emoji: "😄" },
    { value: "happy", label: "Feliz", emoji: "🙂" },
    { value: "neutral", label: "Neutro", emoji: "😐" },
    { value: "tired", label: "Cansado", emoji: "😴" },
    { value: "sad", label: "Triste", emoji: "😢" },
  ];

  const selectedIndex = emojis.findIndex((e) => e.value === value);
  const selectedEmoji = emojis[selectedIndex];

  // Cores de fundo conforme seleção
  const getBackgroundColor = () => {
    const colors = [
      "bg-yellow-100", // muito feliz
      "bg-yellow-50", // feliz
      "bg-gray-50", // neutro
      "bg-blue-50", // cansado
      "bg-purple-50", // triste
    ];
    return selectedIndex >= 0 ? colors[selectedIndex] : "bg-muted/30";
  };

  return (
    <motion.div
      animate={{ backgroundColor: getBackgroundColor() }}
      transition={{ duration: 0.3 }}
      className="p-6 rounded-2xl space-y-4 transition-colors"
    >
      <Label className="text-sm text-muted-foreground">
        {config.label}
        {config.required && <span className="text-red-500"> *</span>}
      </Label>

      {/* Emoji grande e animado */}
      <motion.div
        key={value}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="text-8xl text-center"
      >
        {selectedEmoji?.emoji || "😐"}
      </motion.div>

      {/* Label do emoji selecionado */}
      <p className="text-center font-semibold text-foreground">
        {selectedEmoji?.label || config.placeholder}
      </p>

      {/* Slider */}
      <div className="space-y-4">
        <input
          type="range"
          min="0"
          max={emojis.length - 1}
          value={selectedIndex >= 0 ? selectedIndex : 0}
          onChange={(e) => onChange(emojis[parseInt(e.target.value)].value)}
          onBlur={onBlur}
          disabled={disabled}
          className="w-full h-3 bg-gradient-to-r from-yellow-300 via-gray-300 to-purple-300 rounded-full appearance-none cursor-pointer accent-primary"
          style={{
            accentColor: "hsl(var(--primary))",
          }}
        />

        {/* Rótulos dos emojis */}
        <div className="flex justify-between text-xs text-muted-foreground">
          {emojis.map((emoji) => (
            <span key={emoji.value} className="text-lg">
              {emoji.emoji}
            </span>
          ))}
        </div>
      </div>

      {error && <p className="text-xs text-red-600 text-center">{error}</p>}

      {config.helperText && (
        <p className="text-xs text-muted-foreground text-center italic">
          {config.helperText}
        </p>
      )}
    </motion.div>
  );
}

/**
 * Campo de seleção múltipla (Pessoas, Categorias, etc)
 */
export function FormMultiSelectField({
  config,
  value = [],
  error,
  onChange,
  onBlur,
  disabled,
}: FormFieldProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOptions = config.options?.filter((opt) =>
    (Array.isArray(value) ? value : []).includes(opt.value)
  );

  const handleToggle = (optionValue: string) => {
    const newValue = Array.isArray(value) ? value : [];
    if (newValue.includes(optionValue)) {
      onChange(newValue.filter((v) => v !== optionValue));
    } else {
      onChange([...newValue, optionValue]);
    }
    onBlur?.();
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm text-muted-foreground">
        {config.label}
        {config.required && <span className="text-red-500"> *</span>}
      </Label>

      {/* Tags selecionadas */}
      <div className="flex flex-wrap gap-2 mb-2">
        <AnimatePresence>
          {selectedOptions?.map((option) => (
            <motion.div
              key={option.value}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Badge
                variant="default"
                className="cursor-pointer flex items-center gap-2"
                onClick={() => !disabled && handleToggle(option.value)}
              >
                {option.emoji && <span>{option.emoji}</span>}
                {option.label}
                <X className="w-3 h-3" />
              </Badge>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Dropdown */}
      <div className="relative">
        <motion.button
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 flex items-center justify-between
            ${
              error
                ? "border-red-500 bg-red-50/30"
                : isOpen
                ? "border-primary shadow-md"
                : "border-border bg-muted/30"
            }
          `}
          disabled={disabled}
        >
          <span className="text-sm text-muted-foreground">
            {selectedOptions?.length
              ? `${selectedOptions.length} selecionado(s)`
              : "Selecione..."}
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 z-40"
              />

              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute top-full left-0 right-0 mt-2 bg-background border-2 border-border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
              >
                {config.options?.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleToggle(option.value)}
                    className={`w-full px-4 py-3 text-left flex items-center gap-2 border-b border-border last:border-b-0
                      ${
                        (Array.isArray(value) ? value : []).includes(
                          option.value
                        )
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted"
                      }
                    `}
                  >
                    {option.emoji && <span>{option.emoji}</span>}
                    <span className="flex-1">{option.label}</span>
                    {(Array.isArray(value) ? value : []).includes(
                      option.value
                    ) && <div className="w-2 h-2 rounded-full bg-primary" />}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

