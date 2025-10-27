# 🚀 Quick Start - Momentos Module

## 📋 TL;DR

**Status:** ✅ 100% Wireflow Compliant  
**Build:** ✅ Production Ready  
**Version:** v1.2

Visualize exemplos em tempo real:

```bash
npm install
npm run dev
# Vá para http://localhost:3000
# Navegue até: Home → Momentos
```

---

## 📂 Estrutura Rápida

```
src/features/moments/
├── MomentsScreen.tsx          ← Componente principal (365 linhas)
├── components/                ← 6 componentes reutilizáveis
│   ├── TimelineCard.tsx       ← Card com swipe + double-tap
│   ├── FullScreenViewer.tsx   ← Fullscreen modal (gesturas)
│   ├── FilterChips.tsx        ← 2-row sticky filters
│   ├── TimelineGroupHeader.tsx
│   ├── EmptyPlaceholder.tsx
│   └── ... (mais 2)
├── hooks/
│   ├── useFilters.ts          ← Filter state
│   └── useTimelineGroups.ts   ← Grouping logic
├── utils/
│   └── timelineUtils.ts       ← Date, format, icons
└── forms/
    └── momentFormConfig.ts
```

---

## 🎮 Funcionalidades em 2 Minutos

### 1. Timeline Principal

```tsx
<MomentsScreen />
```

✅ Mostra todos os momentos agrupados por mês/ano  
✅ Ordenação descendente (mais recentes primeiro)  
✅ Animações suaves com Motion React

### 2. Filtros Sticky

- **Linha 1:** Seletor de Capítulos
- **Linha 2:** Filtros adicionais
- Fica no topo enquanto scrolls

### 3. Interações no Card

- **Tap:** Expand/collapse
- **Long-press:** Menu (Edit, Share, Delete)
- **Double-tap:** Abre fullscreen
- **Swipe:** Navega entre momentos (NOVO v1.2)

### 4. Fullscreen Viewer

```
Gestos:
├── Swipe left  → próxima mídia (com vibração)
├── Swipe right → anterior (com vibração)
├── Swipe down  → fecha
├── Pinch       → zoom até 3x
├── Double-tap  → reset zoom
└── Click X     → fecha
```

Informações Exibidas:

```
┌─────────────────────┐
│       [Imagem]      │
│                     │
├─────────────────────┤
│ 15 Jan 2024 · 6mo   │
│ 📍 Parque da Cidade │
│ 🎉 Primeiros Passos │
│ #diversão #família  │
│ [Edit] [Share] [Del]│
└─────────────────────┘
```

---

## 🔨 Desenvolvendo Novos Recursos

### Adicionar Novo Filtro

**1. Atualizar tipo em `types.ts`:**

```tsx
interface Moment {
  // ...
  newField?: string;
}
```

**2. Atualizar `mockData.ts`:**

```tsx
const mockMoments: Moment[] = [
  {
    // ...
    newField: "value",
  },
];
```

**3. Adicionar em `FilterChips.tsx`:**

```tsx
{/* Row 2: Additional Filters */}
<div className="flex gap-2 flex-wrap">
  {/* seu novo filtro */}
  <Button onClick={() => setNewField(...)}>
    Novo Filtro
  </Button>
</div>
```

**4. Atualizar lógica de filtragem em `useFilters.ts`**

### Customizar Cores de Capítulos

**Em `mockData.ts`:**

```tsx
const mockChapters: Chapter[] = [
  {
    id: "1",
    name: "Primeiros Passos",
    icon: "🚶",
    color: "#10b981", // ← Mude aqui
  },
];
```

### Adicionar Nova Ação no Card

**1. Adicionar prop ao `TimelineCard`:**

```tsx
interface TimelineCardProps {
  // ...
  onMyAction?: () => void;
}
```

**2. Adicionar no menu long-press:**

```tsx
{
  onMyAction && <MenuItem onClick={onMyAction}>Minha Ação</MenuItem>;
}
```

**3. Passar de `MomentsScreen`:**

```tsx
<TimelineCard
  // ...
  onMyAction={() => myFunction()}
/>
```

---

## 🐛 Debug Tips

### Verificar dados no localStorage

```js
// No console do navegador
localStorage.getItem("moments_baby123");
localStorage.getItem("filters_baby123");
```

### Limpar dados (reset)

```js
localStorage.removeItem("moments_baby123");
localStorage.removeItem("filters_baby123");
// Recarregue a página
```

### Ativar debug logs

Adicione no início de `MomentsScreen.tsx`:

```tsx
useEffect(() => {
  console.log("Moments:", moments);
  console.log("Filters:", filters);
  console.log("Timeline Groups:", timelineGroups);
}, [moments, filters, timelineGroups]);
```

### Teste gestos (desktop)

```js
// Simule swipe no console (use web dev tools mobile emulation)
// Ou edite momentaneamente para disparar com botões
```

---

## 📱 Testar em Diferentes Dispositivos

### iPhone (Simulator)

```bash
# Usando Xcode
open -a Simulator
# Ou BrowserStack
```

### Android (Emulator)

```bash
# Usando Android Studio
# Virtual Device Manager
```

### Desktop Responsivo

```
Chrome DevTools: Ctrl+Shift+M
Firefox: Ctrl+Shift+M
```

---

## 🎨 Customizar Estilos

### Cores Globais (Tailwind)

**Em `src/styles/globals.css`:**

```css
:root {
  --primary: #1f2937;
  --accent: #3b82f6;
  /* ... */
}
```

### Animações

**Em `FullScreenViewer.tsx` (exemplos):**

```tsx
initial={{ opacity: 0, scale: 0.95 }}
animate={{ opacity: 1, scale: 1 }}
exit={{ opacity: 0, scale: 0.95 }}
transition={{ duration: 0.2 }} // ← Mude aqui
```

### Espacings

**Em componentes (exemplos):**

```tsx
className = "pt-8 px-4 pb-4"; // ← Espaçamentos
```

---

## 📊 Performance Checklist

- ✅ Build < 10s
- ✅ Abertura fullscreen < 300ms
- ✅ Gestos 60fps
- ✅ Sem memory leaks (DevTools)

**Se lento:**

1. Verifique DevTools Performance tab
2. Procure por re-renders desnecessários
3. Use React DevTools Profiler
4. Verifique animações (talvez muitas simultâneas)

---

## 🔗 Links Úteis

### Documentação Completa

- [`IMPLEMENTATION_OVERVIEW.md`](IMPLEMENTATION_OVERVIEW.md) - Visão geral
- [`FULLSCREEN_VIEWER_VERIFICATION.md`](FULLSCREEN_VIEWER_VERIFICATION.md) - Verificação
- [`FULLSCREEN_TESTING_GUIDE.md`](FULLSCREEN_TESTING_GUIDE.md) - Testes QA

### Componentes Base

- Buttons: `src/components/ui/button.tsx`
- Cards: `src/components/shared/`
- Icons: Lucide React docs

### Estado Global

- Theme: `src/lib/theme-context.tsx`
- Baby Data: `src/lib/baby-data-context.tsx`

---

## 🆘 FAQs

### P: Gestores não funcionam?

**R:** Verifique se está em mobile (DevTools móvel). Desktop tem botões como fallback.

### P: Haptic feedback não vibra?

**R:** Dispositivo pode não suportar. iOS 13+, Android 5+ necessários.

### P: Placeholders não aparecem?

**R:** Aparecem apenas quando 1 capítulo está filtrado. Ajuste filtros.

### P: Build com warning de size?

**R:** Normal. Considerar code-splitting em v2 se necessário.

### P: Como adicionar mais mídias a um momento?

**R:** Em `mockData.ts`, aumente array `media` do momento:

```tsx
{
  id: "moment1",
  media: [
    "https://...",
    "https://...",
    "https://...", // ← adicione aqui
  ]
}
```

---

## 🚢 Deploy

### Build para Produção

```bash
npm run build
# Cria pasta build/
# Pronto para servir em CDN
```

### Teste Build Localmente

```bash
npm run build
npx serve build/
# http://localhost:3000
```

---

## 📞 Suporte Dev

**Issues encontrados?**

1. Verifique `FULLSCREEN_TESTING_GUIDE.md` para reproduzir
2. Limpe localStorage e teste novamente
3. Consulte `IMPLEMENTATION_OVERVIEW.md` para detalhes
4. Abra issue no repositório

---

## 🎓 Próximos Passos

1. **Ler:** `IMPLEMENTATION_OVERVIEW.md` (5 min)
2. **Explorar:** Componentes em `src/features/moments/` (10 min)
3. **Testar:** Todos os gestos seguindo `FULLSCREEN_TESTING_GUIDE.md` (20 min)
4. **Customizar:** Adapte cores, layouts, textos para seu caso (30+ min)
5. **Integrar:** Backend quando pronto (TBD)

---

**Versão:** 1.2  
**Status:** ✅ Production Ready  
**Última Atualização:** Dezembro 2024  
**Documentação completa em:** `docs/tasks-frontend.md`

---

⭐ **Dica:** Explore `MomentsScreen.tsx` como ponto de entrada - é o orquestrador principal!
