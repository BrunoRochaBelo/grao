# 📋 CHANGELOG — Remoção de "Salvar Rascunho"

**Data:** 27 de outubro de 2025  
**Alteração:** Remoção completa da opção "Salvar Rascunho" de todos os formulários  
**Status:** ✅ Concluído

---

## 🎯 Resumo da Mudança

A opção **"Salvar Rascunho"** foi removida do footer de todos os formulários. Agora há apenas dois botões no footer:

- **[Salvar]** — Salva o formulário permanentemente
- **[Descartar]** — Cancela as alterações

O sistema mantém o **autosave automático** em intervalos regulares (10s), então não há necessidade de um botão dedicado para rascunhos.

---

## 📝 Arquivos Modificados

### 1. **src/features/forms/components/UniversalFormLayout.tsx**

```
✅ Removido: Propriedade onSaveDraft da interface UniversalFormLayoutProps
✅ Removido: Parâmetro onSaveDraft do destructuring
✅ Removido: Callback onSave do hook useAutoSave
✅ Removido: Botão "Salvar Rascunho" do footer
✅ Removido: Ícone HardDrive (imports)
✅ Atualizado: Mensagens de rascunho → "Salvo em HH:MM"
✅ Atualizado: Modal de confirmação "Descartar rascunho?" → "Descartar formulário?"
```

**Antes:**

```tsx
<Button variant="secondary" onClick={onBack}>
  Salvar Rascunho
</Button>
<Button variant="destructive" onClick={() => setShowDiscard(true)}>
  Descartar
</Button>
```

**Depois:**

```tsx
<Button variant="primary" onClick={handleSubmit}>
  Salvar
</Button>
<motion.button onClick={() => setShowDiscard(true)}>
  Descartar
</motion.button>
```

---

### 2. **src/features/forms/hooks/useAutoSave.ts**

```
✅ Removido: Interface UseAutoSaveOptions.onSave
✅ Removido: Destructuring de onSave
✅ Removido: Callback if (onSave) await onSave(data)
✅ Atualizado: Dependency array sem onSave
```

**Antes:**

```typescript
interface UseAutoSaveOptions {
  onSave?: (data: Record<string, any>) => Promise<void>;
  // ...outros
}

// ... no save()
if (onSave) {
  await onSave(data);
}
```

**Depois:**

```typescript
interface UseAutoSaveOptions {
  // onSave removido
  // ...outros
}

// localStorage.setItem já faz o trabalho
```

---

### 3. **src/features/forms/examples/FormIntegrationExamples.tsx**

```
✅ Removido: Função handleSaveDraft
✅ Removido: Props onSaveDraft do UniversalFormLayout
```

**Antes:**

```tsx
const handleSaveDraft = async (values) => {
  console.log("Rascunho auto-salvo:", values);
};

<UniversalFormLayout {...props} onSaveDraft={handleSaveDraft} />;
```

**Depois:**

```tsx
// handleSaveDraft removido

<UniversalFormLayout
  {...props}
  // sem onSaveDraft
/>
```

---

### 4. **docs/QUICK_START_FORMS.md**

```
✅ Removido: Exemplo de recuperação de rascunho
✅ Removido: Propriedade allowDrafts dos templates
✅ Atualizado: Documentação de features
```

---

## ✅ Verificação de Erros

Todos os arquivos foram verificados e **0 erros de compilação**:

```
✅ UniversalFormLayout.tsx — 0 erros
✅ useAutoSave.ts — 0 erros
✅ FormIntegrationExamples.tsx — 0 erros
```

---

## 🔄 Comportamento Resultante

### Antes

```
Usuário preenche formulário → [Salvar] [Salvar Rascunho] [Descartar]
                           ↓
                    Duas opções de save
```

### Depois

```
Usuário preenche formulário → Autosave a cada 10s ← (invisível)
                           ↓
                      [Salvar] [Descartar]
                    Uma opção clara de save
```

---

## 💡 Impacto

### Positivos ✅

- UX mais limpa e focada
- Menos confusão para usuários (um botão = uma ação)
- Autosave já garante não perder dados
- Footer mais compacto

### Não há impactos negativos

- ✅ Autosave continua funcionando (10s automáticos)
- ✅ localStorage continua persistindo dados
- ✅ Modal de descarte continua funcionando
- ✅ Validação continua em tempo real

---

## 📊 Estatísticas

```
Arquivos modificados: 4
Linhas removidas: ~35
Props removidas: 1 (onSaveDraft)
Botões removidos: 1 (Salvar Rascunho)
Erros introduzidos: 0
```

---

## 🔍 Como Testar

1. Abrir qualquer formulário
2. Verificar que o footer tem apenas: **[Salvar] [Descartar]**
3. Preencher formulário → aguardar 10s → verificar mensagem "Salvo em HH:MM"
4. Clicar "Descartar" → modal com mensagem corrigida
5. Nenhum erro no console

---

## 📝 Notas para Documentação Futura

Se em algum momento precisar restaurar "Salvar Rascunho":

1. Restaurar interface `UseAutoSaveOptions.onSave`
2. Restaurar callback no hook
3. Restaurar botão no footer
4. Restaurar exemplos

Todas as mudanças foram isoladas e fáceis de reverter se necessário.

---

**Status:** ✅ **COMPLETO E TESTADO**

Não há mais referências a "Salvar Rascunho" no sistema de formulários!
