/**
 * Configurações de formulários específicos
 * Cada um define seu layout, campos e comportamentos
 */

import type { FormTemplate } from "@/types";

/**
 * Formulário de Crescimento (Peso, Altura, etc)
 */
export const FORM_GROWTH: FormTemplate = {
  id: "growth",
  name: "Medição de Crescimento",
  icon: "📈",
  category: "saude",
  successMessage: "Crescimento atualizado 📈",
  returnRoute: "health-growth",
  formConfig: {
    id: "form-growth",
    title: "Registrar Medição",
    icon: "📈",
    description: "Peso, altura e perímetro cefálico",
    contextualColor: "#10B981",
    autosaveInterval: 8000,
    allowDrafts: true,
    fields: [
      {
        id: "date",
        type: "date",
        label: "Data da Medição",
        required: true,
        section: "Informações Básicas",
      },
      {
        id: "weight",
        type: "number",
        label: "Peso (kg)",
        placeholder: "3.5",
        required: true,
        minValue: 0,
        maxValue: 50,
        step: 0.1,
      },
      {
        id: "height",
        type: "number",
        label: "Altura (cm)",
        placeholder: "50",
        required: true,
        minValue: 0,
        maxValue: 200,
        step: 0.1,
      },
      {
        id: "headCircumference",
        type: "number",
        label: "Perímetro Cefálico (cm)",
        placeholder: "34",
        required: false,
        minValue: 0,
        maxValue: 100,
        step: 0.1,
      },
      {
        id: "notes",
        type: "textarea",
        label: "Observações",
        placeholder: "Alguma observação importante?",
        required: false,
        section: "Extras",
      },
    ],
  },
};

/**
 * Formulário de Vacina
 */
export const FORM_VACCINE: FormTemplate = {
  id: "vaccine",
  name: "Registro de Vacina",
  icon: "💉",
  category: "saude",
  successMessage: "Vacina registrada 💉",
  returnRoute: "health-vaccines",
  formConfig: {
    id: "form-vaccine",
    title: "Registrar Vacina",
    icon: "💉",
    description: "Informações sobre vacinação",
    contextualColor: "#EF4444",
    autosaveInterval: 10000,
    allowDrafts: true,
    fields: [
      {
        id: "name",
        type: "select",
        label: "Nome da Vacina",
        required: true,
        section: "Informações da Vacina",
        options: [
          { value: "bcg", label: "BCG" },
          { value: "hepatite-b", label: "Hepatite B" },
          { value: "rotavirus", label: "Rotavírus" },
          { value: "pneumococica", label: "Pneumocócica" },
          { value: "poliomielite", label: "Poliomielite" },
          { value: "tetano", label: "Tétano" },
          { value: "influenza", label: "Influenza" },
          { value: "sarampo", label: "Sarampo" },
        ],
      },
      {
        id: "date",
        type: "date",
        label: "Data da Vacinação",
        required: true,
      },
      {
        id: "dose",
        type: "text",
        label: "Dose",
        placeholder: "1ª dose",
        required: true,
      },
      {
        id: "lot",
        type: "text",
        label: "Lote",
        placeholder: "Número do lote",
        required: false,
      },
      {
        id: "location",
        type: "text",
        label: "Local",
        placeholder: "Clínica, hospital, etc",
        required: false,
      },
      {
        id: "whoGave",
        type: "text",
        label: "Quem levou",
        placeholder: "Mãe, pai, avó, etc",
        required: false,
        section: "Extras",
      },
      {
        id: "reaction",
        type: "textarea",
        label: "Reações (se houver)",
        placeholder: "Febre, inchaço, vermelhidão...",
        required: false,
      },
      {
        id: "notes",
        type: "textarea",
        label: "Observações",
        placeholder: "Notas importantes",
        required: false,
      },
    ],
  },
};

/**
 * Formulário de Sono & Humor
 */
export const FORM_SLEEP_HUMOR: FormTemplate = {
  id: "sleep-humor",
  name: "Humor do Dia",
  icon: "😴",
  category: "saude",
  successMessage: "Registrado com bom humor ☀️",
  returnRoute: "health-sleep-humor",
  formConfig: {
    id: "form-sleep-humor",
    title: "Registrar Humor do Dia",
    icon: "😴",
    description: "Como está nosso bebê hoje?",
    contextualColor: "#6366F1",
    autosaveInterval: 8000,
    allowDrafts: true,
    fields: [
      {
        id: "date",
        type: "date",
        label: "Data",
        required: true,
        section: "Informações Básicas",
      },
      {
        id: "mood",
        type: "emoji-slider",
        label: "Como estava o humor?",
        required: true,
        section: "Humor",
        helperText: "Deslize para escolher o estado emocional",
        options: [
          { value: "very-happy", label: "Muito feliz", emoji: "😄" },
          { value: "happy", label: "Feliz", emoji: "🙂" },
          { value: "neutral", label: "Neutro", emoji: "😐" },
          { value: "tired", label: "Cansado", emoji: "😴" },
          { value: "fussy", label: "Irritado", emoji: "😠" },
        ],
      },
      {
        id: "notes",
        type: "textarea",
        label: "Notas",
        placeholder: "O que aconteceu durante o dia?",
        required: false,
        section: "Extras",
      },
    ],
  },
};

/**
 * Formulário de Mêsversário
 */
export const FORM_MONTHSARY: FormTemplate = {
  id: "monthsary",
  name: "Mêsversário",
  icon: "🎂",
  category: "momento",
  successMessage: "Mais um mês de amor 🎂",
  returnRoute: "chapters-detail",
  formConfig: {
    id: "form-monthsary",
    title: "Registrar Mêsversário",
    icon: "🎂",
    description: "Celebre mais um mês de vida",
    contextualColor: "#F59E0B",
    autosaveInterval: 10000,
    allowDrafts: true,
    fields: [
      {
        id: "month",
        type: "number",
        label: "Mês de Vida",
        placeholder: "1",
        required: true,
        minValue: 0,
        maxValue: 48,
        section: "Informações Básicas",
      },
      {
        id: "date",
        type: "date",
        label: "Data da Celebração",
        required: true,
      },
      {
        id: "weight",
        type: "number",
        label: "Peso (kg)",
        placeholder: "3.5",
        required: false,
        minValue: 0,
        maxValue: 50,
        step: 0.1,
        section: "Medidas",
      },
      {
        id: "height",
        type: "number",
        label: "Altura (cm)",
        placeholder: "50",
        required: false,
        minValue: 0,
        maxValue: 200,
        step: 0.1,
      },
      {
        id: "milestone",
        type: "textarea",
        label: "Fato Marcante",
        placeholder: "O que de especial aconteceu esse mês?",
        required: false,
        section: "Memória",
      },
      {
        id: "parentsMood",
        type: "emoji-slider",
        label: "Humor dos Pais",
        required: false,
        options: [
          { value: "very-happy", label: "Muito feliz", emoji: "😄" },
          { value: "happy", label: "Feliz", emoji: "🙂" },
          { value: "grateful", label: "Grato", emoji: "🙏" },
          { value: "tired", label: "Cansado", emoji: "😴" },
          { value: "overwhelmed", label: "Sobrecarregado", emoji: "😰" },
        ],
      },
      {
        id: "notes",
        type: "textarea",
        label: "Texto Livre",
        placeholder: "Uma mensagem especial para marcar esse mês",
        required: false,
      },
    ],
  },
};

/**
 * Formulário de Carta/Cápsula do Tempo
 */
export const FORM_LETTER: FormTemplate = {
  id: "letter",
  name: "Carta para o Futuro",
  icon: "💌",
  category: "carta",
  successMessage: "Carta selada para o futuro 💌",
  returnRoute: "chapters-detail",
  formConfig: {
    id: "form-letter",
    title: "Escrever Carta",
    icon: "💌",
    description: "Uma mensagem do presente para o futuro",
    contextualColor: "#8B5CF6",
    autosaveInterval: 12000,
    allowDrafts: true,
    fields: [
      {
        id: "title",
        type: "text",
        label: "Título da Carta",
        placeholder: "Ex: Uma Mensagem para você aos 5 anos",
        required: true,
        section: "Identificação",
        maxLength: 100,
      },
      {
        id: "writtenDate",
        type: "date",
        label: "Data Escrita",
        required: true,
      },
      {
        id: "openAt",
        type: "number",
        label: "Abrir aos (anos)",
        placeholder: "5",
        required: true,
        minValue: 0,
        maxValue: 100,
      },
      {
        id: "content",
        type: "textarea",
        label: "Conteúdo da Carta",
        placeholder: "Escreva uma mensagem do coração...",
        required: true,
        section: "Mensagem",
      },
      {
        id: "tags",
        type: "tags",
        label: "Tags (para organizar)",
        placeholder: "Sentimentos, tópicos importantes, etc",
        required: false,
        section: "Organização",
      },
      {
        id: "isPrivate",
        type: "select",
        label: "Privacidade",
        required: false,
        section: "Configurações",
        options: [
          { value: "private", label: "🔒 Privado" },
          { value: "shared", label: "👥 Compartilhado" },
        ],
      },
    ],
  },
};

/**
 * Formulário de Árvore da Família
 */
export const FORM_FAMILY_MEMBER: FormTemplate = {
  id: "family-member",
  name: "Membro da Família",
  icon: "🌳",
  category: "familia",
  successMessage: "Novo ramo na árvore 🌿",
  returnRoute: "family-tree",
  formConfig: {
    id: "form-family-member",
    title: "Adicionar Membro",
    icon: "🌳",
    description: "Expanda a árvore da família",
    contextualColor: "#10B981",
    autosaveInterval: 10000,
    allowDrafts: true,
    fields: [
      {
        id: "name",
        type: "text",
        label: "Nome",
        placeholder: "Nome completo",
        required: true,
        section: "Informações Pessoais",
        maxLength: 100,
      },
      {
        id: "relation",
        type: "select",
        label: "Relação",
        required: true,
        options: [
          { value: "mae", label: "👩 Mãe", emoji: "👩" },
          { value: "pai", label: "👨 Pai", emoji: "👨" },
          { value: "avo", label: "👵 Avó", emoji: "👵" },
          { value: "avo-pat", label: "👴 Avô", emoji: "👴" },
          { value: "tia", label: "👩‍🦱 Tia", emoji: "👩‍🦱" },
          { value: "tio", label: "👨‍🦱 Tio", emoji: "👨‍🦱" },
          { value: "prima", label: "👧 Prima", emoji: "👧" },
          { value: "primo", label: "👦 Primo", emoji: "👦" },
          { value: "madrinha", label: "💎 Madrinha", emoji: "💎" },
          { value: "padrinho", label: "🎩 Padrinho", emoji: "🎩" },
          { value: "outro", label: "👤 Outro", emoji: "👤" },
        ],
      },
      {
        id: "birthDate",
        type: "date",
        label: "Data de Nascimento",
        required: false,
      },
      {
        id: "notes",
        type: "textarea",
        label: "Notas",
        placeholder: "Informações adicionais, curiosidades...",
        required: false,
        section: "Extras",
      },
    ],
  },
};

/**
 * Formulário de Momento em Branco
 */
export const FORM_FREE_NOTE: FormTemplate = {
  id: "free-note",
  name: "Momento em Branco",
  icon: "📝",
  category: "momento",
  successMessage: "Momento capturado ✨",
  returnRoute: "moments",
  formConfig: {
    id: "form-free-note",
    title: "Novo Momento em Branco",
    icon: "📝",
    description: "Registre qualquer coisa importante",
    contextualColor: "#6366F1",
    autosaveInterval: 8000,
    allowDrafts: true,
    fields: [
      {
        id: "title",
        type: "text",
        label: "Título",
        placeholder: "O que deseja registrar?",
        required: true,
        section: "Informações Básicas",
        maxLength: 150,
      },
      {
        id: "date",
        type: "date",
        label: "Data",
        required: true,
      },
      {
        id: "content",
        type: "textarea",
        label: "Nota",
        placeholder: "Escreva à vontade...",
        required: true,
        section: "Conteúdo",
      },
      {
        id: "location",
        type: "text",
        label: "Local",
        placeholder: "Onde aconteceu?",
        required: false,
      },
      {
        id: "people",
        type: "tags",
        label: "Pessoas Envolvidas",
        placeholder: "Quem estava presente?",
        required: false,
        section: "Contexto",
      },
      {
        id: "tags",
        type: "tags",
        label: "Tags",
        placeholder: "Categorias, tópicos, emoções...",
        required: false,
      },
      {
        id: "privacy",
        type: "select",
        label: "Privacidade",
        required: false,
        section: "Configurações",
        options: [
          { value: "private", label: "🔒 Privado" },
          { value: "people", label: "👥 Pessoas Selecionadas" },
          { value: "link", label: "🔗 Via Link" },
        ],
      },
    ],
  },
};

// Mapa de templates para acesso rápido
export const FORM_TEMPLATES: Record<string, FormTemplate> = {
  growth: FORM_GROWTH,
  vaccine: FORM_VACCINE,
  "sleep-humor": FORM_SLEEP_HUMOR,
  monthsary: FORM_MONTHSARY,
  letter: FORM_LETTER,
  "family-member": FORM_FAMILY_MEMBER,
  "free-note": FORM_FREE_NOTE,
};
