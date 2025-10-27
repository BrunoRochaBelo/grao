# 🔍 Referência Rápida - Momentos

## 📂 Arquivos Criados

```
src/features/moments/
├── MomentsScreen.tsx (🔴 Componente Principal)
├── components/
│   ├── TimelineCard.tsx
│   ├── TimelineGroupHeader.tsx
│   ├── FilterChips.tsx
│   ├── FullScreenViewer.tsx
│   ├── ContextMenu.tsx
│   └── EmptyPlaceholder.tsx
├── hooks/
│   ├── useFilters.ts
│   ├── useTimelineGroups.ts
│   └── useMomentActions.ts (✅ pré-existente)
└── utils/
    └── timelineUtils.ts

docs/
├── WIRELFLOW_MOMENTOS_IMPLEMENTACAO.md (Documento técnico completo)
├── TESTE_MOMENTOS.md (Checklist de testes)
├── EXTENSOES_FUTURAS_MOMENTOS.md (Roadmap de features)
└── VISUAL_WALKTHROUGH_MOMENTOS.md (Fluxos visuais)
```

---

## 🚀 Como Usar no App

### 1. Importar MomentsScreen

```typescript
// Em App.tsx
import { MomentsScreen } from "./features/moments/MomentsScreen";
```

### 2. Adicionar ao tipo Screen

```typescript
type Screen = "home" | "gallery" | "moments" | "chapters" | ...;
```

### 3. Renderizar

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

### 4. Acessar via Navegação

```typescript
// Barra inferior já tem tab "moments"
// Clique em 🖼️ para abrir
```

---

## 📊 Fluxo de Dados

```
useBabyData()
  ├─ currentBaby: Baby
  ├─ getMoments(): Moment[]
  ├─ getPlaceholdersForChapter(): PlaceholderTemplate[]
  └─ deleteMoment(): void

useFilters(moments, birthDate)
  ├─ filters: FiltersState
  ├─ filteredMoments: Moment[]
  ├─ availableFilters: { people, tags, types, ageRanges }
  ├─ toggleChapter()
  ├─ togglePerson()
  ├─ toggleTag()
  ├─ clearFilters()
  └─ hasActiveFilters: boolean

useTimelineGroups(moments)
  └─ TimelineGroup[]
```

---

## 🧩 Componentes

### MomentsScreen

**Props:**

- `onBack: () => void` - Callback voltar
- `onEditMoment?: (moment: Moment) => void` - Editar momento

**Responsabilidades:**

- Orquestração de filtros
- Renderização da timeline
- Gerenciamento de modais (fullscreen, contexto, exclusão)
- Integração com banco de dados

---

### TimelineCard

**Props:**

- `moment: Moment`
- `chapter?: Chapter`
- `baby: Baby`
- `onTap?: () => void`
- `onLongPress?: (e: React.MouseEvent) => void`
- `onDoubleTap?: () => void`
- `onEdit?: () => void`
- `onShare?: () => void`
- `onDelete?: () => void`

**Features:**

- Duplo-tap em imagem → fullscreen
- Tap simples → expande legenda
- Long-press → menu contextual
- Hover effects

---

### FullScreenViewer

**Props:**

- `moment: Moment` (obrigatório)
- `chapter?: Chapter`
- `baby?: Baby`
- `allMoments?: Moment[]`
- `isOpen: boolean`
- `onClose: () => void`
- `onEdit?: () => void`
- `onShare?: () => void`
- `onDelete?: () => void`

**Gestos:**

- Swipe lateral: próxima/anterior imagem
- Pinch-to-zoom: zoom até 3x
- Duplo-tap: reset zoom
- Swipe down: fecha

---

### FilterChips

**Props:**

- `chapters: Chapter[]`
- `filters: FiltersState`
- `hasActiveFilters: boolean`
- `onToggleChapter: (id: string) => void`
- `onTogglePerson: (person: string) => void`
- `onToggleTag: (tag: string) => void`
- `onClearFilters: () => void`
- `onToggleFavorite: () => void`
- `availablePeople: string[]`
- `availableTags: string[]`

**Features:**

- Scroll horizontal com inércia
- Botão "✕ Limpar" aparece apenas com filtros ativos
- Cores customizáveis por capítulo

---

### ContextMenu

**Props:**

- `x: number` - Posição X
- `y: number` - Posição Y
- `actions: ContextMenuAction[]`
- `onClose: () => void`

**Action:**

```typescript
interface ContextMenuAction {
  id: string;
  label: string;
  icon: string;
  color?: string;
  onClick: () => void;
}
```

---

### EmptyPlaceholder

**Props:**

- `name: string`
- `templateType: string`
- `onTap?: () => void`

---

### TimelineGroupHeader

**Props:**

- `monthYear: string` - Ex: "Outubro 2025"

---

## 🔧 Hooks

### useFilters

```typescript
const {
  filters, // Estado atual
  filteredMoments, // Momentos após filtrar
  availableFilters, // Valores únicos para chips
  toggleChapter, // Callback
  togglePerson, // Callback
  toggleTag, // Callback
  setAgeRange, // Callback
  toggleFavorite, // Callback
  clearFilters, // Callback
  hasActiveFilters, // Boolean
} = useFilters(moments, birthDate);
```

### useTimelineGroups

```typescript
const timelineGroups = useTimelineGroups(filteredMoments);
// Retorna: TimelineGroup[]
// {
//   monthYear: "Outubro 2025",
//   month: 10,
//   year: 2025,
//   date: Date,
//   moments: Moment[]
// }
```

---

## 🛠️ Utilitários

### formatMonthYear(date: Date): string

```typescript
const result = formatMonthYear(new Date("2025-10-17"));
// "Outubro 2025"
```

### formatShortDate(dateString: string): string

```typescript
const result = formatShortDate("2025-10-17T08:30:00");
// "17/10/2025"
```

### calculateAge(birthDate: string, eventDate: string): string

```typescript
const age = calculateAge("2024-03-17", "2025-10-17");
// "1a 7m"
```

### getMomentTypeIcon(templateId?: string, chapterId?: string): string

```typescript
const icon = getMomentTypeIcon("mesversario-1");
// "🎂"
```

### getTextPreview(text?: string, maxChars?: number): string

```typescript
const preview = getTextPreview(noteLong, 100);
// "Aurora nasceu às 8h30, pesando 3.2kg..."
```

### filterMoments(moments, criteria, birthDate): Moment[]

```typescript
const filtered = filterMoments(
  moments,
  {
    chapters: ["1", "2"],
    people: ["Mamãe"],
    tags: ["nascimento"],
  },
  birthDate
);
```

### groupMomentsByMonth(moments): TimelineGroup[]

```typescript
const groups = groupMomentsByMonth(moments);
// Agrupa e ordena por mês (descendente)
```

---

## 🎨 Estilos Customizáveis

Todos os componentes usam Tailwind + variáveis CSS:

```css
--primary: #a594f9
--secondary: #fbd6eb
--background: #fafafa
--border: #e0e0e0
--muted: #f5f5f5
```

Para customizar cores de capítulos:

```typescript
// Chapter interface já tem:
color: string; // Ex: "#A7F3D0"
icon: string; // Ex: "🌱"
```

---

## 🧪 Testes Recomendados

### Unitários (futura implementação)

- [ ] useFilters - múltiplos filtros
- [ ] useTimelineGroups - ordenação
- [ ] timelineUtils - formatação de datas
- [ ] calculateAge - cálculo de idade

### Integração

- [ ] MomentsScreen renderiza corretamente
- [ ] Filtros funcionam em cascata
- [ ] Callbacks disparam corretamente
- [ ] Dados persistem no localStorage

### E2E

- [ ] Fluxo completo: ver → expandir → excluir
- [ ] Fullscreen: abrir → zoom → fechar
- [ ] Menu: long-press → ação

Veja `docs/TESTE_MOMENTOS.md` para checklist completo.

---

## 🚨 Troubleshooting

### Cards não aparecem

- [ ] Verificar se `getMoments()` retorna dados
- [ ] Verificar filtros muito restritivos
- [ ] Console: buscar erros de renderização

### Filtros não funcionam

- [ ] Verificar tipos: `filters.chapters` deve ser `string[]`
- [ ] Verificar `hasActiveFilters` está calculado corretamente
- [ ] Console: debugar `toggleChapter()` callbacks

### Fullscreen não abre

- [ ] Verificar se imagem tem URL válida
- [ ] Verificar `isOpen={true}`
- [ ] Console: buscar erros de state

### Performance lenta

- [ ] Limitar momentos renderizados com virtual scrolling
- [ ] Usar `useMemo` para data complexa
- [ ] Profile com DevTools Performance

---

## 📚 Documentação Relacionada

1. **types.ts** - Interfaces (Moment, Chapter, Baby, etc)
2. **mockData.ts** - Dados de teste e CRUD local
3. **baby-data-context.tsx** - State management global
4. **theme-context.tsx** - Tema (dark/light)

---

## 🔗 Links Úteis

- **Repo:** https://github.com/BrunoRochaBelo/grao
- **Docs:** `/docs/`
- **Exemplo de uso:** `/src/features/gallery/GalleryScreen.tsx`

---

## ✅ Checklist Final

- [x] Todos os componentes criados
- [x] Hooks customizados funcionando
- [x] Utilitários prontos
- [x] Integrado ao App.tsx
- [x] Build sem erros
- [x] Documentação completa
- [x] Testes manuais validados
- [x] Pronto para produção

---

**Para começar:**

```bash
cd src/features/moments
# Ver estrutura de componentes
ls -la components/ hooks/ utils/

# Testar
npm run dev
# Abrir http://localhost:3001
# Clicar em 🖼️ Momentos
```

---

**Bom desenvolvimento! 🌸**
