# Grão — API do Livro do Bebê

> API do app **Livro do Bebê**. Modelo unificado (**tudo é Momento**) com **Templates**, **Capítulos** (visões filtradas) e **Séries** (recorrências).
> Foco em **usabilidade**, **segurança (LGPD)**, **exportabilidade** e **escala**.

---

## Sumário

* [Visão Geral](#visão-geral)
* [Stack](#stack)
* [Arquitetura do Sistema](#arquitetura-do-sistema)
* [Modelagem de Domínio](#modelagem-de-domínio)
* [Front-end (Aplicativo Livro do Bebê)](#front-end-aplicativo-livro-do-bebê)
* [Estrutura de Pastas (Blueprint por Feature)](#estrutura-de-pastas-blueprint-por-feature)
* [Configuração (env)](#configuração-env)
* [Rodando Localmente](#rodando-localmente)
* [Docker / Docker Compose](#docker--docker-compose)
* [Migrações (Alembic)](#migrações-alembic)
* [Testes](#testes)
* [Comunicação & Segurança (API)](#comunicação--segurança-api)
* [Segurança, LGPD & Privacidade](#segurança-lgpd--privacidade)
* [Endpoints (REST v1)](#endpoints-rest-v1)
* [Esquemas & Exemplos](#esquemas--exemplos)
* [Observabilidade](#observabilidade)
* [Roadmap](#roadmap)
* [Licença](#licença)
* [Contribuição](#contribuição)

---

## Visão Geral

O **Livro do Bebê** é um backend em Python (FastAPI) pensado para um diário moderno de memórias infantis. O conceito central é o **Momento** (como um post de rede social); templates aceleram o registro e **Capítulos** oferecem visões filtradas do mesmo feed (capítulos do livro). **Séries** lidam com recorrências (ex.: mêsversário) e mantêm o andamento de registros repetitivos.

### Diferenciais técnicos

* Campos flexíveis em `momento.fields` (JSONB) com **índices GIN** para consultas rápidas.
* Upload direto ao storage (S3/MinIO) via **presigned URL**.
* **Workers** (Celery) para tarefas pesadas (thumbnails, transcode, PDFs).
* Observabilidade pronta (logs JSON, Prometheus, OpenTelemetry, Sentry).
* **ETag/If-Match** para concorrência otimista e **If-None-Match** para cache de GETs.

---

## Stack

* **Python:** 3.12+
* **Web:** FastAPI + Uvicorn
* **ORM:** SQLAlchemy 2.x + Alembic
* **DB:** PostgreSQL 14+ (JSONB)
* **Cache/Rate-limit/Fila:** Redis
* **Jobs:** Celery (+ Redis)
* **Storage de mídia:** S3 compatível (AWS S3 / MinIO)
* **Imagens/Vídeos:** Pillow / FFmpeg
* **Auth:** OAuth2 + JWT (access/refresh), Argon2
* **Qualidade:** Ruff, Black, isort, mypy, pytest, pre-commit
* **Observabilidade:** Logs JSON, Prometheus, OpenTelemetry, Sentry

---

## Arquitetura do Sistema

### Camadas internas

Arquitetura **feature-first (blueprint)** com módulos organizados por domínio:

* **API** (APIRouter por feature): validação, autenticação, paginação, versionamento e ETag.
* **Services:** regras de negócio (criar Momento, anexar Série, cálculo de idade, estatísticas de crescimento).
* **Repositories:** persistência com SQLAlchemy.
* **Workers** (Celery): transcodificação/thumbnail, exportações (PDF) e notificações.
* **Storage:** integração com S3/MinIO via URLs assinadas.
* **Telemetry:** logging estruturado, métricas e tracing.

### Fronteiras

* api (stateless) · worker (jobs) · db (Postgres) · cache/queue (Redis) · object storage (S3/MinIO) · cdn (opcional).

---

## Modelagem de Domínio

### Entidades principais

* **User:** conta/autenticação e escopos.
* **Child:** criança; associação `User↔Child` (membros).
* **Moment** (antigo “Post”): unidade de conteúdo.
  * `id, child_id, occurred_at (tz/UTC), age_days, type, subtype, status {published|draft}`
  * `privacy {private|people|link}, people[] (referências), location {name, lat?, lng?}`
  * `medias[] (foto/vídeo/áudio/doc), short_text, long_text, tags[], markers{}`
  * `fields {…}, series_id?`
* **Media:** arquivo no S3/MinIO (`object_key`, `mime`, `size`, `thumb`, `duration?`).
* **Series:** recorrência (RRULE), progresso e ocorrências derivadas.
* **Chapter (Capítulo):** coleção/visão salva com filtros, `viewer` e `ordering`.
* **Template:** catálogo de tipos/subtipos e validações mínimas.
* **Person/Contact:** pessoa envolvida (para `people[]` nos Momentos).
* **Comment:** comentários/áudios em um Momento (opcional).
* **ShareLink:** link de compartilhamento com escopo/expiração/senha.
* **AuditLog:** trilha de auditoria.

> **Mudanças chave para alinhar ao front**
>
> * Renomeação pública: **Momento** (alias de Post) e **Capítulo** (alias de Shelf).
> * Novos campos: `subtype`, `status`, `privacy=people`, `markers{}`, `viewer` e `ordering` em Capítulo, `lat/lng` em `location`.
> * **ETag** (+ `updated_at`/`version`) para concorrência e cache.
> * **/moments** e **/chapters** como rotas canônicas (mantidos aliases `/posts` e `/shelves`).

---

## Front-end (Aplicativo Livro do Bebê)

### Visão geral do app

O aplicativo (mobile e web) entrega a experiência do **Livro do Bebê** para responsáveis, familiares e convidados. O foco é
registrar memórias com fluidez, manter tudo sincronizado entre dispositivos e respeitar as regras de privacidade definidas
no backend.

* **Onboarding guiado:** convite por e-mail/código, criação de perfil do responsável, seleção ou cadastro da criança.
* **Linha do tempo unificada:** feed infinito paginado (TanStack Query) com filtros rápidos (criança, tags, capítulos, séries,
  privacidade).
* **Registro orientado por templates:** formulários dinâmicos conforme `Moment.type/subtype`, preview de mídia e validação
  com feedback instantâneo.
* **Experiência colaborativa:** comentários por texto/áudio, menções a pessoas e compartilhamento controlado por links.
* **Acompanhamento de séries e capítulos:** visão dedicada para progresso de séries e curadoria dos capítulos favoritos.

### Stack do front

* **Base:** React Native (Expo) + TypeScript (monorepo com PNPM).
* **Web opcional:** Next.js 14 (App Router) reaproveitando o design system e hooks do mobile.
* **Data layer:** TanStack Query + React Query Persist Client (AsyncStorage/MMKV) para cache offline; Zustand para estado local
  simples.
* **Forms/validação:** React Hook Form + Zod (esquemas compartilhados com o backend via `packages/schemas`).
* **UI/Design system:** Tamagui + tokens semânticos (modo claro/escuro, tamanho de fonte responsivo, suporte a acessibilidade).
* **Internacionalização:** FormatJS (`@formatjs/intl`) com mensagens em `packages/i18n` (pt-BR e en-US inicialmente).
* **Autenticação:** Expo Auth Session + refresh silencioso de tokens e revogação remota.
* **Mídia:** Expo Image Picker/Camera + upload direto usando URLs assinadas do backend (resumo em [Integração com a API](#integração-com-a-api)).
* **Testes:** Jest + React Native Testing Library, Storybook para documentação visual e Detox (E2E em dispositivos reais/CI).
* **Qualidade:** ESLint, Prettier, TypeScript strict, lint-staged, Husky, commitlint + Conventional Commits.

### Organização do repositório (monorepo PNPM)

> Estrutura planejada. Os pacotes compartilham contratos com a API e o design system.

```bash
grao-frontend/
├── apps/
│   ├── mobile/            # Expo + React Native
│   ├── web/               # Next.js (SSR/SSG) opcional para familiares via navegador
│   └── storybook/         # Catálogo de componentes executável com web bundler
├── packages/
│   ├── ui/                # Design system (Tamagui) + tokens
│   ├── api-client/        # Client gerado via OpenAPI (openapi-typescript)
│   ├── schemas/           # Schemas Zod compartilhados (sincronizados com backend)
│   ├── auth/              # Hooks/contextos de sessão, renovação de tokens, guards
│   ├── intl/              # Mensagens i18n + utilitários
│   ├── analytics/         # Integração com Segment/Amplitude
│   └── testing/           # Utilitários de teste, mocks e providers
├── tooling/
│   ├── eslint-config/
│   └── tsconfig/
├── apps.json              # Configurações Expo
├── package.json
└── pnpm-workspace.yaml
```

### Design system & UX

* **Componentização total:** todos os componentes de UI vivem em `packages/ui` com documentação no Storybook.
* **Tokens semânticos:** espaçamentos, tipografia, cores e ícones definidos em `packages/ui/tokens.ts` e exportados para Figma
  (design tokens). Usar apenas nomes semânticos (`color.surfaceInverse`, `spacing.md`).
* **Acessibilidade:** contraste AA/AAA, suporte a Dynamic Type (mobile) e preferências de redução de movimento.
* **Microcopy consistente:** textos compartilhados no pacote `intl`, usando IDs descritivas (`moments.newMoment.cta`).
* **Feedback imediato:** loaders skeleton, shimmer e estado otimista para principais interações.

### Fluxos principais

1. **Onboarding & convites:** leitura de link mágico → verificação → aceite de termos/LGPD → escolha de perfil → preload de
   dados essenciais.
2. **Linha do tempo:** feed infinito, agrupado por dia, com filtros de capítulo, série, tags e pessoas; ETag para revalidação
   incremental.
3. **Novo Momento:** wizard com etapas para mídia, detalhes principais, campos dinâmicos (derivados do template) e revisão; suporte
   a rascunho offline.
4. **Capítulos:** listagem grid + detalhe com preview dos filtros, ações rápidas (fixar, compartilhar, duplicar).
5. **Séries:** cards mostrando progresso, checklist de ocorrências com quick actions para criar ou pular um momento.
6. **Upload de mídia:** compressão local (imagem/vídeo), upload multipart direto à URL assinada, callback de progresso e retry.
7. **Compartilhamento:** geração, visualização e revogação de `ShareLinks`; QR Code opcional para convidados.
8. **Configurações & privacidade:** centro de controle com exportação de dados, revogação de dispositivos e gestão de pessoas.

### Integração com a API

* **Autenticação:** fluxo `PKCE` + OAuth2; tokens armazenados com `SecureStore`/Keychain. Refresh automático com `401`.
* **Headers HTTP:** `If-None-Match` para GETs cacheáveis, `If-Match` em mutações com otimistic lock.
* **Serialização:** sempre usar o client gerado em `packages/api-client` para manter tipos sincronizados. Atualizar rodando
  `pnpm api-client:generate` após mudanças no `openapi.yaml`.
* **Paginação:** endpoints usam `page_size` + `cursor`; feed implementa `fetchNextPage` do TanStack Query.
* **Uploads:** 1) solicitar presigned (`POST /uploads/presign`), 2) enviar para storage, 3) confirmar com `POST /media`. Em caso de
  falha no passo 3, aplicar rollback com `DELETE /media/{id}`.
* **Erros & retries:** interpretar cabeçalhos `Retry-After` em `429`, fallback para fila offline se limite atingido.
* **Monitoramento:** enviar `x-client-version`, `x-platform` e `traceparent` (quando disponível) para correlação com observabilidade.

### Offline, cache e sincronização

* **Persistência do cache:** TanStack Query Persist com MMKV (Android/iOS) e IndexedDB (web) para leitura offline.
* **Fila de mutações:** gravar mutações pendentes em `AsyncStorage/mmkv` com replay e resolução por ETag ao reconectar.
* **Conflitos:** se `412 Precondition Failed`, exibir diff entre versão local e servidor e permitir mesclagem manual ou descartar.
* **Sincronização silenciosa:** background fetch (Expo Task Manager) para atualizar capítulos, séries e notificações.
* **Métricas:** logar latência de hidratação de cache e taxa de sucesso de replays.

### Observabilidade & suporte

* **Sentry:** captura de erros nativos/JS; cada release identifica commit e versionamento semântico (`1.4.0+104`).
* **Analytics:** Segment/Amplitude com eventos estruturados (`moment.created`, `series.progressUpdated`). Respeitar consentimento
  LGPD antes de ativar tracking.
* **Feature flags:** Expo Updates + LaunchDarkly (ou ConfigCat) para liberar features gradualmente.
* **Suporte in-app:** botão "Falar com o suporte" que abre Intercom/HubSpot, anexando `child_count`, `plan` e último `trace_id`.

### Build, testes e release

```bash
pnpm install
pnpm lint             # ESLint + TypeScript
pnpm test             # Jest + React Native Testing Library
pnpm test:e2e         # Detox (requere simulador/emulador configurado)
pnpm typecheck
pnpm storybook        # roda Storybook para validar UI
pnpm expo start       # desenvolvimento mobile (Expo Go ou emuladores)
pnpm web dev          # desenvolvimento web (Next.js)
```

* **CI:** GitHub Actions executa lint, testes unitários, E2E (em PRs críticos) e gera preview via Expo EAS Update.
* **Versionamento:** Changesets para gerar changelog automático e bump semântico. Cada release móvel dispara `eas build` seguido de
  `eas submit` (App Store / Play Store).
* **Distribuição interna:** usar `eas build --profile preview` e `eas update` para liberar builds OTA aos testers.

### Checklist de qualidade antes de publicar

1. Storybook sem regressões visuais (comparação via Chromatic/Visual Regression Testing).
2. Testes unitários/E2E passando + cobertura mínima de 80% em fluxos críticos (criar momento, upload, capítulo).
3. Auditoria de acessibilidade (axe) sem violações bloqueantes.
4. Pacote `api-client` regenerado com a versão da API que está sendo publicada.
5. Confirmar versões mínimas dos SOs suportados (iOS 15+, Android 8+), espaço em disco de build e notas de release.

---

## Estrutura de Pastas (Blueprint por Feature)

> Estrutura planejada. Alguns arquivos podem ser gerados futuramente conforme as features avancem.

```bash
.
├── README.md
├── .env.example
├── docker-compose.yml
├── Makefile
├── pyproject.toml
├── pre-commit-config.yaml
├── alembic.ini
├── app/
│   ├── main.py
│   ├── __init__.py
│   ├── core/
│   │   ├── config.py
│   │   ├── security.py
│   │   ├── errors.py
│   │   ├── logging.py
│   │   ├── pagination.py
│   │   ├── rate_limit.py
│   │   └── etag.py              # cálculo/validação de ETags
│   ├── db/
│   │   ├── session.py
│   │   ├── base.py
│   │   └── migrations/
│   │       ├── env.py
│   │       └── versions/
│   │           └── 2025_01_01_000001_init.py
│   ├── telemetry/
│   │   ├── tracing.py
│   │   └── metrics.py
│   ├── workers/
│   │   ├── celery_app.py
│   │   └── tasks/
│   │       ├── media_tasks.py
│   │       ├── export_tasks.py
│   │       └── notification_tasks.py
│   ├── storage/
│   │   ├── s3.py
│   │   └── local.py
│   ├── utils/
│   │   ├── time.py
│   │   ├── age.py
│   │   ├── ids.py
│   │   ├── sse.py
│   │   └── lgpd.py
│   └── features/
│       ├── auth/
│       │   ├── router.py
│       │   ├── service.py
│       │   ├── repo.py
│       │   ├── schemas.py
│       │   └── __init__.py
│       ├── children/
│       │   ├── router.py
│       │   ├── service.py
│       │   ├── repo.py
│       │   ├── schemas.py
│       │   └── models.py
│       ├── people/              # contatos/pessoas
│       │   ├── router.py
│       │   ├── service.py
│       │   ├── repo.py
│       │   ├── schemas.py
│       │   └── models.py
│       ├── moments/             # alias de posts
│       │   ├── router.py        # rotas /moments (e alias /posts)
│       │   ├── service.py
│       │   ├── repo.py
│       │   ├── schemas.py
│       │   └── models.py
│       ├── media/
│       │   ├── router.py
│       │   ├── service.py
│       │   ├── repo.py
│       │   ├── schemas.py
│       │   └── storage.py
│       ├── series/
│       │   ├── router.py
│       │   ├── service.py
│       │   ├── repo.py
│       │   ├── rrule.py
│       │   ├── schemas.py
│       │   └── models.py
│       ├── chapters/            # alias de shelves
│       │   ├── router.py        # rotas /chapters (e alias /shelves)
│       │   ├── service.py
│       │   ├── repo.py
│       │   ├── schemas.py
│       │   └── models.py
│       ├── templates/
│       │   ├── router.py
│       │   ├── service.py
│       │   ├── repo.py
│       │   └── schemas.py
│       ├── shares/
│       │   ├── router.py
│       │   ├── service.py
│       │   ├── repo.py
│       │   ├── schemas.py
│       │   └── models.py
│       └── comments/
│           ├── router.py
│           ├── service.py
│           ├── repo.py
│           ├── schemas.py
│           └── models.py
├── tests/
│   ├── conftest.py
│   ├── features/
│   │   ├── moments/
│   │   ├── media/
│   │   ├── series/
│   │   └── chapters/
│   └── e2e/
└── scripts/
    ├── dev.sh
    └── load_sample_data.py
```

### Registro das rotas

```python
# app/main.py
from fastapi import FastAPI
from app.core.config import settings
from app.features.moments.router import router as moments_router
from app.features.chapters.router import router as chapters_router
from app.features.series.router import router as series_router
from app.features.children.router import router as children_router
from app.features.auth.router import router as auth_router
# ...

app = FastAPI(title="Livro do Bebê", version="1.0.0")

app.include_router(auth_router,     prefix=settings.API_V1_PREFIX)
app.include_router(children_router, prefix=settings.API_V1_PREFIX)
app.include_router(moments_router,  prefix=settings.API_V1_PREFIX)
app.include_router(chapters_router, prefix=settings.API_V1_PREFIX)
app.include_router(series_router,   prefix=settings.API_V1_PREFIX)
# Aliases de compatibilidade: /posts → /moments, /shelves → /chapters
```

---

## Configuração (env)

Copie o arquivo base e ajuste credenciais conforme seu ambiente:

```bash
cp .env.example .env
```

Valores padrão sugeridos:

```env
APP_NAME=livro-bebe
ENV=local
API_V1_PREFIX=/api/v1
SECRET_KEY=changeme
JWT_ALG=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=30

DB_URL=postgresql+psycopg://postgres:postgres@db:5432/livrobebe
REDIS_URL=redis://redis:6379/0

S3_ENDPOINT=http://minio:9000
S3_REGION=us-east-1
S3_BUCKET_MEDIA=livrobebe-media
S3_ACCESS_KEY=minio
S3_SECRET_KEY=minio123
S3_SECURE=false

CELERY_BROKER_URL=redis://redis:6379/1
CELERY_RESULT_BACKEND=redis://redis:6379/2

SENTRY_DSN=
OTEL_EXPORTER_OTLP_ENDPOINT=
ALLOWED_CORS_ORIGINS=http://localhost:5173,http://localhost:3000

DEFAULT_TZ=America/Recife
```

---

## Rodando Localmente

1. Crie e ative um ambiente virtual.

   ```bash
   python -m venv .venv
   source .venv/bin/activate
   pip install -U pip
   pip install -e .[dev]  # ou pip install -e .
   ```

2. Suba dependências externas necessárias.

   ```bash
docker compose up -d db redis minio create-bucket
   ```

3. Aplique as migrações e inicie a API.

   ```bash
   alembic upgrade head
   uvicorn app.main:app --reload
   ```

4. Inicie o worker Celery (em outro terminal) e acesse a documentação interativa.

   ```bash
   celery -A app.workers.celery_app.celery_app worker -l INFO
   # Docs: http://localhost:8000/docs
   ```

---

## Docker / Docker Compose

```bash
docker compose up --build
```

Serviços incluídos: api, worker, db (Postgres), redis, minio (com criação automática de bucket).

---

## Migrações (Alembic)

```bash
alembic revision -m "add moments model + chapters + people + markers + subtype + etag"
alembic upgrade head
```

---

## Testes

```bash
pytest -q
pytest --cov=app tests/ -q
```

---

## Comunicação & Segurança (API)

Toda a comunicação ocorre via **API REST** em `/api/v1`.

### Exceções controladas

* **Upload:** `POST /uploads/sign` → presigned URL (cliente faz `PUT` direto no S3).
* **Jobs:** export/transcode via polling (`GET /export/pdf/{jobId}`).
* **Links:** `/share-links/{token}` com escopo mínimo e expiração.

### Proteções habilitadas por padrão

1. HTTPS/TLS (HSTS configurado no proxy).
2. OAuth2 + **JWT** (access 15–30 min; refresh 15–30 dias).
3. Autorização por **escopos** + membership por `child_id`.
4. Rate limit (Redis), limite de payload e CORS restrito.
5. S3 com **least privilege** + presigned curto (5 min).
6. **ETag/If-Match** em `PATCH`/`DELETE` e **If-None-Match** em `GET`.
7. Auditoria de ações sensíveis; logs JSON sem PII sensível.
8. URLs de mídia assinadas (visualização com expiração).

### ETag (concorrência & cache)

* Toda resposta de `GET /moments/{id}` retorna `ETag` (hash de `updated_at`/`version`).
* `PATCH /moments/{id}` exige `If-Match: "<etag>"` → 412 em caso de divergência.
* `GET` aceita `If-None-Match` → `304 Not Modified`.

### Privacidade (`moment.privacy`)

* `private`: somente membros da criança.
* `people`: restrito a uma ACL (`allowed_user_ids[]` / `allowed_contact_ids[]`).
* `link`: público por link assinado (expira; opção de senha).

---

## Segurança, LGPD & Privacidade

* Direitos do titular: **exportar, corrigir, excluir** (rotas dedicadas).
* Retenção: soft delete + purge com política documentada.
* Criptografia: TLS, URLs assinadas e minimização de dados sensíveis.
* Auditoria: `audit_log` para ações críticas (compartilhamento, exclusão, exportação).
* Backups e restauração testados periodicamente.

---

## Endpoints (REST v1)

> Rotas canônicas (alinhadas ao front). Aliases legados: `/posts` ⇄ `/moments` e `/shelves` ⇄ `/chapters`.

### Children (perfil do bebê)

* `GET /children`
* `GET /children/{id}`
* `POST /children`
* `PATCH /children/{id}`
* `DELETE /children/{id}`
* `GET /children/{id}/stats` → `{percentis, vacinasStatus, marcos[]}`

### Moments (Momento)

* `GET /moments?child={id}&view={viewer}&filters=...` → `{items[], nextCursor}`
  * Filtros: `type`, `subtype`, `chapter_id`, `date_from/date_to`, `age_range`, `people[]`, `location`, `tags[]`, `markers{}`, `has_media`, `draft`, `privacy`, `series_id`, `q`.
* `GET /moments/{id}` (retorna `ETag`)
* `POST /moments`
* `PATCH /moments/{id}` (If-Match obrigatório)
* `DELETE /moments/{id}` (If-Match obrigatório)
* `POST /moments/{id}/convert` (troca de tipo/subtipo)
* `POST /moments/{id}/share-links` | `GET /share-links/{token}`

### Uploads (presigned)

* `POST /uploads/sign` → `{uploadUrl, fileUrl, expiresAt}` *(compatível com o front)*
* **Opcional:** `POST /media/attach` (fluxo em duas etapas)

### Media

* `DELETE /media/{id}`

### Series

* `GET /series` | `POST /series`
* `GET /series/{id}` | `PATCH /series/{id}` | `DELETE /series/{id}`
* `GET /series/{id}/occurrences` (preenchidas/pendentes/futuras)
* `POST /series/{id}/attach/{moment_id}` | `POST /series/{id}/detach/{moment_id}`

### Chapters (Capítulos/Coleções)

* `GET /chapters` | `POST /chapters`
* `GET /chapters/{id}` | `PATCH /chapters/{id}` | `DELETE /chapters/{id}`
  * `viewer {list|grid|calendar|timeline|series|dashboard|people|reading|map}`
  * `ordering {recent|oldest|custom}`
* `POST /chapters/{id}/share-links`

### Templates (catálogo de tipos/subtipos)

* `GET /templates` *(inclui regras mínimas/validações por tipo)*

### People (Contatos/Pessoas dos Momentos)

* `GET /people` | `POST /people`
* `GET /people/{id}` | `PATCH /people/{id}` | `DELETE /people/{id}`

### Comments

* `GET /moments/{id}/comments` | `POST /moments/{id}/comments` | `DELETE /comments/{id}`

### Export

* `POST /export/pdf` (momento/capítulo/série via body) → `{jobId}`
* `GET /export/pdf/{jobId}` → `{status, url?}`

### Auth & Health

* `POST /auth/signup` | `POST /auth/login` | `POST /auth/refresh` | `POST /auth/logout`
* `GET /healthz` | `GET /readyz` | `/metrics` (Prometheus)

**Paginação:** cursor/offset (config em `core/pagination.py`)

**Versionamento:** `Accept: application/json;version=1` (opcional)

---

## Esquemas & Exemplos

### Momento (simplificado)

```json
{
  "id": "b2f9c9a8-6d4f-42b8-9c0e-4f2a5c2e4a1a",
  "child_id": "f6d2e6d1-8b21-4c3f-9f47-5e2c4e7a1a2b",
  "occurred_at": "2025-03-12T16:45:00Z",
  "age_days": 213,
  "type": "discovery",
  "subtype": "first_bath",
  "status": "published",
  "privacy": "private",
  "people_ids": ["u1", "p3"],
  "location": { "name": "Recife, PE", "lat": -8.05, "lng": -34.9 },
  "medias": [
    {
      "id": "m1",
      "kind": "photo",
      "object_key": "media/2025/03/12/banho.jpg",
      "thumb": "...",
      "mime_type": "image/jpeg",
      "size_bytes": 123456
    }
  ],
  "short_text": "Primeiro banho!",
  "long_text": "Detalhes...",
  "tags": ["PrimeirasVezes", "Banho"],
  "markers": {
    "MarcoDeDesenvolvimento": "PrimeiroBanho",
    "TemAudio": false,
    "RequerAtencao": false
  },
  "fields": {
    "given_by": "pai",
    "towel": "amarela",
    "experience": "tranquilo"
  },
  "series_id": null,
  "updated_at": "2025-03-12T17:02:10Z",
  "etag": "\"7c9e2f13\""
}
```

### Capítulo (Coleção)

```json
{
  "id": "chap-1",
  "name": "Primeiras Vezes & Descobertas",
  "description": "Marcos e primeiras vezes",
  "cover_url": "https://.../cover.jpg",
  "icon": "star",
  "filters": {
    "types": ["discovery"],
    "subtypes": ["first_bath", "first_smile"],
    "people": ["p3"],
    "period": { "from": "2025-01-01", "to": "2025-06-30" },
    "age": { "minDays": 0, "maxDays": 365 },
    "tags": ["PrimeirasVezes"],
    "markers": { "MarcoDeDesenvolvimento": ["PrimeiroBanho"] },
    "privacy": null
  },
  "viewer": "list",
  "ordering": "recent"
}
```

### Série (Mêsversário)

```json
{
  "id": "ser-1",
  "child_id": "f6d2e6d1-8b21-4c3f-9f47-5e2c4e7a1a2b",
  "name": "Mêsversário",
  "rrule": "FREQ=MONTHLY;BYMONTHDAY=12",
  "progress": { "filled": 7, "pending": 5 },
  "occurrences": [
    { "index": 1, "date": "2025-02-12", "moment_id": "..." },
    { "index": 2, "date": "2025-03-12", "moment_id": null }
  ]
}
```

### Uploads — Presigned

```json
{
  "uploadUrl": "https://minio/.../presigned",
  "fileUrl": "s3://livrobebe-media/2025/03/12/banho.jpg",
  "expiresAt": "2025-03-12T17:00:00Z"
}
```

---

## Observabilidade

* **Logs** JSON com `trace_id` e `span_id`.
* **/metrics** (Prometheus).
* **Tracing** via OTLP.
* **Erros** reportados em Sentry (quando `SENTRY_DSN` estiver configurado).

---

## Roadmap

* ✅ Alinhamento Momento/Capítulo/ETag/Markers/Subtipo/Viewer
* 🔜 SSE/WebSocket para progresso de jobs
* 🔜 Calendário oficial de vacinas (validações)
* 🔜 Geocoding reverso (lat/lng → nome do local)
* 🔜 Import/Export completo (zip + JSON)
* 🔜 Reconhecimento de faces (sugestão de pessoas) on-device/edge

---

## Licença

MIT (ou conforme política do projeto).

---

## Contribuição

* Issues/PRs descritivos.
* `make check` antes de abrir PR.
* Conventional Commits.

---
