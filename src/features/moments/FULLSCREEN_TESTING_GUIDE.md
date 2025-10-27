# 🧪 Guia de Testes - Full-Screen Viewer

## 📱 Ambiente de Testes

### Plataformas

- [ ] iOS Safari (iPhone 12+)
- [ ] Android Chrome (Pixel 6+)
- [ ] Desktop Chrome/Firefox (Windows/Mac)
- [ ] Tablet (iPad Pro, Samsung Galaxy Tab)

### Dispositivos Recomendados

- **Mobile:** iPhone 13+, Pixel 6+
- **Tablet:** iPad Pro 11", Galaxy Tab S7
- **Desktop:** 1920x1080, 2560x1440

---

## 🎯 Cenários de Teste

### 1. Abertura do Visualizador

#### Teste 1.1: Double-tap em Mídia

**Passos:**

1. Na tela de Momentos, localize um momento com múltiplas mídias
2. Faça double-tap rápido em qualquer mídia do TimelineCard
3. Observe resultado

**Esperado:**

- ✅ Modal fullscreen abre suavemente (fade + scale 0.2s)
- ✅ Mídia é exibida no centro
- ✅ Todas as informações aparecem corretamente na barra inferior
- ✅ Botão X (close) visível no topo direito
- ✅ Fundo preto translúcido com blur

**Critério de Aceitação:** A animação é suave e sem lag

---

#### Teste 1.2: Abertura com Informações Completas

**Passos:**

1. Abra um momento com todos os dados preenchidos:
   - Data de criação
   - Capítulo
   - Tags
   - Localização
2. Verifique barra inferior

**Esperado:**

- ✅ Data formatada corretamente (ex: "15 Jan 2024")
- ✅ Idade calculada corretamente (ex: "6 meses")
- ✅ Capítulo com cor e ícone correto
- ✅ Tags exibidas com prefixo "#"
- ✅ Localização com ícone 📍
- ✅ Botões Edit, Share, Delete visíveis

**Critério de Aceitação:** Todas as informações são legíveis e sem truncamento

---

### 2. Navegação entre Mídias

#### Teste 2.1: Swipe Lateral (Left) - Próxima Mídia

**Passos:**

1. Abra visualizador com momento de múltiplas mídias (≥2 mídias)
2. Posicione no meio da tela
3. Faça swipe para esquerda (pelo menos 50px)
4. Repita até última mídia

**Esperado:**

- ✅ Mídia muda suavemente (fade + scale 0.2s)
- ✅ Counter atualiza (ex: "1/3" → "2/3")
- ✅ Vibração no dispositivo (~10ms)
- ✅ Swipes menores que 50px NÃO funcionam
- ✅ Na última mídia, swipe não funciona

**Critério de Aceitação:** Haptic feedback perceptível, transição sem lag

---

#### Teste 2.2: Swipe Lateral (Right) - Mídia Anterior

**Passos:**

1. Abra visualizador (não na primeira mídia)
2. Faça swipe para direita (pelo menos 50px)
3. Verifique navegação

**Esperado:**

- ✅ Vai para mídia anterior
- ✅ Counter diminui
- ✅ Vibração ocorre
- ✅ Na primeira mídia, swipe não funciona

**Critério de Aceitação:** Direção correta, feedback consistente

---

#### Teste 2.3: Navegação via Botões (◄ ►)

**Passos:**

1. Abra visualizador
2. Clique/tap no botão ► (próxima) várias vezes
3. Clique/tap no botão ◄ (anterior) várias vezes

**Esperado:**

- ✅ Navega corretamente
- ✅ Vibração em cada clique
- ✅ Counter atualiza
- ✅ Botões desabilitados nas extremidades (ou sem efeito)

**Critério de Aceitação:** Sem lag, haptic feedback presente

---

#### Teste 2.4: Media Counter

**Passos:**

1. Abra visualizador
2. Navegue entre todas as mídias
3. Verifique counter em cada posição

**Esperado:**

- ✅ Counter formato correto: "X / Y" (ex: "1 / 3")
- ✅ Atualiza em tempo real
- ✅ Nunca excede total de mídias
- ✅ Sempre começar de 0 ou 1 (confirmar formato)

**Critério de Aceitação:** Counter sempre correto

---

### 3. Zoom e Pinch-to-Zoom

#### Teste 3.1: Pinch-to-Zoom In (aumentar)

**Passos (Mobile):**

1. Abra visualizador
2. Posicione dois dedos na mídia
3. Afaste-os (pinch out) lentamente
4. Observe zoom progressivo

**Esperado:**

- ✅ Zoom aumenta suavemente
- ✅ Máximo 3x (não ultrapassa)
- ✅ Imagem não pixela
- ✅ Dica "Duplo-tap para resetar zoom" aparece (quando scale > 1)
- ✅ Nenhuma vibração no pinch

**Critério de Aceitação:** Zoom smooth, máximo 3x, dica visível

---

#### Teste 3.2: Pinch-to-Zoom Out (diminuir)

**Passos (Mobile):**

1. Primeiro, zoom in (scale > 1)
2. Posicione dois dedos na mídia
3. Aproxime-os (pinch in)
4. Reduza até escala 1

**Esperado:**

- ✅ Zoom diminui suavemente
- ✅ Mínimo 1x
- ✅ Dica desaparece (quando scale = 1)

**Critério de Aceitação:** Zoom suave, volta ao normal

---

#### Teste 3.3: Reset Zoom (Double-tap)

**Passos (Mobile):**

1. Zoom in (scale > 1)
2. Dica "Duplo-tap para resetar zoom" aparece
3. Double-tap na mídia

**Esperado:**

- ✅ Scale volta para 1
- ✅ Animação suave
- ✅ Dica desaparece

**Critério de Aceitação:** Reset imediato, animação suave

---

#### Teste 3.4: Zoom Máximo Enforcement

**Passos:**

1. Zoom in progressivamente
2. Tente ir além de 3x com gesto forte

**Esperado:**

- ✅ Zoom máximo permanece 3x
- ✅ Sem comportamento de "bounce" excessivo
- ✅ Suave mesmo com gesto forte

**Critério de Aceitação:** Máximo 3x rigidamente enforçado

---

### 4. Close Gestures e Interações

#### Teste 4.1: Swipe Down para Fechar

**Passos:**

1. Abra visualizador
2. Faça swipe para baixo (pelo menos 100px)
3. Observe

**Esperado:**

- ✅ Visualizador fecha suavemente
- ✅ Animação de saída suave (fade + scale reverse)
- ✅ Volta para MomentsScreen
- ✅ Swipes menores que 100px NÃO fecham

**Critério de Aceitação:** Gesto responsivo, transição suave

---

#### Teste 4.2: Click no Botão X (Close)

**Passos:**

1. Abra visualizador
2. Clique/tap no botão X (topo direito)

**Esperado:**

- ✅ Visualizador fecha imediatamente
- ✅ Animação de saída suave
- ✅ Volta para MomentsScreen

**Critério de Aceitação:** Click responsivo

---

#### Teste 4.3: Click no Fundo (Background)

**Passos:**

1. Abra visualizador
2. Clique/tap no fundo preto (fora da mídia)

**Esperado:**

- ✅ Visualizador fecha
- ✅ Botões de ação NÃO disparam (stop propagation)

**Critério de Aceitação:** Fechamento simples, sem efeitos colaterais

---

### 5. Botões de Ação

#### Teste 5.1: Botão Editar (Edit)

**Passos:**

1. Abra visualizador
2. Clique no botão ✏️ Editar

**Esperado:**

- ✅ Callback `onEdit()` é disparado
- ✅ Tela de edição do momento abre
- ✅ Visualizador permanece aberto enquanto tela de edit está ativa (verificar UX)
- ✅ Dados do momento são pre-preenchidos

**Critério de Aceitação:** Edit flow completo, callback funciona

---

#### Teste 5.2: Botão Compartilhar (Share)

**Passos:**

1. Abra visualizador
2. Clique no botão 🔗 Compartilhar

**Esperado:**

- ✅ Callback `onShare()` é disparado
- ✅ Sistema de share do dispositivo abre (ou modal de compartilhamento)
- ✅ Pré-preenchido com info do momento

**Critério de Aceitação:** Share flow completo

---

#### Teste 5.3: Botão Excluir (Delete)

**Passos:**

1. Abra visualizador
2. Clique no botão 🗑️ Excluir

**Esperado:**

- ✅ Callback `onDelete()` é disparado
- ✅ Confirmação é mostrada antes de deletar
- ✅ Após confirmação, momento é removido
- ✅ Visualizador fecha

**Critério de Aceitação:** Delete com confirmação funciona

---

### 6. Responsividade e Performance

#### Teste 6.1: Mobile Portrait

**Passos:**

1. Abra em mobile modo portrait
2. Teste todos os gestos

**Esperado:**

- ✅ Layout correto
- ✅ Botões acessíveis (≥44px hit target)
- ✅ Sem elementos fora da tela
- ✅ Barra inferior legível

**Critério de Aceitação:** Sem scrolling necessário

---

#### Teste 6.2: Mobile Landscape

**Passos:**

1. Gire dispositivo para landscape
2. Teste gestos

**Esperado:**

- ✅ Layout adaptado corretamente
- ✅ Sem quebras de layout
- ✅ Mídia dimensionada corretamente

**Critério de Aceitação:** Responsive completo

---

#### Teste 6.3: Desktop (Mouse)

**Passos:**

1. Abra em desktop
2. Teste todos os botões e clicks
3. Hover effects

**Esperado:**

- ✅ Todos os elementos clicáveis
- ✅ Hover effects visíveis
- ✅ Sem comportamentos de touch necessários
- ✅ Cursor muda para pointer

**Critério de Aceitação:** Desktop UX completo

---

#### Teste 6.4: Performance / Lag

**Passos:**

1. Abra visualizador
2. Faça swipes rápidos consecutivos
3. Zoom rápido
4. Observe fps

**Esperado:**

- ✅ Sem lag visível
- ✅ 60fps durante animações
- ✅ Transições suaves mesmo com gestos rápidos
- ✅ Sem travamentos

**Critério de Aceitação:** Performance fluida em todos os cenários

---

### 7. Casos Extremos

#### Teste 7.1: Momento com Uma Única Mídia

**Passos:**

1. Abra momento com apenas 1 mídia
2. Tente fazer swipe lateral

**Esperado:**

- ✅ Swipes não funcionam (ou sem efeito)
- ✅ Botões ◄ ► desabilitados ou sem efeito
- ✅ Counter mostra "1 / 1"
- ✅ Close gestures ainda funcionam

**Critério de Aceitação:** Sem erros, comportamento correto

---

#### Teste 7.2: Momento sem Tags

**Passos:**

1. Abra momento sem tags
2. Verifique barra inferior

**Esperado:**

- ✅ Seção de tags não é exibida
- ✅ Sem espaço vazio
- ✅ Layout se ajusta corretamente

**Critério de Aceitação:** Layout limpo sem tags

---

#### Teste 7.3: Momento sem Localização

**Passos:**

1. Abra momento sem localização
2. Verifique barra inferior

**Esperado:**

- ✅ Localização não é exibida
- ✅ Sem espaço vazio entre data/idade e capítulo

**Critério de Aceitação:** Layout compacto sem localização

---

#### Teste 7.4: Momento com Capítulo Sem Cor

**Passos:**

1. Abra momento com capítulo
2. Verifique badge de capítulo

**Esperado:**

- ✅ Capítulo sempre tem cor (fallback)
- ✅ Ícone e nome exibidos
- ✅ Legível sobre fundo

**Critério de Aceitação:** Badge visível e legível

---

### 8. Acessibilidade

#### Teste 8.1: Hit Targets Mínimos

**Passos:**

1. Em mobile, tente clicar em cada botão
2. Teste hit target (≥44x44px)

**Esperado:**

- ✅ Botões fáceis de clicar
- ✅ Sem erros de clique acidental
- ✅ Espaçamento adequado entre botões

**Critério de Aceitação:** Sem frustração ao clicar

---

#### Teste 8.2: Contraste de Cores

**Passos:**

1. Observe cores em diferentes ambientes
2. Teste em modo escuro (se aplicável)

**Esperado:**

- ✅ Texto legível sobre fundo
- ✅ Botões visíveis
- ✅ Contraste WCAG AA mínimo

**Critério de Aceitação:** Legível em diferentes ambientes

---

#### Teste 8.3: Focus Indicators (Desktop)

**Passos:**

1. Navegue com Tab no desktop
2. Observe focus rings nos botões

**Esperado:**

- ✅ Focus indicators visíveis
- ✅ Ordem tab lógica
- ✅ Sem focus presos

**Critério de Aceitação:** Navegação keyboard completa

---

### 9. Integração

#### Teste 9.1: Navegação de Volta para Timeline

**Passos:**

1. Abra visualizador
2. Feche (qualquer método)
3. Verifique se volta para timeline

**Esperado:**

- ✅ Volta para MomentsScreen
- ✅ Scroll position preservado (se possível)
- ✅ Filtros mantidos

**Critério de Aceitação:** Navegação fluida

---

#### Teste 9.2: Estado Persistido

**Passos:**

1. Abra e edite um momento
2. Reabra visualizador
3. Verifique dados atualizados

**Esperado:**

- ✅ Dados sincronizados
- ✅ LocalStorage atualizado
- ✅ Mudanças persistem

**Critério de Aceitação:** Dados consistentes

---

## 📋 Checklist de QA

### Pré-Testes

- [ ] Build compilado sem erros
- [ ] Nenhuma warning no console
- [ ] Todos os imports corretos
- [ ] TypeScript valida sem erros

### Gestos (Mobile)

- [ ] Swipe left (próxima)
- [ ] Swipe right (anterior)
- [ ] Swipe down (fechar)
- [ ] Pinch zoom in
- [ ] Pinch zoom out
- [ ] Double-tap reset

### Botões (Mobile + Desktop)

- [ ] Botão X (close)
- [ ] Botão ◄ (anterior)
- [ ] Botão ► (próxima)
- [ ] Botão Edit
- [ ] Botão Share
- [ ] Botão Delete

### Informações

- [ ] Data correta
- [ ] Idade correta
- [ ] Localização (se tiver)
- [ ] Capítulo com cor
- [ ] Tags exibidas
- [ ] Counter atualizado

### Performance

- [ ] Sem lag visível
- [ ] Animações suaves (60fps)
- [ ] Sem memory leaks
- [ ] Tempo de abertura < 300ms

### Edge Cases

- [ ] Momento com 1 mídia
- [ ] Momento sem tags
- [ ] Momento sem localização
- [ ] Imagens grandes
- [ ] Rápidos gestos consecutivos

### Acessibilidade

- [ ] Hit targets ≥44px
- [ ] Contraste OK
- [ ] Focus indicators (desktop)
- [ ] Teclado navegável

### Plataformas

- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Desktop Chrome
- [ ] Desktop Firefox
- [ ] Tablet responsivo

---

## 🐛 Bug Template

Se encontrar um problema, use este template:

```
### Bug: [TÍTULO]
**Plataforma:** [iOS/Android/Desktop]
**Dispositivo:** [iPhone 13/Pixel 6/Chrome Windows]
**Passos para Reproduzir:**
1. ...
2. ...
3. ...

**Resultado Esperado:**
[O que deveria acontecer]

**Resultado Atual:**
[O que está acontecendo]

**Screenshots/Video:**
[Anexe se possível]

**Severidade:** [Crítico/Alto/Médio/Baixo]
```

---

## ✅ Aprovação

**QA Iniciado em:** ****\_\_\_****  
**QA Concluído em:** ****\_\_\_****  
**Tester:** ****\_\_\_****  
**Status:** ❌ Falhou / 🟡 Com Issues / ✅ Aprovado

**Assinado em:** ****\_\_\_**** / ****\_\_\_**** / ****\_\_\_****
