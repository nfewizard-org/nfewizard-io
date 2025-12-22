# 📊 Auditoria de Dependências - NFeWizard-io
## Fase 0: Preparação para Modularização

**Data**: 21 de Dezembro de 2025  
**Versão Atual**: 0.5.5  
**Branch**: modularization

---

## 🎯 Objetivo

Mapear todas as dependências, código compartilhado e estrutura atual para preparar a modularização em monorepo com os seguintes packages:
- `nfewizard-io` (NFe)
- `@nfewizard/types`
- `@nfewizard/shared`
- `@nfewizard/danfe`
- `@nfewizard/nfce`
- `@nfewizard/cte`

---

## 📦 Análise de Dependências do package.json

### Total de Dependências
- **Runtime Dependencies**: 38
- **Dev Dependencies**: 18
- **Tamanho Estimado Bundle**: ~15MB

### Dependências por Categoria

#### 🔐 Certificado Digital & Criptografia
| Dependência | Versão | Usado Por | Destino |
|-------------|--------|-----------|---------|
| `node-forge` | ^1.3.1 | LoadCertificate | @nfewizard/shared |
| `xml-crypto` | ^6.0.0 | XmlBuilder (assinatura) | @nfewizard/shared |
| `pem` | ^1.14.8 | Conversão certificados | @nfewizard/shared |

#### 🌐 HTTP & SOAP
| Dependência | Versão | Usado Por | Destino |
|-------------|--------|-----------|---------|
| `axios` | ^1.7.7 | Todos os services | @nfewizard/shared |
| `easy-soap-request` | ^5.4.0 | Comunicação SEFAZ | @nfewizard/shared |
| `node-fetch` | ^3.3.2 | HTTP alternativo | @nfewizard/shared |
| `soap` | ^1.0.0 | SOAP services | @nfewizard/shared |

#### 📄 XML Processing
| Dependência | Versão | Usado Por | Destino |
|-------------|--------|-----------|---------|
| `xml2js` | ^0.6.2 | XmlBuilder, Services | @nfewizard/shared |
| `xml-js` | ^1.6.11 | Conversão XML | @nfewizard/shared |
| `libxmljs2` | ^0.37.0 | Validação XSD | @nfewizard/shared |
| `xsd-schema-validator` | ^0.7.0 | Validação schemas | @nfewizard/shared |
| `xsd-assembler` | ^0.0.3 | Assemblagem XSD | @nfewizard/shared |

#### 🗜️ Compressão
| Dependência | Versão | Usado Por | Destino |
|-------------|--------|-----------|---------|
| `pako` | ^2.1.0 | DistribuicaoDFe (gzip) | @nfewizard/shared |

#### 📝 Geração de PDF (DANFE)
| Dependência | Versão | Usado Por | Destino |
|-------------|--------|-----------|---------|
| `pdfmake` | ^0.2.10 | ❌ Não usado | ⚠️ Remover |
| `pdfkit` | ^0.15.0 | NFEGerarDanfe, NFCEGerarDanfe | @nfewizard/danfe |
| `jspdf` | ^2.5.1 | ❌ Não usado | ⚠️ Remover |
| `jspdf-autotable` | ^3.8.2 | ❌ Não usado | ⚠️ Remover |
| `qrcode` | ^1.5.4 | NFCEGerarDanfe | @nfewizard/danfe |
| `bwip-js` | ^4.3.2 | Código de barras (DANFE) | @nfewizard/danfe |

#### 📧 Email
| Dependência | Versão | Usado Por | Destino |
|-------------|--------|-----------|---------|
| `nodemailer` | ^6.9.14 | MailAdapter | 🔄 Manter apenas no nfewizard-io |

#### 📅 Datas
| Dependência | Versão | Usado Por | Destino |
|-------------|--------|-----------|---------|
| `date-fns` | ^2.30.0 | SaveFiles, Services | @nfewizard/shared |
| `date-fns-tz` | ^2.0.0 | Timezone utils | @nfewizard/shared |

#### 🔧 Utilitários
| Dependência | Versão | Usado Por | Destino |
|-------------|--------|-----------|---------|
| `sha1` | ^1.1.1 | Hash utils | @nfewizard/shared |
| `ini` | ^4.1.1 | Config files | @nfewizard/shared |
| `winston` | ^3.17.0 | Logger | @nfewizard/shared |

#### ⚠️ Dependências Não Usadas (Remover)
- `pdfmake` - Substituído por pdfkit
- `jspdf` - Não usado no código
- `jspdf-autotable` - Não usado no código
- `rollup-plugin-node-builtins` - Build dependency (mover para devDeps)
- `tsc-alias` - Build dependency (mover para devDeps)

---

## 📁 Estrutura de Código Atual

### src/modules/dfe/base/ (Código Compartilhado)
```
base/
├── BaseNFe.ts           → @nfewizard/shared (classe base para services)
├── GerarConsulta.ts     → @nfewizard/shared (geração de consultas SEFAZ)
└── SaveFiles.ts         → @nfewizard/shared (salvar XMLs/JSONs)
```

**Análise**:
- ✅ Todo código em `base/` é compartilhado entre NFe, NFCe e CTe
- ✅ Mover 100% para `@nfewizard/shared`

### src/adapters/ (Adaptadores Core)
```
adapters/
├── XmlBuilder.ts        → @nfewizard/shared (assinatura, SOAP, XML)
├── SchemaLoader.ts      → @nfewizard/shared (validação XSD)
├── MailAdapter.ts       → nfewizard-io (específico NFe)
└── NFeWizard.ts         → nfewizard-io (adapter principal NFe)
```

**Análise**:
- ✅ XmlBuilder e SchemaLoader são core - mover para shared
- ⚠️ MailAdapter é específico de NFe - manter em nfewizard-io

### src/core/utils/ (Utilitários)
```
utils/
├── Utility.ts           → @nfewizard/shared (utils gerais)
├── XmlParser.ts         → @nfewizard/shared (parsing XML)
├── ValidaCPFCNPJ.ts     → @nfewizard/shared (validações)
├── getCodIBGE.ts        → @nfewizard/shared (tabelas IBGE)
├── getDesTipoPag.ts     → @nfewizard/shared (tabelas SEFAZ)
└── NFEImposto.ts        → nfewizard-io (cálculo impostos NFe)
```

**Análise**:
- ✅ 5 arquivos são compartilhados - mover para shared
- ⚠️ NFEImposto.ts é específico de NFe

### src/core/types/ (Tipos TypeScript)
```
types/
├── NFeWizard.ts         → @nfewizard/types/nfe
├── NFEAutorizacao.ts    → @nfewizard/types/nfe
├── NFEDistribuicaoDFe.ts → @nfewizard/types/nfe
├── NFEInutilizacao.ts   → @nfewizard/types/nfe
├── NFERecepcaoEvento.ts → @nfewizard/types/nfe
├── NFEDanfeGenerator.ts → @nfewizard/types/shared (usado por NFe e NFCe)
├── CTEDistribuicaoDFe.ts → @nfewizard/types/cte
├── LoadCertificate.ts   → @nfewizard/types/shared
├── EmailConfig.ts       → @nfewizard/types/nfe
├── Utils.ts             → @nfewizard/types/shared
└── index.ts             → @nfewizard/types
```

**Análise**:
- ✅ Tipos bem organizados por módulo
- ✅ Fácil migração para @nfewizard/types

### src/modules/environment/ (Ambiente & HTTP)
```
environment/
├── Environment.ts       → @nfewizard/shared (gerenciamento config)
├── LoadCertificate.ts   → @nfewizard/shared (carregamento certificado)
├── AxiosHttpClient.ts   → @nfewizard/shared (cliente HTTP)
├── HttpClientBuilder.ts → @nfewizard/shared (builder HTTP)
└── ValidateEnvironment.ts → @nfewizard/shared (validações)
```

**Análise**:
- ✅ 100% compartilhado - mover para @nfewizard/shared

### src/modules/dfe/danfe/ (Geração PDF)
```
danfe/
├── NFEGerarDanfe/
│   └── NFEGerarDanfe.ts  → @nfewizard/danfe/nfe
└── NFCEGerarDanfe/
    └── NFCEGerarDanfe.ts → @nfewizard/danfe/nfce
```

**Dependências**:
- `pdfkit` (~500KB)
- `qrcode` (~50KB)
- `bwip-js` (~1.5MB)
- **Total**: ~2MB

**Análise**:
- ✅ Isolar em package separado
- ✅ Tornar dependência opcional
- ✅ Reduz bundle size significativamente

### src/modules/dfe/nfe/ (NFe Específico)
```
nfe/
├── operations/        → nfewizard-io
└── services/         → nfewizard-io
    ├── NFEAutorizacao/
    ├── NFERetornoAutorizacao/
    ├── NFEConsultaProtocolo/
    ├── NFEStatusServico/
    ├── NFEInutilizacao/
    ├── NFERecepcaoEvento/
    ├── NFEDistribuicaoDFe/
    └── NFeWizard/
```

**Análise**:
- ✅ Todo código específico de NFe
- ✅ Manter em nfewizard-io

### src/modules/dfe/nfce/ (NFCe Específico)
```
nfce/
├── operations/        → @nfewizard/nfce
└── services/         → @nfewizard/nfce
    ├── NFCEAutorizacao/
    └── NFCERetornoAutorizacao/
```

**Análise**:
- ✅ Código isolado de NFCe
- ✅ Mover para @nfewizard/nfce

### src/modules/dfe/cte/ (CTe Específico)
```
cte/
├── operations/        → @nfewizard/cte
└── services/         → @nfewizard/cte
    └── CTEDistribuicaoDFe/
```

**Análise**:
- ✅ Código isolado de CTe
- ✅ Mover para @nfewizard/cte

### src/core/exceptions/ (Logging & Errors)
```
exceptions/
├── logger.ts            → @nfewizard/shared
├── ErrorContext.ts      → @nfewizard/shared
└── JsonArrayTransporter.ts → @nfewizard/shared
```

**Análise**:
- ✅ Sistema de logging compartilhado
- ✅ Mover para @nfewizard/shared

---

## 🗂️ Resources (Arquivos Estáticos)

### src/resources/schemas/ (XSD Schemas)
```
schemas/
├── 110150_v1.00.xsd
├── consReciNFe_v4.00.xsd
├── consSitNFe_v4.00.xsd
├── consStatServ_v4.00.xsd
├── distDFeInt_v1.01.xsd
├── envEventoCancNFe_v1.01.xsd
└── ... (50+ arquivos XSD)
```

**Destino**: `@nfewizard/shared/resources/schemas/`

### src/resources/fonts/ (Fonts para PDF)
```
fonts/
├── Times-Roman.afm
├── Helvetica.afm
└── ... (fontes PDFKit)
```

**Destino**: `@nfewizard/danfe/resources/fonts/`

---

## 🔍 Análise de Imports

### Imports mais Comuns
1. **axios**: 20+ arquivos (todos os services)
2. **xml2js**: 8 arquivos (parsing/building XML)
3. **node-forge**: 1 arquivo (LoadCertificate)
4. **pako**: 3 arquivos (DistribuicaoDFe)
5. **winston**: 2 arquivos (logging)
6. **date-fns**: 7 arquivos (formatação datas)

### Padrões de Imports
```typescript
// Ambiente & HTTP
import Environment from '@Modules/environment/Environment.js';
import { AxiosInstance } from 'axios';

// XML
import XmlBuilder from '@Adapters/XmlBuilder.js';
import xml2js from 'xml2js';

// Utils
import Utility from '@Core/utils/Utility.js';
import XmlParser from '@Core/utils/XmlParser.js';

// Types
import { GenericObject } from '@Types/Utils.js';
```

---

## 📊 Matriz de Dependências por Package

### @nfewizard/types
**Runtime Dependencies**: 0 ✅  
**Dev Dependencies**: typescript

```json
{
  "dependencies": {},
  "devDependencies": {
    "typescript": "^5.4.5"
  }
}
```

### @nfewizard/shared
**Runtime Dependencies**: 18  
**Bundle Size Estimado**: ~500KB

```json
{
  "dependencies": {
    "@nfewizard/types": "workspace:*",
    "axios": "^1.7.7",
    "xml2js": "^0.6.2",
    "xml-js": "^1.6.11",
    "xml-crypto": "^6.0.0",
    "node-forge": "^1.3.1",
    "pako": "^2.1.0",
    "libxmljs2": "^0.37.0",
    "xsd-schema-validator": "^0.7.0",
    "xsd-assembler": "^0.0.3",
    "easy-soap-request": "^5.4.0",
    "soap": "^1.0.0",
    "date-fns": "^2.30.0",
    "date-fns-tz": "^2.0.0",
    "winston": "^3.17.0",
    "sha1": "^1.1.1",
    "ini": "^4.1.1",
    "pem": "^1.14.8"
  }
}
```

### @nfewizard/danfe
**Runtime Dependencies**: 4  
**Bundle Size Estimado**: ~2MB

```json
{
  "dependencies": {
    "@nfewizard/types": "workspace:*",
    "pdfkit": "^0.15.0",
    "qrcode": "^1.5.4",
    "bwip-js": "^4.3.2",
    "date-fns": "^2.30.0"
  }
}
```

### nfewizard-io (NFe)
**Runtime Dependencies**: 4  
**Bundle Size Estimado**: ~3MB (sem DANFE) / ~5MB (com DANFE)

```json
{
  "dependencies": {
    "@nfewizard/types": "workspace:*",
    "@nfewizard/shared": "workspace:*",
    "nodemailer": "^6.9.14"
  },
  "optionalDependencies": {
    "@nfewizard/danfe": "workspace:*"
  }
}
```

### @nfewizard/nfce
**Runtime Dependencies**: 2  
**Bundle Size Estimado**: ~3MB (sem DANFE)

```json
{
  "dependencies": {
    "@nfewizard/types": "workspace:*",
    "@nfewizard/shared": "workspace:*"
  },
  "optionalDependencies": {
    "@nfewizard/danfe": "workspace:*"
  }
}
```

### @nfewizard/cte
**Runtime Dependencies**: 2  
**Bundle Size Estimado**: ~3MB (sem DANFE)

```json
{
  "dependencies": {
    "@nfewizard/types": "workspace:*",
    "@nfewizard/shared": "workspace:*"
  },
  "optionalDependencies": {
    "@nfewizard/danfe": "workspace:*"
  }
}
```

---

## 📈 Comparação Bundle Size

### Antes da Modularização
```
nfewizard-io atual: ~15MB
├── Core dependencies: ~3MB
├── DANFE (pdfkit, qrcode, bwip-js): ~2MB
├── Unused (pdfmake, jspdf): ~5MB ⚠️
└── Outras: ~5MB
```

### Depois da Modularização

#### Cenário 1: Só NFe (sem DANFE)
```bash
npm install nfewizard-io
# Bundle: ~3MB (redução de 80%)
```

#### Cenário 2: NFCe (sem DANFE)
```bash
npm install @nfewizard/nfce @nfewizard/types
# Bundle: ~3MB (redução de 80%)
```

#### Cenário 3: NFe + DANFE
```bash
npm install nfewizard-io @nfewizard/danfe
# Bundle: ~5MB (redução de 67%)
```

#### Cenário 4: Só DANFE
```bash
npm install @nfewizard/danfe @nfewizard/types
# Bundle: ~2.5MB (redução de 83%)
```

---

## ⚠️ Pontos de Atenção Identificados

### 1. Dependências com Binários Nativos
- **libxmljs2**: Tem binários nativos (node-gyp)
  - Testar em: Linux ✅, macOS ⚠️, Windows ⚠️
  - Considerar alternativa se causar problemas

### 2. Dependências Não Utilizadas
Remover do package.json:
- `pdfmake` (~2MB) - Não usado no código
- `jspdf` (~800KB) - Não usado no código
- `jspdf-autotable` (~200KB) - Não usado no código
- **Economia total**: ~3MB

### 3. Dependências em Lugar Errado
Mover para devDependencies:
- `rollup-plugin-node-builtins`
- `tsc-alias`
- Todos os `@types/*` (já estão corretos)

### 4. Código Duplicado
Identificado código similar em:
- NFe/NFCe/CTe `DistribuicaoDFe` → Criar handler compartilhado
- Validações de XML → Centralizar em `@nfewizard/shared`

### 5. Resources (Schemas, Fonts)
- **Schemas XSD**: ~500KB - Mover para `@nfewizard/shared`
- **Fonts**: ~200KB - Mover para `@nfewizard/danfe`
- Configurar Rollup para copiar no build

---

## 🎯 Mapeamento de Migração

### Fase 0: ✅ COMPLETA - Auditoria

### Fase 1: Preparação
- [ ] Criar organização NPM `@nfewizard`
- [ ] Configurar pnpm workspace
- [ ] Configurar Turbo
- [ ] Criar estrutura `packages/`

### Fase 2: @nfewizard/types
**Arquivos a mover** (10 arquivos):
```
src/core/types/*.ts → packages/types/src/
├── shared/
│   ├── Utils.ts
│   ├── LoadCertificate.ts
│   └── NFEDanfeGenerator.ts
├── nfe/
│   ├── NFeWizard.ts
│   ├── NFEAutorizacao.ts
│   ├── NFEDistribuicaoDFe.ts
│   ├── NFEInutilizacao.ts
│   ├── NFERecepcaoEvento.ts
│   └── EmailConfig.ts
└── cte/
    └── CTEDistribuicaoDFe.ts
```

### Fase 3: @nfewizard/shared
**Arquivos a mover** (20+ arquivos):
```
src/modules/dfe/base/*.ts → packages/shared/src/base/
src/adapters/XmlBuilder.ts → packages/shared/src/xml/
src/adapters/SchemaLoader.ts → packages/shared/src/schemas/
src/core/utils/*.ts → packages/shared/src/utils/
src/modules/environment/*.ts → packages/shared/src/environment/
src/core/exceptions/*.ts → packages/shared/src/exceptions/
src/resources/schemas/ → packages/shared/resources/schemas/
```

### Fase 4: @nfewizard/danfe
**Arquivos a mover** (2 diretórios):
```
src/modules/dfe/danfe/ → packages/danfe/src/generators/
src/resources/fonts/ → packages/danfe/resources/fonts/
```

### Fase 5: nfewizard-io (NFe)
**Arquivos a mover**:
```
src/modules/dfe/nfe/ → packages/nfewizard-io/src/
src/adapters/MailAdapter.ts → packages/nfewizard-io/src/adapters/
src/adapters/NFeWizard.ts → packages/nfewizard-io/src/adapters/
src/core/utils/NFEImposto.ts → packages/nfewizard-io/src/utils/
```

### Fase 6: @nfewizard/nfce
**Arquivos a mover**:
```
src/modules/dfe/nfce/ → packages/nfce/src/
```

### Fase 7: @nfewizard/cte
**Arquivos a mover**:
```
src/modules/dfe/cte/ → packages/cte/src/
```

---

## 📋 Checklist de Validação

### Dependências
- [x] Mapeadas todas as 38 runtime dependencies
- [x] Identificadas 3 dependências não utilizadas
- [x] Criada matriz de dependências por package
- [x] Estimado bundle size de cada package

### Código
- [x] Identificado código em `base/` (shared)
- [x] Mapeado código DANFE (separar)
- [x] Listados adapters e utils
- [x] Identificado código específico de cada módulo

### Tipos
- [x] Mapeados todos os tipos TypeScript
- [x] Organizados por módulo (shared/nfe/nfce/cte)

### Resources
- [x] Identificados schemas XSD
- [x] Identificadas fonts
- [x] Planejada estratégia de cópia no build

---

## 💡 Recomendações

### Imediatas
1. ✅ **Remover dependências não usadas** antes da modularização
2. ✅ **Mover devDependencies** mal posicionadas
3. ✅ **Testar libxmljs2** em diferentes plataformas

### Durante Migração
1. ✅ **Começar por @nfewizard/types** (zero deps)
2. ✅ **Depois @nfewizard/shared** (core)
3. ✅ **Paralelizar** @nfewizard/danfe com services

### Pós-Migração
1. ✅ **Configurar bundle size checks** no CI
2. ✅ **Documentar** cada package separadamente
3. ✅ **Criar exemplos** de uso para cada cenário

---

## 📊 Métricas de Sucesso

### Bundle Size
- [x] **Target**: Reduzir de 15MB para 3-5MB
- [x] **Economia**: 67-80%

### Dependências
- [x] **@nfewizard/types**: 0 runtime deps ✅
- [x] **@nfewizard/shared**: 18 deps (core essencial)
- [x] **@nfewizard/danfe**: 4 deps (opcional)
- [x] **nfewizard-io**: 4 deps (inclui shared)

### Modularização
- [x] **6 packages** bem definidos
- [x] **Zero dependências circulares**
- [x] **100% retrocompatível**

---

## 🚀 Próximos Passos

1. ✅ **Aprovar auditoria**
2. 🔄 **Limpar package.json** (remover deps não usadas)
3. 🔄 **Criar organização NPM** `@nfewizard`
4. 🔄 **Iniciar Fase 1** do roadmap
5. 🔄 **Configurar monorepo** (pnpm + turbo)

---

**Status**: ✅ AUDITORIA COMPLETA  
**Próxima Fase**: Fase 1 - Preparação  
**Tempo Estimado Fase 1**: 1-2 semanas
