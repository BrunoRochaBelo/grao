#!/usr/bin/env python3
# Script para corrigir o ícone corrompido da "Família & Visitas"

with open("src/lib/mockData.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Procurar pela seção corrompida e substituir
# Linha: icon: ".",
# Trocar por: icon: "👨‍👩‍👧",

lines = content.split('\n')
for i, line in enumerate(lines):
    if 'name: "Família & Visitas"' in line:
        # Próximas linhas devem conter o ícone
        if i + 2 < len(lines) and 'icon:' in lines[i + 2]:
            # Substituir a linha do ícone
            lines[i + 2] = '    icon: "👨‍👩‍👧",'
            print(f"Ícone corrigido na linha {i + 2 + 1}")
        break

# Escrever o arquivo corrigido
with open("src/lib/mockData.ts", "w", encoding="utf-8") as f:
    f.write('\n'.join(lines))

print("Arquivo corrigido com sucesso!")
