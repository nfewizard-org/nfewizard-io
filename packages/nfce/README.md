# @nfewizard/nfce

Biblioteca Node.js para NFCe - Nota Fiscal de Consumidor Eletrônica.

## Instalação

```bash
npm install @nfewizard/nfce @nfewizard/types
# ou
pnpm add @nfewizard/nfce @nfewizard/types
```

## Uso

```typescript
import { NFCeWizard } from '@nfewizard/nfce';

const nfceWizard = new NFCeWizard();
await nfceWizard.NFCE_LoadEnvironment({ config });
```

## Características

- ✅ **Bundle reduzido** - ~3MB (sem DANFE)
- ✅ **Autorização** de NFCe
- ✅ **Consulta** de protocolo
- ✅ **Eventos** (cancelamento, carta de correção)

## Licença

GPL-3.0
