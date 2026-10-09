# @nfewizard/cte

Biblioteca Node.js para CT-e - Conhecimento de Transporte Eletrônico (MOC 4.00).

## Instalação

```bash
npm install @nfewizard/cte @nfewizard/types
# ou
pnpm add @nfewizard/cte @nfewizard/types
```

## Uso

```typescript
import { CTEWizard } from '@nfewizard/cte';

const cte = new CTEWizard();
await cte.NFE_LoadEnvironment({ config });

await cte.CTE_ConsultaStatusServico();
const retorno = await cte.CTE_Autorizacao({ CTe: { infCte: { /* ... */ } } });
await cte.CTE_Cancelamento({ evento: { chCTe, tpEvento: '110111', detEvento: { descEvento: 'Cancelamento', nProt, xJust } } });
```

## Características

- ✅ **Autorização** de CT-e (57), CT-e OS (67), GTV-e (64) e CT-e Simplificado, com assinatura, QR Code e envio compactado
- ✅ **Eventos**: Cancelamento, Carta de Correção, Registro Multimodal, Prestação em Desacordo, Comprovante e Insucesso de Entrega, Vinculação de Pagamento e EPEC
- ✅ **Contingência**: EPEC, FS-DA e SVC (RS/SP)
- ✅ **Consultas**: status do serviço, protocolo e cadastro
- ✅ **Distribuição DFe** por NSU
- ✅ **DACTE** via `@nfewizard/danfe` (opcional)

Documentação completa em [DOCS_CTE.md](../../DOCS_CTE.md) e exemplos em [examples/CTe](../../examples/CTe).

## Licença

GPL-3.0
