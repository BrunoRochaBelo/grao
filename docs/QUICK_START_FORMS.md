# 🚀 QUICK START — Sistema de Formulários Universais

> Comece a usar o novo sistema em 5 minutos!

---

## 1️⃣ Importar o que você precisa

```tsx
import {
  UniversalFormLayout, // Layout base
  FormTypeSelector, // Modal de seleção
  FORM_TEMPLATES, // Templates prontos
  useAutoSave, // Hook de autosave
  useFormValidation, // Hook de validação
  triggerFeedback, // Feedback sensorial
} from "@/features/forms";
```

---

## 2️⃣ Usar um Template Existente

```tsx
import { FORM_GROWTH } from "@/features/forms";

function MyGrowthForm() {
  return (
    <UniversalFormLayout
      config={FORM_GROWTH.formConfig}
      contextIcon={FORM_GROWTH.icon}
      contextColor="#10B981"
      onBack={() => {}}
      onSubmit={async (values) => {
        console.log("Salvar:", values);
        // Aqui você salva os dados
      }}
      showAutosave={true}
    />
  );
}
```

✅ **Pronto!** Você tem um formulário funcional com:

- Autosave a cada 10s
- Validação em tempo real
- Campos animados

---

## 3️⃣ Adicionar Seletor de Tipo

```tsx
import { FormTypeSelector, FORM_TEMPLATES } from "@/features/forms";

function ChooseForm() {
  const [selected, setSelected] = useState(null);

  return (
    <FormTypeSelector
      templates={Object.values(FORM_TEMPLATES)}
      onSelect={(template) => setSelected(template)}
      onClose={() => {}}
      title="O que você quer registrar?"
    />
  );
}
```

---

## 4️⃣ Criar um Template Customizado

```tsx
import { FormTemplate } from "@/lib/forms/formTypes";

const MY_FORM: FormTemplate = {
  id: "meu-form",
  name: "Meu Formulário",
  icon: "📝",
  category: "outro",
  successMessage: "Salvo com sucesso!",
  formConfig: {
    id: "form-meu",
    title: "Meu Formulário",
    icon: "📝",
    autosaveInterval: 10000,
    fields: [
      {
        id: "nome",
        type: "text",
        label: "Seu Nome",
        required: true,
        maxLength: 100,
        section: "Informações Pessoais",
      },
      {
        id: "mensagem",
        type: "textarea",
        label: "Mensagem",
        required: true,
        section: "Conteúdo",
      },
      {
        id: "categoria",
        type: "select",
        label: "Categoria",
        required: false,
        options: [
          { value: "work", label: "Trabalho" },
          { value: "personal", label: "Pessoal" },
          { value: "other", label: "Outro" },
        ],
      },
      {
        id: "tags",
        type: "tags",
        label: "Tags",
        placeholder: "Pressione Enter para adicionar",
      },
    ],
  },
};
```

---

## 5️⃣ Usar Hook de Validação

```tsx
import { useFormValidation } from '@/features/forms';

function MyForm() {
  const fields = [...];
  const { errors, validateAll } = useFormValidation(fields);

  const handleSubmit = (data) => {
    const { isValid, errors } = validateAll(data);
    if (!isValid) {
      console.log('Erros:', errors);
      return;
    }
    // Salvar...
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

---

## 6️⃣ Usar Hook de Autosave

```tsx
import { useAutoSave } from "@/features/forms";

function MyForm() {
  const [values, setValues] = useState({});

  const { isSaving, lastSavedAt, hasUnsavedChanges } = useAutoSave(values, {
    enabled: true,
    interval: 10000, // 10 segundos
    key: "meu-form",
    onSave: async (data) => {
      // Salvar no backend, localStorage, etc
      console.log("Autosave:", data);
    },
  });

  return (
    <div>
      {lastSavedAt && <p>Salvo em {lastSavedAt.toLocaleTimeString()}</p>}
      {isSaving && <p>Salvando...</p>}
    </div>
  );
}
```

---

## 7️⃣ Adicionar Feedback Sensorial

```tsx
import { triggerFeedback } from "@/features/forms";

function MyForm() {
  const handleSuccess = () => {
    triggerFeedback("success"); // Som + vibração
    toast.success("Salvo!");
  };

  const handleError = () => {
    triggerFeedback("error"); // Som + vibração
    toast.error("Erro!");
  };

  return (
    <>
      <button onClick={handleSuccess}>Sucesso</button>
      <button onClick={handleError}>Erro</button>
    </>
  );
}
```

Tipos de feedback disponíveis:

- `'success'` - Confirmação positiva
- `'error'` - Alerta de erro
- `'tap'` - Toque suave
- `'pop'` - Pop leve
- `'validation'` - Validação completa

---

## 📋 Lista de Templates Disponíveis

```tsx
FORM_TEMPLATES = {
  growth: FORM_GROWTH, // 📈 Crescimento
  vaccine: FORM_VACCINE, // 💉 Vacina
  "sleep-humor": FORM_SLEEP_HUMOR, // 😴 Humor
  monthsary: FORM_MONTHSARY, // 🎂 Mêsversário
  letter: FORM_LETTER, // 💌 Carta
  "family-member": FORM_FAMILY_MEMBER, // 🌳 Família
  "free-note": FORM_FREE_NOTE, // 📝 Nota Livre
};
```

---

## 🎯 Exemplo Completo: Integrar no App.tsx

```tsx
import { useState } from "react";
import { UniversalFormLayout, FORM_TEMPLATES } from "@/features/forms";

function App() {
  const [activeForm, setActiveForm] = useState(null);

  const handleFormSubmit = async (values) => {
    // 1. Validar
    // 2. Salvar dados
    // 3. Mostrar feedback
    setActiveForm(null);
  };

  return (
    <>
      {/* Seu app normal */}
      <button onClick={() => setActiveForm("growth")}>Registrar Medição</button>

      {/* Renderizar formulário dinamicamente */}
      {activeForm && (
        <UniversalFormLayout
          config={FORM_TEMPLATES[activeForm].formConfig}
          contextIcon={FORM_TEMPLATES[activeForm].icon}
          onBack={() => setActiveForm(null)}
          onSubmit={handleFormSubmit}
          showAutosave={true}
        />
      )}
    </>
  );
}
```

---

## 🎨 Personalizar Cores (contextColor)

```tsx
// Cores recomendadas por contexto:
const COLORS = {
  health: "#10B981", // Verde
  vaccine: "#EF4444", // Vermelho
  moment: "#6366F1", // Azul
  family: "#10B981", // Verde
  letter: "#8B5CF6", // Roxo
  happy: "#F59E0B", // Amarelo
};

<UniversalFormLayout
  config={template.formConfig}
  contextColor={COLORS.health}
  {...props}
/>;
```

---

## ⚡ Dicas & Truques

### 1. Recuperar rascunho

```tsx
import { useAutoSave } from '@/features/forms';

const { recoverDraft } = useAutoSave(values, {
  key: 'meu-form',
  ...
});

const draft = recoverDraft(); // null se não existir
```

### 2. Forçar salvamento

```tsx
const { save } = useAutoSave(values, {...});
save(); // Salva imediatamente
```

### 3. Limpar rascunho após submissão

```tsx
const { clearDraft } = useAutoSave(values, {...});
await handleSubmit();
clearDraft();
```

### 4. Validação customizada

```tsx
const field = {
  id: "email",
  type: "text",
  label: "Email",
  validation: (value) => {
    if (!value.includes("@")) return "Email inválido";
    return null; // OK
  },
};
```

### 5. Seções colapsáveis

```tsx
const fields = [
  {
    id: 'nome',
    section: 'Informações Básicas', // Agrupa campos
    ...
  },
  {
    id: 'extras',
    section: 'Configurações Avançadas',
    ...
  },
];
```

---

## 🐛 Troubleshooting

### "Campo não está validando"

→ Certifique-se de que `touched[fieldId]` é `true` antes de mostrar erro.

### "Autosave não está funcionando"

→ Verifique localStorage: `localStorage.getItem('form:growth:draft')`

### "Animações lentas"

→ Reduza `autosaveInterval` ou desative com `enabled: false`

### "Som não funciona no iOS"

→ iOS requer interação do usuário. Som toca na primeira interação.

---

## 📚 Arquivos Importantes

```
src/
├── features/forms/
│   ├── components/
│   │   ├── UniversalFormLayout.tsx    ← Layout base
│   │   ├── FormFields.tsx             ← Campos básicos
│   │   ├── FormSpecializedFields.tsx  ← Campos complexos
│   │   └── FormTypeSelector.tsx       ← Seletor
│   ├── hooks/
│   │   ├── useAutoSave.ts             ← Autosave
│   │   └── useFormValidation.ts       ← Validação
│   ├── templates/
│   │   └── formTemplates.ts           ← 7 templates prontos
│   ├── utils/
│   │   └── feedbackUtils.ts           ← Sons e vibrações
│   └── index.ts                       ← Exportações
│
└── lib/forms/
    └── formTypes.ts                   ← Tipos TypeScript
```

---

## ✨ Você está pronto!

Agora basta escolher qual template usar ou criar um novo. O sistema cuida do resto! 🚀
