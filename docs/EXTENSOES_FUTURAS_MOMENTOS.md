# 🔧 Extensões Futuras - Seção "Momentos"

## 1️⃣ Compartilhamento Avançado

### Quando Implementar

Após backend estar pronto com endpoints de compartilhamento.

### Fluxo

```
onShare()
  → Modal com opções:
     ✓ Link privado (gera URL expiráviaa)
     ✓ Download PDF (álbum com fotos)
     ✓ Download ZIP (fotos + metadados)
     ✓ Enviar por Email
     ✓ Copiar URL
```

### Código Base

```typescript
// Em MomentsScreen.tsx, substituir:
const handleShare = useCallback((moment: Moment) => {
  setContextMenu(null);
  // TODO: Abrir modal de compartilhamento
  navigateTo({ type: "share-modal", moment });
}, []);

// Novo componente: ShareModal.tsx
export function ShareModal({ moment, onClose }: ...) {
  const [shareType, setShareType] = useState<'link' | 'pdf' | 'zip'>('link');

  // Gerar link via API
  const generateShareLink = async () => {
    const response = await fetch('/api/moments/{id}/share', {
      method: 'POST',
      body: JSON.stringify({ expiresIn: '7d' })
    });
    // Toast: "Link copiado! Válido por 7 dias 🔗"
  };
}
```

---

## 2️⃣ Duplicação de Momentos

### Quando Implementar

Menu contextual já inclui "Duplicar" (não implementado ainda).

### Fluxo

```
onDuplicate()
  → Cria cópia do momento como DRAFT
  → Abre formulário de edição
  → Toast: "Momento duplicado! Edite e salve 📋"
```

### Código

```typescript
// Em MomentsScreen.tsx, adicionar ao ContextMenu:
{
  id: 'duplicate',
  label: 'Duplicar',
  icon: '📋',
  onClick: () => handleDuplicate(contextMenu.moment),
}

const handleDuplicate = useCallback((moment: Moment) => {
  const copy: Moment = {
    ...moment,
    id: crypto.randomUUID(),
    status: 'draft',
    date: new Date().toISOString(), // data atual
  };

  // Salvar como draft
  addMoment(copy);

  // Abrir edição
  onEditMoment?.(copy);

  toast.success('Momento duplicado! Edite e salve 📋');
});
```

---

## 3️⃣ Favoritos com Persistência

### Quando Implementar

Botão ⭐ já existe, mas precisa de backend.

### Dados

```typescript
// Estender Moment interface
export interface Moment {
  // ... existing
  isFavorited?: boolean;
  favoriteDate?: string;
}
```

### Fluxo

```
1. Clique ⭐ no fullscreen viewer
   → Salva favorito no DB
   → Chip "⭐ Favoritos" fica azul
   → Toast: "Momento destacado 🌟"

2. Quando filtrar por "⭐ Favoritos"
   → Mostra apenas favoritos
   → Ordena por data de favor mais recentes
   → Se nenhum: "Nenhum favorito ainda"
```

### Código

```typescript
// useFilters.ts
const toggleFavorite = useCallback(async () => {
  const response = await fetch(`/api/moments/${momentId}/favorite`, {
    method: "POST",
  });

  setFilters((prev) => ({
    ...prev,
    isFavorite: !prev.isFavorite,
  }));

  toast.success("Momento destacado 🌟");
});
```

---

## 4️⃣ Série de Mêsversários

### Quando Implementar

Dados estruturados como "série".

### Fluxo

```
1. Quando está vendo um mêsversário (1º mês)
   → Botão "Ver série completa" aparece
   → Clique: mostra todos os 12 mêsversários

2. Timeline filtrada por mêsversários
   → 12 cards lado a lado (carousel)
   → Swipe lateral: pula entre mês 1 → 12
   → Cada card mostra: foto + idade (1m, 2m, etc)
   → Cards vazios com placeholder (○ Pendente)
```

### Código

```typescript
// timelineUtils.ts
export function getSeriesMoments(moments: Moment[], templateId: string): Moment[] {
  return moments.filter(m => m.templateId === templateId)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

// MomentsScreen.tsx
const seriesMoments = getSeriesMoments(moments, 'mesversario-1');
return (
  <div className="mb-8">
    <h3 className="text-lg font-bold mb-4">🎂 Série: Mêsversários</h3>
    <MesvesarioCarousel moments={seriesMoments} />
  </div>
);

// Novo componente: MesversarioCarousel.tsx
export function MesversarioCarousel({ moments }: ...) {
  // Carousel horizontal com 12 slots
  const months = Array.from({ length: 12 }, (_, i) => {
    const found = moments.find(m => isMonth(m, i + 1));
    return found || createPlaceholder(i + 1);
  });

  return (
    <motion.div className="flex gap-2 overflow-x-auto">
      {months.map((month, idx) => (
        <MesversarioCard key={idx} moment={month} month={idx + 1} />
      ))}
    </motion.div>
  );
}
```

---

## 5️⃣ Busca e Filtros Avançados

### Quando Implementar

Após backend ter índices de busca.

### Novos Filtros

```typescript
// useFilters.ts extension
export interface FilterCriteriaAdvanced extends FilterCriteria {
  // Novos:
  dateRange?: { from: string; to: string };
  location?: string;
  hasVideo?: boolean;
  hasPhoto?: boolean;
  minAge?: number;
  maxAge?: number;
  searchText?: string;
}
```

### UI

```
Modal de Filtros Avançados
├─ Intervalo de Data (date picker)
├─ Localização (geocoding)
├─ Apenas Vídeos
├─ Apenas Fotos
├─ Idade Min/Max
└─ Busca de Texto

// No FilterChips:
[+] "Mais filtros" → abre modal
```

### Código

```typescript
// Em MomentsScreen.tsx
const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

<motion.button
  onClick={() => setShowAdvancedFilters(true)}
  className="px-3 py-1 rounded-full text-xs"
>
  [+] Mais filtros
</motion.button>;

{
  showAdvancedFilters && (
    <AdvancedFiltersModal
      onApply={(criteria) => {
        applyAdvancedFilters(criteria);
        setShowAdvancedFilters(false);
      }}
      onClose={() => setShowAdvancedFilters(false)}
    />
  );
}
```

---

## 6️⃣ Gestos Avançados

### Swipe Lateral Entre Cards

Implementação:

```typescript
// Em TimelineCard.tsx
const [touchStartX, setTouchStartX] = useState(0);

const handleTouchStart = (e: React.TouchEvent) => {
  setTouchStartX(e.touches[0].clientX);
};

const handleTouchEnd = (e: React.TouchEvent) => {
  const endX = e.changedTouches[0].clientX;
  const diff = touchStartX - endX;

  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      onNextMoment?.(); // swipe left
    } else {
      onPrevMoment?.(); // swipe right
    }
  }
};
```

### Parallax ao Scroll

```typescript
// Em TimelineCard.tsx
const [scrollY, setScrollY] = useState(0);

useEffect(() => {
  const handleScroll = () => setScrollY(window.scrollY);
  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

<motion.img
  style={{ y: scrollY * 0.5 }} // parallax effect
/>;
```

---

## 7️⃣ Compartilhamento com Privacidade

### Grupos de Compartilhamento

```typescript
// Estender Moment
export interface Moment {
  // ... existing
  shareGroups?: {
    groupId: string;
    groupName: string; // "Avós", "Padrinhos", etc
    canComment?: boolean;
    canDownload?: boolean;
    expiresAt?: string;
  }[];
}

// UI no fullscreen viewer:
// [🔗 Compartilhar] → Modal com:
// - Selecionar grupo
// - Permissões (comentar, baixar)
// - Expiração (7d, 30d, nunca)
```

---

## 8️⃣ Análises & Estatísticas

### Dashboard de Momentos

```typescript
// Novo hook: useMomentStats
export function useMomentStats(moments: Moment[]) {
  return {
    total: moments.length,
    byChapter: { ... },
    byMonth: { ... },
    avgPhotosPerMoment: ...,
    mostActiveMonth: ...,
    favoriteChapter: ...,
  };
}

// Renderizar no topo de MomentsScreen:
// Boxes mostrando:
// - Total de momentos: 42
// - Capítulo mais ativo: Primeiras Vezes (15)
// - Mês mais ativo: Outubro 2024
```

---

## 9️⃣ Temas & Personalização

### Cores de Capítulos Customizáveis

```typescript
// Estender Chapter interface
export interface Chapter {
  // ... existing
  customColor?: string;
  customIcon?: string;
}

// UI em Perfil → Editar Capítulo:
// - Color Picker
// - Emoji Picker para ícone
```

---

## 🔟 Offline-First Completo

### Service Worker

```typescript
// Cacher momentos para uso offline
navigator.serviceWorker.register("/sw.js").then((reg) => {
  // Sync momentos ao reconectar
});

// IndexedDB para dados offline
import { openDB } from "idb";

export const db = await openDB("baby-book", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("moments")) {
      db.createObjectStore("moments", { keyPath: "id" });
    }
  },
});
```

---

## 📊 Roadmap Recomendado

### Phase 1 (Semana 1)

- [ ] Duplicação de momentos
- [ ] Favoritos com persistência
- [ ] Toast feedback melhorado

### Phase 2 (Semana 2)

- [ ] Compartilhamento básico (link)
- [ ] Série de mêsversários
- [ ] Busca de texto

### Phase 3 (Semana 3)

- [ ] Filtros avançados
- [ ] Gestos avançados (parallax)
- [ ] Análises básicas

### Phase 4 (Semana 4)

- [ ] Privacidade/Grupos compartilhamento
- [ ] Temas customizáveis
- [ ] Offline-first

---

## 🎯 Prioridade Alta (Rápido)

1. **Duplicação** (30 min)
2. **Favoritos** (1h)
3. **Série Mêsversários** (2h)

---

**Implementações futuras não comprometem MVP atual! 🚀**
