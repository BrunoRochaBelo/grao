# 🧩 Sistema Universal de Formulários

> Arquitetura reutilizável, escalável e acessível para todos os formulários do app

**Status:** ✅ Fase 1 Completa (Core)  
**Versão:** 1.0  
**Última atualização:** 27 de outubro de 2025

---

## 📖 Documentação

### Para Começar

- 🚀 **[QUICK START](../QUICK_START_FORMS.md)** - 5 minutos para funcionar
- 📊 **[SUMÁRIO EXECUTIVO](../SUMARIO_EXECUTIVO_FORMS.md)** - Visão geral

### Referência Técnica

- 🎯 **[WIRELFLOW TÉCNICO](../WIRELFLOW_FORMULARIOS_UNIVERSAIS.md)** - Documentação completa
- 🎨 **[VISUAL & WIREFLOW](../VISUAL_WIREFLOW_FORMULARIOS.md)** - Especificação visual

### Planejamento

- ✅ **[CHECKLIST](../CHECKLIST_IMPLEMENTACAO.md)** - Roadmap de 6 fases
- 💡 **[EXEMPLOS](./examples/FormIntegrationExamples.tsx)** - Código prático

---

## 🏗️ Estrutura

```
forms/
├── components/
│   ├── UniversalFormLayout.tsx        Layout base (header+body+footer)
│   ├── FormFields.tsx                 5 campos básicos
│   ├── FormSpecializedFields.tsx      4 campos especiais (slider, tags, etc)
│   ├── FormTypeSelector.tsx           Modal de seleção de tipo
│   └── examples/
│       └── FormIntegrationExamples.tsx Exemplos de integração
├── hooks/
│   ├── useAutoSave.ts                 Autosave + localStorage
│   └── useFormValidation.ts           Validação real-time
├── templates/
│   └── formTemplates.ts               7 templates prontos
├── utils/
│   └── feedbackUtils.ts               Sons, vibrações, animações
└── index.ts                           Exportações centralizadas
```

---

## ✨ Componentes & Funcionalidades

### 🎯 UniversalFormLayout

Layout base que qualquer formulário pode usar. Fornece:

- Header fixo (voltar, título, ícone, autosave)
- Body scrollável com campos organizados em seções
- Footer fixo (Salvar, Rascunho, Descartar)
- Modal de confirmação ao descartar

```tsx
<UniversalFormLayout
  config={formConfig}
  onBack={() => {}}
  onSubmit={handleSubmit}
/>
```

### 📝 Campos Básicos

| Campo         | Tipo         | Features                             |
| ------------- | ------------ | ------------------------------------ |
| TextField     | `'text'`     | Label flutuante, contador, validação |
| TextAreaField | `'textarea'` | Auto-expansível, validação           |
| NumberField   | `'number'`   | Min/Max, step, formatação            |
| DateField     | `'date'`     | Nativo, validação de futuro          |
| TimeField     | `'time'`     | Nativo, formatação HH:MM             |

### 🎨 Campos Especializados

| Campo            | Tipo             | Features                         |
| ---------------- | ---------------- | -------------------------------- |
| SelectField      | `'select'`       | Dropdown, suporta emojis         |
| MultiSelectField | `'multiselect'`  | Múltipla seleção com badges      |
| TagsField        | `'tags'`         | Adicionar/remover dinamicamente  |
| EmojiSliderField | `'emoji-slider'` | Slider com emojis, fundo animado |

### 🪝 Hooks

#### `useAutoSave(values, options)`

Salva automaticamente no localStorage a cada 10s.

```tsx
const {
  isSaving,
  lastSavedAt,
  hasUnsavedChanges,
  save,
  clearDraft,
  recoverDraft,
} = useAutoSave(values, {
  enabled: true,
  interval: 10000,
  key: "meu-form",
  onSave: async (data) => {
    /* backend */
  },
});
```

#### `useFormValidation(fields)`

Valida campos em tempo real com mensagens inline.

```tsx
const {
  errors,
  validationState,
  validateField,
  validateAll,
  updateFieldError,
} = useFormValidation(fields);

// Validar tudo
const { isValid, errors } = validateAll(values);

// Validar campo individual
const error = validateField("email", "invalid@");
```

### 📋 7 Templates Prontos

1. **FORM_GROWTH** (📈)
   - Campos: Data, Peso, Altura, Perímetro Cefálico
   - Use em: Registrar medições
2. **FORM_VACCINE** (💉)

   - Campos: Nome, Data, Dose, Lote, Local, Reação
   - Use em: Registrar vacinação

3. **FORM_SLEEP_HUMOR** (😴)

   - Campos: Data, EmojiSlider (humor), Notas
   - Use em: Registrar humor do dia

4. **FORM_MONTHSARY** (🎂)

   - Campos: Mês, Data, Peso/Altura, Fato Marcante
   - Use em: Celebrar mêsversário

5. **FORM_LETTER** (💌)

   - Campos: Título, Conteúdo, Abrir aos XX anos
   - Use em: Escrever cartas para o futuro

6. **FORM_FAMILY_MEMBER** (🌳)

   - Campos: Nome, Relação, Data Nascimento
   - Use em: Expandir árvore da família

7. **FORM_FREE_NOTE** (📝)
   - Campos: Título, Conteúdo, Tags
   - Use em: Notas livres

### 🎙️ Feedback Sensorial

- **Sons**: Sucesso (440+554Hz), Erro (220Hz), Validação (3 tons)
- **Vibrações**: iOS/Android suportados
- **Animações**: 200-600ms transitions suaves

---

## 🚀 Como Usar

### 1. Usar um Template Pronto

```tsx
import { UniversalFormLayout, FORM_GROWTH } from "@/features/forms";

export function GrowthForm() {
  return (
    <UniversalFormLayout
      config={FORM_GROWTH.formConfig}
      contextIcon="📈"
      contextColor="#10B981"
      onBack={() => {}}
      onSubmit={async (values) => {
        console.log("Salvar:", values);
      }}
      showAutosave={true}
    />
  );
}
```

### 2. Criar um Template Customizado

```tsx
import { FormTemplate } from "@/lib/forms/formTypes";

const MINHA_FORMA: FormTemplate = {
  id: "minha",
  name: "Meu Formulário",
  icon: "📋",
  category: "outro",
  successMessage: "Salvo!",
  formConfig: {
    id: "form-minha",
    title: "Novo Registro",
    fields: [
      { id: "nome", type: "text", label: "Nome", required: true },
      { id: "mensagem", type: "textarea", label: "Mensagem" },
    ],
  },
};
```

### 3. Validação Customizada

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

### 4. Recuperar Rascunho

```tsx
import { useAutoSave } from "@/features/forms";

const { recoverDraft, clearDraft } = useAutoSave(values, {
  key: "meu-form",
});

const draft = recoverDraft(); // null se não existir
```

---

## 🎨 Customização

### Cores Contextuais

```tsx
<UniversalFormLayout
  contextColor="#10B981" // Verde
  {...props}
/>

// Cores recomendadas:
// Saúde: #10B981 (verde)
// Vacina: #EF4444 (vermelho)
// Momento: #6366F1 (azul)
// Família: #10B981 (verde)
// Carta: #8B5CF6 (roxo)
```

### Agrupamento de Campos (Seções)

```tsx
const fields = [
  {
    id: "nome",
    section: "Informações Básicas",
    // ...
  },
  {
    id: "email",
    section: "Contato",
    // ...
  },
];
```

### Intervalos de Autosave

```tsx
<UniversalFormLayout
  config={{
    ...config,
    autosaveInterval: 5000, // 5 segundos
  }}
  {...props}
/>
```

---

## 🧪 Exemplos Práticos

Veja `examples/FormIntegrationExamples.tsx` para:

- ✅ Refatorar formulário existente
- ✅ Criar seletor de tipo
- ✅ Integrar com App.tsx
- ✅ Usar hooks customizados

---

## 📱 Acessibilidade

✅ Touch targets ≥44x44px  
✅ Labels descritivas  
✅ Teclado navegável  
✅ Contraste WCAG AA  
✅ Feedback sensorial (som + vibração)  
✅ Leitura de tela compatível

---

## 🐛 Troubleshooting

### "Validação não mostra erro"

Certifique-se de que o campo foi tocado (`touched[fieldId] = true`)

### "Autosave não funciona"

Verifique localStorage: `localStorage.getItem('form:seu-form:draft')`

### "Som não toca no iOS"

iOS requer interação. Som toca na primeira interação do usuário.

### "Campo não aparece"

Verifique se está no array `fields` dentro de `formConfig`

---

## 📊 Performance

- Renderização eficiente com React.memo
- Lazy loading de componentes
- Debounce em validação (500ms)
- Debounce em autosave (500ms)
- localStorage, não sessionStorage (persistência)

---

## 🔄 Próximas Fases

- [ ] Fase 2: Refatorar formulários existentes (Growth, Vaccine, etc)
- [ ] Fase 3: Integração no App.tsx
- [ ] Fase 4: Upload de mídia integrado
- [ ] Fase 5: Exportação/Compartilhamento
- [ ] Fase 6: Backend sync

Veja `CHECKLIST_IMPLEMENTACAO.md` para detalhes.

---

## 📚 Referências

| Doc                                                                           | Propósito            |
| ----------------------------------------------------------------------------- | -------------------- |
| [QUICK_START_FORMS.md](../QUICK_START_FORMS.md)                               | Começar em 5 min     |
| [WIRELFLOW_FORMULARIOS_UNIVERSAIS.md](../WIRELFLOW_FORMULARIOS_UNIVERSAIS.md) | Referência técnica   |
| [VISUAL_WIREFLOW_FORMULARIOS.md](../VISUAL_WIREFLOW_FORMULARIOS.md)           | Especificação visual |
| [SUMARIO_EXECUTIVO_FORMS.md](../SUMARIO_EXECUTIVO_FORMS.md)                   | Visão geral          |
| [CHECKLIST_IMPLEMENTACAO.md](../CHECKLIST_IMPLEMENTACAO.md)                   | Roadmap              |

---

## 💬 Perguntas?

Consulte a documentação acima ou examine os exemplos em `FormIntegrationExamples.tsx`.

---

**Criado:** 27 de outubro de 2025  
**Versão:** 1.0 (Core Completo)  
**Autores:** AI Assistant + Team  
**Licença:** MIT
