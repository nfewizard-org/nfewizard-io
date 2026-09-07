# Distribuição de CT-e (Conhecimento de Transporte Eletrônico)

A biblioteca NFeWizard-io agora oferece suporte para consulta e distribuição de documentos CT-e através dos webservices da SEFAZ.

## 📦 Funcionalidades Disponíveis

- **Consulta por NSU**: Busca documentos CT-e a partir de um NSU específico
- **Consulta por Último NSU**: Busca documentos CT-e a partir do último NSU consultado
- **Download Automático**: Salvamento automático de documentos CT-e descompactados
- **Geração do DACTE**: Emissão em PDF do Documento Auxiliar do Conhecimento de Transporte Eletrônico

## 🚀 Como Utilizar

### Pré-requisitos

Certifique-se de ter inicializado o ambiente com o método `NFE_LoadEnvironment()` conforme a documentação principal.

### Exemplo 1: Consulta por NSU Específico

```typescript
import CTeWizard from '@nfewizard/cte';
import { DFePorNSUCTe } from 'nfewizard-io';

const nfeWizard = new CTeWizard();

// Inicializar ambiente (veja README.md para configuração completa)
await nfeWizard.NFE_LoadEnvironment({ config: { /* ... */ } });

// Consultar CT-e por NSU específico
const NSUCTe: DFePorNSUCTe = {
    cUFAutor: 41, // Código da UF do autor
    CNPJ: '99999999999999', // CNPJ do interessado
    consNSU: {
        NSU: '000000000000001' // NSU específico a consultar
    }
};

await nfeWizard.CTE_DistribuicaoDFePorNSU(NSUCTe);
```

### Exemplo 2: Consulta por Último NSU

```typescript
import CTeWizard from '@nfewizard/cte';
import { DFePorUltimoNSUCTe } from '@nfewizard/type/cte';

const nfeWizard = new CTeWizard();

// Inicializar ambiente
await nfeWizard.NFE_LoadEnvironment({ config: { /* ... */ } });

// Consultar CT-e a partir do último NSU
const ultimoNSUCTe: DFePorUltimoNSUCTe = {
    cUFAutor: 35, // Código da UF do autor (35 = SP)
    CNPJ: '99999999999999', // CNPJ do interessado
    distNSU: {
        ultNSU: '000000000000000' // Último NSU consultado (use '0' para buscar desde o início)
    }
};

await nfeWizard.CTE_DistribuicaoDFePorUltNSU(ultimoNSUCTe);
```

## 🖨️ Geração do DACTE

O DACTE é gerado pelo pacote `@nfewizard/danfe`, através da função `CTE_GerarDacte`.

```bash
npm install @nfewizard/danfe
```

### A partir do XML autorizado

Aceita o `cteProc` (CT-e + protocolo) ou o `CTe` solo. Neste formato a `chave` é
opcional, pois é lida de `protCTe.infProt.chCTe` ou de `infCte.Id`:

```typescript
import fs from 'fs';
import { CTE_GerarDacte } from '@nfewizard/danfe';

const resultado = await CTE_GerarDacte({
    data: fs.readFileSync('./tmp/DistribuicaoDFe/3525...1234-proc-000000000000102.xml', 'utf8'),
    outputPath: './dacte.pdf'
});

console.log(resultado.message); // DACTE Gerado em './dacte.pdf'
```

### A partir do JSON

```typescript
import { CTE_GerarDacte } from '@nfewizard/danfe';
import { CTEGerarDacteProps } from '@nfewizard/types/cte';

const params: CTEGerarDacteProps = {
    data: {
        CTe: { /* infCte */ } as any,
        protCTe: { /* infProt */ } as any
    },
    chave: '99999999999999999999999999999999999999999999',
    outputPath: './dacte.pdf'
};

await CTE_GerarDacte(params);
```

### O que o DACTE contém

- Canhoto de recebimento, código de barras da chave de acesso e QR Code (`infCTeSupl.qrCodCTe`)
- Identificação do emitente, modal, tipo do CT-e e protocolo de autorização
- Origem e destino da prestação, CFOP e natureza da prestação
- Remetente, destinatário, expedidor, recebedor e tomador do serviço
- Dados da carga (produto predominante, quantidades) e componentes do valor da prestação
- Informações relativas ao ICMS (`ICMS00`, `ICMS20`, `ICMS45`, `ICMS60`, `ICMS90`, `ICMSOutraUF` e `ICMSSN`)
- Documentos originários (NF-e, notas em papel e outros), com quebra automática de página
- Quadro específico do modal informado (rodoviário, aéreo, aquaviário, ferroviário, dutoviário ou multimodal)

## 📂 Estrutura de Arquivos Salvos

Quando a opção `baixarXMLDistribuicao` estiver habilitada, os documentos CT-e serão salvos na pasta configurada em `pathXMLDistribuicao`.

Para evitar sobrescrita quando houver múltiplos `docZip` da mesma chave no lote, os nomes incluem tipo e NSU:

- Resumo (`resCTe`): `<chave>-res-<nsu>.xml`
- Documento processado (`cteProc`): `<chave>-proc-<nsu>.xml`
- Evento (`procEventoCTe`): `<chave>-event-<tpEvento>-<nsu>.xml`

Exemplo:

```text
3525...1234-res-000000000000101.xml
3525...1234-proc-000000000000102.xml
3525...1234-event-110110-000000000000103.xml
```



## 🌐 Ambientes Suportados

A biblioteca suporta automaticamente os ambientes de:
- **Produção**: `https://www1.cte.fazenda.gov.br/CTeDistribuicaoDFe/CTeDistribuicaoDFe.asmx`
- **Homologação**: `https://hom1.cte.fazenda.gov.br/CTeDistribuicaoDFe/CTeDistribuicaoDFe.asmx`

O ambiente é selecionado automaticamente com base na configuração `nfe.ambiente`.

## ⚠️ Observações Importantes


1. **Logs**: Todos os logs de comunicação são salvos em `tmp/Logs/` incluindo:
   - `app.jsonl` - Logs gerais da aplicação
   - `http.jsonl` - Logs de comunicação HTTP
   - `error.jsonl` - Logs de erros

2. **Versão**: A versão do CT-e implementada é **1.00**.

## 🐛 Tratamento de Erros

A biblioteca lança exceções em caso de:
- Rejeição pela SEFAZ
- Problemas de comunicação
- Certificado inválido ou expirado
- XML malformado

## 📚 Tipos Disponíveis

```typescript
// Importação dos tipos
import { 
    DFePorNSUCTe, 
    DFePorUltimoNSUCTe,
    ConsultaCTe,
    CTEGerarDacteProps,
    LayoutCTe,
    ProtCTe
} from '@nfewizard/types/cte';
```

## 🤝 Contribua

Encontrou algum problema ou tem sugestões? Abra uma issue no [GitHub](https://github.com/nfewizard-org/nfewizard-io/issues).

---

**Desenvolvido com ♥ por [Marco Lima](https://github.com/Maurelima)**
