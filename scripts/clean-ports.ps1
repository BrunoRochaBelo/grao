#!/usr/bin/env pwsh
<#
  Script PowerShell para limpeza rápida de portas
  Uso: ./scripts/clean-ports.ps1
#>

Write-Host "🧹 Limpando portas e processos antigos..." -ForegroundColor Cyan
Write-Host ""

$port = 3000

# Tenta encontrar processo na porta 3000
$connections = netstat -ano | Select-String ":$port" | ForEach-Object { 
    $parts = $_ -split '\s+'
    $parts[-1]
}

if ($connections) {
    foreach ($processId in $connections) {
        if ($processId -match '^\d+$') {
            try {
                Write-Host "  ⚠️  Encerrando PID $processId..." -ForegroundColor Yellow
                Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
                Write-Host "  ✅ PID $processId encerrado" -ForegroundColor Green
            }
            catch {
                Write-Host "  ❌ Erro ao encerrar PID $processId" -ForegroundColor Red
            }
        }
    }
}
else {
    Write-Host "  ✅ Nenhum processo na porta $port" -ForegroundColor Green
}

# Tenta encerrar todos os node.exe
Write-Host ""
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "  ⚠️  Encerrando processos Node..." -ForegroundColor Yellow
    $nodeProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
    Write-Host "  ✅ $($nodeProcesses.Count) processo(s) Node encerrado(s)" -ForegroundColor Green
}
else {
    Write-Host "  ✅ Nenhum processo Node em execução" -ForegroundColor Green
}

Write-Host ""
Write-Host "✨ Pronto para iniciar o servidor!" -ForegroundColor Green
Write-Host ""
