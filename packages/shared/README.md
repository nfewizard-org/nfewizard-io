# @nfewizard/shared

Core utilities do ecossistema NFeWizard para comunicação com SEFAZ (XML, HTTP, Certificados, Schemas).

## Instalação

```bash
npm install @nfewizard/shared
# ou
pnpm add @nfewizard/shared
```

## Características

- ✅ **XmlBuilder** - Assinatura digital e geração de SOAP
- ✅ **HttpClient** - Cliente HTTP configurado para SEFAZ
- ✅ **LoadCertificate** - Carregamento de certificados A1
- ✅ **SchemaLoader** - Mapeamento de schemas XSD por operação fiscal
- ✅ **NFE_SchemaValidate** - Validação de XML contra schema XSD com relatório humanizado
- ✅ **Utilities** - Funções auxiliares (validações, formatações)

## NFE_SchemaValidate

Função pública que valida um XML fiscal contra o schema XSD oficial, disponível para uso direto ou via facade (`NFeWizard.NFE_SchemaValidate`, `NFSe.NFSe_SchemaValidate`).

```typescript
import { NFE_SchemaValidate, SchemaValidationResult } from '@nfewizard/shared';

const result: SchemaValidationResult = await NFE_SchemaValidate(
    xmlString,
    'NFeAutorizacao',
    { validator: 'validateSchemaJsBased' } // opcional
);

// result.success   — boolean
// result.message   — mensagem-resumo humanizada
// result.errors[]  — SchemaValidationIssue[]: { raw, humanized, element?, line?, column?, expected? }
// result.report    — string multilinha estilo SEFAZ-RS
// result.tableRows — Array pronto para console.table
// result.schema    — arquivo XSD utilizado
// result.metodo    — SchemaValidateMethod informado
```

### Métodos disponíveis (`SchemaValidateMethod`)

| Valor | Schema XSD |
|-------|-----------|
| `'NFeAutorizacao'` / `'NFEAutorizacao'` | `enviNFe_v4.00.xsd` (envelope adicionado automaticamente se ausente) |
| `'NFEStatusServico'` | `consStatServ_v4.00.xsd` |
| `'NFEConsultaProtocolo'` | `consSitNFe_v4.00.xsd` |
| `'RecepcaoEvento'` | `envEvento_v1.00.xsd` |
| `'NFeDistribuicaoDFe'` | `distDFeInt_v1.01.xsd` |
| `'NFEInutilizacao'` | `inutNFe_v4.00.xsd` |
| `'NFERetAutorizacao'` | `consReciNFe_v4.00.xsd` |
| `'CTeDistribuicaoDFe'` | `cte/distDFeInt_v1.00.xsd` |
| `'NFSe_Autorizacao'` | `nfse/DPS_v1.01.xsd` |
| `'NFSe_Consulta'` / `'NFSe_Distribuicao'` | `nfse/NFSe_v1.01.xsd` |
| `'NFSe_Eventos'` | `nfse/pedRegEvento_v1.01.xsd` |
| `'NFSe_ParametrosMunicipais'` | — (API REST, sem XSD) |

### Seleção do validador

1. `options.validator` — escolha explícita do caller.
2. `options.environment.getConfig().lib?.useForSchemaValidation` — valor do config da lib.
3. `'validateSchemaJsBased'` — padrão (sem JDK).

## Licença

GPL-3.0
