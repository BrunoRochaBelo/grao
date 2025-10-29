import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { AlertCircle, Check } from "lucide-react";
import { Label } from "@/components/ui/label";
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
 * Campo de texto simples com animações e validação
 */
export function FormTextField({
  config,
  value,
  error,
  onChange,
  onBlur,
  disabled,
}: FormFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="space-y-2">
      <motion.div
        animate={{
          y: isFocused || value ? -24 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        <Label className="text-sm text-muted-foreground" htmlFor={config.id}>
          {config.label}
          {config.required && <span className="text-red-500"> *</span>}
        </Label>
      </motion.div>

      <div className="relative">
        <motion.input
          id={config.id}
          type="text"
          placeholder={config.placeholder}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          disabled={disabled}
          maxLength={config.maxLength}
          className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200
            ${
              error
                ? "border-red-500 bg-red-50/30"
                : isFocused
                ? "border-primary shadow-md ring-1 ring-primary/20"
                : "border-border bg-muted/30"
            }
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-text"}
            ${value ? "border-success" : ""}
          `}
          animate={{
            boxShadow:
              error && isFocused
                ? "0 0 0 3px rgba(239, 68, 68, 0.1)"
                : isFocused
                ? "0 0 0 3px rgba(165, 148, 249, 0.1)"
                : "none",
          }}
          whileHover={{
            boxShadow:
              !disabled && !error ? "0 2px 8px rgba(0,0,0,0.04)" : "none",
          }}
        />

        {/* Ícone de validação */}
        {value && !error && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <Check className="w-5 h-5 text-success" />
          </motion.div>
        )}

        {/* Ícone de erro */}
        {error && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <AlertCircle className="w-5 h-5 text-red-500 animate-pulse" />
          </motion.div>
        )}
      </div>

      {/* Mensagem de ajuda ou erro */}
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: error ? 1 : 0, y: error ? 0 : -4 }}
        className="text-xs text-red-600"
      >
        {error}
      </motion.div>

      {config.helperText && !error && (
        <p className="text-xs text-muted-foreground">{config.helperText}</p>
      )}

      {/* Contador de caracteres */}
      {config.maxLength && (
        <p className="text-xs text-muted-foreground text-right">
          {(value || "").length} / {config.maxLength}
        </p>
      )}
    </div>
  );
}

/**
 * Campo de textarea expansível
 */
export function FormTextAreaField({
  config,
  value,
  error,
  onChange,
  onBlur,
  disabled,
}: FormFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [rows, setRows] = useState(3);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);

    // Auto-expand
    const element = e.target;
    element.style.height = "auto";
    const newHeight = Math.min(element.scrollHeight, 300);
    element.style.height = `${newHeight}px`;
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm text-muted-foreground">
        {config.label}
        {config.required && <span className="text-red-500"> *</span>}
      </Label>

      <div className="relative">
        <motion.textarea
          placeholder={config.placeholder}
          value={value || ""}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          disabled={disabled}
          rows={rows}
          className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 resize-none
            ${
              error
                ? "border-red-500 bg-red-50/30"
                : isFocused
                ? "border-primary shadow-md ring-1 ring-primary/20"
                : "border-border bg-muted/30"
            }
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-text"}
          `}
        />
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-red-600"
        >
          {error}
        </motion.p>
      )}

      {config.maxLength && (
        <p className="text-xs text-muted-foreground text-right">
          {(value || "").length} / {config.maxLength}
        </p>
      )}
    </div>
  );
}

/**
 * Campo numérico
 */
export function FormNumberField({
  config,
  value,
  error,
  onChange,
  onBlur,
  disabled,
}: FormFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="space-y-2">
      <Label className="text-sm text-muted-foreground">
        {config.label}
        {config.required && <span className="text-red-500"> *</span>}
      </Label>

      <div className="relative">
        <input
          type="number"
          id={config.id}
          placeholder={config.placeholder}
          value={value ?? ""}
          onChange={(e) =>
            onChange(e.target.value ? parseFloat(e.target.value) : "")
          }
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          disabled={disabled}
          min={config.minValue}
          max={config.maxValue}
          step={config.step || 0.1}
          className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200
            ${
              error
                ? "border-red-500 bg-red-50/30"
                : isFocused
                ? "border-primary shadow-md ring-1 ring-primary/20"
                : "border-border bg-muted/30"
            }
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        />

        {value && !error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Check className="w-5 h-5 text-success" />
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

/**
 * Campo de data
 */
export function FormDateField({
  config,
  value,
  error,
  onChange,
  onBlur,
  disabled,
}: FormFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="space-y-2">
      <Label className="text-sm text-muted-foreground">
        {config.label}
        {config.required && <span className="text-red-500"> *</span>}
      </Label>

      <input
        type="date"
        id={config.id}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          onBlur?.();
        }}
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200
          ${
            error
              ? "border-red-500 bg-red-50/30"
              : isFocused
              ? "border-primary shadow-md"
              : "border-border bg-muted/30"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
      />

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

/**
 * Campo de hora
 */
export function FormTimeField({
  config,
  value,
  error,
  onChange,
  onBlur,
  disabled,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm text-muted-foreground">
        {config.label}
        {config.required && <span className="text-red-500"> *</span>}
      </Label>

      <input
        type="time"
        id={config.id}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200
          ${
            error
              ? "border-red-500 bg-red-50/30"
              : "border-border bg-muted/30 focus:border-primary"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
      />

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

