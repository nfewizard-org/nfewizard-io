# @nfewizard/nfse

Pacote para operações de Nota Fiscal de Serviço Eletrônica (NFSe).

## Funcionalidades

Este pacote fornece operações completas para trabalhar com NFSe:

- **NFSeAutorizacao**: Autorização de Nota Fiscal de Serviço Eletrônica
- **NFSeConsulta**: Consulta de NFSe por chave ou ID
- **NFSeDistribuicao**: Distribuição de documentos fiscais
- **NFSeEventos**: Registro de eventos da NFSe
- **NFSeParametrosMunicipais**: Consulta de parâmetros municipais

## Estrutura

```
src/
├── adapters/        # Adaptadores para NFSe
├── operations/      # Operações de alto nível
└── services/        # Serviços de comunicação com webservices
```

## Instalação

```bash
pnpm add @nfewizard/nfse
```

## Uso

```typescript
import { NFSeAutorizacao } from '@nfewizard/nfse';

// Exemplo de uso
const autorizacao = new NFSeAutorizacao(service);
const resultado = await autorizacao.executar(nfse);
```

## Dependências

- `@nfewizard/types`: Tipos TypeScript compartilhados
- `@nfewizard/shared`: Utilitários compartilhados

## Licença

GPL-3.0
