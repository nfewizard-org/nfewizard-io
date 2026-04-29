# NFeWizard-io — Contexto Geral do Projeto

> Este documento concentra o contexto técnico e funcional do **NFeWizard-io** para servir
> como referência rápida para desenvolvedores humanos e agentes de IA que precisem
> entender, manter ou estender a biblioteca.

---

## 1. O que é a biblioteca

**NFeWizard-io** é uma biblioteca **Node.js / TypeScript** que abstrai a comunicação com
os webservices da **SEFAZ** (Secretaria da Fazenda) e prefeituras, oferecendo uma API
de alto nível para automação de processos fiscais brasileiros relacionados a:

- **NF-e** — Nota Fiscal Eletrônica (modelo 55)
- **NFC-e** — Nota Fiscal de Consumidor Eletrônica (modelo 65)
- **NFS-e** — Nota Fiscal de Serviços Eletrônica (padrão nacional)
- **CT-e** — Conhecimento de Transporte Eletrônico
- **DANFE / DANFCE / DANFSe** — Geração do documento auxiliar (PDF)

Está alinhada à **NT 2025.002 v1.35 — Reforma Tributária** e suporta operações em
ambiente de **homologação (2)** e **produção (1)**.

### Para que serve

Substitui o trabalho de baixo nível de:

- montar XMLs SOAP/SEFAZ conforme schemas XSD oficiais,
- assinar digitalmente com certificado A1 (`.pfx`) usando XMLDSig,
- conectar via `https.Agent` com TLS mútuo,
- validar contra schemas (`xsd-schema-validator` via JDK ou `libxmljs2` JS-based),
- tratar retornos SOAP, parsear XML, salvar artefatos e logs estruturados.

### O que ela faz (capacidades funcionais)

| Categoria | Operações principais |
|-----------|----------------------|
| **Status** | `NFE_ConsultaStatusServico` |
| **Autorização** | `NFE_Autorizacao`, `NFCE_Autorizacao`, `NFSe_Autorizacao` (síncrona) |
| **Consulta** | `NFE_ConsultaProtocolo`, `NFE_DistribuicaoDFe` (por NSU, ÚltNSU, Chave) |
| **Inutilização** | `NFE_Inutilizacao` |
| **Eventos NFe** | Cancelamento, Carta de Correção, Ciência/Confirmação/Desconhecimento da Operação, Operação Não Realizada, **EPEC** |
| **Eventos NFCe** | Cancelamento (no pacote `@nfewizard/nfce`) |
| **CT-e** | `CTE_DistribuicaoDFe` |
| **DANFE** | `NFE_GerarDanfe`, `NFCE_GerarDanfe`, `NFSe_GerarDanfe` (PDF) |
| **E-mail** | Envio de DANFE/XML para destinatários via `nodemailer` |

---

## 2. Arquitetura e organização do repositório

O repositório é um **monorepo gerenciado por `pnpm` workspaces + `Turborepo`**, com
publicação coordenada via **Changesets**.

```
packages/
├── types/         → @nfewizard/types     (definições TypeScript puras)
├── shared/        → @nfewizard/shared    (núcleo: env, http, xml, base classes, logger)
├── danfe/         → @nfewizard/danfe     (geradores de PDF — pdfkit/handlebars)
├── nfewizard-io/  → nfewizard-io         (pacote raiz — NF-e + facade de retrocompat)
├── nfce/          → @nfewizard/nfce      (NFC-e + cancelamento)
├── nfse/          → @nfewizard/nfse      (NFS-e padrão nacional)
└── cte/           → @nfewizard/cte       (CT-e)
```

### 2.1 Por que monorepo modular

A v1.0.0 quebrou o pacote monolítico anterior em pacotes especializados. Motivações:

- **Bundle splitting** — redução de até 77% no tamanho final (consumidor instala só o que usa).
- **Boundaries claros** — cada documento fiscal tem ciclo de vida e schemas próprios.
- **Builds incrementais** — `turbo` cacheia builds por pacote.
- **Versionamento independente** — Changesets permite bumps por pacote.

### 2.2 Dependências entre pacotes

```
types  ──┐
         ├──► shared ──► nfewizard-io
         │           ├──► nfce
         │           ├──► nfse
         │           ├──► cte
         │           └──► danfe
```

Regra: **`types` não depende de nada**, **`shared` só depende de `types`**, e os
pacotes de domínio (nfewizard-io, nfce, nfse, cte, danfe) consomem `shared` + `types`.

---

## 3. Stack e ferramentas

| Camada | Tecnologia |
|--------|------------|
| Linguagem | **TypeScript 5.4** (target ES2020, ESM com fallback CJS) |
| Runtime | Node.js **>= 16** (recomendado 18/20) |
| Pacote | **pnpm 8+** (workspaces) |
| Orquestração | **Turborepo 2.x** (`turbo run build|test|lint|typecheck`) |
| Bundler | **Rollup 4** + `rollup-plugin-typescript2` + `esbuild-minify` |
| Versionamento | **@changesets/cli** |
| HTTP | **axios** (com `https.Agent` e mTLS via `.pfx`) |
| XML build | **fast-xml-parser** (`XmlBuilder`, `XmlParser`) |
| Assinatura digital | **xmldsigjs** / **node-forge** + OpenSSL opcional |
| Validação XSD | **xsd-schema-validator** (JDK) **ou** **libxmljs2** (`validateSchemaJsBased`) |
| PDF (DANFE) | **pdfkit** + **handlebars** + **bwip-js** (códigos de barras) |
| Logger | **winston** com transports custom (`JsonArrayTransporter`) — saída `app.jsonl`, `error.jsonl`, `http.jsonl` |
| Email | **nodemailer** |
| Testes | **Jest 29** + **ts-jest** |

---

## 4. Padrões de design (Design Patterns)

A biblioteca aplica conscientemente vários patterns clássicos:

### 4.1 Facade
- `NFeWizard` (em [packages/nfewizard-io/src/NFeWizard.ts](packages/nfewizard-io/src/NFeWizard.ts)) é a **fachada pública** do pacote raiz. Expõe métodos `NFE_*` que escondem a complexidade interna.
- `NFCEWizard`, `CTEWizard`, `NFSeWizard` seguem o mesmo padrão em seus pacotes.

### 4.2 Service / Operation (Command-like)
- Cada operação de webservice tem **dois objetos**:
  - **`*Service`** (ex.: `NFEStatusServicoService`): conhece schema, URL, contentType, monta XML e faz a chamada HTTP.
  - **`*Operation`** (ex.: `NFEStatusServico`): orquestra o ciclo `Exec()` (validação → service → parsing → retorno).
- Pasta convencional: `src/nfe/operations/<Dominio>/` e `src/nfe/services/<Dominio>/`.

### 4.3 Template Method
- `BaseNFE` (em [packages/shared/src/base/BaseNFe.ts](packages/shared/src/base/BaseNFe.ts)) define o **fluxo padrão**: `gerarXml()` (abstrato) → `setContentType()` → `callWebService()` → tratamento de resposta. Subclasses preenchem o método abstrato.
- `BaseNFSe` cumpre o papel equivalente para NFS-e.

### 4.4 Builder
- `XmlBuilder` (em [packages/shared/src/adapters/XmlBuilder.ts](packages/shared/src/adapters/XmlBuilder.ts)) constrói envelopes SOAP/XML de forma fluente.
- `HttpClientBuilder` constrói o `AxiosInstance` com agent TLS, timeouts, interceptors.

### 4.5 Adapter
- `MailAdapter` (em [packages/nfewizard-io/src/MailAdapter.ts](packages/nfewizard-io/src/MailAdapter.ts)) adapta `nodemailer`.
- `AxiosHttpClient` adapta `axios` à interface `HttpClient` definida em `@nfewizard/types/shared/HttpClient.ts`.
- Pasta `packages/shared/src/adapters/` concentra adapters de XML.

### 4.6 Strategy
- Validação de schema é estratégica: `useForSchemaValidation: 'validateSchemaJsBased' | 'validateSchemaJavaBased'` (decide entre `libxmljs2` ou JDK em runtime).
- `setContentType()` aplica estratégia por UF (`MG, GO, MT, MS, AM, DF` usam `application/soap+xml`).

### 4.7 Proxy (Interception)
- `NFeWizardService` usa `Proxy` no construtor para **interceptar todas as chamadas** e executar `validateEnvironment()` antes de cada operação (exceto `NFE_LoadEnvironment`). Garante que a lib só opere com ambiente carregado.

### 4.8 Singleton (escopo de instância)
- `Environment` mantém `config`, `certificate`, `agent` e flag `isLoaded`. É instanciado uma vez por `NFeWizard` e injetado em todos os services.
- `logger` (winston) é singleton de módulo, inicializado uma única vez via `logger.initialize()`.

### 4.9 Dependency Injection (manual via construtor)
- Services recebem `(environment, utility, xmlBuilder, axios, saveFiles, gerarConsulta)` no construtor — facilita testes e troca de implementações.

### 4.10 Repository (leve)
- `SaveFiles` encapsula persistência de XML/JSON em filesystem.
- `SchemaLoader` encapsula carregamento dos XSDs e arquivos `*ServicosUrl.json`.

---

## 5. Princípios e arquitetura de software

- **Layered architecture**: `Facade → Service → Operation → BaseNFE → HttpClient` com responsabilidades bem separadas.
- **SOLID**:
  - **SRP** — cada *Service* trata um único webservice; cada *Operation* uma única operação fiscal.
  - **OCP** — novas operações são adicionadas estendendo `BaseNFE` sem alterar o núcleo.
  - **LSP** — qualquer subclasse de `BaseNFE` é intercambiável no fluxo.
  - **ISP** — interfaces em `@nfewizard/types/shared/*Impl.ts` (ex.: `NFeWizardImpl`, `SaveFilesImpl`, `GerarConsultaImpl`) são pequenas e específicas.
  - **DIP** — services dependem de abstrações (`AxiosInstance`, interfaces `*Impl`).
- **Backward compatibility first**: o pacote `nfewizard-io` mantém **100% da API antiga**; métodos movidos (CT-e, DANFE) continuam expostos com `console.warn` orientando à migração.
- **Fail fast com contexto**: `ErrorContext` + logger estruturado JSONL preservam contexto (`context`, `method`, `url`, `duration`).
- **Configuração explícita**: nenhuma variável de ambiente mágica — tudo passa por `NFE_LoadEnvironment({ config })` tipado em `NFeWizardProps`.

---

## 6. Fluxo de execução típico

Exemplo: `NFE_ConsultaStatusServico()`

1. **Cliente** chama `nfeWizard.NFE_ConsultaStatusServico()`.
2. **Facade** (`NFeWizard`) delega para `NFeWizardService`.
3. **Proxy** intercepta e roda `validateEnvironment()` (verifica `Environment.isLoaded`).
4. **Factory inline** cria `NFEStatusServicoService` injetando dependências.
5. **Operation** `NFEStatusServico.Exec()`:
   - chama `gerarConsulta.gerarXml(...)` → `XmlBuilder`
   - resolve URL via `SchemaLoader` + `NFeServicosUrl.json` (UF + ambiente)
   - chama `BaseNFE.callWebService(xml, url, contentType, action, agent)`
   - `axios.post` com `httpsAgent` (mTLS via certificado)
   - resposta é parseada por `XmlParser`
   - `SaveFiles` persiste `consulta`/`retorno` se configurado
6. **Logger** registra eventos em `tmp/Logs/{app,error,http}.jsonl`.
7. Resposta tipada retorna ao cliente.

---

## 7. Configuração (`NFeWizardProps`)

Resumo das chaves relevantes (definição completa em [packages/types/src/shared/NFeWizardProps.ts](packages/types/src/shared/NFeWizardProps.ts)):

- **`dfe`** — certificado, UF, CPF/CNPJ, paths e flags de armazenamento de XML/JSON.
- **`nfe`** — `ambiente` (1=prod, 2=homolog), `versaoDF` (`"4.00"`), `idCSC`, `tokenCSC` (NFCe).
- **`email`** — host, port, secure, auth, `emailParams.from/to`.
- **`lib`**:
  - `connection.timeout`
  - `log.{exibirLogNoConsole, armazenarLogs, pathLogs}`
  - `useOpenSSL` — força conversão do `.pfx` via OpenSSL
  - `useForSchemaValidation` — `'validateSchemaJsBased'` (sem JDK) | `'validateSchemaJavaBased'`

---

## 8. Convenções de código

- **Nomenclatura**:
  - Classes/Operations em **PascalCase** com prefixo do domínio (`NFE`, `NFCE`, `NFSe`, `CTE`).
  - Métodos públicos da facade seguem `<DOMINIO>_<Operacao>` (`NFE_ConsultaProtocolo`, `NFCE_Autorizacao`).
  - Interfaces sufixadas com `Impl` (`NFeWizardImpl`, `SaveFilesImpl`).
- **Imports** sempre com extensão `.js` (ESM Node compatibility, mesmo em `.ts`).
- **Comentários de licença GPL-3.0** no topo de todo arquivo `.ts`.
- **Erros**: `throw new Error(\`<Metodo>: \${error.message}\`)`, sempre logando antes via `logger.error`.
- **Commits**: Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`).
- **Testes**: Jest, com fixtures em `src/__tests__/` (factory functions + unit).

---

## 9. Build, scripts e workflows

Scripts no `package.json` raiz (orquestrados por Turbo):

- `pnpm build` — builda todos os pacotes na ordem topológica.
- `pnpm test` — roda Jest em todos os pacotes (depende de build).
- `pnpm typecheck` — verifica tipos sem emitir.
- `pnpm dev` — modo watch paralelo.
- `pnpm changeset` / `pnpm version` / `pnpm release` — fluxo de release.
- `scripts/local-install.sh` — instala todos os pacotes localmente para teste em projetos consumidores.
- `scripts/publish-packages.sh` — publica os pacotes na npm.

Cada pacote possui seu próprio `rollup.config.js` que gera `dist/` em **ESM + CJS + .d.ts**.

---

## 10. Recursos úteis e diretórios fora de `src`

- `NTs/` — Notas Técnicas oficiais da SEFAZ (PDFs de referência).
- `docs/` — documentação adicional.
- `examples/` — projetos de exemplo (`NFe/`, `NFCe/`, `NFSe/`) consumindo a lib.
- `STATUS_HOMOLOGACAO.md` — matriz de status de homologação por UF.
- `BREAKING_CHANGES.md` — guia de migração da v1.0.0.
- `ROADMAP.md` — funcionalidades planejadas.
- `tmp/` — saída padrão para XMLs, JSONs de retorno e logs em desenvolvimento.
- `src/resources/schemas/` — schemas XSD oficiais para validação.

---

## 11. Pontos de atenção para contribuidores e agentes de IA

- **Nunca quebrar a API pública do `nfewizard-io`** sem documentar em `BREAKING_CHANGES.md` e abrir um Changeset major.
- **Métodos depreciados** (CT-e e DANFE no pacote raiz) emitem `console.warn` formatado — **manter o aviso intacto** ao tocar nesses arquivos.
- **JDK** é exigido apenas para `validateSchemaJavaBased`. Em ambientes serverless (Vercel, etc.) o consumidor deve usar `validateSchemaJsBased` e marcar `nfewizard-io` como `external` no bundler.
- **mTLS**: o certificado `.pfx` é carregado em memória pelo `LoadCertificate`. Nunca logar o conteúdo do certificado nem a senha.
- **Logs**: usar sempre `logger` (winston) com `context` semântico — não usar `console.log` em código de produção (apenas nos retornos da facade, por hábito de DX).
- **Schemas e URLs por UF** estão em `packages/shared/src/config/*.json`. Atualizações de NT geralmente impactam esses arquivos + XSDs.
- **Imports cross-package** devem usar os aliases `@nfewizard/types`, `@nfewizard/shared`, etc., e nunca caminhos relativos para outros pacotes.
- **Ao adicionar uma operação nova**:
  1. Criar pasta em `src/<dominio>/operations/<NomeOperacao>/` e `src/<dominio>/services/<NomeOperacao>/`.
  2. Service estende `BaseNFE` (ou `BaseNFSe`).
  3. Adicionar método na facade (ex.: `NFeWizard`) e na interface `*Impl` em `@nfewizard/types`.
  4. Atualizar URLs/schemas em `@nfewizard/shared/config` se necessário.
  5. Adicionar testes em `src/__tests__/`.
  6. Criar Changeset (`pnpm changeset`).

---

## 12. Resumo executivo

> **NFeWizard-io** é um **monorepo TypeScript** que entrega uma **facade fluente** sobre os
> webservices fiscais brasileiros, encapsulando assinatura digital, comunicação SOAP/mTLS,
> validação XSD, geração de DANFE em PDF, persistência de artefatos e logging estruturado.
> A arquitetura combina **Facade + Service/Operation + Template Method + Builder + Strategy + Proxy**,
> respeita SOLID e prioriza **retrocompatibilidade** e **modularidade** para reduzir bundle no consumidor.
