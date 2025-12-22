# @nfewizard/cte

Biblioteca Node.js para CTe - Conhecimento de Transporte Eletrônico.

## Instalação

```bash
npm install @nfewizard/cte @nfewizard/types
# ou
pnpm add @nfewizard/cte @nfewizard/types
```

## Uso

```typescript
import { CTeWizard } from '@nfewizard/cte';

const cteWizard = new CTeWizard();
await cteWizard.CTE_LoadEnvironment({ config });
```

## Características

- ✅ **Bundle reduzido** - ~3MB (sem DANFE)
- ✅ **Distribuição DFe** por NSU
- ✅ **Consulta** de documentos

## Licença

GPL-3.0
