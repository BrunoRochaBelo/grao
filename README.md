# Grão — Livro do Bebê (Front-end)

Aplicativo web para transformar memórias da infância em um diário colaborativo, bonito e seguro. Este README documenta a visão do produto, a stack e as diretrizes técnicas da camada **front-end** que consome a API descrita no [monorepo da plataforma](https://github.com/orgs/grao-livrodobebe) (FastAPI).

---

## Visão Geral

O Livro do Bebê permite que familiares registrem **Momentos** em diferentes formatos (texto, foto, vídeo, áudio), organizem essas memórias em **Capítulos** personalizados e acompanhem **Séries** recorrentes (ex.: mêsversário). O front-end é responsável por entregar uma experiência fluida, acessível e segura para:

- Criar e editar Momentos com templates dinâmicos.
- Navegar por Capítulos (visões filtradas) com filtros avançados.
- Configurar e acompanhar Séries (recorrências).
- Compartilhar memórias com familiares através de links protegidos.
- Controlar privacidade, membros e notificações.

### Princípios de UX

1. **Primeiro mobile** (layouts responsivos a partir de 320px).
2. **Feedback imediato** (optimistic UI, skeletons, toasts).
3. **Acessibilidade** (WCAG 2.1 AA, navegação por teclado, aria-labels, contraste ≥ 4.5).
4. **Internacionalização** (pt-BR como idioma padrão, infraestrutura pronta para en-US/es-ES).
5. **Confiança e privacidade** (indicadores de visibilidade, revisão fácil de compartilhamentos).

---

## Stack

### Front-end

| Camada                | Tecnologia / Racional                                                                 |
| --------------------- | -------------------------------------------------------------------------------------- |
| **Framework**         | [Next.js 14](https://nextjs.org/) com App Router — SSR/SSG, roteamento aninhado e SEO. |
| **Linguagem**         | TypeScript 5 — tipagem estática e DX consistente.                                      |
| **UI**                | Tailwind CSS + Radix UI + design tokens do time de produto.                            |
| **Estado remoto**     | TanStack Query (React Query) com persistência em IndexedDB.                            |
| **Estado local**      | Zustand para dados de UI (modais, filtros em edição).                                  |
| **Formulários**       | React Hook Form + Zod (validação compartilhada com backend).                           |
| **Upload de mídia**   | Uppy + presigned URLs da API (S3/MinIO).                                               |
| **Mapas & geocoding** | Mapbox GL JS + API de geocodificação reversa (quando habilitada pelo backend).         |
| **Charts**            | Recharts para curvas de crescimento e comparativos.                                   |
| **i18n**              | next-intl (mensagens carregadas por namespace).                                        |
| **Autenticação**      | OAuth2/OIDC PKCE → tokens armazenados em cookies HTTPOnly (rotas protegidas).          |

### Qualidade & Tooling

- **Gerenciador de pacotes:** `pnpm`.
- **Lint/format:** ESLint (config custom + `@next/eslint-plugin-next`), Prettier e Stylelint.
- **Tipagem:** `tsc --noEmit` em CI.
- **Tests unitários e de componentes:** Jest + Testing Library + MSW.
- **Visual Regression e E2E:** Playwright (execução por projeto e em CI headless).
- **Design System:** Storybook 8 com testes interativos (`@storybook/test-runner`).
- **Commits:** Conventional Commits + Husky + lint-staged.
- **CI/CD:** GitHub Actions (lint → test → build → preview deploy em Vercel).

### Integrações externas

- **API principal:** FastAPI (REST v1) hospedada no monorepo da plataforma. Endpoints `moments`, `chapters`, `series`, `media`.
- **Observabilidade:** Sentry (front), LogRocket (session replay opcional) e PostHog (analytics orientada a produto).
- **Feature flags:** LaunchDarkly (delimitação por segmento de usuário).

---

## Arquitetura do Front

```bash
src/
  app/                    # Roteamento Next.js (App Router)
    (auth)/               # Login, registro, convite
    (dashboard)/          # Rotas autenticadas (layout com guard)
      moments/
      chapters/
      series/
      settings/
    api/                  # Rotas Next para proxy/controladores edge
  features/
    moments/
      components/
      hooks/
      services/
      validations/
    chapters/
    series/
    shared/
  lib/
    api/                  # Clientes REST gerados (OpenAPI)
    analytics/
    auth/
    date/
    upload/
  styles/
    globals.css
    tokens.css
  config/
    env.ts                # Tipagem das variáveis
  tests/
    e2e/
    mocks/
  pages/preview/          # Conteúdo estático legado (se necessário)
public/
  icons/
  locales/
```

### Convenções

- **Components by feature:** cada feature possui entrada pública `features/<feature>/index.ts` expondo hooks, componentes e serviços.
- **UI primitives:** exportadas de `features/shared/ui` e documentadas no Storybook.
- **Estilização:** Tailwind (utility-first) + CSS Modules opcionais para casos complexos.
- **Data fetching:** hooks `useMomentsQuery`, `useMomentMutation` encapsulam TanStack Query.
- **Erro padrão:** toasts contextuais e fallback pages (`app/error.tsx`, `app/(dashboard)/error.tsx`).
- **Acessibilidade:** seguir checklist do Storybook + `eslint-plugin-jsx-a11y`.

---

## Integração com a API

- O contrato é gerado a partir do `openapi.json` do backend (`pnpm api:generate`).
- Autenticação via OAuth PKCE → callback em `/auth/callback`. Tokens de acesso (JWT) residem em cookie HTTPOnly e são renovados por refresh token via rota `/auth/refresh` (API).
- Requisições autenticadas passam por um client central `createApiClient` que injeta cabeçalhos (`Authorization`, `If-None-Match`, `If-Match`).
- Uploads grandes usam presigned URL: front obtém URL pela API (`POST /media/uploads`), envia arquivo direto ao S3/MinIO e, ao finalizar, confirma com `PATCH /media/uploads/{id}`.
- SSE/WebSocket (quando disponível) acompanha progresso de jobs (`/jobs/stream`).

### Cache e sincronização

- TanStack Query + persistência no `IndexedDB` (`PersistQueryClientProvider`).
- Revalidação automática quando tab volta ao foco ou conexão restabelece.
- Mutations com optimistic update respeitando ETag (rollback em conflito 412).

---

## Configuração de Ambiente

Crie um arquivo `.env.local` com as variáveis mínimas:

```bash
NEXT_PUBLIC_API_URL=https://api.grao.dev
NEXT_PUBLIC_SENTRY_DSN=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID=
STORYBOOK_BASE_API_URL=http://localhost:8000
```

Variáveis sensíveis (client secret, DSNs) são injetadas via `Vercel Environment Variables` ou `GitHub Actions secrets`.

---

## Scripts (pnpm)

| Comando                  | Descrição                                            |
| ------------------------ | ---------------------------------------------------- |
| `pnpm install`           | Instala dependências.                                |
| `pnpm dev`               | Inicia servidor Next.js em `http://localhost:3000`.  |
| `pnpm lint`              | Executa ESLint, Stylelint e `tsc --noEmit`.          |
| `pnpm test`              | Executa Jest + Testing Library com cobertura.       |
| `pnpm test:e2e`          | Executa Playwright (precisa da API em `localhost`).  |
| `pnpm storybook`         | Sobe Storybook em `http://localhost:6006`.           |
| `pnpm build`             | Gera build de produção (`.next/`).                   |
| `pnpm api:generate`      | Regenera clientes a partir do OpenAPI do backend.   |
| `pnpm analyze`           | Análise de bundle (`next build --profile`).          |

> _Observação:_ scripts podem variar conforme a implementação. Atualize esta tabela ao adicionar/remover comandos.

---

## Roadmap do Front

- [ ] Implementar autenticação com OAuth + PKCE.
- [ ] Concluir feature Moments (CRUD completo com upload assíncrono).
- [ ] Construir biblioteca de componentes compartilhados (Storybook).
- [ ] Implementar Capítulos (filtros salvos, ordenação e compartilhamento).
- [ ] Implementar Séries com calendário e lembretes.
- [ ] Revisar acessibilidade (audit Lighthouse ≥ 95).
- [ ] Adicionar dashboards de crescimento com gráficos responsivos.
- [ ] Integração completa com feature flags (LaunchDarkly/PostHog Experiments).

---

## Contribuição

1. Crie uma issue descrevendo claramente o problema/feature.
2. Abra uma branch `feature/<descrição-curta>` ou `fix/<descrição>`.
3. Execute `pnpm lint` e `pnpm test` antes do PR.
4. Use Conventional Commits (`feat:`, `fix:`, `chore:`, ...).
5. Abra PR com descrição detalhada, checklist e screenshots (quando UI mudar).

---

## Licença

MIT — consulte `LICENSE` (a ser adicionado junto com o código-fonte).

