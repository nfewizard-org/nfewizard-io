# Schemas XSD do CT-e

Este diretório contém os schemas XML (XSD) usados para validar as mensagens trocadas com os
webservices do CT-e antes do envio (`GerarConsulta.gerarConsulta` só valida quando
`SchemaLoader.getSchema(metodo)` retorna um `schemaPath` definido — na ausência do arquivo, a
validação de schema é simplesmente pulada, o que **não** impede o uso da lib, apenas deixa de
validar localmente antes de enviar para a SEFAZ).

## Já presentes (Distribuição DFe, v1.00)
- `distDFeInt_v1.00.xsd`
- `retDistDFeInt_v1.00.xsd`
- `tiposDistDFe_v1.00.xsd`
- `xmldsig-core-schema_v1.01.xsd`

## Pendentes de download (Autorização / Eventos / Consultas, CT-e v4.00)

Os arquivos abaixo fazem parte do "Pacote de Liberação" oficial (`PL_CTe_4.00.zip`), disponível no
Portal Nacional do CT-e (https://www.cte.fazenda.gov.br) ou no Portal da SVRS
(https://dfe-portal.svrs.rs.gov.br/CTe). Depois de baixados e colocados aqui, registre o caminho
de cada um em `packages/shared/src/adapters/SchemaLoader.ts` (`getSchema`), usando os nomes de
método já usados pelos serviços do pacote `@nfewizard/cte`:

| Arquivo (esperado)                     | Método (`this.metodo`)          | Uso                                   |
|-----------------------------------------|----------------------------------|----------------------------------------|
| `cte_v4.00.xsd`                         | `CTeAutorizacao`                 | XML do CT-e (modelo 57)                |
| `cteOS_v4.00.xsd`                       | `CTeAutorizacaoOS`               | XML do CT-e OS (modelo 67)             |
| `GTVe_v4.00.xsd`                        | `CTeGTVeAutorizacao`             | XML da GTV-e (modelo 64)               |
| `cteSimp_v1.00.xsd`                     | `CTeSimplificadoAutorizacao`     | XML do CT-e Simplificado               |
| `consStatServCte_v4.00.xsd`             | `CTeStatusServico`               | Consulta de status do serviço          |
| `consSitCte_v4.00.xsd`                  | `CTeConsultaProtocolo`           | Consulta de situação/protocolo         |
| `eventoCte_v1.00.xsd`                   | `CTeRecepcaoEvento`              | Registro de eventos (genérico)         |
| `cteModalRodoviario_v4.00.xsd`          | (parte específica do `infModal`) | Modal rodoviário                       |
| `cteModalAereo_v4.00.xsd`               | (idem)                           | Modal aéreo                            |
| `cteModalAquaviario_v4.00.xsd`          | (idem)                           | Modal aquaviário                       |
| `cteModalFerroviario_v4.00.xsd`         | (idem)                           | Modal ferroviário                      |
| `cteModalDutoviario_v4.00.xsd`          | (idem)                           | Modal dutoviário                       |
| `cteMultiModal_v4.00.xsd`               | (idem)                           | Multimodal                             |
| `procCTe_v4.00.xsd`                     | —                                 | CT-e processado (assinatura + protocolo), usado por Distribuição DFe |
| `procEventoCTe_v1.00.xsd`               | —                                 | Evento processado, usado por Distribuição DFe |

**Não invente o conteúdo desses arquivos** — eles precisam ser os XSDs oficiais publicados pela
SEFAZ/ENCAT. Enquanto não forem adicionados, os serviços correspondentes funcionam normalmente
(a validação de schema local é apenas pulada; a SEFAZ ainda valida o XML no recebimento).
