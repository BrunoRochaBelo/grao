# 🤖 Copilot Instructions for AI Agents

## Visão Geral

Este projeto é um álbum digital interativo para bebês, composto por um **frontend React + Vite** (pasta raiz, `src/`) e um **backend FastAPI** (fora deste repositório, mas documentado no `README.md`). O frontend simula dados e persistência local, permitindo navegação e testes completos sem backend.

## Estrutura e Fluxos Principais

- **Navegação:** Controlada por stack em `src/App.tsx`. Telas principais: Home, Galeria, Capítulos, Detalhes, Formulários, Saúde, Família, Perfil.
- **Dados:** Simulados e persistidos via `localStorage` usando utilitários de `src/lib/mockData.ts`.
- **Componentização:**
  - `src/components/ui/`: componentes base (botão, input, etc.)
  - `src/components/shared/`: cards, listas, avatares reutilizáveis
  - `src/features/`: telas e fluxos por domínio (ex: `chapters`, `moments`, `health`)
- **Design System:** Tokens e temas em `src/styles/globals.css`.
- **Hooks e Contextos:** Estado de tema em `src/lib/theme-context.tsx`. Dados e ações em hooks locais.

## Convenções e Padrões

- **Dados mock:** Use e expanda funções de `src/lib/mockData.ts` para CRUD e simulação de fluxo.
- **Persistência:** Sempre sincronize alterações relevantes no estado com o `localStorage`.
- **Acessibilidade:** Componentes UI seguem padrões de foco e toque mínimo (≥44px).
- **Animações:** Use Motion para transições suaves e Sonner para feedback visual.
- **Testes:** Não há testes automatizados no frontend; priorize testes manuais e clareza de fluxo.

## Workflows de Desenvolvimento

- **Build local:**
  ```bash
  npm install
  npm run dev
  # Acesse http://localhost:3000
  ```
- **Build produção:**
  ```bash
  npm run build
  ```
- **Adição de funcionalidades:**
  - Documente novas features em `src/FEATURES.md`.
  - Siga a estrutura de pastas por domínio em `src/features/`.
- **Design tokens:** Edite apenas `src/styles/globals.css` para temas e cores.

## Integrações e Pontos de Atenção

- **Backend:** Endpoints e modelo de dados documentados no `README.md`.
- **Exportação:** Fluxo de exportação de álbum é simulado; integração real depende do backend.
- **Privacidade:** Dados sensíveis são mockados, mas siga boas práticas de privacidade.

## Exemplos de Padrões

- Para adicionar um novo momento:
  1. Use funções de `mockData.ts` para criar e persistir.
  2. Atualize o estado global/contexto se necessário.
  3. Sincronize com `localStorage`.
- Para criar um novo componente UI:
  1. Adicione em `src/components/ui/`.
  2. Siga padrões de acessibilidade e tokens de design.

Consulte sempre `README.md` e `src/FEATURES.md` para detalhes de funcionalidades e roadmap.
