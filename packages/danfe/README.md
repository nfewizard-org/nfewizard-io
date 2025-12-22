# @nfewizard/danfe

Geração de DANFE (Documento Auxiliar da Nota Fiscal Eletrônica) em PDF.

## Instalação

```bash
npm install @nfewizard/danfe @nfewizard/types
# ou
pnpm add @nfewizard/danfe @nfewizard/types
```

## Uso

```typescript
import { DanfeNFe } from '@nfewizard/danfe/nfe';
import { DanfeNFCe } from '@nfewizard/danfe/nfce';

// Gerar DANFE para NFe
const danfe = new DanfeNFe();
await danfe.gerarPDF(nfeXml);

// Gerar DANFE para NFCe
const danfce = new DanfeNFCe();
await danfce.gerarPDF(nfceXml);
```

## Características

- ✅ **Package opcional** - Só instala quem precisa gerar PDF
- ✅ **Suporta NFe, NFCe e CTe**
- ✅ **QR Code** para NFCe
- ✅ **Código de barras** para NFe

## Licença

GPL-3.0
