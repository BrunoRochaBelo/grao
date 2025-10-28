import { useEffect, useRef, useCallback, useState } from "react";
import { toast } from "sonner";

interface UseAutoSaveOptions {
  enabled?: boolean;
  interval?: number; // milliseconds
  key: string; // chave localStorage
  onError?: (error: Error) => void;
  debounceDelay?: number;
}

export function useAutoSave(
  data: Record<string, any>,
  options: UseAutoSaveOptions
) {
  const {
    enabled = true,
    interval = 10000, // 10 segundos
    key,
    onError,
    debounceDelay = 500,
  } = options;

  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastDataRef = useRef<Record<string, any>>(data);

  // Salvar dados
  const save = useCallback(async () => {
    if (!enabled || isSaving) return;

    setIsSaving(true);
    try {
      // Salvar no localStorage
      localStorage.setItem(`${key}:draft`, JSON.stringify(data));
      localStorage.setItem(`${key}:timestamp`, new Date().toISOString());

      setLastSavedAt(new Date());
      setHasUnsavedChanges(false);

      // Toast silencioso (apenas ícone pisca no header)
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      console.error("Autosave error:", err);
      onError?.(err);
    } finally {
      setIsSaving(false);
    }
  }, [enabled, data, key, isSaving, onError]);

  // Detectar mudanças
  useEffect(() => {
    const hasChanged =
      JSON.stringify(lastDataRef.current) !== JSON.stringify(data);
    if (hasChanged) {
      setHasUnsavedChanges(true);
      lastDataRef.current = data;

      // Debounce antes de salvar
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(() => {
        save();
      }, debounceDelay);
    }

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [data, save, debounceDelay]);

  // Auto-save cíclico
  useEffect(() => {
    if (!enabled) return;

    autoSaveIntervalRef.current = setInterval(() => {
      if (hasUnsavedChanges) {
        save();
      }
    }, interval);

    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [enabled, interval, hasUnsavedChanges, save]);

  // Limpar rascunho
  const clearDraft = useCallback(() => {
    localStorage.removeItem(`${key}:draft`);
    localStorage.removeItem(`${key}:timestamp`);
    setHasUnsavedChanges(false);
    setLastSavedAt(null);
  }, [key]);

  // Recuperar rascunho
  const recoverDraft = useCallback(() => {
    try {
      const draft = localStorage.getItem(`${key}:draft`);
      return draft ? JSON.parse(draft) : null;
    } catch {
      return null;
    }
  }, [key]);

  // Forçar salvamento
  const forceSave = useCallback(async () => {
    await save();
  }, [save]);

  return {
    isSaving,
    lastSavedAt,
    hasUnsavedChanges,
    save: forceSave,
    clearDraft,
    recoverDraft,
  };
}
