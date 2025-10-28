/**
 * Tipos e Interfaces para o Sistema Universal de Formulários
 * Suporta: Momentos, Medidas, Vacinas, Sono/Humor, Mêsversários, Cartas, etc.
 */

export type FormFieldType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "time"
  | "select"
  | "multiselect"
  | "checkbox"
  | "emoji-slider"
  | "media-upload"
  | "tags"
  | "people";

export interface FormFieldConfig {
  id: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  step?: number;
  options?: Array<{ value: string; label: string; emoji?: string }>;
  helperText?: string;
  icon?: string;
  section?: string; // Para agrupar campos em seções colapsáveis
  defaultValue?: any;
  validation?: (value: any) => string | null; // Retorna erro ou null
}

export interface FormLayoutConfig {
  id: string;
  title: string;
  icon: string;
  description?: string;
  contextualColor?: string;
  fields: FormFieldConfig[];
  autosaveInterval?: number; // ms
  allowDrafts?: boolean;
}

export interface FormState {
  values: Record<string, any>;
  errors: Record<string, string | null>;
  touched: Record<string, boolean>;
  isDirty: boolean;
  isSaving: boolean;
  lastSavedAt?: Date;
  draftId?: string;
}

export interface FormSection {
  id: string;
  title: string;
  fields: FormFieldConfig[];
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export interface AutosaveConfig {
  enabled: boolean;
  interval: number; // ms
  onSave?: (data: Record<string, any>) => Promise<void>;
  onError?: (error: Error) => void;
}

export interface FormContextualData {
  templateType?: string; // 'medida' | 'vacina' | 'humor' | 'mesversario' | etc
  chapterId?: string;
  babyId?: string;
  momentId?: string; // Se editando
  age?: string;
  metadata?: Record<string, any>;
}

// Mapeamento de templates para configurações
export interface FormTemplate {
  id: string;
  name: string;
  icon: string;
  category: "saude" | "momento" | "familia" | "carta" | "outro";
  formConfig: FormLayoutConfig;
  successMessage: string;
  returnRoute?: string;
}

// Estados de validação
export type ValidationState = "idle" | "validating" | "valid" | "invalid";

// Privacy/Segurança
export type PrivacyLevel = "private" | "people" | "link" | "public";

export interface PrivacyConfig {
  level: PrivacyLevel;
  allowedPeople?: string[];
  shareLink?: string;
}

// Resposta de submissão
export interface FormSubmitResponse {
  success: boolean;
  data?: any;
  error?: string;
  draftId?: string;
  redirectTo?: string;
}
