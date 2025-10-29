import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { FormFieldConfig, FormLayoutConfig } from "@/types";
import { useAutoSave } from "../hooks/useAutoSave";
import { useFormValidation } from "../hooks/useFormValidation";
import {
  FormTextField,
  FormTextAreaField,
  FormNumberField,
  FormDateField,
  FormTimeField,
} from "./FormFields";
import {
  FormSelectField,
  FormTagsField,
  FormEmojiSliderField,
  FormMultiSelectField,
} from "./FormSpecializedFields";

interface UniversalFormLayoutProps {
  config: FormLayoutConfig;
  initialValues?: Record<string, any>;
  onBack: () => void;
  onSubmit: (values: Record<string, any>) => Promise<void>;
  showAutosave?: boolean;
  contextIcon?: string;
  contextColor?: string;
}

export function UniversalFormLayout({
  config,
  initialValues = {},
  onBack,
  onSubmit,
  showAutosave = true,
  contextIcon,
  contextColor = "#A594F9",
}: UniversalFormLayoutProps) {
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);

  const { errors, validateAll, updateFieldError, validateField } =
    useFormValidation(config.fields);

  const { isSaving, lastSavedAt, hasUnsavedChanges } = useAutoSave(values, {
    enabled: showAutosave,
    interval: config.autosaveInterval || 10000,
    key: `form:${config.id}`,
  });

  // Atualizar valor do campo
  const handleFieldChange = (fieldId: string, value: any) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }));

    // Validar em tempo real se já foi tocado
    if (touched[fieldId]) {
      const error = validateField(fieldId, value);
      updateFieldError(fieldId, error);
    }
  };

  // Marcar campo como tocado
  const handleFieldBlur = (fieldId: string) => {
    setTouched((prev) => ({ ...prev, [fieldId]: true }));

    const error = validateField(fieldId, values[fieldId]);
    updateFieldError(fieldId, error);
  };

  // Submissão do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateAll(values);
    if (!validation.isValid) {
      toast.error("Por favor, corrija os erros antes de salvar");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values);
      toast.success(
        config.title
          ? `${config.title} registrado com sucesso!`
          : "Registrado com sucesso!"
      );
    } catch (error) {
      toast.error(`Erro ao salvar: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Renderizar campo baseado no tipo
  const renderField = (field: FormFieldConfig) => {
    const commonProps = {
      config: field,
      value: values[field.id],
      error: touched[field.id] ? errors[field.id] : null,
      onChange: (value: any) => handleFieldChange(field.id, value),
      onBlur: () => handleFieldBlur(field.id),
      disabled: isSubmitting || isSaving,
    };

    switch (field.type) {
      case "text":
        return <FormTextField key={field.id} {...commonProps} />;
      case "textarea":
        return <FormTextAreaField key={field.id} {...commonProps} />;
      case "number":
        return <FormNumberField key={field.id} {...commonProps} />;
      case "date":
        return <FormDateField key={field.id} {...commonProps} />;
      case "time":
        return <FormTimeField key={field.id} {...commonProps} />;
      case "select":
        return <FormSelectField key={field.id} {...commonProps} />;
      case "multiselect":
        return <FormMultiSelectField key={field.id} {...commonProps} />;
      case "tags":
        return <FormTagsField key={field.id} {...commonProps} />;
      case "emoji-slider":
        return <FormEmojiSliderField key={field.id} {...commonProps} />;
      default:
        return <div key={field.id}>Campo não reconhecido: {field.type}</div>;
    }
  };

  // Agrupar campos por seção
  const sections = config.fields.reduce((acc, field) => {
    const sectionId = field.section || "default";
    if (!acc[sectionId]) {
      acc[sectionId] = [];
    }
    acc[sectionId].push(field);
    return acc;
  }, {} as Record<string, FormFieldConfig[]>);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 bg-background z-50 flex flex-col"
    >
      {/* Header Fixo */}
      <div
        className="sticky top-0 z-10 border-b border-border/50 bg-background/80 backdrop-blur-sm"
        style={{ boxShadow: `0 2px 8px ${contextColor}15` }}
      >
        <div className="flex items-center justify-between p-4">
          {/* Botão voltar */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            disabled={isSubmitting}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          {/* Título com ícone contextual */}
          <div className="flex-1 flex items-center justify-center gap-3">
            {contextIcon && <span className="text-2xl">{contextIcon}</span>}
            <div className="text-center">
              <h1 className="font-bold text-lg text-foreground">
                {config.title}
              </h1>
              {config.description && (
                <p className="text-xs text-muted-foreground">
                  {config.description}
                </p>
              )}
            </div>
          </div>

          {/* Ícone de autosave */}
          {showAutosave && (
            <motion.div
              animate={{ opacity: isSaving ? 1 : 0.6 }}
              transition={{
                repeat: isSaving ? Infinity : 0,
                repeatType: "reverse",
                duration: 1,
              }}
              title={
                lastSavedAt
                  ? `Salvo em ${lastSavedAt.toLocaleTimeString()}`
                  : "Salvando..."
              }
            >
              <Save className="w-5 h-5 text-success" />
            </motion.div>
          )}
        </div>

        {/* Mensagem de autosave */}
        {lastSavedAt && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs text-muted-foreground text-center pb-2"
          >
            Salvo em {lastSavedAt.toLocaleTimeString()}
          </motion.p>
        )}
      </div>

      {/* Corpo com campos (scrollável) */}
      <div className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6 space-y-8 pb-32">
          {Object.entries(sections).map(([sectionId, fields]) => (
            <motion.div
              key={sectionId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {sectionId !== "default" && (
                <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide opacity-70">
                  {sectionId}
                </h3>
              )}
              <div className="space-y-6">
                {fields.map((field) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 }}
                  >
                    {renderField(field)}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </form>
      </div>

      {/* Footer Fixo com Botões */}
      <div className="sticky bottom-0 border-t border-border/50 bg-background/95 backdrop-blur-sm p-4 space-y-3">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !hasUnsavedChanges}
          className="w-full"
          size="lg"
        >
          {isSubmitting ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Save className="w-5 h-5 mr-2" />
              </motion.div>
              Registrando...
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              Salvar
            </>
          )}
        </Button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowDiscard(true)}
          disabled={isSubmitting}
          className="px-4 py-2 text-sm text-muted-foreground hover:text-destructive transition-colors"
        >
          Descartar
        </motion.button>
      </div>

      {/* Modal de confirmação ao descartar */}
      <AnimatePresence>
        {showDiscard && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDiscard(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center z-50"
            >
              <div className="bg-background rounded-2xl p-6 max-w-sm mx-4 shadow-xl">
                <h2 className="font-bold text-lg mb-2">
                  Descartar formulário?
                </h2>
                <p className="text-muted-foreground text-sm mb-6">
                  Esta ação não pode ser desfeita. Os dados não salvos serão
                  perdidos.
                </p>

                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => setShowDiscard(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      setShowDiscard(false);
                      onBack();
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Descartar
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

