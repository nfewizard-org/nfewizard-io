# Exemplo de Uso - @nfewizard/cte

## Instalação

```bash
pnpm add @nfewizard/cte
```

## Uso

### 1. Importar e Inicializar

```typescript
import { CTEWizard } from '@nfewizard/cte';

const cteWizard = new CTEWizard();

// Configurar ambiente
await cteWizard.NFE_LoadEnvironment({
  config: {
    nfe: {
      ambiente: 2, // 1=Produção, 2=Homologação
      pathXMLDistribuicao: 'tmp/XMLs/CTe',
      baixarXMLDistribuicao: true,
      armazenarRetornoEmJSON: true
    },
    certificado: {
      pathCertificado: 'certificado.pfx',
      senhaCertificado: '1234'
    }
  }
});
```

### 2. Distribuição CTe por NSU Específico

```typescript
const resultado = await cteWizard.CTE_DistribuicaoDFePorNSU({
  cUFAutor: 35,  // Código da UF (35 = São Paulo)
  CNPJ: '12345678901234',  // CNPJ do interessado
  consNSU: {
    NSU: '000000000000123'  // NSU específico para consultar
  }
});

console.log('Resultado:', resultado);
console.log('Arquivos baixados:', resultado.filesList);
```

### 3. Distribuição CTe por Último NSU

```typescript
const resultado = await cteWizard.CTE_DistribuicaoDFePorUltNSU({
  cUFAutor: 35,  // Código da UF (35 = São Paulo)
  CNPJ: '12345678901234',  // CNPJ do interessado
  distNSU: {
    ultNSU: '000000000000000'  // Último NSU recebido (usar '000000000000000' para buscar dos últimos 3 meses)
  }
});

console.log('Resultado:', resultado);
console.log('Arquivos baixados:', resultado.filesList);
```

### 4. Distribuição CTe Geral

```typescript
const resultado = await cteWizard.CTE_DistribuicaoDFe({
  cUFAutor: 35,
  CNPJ: '12345678901234',
  distNSU: {
    ultNSU: '000000000000000'
  }
});
```

## Estrutura do Retorno

```typescript
{
  data: {
    retDistDFeInt: {
      cStat: '138',  // Código de status
      xMotivo: 'Documento localizado',  // Mensagem
      dhResp: '2025-12-27T21:00:00-03:00',
      // ... mais campos
    }
  },
  xMotivo: 'Documento localizado',
  filesList: ['35250212345678901234550010000000011000000011.xml']
}
```

## Códigos de UF

| UF | Código |
|----|--------|
| SP | 35 |
| RJ | 33 |
| MG | 31 |
| RS | 43 |
| PR | 41 |
| SC | 42 |
| BA | 29 |
| PE | 26 |
| CE | 23 |

Para lista completa, consulte [tabela IBGE](https://www.ibge.gov.br/explica/codigos-dos-municipios.php).

## Códigos de Status Comuns

- **137**: Nenhum documento localizado
- **138**: Documento localizado
- **656**: Rejeição - Consumo indevido

## Exemplo Completo

```typescript
import { CTEWizard } from '@nfewizard/cte';

async function consultarCTe() {
  const cteWizard = new CTEWizard();
  
  try {
    // 1. Carregar ambiente
    await cteWizard.NFE_LoadEnvironment({
      config: {
        nfe: {
          ambiente: 2,
          pathXMLDistribuicao: 'tmp/XMLs/CTe',
          baixarXMLDistribuicao: true,
          armazenarRetornoEmJSON: true
        },
        certificado: {
          pathCertificado: 'certificado.pfx',
          senhaCertificado: '1234'
        }
      }
    });
    
    // 2. Consultar CTe por último NSU
    const resultado = await cteWizard.CTE_DistribuicaoDFePorUltNSU({
      cUFAutor: 35,
      CNPJ: '12345678901234',
      distNSU: {
        ultNSU: '000000000000000'
      }
    });
    
    console.log('Status:', resultado.data.retDistDFeInt.cStat);
    console.log('Motivo:', resultado.xMotivo);
    console.log('Arquivos:', resultado.filesList);
    
    return resultado;
  } catch (error) {
    console.error('Erro ao consultar CTe:', error);
    throw error;
  }
}

consultarCTe();
```
