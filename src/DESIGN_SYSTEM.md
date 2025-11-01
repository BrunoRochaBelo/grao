# 🎨 Design System & UI/UX Guidelines

## 📋 Visão Geral

Este documento descreve as melhorias e padrões de UI/UX implementados no projeto **Livro do Bebê**. Todas as mudanças seguem boas práticas de acessibilidade (WCAG AA), responsividade e design mobile-first.

---

## 🎯 Princípios de Design

1. **Leveza & Clareza** - Interface limpa com hierarquia visual clara
2. **Coerência** - Padrões consistentes em todo o app
3. **Acessibilidade** - Suporte a leitura, foco, contraste (WCAG AA)
4. **Responsividade** - Funciona perfeitamente em todos os dispositivos
5. **Touch-friendly** - Mínimo 44px para áreas interativas
6. **Performance** - Animações suaves (60fps) e transições fluidas

---

## 🎨 Tokens de Design

### Tipografia

| Uso              | Tamanho                     | Peso           | Line-Height |
| ---------------- | --------------------------- | -------------- | ----------- |
| H1 (Titles)      | 2.5rem / 2rem (mobile)      | 700 (bold)     | 1.2         |
| H2 (Subtitles)   | 2rem / 1.5rem (mobile)      | 700 (bold)     | 1.3         |
| H3 (Sections)    | 1.5rem / 1.25rem (mobile)   | 600 (semibold) | 1.4         |
| H4 (Subheadings) | 1.25rem / 1.125rem (mobile) | 600 (semibold) | 1.4         |
| Body             | 1rem                        | 400 (normal)   | 1.6         |
| Body Small       | 0.875rem                    | 400 (normal)   | 1.5         |
| Label            | 0.9375rem                   | 500 (medium)   | 1.5         |
| Caption          | 0.75rem                     | 500 (medium)   | 1.5         |

**Font Stack:** System font stack (`ui-sans-serif, system-ui, sans-serif`)

### Espaçamento (4px base unit)

| Token        | Value          | Uso             |
| ------------ | -------------- | --------------- |
| `--space-1`  | 0.25rem (4px)  | Micro spacing   |
| `--space-2`  | 0.5rem (8px)   | Small gaps      |
| `--space-3`  | 0.75rem (12px) | Inline spacing  |
| `--space-4`  | 1rem (16px)    | Base padding    |
| `--space-6`  | 1.5rem (24px)  | Section spacing |
| `--space-8`  | 2rem (32px)    | Large sections  |
| `--space-10` | 2.5rem (40px)  | Major sections  |
| `--space-12` | 3rem (48px)    | Page spacing    |

### Border Radius

| Token          | Value          | Uso                      |
| -------------- | -------------- | ------------------------ |
| `--radius-sm`  | 0.5rem (8px)   | Subtle corners           |
| `--radius-md`  | 0.75rem (12px) | Inputs, small components |
| `--radius-lg`  | 1rem (16px)    | Cards, buttons           |
| `--radius-xl`  | 1.25rem (20px) | Featured cards           |
| `--radius-2xl` | 1.5rem (24px)  | Large containers         |

### Cores

#### Modo Claro

- **Background:** `#f7f5ff` (light lavender)
- **Foreground:** `#241c3d` (dark purple)
- **Primary:** `#6855ff` (vibrant purple)
- **Secondary:** `#ffe4f4` (light pink)
- **Success:** `#2fba88` (mint green)
- **Warning:** `#f8a94f` (warm orange)
- **Destructive:** `#f25c6b` (red)

#### Modo Escuro

- **Background:** `#0a0810` (very dark purple)
- **Foreground:** `#f5f3ff` (light lavender)
- **Primary:** `#a29dff` (bright lavender)
- **Secondary:** `#2c1f35` (dark pink)
- **Success:** `#4dd8a4` (bright mint)
- **Warning:** `#ffc26d` (golden)
- **Destructive:** `#ff8a95` (light red)

### Sombras

| Nível | Light Mode                                | Dark Mode                     |
| ----- | ----------------------------------------- | ----------------------------- |
| XS    | `0 1px 2px rgba(0,0,0,0.05)`              | `0 1px 2px rgba(0,0,0,0.3)`   |
| SM    | `0 1px 3px rgba(0,0,0,0.1)`               | `0 1px 3px rgba(0,0,0,0.4)`   |
| MD    | `0 4px 6px rgba(0,0,0,0.1)`               | `0 4px 6px rgba(0,0,0,0.4)`   |
| LG    | `0 10px 15px rgba(0,0,0,0.1)`             | `0 10px 15px rgba(0,0,0,0.4)` |
| XL    | `0 20px 25px rgba(0,0,0,0.1)`             | `0 20px 25px rgba(0,0,0,0.4)` |
| Soft  | Special ambient shadow for elevated cards | Enhanced for dark mode        |

---

## 🔘 Componentes

### Button

#### Variantes

- **default** - Primary action (bg-primary)
- **destructive** - Dangerous action (bg-red)
- **outline** - Secondary action (border + transparent)
- **secondary** - Tertiary action (bg-secondary)
- **ghost** - Subtle action (hover background only)
- **link** - Text link style

#### Tamanhos

- **sm** - `h-9` para ações secundárias
- **default** - `h-11` para ações primárias (touch-friendly)
- **lg** - `h-12` para destaque principal
- **icon** - `h-11 w-11` para ícones apenas
- **icon-sm** - `h-9 w-9` para ícones secundários

#### Comportamento

- Mínimo 44px (touch-friendly)
- Transição suave em 150ms
- Estados: default, hover, active, focus, disabled
- Feedback visual claro em modo dark

### Input

- Altura: `h-11` (44px, touch-friendly)
- Padding: `px-3.5 py-2.5`
- Border: 1px solid `var(--border)`
- Focus ring: 2px solid `var(--ring)`
- Transição: 150ms

### Textarea

- Altura mínima: `min-h-24` (96px)
- Mesmo styling que Input
- Auto-expand com CSS (field-sizing-content)

### Label

- Font weight: 600 (semibold)
- Color: `var(--foreground)`
- Margin bottom: auto
- Sempre acima do input relacionado

### Badge

- Border radius: `rounded-full` (pill-shaped)
- Padding: `px-3 py-1.5`
- Font size: `text-xs`
- Font weight: 600 (semibold)
- Variantes: default, secondary, destructive, outline, success, warning

### Switch

- Altura: `h-6`
- Largura: `w-11`
- Transição suave: 200ms
- Thumb: 5px com shadow
- Estados bem definidos (checked/unchecked)

### Checkbox

- Tamanho: `h-5 w-5`
- Border: 2px
- Rounded: 6px
- Icon check: 16px

### Radio

- Tamanho: `h-5 w-5`
- Border: 2px
- Border radius: full (circular)
- Inner dot: 10px

### Progress

- Altura: `h-2.5`
- Border radius: `rounded-full`
- Indicador: gradient (primary to primary-light)
- Transição: 500ms smooth

### Avatar

- Tamanho: `size-10` (padrão)
- Border: 2px `var(--border)`
- Shadow: `shadow-sm`
- Fallback: gradient background

### Select

- Trigger: similar a Input com chevron
- Content: dropdown com animação suave
- Item: hover background com check icon
- Min height: 44px (touch-friendly)

---

## 📱 BottomNav (Melhorias)

### Layout

- **Fixed position** na base da tela
- **Altura:** 80px + gap
- **Glassmorphism** com backdrop blur
- **FAB central** elevado -40px da base

### Componentes

1. **Tabs** (Home, Moments, Notifications, Profile)

   - Min width: 56px
   - Min height: 44px
   - Ativo: underline animado em baixo
   - Transição suave com spring animation

2. **FAB (Floating Action Button)**

   - Tamanho: 64px
   - Gradient background
   - Rotação ao expandir
   - Opções: Blank Moment, Template Moment, Letter/Capsule

3. **FAB Menu**
   - Abre com overlay semi-transparent
   - Items com staggered animation
   - Fechar ao clicar em item ou overlay

### Estados

- **Default:** Icon + label, cor muted
- **Active:** Icon + label, cor primary + underline
- **Hover:** Escala leve e background subtle
- **Tap:** Escala 0.95 com feedback imediato

---

## ♿ Acessibilidade

### Mínimos Requeridos

✅ **Touch targets:** Mínimo 44px x 44px (WCAG AAA)  
✅ **Contraste:** Ratio 4.5:1 para texto normal (WCAG AA)  
✅ **Focus visible:** Outline em 2px com offset  
✅ **Aria labels:** Em todos os botões e inputs interativos  
✅ **Keyboard navigation:** Tab order lógico  
✅ **Color not only:** Informações não transmitidas só por cor

### Modo Escuro

- Contraste aumentado automaticamente
- Cores mais brilhantes para manutenção WCAG AA
- Sombras mais profundas

---

## 🎬 Animações

### Transições

```css
/* Padrão para mudanças de estado */
transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);

/* Para scale/opacity */
transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);

/* Para sombras */
box-shadow: 0 {offset} {blur} {spread} {color};
```

### Efeitos Motion.js

- **Scale on tap:** 0.92-0.98
- **Rotate on expand:** 45deg (FAB)
- **Stagger children:** 0.06s per item
- **Spring damping:** 20-22 (bouncy, friendly)
- **Stiffness:** 250-300 (snappy)

---

## 🚀 Performance

### Otimizações

- Lazy load de telas com Suspense
- CSS contido em CSS variables (sem bloat)
- Motion.js hardware-accelerated
- Debounce/throttle em scroll/resize
- Image optimization (considerar WebP)

### Targets

- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

---

## 📐 Breakpoints

```css
/* Mobile-first approach */
- Mobile: < 640px (default)
- SM: ≥ 640px
- MD: ≥ 768px
- LG: ≥ 1024px
- XL: ≥ 1280px
```

---

## 🎯 Checklist de Uso

### Ao criar novo componente

- [ ] Usar tokens CSS variables
- [ ] Implementar modo dark
- [ ] Testar contraste (WCAG AA)
- [ ] Min height 44px para touch
- [ ] Focus visible com outline
- [ ] Transição suave 150ms
- [ ] Responsivo em mobile
- [ ] Sem hover em mobile (usar active)
- [ ] Testes manuais em real device

### Ao criar nova tela

- [ ] Máximo 100% viewport width
- [ ] Padding safe area (mobile)
- [ ] Scroll sem overlays
- [ ] Bottom nav spacing (pb-24)
- [ ] Loading state
- [ ] Empty state
- [ ] Error state
- [ ] Animação entrada (fade/slide)
- [ ] Scroll para topo ao voltar

---

## 🔗 Referências

- WCAG 2.1 AA: https://www.w3.org/WAI/WCAG21/quickref/
- Material Design 3: https://m3.material.io/
- Apple Human Interface Guidelines: https://developer.apple.com/design/human-interface-guidelines/
- Radix UI: https://www.radix-ui.com/
- Motion.js: https://motion.dev/

---

## 📝 Changelog

### v1.0 (Atual)

**Implementado:**

- ✅ Design System completo com tokens CSS
- ✅ Componentes UI padronizados e acessíveis
- ✅ BottomNav refatorada (fixed, glassmorphism, FAB melhorado)
- ✅ Tipografia responsiva com breakpoints
- ✅ Modo dark/light com contraste WCAG AA
- ✅ Animações suaves com Motion.js
- ✅ Touch-friendly em todos os interativos (min 44px)
- ✅ Melhorias em espaçamento e sombras

**Próximos passos:**

- [ ] Auditar e testar todas as telas
- [ ] Implementar loading/empty/error states globais
- [ ] Refinar animations timing
- [ ] Adicionar más práticas documentation
- [ ] Screenshots/demos das mudanças
