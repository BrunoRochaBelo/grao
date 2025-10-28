# 🌸 Seção Momentos - Guia Rápido de Uso

## 📍 Localização na Aplicação

**Navegação:** Barra inferior → ícone 🖼️ "Momentos"

---

## 🎯 O que é a Seção Momentos?

Uma **linha do tempo visual interativa** que funciona como um álbum de bebê digital. Cada momento (foto, vídeo ou nota) é exibido em cronologia, agrupado por mês, permitindo revisitar e explorar a história da infância.

---

## 🎮 Como Interagir

### **Gestos Principais**

| Gesto                          | Ação                     | Resultado                                          |
| ------------------------------ | ------------------------ | -------------------------------------------------- |
| **Tap (toque simples)**        | Toca no card             | Expande a legenda completa                         |
| **Duplo-tap na imagem**        | 2 toques rápidos na foto | Abre modo fullscreen                               |
| **Long-press (toque longo)**   | Mantém pressionado       | Abre menu contextual (Editar/Compartilhar/Excluir) |
| **Swipe lateral (horizontal)** | Desliza para lado        | Navega entre cards do mesmo mês                    |
| **Swipe down (vertical)**      | Desliza para baixo       | Fecha o modo fullscreen                            |
| **Pinch (2 dedos)**            | Afasta/aproxima dedos    | Zoom progressivo até 3x                            |

---

## 🔍 Filtros Disponíveis

No topo da tela, existem chips para filtrar momentos:

### **Chips de Filtro**

- **📚 Capítulos**: Filtra por capítulo (ex: "Saúde & Crescimento")
- **👥 Pessoas**: Mostra apenas momentos com pessoas selecionadas
- **🏷️ Tags**: Filtra por tag personalizada (ex: "feliz", "praia")
- **⏰ Período**: Filtra por faixa de idade
  - 0–3 meses
  - 3–6 meses
  - 6–12 meses
  - 1–2 anos
- **⭐ Favoritos**: Mostra apenas momentos destacados

### **Limpar Filtros**

Quando há filtros ativos, um botão **"✕ Limpar"** aparece com fade-in. Clique para resetar todos os filtros.

---

## 📋 Estrutura de um Card de Momento

```
┌─────────────────────────────────────┐
│  💉 Saúde & Crescimento              │ ← Ícone + Capítulo
├─────────────────────────────────────┤
│                                     │
│        [Foto/Vídeo do momento]      │
│                                     │
├─────────────────────────────────────┤
│ 12/10/2025 · 1a 2m 3d · São Paulo   │ ← Data · Idade · Local
│ "Primeira dose da vacina..."        │ ← Preview do texto
│ 👩 Avó Maria · 👨 Tio João         │ ← Pessoas relacionadas
│                                     │
│              ↓ Ver mais             │ ← Expande texto completo
└─────────────────────────────────────┘
```

---

## 🖼️ Modo Fullscreen

Aberto com **duplo-tap na imagem**.

```
┌─────────────────────────────────────┐
│ [X] [Título do Momento]             │ ← Header com fechar
│                                     │
│        [Imagem em zoom livre]       │
│                                     │
│        [Setas navegar se múltiplas] │
│                                     │
├─────────────────────────────────────┤
│ 1/3 · 12/10/2025 · 1a 2m 3d        │ ← Contador e dados
│ 💉 Saúde & Crescimento · #vacina   │ ← Capítulo e tags
│ ✏️ Editar · 🔗 Compartilhar · 🗑️   │ ← Ações
└─────────────────────────────────────┘
```

### **Controles no Fullscreen**

- **Swipe lateral**: Navega entre próxima/anterior mídia
- **Pinch**: Zoom de 1x até 3x com inércia suave
- **Swipe down**: Fecha o visualizador (com fade)
- **[X] Botão**: Fecha modo fullscreen

---

## 📱 Menu Contextual (Long-Press)

Mantendo o dedo pressionado em um card:

```
┌────────────────────┐
│ ✏️ Editar           │
│ 🔗 Compartilhar     │
│ 🗑️ Excluir          │ ← (Em vermelho)
└────────────────────┘
```

### **Ações**

- **✏️ Editar**: Abre o formulário para editar o momento
- **🔗 Compartilhar**: Abre opções de compartilhamento (link privado, PDF)
- **🗑️ Excluir**: Pede confirmação e remove o momento

---

## 📅 Agrupamento por Mês

A timeline é automaticamente agrupada por mês:

```
┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
│  Outubro 2025                      │
└─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
[Card 1: 15/10/2025]
[Card 2: 12/10/2025]
[Card 3: 10/10/2025]

┌─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
│  Setembro 2025                     │
└─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
[Card 1: 28/09/2025]
...
```

Ordem: **Mais recente primeiro** (top-down)

---

## ✨ Placeholders Vazios

Quando você filtra por um **capítulo específico**, aparecem cards vazios para momentos que ainda não foram registrados:

```
┌─────────────────────────────────────┐
│         💫                          │
│   Primeira Viagem                   │
│   ○ Não registrado                  │
│   Toque para registrar              │
└─────────────────────────────────────┘
```

Clique para abrir o formulário e registrar esse momento.

---

## 🎵 Feedback e Tonalidade

A seção Momentos usa tons afetuosos:

- ✅ Ao registrar: "Momento adicionado à história 🌸"
- ✅ Ao editar: "Atualização salva 🧸"
- ✅ Ao excluir: "Lembrança removida com carinho 💭"
- ✅ Ao limpar filtros: "Voltando à linha completa do tempo ⏳"

---

## 📊 Dados Disponíveis nos Cards

Cada momento mostra:

- **Título** do momento
- **Data** (formato: 12/10/2025)
- **Idade** do bebê naquele dia (1a 2m 3d)
- **Local** (se registrado)
- **Pessoas** relacionadas (avatares)
- **Capítulo** (pílula com cor)
- **Tags** personalizadas
- **Mídia** (1 ou mais fotos/vídeos)
- **Nota curta** (preview)
- **Nota longa** (expandível)

---

## 🔄 Sincronização com Navegação

- ✅ Voltar para Home: Limpa a seleção de fullscreen
- ✅ Trocar de aba: Mantém o histórico de filtros
- ✅ Adicionar novo momento: Timeline se atualiza automaticamente
- ✅ Editar momento: Posição se ajusta na timeline se data mudou

---

## 🎯 Dicas de Uso

1. **Explore por capítulo** para ver histórico de um tema (ex: Vacinações)
2. **Use filtro de idade** para reviver uma fase específica
3. **Marque como favorito** (⭐) os momentos especiais
4. **Compartilhe** momentos específicos com a família
5. **Use tags** para organizar temas (ex: "viagem", "festa", "hospital")

---

## 🚀 Próximas Funcionalidades

- [ ] Exportar álbum em PDF
- [ ] Compartilhamento via QR code
- [ ] Modo apresentação (slideshow)
- [ ] Anotações manuscritas
- [ ] Sincronização com outros dispositivos
- [ ] Análise de marcos e desenvolvimento

---

## 📝 Notas

- Todos os dados são salvos localmente (localStorage)
- Gestos funcionam em touch screens e trackpads
- Timeline otimizada para até 1000+ momentos
- Responsiva em desktop, tablet e mobile

**Divirta-se preservando as memórias! 🌸**
