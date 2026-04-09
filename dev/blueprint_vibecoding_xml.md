# Blueprint Vibecoding — Coletor de XMLs Fiscais

## Objetivo

Construir um MVP para automatizar o download e a organização de XMLs fiscais de empresas brasileiras, com foco em diagnósticos de recuperação de créditos de PIS e COFINS.

## Escopo fechado

- cadastro de empresa
- upload de certificado A1 (`.pfx`) e senha
- sincronização de entrada e saída
- modelos 55 e 65
- backfill dos últimos 60 meses
- sync incremental depois da carga histórica
- armazenamento e indexação de XMLs
- painel de cobertura por competência
- reprocessamento de falhas

## Regra principal da UX

O usuário pode selecionar **55 e 65 na mesma consulta**.  
No backend, o sistema executa **dois fluxos separados** e consolida o resultado.

## Fluxo do produto

1. cadastrar empresa
2. subir certificado digital
3. validar certificado
4. configurar sincronização
5. executar backfill de 60 meses
6. salvar XMLs e metadados
7. exibir cobertura
8. ativar sync incremental

## Telas do MVP

### Dashboard
- total de empresas
- total de XMLs sincronizados
- períodos completos
- falhas pendentes
- últimas sincronizações

### Empresas
- listar empresas
- cadastrar
- editar
- campos: razão social, nome fantasia, CNPJ, UF, observações, status

### Certificado
- upload `.pfx`
- senha
- validar
- validade
- status

### Sincronização
- empresa
- modelos 55 e 65
- tipos: entrada e saída
- seletor de 60 meses
- validar configuração
- iniciar sincronização
- pausar
- reprocessar falhas
- progresso

### Cobertura
- grade mensal
- entrada 55
- saída 55
- entrada 65
- saída 65
- status por competência

### XMLs
- tabela de documentos
- busca por chave
- filtros por empresa, modelo, tipo e competência

### Logs
- histórico de jobs
- falhas
- tentativas
- timestamps

## Arquitetura sugerida

### Stack
- Next.js
- TypeScript
- Tailwind
- banco relacional simples
- preparado para Supabase
- storage local no MVP

### Estrutura
- `app/(dashboard)`
- `app/empresas`
- `app/sincronizacao`
- `app/cobertura`
- `app/xmls`
- `app/logs`
- `components/ui`
- `components/dashboard`
- `components/forms`
- `components/tables`
- `lib/db`
- `lib/storage`
- `lib/jobs`
- `lib/sync`
- `lib/validators`
- `types`

## Serviços de domínio

- `CompanyService`
- `CertificateService`
- `SyncOrchestrator`
- `NFe55SyncService`
- `NFCe65SyncService`
- `XmlStorageService`
- `CoverageService`
- `JobLogService`

## Modelos de dados

### Company
- id
- razaoSocial
- nomeFantasia
- cnpj
- uf
- observacoes
- status
- createdAt
- updatedAt

### Certificate
- id
- companyId
- fileName
- validade
- status
- secretRef
- createdAt

### SyncJob
- id
- companyId
- tipoExecucao
- modelos
- tipos
- status
- progresso
- startedAt
- endedAt

### SyncCheckpoint
- id
- companyId
- modelo
- ultimoNsu
- ultimoPeriodoProcessado
- updatedAt

### XmlDocument
- id
- companyId
- modelo
- tipo
- chave
- nsu
- competencia
- path
- status
- createdAt

### CoverageSnapshot
- id
- companyId
- periodo
- modelo
- tipo
- cobertura
- faltas
- updatedAt

### JobLog
- id
- jobId
- nivel
- mensagem
- payload
- createdAt

## Estrutura de storage

- `/storage/{cnpj}/{modelo}/{tipo}/{ano}/{mes}/xmls`
- `/storage/{cnpj}/logs`
- `/storage/{cnpj}/exports`

## Estratégia de vibecoding

### Princípio
Resolver primeiro o gargalo operacional real: baixar e organizar XMLs.

### Ordem de construção
1. CRUD de empresa
2. upload e validação de certificado
3. criação de job de sincronização
4. persistência de XMLs
5. tabela de XMLs
6. cobertura por competência
7. logs e reprocessamento
8. sync incremental

### O que evitar
- multi-tenant complexo cedo demais
- integrações paralelas desnecessárias
- abstrações excessivas
- módulos que não ajudam o fluxo principal

## Prompt one-shot

```txt
Crie um sistema web completo, com interface premium em estilo glassmorphism/liquid glass, para automatizar o download e organização de XMLs fiscais de empresas brasileiras para diagnóstico de recuperação de créditos de PIS e COFINS.

Objetivo do produto:
- cadastrar empresas
- fazer upload de certificado digital A1 (.pfx) e senha
- sincronizar XMLs de entrada e saída
- suportar modelos 55 e 65
- permitir backfill dos últimos 60 meses
- permitir sync incremental depois da carga histórica
- mostrar cobertura por competência e status das sincronizações
- reprocessar falhas

Regras de produto:
- o usuário deve conseguir selecionar 55 e 65 na mesma consulta
- a interface é única, mas o backend deve executar dois fluxos separados e consolidar a resposta
- o foco é velocidade operacional e simplicidade
- o sistema deve ser construído para uso interno, não como produto SaaS público
- não incluir modelo 59
- não incluir emissão de nota, apenas sincronização, armazenamento e monitoramento de XMLs
- não exagerar em complexidade arquitetural

Tecnologia desejada:
- Next.js
- TypeScript
- Tailwind
- componentes em visual liquid glass
- banco relacional simples
- estrutura preparada para Supabase
- código limpo e pragmático
- sem overengineering

Páginas do sistema:
1. Dashboard
   - cards com total de empresas
   - total de XMLs sincronizados
   - quantidade de períodos completos
   - quantidade de falhas pendentes
   - tabela com últimas sincronizações

2. Empresas
   - listar empresas
   - cadastrar empresa
   - editar empresa
   - campos: razão social, nome fantasia, CNPJ, UF, observações
   - status da empresa

3. Certificado
   - upload de arquivo .pfx
   - senha do certificado
   - validar certificado
   - mostrar validade
   - mostrar status: válido, expirado, inválido, pendente

4. Sincronização
   - selecionar empresa
   - selecionar modelos 55 e 65 com checkbox múltiplo
   - selecionar tipos: entrada e saída
   - seletor rápido: últimos 60 meses
   - botão validar configuração
   - botão iniciar sincronização
   - botão pausar
   - botão reprocessar falhas
   - barra de progresso por job

5. Cobertura
   - grade por competência mensal
   - colunas para entrada 55, saída 55, entrada 65, saída 65
   - status visual: completo, parcial, falha, não processado
   - filtros por empresa e período

6. XMLs
   - tabela de documentos sincronizados
   - colunas: empresa, modelo, tipo, chave, NSU, competência, caminho do arquivo, status
   - busca por chave
   - filtro por modelo
   - filtro por tipo
   - filtro por competência

7. Logs
   - histórico de jobs
   - mensagens de erro
   - tentativas
   - payload resumido
   - timestamps

Arquitetura mínima:
- app/(dashboard)
- app/empresas
- app/sincronizacao
- app/cobertura
- app/xmls
- app/logs
- components/ui
- components/dashboard
- components/forms
- components/tables
- lib/db
- lib/storage
- lib/jobs
- lib/sync
- lib/validators
- types

Serviços de domínio:
- CompanyService
- CertificateService
- SyncOrchestrator
- NFe55SyncService
- NFCe65SyncService
- XmlStorageService
- CoverageService
- JobLogService

Modelos de dados:
- Company
- Certificate
- SyncJob
- SyncCheckpoint
- XmlDocument
- CoverageSnapshot
- JobLog

Comportamentos esperados:
- cadastrar uma empresa e persistir no banco
- fazer upload de certificado e associar à empresa
- validar o certificado e registrar a validade
- criar um job de sincronização histórica
- registrar checkpoints por empresa e modelo
- salvar documentos XML com estrutura de pastas por empresa/modelo/tipo/ano/mês
- atualizar a cobertura por competência
- registrar logs de sucesso e falha
- permitir reprocessar jobs com erro

UX/UI:
- design dark com liquid glass
- cards translúcidos
- bordas suaves
- gradientes frios
- dashboard com aparência de software premium
- foco em clareza operacional
- tabelas bonitas e legíveis
- estados vazios bem desenhados
- botões destacados para ações críticas

Entregue:
- estrutura completa do projeto
- páginas principais já montadas
- componentes reutilizáveis
- mocks ou stubs onde faltar integração real
- dados fake para demonstrar funcionamento
- schema inicial do banco
- seed simples
- README explicando como rodar
- código pronto para evoluir em cima

Importante:
- priorize o fluxo completo do MVP
- não invente integrações externas desnecessárias
- mantenha o código fácil de editar
- deixe comentários úteis apenas onde necessário
- organize o projeto para vibecoding rápido e manutenção simples
```

## Próximos ajustes possíveis neste MD

- decidir se o banco inicial será Supabase ou Postgres puro = postgres puro
- decidir se o storage inicial será local ou bucket = local
- definir a grade visual da tela de cobertura
- definir os estados do job
- definir o nível de detalhe dos logs
