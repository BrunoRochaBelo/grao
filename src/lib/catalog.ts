import type { Chapter, PlaceholderTemplate } from "../types";

const days = (value: number): number => value;
const months = (value: number): number => Math.round(value * 30);

type PlaceholderConfig = Omit<PlaceholderTemplate, "isCompleted"> & {
  isCompleted?: boolean;
};

interface CatalogChapterConfig {
  id: string;
  name: string;
  description: string;
  objective: string;
  viewer: string;
  icon: string;
  color: string;
  placeholders: PlaceholderConfig[];
}

const clonePlaceholder = (config: PlaceholderConfig): PlaceholderTemplate => ({
  ...config,
  isCompleted: config.isCompleted ?? false,
});
const gestacaoPlaceholders: PlaceholderConfig[] = [
  {
    id: "gestacao-descoberta-gravidez",
    name: "Descoberta da Gravidez",
    icon: "🧪",
    description: "Registre o dia do positivo e como tudo começou.",
    templateType: "primeira-vez",
    ageRangeStart: months(-6),
    ageRangeEnd: months(-1),
  },
  {
    id: "gestacao-diario-barriga",
    name: "Diário da Barriga",
    icon: "📅",
    description: "Série mensal com fotos e notas da gestação.",
    templateType: "nota",
    ageRangeStart: months(-6),
    ageRangeEnd: months(0),
    allowMultiple: true,
    metadata: {
      seriesId: "gestacao-diario",
      recurrence: "monthly",
    },
  },
  {
    id: "gestacao-historia-nome",
    name: "História do Nome",
    icon: "📝",
    description: "Conte como o nome do bebê foi escolhido.",
    templateType: "nota",
    ageRangeStart: months(-3),
    ageRangeEnd: months(0),
  },
  {
    id: "gestacao-cha-bebe",
    name: "Chá de Bebê / Ensaio",
    icon: "🎉",
    description: "Fotos e memórias do chá de bebê ou ensaio gestante.",
    templateType: "evento",
    ageRangeStart: months(-2),
    ageRangeEnd: months(0),
  },
  {
    id: "gestacao-nascimento",
    name: "Nascimento",
    icon: "👶",
    description: "O grande dia: parto, detalhes e primeiras emoções.",
    templateType: "primeira-vez",
    ageRangeStart: days(0),
    ageRangeEnd: days(7),
  },
  {
    id: "gestacao-chegada-casa",
    name: "Chegada em Casa",
    icon: "🏠",
    description: "Como foi o retorno ao lar com o bebê.",
    templateType: "primeira-vez",
    ageRangeStart: days(1),
    ageRangeEnd: months(1),
  },
  {
    id: "gestacao-plano-parto",
    name: "Plano de Parto",
    icon: "📋",
    description: "Preferências e desejos para o nascimento.",
    templateType: "nota",
    ageRangeStart: months(-4),
    ageRangeEnd: months(0),
    metadata: { optional: true },
  },
  {
    id: "gestacao-lista-maternidade",
    name: "Lista da Maternidade",
    icon: "🧳",
    description: "Checklist do que levar para o hospital.",
    templateType: "registro",
    ageRangeStart: months(-3),
    ageRangeEnd: months(0),
    metadata: { optional: true, checklist: true },
  },
];

const triagensPlaceholders: PlaceholderConfig[] = [
  {
    id: "triagens-teste-pezinho",
    name: "Teste do Pezinho",
    icon: "🦶",
    description: "Registro da coleta e resultado do teste do pezinho.",
    templateType: "triagem",
    ageRangeStart: days(3),
    ageRangeEnd: days(15),
  },
  {
    id: "triagens-teste-orelhinhas",
    name: "Teste da Orelhinha",
    icon: "👂",
    description: "EOA/PEATE: resultado da triagem auditiva neonatal.",
    templateType: "triagem",
    ageRangeStart: days(1),
    ageRangeEnd: days(30),
  },
  {
    id: "triagens-teste-olhinho",
    name: "Teste do Olhinho",
    icon: "👁️",
    description: "Reflexo vermelho: registro e profissional responsável.",
    templateType: "triagem",
    ageRangeStart: days(1),
    ageRangeEnd: days(30),
  },
  {
    id: "triagens-teste-coracaozinho",
    name: "Teste do Coraçãozinho",
    icon: "❤️",
    description: "Oximetria de pulso e orientações recebidas.",
    templateType: "triagem",
    ageRangeStart: days(1),
    ageRangeEnd: days(30),
  },
  {
    id: "triagens-registro-civil",
    name: "Registro Civil & Documentos",
    icon: "🪪",
    description: "Certidão, CPF, Cartão do SUS e outros documentos.",
    templateType: "registro",
    ageRangeStart: days(1),
    ageRangeEnd: months(2),
  },
  {
    id: "triagens-primeira-foto-documento",
    name: "Primeira Foto de Documento",
    icon: "📸",
    description: "Guarde a primeira foto oficial do bebê.",
    templateType: "primeira-vez",
    ageRangeStart: days(1),
    ageRangeEnd: months(2),
  },
];
const primeirasVezesPlaceholders: PlaceholderConfig[] = [
  {
    id: "primeiras-primeira-vez",
    name: "Primeira Vez",
    icon: "✨",
    description:
      "Use para qualquer primeira vez marcante. Escolha o tipo e conte a história.",
    templateType: "primeira-vez",
    ageRangeStart: days(0),
    allowMultiple: true,
    metadata: {
      categories: [
        "Banho",
        "Sorriso",
        "Rolamento",
        "Engatinhar",
        "Passo",
        "Palavra",
        "Dente",
        "Comida",
        "Som",
        "Passeio",
        "Outro",
      ],
      allowsMultiple: true,
    },
  },
  {
    id: "primeiras-primeiro-banho",
    name: "Primeiro Banho",
    icon: "🛁",
    description: "Como foi o primeiro banho fora da maternidade.",
    templateType: "primeira-vez",
    ageRangeStart: days(1),
    ageRangeEnd: months(1),
  },
  {
    id: "primeiras-primeiro-colo",
    name: "Primeiro Colo Fora da Maternidade",
    icon: "🤱",
    description: "Quem recebeu o bebê primeiro em casa?",
    templateType: "primeira-vez",
    ageRangeStart: days(1),
    ageRangeEnd: months(1),
  },
  {
    id: "primeiras-primeiro-sorriso",
    name: "Primeiro Sorriso",
    icon: "😊",
    description: "A primeira vez que o sorriso social apareceu.",
    templateType: "primeira-vez",
    ageRangeStart: months(1),
    ageRangeEnd: months(2),
  },
  {
    id: "primeiras-primeiro-passeio",
    name: "Primeiro Passeio",
    icon: "🚗",
    description: "Conte sobre a primeira saída em família.",
    templateType: "primeira-vez",
    ageRangeStart: months(2),
    ageRangeEnd: months(3),
  },
  {
    id: "primeiras-primeiro-som",
    name: "Primeiro Som / Balbucio",
    icon: "🗣️",
    description: "Guarde o começo das conversas.",
    templateType: "primeira-vez",
    ageRangeStart: months(3),
    ageRangeEnd: months(4),
  },
  {
    id: "primeiras-primeiro-rolamento",
    name: "Primeiro Rolamento",
    icon: "🔄",
    description: "Registro do dia em que rolou sozinho.",
    templateType: "primeira-vez",
    ageRangeStart: months(4),
    ageRangeEnd: months(5),
  },
  {
    id: "primeiras-primeiro-dente",
    name: "Primeiro Dente",
    icon: "🦷",
    description: "Quando o primeiro dentinho apareceu.",
    templateType: "primeira-vez",
    ageRangeStart: months(5),
    ageRangeEnd: months(6),
  },
  {
    id: "primeiras-primeira-comida",
    name: "Primeira Comida",
    icon: "🥣",
    description: "Introdução alimentar e reações favoritas.",
    templateType: "primeira-vez",
    ageRangeStart: months(5),
    ageRangeEnd: months(6),
  },
  {
    id: "primeiras-primeiro-engatinhar",
    name: "Primeiro Engatinhar",
    icon: "🧎",
    description: "O início das explorações pelo chão.",
    templateType: "primeira-vez",
    ageRangeStart: months(7),
    ageRangeEnd: months(8),
  },
  {
    id: "primeiras-primeira-palavra",
    name: "Primeira Palavra",
    icon: "💬",
    description: "Qual foi a primeira palavra dita?",
    templateType: "primeira-vez",
    ageRangeStart: months(8),
    ageRangeEnd: months(9),
  },
  {
    id: "primeiras-primeiro-passo",
    name: "Primeiro Passo",
    icon: "👣",
    description: "Registre o momento em que começou a andar.",
    templateType: "primeira-vez",
    ageRangeStart: months(9),
    ageRangeEnd: months(12),
  },
  {
    id: "primeiras-primeira-viagem",
    name: "Primeira Viagem",
    icon: "🧳",
    description: "Conte sobre a primeira aventura fora de casa.",
    templateType: "primeira-vez",
    ageRangeStart: months(10),
    ageRangeEnd: months(12),
  },
  {
    id: "primeiras-amizade-brinquedo",
    name: "Primeira Amizade / Brinquedo Favorito",
    icon: "🧸",
    description: "Registre o brinquedo ou amigo preferido.",
    templateType: "primeira-vez",
    ageRangeStart: months(6),
    allowMultiple: true,
    metadata: { category: "Outro" },
  },
];
const consultasPlaceholders: PlaceholderConfig[] = [
  {
    id: "saude-consulta-rn",
    name: "Consulta RN — 1ª semana",
    icon: "🩺",
    description: "Acompanhamento entre 7 e 10 dias de vida.",
    templateType: "consulta",
    ageRangeStart: days(7),
    ageRangeEnd: days(10),
  },
  {
    id: "saude-consulta-1m",
    name: "Consulta 1 mês",
    icon: "🩺",
    description: "Orientações e avaliação com 1 mês.",
    templateType: "consulta",
    ageRangeStart: months(1),
    ageRangeEnd: months(1) + days(10),
  },
  {
    id: "saude-consulta-2m",
    name: "Consulta 2 meses",
    icon: "🩺",
    description: "Evolução e recomendações do segundo mês.",
    templateType: "consulta",
    ageRangeStart: months(2),
    ageRangeEnd: months(2) + days(10),
  },
  {
    id: "saude-consulta-4m",
    name: "Consulta 4 meses",
    icon: "🩺",
    description: "Acompanhamento do quarto mês.",
    templateType: "consulta",
    ageRangeStart: months(4),
    ageRangeEnd: months(4) + days(10),
  },
  {
    id: "saude-consulta-6m",
    name: "Consulta 6 meses",
    icon: "🩺",
    description: "Metade do primeiro ano e orientações complementares.",
    templateType: "consulta",
    ageRangeStart: months(6),
    ageRangeEnd: months(6) + days(10),
  },
  {
    id: "saude-consulta-9m",
    name: "Consulta 9 meses",
    icon: "🩺",
    description: "Marcos motores e alimentação.",
    templateType: "consulta",
    ageRangeStart: months(9),
    ageRangeEnd: months(9) + days(10),
  },
  {
    id: "saude-consulta-12m",
    name: "Consulta 12 meses",
    icon: "🩺",
    description: "Primeiro ano completo e próximos passos.",
    templateType: "consulta",
    ageRangeStart: months(12),
    ageRangeEnd: months(12) + days(15),
  },
  {
    id: "saude-consulta-18m",
    name: "Consulta 18 meses",
    icon: "🩺",
    description: "Avaliação de linguagem, sono e rotina.",
    templateType: "consulta",
    ageRangeStart: months(18),
    ageRangeEnd: months(18) + days(15),
  },
  {
    id: "saude-consulta-24m",
    name: "Consulta 24 meses",
    icon: "🩺",
    description: "Fechamento do segundo ano de vida.",
    templateType: "consulta",
    ageRangeStart: months(24),
    ageRangeEnd: months(24) + days(15),
  },
  {
    id: "saude-consulta-medica",
    name: "Consulta Médica",
    icon: "🩺",
    description:
      "Registre consultas com pediatra, APS ou especialistas. Inclua motivos e condutas.",
    templateType: "consulta",
    ageRangeStart: days(0),
    allowMultiple: true,
    metadata: {
      tipo: ["Pediatra", "APS", "Especialista"],
      allowsMultiple: true,
    },
  },
  {
    id: "saude-registro-sono-humor",
    name: "Registro de Sono & Humor",
    icon: "🌙",
    description: "Diário opcional para acompanhar sono e humor semanal.",
    templateType: "nota",
    ageRangeStart: days(0),
    allowMultiple: true,
    metadata: { optional: true },
  },
  {
    id: "saude-consulta-dentista",
    name: "Dentista",
    icon: "🦷",
    description: "Primeira avaliação odontológica (sugestão 8–24 meses).",
    templateType: "consulta",
    ageRangeStart: months(8),
    ageRangeEnd: months(24),
    metadata: { optional: true },
  },
];
const vacinasPlaceholders: PlaceholderConfig[] = [
  {
    id: "vacina-bcg",
    name: "BCG",
    icon: "💉",
    description: "Ao nascer.",
    templateType: "vacina",
    ageRangeStart: days(0),
    ageRangeEnd: days(30),
    metadata: { dose: "Única" },
  },
  {
    id: "vacina-hepatite-b-nascimento",
    name: "Hepatite B (ao nascer)",
    icon: "💉",
    description: "Dose ao nascer.",
    templateType: "vacina",
    ageRangeStart: days(0),
    ageRangeEnd: days(30),
    metadata: { dose: "Dose ao nascer" },
  },
  {
    id: "vacina-penta-2m",
    name: "Penta (DTP/Hib/HB)",
    icon: "💉",
    description: "Primeira dose aos 2 meses.",
    templateType: "vacina",
    ageRangeStart: months(2),
    ageRangeEnd: months(2) + days(15),
    metadata: { dose: "1ª dose" },
  },
  {
    id: "vacina-polio-vip-2m",
    name: "Polio VIP (inativada)",
    icon: "💉",
    description: "Primeira dose aos 2 meses.",
    templateType: "vacina",
    ageRangeStart: months(2),
    ageRangeEnd: months(2) + days(15),
    metadata: { dose: "1ª dose" },
  },
  {
    id: "vacina-pneumo10-2m",
    name: "Pneumo 10",
    icon: "💉",
    description: "Primeira dose aos 2 meses.",
    templateType: "vacina",
    ageRangeStart: months(2),
    ageRangeEnd: months(2) + days(15),
    metadata: { dose: "1ª dose" },
  },
  {
    id: "vacina-rotavirus-2m",
    name: "Rotavírus",
    icon: "💉",
    description: "Primeira dose aos 2 meses.",
    templateType: "vacina",
    ageRangeStart: months(2),
    ageRangeEnd: months(2) + days(15),
    metadata: { dose: "1ª dose" },
  },
  {
    id: "vacina-meningo-c-3m",
    name: "Meningo C",
    icon: "💉",
    description: "Primeira dose aos 3 meses.",
    templateType: "vacina",
    ageRangeStart: months(3),
    ageRangeEnd: months(3) + days(15),
    metadata: { dose: "1ª dose" },
  },
  {
    id: "vacina-penta-4m",
    name: "Penta (Reforço)",
    icon: "💉",
    description: "Segunda dose aos 4 meses.",
    templateType: "vacina",
    ageRangeStart: months(4),
    ageRangeEnd: months(4) + days(15),
    metadata: { dose: "2ª dose" },
  },
  {
    id: "vacina-polio-vip-4m",
    name: "Polio VIP (Reforço)",
    icon: "💉",
    description: "Segunda dose aos 4 meses.",
    templateType: "vacina",
    ageRangeStart: months(4),
    ageRangeEnd: months(4) + days(15),
    metadata: { dose: "2ª dose" },
  },
  {
    id: "vacina-pneumo10-4m",
    name: "Pneumo 10 (Reforço)",
    icon: "💉",
    description: "Segunda dose aos 4 meses.",
    templateType: "vacina",
    ageRangeStart: months(4),
    ageRangeEnd: months(4) + days(15),
    metadata: { dose: "2ª dose" },
  },
  {
    id: "vacina-rotavirus-4m",
    name: "Rotavírus (Reforço)",
    icon: "💉",
    description: "Segunda dose aos 4 meses.",
    templateType: "vacina",
    ageRangeStart: months(4),
    ageRangeEnd: months(4) + days(15),
    metadata: { dose: "2ª dose" },
  },
  {
    id: "vacina-meningo-c-5m",
    name: "Meningo C",
    icon: "💉",
    description: "Segunda dose aos 5 meses.",
    templateType: "vacina",
    ageRangeStart: months(5),
    ageRangeEnd: months(5) + days(15),
    metadata: { dose: "2ª dose" },
  },
  {
    id: "vacina-penta-6m",
    name: "Penta",
    icon: "💉",
    description: "Terceira dose aos 6 meses.",
    templateType: "vacina",
    ageRangeStart: months(6),
    ageRangeEnd: months(6) + days(15),
    metadata: { dose: "3ª dose" },
  },
  {
    id: "vacina-polio-vip-6m",
    name: "Polio VIP",
    icon: "💉",
    description: "Terceira dose aos 6 meses.",
    templateType: "vacina",
    ageRangeStart: months(6),
    ageRangeEnd: months(6) + days(15),
    metadata: { dose: "3ª dose" },
  },
  {
    id: "vacina-covid-infantil",
    name: "Covid-19 Infantil",
    icon: "💉",
    description: "Conforme calendários do MS (2024).",
    templateType: "vacina",
    ageRangeStart: months(6),
    ageRangeEnd: months(24),
    metadata: { esquema: "Rotina 2024" },
  },
  {
    id: "vacina-febre-amarela-9m",
    name: "Febre Amarela",
    icon: "💉",
    description: "Aos 9 meses (avaliar elegibilidade regional).",
    templateType: "vacina",
    ageRangeStart: months(9),
    ageRangeEnd: months(10),
    metadata: { dependerRegional: true },
  },
  {
    id: "vacina-tríplice-viral",
    name: "Tríplice Viral (SCR)",
    icon: "💉",
    description: "Aos 12 meses - Sarampo, Caxumba, Rubéola.",
    templateType: "vacina",
    ageRangeStart: months(12),
    ageRangeEnd: months(12) + days(15),
    metadata: { dose: "1ª dose" },
  },
  {
    id: "vacina-pneumo10-reforco-12m",
    name: "Pneumo 10 - Reforço",
    icon: "💉",
    description: "Reforço aos 12 meses.",
    templateType: "vacina",
    ageRangeStart: months(12),
    ageRangeEnd: months(12) + days(15),
    metadata: { dose: "Reforço" },
  },
  {
    id: "vacina-meningo-c-reforco-12m",
    name: "Meningo C - Reforço",
    icon: "💉",
    description: "Reforço aos 12 meses.",
    templateType: "vacina",
    ageRangeStart: months(12),
    ageRangeEnd: months(12) + days(15),
    metadata: { dose: "Reforço" },
  },
  {
    id: "vacina-hepatite-a-12m",
    name: "Hepatite A (1ª dose)",
    icon: "💉",
    description: "Primeira dose aos 12 meses.",
    templateType: "vacina",
    ageRangeStart: months(12),
    ageRangeEnd: months(12) + days(15),
    metadata: { dose: "1ª dose" },
  },
  {
    id: "vacina-dtp-reforco-15m",
    name: "DTP - 1º Reforço",
    icon: "💉",
    description: "Primeiro reforço aos 15 meses.",
    templateType: "vacina",
    ageRangeStart: months(15),
    ageRangeEnd: months(15) + days(20),
    metadata: { dose: "1º Reforço" },
  },
  {
    id: "vacina-polio-vop-reforco-15m",
    name: "Polio VOP - 1º Reforço",
    icon: "💉",
    description: "Primeiro reforço de Polio oral aos 15 meses.",
    templateType: "vacina",
    ageRangeStart: months(15),
    ageRangeEnd: months(15) + days(20),
    metadata: { dose: "1º Reforço" },
  },
  {
    id: "vacina-tetraviral-varicela-15m",
    name: "Tetraviral (SCRV) / Varicela",
    icon: "💉",
    description: "Aos 15 meses - conforme disponibilidade regional.",
    templateType: "vacina",
    ageRangeStart: months(15),
    ageRangeEnd: months(15) + days(20),
    metadata: { dose: "1ª dose ou reforço" },
  },
  {
    id: "vacina-reforcos-18m",
    name: "Avaliar Reforços / Atualizações",
    icon: "💉",
    description:
      "Acompanhe esquemas de resgate e atualizações do calendário nacional.",
    templateType: "vacina",
    ageRangeStart: months(18),
    ageRangeEnd: months(24),
  },
];

const medidasPlaceholders: PlaceholderConfig[] = [
  {
    id: "saude-medidas",
    name: "Medidas",
    icon: "📏",
    description: "Registre peso, altura e perímetro cefálico. Gera o gráfico.",
    templateType: "medida",
    ageRangeStart: days(0),
    allowMultiple: true,
    metadata: { allowsMultiple: true },
  },
];

const saudePlaceholders: PlaceholderConfig[] = [
  ...consultasPlaceholders,
  ...vacinasPlaceholders,
  ...medidasPlaceholders,
];
const familiaPlaceholders: PlaceholderConfig[] = [
  {
    id: "familia-arvore",
    name: "Árvore da Família",
    icon: "🌳",
    description: "Monte os laços e conexões da família.",
    templateType: "registro",
    ageRangeStart: days(0),
  },
  {
    id: "familia-primeira-visita",
    name: "Primeira Visita",
    icon: "👣",
    description: "Quem conheceu o bebê primeiro?",
    templateType: "primeira-vez",
    ageRangeStart: days(1),
    ageRangeEnd: months(1),
  },
  {
    id: "familia-encontro-avos",
    name: "Encontro com Avós / Padrinhos",
    icon: "👵",
    description: "Registre encontros especiais com avós e padrinhos.",
    templateType: "evento",
    ageRangeStart: days(1),
  },
  {
    id: "familia-amigos-brincadeiras",
    name: "Amigos & Brincadeiras",
    icon: "🧑‍🤝‍🧑",
    description: "Momentos com amigos e interações lúdicas.",
    templateType: "evento",
    ageRangeStart: months(3),
    allowMultiple: true,
  },
  {
    id: "familia-foto-familia",
    name: "Foto de Família",
    icon: "📸",
    description: "Faça fotos recorrentes para acompanhar o crescimento.",
    templateType: "evento",
    ageRangeStart: days(0),
    allowMultiple: true,
  },
];

const buildMesversarioPlaceholders = (): PlaceholderConfig[] => {
  const items: PlaceholderConfig[] = [];

  for (let month = 1; month <= 24; month += 1) {
    items.push({
      id: `mesversario-${month.toString().padStart(2, "0")}`,
      name: `Mêsversário ${month}`,
      icon: "🎂",
      description: `Celebre o mês ${month} com fotos e destaques.`,
      templateType: "mesversario",
      ageRangeStart: months(month),
      ageRangeEnd: months(month) + days(10),
      allowMultiple: month > 12,
      metadata: {
        slot: month,
        seriesId: "mesversario",
      },
    });
  }

  for (let month = 1; month <= 24; month += 1) {
    items.push({
      id: `resumo-mes-${month.toString().padStart(2, "0")}`,
      name: `Resumo do Mês ${month}`,
      icon: "🗒️",
      description: `Síntese do mês ${month}: destaques, aprendizagens e galeria.`,
      templateType: "nota",
      ageRangeStart: months(month),
      ageRangeEnd: months(month) + days(15),
      allowMultiple: false,
      metadata: {
        slot: month,
        section: "resumo",
      },
    });
  }

  items.push(
    {
      id: "mesversario-primeiro-aniversario",
      name: "Primeiro Aniversário",
      icon: "🎉",
      description: "Celebre o primeiro ano de vida.",
      templateType: "mesversario",
      ageRangeStart: months(12),
      ageRangeEnd: months(12) + days(30),
    },
    {
      id: "mesversario-segundo-aniversario",
      name: "Segundo Aniversário",
      icon: "🎊",
      description: "Registre os 24 meses e as conquistas do segundo ano.",
      templateType: "mesversario",
      ageRangeStart: months(24),
      ageRangeEnd: months(24) + days(30),
    }
  );

  return items;
};

const mesversarioPlaceholders = buildMesversarioPlaceholders();
const cartasPlaceholders: PlaceholderConfig[] = [
  {
    id: "cartas-boas-vindas",
    name: "Carta de Boas-Vindas",
    icon: "✉️",
    description: "Escreva uma mensagem para os primeiros dias.",
    templateType: "carta",
    ageRangeStart: days(0),
    ageRangeEnd: months(1),
  },
  {
    id: "cartas-meio-ano",
    name: "Carta de Meio Ano",
    icon: "💌",
    description: "Compartilhe sentimentos aos 6 meses.",
    templateType: "carta",
    ageRangeStart: months(6),
    ageRangeEnd: months(6) + days(30),
  },
  {
    id: "cartas-1-ano",
    name: "Carta de 1 Ano",
    icon: "📬",
    description: "Conte tudo sobre o primeiro ano de vida.",
    templateType: "carta",
    ageRangeStart: months(12),
    ageRangeEnd: months(12) + days(30),
  },
  {
    id: "cartas-18-meses",
    name: "Carta de 18 Meses",
    icon: "🖋️",
    description: "Mensagem opcional para um ano e meio.",
    templateType: "carta",
    ageRangeStart: months(18),
    ageRangeEnd: months(18) + days(30),
    metadata: { optional: true },
  },
  {
    id: "cartas-2-anos",
    name: "Carta de 2 Anos",
    icon: "📝",
    description: "Registre memórias do segundo ano.",
    templateType: "carta",
    ageRangeStart: months(24),
    ageRangeEnd: months(24) + days(30),
  },
  {
    id: "cartas-futuro",
    name: "Carta para o Futuro",
    icon: "📦",
    description: "Agende para abrir no futuro em uma idade especial.",
    templateType: "carta",
    ageRangeStart: months(0),
    allowMultiple: true,
    metadata: { futureDelivery: true },
  },
];

const artePlaceholders: PlaceholderConfig[] = [
  {
    id: "arte-primeiro-rabisco",
    name: "Primeiro Rabisco",
    icon: "🖍️",
    description: "Guarde o primeiro desenho ou rabisco.",
    templateType: "arte",
    ageRangeStart: months(9),
    ageRangeEnd: months(12),
  },
  {
    id: "arte-colagem",
    name: "Colagem / Pintura de Dedo",
    icon: "🎨",
    description: "Experimente tinta, texturas e bagunça criativa.",
    templateType: "arte",
    ageRangeStart: months(12),
    ageRangeEnd: months(18),
  },
  {
    id: "arte-formas-simples",
    name: "Desenho com Formas Simples",
    icon: "🟦",
    description: "Primeiros círculos, traços e formas básicas.",
    templateType: "arte",
    ageRangeStart: months(18),
    ageRangeEnd: months(24),
  },
  {
    id: "arte-autorretrato",
    name: "Meu Primeiro Autorretrato",
    icon: "🧑‍🎨",
    description: "Registre a primeira tentativa de desenhar a si mesmo.",
    templateType: "arte",
    ageRangeStart: months(24),
    ageRangeEnd: months(30),
  },
  {
    id: "arte-escola",
    name: "Arte da Escola",
    icon: "🏫",
    description: "Coleções criadas na escola ou atividades guiadas.",
    templateType: "arte",
    ageRangeStart: months(18),
    allowMultiple: true,
  },
  {
    id: "arte-livre",
    name: "Arte Livre",
    icon: "🎭",
    description: "Qualquer criação artística e expressão criativa.",
    templateType: "arte",
    ageRangeStart: months(0),
    allowMultiple: true,
  },
];
const datasEspeciaisPlaceholders: PlaceholderConfig[] = [
  {
    id: "datas-primeiro-natal",
    name: "Primeiro Natal",
    icon: "🎄",
    description: "Como foi celebrar o primeiro Natal em família.",
    templateType: "evento",
    ageRangeStart: months(0),
    allowMultiple: false,
  },
  {
    id: "datas-primeira-pascoa",
    name: "Primeira Páscoa",
    icon: "🐰",
    description: "Doces, orelhas e tradições de Páscoa.",
    templateType: "evento",
    ageRangeStart: months(0),
  },
  {
    id: "datas-festas-populares",
    name: "Carnaval / São João / Batizado",
    icon: "🎉",
    description: "Celebrações culturais, religiosas ou tradicionais.",
    templateType: "evento",
    ageRangeStart: months(0),
    allowMultiple: true,
  },
  {
    id: "datas-viagem-marcante",
    name: "Viagem Marcante",
    icon: "✈️",
    description: "Primeira grande viagem ou passeio inesquecível.",
    templateType: "evento",
    ageRangeStart: months(6),
    allowMultiple: true,
  },
  {
    id: "datas-evento-custom",
    name: "Evento Especial",
    icon: "⭐",
    description: "Qualquer outra data afetiva relevante.",
    templateType: "evento",
    ageRangeStart: months(0),
    allowMultiple: true,
    metadata: { custom: true },
  },
];

const pensamentosPlaceholders: PlaceholderConfig[] = [
  {
    id: "pensamentos-momento-livre",
    name: "Momento Livre",
    icon: "📝",
    description: "Notas rápidas com título, texto e mídia.",
    templateType: "nota",
    ageRangeStart: days(0),
    allowMultiple: true,
    metadata: { default: true },
  },
  {
    id: "pensamentos-dia",
    name: "Pensamento do Dia",
    icon: "💡",
    description: "Frase ou lembrança do dia.",
    templateType: "nota",
    ageRangeStart: days(0),
    allowMultiple: true,
  },
  {
    id: "pensamentos-lembrete-medico",
    name: "Lembrete Médico",
    icon: "⏰",
    description: "Use para acompanhar orientações ou lembretes de saúde.",
    templateType: "registro",
    ageRangeStart: days(0),
  },
  {
    id: "pensamentos-humor-dia",
    name: "Humor do Dia",
    icon: "🙂",
    description: "Registre o humor com um controle de emojis.",
    templateType: "nota",
    ageRangeStart: days(0),
    allowMultiple: true,
    metadata: { input: "emoji-slider" },
  },
];

const escolaPlaceholders: PlaceholderConfig[] = [
  {
    id: "escola-primeiro-dia",
    name: "Primeiro Dia na Escola / Creche",
    icon: "🏫",
    description: "Como foi a adaptação e quem participou.",
    templateType: "primeira-vez",
    ageRangeStart: months(6),
    allowMultiple: false,
  },
  {
    id: "escola-primeiras-producoes",
    name: "Primeiras Produções",
    icon: "🖍️",
    description: "Artes, atividades ou registros escolares.",
    templateType: "arte",
    ageRangeStart: months(12),
    allowMultiple: true,
  },
  {
    id: "escola-apresentacao",
    name: "Apresentação / Festa da Escola",
    icon: "🎭",
    description: "Eventos especiais organizados pela escola.",
    templateType: "evento",
    ageRangeStart: months(12),
    allowMultiple: true,
  },
  {
    id: "escola-amigos",
    name: "Amigos da Escola",
    icon: "🧑‍🤝‍🧑",
    description: "Registre os amigos e histórias da escola.",
    templateType: "evento",
    ageRangeStart: months(12),
    allowMultiple: true,
  },
  {
    id: "escola-bilhetes",
    name: "Bilhetes / Anexos",
    icon: "📎",
    description: "Documentos, comunicados e anexos importantes.",
    templateType: "registro",
    ageRangeStart: months(12),
    allowMultiple: true,
  },
];
const catalogConfig: CatalogChapterConfig[] = [
  {
    id: "1",
    name: "Gestação & Chegada",
    description: "Do positivo ao retorno para casa.",
    objective: "Registrar toda a jornada da gestação aos primeiros dias.",
    viewer: "Linha do Tempo + Story",
    icon: "🤰",
    color: "#A7F3D0",
    placeholders: gestacaoPlaceholders,
  },
  {
    id: "2",
    name: "Triagens do RN & Primeiros Registros",
    description: "Centralize os testes neonatais e burocracias iniciais.",
    objective: "Garantir exames neonatais e documentos essenciais em dia.",
    viewer: "Lista + Linha do Tempo",
    icon: "🩺",
    color: "#FED7D7",
    placeholders: triagensPlaceholders,
  },
  {
    id: "3",
    name: "Primeiras Vezes & Descobertas",
    description: "Checklist dos marcos clássicos do desenvolvimento.",
    objective: "Celebrar cada estreia e acompanhar os marcos.",
    viewer: "Checklist + Lista",
    icon: "✨",
    color: "#FDE68A",
    placeholders: primeirasVezesPlaceholders,
  },
  {
    id: "4",
    name: "Saúde & Crescimento",
    description: "Consultas, vacinas, medidas e registros de saúde.",
    objective:
      "Manter o acompanhamento em dia com o PNI e a puericultura brasileira.",
    viewer: "Dashboard + Lista",
    icon: "📈",
    color: "#BFDBFE",
    placeholders: saudePlaceholders,
  },
  {
    id: "5",
    name: "Família & Visitas",
    description: "Laços, encontros e lembranças com quem ama.",
    objective: "Mapear afetos e visitas marcantes.",
    viewer: "Grade de Pessoas + Lista",
    icon: "👪",
    color: "#FBCFE8",
    placeholders: familiaPlaceholders,
  },
  {
    id: "6",
    name: "Mêsversários & Resumos",
    description: "Celebrações mensais e sínteses do desenvolvimento.",
    objective: "Celebrar e resumir cada mês vivido.",
    viewer: "Série / Grade + Lista",
    icon: "🎂",
    color: "#DDD6FE",
    placeholders: mesversarioPlaceholders,
  },
  {
    id: "7",
    name: "Cartas & Cápsulas do Tempo",
    description: "Mensagens especiais para diferentes idades.",
    objective: "Registrar cartas e cápsulas para o futuro.",
    viewer: "Leitura",
    icon: "✉️",
    color: "#FECACA",
    placeholders: cartasPlaceholders,
  },
  {
    id: "8",
    name: "Arte & Desenhos",
    description: "Criações e registros visuais.",
    objective: "Guardar produções artísticas e momentos criativos.",
    viewer: "Galeria",
    icon: "🎨",
    color: "#C7D2FE",
    placeholders: artePlaceholders,
  },
  {
    id: "9",
    name: "Datas Especiais",
    description: "Calendário afetivo com celebrações marcantes.",
    objective: "Registrar datas comemorativas e eventos inesquecíveis.",
    viewer: "Linha do Tempo",
    icon: "📆",
    color: "#FDE2E2",
    placeholders: datasEspeciaisPlaceholders,
  },
  {
    id: "10",
    name: "Pensamentos & Observações",
    description: "Notas rápidas, lembretes e reflexões.",
    objective: "Centralizar ideias, lembretes e registros diários.",
    viewer: "Lista",
    icon: "💭",
    color: "#E0E7FF",
    placeholders: pensamentosPlaceholders,
  },
  {
    id: "11",
    name: "Escola & Aprendizados",
    description: "Socialização e primeiras atividades guiadas.",
    objective: "Acompanhar rotina escolar e produções.",
    viewer: "Linha do Tempo + Lista",
    icon: "🏫",
    color: "#D1FAE5",
    placeholders: escolaPlaceholders,
  },
  {
    id: "12",
    name: "Capítulos Custom",
    description: "Espaço para momentos personalizados.",
    objective: "Criar capítulos sob medida para a família.",
    viewer: "Customizável",
    icon: "🧩",
    color: "#FEF3C7",
    placeholders: [],
  },
];

const PLACEHOLDERS_BY_CHAPTER_INTERNAL: Record<string, PlaceholderTemplate[]> =
  catalogConfig.reduce(
    (acc, chapter) => ({
      ...acc,
      [chapter.id]: chapter.placeholders.map(clonePlaceholder),
    }),
    {} as Record<string, PlaceholderTemplate[]>
  );

export const PLACEHOLDERS_BY_CHAPTER = PLACEHOLDERS_BY_CHAPTER_INTERNAL;

export const catalogChapters = catalogConfig.map(
  ({ placeholders, ...chapter }) => ({
    ...chapter,
    totalPlaceholders: placeholders.length,
  })
);

export const chapters: Chapter[] = catalogConfig.map(
  ({ placeholders, ...chapter }) => ({
    id: chapter.id,
    name: chapter.name,
    description: chapter.description,
    objective: chapter.objective,
    viewer: chapter.viewer,
    icon: chapter.icon,
    color: chapter.color,
    total: placeholders.length,
    completed: placeholders.filter((item) => item.isCompleted).length,
  })
);

const chapterMap = new Map(catalogConfig.map((item) => [item.id, item]));

export const getCatalogChapter = (chapterId: string) =>
  chapterMap.get(chapterId);

export const getCatalogPlaceholders = (chapterId: string) =>
  PLACEHOLDERS_BY_CHAPTER[chapterId] ?? [];

export interface PlaceholderQueryOptions {
  includeAllAges?: boolean;
}

export const getPlaceholdersForChapter = (
  chapterId: string,
  babyAgeInDays: number = 0,
  options?: PlaceholderQueryOptions
): PlaceholderTemplate[] => {
  const placeholders = getCatalogPlaceholders(chapterId);
  if (options?.includeAllAges) {
    return placeholders;
  }
  return filterPlaceholdersByAge(placeholders, babyAgeInDays);
};

// Função auxiliar para filtrar por idade (uso opcional na UI)
export const filterPlaceholdersByAge = (
  placeholders: PlaceholderTemplate[],
  babyAgeInDays: number
): PlaceholderTemplate[] => {
  return placeholders.filter((template) => {
    if (babyAgeInDays < template.ageRangeStart) {
      return false;
    }
    if (
      typeof template.ageRangeEnd === "number" &&
      babyAgeInDays > template.ageRangeEnd
    ) {
      return false;
    }
    return true;
  });
};

export const allPlaceholders = Object.values(PLACEHOLDERS_BY_CHAPTER).flat();
