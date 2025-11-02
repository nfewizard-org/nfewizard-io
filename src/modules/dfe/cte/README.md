# Módulo CTe - Conhecimento de Transporte Eletrônico

Este módulo implementa os serviços relacionados ao CTe (Conhecimento de Transporte Eletrônico) seguindo os padrões da SEFAZ.

## Estrutura

```
cte/
├── services/
│   └── CTEDistribuicaoDFe/
│       ├── CTEDistribuicaoDFeService.ts         # Serviço principal de distribuição
│       ├── CTEDistribuicaoDFePorNSU.ts          # Consulta por NSU específico
│       ├── CTEDistribuicaoDFePorUltNSU.ts       # Consulta por último NSU
│       └── util/
│           └── DistribuicaoHandler.ts           # Handler para processamento dos XMLs
└── operations/
    └── CTEDistribuicaoDFe/
        ├── CTEDistribuicaoDFe.ts                # Operation principal
        ├── CTEDistribuicaoDFePorNSU.ts          # Operation por NSU
        └── CTEDistribuicaoDFePorUltNSU.ts       # Operation por último NSU
```

## Serviços Implementados

### CTEDistribuicaoDFe

Serviço de distribuição de documentos fiscais eletrônicos do CTe, permitindo a consulta de:

- **Por NSU**: Consulta documentos através de um NSU (Número Sequencial Único) específico
- **Por Último NSU**: Consulta documentos a partir do último NSU conhecido

**IMPORTANTE**: Diferente da NFe, o CTe **NÃO possui consulta por chave de acesso** no serviço de distribuição DFe. A consulta é feita apenas por NSU, conforme norma técnica.

## Características

- **Versão do Layout**: 1.00
- **Namespace**: http://www.portalfiscal.inf.br/cte
- **Descompactação**: Suporta descompactação automática dos XMLs compactados
- **Logs**: Sistema completo de logging para rastreabilidade
- **Tratamento de Eventos**: Suporta eventos do CTe (cancelamento, correção, etc.)

## Uso

```typescript
import CTEDistribuicaoDFe from '@Modules/dfe/cte/operations/CTEDistribuicaoDFe/CTEDistribuicaoDFe';

// Consulta por último NSU
const resultado = await cteDistribuicaoDFe.Exec({
    cUFAutor: '35', // UF do autor
    CNPJ: '12345678901234', // CNPJ do interessado
    distNSU: {
        ultNSU: '000000000000000' // Último NSU conhecido
    }
});

// Consulta por NSU específico
const resultado = await cteDistribuicaoDFe.Exec({
    cUFAutor: '35',
    CNPJ: '12345678901234',
    consNSU: {
        NSU: '000000000000123'
    }
});
```

## Retorno

O serviço retorna um objeto contendo:

```typescript
{
    data: GenericObject,        // Dados completos da resposta
    xMotivo: string,            // Mensagem de retorno da SEFAZ
    filesList: string[]         // Lista de arquivos processados/salvos
}
```

## Códigos de Status

- **137**: Nenhum documento localizado
- **138**: Documento localizado
- Outros códigos seguem a tabela da SEFAZ para distribuição de DFe

## Adaptações do NFe para CTe

Este módulo foi adaptado do módulo NFe com as seguintes alterações:

1. **Namespace**: Alterado de `nfe` para `cte`
2. **Versão**: Alterado de `1.01` para `1.00`
3. **Chaves**: Referências a `chNFe` foram alteradas para `chCTe`
4. **Tags XML**: Adaptadas para suportar tags específicas do CTe:
   - `resCTe` ao invés de `resNFe`
   - `procEventoCTe` ao invés de `procEventoNFe`
   - `chCTe` ao invés de `chNFe`

## Dependências

- `axios`: Cliente HTTP
- `pako`: Descompactação de arquivos
- `xml2js`: Parse de XML
- Classes base do NFeWizard (Environment, Utility, XmlBuilder, etc.)

## Observações

- O módulo utiliza a mesma estrutura base do NFe através da classe `BaseNFE`
- Os XMLs são salvos automaticamente se configurado no ambiente
- Suporta conversão automática de XML para JSON
- Logs detalhados são registrados em todas as etapas do processo
