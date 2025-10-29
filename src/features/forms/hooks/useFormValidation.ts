import { useCallback, useState } from "react";
import type { FormFieldConfig, ValidationState } from "@/types";

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string | null>;
}

export function useFormValidation(fields: FormFieldConfig[]) {
  const [validationState, setValidationState] =
    useState<ValidationState>("idle");
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  // Validação de um campo individual
  const validateField = useCallback(
    (fieldId: string, value: any): string | null => {
      const field = fields.find((f) => f.id === fieldId);
      if (!field) return null;

      // Campo obrigatório vazio
      if (
        field.required &&
        (!value || (typeof value === "string" && !value.trim()))
      ) {
        return `${field.label} é obrigatório`;
      }

      // Validação customizada
      if (field.validation) {
        const error = field.validation(value);
        if (error) return error;
      }

      // Validações específicas por tipo
      switch (field.type) {
        case "text":
        case "textarea":
          if (field.maxLength && value.length > field.maxLength) {
            return `Máximo ${field.maxLength} caracteres`;
          }
          break;

        case "number":
          const num = parseFloat(value);
          if (isNaN(num)) {
            return "Deve ser um número";
          }
          if (field.minValue !== undefined && num < field.minValue) {
            return `Mínimo: ${field.minValue}`;
          }
          if (field.maxValue !== undefined && num > field.maxValue) {
            return `Máximo: ${field.maxValue}`;
          }
          break;

        case "date":
          if (value) {
            const date = new Date(value);
            if (isNaN(date.getTime())) {
              return "Data inválida";
            }
            // Não permite datas futuras por padrão
            if (date > new Date()) {
              return "Data não pode ser no futuro";
            }
          }
          break;

        case "time":
          if (value && !/^\d{2}:\d{2}$/.test(value)) {
            return "Formato inválido (HH:MM)";
          }
          break;
      }

      return null;
    },
    [fields]
  );

  // Validação de todos os campos
  const validateAll = useCallback(
    (values: Record<string, any>): ValidationResult => {
      setValidationState("validating");
      const newErrors: Record<string, string | null> = {};

      fields.forEach((field) => {
        const error = validateField(field.id, values[field.id]);
        newErrors[field.id] = error;
      });

      setErrors(newErrors);

      const isValid = Object.values(newErrors).every((e) => e === null);
      setValidationState(isValid ? "valid" : "invalid");

      return {
        isValid,
        errors: newErrors,
      };
    },
    [fields, validateField]
  );

  // Marcar campo como tocado
  const updateFieldError = useCallback(
    (fieldId: string, error: string | null) => {
      setErrors((prev) => ({
        ...prev,
        [fieldId]: error,
      }));
    },
    []
  );

  // Limpar erros
  const clearErrors = useCallback(() => {
    setErrors({});
    setValidationState("idle");
  }, []);

  return {
    errors,
    validationState,
    validateField,
    validateAll,
    updateFieldError,
    clearErrors,
  };
}

