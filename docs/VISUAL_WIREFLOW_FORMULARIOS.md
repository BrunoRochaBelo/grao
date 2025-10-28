# 🎨 WIRELFLOW VISUAL — MAPA INTERATIVO

## Estrutura Visual da Experiência do Usuário

```
┌─────────────────────────────────────────────────────────────┐
│                    🏠 HOMEPAGE / CAPÍTULOS                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [+ Adicionar] ──────────────┐                             │
│                              │                             │
│  📖 Capítulos               │                             │
│  ├─ 🏥 Saúde & Crescimento  │                             │
│  ├─ 🎂 Mêsversários         │                             │
│  ├─ 💌 Cartas & Cápsulas    │                             │
│  └─ 👨‍👩‍👧 Família            │                             │
│                              ↓                             │
└─────────────────────────────────────────────────────────────┘
                                │
                                ↓
                    ┌──────────────────────┐
                    │  Tela de Seleção     │
                    │  (FormTypeSelector)  │
                    ├──────────────────────┤
                    │ 🔍 Buscar...         │
                    │                      │
                    │ 🏥 SAÚDE             │
                    │ ├─ 📈 Crescimento    │
                    │ ├─ 💉 Vacina         │
                    │ └─ 😴 Humor          │
                    │                      │
                    │ 📸 MOMENTOS          │
                    │ └─ 📝 Nota Livre     │
                    │                      │
                    │ 👨‍👩‍👧 FAMÍLIA           │
                    │ └─ 🌳 Membro         │
                    │                      │
                    │ 💌 CARTAS            │
                    │ ├─ 💌 Carta/Futuro   │
                    │ └─ 🎂 Mêsversário    │
                    └──────────────────────┘
                                │
                    ┌───────────┴──────────┐
                    ↓                      ↓
        ┌──────────────────────┐  ┌──────────────────────┐
        │  FORMULÁRIO UNIVERSAL │  │  Fluxo Alternativo   │
        ├──────────────────────┤  ├──────────────────────┤
        │ ← Crescimento    💾  │  │ Nota Livre           │
        │   (piscando)         │  │ Template             │
        │ "Rascunho salvo      │  │ Registro Rápido      │
        │  às 14:22"           │  │                      │
        ├──────────────────────┤  └──────────────────────┘
        │                      │
        │ ┌──────────────────┐ │
        │ │ Data              │ │
        │ │ [selector] ✓      │ │
        │ ├──────────────────┤ │
        │ │ Peso (kg)         │ │
        │ │ [3.5________] ✓   │ │
        │ ├──────────────────┤ │
        │ │ Altura (cm)       │ │
        │ │ [50_________] ✓   │ │
        │ ├──────────────────┤ │
        │ │ Perímetro Cefal.  │ │
        │ │ [34_________]     │ │
        │ ├──────────────────┤ │
        │ │ ⚙️ Mais Opções ▼  │ │
        │ │   (Privacidade)   │ │
        │ └──────────────────┘ │
        │                      │
        │ [Scroll ↓]           │
        ├──────────────────────┤
        │ ┌──────────────────┐ │
        │ │ [Salvar]         │ │  ← Primário (lilás)
        │ │                  │ │
        │ │ Descartar        │ │  ← Texto (discreto)
        │ └──────────────────┘ │
        └──────────────────────┘
                    │
         ┌──────────┴──────────┐
         ↓                     ↓
    Salvar         Modal de Confirmação
    [enviando...]  ┌──────────────────┐
                   │ Descartar?       │
    (0.6s)         │ "Tem certeza que  │
    ✓ Toast        │  quer descartar  │
                   │  este rascunho?" │
                   │                  │
                   │ [Cancelar][Desc.]│
                   └──────────────────┘
         ↓
    Tela anterior
    (com atualização)
    Feedback: "Crescimento
    atualizado 📈"
```

---

## 🎯 Estados Visuais dos Campos

### Estado 1️⃣: Campo Vazio (Idle)

```
┌────────────────────────┐
│ Campo de texto         │  ← Label em posição normal
│ ______________________ │
└────────────────────────┘
```

### Estado 2️⃣: Campo com Foco

```
┌────────────────────────────┐
│  ↑ Campo de texto (pequeno)│  ← Label flutuante
│ ══════════════════════════ │  ← Borda lilás + brilho
│ escrever aqui...           │
└────────────────────────────┘
✨ Som suave (tap)
📱 Vibração leve (10ms)
```

### Estado 3️⃣: Campo Preenchido ✓

```
┌────────────────────────────┐
│  ↑ Campo de texto          │
│ ══════════════════════════ │  ← Borda verde
│ João da Silva              │
│                        ✓ │  ← Check verde
└────────────────────────────┘
```

### Estado 4️⃣: Campo com Erro ❌

```
┌────────────────────────────┐
│ 🔴 Campo obrigatório       │
│ ✗ ✗ ✗ ✗ ✗ ✗ ✗ ✗ ✗ ✗       │  ← Borda vermelha
│ [vazio]                    │
│                        ❌  │  ← X vermelho piscando
│ Preencha este campo!       │  ← Mensagem de erro
└────────────────────────────┘
📱 Vibração de erro (100ms)
🔊 Som de erro (220Hz)
```

---

## 💫 Emoji Slider — Humor do Dia

```
┌──────────────────────────────────────────────────┐
│ ← Volta                   Humor do Dia        💾 │
├──────────────────────────────────────────────────┤
│                                                  │
│ Como estava o humor?                             │
│                                                  │
│               😴  ← Seleção atual               │
│                                                  │
│ Cansado                                          │
│                                                  │
│  😄───😊───😐───😴───😠  ← Slider               │
│                  ▮ (thumb)                       │
│                                                  │
│ ┌──────────────────────────────────────────┐    │
│ │ Fundo anima para:  AZUL (cansado)        │    │
│ │ Antes era:         AMARELO (feliz)       │    │
│ │ Transição:         0.3s suave            │    │
│ └──────────────────────────────────────────┘    │
│                                                  │
│ Notas: ____________________________________      │
│        ____________________________________      │
│                                                  │
├──────────────────────────────────────────────────┤
│ [Salvar]  [Rascunho]  Descartar                  │
└──────────────────────────────────────────────────┘
```

---

## 🏥 Formulário de Vacina (com Select)

```
┌──────────────────────────────────────────┐
│ ← Registrar Vacina        💉          💾 │
├──────────────────────────────────────────┤
│                                          │
│ Nome da Vacina                           │
│ ┌──────────────────────────────────────┐ │
│ │ Selecione uma opção              ▼  │ │
│ └──────────────────────────────────────┘ │
│                    ↓ (ao clicar)         │
│ ┌──────────────────────────────────────┐ │
│ │ BCG                    ○             │ │
│ │ Hepatite B             ○             │ │
│ │ Rotavírus              ○             │ │
│ │ Pneumocócica           ⦿ (seleção)  │ │  ← Opções com emojis?
│ │ Poliomielite           ○             │ │
│ │ Tétano                 ○             │ │
│ │ Influenza              ○             │ │
│ │ Sarampo                ○             │ │
│ └──────────────────────────────────────┘ │
│                                          │
│ Data da Vacinação                        │
│ [2025-10-27] ✓                           │
│                                          │
│ Dose                                     │
│ [1ª dose        ] ✓                      │
│                                          │
│ [+ Mais campos...]                       │
│                                          │
└──────────────────────────────────────────┘
```

---

## 🎂 Tags & Multi-select (Pessoas)

```
┌──────────────────────────────────────────┐
│ Pessoas Envolvidas                       │
├──────────────────────────────────────────┤
│                                          │
│ [João] [Maria] [Avó] [+]                │
│   ×       ×      ×                       │
│                                          │
│ [Adicione uma tag...]_   [+]            │
│                                          │
│ Sugestões:                               │
│ - Pai                                    │
│ - Mãe                                    │
│ - Avó                                    │
│ - Tia                                    │
│                                          │
└──────────────────────────────────────────┘
```

---

## 🔒 Seletor de Privacidade (com Tooltips)

```
┌──────────────────────────────────────────┐
│ Privacidade                              │
├──────────────────────────────────────────┤
│                                          │
│ ☑ 🔒 Privado       ← Apenas você vê    │
│ ☐ 👥 Pessoas       ← Convidados         │
│ ☐ 🔗 Link          ← URL compartilhável │
│                                          │
└──────────────────────────────────────────┘
```

---

## 📱 Microinterações

### Som: Sucesso

```
Frequências: 440Hz + 554Hz
Duração: 200ms
Padrão: Tom maior (positivo)
```

### Som: Erro

```
Frequências: 220Hz
Duração: 300ms
Padrão: Tom menor (negativo)
```

### Vibração: Sucesso

```
Padrão: [50ms, 100ms, 50ms]
Significado: 3 pulsos rítmicos
```

### Vibração: Erro

```
Padrão: [100ms, 50ms, 100ms]
Significado: Forte, fraca, forte (alerta)
```

---

## 📊 Paleta de Cores

```
Primary (Lilás):
  Normal:   #A594F9
  Hover:    #8B7FE2
  Focus:    rgba(165, 148, 249, 0.2)

Success (Verde):
  Base:     #10B981
  Light:    rgba(16, 185, 129, 0.1)

Error (Vermelho):
  Base:     #EF4444
  Light:    rgba(239, 68, 68, 0.1)

Background:
  Light:    #FAFAFA
  Dark:     #1E1E24
  Cards:    #FFFFFF (light) / #2D2D35 (dark)

Border:
  Light:    #E5E7EB
  Dark:     #404049
```

---

## ✨ Transições & Animações

```
Label Flutuante:     200ms ease-out
Entrada de Modal:    spring(stiffness: 300)
Saída de Modal:      spring(damping: 30)
Fade entre Campos:   300ms ease-in-out
Pulse (validação):   2s repeat infinite
Shimmer (loading):   2s ease-linear repeat
Dissolução (erro):   600ms ease-out
```

---

## 🎯 Tamanhos & Acessibilidade

```
Touch Targets (Mínimo): 44x44px
  Botões:              56x56px (ideal)
  Checkboxes:          24x24px (com padding)

Tipografia:
  Title (H1):          24px bold
  Subtitle (H3):       14px medium
  Label:               12px regular
  Body:                14px regular
  Helper:              12px light
  Error:               12px regular (vermelho)

Espaçamento:
  Seções:              24px (gap vertical)
  Campos:              16px (gap vertical)
  Padding Container:   16px (h), 24px (v)
  Border Radius:       16px (cards), 12px (chips)
```

---

Este visual resume o wireflow completo! 🎨✨
