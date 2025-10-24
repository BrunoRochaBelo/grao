# Tarefas recomendadas para evolução do frontend

1. **Automatizar testes de regressão visual**
   - Configurar testes de interface (por exemplo, com Playwright) para cobrir fluxos críticos como criação de momentos, navegação entre capítulos e exportação de álbum.
   - Integrar os testes ao pipeline de CI para detectar inconsistências visuais e de acessibilidade.

2. **Implementar upload real de mídia**
   - Substituir o botão de upload estático do formulário de momentos por uma integração com serviço de armazenamento (S3, Firebase Storage ou similar).
   - Garantir feedback de progresso e tratamento de erros durante o upload.

3. **Mapear métricas de uso e satisfação**
   - Instrumentar eventos de analytics para medir adoção de funcionalidades (ex.: criação de momentos, acompanhamento de vacinas).
   - Definir painéis de monitoramento para acompanhar engajamento e embasar decisões de produto.

4. **Internacionalização completa da interface**
   - Extrair strings fixas para arquivos de tradução.
   - Preparar o app para múltiplos idiomas, priorizando português e inglês.

5. **Auditar acessibilidade**
   - Revisar componentes com ferramentas automatizadas (Lighthouse, axe) e testes manuais com leitores de tela.
   - Corrigir contrastes, rotulagem e foco para garantir conformidade com WCAG 2.1 AA.
