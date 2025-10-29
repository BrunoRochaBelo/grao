/**
 * EXEMPLO DE INTEGRAÇÃO: Como usar o novo sistema de formulários universal
 *
 * Este arquivo demonstra como refatorar um formulário existente
 * para usar o novo UniversalFormLayout
 */

import { useState } from "react";
import { UniversalFormLayout, FORM_TEMPLATES } from "@/features/forms";
import { toast } from "sonner";
import { triggerFeedback } from "@/features/forms/utils/feedbackUtils";

/**
 * ✅ EXEMPLO 1: GrowthForm refatorado com o novo sistema
 */
export function GrowthFormNew({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  const template = FORM_TEMPLATES["growth"];

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      // Simular salvamento
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Feedback sensorial
      triggerFeedback("success");

      // Salvar dados (integrar com mockData)
      console.log("Medição salva:", values);

      // Fechar formulário
      setTimeout(() => {
        toast.success("Medição registrada com sucesso! 📈");
        onClose();
      }, 600);
    } catch (error) {
      triggerFeedback("error");
      toast.error("Erro ao salvar medição");
    }
  };

  return (
    <UniversalFormLayout
      config={template.formConfig}
      contextIcon={template.icon}
      contextColor="#10B981" // Verde para saúde
      onBack={onClose}
      onSubmit={handleSubmit}
      showAutosave={true}
    />
  );
}

/**
 * ✅ EXEMPLO 2: VaccineForm refatorado
 */
export function VaccineFormNew({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  const template = FORM_TEMPLATES["vaccine"];

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      triggerFeedback("success");
      console.log("Vacina registrada:", values);

      setTimeout(() => {
        toast.success("Vacina registrada com sucesso! 💉");
        onClose();
      }, 600);
    } catch (error) {
      triggerFeedback("error");
      toast.error("Erro ao registrar vacina");
    }
  };

  return (
    <UniversalFormLayout
      config={template.formConfig}
      contextIcon={template.icon}
      contextColor="#EF4444" // Vermelho para urgência
      onBack={onClose}
      onSubmit={handleSubmit}
      showAutosave={true}
    />
  );
}

/**
 * ✅ EXEMPLO 3: SleepHumorForm refatorado com slider colorido
 */
export function SleepHumorFormNew({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  const template = FORM_TEMPLATES["sleep-humor"];

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      triggerFeedback("success");
      console.log("Humor registrado:", values);

      // Fundo muda conforme emoji (já implementado no FormEmojiSliderField)
      setTimeout(() => {
        toast.success("Registrado com bom humor! ☀️");
        onClose();
      }, 600);
    } catch (error) {
      triggerFeedback("error");
      toast.error("Erro ao registrar humor");
    }
  };

  return (
    <UniversalFormLayout
      config={template.formConfig}
      contextIcon={template.icon}
      contextColor="#6366F1" // Azul para emocional
      onBack={onClose}
      onSubmit={handleSubmit}
      showAutosave={true}
    />
  );
}

/**
 * ✅ EXEMPLO 4: Seletor de tipo de registro (primeiro passo)
 */
import { FormTypeSelector } from "@/features/forms";
import type { FormTemplate } from "@/types";

export function RecordTypeSelectorExample() {
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(
    null
  );

  const availableTemplates = Object.values(FORM_TEMPLATES);

  if (selectedTemplate) {
    // Aqui você renderizaria o formulário específico
    return (
      <div>
        {/* Renderizar formulário baseado em selectedTemplate */}
        <p>Formulário: {selectedTemplate.name}</p>
      </div>
    );
  }

  return (
    <FormTypeSelector
      templates={availableTemplates}
      onSelect={(template: FormTemplate) => setSelectedTemplate(template)}
      onClose={() => {}}
      title="O que deseja registrar hoje?"
      description="Escolha o tipo de registro para começar"
    />
  );
}

/**
 * ✅ EXEMPLO 5: Fluxo completo no App.tsx
 */
export function AppFormExample() {
  const [currentForm, setCurrentForm] = useState<string | null>(null);

  // Mapear tipo de formulário para componente
  const renderForm = () => {
    switch (currentForm) {
      case "growth":
        return <GrowthFormNew isOpen onClose={() => setCurrentForm(null)} />;
      case "vaccine":
        return <VaccineFormNew isOpen onClose={() => setCurrentForm(null)} />;
      case "sleep-humor":
        return (
          <SleepHumorFormNew isOpen onClose={() => setCurrentForm(null)} />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Sua interface normal */}
      <button onClick={() => setCurrentForm("growth")}>
        Registrar Medição
      </button>
      <button onClick={() => setCurrentForm("vaccine")}>
        Registrar Vacina
      </button>
      <button onClick={() => setCurrentForm("sleep-humor")}>
        Registrar Humor
      </button>

      {/* Formulário dinâmico */}
      {renderForm()}
    </div>
  );
}

/**
 * ✅ EXEMPLO 6: Hook customizado para integração fácil
 */
export function useFormHandler(templateId: string) {
  const [isOpen, setIsOpen] = useState(false);
  const template = FORM_TEMPLATES[templateId];

  const handleSubmit = async (values: Record<string, any>) => {
    // Implementar lógica de salvamento específica
    console.log(`Salvando ${templateId}:`, values);
    triggerFeedback("success");
    setIsOpen(false);
  };

  return {
    template,
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    handleSubmit,
  };
}

// Uso simplificado:
// const growth = useFormHandler('growth');
// <button onClick={growth.open}>Novo</button>
// {growth.isOpen && <UniversalFormLayout config={growth.template.formConfig} ... />}

