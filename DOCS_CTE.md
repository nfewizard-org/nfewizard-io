# CT-e (Conhecimento de Transporte Eletrônico)

O pacote `@nfewizard/cte` cobre o MOC 4.00 do CT-e: autorização (CT-e 57, CT-e OS 67, GTV-e 64 e CT-e Simplificado), eventos, status do serviço, consulta de protocolo/cadastro, contingência (EPEC, FS-DA, SVC), QR Code e distribuição DFe. O DACTE (PDF) é gerado pelo pacote `@nfewizard/danfe`.

Exemplos executáveis: [examples/CTe](examples/CTe).

## 📋 Operações do `CTEWizard`

Inicialize com `new CTEWizard()` + `await cte.NFE_LoadEnvironment({ config })` (mesmo `config` da NF-e; o ambiente vem de `nfe.ambiente` e a UF de `dfe.UF`).

| Método | O que faz |
|---|---|
| `CTE_ConsultaStatusServico()` | Status do autorizador da UF (cStat 107 = em operação) |
| `CTE_ConsultaProtocolo(chCTe)` | Situação/protocolo e eventos de um CT-e |
| `CTE_ConsultaCadastro({ cnpj \| cpf \| ie, uf? })` | Cadastro de contribuintes (mesmo serviço da NF-e) |
| `CTE_Autorizacao(data)` | Autoriza CT-e 57 (JSON `{ CTe }` ou XML) |
| `CTE_AutorizacaoOS(data)` | Autoriza CT-e Outros Serviços (modelo 67) |
| `CTE_GTVeAutorizacao(data)` | Autoriza GTV-e (modelo 64) |
| `CTE_SimplificadoAutorizacao(data)` | Autoriza CT-e Simplificado |
| `CTE_Cancelamento` / `CTE_CartaDeCorrecao` | Eventos 110111 / 110110 |
| `CTE_RegistroMultimodal` | Evento 110160 |
| `CTE_PrestacaoDesacordo` / `CTE_CancelamentoPrestacaoDesacordo` | Eventos 610110 / 610111 (autor: tomador) |
| `CTE_ComprovanteEntrega` / `CTE_CancelamentoComprovanteEntrega` | Eventos 110180 / 110181 |
| `CTE_InsucessoEntrega` / `CTE_CancelamentoInsucessoEntrega` | Eventos 110190 / 110191 |
| `CTE_VinculacaoPagamento` / `CTE_CancelamentoVinculacaoPagamento` | Eventos 110300 / 110301 |
| `CTE_Epec(data)` | EPEC 110113, enviado à SVC |
| `CTE_TransmitirContingencia(data)` | Envia ao autorizador normal CT-e emitidos em EPEC (tpEmis 4) ou FS-DA (5) |
| `CTE_DistribuicaoDFe*` | Distribuição DFe (ver abaixo) |

### Autorização

- O serviço é **síncrono, um documento por chamada** (sem lote nem recibo). Se `CTe` for um array, a lib transmite um a um.
- A lib calcula a chave de acesso e `cDV`, gera `cCT` se omitido, assina o `infCte`, preenche `infCTeSupl/qrCodCTe` e envia o XML compactado (GZip + Base64), como exige o MOC.
- Em homologação (`tpAmb=2`) a razão social de remetente, expedidor, recebedor e destinatário (no CT-e OS e no Simplificado, do tomador; na GTV-e, de remetente e destinatário) é substituída por `CTE EMITIDO EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL`.
- Retorno: `{ success, xMotivo: [{ chCTe, cStat, xMotivo }], xmls: [{ CTe, protCTe, xmlAssinado }] }`.
- Modais: o grupo `infModal` é repassado como informado (rodoviário, aéreo, aquaviário, ferroviário, dutoviário e multimodal estão tipados).

### Eventos

Um evento por chamada (sem `idLote`); `evento` pode ser um objeto ou um array (chamadas sequenciais). Por padrão a lib deriva `cOrgao` (UF) e o CNPJ do autor da chave de acesso, usa `nSeqEvento=1`, `versaoEvento="4.00"` e a hora atual. Nos eventos do tomador (610110/610111) informe `CNPJ` ou `CPF` do tomador. A Carta de Correção bloqueia, antes do envio, os campos que o MOC proíbe corrigir (valores, partes, datas) e preenche a condição de uso oficial.

### Contingência e QR Code

| `tpEmis` | Modalidade | Como usar |
|---|---|---|
| 1 | Normal | `CTE_Autorizacao` |
| 4 | EPEC | `CTE_Epec` (SVC) e depois `CTE_TransmitirContingencia` (em até 7 dias) |
| 5 | FS-DA | Imprima o DACTE no formulário de segurança e transmita com `CTE_TransmitirContingencia` |
| 7 / 8 | SVC-RS / SVC-SP | `CTE_Autorizacao`: a lib envia à SVC. SP, MT e MS usam a SVC-RS (7); as demais UFs, a SVC-SP (8) |

Em contingência `ide.dhCont` e `ide.xJust` são obrigatórios (e proibidos na emissão normal). O QR Code usa o endereço de consulta da UF e, em EPEC/FS-DA, inclui `sign` (RSA-SHA1 da chave com o certificado do emitente).

### Endpoints por UF

`packages/shared/src/config/CTeServicosUrl.json` traz os endpoints oficiais de MG, MS, MT, PR, SP e SVRS (as demais UFs usam a SVRS), produção e homologação, além dos endereços de QR Code. A Distribuição DFe usa o Ambiente Nacional.

### Validação de schema

Os XSDs de autorização/eventos/consultas do CT-e 4.00 **ainda não estão no repositório** (veja `packages/shared/resources/schemas/cte/README.md`). Sem eles a validação local é ignorada e a SEFAZ valida o XML no recebimento.

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

2. **Versão**: o leiaute do CT-e é o **4.00**; a Distribuição DFe usa a versão **1.00** (a vigente no Portal Nacional).

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
