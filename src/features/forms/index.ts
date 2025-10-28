// Componentes de Layout
export { UniversalFormLayout } from "./components/UniversalFormLayout";
export { FormTypeSelector } from "./components/FormTypeSelector";

// Componentes de Campos Básicos
export {
  FormTextField,
  FormTextAreaField,
  FormNumberField,
  FormDateField,
  FormTimeField,
} from "./components/FormFields";

// Componentes de Campos Especializados
export {
  FormSelectField,
  FormTagsField,
  FormEmojiSliderField,
  FormMultiSelectField,
} from "./components/FormSpecializedFields";

// Hooks
export { useAutoSave } from "./hooks/useAutoSave";
export { useFormValidation } from "./hooks/useFormValidation";

// Tipos
export type {
  FormFieldType,
  FormFieldConfig,
  FormLayoutConfig,
  FormState,
  FormSection,
  AutosaveConfig,
  FormContextualData,
  FormTemplate,
  ValidationState,
  PrivacyLevel,
  PrivacyConfig,
  FormSubmitResponse,
} from "@/lib/forms/formTypes";

// Templates de formulários
export {
  FORM_GROWTH,
  FORM_VACCINE,
  FORM_SLEEP_HUMOR,
  FORM_MONTHSARY,
  FORM_LETTER,
  FORM_FAMILY_MEMBER,
  FORM_FREE_NOTE,
  FORM_TEMPLATES,
} from "./templates/formTemplates";
