#!/bin/bash

# Script de validação do wireflow de Momentos

echo "🔍 VALIDAÇÃO - WIREFLOW MOMENTOS"
echo "================================"
echo ""

# Verificar estrutura de pastas
echo "✅ Verificando estrutura de arquivos..."

files=(
  "src/features/moments/MomentsScreen.tsx"
  "src/features/moments/components/TimelineCard.tsx"
  "src/features/moments/components/TimelineGroupHeader.tsx"
  "src/features/moments/components/FilterChips.tsx"
  "src/features/moments/components/FullScreenViewer.tsx"
  "src/features/moments/components/ContextMenu.tsx"
  "src/features/moments/components/EmptyPlaceholder.tsx"
  "src/features/moments/hooks/useFilters.ts"
  "src/features/moments/hooks/useTimelineGroups.ts"
  "src/features/moments/utils/timelineUtils.ts"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file (FALTANDO)"
  fi
done

echo ""
echo "✅ Verificando integração em App.tsx..."

if grep -q "MomentsScreen" src/App.tsx; then
  echo "  ✅ MomentsScreen importado"
else
  echo "  ❌ MomentsScreen não importado"
fi

if grep -q 'case "moments"' src/App.tsx; then
  echo "  ✅ Rota 'moments' configurada"
else
  echo "  ❌ Rota 'moments' não configurada"
fi

echo ""
echo "✅ Verificando BottomNav..."

if grep -q '"moments"' src/layout/BottomNav.tsx; then
  echo "  ✅ Abas de navegação incluem 'moments'"
else
  echo "  ❌ Abas de navegação não incluem 'moments'"
fi

echo ""
echo "✅ Verificando dados de teste..."

if grep -q '"Saúde & Crescimento"' src/lib/mockData.ts; then
  echo "  ✅ Capítulos de teste inclusos"
else
  echo "  ❌ Capítulos de teste não encontrados"
fi

if grep -q 'initialMoments' src/lib/mockData.ts; then
  echo "  ✅ Momentos de teste definidos"
else
  echo "  ❌ Momentos de teste não encontrados"
fi

echo ""
echo "🎯 VALIDAÇÃO COMPLETA"
echo "====================="
echo ""
echo "Próximas etapas:"
echo "1. npm install"
echo "2. npm run dev"
echo "3. Abra http://localhost:3001"
echo "4. Clique em 'Momentos' na barra inferior"
echo ""
