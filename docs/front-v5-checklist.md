# Checklist de Refatoração Frontend — Release v5.0

Este checklist organiza as mudanças de design da v5.0 em ações objetivas para orientar a implementação no frontend.

## Design Geral

### 1. Navegação inferior flutuante
- [ ] Criar componente `AppBottomBar` fixo e flutuante (`bottom: 20px`, centralizado) com `rounded-full`, `backdrop-blur-xl`, `bg-white/80` (dark: `bg-zinc-900/80`) e sombra ampla.
- [ ] Incluir ícones na ordem: `🏠 Início`, `🌸 Momentos`, `➕ Novo`, `🔔 Sussurros`, `👶 Jornada`.
- [ ] Garantir estados: inativo `text-zinc-400`; ativo `text-violet-600` + `scale(1.05)`.
- [ ] Configurar botão central "➕" com 28px, `bg-gradient-to-br from-violet-500 to-fuchsia-500`, `scale(1.15)`.
- [ ] Implementar comportamento de esconder ao rolar para baixo e reaparecer ao rolar para cima (threshold 32px; debounce 120ms).

### 2. Design system (tokens)
- [ ] Aplicar base de grid/spacing de 8px; containers com `padding-inline: 16px`; seções com espaçamento mínimo de 24px.
- [ ] Ajustar raios: cards 20–24px; chips 12px; modais 24px; imagens com `overflow-hidden`.
- [ ] Atualizar tokens tipográficos: título de seção 20/28 Semibold; título de card 16/20 Semibold; corpo 14–16 Regular; meta/chips 13–14 Medium.
- [ ] Configurar paleta light: `--bg:#FAFAFA`, `--card:#FFFFFF`, `--text:#1C1C1C`, `--primary:#6D28D9` (ou `#4F46E5`), `--muted:#E6E6E6`, `--success:#22C55E`, `--warning:#F59E0B`, `--danger:#EF4444`.
- [ ] Configurar paleta dark aconchegante: `--bg:#0E1114`, `--card:#1B1F23`, `--text:#E6E6E6` + acentos pastéis (lavanda/azul bebê/menta) com contraste suave.
- [ ] Padronizar ícones (traço fino) com biblioteca Lucide/Material para: baby, calendar, image, users, heart, syringe, tooth, map-pin, tag, smile, mic, share-2, pencil, plus, filter, clock, lock, link, download, star, chart-line, bell, moon, user, help-circle.

### 3. Movimento e feedback
- [ ] Definir transições de 150–220ms (fade/slide) com leve overshoot (10%).
- [ ] Aplicar carrosséis com snap suave e indicadores (dots/thumbs).
- [ ] Padronizar toasts: duração 2.5s; animação `toast-slide-down` em 400ms.
- [ ] Criar feedback de toque com animação `tap-feedback` (scale 0.98→1.00 em 150ms).
- [ ] Registrar animações nomeadas: `tap-feedback`, `expand-card`, `swipe-dismiss`, `celebrate`, `toast-slide-down`, `pulse-placeholder`.

### 4. Acessibilidade & toque
- [ ] Garantir alvos táteis ≥44px e contraste AA.
- [ ] Respeitar `prefers-reduced-motion` em animações.
- [ ] Manter labels claros, ordem lógica de foco e `aria-label` em botões icônicos.
- [ ] Validar layout responsivo mobile-first e suportar até 3 colunas em tablets quando aplicável.

### 5. Privacidade (UI)
- [ ] Exibir badge nos cards: 🔒 Privado, 👨‍👩‍👧 Família (default), 🔗 Público (link com expiração).
- [ ] Implementar modal de compartilhamento com opções de expiração (24h/7d/30d/permanente) e ação de copiar link.

### 6. Performance
- [ ] Adotar lazy load de imagens com LQIP/blur-up e skeletons em carregamento.
- [ ] Virtualizar listas grandes; evitar reflows utilizando `aspect-ratio` e alturas previsíveis.
- [ ] Padronizar debounce de scroll/resize em 120ms.

### 7. Componentes base reutilizáveis
- [ ] Criar/atualizar componentes: `AppBottomBar`, `HeroContextual`, `SuggestionCard` (Marco, Mêsversário, Lacuna, Celebração), `WidgetCard` (sparkline opcional), `MemoryCard` (masonry + expand inline), `MediaViewer` (full-screen), `TemplateLauncher` (sheet do “➕”), `FormShell` (header “voltar/salvar”), `PeoplePicker`, `EmojiSlider`, `ChipFiltro`, `Toast`.

### 8. Critérios de aceite gerais
- [ ] Validar comportamento da barra flutuante com scroll.
- [ ] Garantir dark mode coerente em telas e modais.
- [ ] Assegurar carrosséis funcionais em cards e visualizador de mídia.
- [ ] Exibir skeletons durante carregamento.
- [ ] Mostrar estado de privacidade configurável em momentos.

## Tela: Início (Home v5.0)

### 1. Estrutura geral
- [ ] Remover cabeçalho global da Home e manter scroll vertical com seções: `Hero Contextual → Sugestões Inteligentes → Widgets de Status → Memórias Recentes → Atalho Linha do Tempo`.
- [ ] Aplicar margens laterais de 16px e espaçamento consistente de 16–20px entre blocos.

### 2. Hero Contextual
- [ ] Centralizar avatar (96–120px), nome + idade (ex.: “Aurora · 1a 7m”), cidade e narrativa dinâmica com 1–2 frases.
- [ ] Exibir linha meta `📍 Cidade · 23°C ☁️` (ocultar temperatura se indisponível).
- [ ] Utilizar fundo gradiente por período do dia: manhã `from-amber-50 to-orange-50`, tarde `from-sky-50 to-blue-50`, noite `from-indigo-50 to-purple-50` (intensidade reduzida no dark).
- [ ] Garantir altura mínima `min-h-[40vh]` responsiva.
- [ ] Suprir dados: nome, data de nascimento (idade), cidade; opcionais: última foto, clima; fallback textual sempre presente.

### 3. Sugestões Inteligentes (carrossel horizontal)
- [ ] Renderizar título “✨ Para você” (`text-sm uppercase tracking-wide text-zinc-400`).
- [ ] Limitar visualização a 3 cards simultâneos.
- [ ] Implementar variantes do `SuggestionCard`:
  - Marco Esperado (violeta) com janela típica, botões “Já aconteceu!” (abre form de Marco) e “Ainda não” (adiar 7 dias; após 3 adiamentos, silenciar).
  - Mêsversário Próximo (rosa) com CTA “Criar álbum do mês” (abre template) e “Dispensar”.
  - Lacuna Temporal (menta) quando ≥3 dias sem registro, CTA “+ Capturar agora” (abre Momento Rápido).
  - Celebração Retroativa (âmbar) com CTAs “Ver memória” / “Escrever reflexão”.
- [ ] Habilitar swipe horizontal para navegar e swipe vertical para dispensar com animação `swipe-dismiss` + snackbar “Desfeito?” (5s).

### 4. Widgets de Status (grid 2×2)
- [ ] Inserir título “📊 Panorama”.
- [ ] Construir grid 2×2 com cards tapáveis (`bg-white dark:bg-zinc-800 rounded-2xl p-4 shadow-sm`) contendo ícone no canto e tipografia destacada para números.
  - Crescimento: peso/altura atuais, variação (ex.: `↗ +0,3kg`) e sparkline 30 dias.
  - Vacinas: status (“12 de 15 · 🟢 Em dia” ou “2 pendentes”) com CTA “Ver/Registrar”.
  - Sono: média 7 dias (ex.: `9h20/noite`) + sequência de emojis semanais.
  - Próximo compromisso: texto (ex.: “Consulta 18m em 8 dias”) ou fallback “Nenhum compromisso” com CTA “Adicionar”.

### 5. Memórias Recentes (masonry)
- [ ] Adicionar título “🌸 Últimos dias”.
- [ ] Construir layout masonry com CSS columns (`columns: 2; gap: 16px;`) preservando proporções das imagens.
- [ ] Estruturar `MemoryCard`: imagem no topo, rodapé com data curta, texto `clamp-3`, pílulas de Capítulo/tags e badge de privacidade.
- [ ] Implementar expansão inline com animação `expand-card`: carrossel de mídias, texto completo, meta (data, local, pessoas) e ações (✏️ editar, 🔗 compartilhar, 🗑️ excluir). Aplicar `backdrop-blur` leve no restante.
- [ ] Permitir fechar tocando fora ou via botão “X” circular.
- [ ] Carregar memórias em lotes com placeholders LQIP e otimizar desempenho.

### 6. Atalho Linha do Tempo
- [ ] Inserir card contextual após a 4ª/5ª memória com texto “📖 Ver linha do tempo completa →”.
- [ ] Estilizar com gradiente sutil (`from-violet-500/10 to-fuchsia-500/10`), `border border-violet-200` e `rounded-2xl p-4`.
- [ ] Ao tocar, navegar para a tela “Linha do Tempo Completa”.

### 7. Ações globais da Home
- [ ] Expor ação “+ Novo” apenas via barra flutuante central (abrir `TemplateLauncher`).
- [ ] Padronizar toasts: “Momento salvo ✨”, “Rascunho salvo”, “Excluído” com opção de desfazer (5s).

### 8. Estados especiais
- [ ] Empty state: Hero com nome/idade; Sugestões com CTAs iniciais (“Adicionar Nascimento”, “História do Nome”); Memórias vira card vazio com CTA “Adicionar sua primeira memória”.
- [ ] Offline: banner “Você está offline” + fila de envios pendentes (ícone de nuvem com contador).
- [ ] Erro: card de erro com botão “Tentar novamente”.

### 9. Telemetria mínima
- [ ] Instrumentar eventos: `home_hero_view`, `suggestion_shown`, `suggestion_action`, `widget_open`, `memory_expand`, `memory_share`, `new_open`.
- [ ] Incluir campos: `bebê_id`, `idade_meses`, `tipo_card`, `action` (tap/dispense), `privacidade`.
- [ ] Respeitar consentimento/LGPD (opt-in nas preferências).

### 10. Critérios de aceite da Home
- [ ] Hero exibe nome + idade, narrativa dinâmica (com fallback) e gradiente conforme período.
- [ ] Sugestões exibem até 3 cards, ativam fluxos corretos e permitem dispensar respeitando janela.
- [ ] Widgets mostram dados resumidos e navegam para telas correspondentes.
- [ ] Memórias em masonry expandem inline com carrossel e ações.
- [ ] Atalho Linha do Tempo aparece após ≥4 memórias.
- [ ] Barra flutuante oculta/retorna conforme scroll; botão “➕” abre centro de criação.
- [ ] Garantir light/dark, acessibilidade AA, skeletons e toasts em todos os estados.
