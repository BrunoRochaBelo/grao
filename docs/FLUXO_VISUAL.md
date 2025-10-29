# 🔧 Fluxo Visual: Como Tudo Funciona

## 1️⃣ Quando você executa `npm run dev`

```
npm run dev
    ↓
┌─────────────────────────────────────────────┐
│  package.json script                        │
│  "dev": "npm run clean:ports && vite"       │
└─────────────────────────────────────────────┘
    ↓
    ├─ npm run clean:ports
    │      ↓
    │  scripts/clean-ports.js
    │      ↓
    │  Detecta SO (Windows/macOS/Linux)
    │      ↓
    │  Windows → netstat + taskkill
    │  Mac/Linux → lsof + kill -9
    │      ↓
    │  🔍 Procura processos na porta 3000
    │      ↓
    │  ☠️  Mata todos encontrados
    │      ↓
    │  ✅ Porta 3000 livre!
    │
    └─ vite
         ↓
    ┌────────────────────────────────────────┐
    │ vite.config.ts                         │
    │ • SWC Compiler ⚡ (10x rápido)         │
    │ • ESbuild minification                 │
    │ • Code-splitting automático            │
    │ • HMR otimizado                        │
    │ • Pre-bundling de deps pesadas         │
    └────────────────────────────────────────┘
         ↓
    ✨ Server iniciado em localhost:3000
         ↓
    🌐 Navegador abre automaticamente
```

---

## 2️⃣ Estrutura de Chunks (Code-Splitting)

```
Build Production:
├── index.html
└── assets/
    ├── radix-ui-XXX.js      ← Componentes Radix UI
    ├── charts-YYY.js        ← Recharts
    ├── forms-ZZZ.js         ← React Hook Form
    ├── ui-WWW.js            ← Sonner, Motion, Embla, CMDk
    ├── vendor-VVV.js        ← React, React-DOM
    └── main-UUU.js          ← Seu código

Carregamento no navegador:
vendor.js (crítico)
    ↓
main.js (crítico)
    ↓
radix-ui.js (paralelo) ⚡
charts.js (paralelo) ⚡
forms.js (paralelo) ⚡
ui.js (paralelo) ⚡

Resultado: Tudo carrega em paralelo, não sequencial!
```

---

## 3️⃣ Hot Module Replacement (HMR)

```
Você edita src/components/Button.tsx
    ↓
Vite detecta mudança (~50ms)
    ↓
SWC compila só esse arquivo (~200ms)
    ↓
Envia apenas o novo módulo via WebSocket
    ↓
React re-renders apenas o que mudou
    ↓
Total: ~1-1.5s (em vez de ~2-3s)

Benefício: Desenvolvimento muito mais rápido!
```

---

## 4️⃣ Lazy Loading de Componentes (Opcional)

```
Antes (eager loading - tudo carregado):
import { ProfileScreen } from './features/profile'
import { FamilyScreen } from './features/family'
import { HealthScreen } from './features/health'
    ↓
JS inicial: 450KB ❌

Depois (lazy loading - sob demanda):
const ProfileScreen = lazy(() => import('./features/profile'))
const FamilyScreen = lazy(() => import('./features/family'))
const HealthScreen = lazy(() => import('./features/health'))
    ↓
JS inicial: 350KB ✅
    ↓
Quando acessa Profile:
    ↓
ProfileScreen.js baixa (~50KB)
    ↓
Renderiza com Loading spinner
```

---

## 5️⃣ Performance Timeline

### Cenário: Desenvolvimento Local

```
ANTES:
  0s    - npm run dev
  0s    - Porta 3000 já está em uso ❌
  ±5s   - Mata processo manualmente
  5s    - npm run dev novamente
  +8s   - Servidor inicializa
       = 13s total ❌

DEPOIS:
  0s    - npm run dev
  0s    - Inicia limpeza de portas
  1s    - Porta livre ✅
  +5s   - Servidor inicializa
       = 6s total ✅

Ganho: 7 segundos por dev start! 🎉
```

### Cenário: Edição de Código

```
ANTES:
  0s    - Você edita um arquivo
  ±2s   - Transpilação
  ±1s   - Build/bundling
  ±1s   - Envio ao navegador
       = ~3-4s até atualizar ⏳

DEPOIS:
  0s    - Você edita um arquivo
  ±0.2s - SWC compila (10x rápido)
  ±0.3s - Webpack rebuild
  ±0.5s - Envio WebSocket
       = ~1-1.5s até atualizar ⚡

Ganho: 50% mais rápido! 🚀
```

---

## 6️⃣ Scripts Available

```bash
┌─────────────────────────────────────────────────────────┐
│ npm run dev                                             │
├─────────────────────────────────────────────────────────┤
│ 1. Limpa processos Node antigos                         │
│ 2. Libera porta 3000                                    │
│ 3. Inicia Vite em dev mode                             │
│ 4. Abre navegador automaticamente                       │
│                                                         │
│ ✅ Recomendado para desenvolvimento                     │
│ ⏱️ Tempo: ~5-6 segundos                                 │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ npm run dev:fast                                        │
├─────────────────────────────────────────────────────────┤
│ 1. Pula limpeza de processos                            │
│ 2. Inicia Vite diretamente                             │
│                                                         │
│ ✅ Para quando souber que não há conflitos              │
│ ⏱️ Tempo: ~2-3 segundos                                 │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ npm run clean:ports                                     │
├─────────────────────────────────────────────────────────┤
│ 1. Apenas limpa portas e processos                      │
│ 2. Não inicia servidor                                 │
│                                                         │
│ ✅ Para troubleshooting                                 │
│ ⏱️ Tempo: ~1 segundo                                    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ npm run build                                           │
├─────────────────────────────────────────────────────────┤
│ 1. Build production otimizado                           │
│ 2. Minificado com ESbuild                              │
│ 3. Code-split automático                               │
│ 4. Saída em ./build                                     │
│                                                         │
│ ✅ Para deploy                                          │
│ ⏱️ Tempo: ~10-12 segundos                               │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ npm run preview                                         │
├─────────────────────────────────────────────────────────┤
│ 1. Prévias a build de produção localmente               │
│ 2. Útil para testes antes de deploy                     │
│                                                         │
│ ✅ Para validar build                                   │
│ ⏱️ Tempo: ~2 segundos                                   │
└─────────────────────────────────────────────────────────┘
```

---

## 7️⃣ Arquitetura de Otimizações

```
┌───────────────────────────────────────────────┐
│         Seu Código React (App.tsx)            │
└───────────────┬─────────────────────────────┘
                │
                ↓ (Transpilado por)
        ┌──────────────────┐
        │   SWC Compiler   │  (10x mais rápido)
        └────────┬─────────┘
                 │
                 ↓ (Bundled por)
        ┌──────────────────┐
        │   Rollup + ESbuild│  (Minificação rápida)
        └────────┬─────────┘
                 │
                 ↓ (Code-split em)
        ┌──────────────────────────┐
        │   Chunks Separados       │
        │   • radix-ui.js         │
        │   • charts.js           │
        │   • forms.js            │
        │   • ui.js               │
        │   • vendor.js           │
        │   • main.js             │
        └────────┬─────────────────┘
                 │
                 ↓ (Carregado em paralelo)
        ┌──────────────────┐
        │  Navegador Web   │
        └────────┬─────────┘
                 │
                 ↓
        ┌──────────────────────────┐
        │  ⚡ Renderização Rápida   │
        │  📱 ~1-1.5s (hot reload) │
        └──────────────────────────┘
```

---

## 8️⃣ Troubleshooting Rápido

```
Problema: "Port 3000 already in use"
  ↓
Solução: npm run clean:ports
  ↓
✅ Resolvido

─────────────────────────────────────

Problema: Muito lento
  ↓
Tentar: npm run dev:fast
  ↓
Se não melhorar: npm run clean:ports && npm run dev
  ↓
✅ Resolvido

─────────────────────────────────────

Problema: Hot reload não funciona
  ↓
Verificar: Pasta em NTFS (Windows)?
  ↓
Reiniciar: VS Code
  ↓
✅ Resolvido
```

---

## 📊 Métricas em Tempo Real

```
Para monitorar performance:

1. Abra DevTools (F12)
2. Aba "Performance"
3. Clique em "Record"
4. Recarregue página (Ctrl+R)
5. Aguarde ~5 segundos
6. Clique em "Stop"

Você verá:
├─ Tempo de parse JS
├─ Tempo de compilação
├─ Primeiro paint
├─ Interatividade
└─ Render completo

Objetivo: Tudo < 3 segundos ✅
```

---

**Última atualização:** 28 de Outubro de 2025  
**Vite:** 6.3.5  
**Node.js:** 20+  
**React:** 18.3.1

**Próximo passo:** Execute `npm run dev` e veja a mágica acontecer! 🚀
