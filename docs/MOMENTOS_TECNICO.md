# 🌸 Documentação Técnica - Seção Momentos

## 📁 Estrutura de Arquivos

```
src/features/moments/
├── MomentsScreen.tsx                 # Componente principal (orquestrador)
├── components/
│   ├── TimelineCard.tsx              # Card individual de momento
│   ├── TimelineGroupHeader.tsx       # Divisor mensal (sticky)
│   ├── FilterChips.tsx               # Barra de filtros roláveis
│   ├── FullScreenViewer.tsx          # Visualizador fullscreen
│   ├── ContextMenu.tsx               # Menu long-press
│   └── EmptyPlaceholder.tsx          # Card vazio para placeholder
├── hooks/
│   ├── useFilters.ts                 # Gerenciamento de filtros
│   ├── useTimelineGroups.ts          # Agrupamento por mês
│   └── useMomentActions.ts           # Ações de CRUD (já existe)
└── utils/
    └── timelineUtils.ts              # Utilitários de formatação
```

---

## 🔧 Componentes

### **MomentsScreen.tsx**

**Responsabilidades:**

- Orquestrar toda a seção Momentos
- Gerenciar estado de filtros
- Renderizar timeline agrupada
- Lidar com eventos de interação

**Props:**

```typescript
interface MomentsScreenProps {
  onBack: () => void;
  onEditMoment?: (moment: Moment) => void;
}
```

**Estado:**

```typescript
- selectedMoment: Moment | null        // Momento expandido
- contextMenu: { x, y, moment }        // Menu de contexto
- fullScreenMoment: Moment | null      // Modo fullscreen
- showDeleteConfirm: Moment | null     // Modal de confirmação
```

---

### **TimelineCard.tsx**

**Responsabilidades:**

- Exibir momento individual
- Gerenciar interações (tap, long-press, double-tap, swipe)
- Expandir/retrair legenda
- Navegar entre cards do mesmo mês

**Props:**

```typescript
interface TimelineCardProps {
  moment: Moment;
  chapter?: Chapter;
  baby: Baby;
  onTap?: () => void;
  onLongPress?: (e: React.MouseEvent) => void;
  onDoubleTap?: () => void;
  onEdit?: () => void;
  onShare?: () => void;
  onDelete?: () => void;
  onNavigatePrevious?: () => void;
  onNavigateNext?: () => void;
}
```

**Interações Suportadas:**

- ✅ Tap simples: expande legenda
- ✅ Double-tap na imagem: fullscreen
- ✅ Long-press (500ms): menu contextual
- ✅ Swipe lateral (50px+): navega entre cards

---

### **FilterChips.tsx**

**Responsabilidades:**

- Exibir chips roláveis de filtros
- Gerenciar dropdowns de categorias
- Botão "Limpar filtros" com fade-in
- Feedback visual de filtros ativos

**Props:**

```typescript
interface FilterChipsProps {
  chapters: Chapter[];
  filters: FiltersState;
  hasActiveFilters: boolean;
  onToggleChapter: (chapterId: string) => void;
  onTogglePerson: (person: string) => void;
  onToggleTag: (tag: string) => void;
  onSetAgeRange: (range: AgeRange | undefined) => void;
  onClearFilters: () => void;
  onToggleFavorite: () => void;
  availablePeople: string[];
  availableTags: string[];
  availableAgeRanges: AgeRange[];
}
```

**Dropdowns:**

- 📚 Capítulos
- 👥 Pessoas
- 🏷️ Tags
- ⏰ Período/Idade

---

### **FullScreenViewer.tsx**

**Responsabilidades:**

- Exibir mídia em modo imersivo
- Gerenciar gestos (swipe, pinch)
- Navegação entre mídias
- Exibir barra inferior com ações

**Props:**

```typescript
interface FullScreenViewerProps {
  moment: Moment;
  chapter?: Chapter;
  baby?: Baby;
  allMoments?: Moment[];
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onShare?: () => void;
  onDelete?: () => void;
}
```

**Gestos Suportados:**

- ✅ Swipe lateral: próxima/anterior mídia
- ✅ Pinch: zoom até 3x
- ✅ Swipe down (100px+): fecha
- ✅ Double-tap: reset zoom

---

### **TimelineGroupHeader.tsx**

**Responsabilidades:**

- Exibir título do mês/ano
- Efeito sticky ao scroll
- Fade suave de transição

**Props:**

```typescript
interface TimelineGroupHeaderProps {
  monthYear: string; // "Outubro 2025"
}
```

---

### **ContextMenu.tsx**

**Responsabilidades:**

- Exibir menu de ações
- Animar entrada (scale 0.9 → 1)
- Fechar ao clicar fora

**Props:**

```typescript
interface ContextMenuProps {
  x: number;
  y: number;
  actions: ContextMenuAction[];
  onClose: () => void;
}

interface ContextMenuAction {
  id: string;
  label: string;
  icon: string;
  color?: string;
  onClick: () => void;
}
```

---

### **EmptyPlaceholder.tsx**

**Responsabilidades:**

- Exibir card vazio tracejado
- Indicar placeholder não preenchido
- Abrir formulário ao tocar

**Props:**

```typescript
interface EmptyPlaceholderProps {
  name: string;
  templateType: string;
  onTap?: () => void;
}
```

---

## 🪝 Hooks Customizados

### **useFilters.ts**

**Responsabilidades:**

- Gerenciar estado de filtros
- Aplicar filtros aos momentos
- Extrair filtros disponíveis

**Interface:**

```typescript
export interface FiltersState {
  chapters: string[];
  people: string[];
  tags: string[];
  ageRange?: AgeRange;
  favorites: boolean;
}

export interface AgeRange {
  label: string;
  min: number;
  max: number;
}
```

**Retorno:**

```typescript
{
  filters: FiltersState;
  filteredMoments: Moment[];
  availableFilters: {
    people: string[];
    tags: string[];
    types: string[];
    ageRanges: AgeRange[];
  };
  toggleChapter: (chapterId: string) => void;
  togglePerson: (person: string) => void;
  toggleTag: (tag: string) => void;
  setAgeRange: (range?: AgeRange) => void;
  toggleFavorite: () => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}
```

---

### **useTimelineGroups.ts**

**Responsabilidades:**

- Agrupar momentos por mês/ano
- Ordenar grupos cronologicamente
- Filtrar apenas publicados

**Retorno:**

```typescript
TimelineGroup[] = [
  {
    monthYear: "Outubro 2025";
    month: 10;
    year: 2025;
    date: Date;
    moments: Moment[];
  },
  ...
]
```

---

## 🛠️ Utilitários

### **timelineUtils.ts**

**Funções principais:**

```typescript
// Agrupar por mês/ano
groupMomentsByMonth(moments: Moment[]): TimelineGroup[]

// Formatar data
formatMonthYear(date: Date): string  // "Outubro 2025"
formatShortDate(dateString: string): string  // "12/10/2025"

// Calcular idade
calculateAge(birthDate: string, eventDate: string): string  // "1a 2m 3d"
calculateAgeInDays(birthDate: string): number

// Detalhamento de idade
calculateAgeDetailed(birthDate: string)
  => { years, months, days }

// Ícones
getMomentTypeIcon(templateType?: string): string

// Preview
getTextPreview(text?: string, maxChars?: number): string

// Detecção
isSeriesMoment(templateType?: string): boolean

// Agrupamento
groupPlaceholdersByType(templates: any[]): Record<string, any[]>
```

---

## 📊 Tipos de Dados

### **TimelineGroup**

```typescript
interface TimelineGroup {
  monthYear: string; // "Outubro 2025"
  month: number; // 10
  year: number; // 2025
  date: Date;
  moments: Moment[];
}
```

### **FiltersState**

```typescript
interface FiltersState {
  chapters: string[]; // IDs selecionados
  people: string[]; // Nomes selecionados
  tags: string[]; // Tags selecionadas
  ageRange?: AgeRange; // Período (0-3m, etc)
  favorites: boolean; // Apenas favoritos
}
```

### **Moment** (do types.ts)

```typescript
interface Moment {
  id: string;
  chapterId: string;
  templateId?: string;
  title: string;
  date: string; // ISO: "2024-10-12T10:30:00"
  age: string; // Calculado: "1a 2m 3d"
  location?: string;
  people?: string[];
  media: string[]; // URLs de imagem/vídeo
  noteShort?: string;
  noteLong?: string;
  tags?: string[];
  privacy: "private" | "people" | "link";
  status: "published" | "draft";
  extraData?: Record<string, unknown>;
}
```

---

## 🔄 Fluxo de Dados

```
MomentsScreen
├── useFilters(moments, babyBirthDate)
│   └── filteredMoments (aplicados)
├── useTimelineGroups(filteredMoments)
│   └── timelineGroups (agrupados por mês)
└── Renderizar grupos
    ├── TimelineGroupHeader (mês/ano)
    └── TimelineCard[] (cards do mês)
        ├── onTap → expandir legenda
        ├── onLongPress → ContextMenu
        ├── onDoubleTap → FullScreenViewer
        └── onSwipe → navegar entre cards
```

---

## 🎨 Animações e Transições

### **Motion/Framer Motion**

```typescript
// Entrada de grupo
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>

// Expansão de legenda
setIsExpanded(!isExpanded)  // slide down 200ms

// Menu contextual
scale: 0.9 → 1 (spring, damping: 20)

// Fullscreen
scale: 0.95 → 1
opacity: 0 → 1

// Fade entre meses
opacity com transição ao scroll
```

---

## 💾 Persistência

### **LocalStorage**

```typescript
// Momentos
localStorage.getItem("babybook_moments");
localStorage.setItem("babybook_moments", JSON.stringify(moments));

// Favoritos
localStorage.getItem("babybook_favorites"); // string[] de IDs
```

---

## 📱 Responsividade

### **Breakpoints**

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### **Ajustes**

- Cards: 100% em mobile, max-w-2xl em desktop
- Filtros: scroll horizontal em mobile
- Fullscreen: otimizado para pinch em touch
- Menu: posicionado relativo ao toque

---

## ♿ Acessibilidade

- ✅ Touch targets ≥ 44px
- ✅ Contrast ratio ≥ 4.5:1
- ✅ Labels semânticos
- ✅ Navegação por teclado
- ✅ Descrições de imagens

---

## 🚀 Performance

### **Otimizações**

- `useMemo` para agrupamento (depende de moments)
- `useCallback` para handlers de filtro
- `AnimatePresence` com `mode="popLayout"` para transições suaves
- Lazy loading de imagens (considerado para versão futura)

---

## 🧪 Testing

### **Casos de Teste Sugeridos**

```typescript
// useFilters
-test("filtro por capítulo") -
  test("filtro por período de idade") -
  test("combinação de múltiplos filtros") -
  test("limpar filtros") -
  // useTimelineGroups
  test("agrupamento por mês") -
  test("ordenação decrescente") -
  test("momentos publicados apenas") -
  // TimelineCard
  test("expansão de legenda") -
  test("duplo-tap abre fullscreen") -
  test("long-press abre menu") -
  // FullScreenViewer
  test("swipe lateral navega mídias") -
  test("pinch zoom funciona") -
  test("swipe down fecha");
```

---

## 🔗 Integração com App.tsx

### **Rota Registrada**

```typescript
case "moments":
  return (
    <MomentsScreen
      onBack={goBack}
      onEditMoment={(moment) =>
        navigateTo({ type: "moment-detail", moment })
      }
    />
  );
```

### **BottomNav**

```typescript
const tabs = [
  { id: "moments", label: "Momentos", icon: Flower },
  ...
];
```

---

## 📋 Checklist de Deploy

- [x] Componentes implementados
- [x] Hooks customizados funcionam
- [x] Tipos TypeScript corretos
- [x] Integração em App.tsx
- [x] Navegação em BottomNav
- [x] Dados de teste em mockData.ts
- [x] Sem erros de compilação
- [x] Build produção funciona
- [x] Responsive em mobile/desktop
- [x] Documentação completa

---

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique `MOMENTOS_WIREFLOW_IMPLEMENTATION.md` para arquitetura
2. Veja `MOMENTOS_GUIA_RAPIDO.md` para uso
3. Revise `src/features/moments/` para código
4. Consulte `README.md` para setup geral

---

**Versão:** 1.0
**Última atualização:** 27/10/2025
**Status:** ✅ Pronto para Produção
