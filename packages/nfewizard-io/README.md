# NFeWizard-io 🪄

## 🛠️ Lib atualizada com NT 2025.002 v.1.35 - Reforma Tributária

---

## 📦 Pacote de Operações NFe

Este é o pacote principal do ecossistema **NFeWizard**, responsável pelas **operações de NFe (Nota Fiscal Eletrônica - Modelo 55)**.

A partir da versão 1.0.0, o NFeWizard foi modularizado em 7 pacotes independentes:

| Pacote | Descrição | Tamanho |
|--------|-----------|---------|
| `nfewizard-io` | ✅ **Operações NFe** (este pacote) | 511.2 KB |
| `@nfewizard/nfce` | Operações NFCe + Cancelamento | 997.7 KB |
| `@nfewizard/nfse` | Operações NFSe | 578.0 KB |
| `@nfewizard/danfe` | Geração de DANFE (NFe e NFCe) | 2.31 MB |
| `@nfewizard/cte` | Operações CTe | 801.9 KB |
| `@nfewizard/types` | Tipos TypeScript | 542.4 KB |
| `@nfewizard/shared` | Utilitários compartilhados | 4.03 MB |

---

## 🚀 Instalação

```bash
npm install nfewizard-io
```

---

## 🎯 Sobre Este Pacote

Este pacote fornece métodos para operações de NFe, incluindo:

- ✅ **Autorização (Emissão de NFe)**: Submissão de Notas Fiscais Eletrônicas para autorização
- ✅ **Distribuição DFe**: Consulta e Download de documentos fiscais eletrônicos
- ✅ **Consulta de Protocolo**: Verificação da situação da NFe na SEFAZ
- ✅ **Inutilização**: Inutilização de números de NFe não utilizados
- ✅ **Consulta de Status**: Monitoramento do status dos serviços da SEFAZ
- ✅ **Recepção de Eventos**:
  - Cancelamento de NFe
  - Carta de Correção
  - Ciência da Operação
  - Confirmação da Operação
  - Desconhecimento da Operação
  - EPEC (Evento Prévio de Emissão em Contingência)
  - Operação Não Realizada

> **⚠️ Importante**: 
> - Para **DANFE** (geração de PDF), instale separadamente: `npm install @nfewizard/danfe`
> - Para **NFCe**, use o pacote: `npm install @nfewizard/nfce`
> - Para **CTe**, use o pacote: `npm install @nfewizard/cte`
> - Para **NFSe**, use o pacote: `npm install @nfewizard/nfse`

---

## 💡 Exemplo de Uso

```typescript
import NFeWizard from 'nfewizard-io';

// Instanciar
const nfeWizard = new NFeWizard();

// Inicializar
await nfeWizard.NFE_LoadEnvironment({
    config: {
        dfe: {
            baixarXMLDistribuicao: true,
            pathXMLDistribuicao: "tmp/DistribuicaoDFe",
            armazenarXMLAutorizacao: true,
            pathXMLAutorizacao: "tmp/Autorizacao",
            armazenarXMLRetorno: true,
            pathXMLRetorno: "tmp/RequestLogs",
            armazenarXMLConsulta: true,
            pathXMLConsulta: "tmp/RequestLogs",
            armazenarXMLConsultaComTagSoap: false,
            armazenarRetornoEmJSON: false,
            pathRetornoEmJSON: "tmp/DistribuicaoDFe",

            pathCertificado: "certificado.pfx",
            senhaCertificado: "1234",
            UF: "SP",
            CPFCNPJ: "99999999999999",
        },
        nfe: {
            ambiente: 2,
            versaoDF: "4.00",
            idCSC: 1,
            tokenCSC: '99999999-9999-9999-9999-999999999999'
        },
        email: {
            host: 'mail.provider.com.br',
            port: 465,
            secure: true, 
            auth: {
                user: 'nfe.example@email.com.br',
                pass: '123456' 
            },
            emailParams: {
                from: 'Company <noreply.company@email.com>',
                to: 'customer.name@email.com.br',
            }
        },
        lib: {
            connection: {
                timeout: 30000,
            },
            log: {
                exibirLogNoConsole: true,
                armazenarLogs: true,
                pathLogs: 'tmp/Logs'
            },
            useOpenSSL: false,
            useForSchemaValidation: 'validateSchemaJsBased',
        }
    }
});

// Exemplo de Distribuição DFe por Chave
const chaveNFe: DFePorChaveNFe = {
    cUFAutor: 35,
    CNPJ: '99999999999999',
    consChNFe: {
        chNFe: '00000000000000000000000000000000000000000000'
    },
}

await nfeWizard.NFE_DistribuicaoDFePorChave(chaveNFe);
```

---

## 🚧 Requisitos

### JDK (Opcional)
Para algumas funções, o JDK é necessário. Caso esteja rodando em ambientes sem suporte ao JDK (Vercel, etc.), configure:

```typescript
lib: {
    useForSchemaValidation: 'validateSchemaJsBased'
}
```

### Exemplo CJS (CommonJS)

```typescript
const NFeWizard = require('nfewizard-io').default;
```

### Serverless Framework

Marque como dependência externa no `.yml`:

```yml
build:
  esbuild:
    bundle: true
    minify: true
    sourcemap: true
    target: 'node20'
    format: 'cjs'
    external:
      - better-sqlite3
      - mysql
      - mysql2
      - oracledb
      - tedious
      - sqlite3
      - pg-query-stream
      - nfewizard-io
```

---

## 📖 Documentação

- **Documentação completa**: [NFeWizard-io - Docs](https://nfewizard-org.github.io/)
- **Guia de Migração v1.0.0**: [BREAKING_CHANGES.md](../../BREAKING_CHANGES.md)
- **Exemplos de Uso**: Pasta [examples/](../../examples/)
  - [Exemplos de NFe](../../examples/NFe/)
  - [Guia de Build](../../examples/BUILD.md)
  - [Instalação Local para Testes](../../examples/INSTALACAO_LOCAL.md)
- **CTe**: [Documentação CTe](../../DOCS_CTE.md)

---

## 🔄 Versão 1.0.0 - Modularização

### 🎉 Principais Mudanças

- ✅ **NFe**: API 100% compatível (sem breaking changes nas operações)
- ⚠️ **DANFE**: Removido deste pacote - use `@nfewizard/danfe`
- ⚠️ **NFCe**: Movido para `@nfewizard/nfce`
- ⚠️ **CTe**: Movido para `@nfewizard/cte`
- 🆕 **NFSe**: Novo pacote `@nfewizard/nfse` (em testes)
- 📉 **Redução de bundle**: Até 77% menor (4.37 MB vs 19.1 MB)
- ✅ **NT 2025.002 v.130**: Suporte completo à Reforma Tributária

📋 **[Consulte o Guia Completo de Migração](../../BREAKING_CHANGES.md)**

---

## ⚙️ Configuração TypeScript

### tsconfig.json recomendado

```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "nodenext",
    "outDir": "dist", 
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "sourceMap": true,
    "inlineSources": true,
    "inlineSourceMap": false,
    "declaration": true,
    "declarationMap": true,
    "moduleResolution": "nodenext"
  }
}
```

### Debug no VS Code (launch.json)

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Debug NFe Wizard",
            "skipFiles": ["<node_internals>/**"],
            "program": "${workspaceFolder}/src/testes.ts",
            "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/tsx",
            "runtimeArgs": [],
            "console": "integratedTerminal",
            "env": {
                "NODE_ENV": "development"
            },
            "sourceMaps": true,
            "restart": true,
            "protocol": "inspector",
            "outFiles": ["${workspaceFolder}/**/*.js"]
        }
    ]
}
```

---

## 📝 Observações

- **Certificado**: Implementado apenas em certificados A1
- **Node.js**: Testado com versões 16 ou superiores
- **UF**: Testado principalmente para São Paulo - reporte issues para outros estados

---

## 🐛 Reportando Issues

Ao abrir uma issue, inclua:

```markdown
## Parametrização
- UF: SP
- Certificado: A1
- Método: NFE_ConsultaStatusServico
- Status: ✅ Funcionando / ❌ Com erro

## Logs Relevantes
Inclua logs de: app.jsonl, error.jsonl, http.jsonl
```

```jsonl
{"context":"NFE_ConsultaProtocolo","error":{"message":"Rejeição: Consumo Indevido",...}
```

---

## 🤝 Contribua

- **Issues**: [GitHub Issues](https://github.com/Maurelima/nfewizard-io/issues)
- **Doações**: [GitHub Sponsors](https://github.com/sponsors/Maurelima)
- **Pix**: `944ce2f2-e90f-400a-a388-bb1fe6719e02` (Marco Lima)

### Outras formas de contribuir

- ⭐ Dar uma estrela no [GitHub](https://github.com/Maurelima/nfewizard-io)
- 🐛 Reportar bugs e sugerir melhorias
- 📝 Contribuir com código e documentação
- 📢 Compartilhar o projeto

---

## 👨‍💻 Criador

| [<img src="https://avatars.githubusercontent.com/u/59918400?s=400&u=3554ebcf0f75263637516867945ebd371e68da71&v=4" width="75px;"/>](https://github.com/Maurelima) |
| :---: |
| [Marco Lima](https://github.com/Maurelima) |

---

## 📄 Licença

Projetado com ♥ por [Marco Lima](https://github.com/Maurelima). Licenciado sob a [GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.pt-br.html).
