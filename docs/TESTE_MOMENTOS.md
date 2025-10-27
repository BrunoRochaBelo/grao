# 🧪 Guia de Testes - Seção "Momentos"

## 🚀 Como Testar Localmente

### 1. Iniciar Servidor

```bash
npm run dev
# Abre em http://localhost:3001
```

### 2. Acessar a Tela de Momentos

- Clique no ícone 🖼️ "Momentos" na **barra inferior**
- Ou navegue via **Home** (se houver link)

---

## ✅ Checklist de Testes

### Header & Timeline

- [ ] Título mostra "📖 História de Aurora" (nome do bebê)
- [ ] Subtítulo mostra "Desde 17/03/2024 até hoje"
- [ ] Momentos agrupados por mês (ex: "Outubro 2025")
- [ ] Ordenação: mais recente → mais antigo
- [ ] Divisores de mês com linha sutil
- [ ] Timeline scrollável verticalmente

### Filtros (Chips)

- [ ] Chips de capítulos aparecem (Gestação & Chegada, Primeiras Vezes, etc.)
- [ ] Clique em capítulo → chip fica azul/destaque
- [ ] Se houver pessoas nos momentos → chips aparecem (👤)
- [ ] Se houver tags → chips aparecem (#tag)
- [ ] Botão "⭐ Favoritos" aparece
- [ ] **Importante:** Botão "✕ Limpar" NÃO aparece inicialmente
- [ ] Depois de clicar em 1+ chip → botão "✕ Limpar" aparece com fade-in
- [ ] Clique em "✕ Limpar" → todos os chips voltam ao estado neutro
- [ ] Feedback toast: "Voltando à linha completa do tempo ⏳"

### Cards de Momento

- [ ] Cada card mostra:
  - Capa (foto ou ícone emoji)
  - Ícone do tipo (💉 Vacina, 🎂 Mêsversário, etc.)
  - Pílula de capítulo colorida (ex: "🌱 Gestação & Chegada")
  - Data formatada (ex: "17/03/2024")
  - Idade (ex: "0 dias")
  - Título do momento
  - Preview do texto (1-2 linhas com "...")
- [ ] Se há múltiplas fotos → aparece "+2" no canto
- [ ] Se há pessoas → aparecem como chips pequenos (Mamãe, Papai)
- [ ] Hover effect: levemente mais claro

### Expansão de Legenda (Tap Simples)

- [ ] Clique NO CARD (não na imagem) → legenda expande
- [ ] Expansão é suave (slide down ~200ms)
- [ ] Legenda completa aparece (noteLong)
- [ ] Tags aparecem como badges (#tag)
- [ ] Aparecem botões: "✏️ Editar", "🔗 Compartilhar", "🗑️ Excluir"
- [ ] Clique em "↑ Fechar" → legenda colapsa suavemente

### Duplo-Tap em Imagem (Fullscreen)

- [ ] Duplo-tap NA IMAGEM → abre visualizador fullscreen
- [ ] Fundo preto (~95% de opacidade)
- [ ] Imagem ampliada e centralized
- [ ] Contador mostra "1 / X" (número de fotos)
- [ ] Barra inferior aparece com:
  - Data + idade
  - Pílula de capítulo
  - Tags (se houver)
  - Botões: "✏️", "🔗", "🗑️"

### Gestos no Fullscreen

- [ ] **Swipe Lateral (esquerda/direita):** Navega entre fotos do mesmo momento
  - Cada troca: haptic feedback (vibração 10ms)
  - Contador atualiza
  - Setas ← → aparecem nas extremidades
- [ ] **Pinch-to-Zoom:** Zoom até 3x
  - Zoom começa em 1x
  - Máximo 3x
  - Zoom é suave (inércia)
- [ ] **Duplo-Tap em Imagem:** Reseta zoom para 1x
- [ ] **Swipe Down:** Fecha visualizador
  - Animação: fade out
  - Retorna à timeline

### Menu Contextual (Long-Press)

- [ ] Clique longo (500ms) no card → menu aparece
- [ ] Posição: próximo ao cursor
- [ ] Menu tem 3 opções:
  1. "✏️ Editar" (texto escuro)
  2. "🔗 Compartilhar" (texto escuro)
  3. "🗑️ Excluir" (texto em VERMELHO)
- [ ] Clique em "✏️ Editar" → abre formulário de edição
- [ ] Clique em "🔗 Compartilhar" → toast "Funcionalidade em breve 🔗"
- [ ] Clique em "🗑️ Excluir" → abre modal de confirmação

### Exclusão (Modal de Confirmação)

- [ ] Modal aparece com:
  - Título: "Excluir momento?"
  - Descrição: "Esta ação não pode ser desfeita..."
  - Botões: "Cancelar" e "Excluir" (vermelho)
- [ ] Clique em "Cancelar" → modal fecha, card permanece
- [ ] Clique em "Excluir" → card desaparece
- [ ] Feedback toast: "Lembrança removida com carinho 💭"
- [ ] Se era o último momento do mês → divisor do mês some

### Placeholders Vazios (Modo Filtrado)

- [ ] Clique em UMA capítulo (ex: "Saúde & Crescimento")
- [ ] Se há momentos não preenchidos daquele capítulo → aparecem cards vazios
- [ ] Card vazio tem:
  - Contorno tracejado (border-dashed)
  - Ícone central (ex: 📏)
  - Nome (ex: "Primeira Medida")
  - Pílula cinza "○ Não registrado"
  - Texto: "Toque para registrar este momento"
- [ ] Clique no placeholder → abre formulário de criação
- [ ] Modal de filtros fecha automaticamente

### Estado Vazio (Sem Momentos)

- [ ] Se nenhum momento foi criado → aparece:
  - Ícone 📸 grande
  - Texto: "Nenhum momento registrado"
  - Dica: "Comece a registrar os momentos especiais de Aurora"

---

## 🎮 Testes de Interação Avançada

### Múltiplos Filtros

- [ ] Clique em Capítulo A → carrega A
- [ ] Clique em Capítulo B (mantendo A) → carrega A + B
- [ ] Clique em Pessoa X → carrega A + B + X
- [ ] Clique em "✕ Limpar" → volta ao original

### Performance

- [ ] Scroll não trava
- [ ] Filtros respondem em < 100ms
- [ ] Transições suaves (60fps)
- [ ] Sem memory leaks (DevTools)

### Responsividade

- [ ] **Mobile (< 640px):**
  - Cards ocupam full-width
  - Chips empilham bem
  - Filtros rolam lateralmente
- [ ] **Tablet (640-1024px):**
  - Cards com padding
  - Layout ajustado
- [ ] **Desktop (> 1024px):**
  - max-width 896px (centrado)
  - Ótimo espaçamento

### Acessibilidade

- [ ] Botão "Voltar" é clicável (min 44px)
- [ ] Contraste de texto adequado
- [ ] Tap targets ≥ 44px
- [ ] Sem erros de console
- [ ] Navegação lógica

---

## 🐛 Cenários de Erro a Testar

### Edge Cases

- [ ] Sem bebê selecionado → mostra mensagem
- [ ] Sem momentos → estado vazio apropriado
- [ ] Momento com 1 foto → sem setas de navegação fullscreen
- [ ] Momento com 10+ fotos → contador e swipe funcionam
- [ ] Filtro que não retorna resultados → "Nenhum resultado"
- [ ] Deletar último momento → timeline vazia

### Console

- [ ] Abra DevTools (F12)
- [ ] Aba Console: **nenhum erro vermelho**
- [ ] Aba Network: carregamentos rápidos
- [ ] Aba Performance: animações suaves (60fps)

---

## 📸 Screenshots Esperados

### Tela Principal

```
┌─────────────────────────────────────┐
│  ← Voltar                           │ (header fixo)
│  📖 História de Aurora              │
│  Desde 17/03/2024 até hoje          │
├─────────────────────────────────────┤
│ [Gestação] [Primeiras] [Saúde]  ✕  │ (filtros)
├─────────────────────────────────────┤
│ ─── Outubro 2025 ───                │ (divisor)
│                                     │
│  ┌─────────────────────────────┐   │
│  │  🌱  Pílula do Capítulo     │   │
│  │  ┌─────────────────────┐    │   │
│  │  │  [Foto Aurora]      │    │   │
│  │  │  🎂                 │    │   │
│  │  └─────────────────────┘    │   │
│  │  17/03/2024 · 0d · Hospital │   │
│  │  Aurora nasceu às 8h30       │   │
│  │  Mamãe Papai                 │   │
│  │  ↓ Ver mais                  │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  ... (mais cards)           │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## ✨ Validação Final

- [ ] Todos os testes acima passaram
- [ ] Sem erros de console
- [ ] Performance excelente (suave)
- [ ] Responsivo em todos os breakpoints
- [ ] Feedback de UX claro e ternurento
- [ ] Tonalidade condiz com "álbum vivo"
- [ ] Pronto para demonstração! 🎉

---

## 🔗 Links Úteis

- **Código:** `/src/features/moments/`
- **Documentação:** `/docs/WIRELFLOW_MOMENTOS_IMPLEMENTACAO.md`
- **Tipos:** `/src/lib/types.ts`
- **Dados Mock:** `/src/lib/mockData.ts`

---

**Bom teste! 🌸**
