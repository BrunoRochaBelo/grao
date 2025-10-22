# Baby Book App UI Kit

This is a code bundle for Baby Book App UI Kit. The original project is available at https://www.figma.com/design/vvQvLxTuVu1vQHFEFVHdfn/Baby-Book-App-UI-Kit.

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

# grao

---

## Sobre

O **Livro do Bebê** é um backend em Python (FastAPI) para um diário moderno de memórias infantis.
Conceito central: **Momento** (como um post de rede social). Templates aceleram o registro; **Capítulos** são **visões filtradas** do mesmo feed (capítulos do livro); **Séries** cuidam de **recorrências** (ex.: mêsversário).

**Diferenciais técnicos**

- Campos flexíveis em `momento.fields` (JSONB) + **índices GIN** (consultas rápidas).
- Upload direto ao storage (S3/MinIO) via **Presigned URL**.
- **Workers** (Celery) para tarefas pesadas (thumbs, transcode, PDFs).
- Observabilidade pronta (logs JSON, Prometheus, OpenTelemetry, Sentry).
- **ETag/If-Match** para concorrência otimista e **If-None-Match** para cache de GETs.

---

## Sumário

- [Stack](#stack)
- [Arquitetura do Sistema](#arquitetura-do-sistema)
- [Modelagem de Domínio](#modelagem-de-domínio)
- [Estrutura de Pastas (Blueprint por Feature)](#estrutura-de-pastas-blueprint-por-feature)
- [Configuração (env)](#configuração-env)
- [Rodando Localmente](#rodando-localmente)
- [Docker / Docker Compose](#docker--docker-compose)
- [Migrações (Alembic)](#migrações-alembic)
- [Testes](#testes)
- [Comunicação & Segurança (API)](#comunicação--segurança-api)
- [Segurança, LGPD & Privacidade](#segurança-lgpd--privacidade)
- [Endpoints (REST v1)](#endpoints-rest-v1)
- [Esquemas & Exemplos](#esquemas--exemplos)
- [Observabilidade](#observabilidade)
- [Roadmap](#roadmap)
- [Licença](#licença)

---

## Stack

- **Python:** 3.12+
- **Web:** FastAPI + Uvicorn
- **ORM:** SQLAlchemy 2.x + Alembic
- **DB:** PostgreSQL 14+ (JSONB)
- **Cache/Rate-limit/Fila:** Redis
- **Jobs:** Celery (+ Redis)
- **Storage de mídia:** S3 compatível (AWS S3 / MinIO)
- **Imagens/Vídeos:** Pillow / FFmpeg
- **Auth:** OAuth2 + JWT (access/refresh), Argon2
- **Qualidade:** Ruff, Black, isort, mypy, pytest, pre-commit
- **Observabilidade:** Logs JSON, Prometheus, OpenTelemetry, Sentry

---

## Arquitetura do Sistema

**Feature-first (blueprint)** com camadas internas por domínio:

- **API** (APIRouter por feature): validação, autenticação, paginação, versionamento, ETag.
- **Services**: regras de negócio (criar Momento, anexar a Série, idade calculada, growth stats).
- **Repositories**: persistência (SQLAlchemy).
- **Workers** (Celery): transcode/thumbnail, exportações (PDF), notificações.
- **Storage**: S3/MinIO via URLs assinadas.
- **Telemetry**: logging estruturado, métricas e tracing.

**Fronteiras**

- api (stateless) · worker (jobs) · db (Postgres) · cache/queue (Redis) · object storage (S3/MinIO) · cdn (opcional)

---

## Modelagem de Domínio

**Entidades principais**

- **User**: conta/autenticação; escopos.
- **Child**: criança; associação User↔Child (membros).
- **Moment** (antes “Post”): unidade de conteúdo.

  - `id, child_id, occurred_at (tz/UTC), age_days, type, subtype, status{published|draft},`
  - `privacy{private|people|link}, people[] (referências), location{name, lat?, lng?},`
  - `medias[] (foto/vídeo/áudio/doc), short_text, long_text, tags[], markers{},`
  - `fields{…}, series_id?`

- **Media**: arquivo no S3/MinIO (`object_key`, `mime`, `size`, `thumb`, `duration?`).
- **Series**: recorrência (RRULE), progresso e ocorrências derivadas.
- **Chapter (Capítulo)**: coleção/visão salva: filtros + `viewer` + `ordering`.
- **Template**: catálogo dos tipos/subtipos & validações mínimas.
- **Person/Contact**: pessoa envolvida (para “pessoas[]” nos Momentos).
- **Comment**: comentários/áudios em um Momento (opcional).
- **ShareLink**: link de compartilhamento com escopo/expiração/senha.
- **AuditLog**: trilha de auditoria.

> **Mudanças chave p/ alinhar ao front**
>
> - Renomeação pública: **Momento** (alias de Post) e **Capítulo** (alias de Shelf).
> - Novos campos: `subtype`, `status`, `privacy=people`, `markers{}`, `viewer` e `ordering` em Capítulo, `lat/lng` em `location`.
> - **ETag** (+ `updated_at`/`version`) para concorrência e cache.
> - **/moments** e **/chapters** como rotas canônicas (mantidas aliases `/posts` e `/shelves`).

---

## Estrutura de Pastas (Blueprint por Feature)

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
│   │   └── etag.py              # NOVO: cálculo/validação de ETags
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
│       ├── people/              # NOVO: contatos/pessoas
│       │   ├── router.py
│       │   ├── service.py
│       │   ├── repo.py
│       │   ├── schemas.py
│       │   └── models.py
│       ├── moments/             # (alias de posts)
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
│       ├── chapters/            # (alias de shelves)
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

**Registro das rotas**

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

app.include_router(auth_router,    prefix=settings.API_V1_PREFIX)
app.include_router(children_router,prefix=settings.API_V1_PREFIX)
app.include_router(moments_router, prefix=settings.API_V1_PREFIX)
app.include_router(chapters_router,prefix=settings.API_V1_PREFIX)
app.include_router(series_router,  prefix=settings.API_V1_PREFIX)
# Aliases de compat: /posts → /moments, /shelves → /chapters
```

---

## Configuração (env)

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

```bash
pip install -U pip
pip install -e .[dev] || pip install -e .

docker compose up -d db redis minio create-bucket
alembic upgrade head

uvicorn app.main:app --reload
# Worker (outro terminal):
celery -A app.workers.celery_app.celery_app worker -l INFO

# Docs: http://localhost:8000/docs
```

---

## Docker / Docker Compose

```bash
docker compose up --build
```

Serviços: api, worker, db (Postgres), redis, minio (+ criação de bucket).

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

**Tudo via API REST** em `/api/v1`.

Exceções controladas:

- **Upload**: `POST /uploads/sign` → presigned URL (cliente faz PUT direto no S3).
- **Jobs**: export/transcode via polling: `GET /export/pdf/:jobId`.
- **Links**: `/share-links/{token}` com escopo mínimo e expiração.

**Proteções (default ON)**

1. HTTPS/TLS (HSTS no proxy).
2. OAuth2 + **JWT** (access 15–30min; refresh 15–30d).
3. Autorização por **escopos** + membership por `child_id`.
4. Rate limit (Redis), limite de payload, CORS restrito.
5. S3 com **least privilege** + presigned curto (5 min).
6. **ETag/If-Match** em `PATCH`/`DELETE` e **If-None-Match** em `GET`.
7. Auditoria de ações sensíveis; logs JSON sem PII sensível.
8. URLs de mídia **assinadas** (visualização/expiração).

**ETag (concorrência & cache)**

- Toda resposta de `GET /moments/:id` retorna `ETag` (hash de `updated_at`/`version`).
- `PATCH /moments/:id` exige `If-Match: "<etag>"` → 412 se divergente.
- `GET` aceita `If-None-Match` → 304 Not Modified.

**Privacidade (momento.privacy)**

- `private`: somente membros da criança.
- `people`: restrito a uma **ACL** (`allowed_user_ids[]` / `allowed_contact_ids[]`).
- `link`: público por link assinado (expira; opcional senha).

---

## Segurança, LGPD & Privacidade

- Direitos do titular: **exportar, corrigir, excluir** (rotas dedicadas).
- Retenção: soft delete + purge; política documentada.
- Criptografia: TLS; URLs assinadas; dados sensíveis minimizados.
- Auditoria: `audit_log` (share, delete, export).
- Backups & restauração testados.

---

## Endpoints (REST v1)

> **Rotas canônicas (alinhadas ao front)**. Aliases legados:
> `/posts` ⇄ `/moments` e `/shelves` ⇄ `/chapters`.

### Children (Perfil do bebê)

- `GET /children`
- `GET /children/{id}`
- `POST /children` | `PATCH /children/{id}` | `DELETE /children/{id}`
- `GET /children/{id}/stats` → `{percentis, vacinasStatus, marcos[]}`

### Moments (Momento)

- `GET /moments?child={id}&view={viewer}&filters=...` → `{items[], nextCursor}`
  Filtros: `type, subtype, chapter_id, date_from/date_to, age_range, people[], location, tags[], markers{}, has_media, draft, privacy, series_id, q`
- `GET /moments/{id}` (ETag)
- `POST /moments`
- `PATCH /moments/{id}` (If-Match obrigatório)
- `DELETE /moments/{id}` (If-Match obrigatório)
- `POST /moments/{id}/convert` (troca de tipo/subtipo)
- `POST /moments/{id}/share-links` | `GET /share-links/{token}`

### Uploads (Presigned)

- `POST /uploads/sign` → `{uploadUrl, fileUrl, expiresAt}` _(compat com front)_
- **Opcional**: `POST /media/attach` (fluxo 2 etapas)

### Media

- `DELETE /media/{id}`

### Series

- `GET /series` | `POST /series`
- `GET /series/{id}` | `PATCH /series/{id}` | `DELETE /series/{id}`
- `GET /series/{id}/occurrences` (preenchidas/pendentes/futuras)
- `POST /series/{id}/attach/{moment_id}` | `POST /series/{id}/detach/{moment_id}`

### Chapters (Capítulos/Coleções)

- `GET /chapters` | `POST /chapters`
- `GET /chapters/{id}` | `PATCH /chapters/{id}` | `DELETE /chapters/{id}`
  `viewer{list|grid|calendar|timeline|series|dashboard|people|reading|map}`,
  `ordering{recent|oldest|custom}`
- `POST /chapters/{id}/share-links`

### Templates (catálogo de tipos/subtipos)

- `GET /templates` _(com regras mínimas/validações por tipo)_

### People (Contatos/Pessoas dos Momentos)

- `GET /people` | `POST /people`
- `GET /people/{id}` | `PATCH /people/{id}` | `DELETE /people/{id}`

### Comments

- `GET /moments/{id}/comments` | `POST /moments/{id}/comments` | `DELETE /comments/{id}`

### Export

- `POST /export/pdf` (momento/capítulo/série via body) → `{jobId}`
- `GET /export/pdf/{jobId}` → `{status,url?}`

### Auth & Health

- `POST /auth/signup` | `POST /auth/login` | `POST /auth/refresh` | `POST /auth/logout`
- `GET /healthz` | `GET /readyz` | `/metrics` (Prometheus)

**Paginação:** cursor/offset (config em `core/pagination.py`)
**Versionamento:** `Accept: application/json;version=1` (opcional)

---

## Esquemas & Exemplos

**Momento (simplificado)**

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

**Capítulo (Coleção)**

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

**Série (Mêsversário)**

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

**Uploads — Presigned**

```json
{
  "uploadUrl": "https://minio/.../presigned",
  "fileUrl": "s3://livrobebe-media/2025/03/12/banho.jpg",
  "expiresAt": "2025-03-12T17:00:00Z"
}
```

---

## Observabilidade

- **Logs** JSON com `trace_id`/`span_id`.
- **/metrics** (Prometheus).
- **Tracing** via OTLP.
- **Erros** em Sentry (se `SENTRY_DSN`).

---

## Roadmap

- ✅ Alinhamento Momento/Capítulo/ETag/Markers/Subtipo/Viewer
- 🔜 SSE/WebSocket para progresso de jobs
- 🔜 Calendário oficial de vacinas (validações)
- 🔜 Geocoding reverso (lat/lng → place name)
- 🔜 Import/Export completo (zip+JSON)
- 🔜 Reconhecimento de faces (sugestão de pessoas) on-device/edge

---

## Licença

MIT (ou conforme política do projeto)

---

## Contribuição

- Issues/PRs descritivos.
- `make check` antes de abrir PR.
- Conventional Commits.

---
