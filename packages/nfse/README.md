# @nfewizard/nfse 🪄

> Biblioteca especializada em NFSe (Nota Fiscal de Serviços Eletrônica) - Integração com webservices da SEFAZ

## Atenção: Ao abrir uma issue certifique-se de adicionar as informações abaixo:

Ao abrir issue ou PR, inclua:

```markdown
## Parametrização
- UF: SP
- Certificado: A1
- Método: NFSE_Autorizacao
- Status: ✅ Funcionando / ❌ Com erro
- Município: São Paulo (3550308)
```

## Logs Relevantes

Inclua também os logs gerados no diretório configurado em `pathLogs`.
Lembre-se de adicionar os logs **app.jsonl**, **error.jsonl** e **http.jsonl**.

```jsonl
{"context":"NFSE_Autorizacao","error":{"message":"Rejeição: Consumo Indevido",...}
```

## Sobre a Biblioteca

@nfewizard/nfse é uma biblioteca Node.js especializada em NFSe (Nota Fiscal de Serviços Eletrônica), projetada para simplificar a interação com os webservices municipais. A biblioteca oferece uma solução robusta e otimizada para automação de processos relacionados à NFSe, incluindo:

- **Autorização (Emissão de NFSe)**: Submissão de Notas Fiscais de Serviços Eletrônica para autorização junto aos órgãos municipais.
- **Consulta de NFSe**: Verificação de NFSe por chave de acesso ou ID do DPS.
- **Distribuição DFe**: Consulta e download de documentos fiscais por NSU ou chave.
- **Consulta de Parâmetros Municipais**: Consulta de alíquotas, benefícios, convênios e regimes especiais.
- **Recepção de Eventos**: Tratamento de eventos relacionados à NFSe:
    - **Cancelamento de NFSe**: Cancelamento de notas fiscais autorizadas.
    - **Outros eventos**: Conforme definido pela legislação municipal.

## Características

- ✅ **TypeScript** - Tipos completos incluídos
- ✅ **Certificado A1** - Suporte completo para certificados digitais
- ✅ **Validação de Schema** - Validação automática de XMLs
- ✅ **Logs estruturados** - Sistema de logs em JSONL
- ✅ **Parâmetros Municipais** - Consulta de configurações específicas por município
- ✅ **Eventos NFSe** - Cancelamento e gestão de eventos

## Instalação

```bash
npm install @nfewizard/nfse
# ou
pnpm add @nfewizard/nfse
```

## 🚧 ATENÇÃO 🚧
### Requisitos para instalação

Para utilizar esta biblioteca, é necessário ter o JDK instalado no ambiente.

Caso esteja rodando em um ambiente sem suporte ao JDK (como a Vercel) ou que não permita a adição de layers (diferente do AWS Lambda), é possível configurar a biblioteca como uma external lib e utilizar a seguinte opção ao inicializá-la:
```typescript
useForSchemaValidation: 'validateSchemaJsBased'
```

## Exemplo de Utilização

```typescript
import NFSe from '@nfewizard/nfse';
import { NFSe as NFSeType } from '@nfewizard/types';

// Instanciar com configuração
const nfseWizard = new NFSe({
    dfe: {
        armazenarXMLAutorizacao: true,
        pathXMLAutorizacao: "tmp/NFSe/Autorizacao",
        armazenarXMLRetorno: true,
        pathXMLRetorno: "tmp/NFSe/Retorno",
        armazenarXMLConsulta: true,
        pathXMLConsulta: "tmp/NFSe/Consulta",
        
        pathCertificado: "certificado.pfx",
        senhaCertificado: "1234",
        UF: "SP",
        CPFCNPJ: "99999999999999",
    },
    nfse: {
        ambiente: 2, // 1=Produção, 2=Homologação
        versao: "1.00"
    },
    lib: {
        connection: {
            timeout: 30000,
        },
        log: {
            exibirLogNoConsole: true,
            armazenarLogs: true,
            pathLogs: 'tmp/Logs/NFSe'
        },
        useForSchemaValidation: 'validateSchemaJsBased',
    }
});

// Exemplo 1: Autorização de NFSe
const nfseData: NFSeType = {
    // Dados da NFSe conforme layout do município
} as NFSeType;

const resultado = await nfseWizard.Autorizacao(nfseData);
console.log('Chave de Acesso:', resultado.response.chaveAcesso);

// Exemplo 2: Consulta de NFSe por chave
const consultaPorChave = await nfseWizard.ConsultaPorChave({
    chaveAcesso: '35000000000000000000000000000000000000000001'
});

// Exemplo 3: Consulta de Parâmetros Municipais
const parametros = await nfseWizard.ConsultaParametrosMunicipais({
    codigoMunicipio: '3550308', // São Paulo
    tipoConsulta: 'aliquota'
});

// Exemplo 4: Distribuição por NSU
const distribuicao = await nfseWizard.DistribuicaoPorNSU({
    ultNSU: '0'
});

// Exemplo 5: Cancelamento de NFSe
const eventoCancelamento = {
    chaveAcesso: '35000000000000000000000000000000000000000001',
    tpEvento: '101101', // Cancelamento
    motivo: 'Motivo do cancelamento com no mínimo 15 caracteres'
};

const resultadoCancelamento = await nfseWizard.RegistrarEvento(eventoCancelamento);
```

## Funcionalidades Disponíveis

### 📝 Operações Principais

| Método | Descrição |
|--------|-----------|
| `Autorizacao()` | Autorização de NFSe (Emissão) |
| `ConsultaPorChave()` | Consulta NFSe por chave de acesso |
| `ConsultaPorId()` | Consulta DPS por ID |
| `DistribuicaoPorNSU()` | Download de documentos por NSU |
| `DistribuicaoPorChave()` | Consulta eventos por chave |
| `RegistrarEvento()` | Registro de eventos (cancelamento, etc) |

### ⚙️ Parâmetros Municipais

| Método | Descrição |
|--------|-----------|
| `ConsultaParametrosMunicipais()` | Consulta configurações do município |
| `ConsultaAliquota()` | Consulta alíquotas de serviços |
| `ConsultaBeneficio()` | Consulta benefícios fiscais |
| `ConsultaConvenio()` | Consulta convênios municipais |
| `ConsultaRegimesEspeciais()` | Consulta regimes especiais de tributação |

## Estrutura do Pacote

```
src/
├── adapters/                    # Adaptador principal NFSe
│   ├── NFSe.ts                 # Classe principal com todos os métodos
│   └── index.ts
├── operations/                  # Operações de alto nível
│   ├── NFSeAutorizacao/
│   ├── NFSeConsulta/
│   ├── NFSeDistribuicao/
│   ├── NFSeEventos/
│   └── NFSeParametrosMunicipais/
└── services/                    # Serviços de comunicação
    ├── NFSeAutorizacaoService/
    ├── NFSeConsultaService/
    ├── NFSeDistribuicaoService/
    ├── NFSeEventosService/
    └── NFSeParametrosMunicipaisService/
```

## Dependências

- `@nfewizard/types` - Tipos TypeScript compartilhados
- `@nfewizard/shared` - Utilitários compartilhados (XML, SOAP, Certificados)
- `axios` - Cliente HTTP

## Documentação

Para a documentação completa acesse [NFeWizard-io - Docs](https://nfewizard-org.github.io/)

## Observações

- **Certificado**: Implementado apenas em certificados A1
- **NodeJs**: Testado com versões 16 ou superiores
- **Municípios**: A implementação segue o layout padrão nacional da NFSe. Consulte a documentação específica do seu município

## Contribua para Nossa Biblioteca Open Source

Primeiramente, obrigado por considerar contribuir para nossa biblioteca! Nosso projeto é de código aberto e gratuito para uso, mas manter e desenvolver novas funcionalidades requer tempo e esforço. Se você achar nosso trabalho útil e quiser apoiar nosso desenvolvimento, considere fazer uma doação.

## Licença

GPL-3.0 - Veja [LICENSE](../../LICENSE.txt) para mais detalhes
