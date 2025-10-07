# ⚠️ DIFERENÇAS IMPORTANTES: NFe vs CTe

## 🔴 ATENÇÃO: Diferenças na Distribuição DFe

Este documento destaca as **diferenças críticas** entre a Distribuição DFe da NFe e do CTe, conforme norma técnica oficial.

---

## 📋 Comparação Detalhada

| Característica | NFe | CTe | Observação |
|----------------|-----|-----|------------|
| **Consulta por Chave** | ✅ SIM | ❌ NÃO | CTe NÃO possui |
| **Consulta por NSU** | ✅ SIM | ✅ SIM | Ambos possuem |
| **Consulta por Último NSU** | ✅ SIM | ✅ SIM | Ambos possuem |
| **Versão do Layout** | 1.01 | 1.00 | Versões diferentes |
| **Namespace** | nfe | cte | Namespaces diferentes |
| **Tag de Chave** | chNFe | chCTe | Tags diferentes |
| **Tag de Resumo** | resNFe | resCTe | Tags diferentes |
| **Tag de Evento** | procEventoNFe | procEventoCTe | Tags diferentes |

---

## ❌ O que NÃO existe no CTe

### 1. Consulta por Chave de Acesso (consChCTe)

**NFe possui:**
```xml
<consChNFe>
    <chNFe>35210112345678901234550010000000011000000001</chNFe>
</consChNFe>
```

**CTe NÃO possui!** ❌

A Distribuição DFe do CTe **NÃO permite consulta por chave de acesso**. Esta funcionalidade existe apenas na NFe.

### Por que essa diferença?

De acordo com a **Nota Técnica 2014.002 - Distribuição de DF-e**, o serviço de distribuição do CTe foi implementado **apenas com consulta por NSU**, seguindo modelo diferente da NFe.

---

## ✅ O que o CTe possui

### 1. Consulta por NSU Específico

```xml
<consNSU>
    <NSU>000000000000123</NSU>
</consNSU>
```

### 2. Consulta por Último NSU

```xml
<distNSU>
    <ultNSU>000000000000000</ultNSU>
</distNSU>
```

---

## 🔧 Implementação Correta

### ✅ Correto - Serviços Implementados

```typescript
// Apenas 2 tipos de consulta no CTe
- CTEDistribuicaoDFePorNSU        // Consulta por NSU específico
- CTEDistribuicaoDFePorUltNSU     // Consulta por último NSU
```

### ❌ Incorreto - NÃO implementar

```typescript
// NUNCA implementar isso para CTe
- CTEDistribuicaoDFePorChave      // ❌ NÃO EXISTE!
```

---

## 📚 Referências Normativas

### NFe - Distribuição DFe
- **Versão**: 1.01
- **Modalidades**: Por Chave, Por NSU, Por Último NSU
- **NT**: 2014.002 v1.60

### CTe - Distribuição DFe
- **Versão**: 1.00
- **Modalidades**: Por NSU, Por Último NSU (apenas)
- **NT**: 2014.002 - CTe

---

## 💡 Como Consultar um CTe Específico?

Como não existe consulta por chave na Distribuição DFe do CTe, você tem duas opções:

### Opção 1: Usar outro serviço
Para consultar um CTe específico por chave, use o serviço **CTeConsultaProtocolo**, não o CTeDistribuicaoDFe.

### Opção 2: Sincronização por NSU
1. Faça sincronização incremental por último NSU
2. Filtre o CTe desejado localmente pelos dados recebidos

---

## 🎯 Resumo das Correções Aplicadas

### Arquivos Removidos ❌
- ~~`CTEDistribuicaoDFePorChave.ts`~~ (services)
- ~~`CTEDistribuicaoDFePorChave.ts`~~ (operations)

### Documentação Atualizada ✅
- `README.md` - Nota sobre ausência de consulta por chave
- `IMPLEMENTACAO.md` - Estrutura corrigida
- `CHECKLIST.md` - Funcionalidades atualizadas
- `exemplo-uso.ts` - Exemplos corretos
- `index.ts` - Exports corretos

### Total de Arquivos
- **Antes (incorreto)**: 11 arquivos TS
- **Agora (correto)**: 9 arquivos TS

---

## ⚡ Exemplo de Uso Correto

```typescript
import { CTEDistribuicaoDFePorUltNSU } from '@Modules/dfe/cte';

// ✅ CORRETO - Consulta por último NSU
const resultado = await service.Exec({
    cUFAutor: '35',
    CNPJ: '12345678901234',
    distNSU: {
        ultNSU: '000000000000000'
    }
});

// ✅ CORRETO - Consulta por NSU específico
const resultado = await service.Exec({
    cUFAutor: '35',
    CNPJ: '12345678901234',
    consNSU: {
        NSU: '000000000000123'
    }
});

// ❌ INCORRETO - Não existe no CTe!
const resultado = await service.Exec({
    cUFAutor: '35',
    CNPJ: '12345678901234',
    consChCTe: {  // ❌ ERRO! Não existe!
        chCTe: '...'
    }
});
```

---

## 📖 Documentação Oficial

Consulte sempre a documentação oficial da SEFAZ:
- Portal da NFe: [http://www.nfe.fazenda.gov.br](http://www.nfe.fazenda.gov.br)
- Portal do CTe: [http://www.cte.fazenda.gov.br](http://www.cte.fazenda.gov.br)

---

**Data de Atualização**: 04/10/2025  
**Implementação Corrigida**: Conforme Norma Técnica do CTe  
**Status**: ✅ Validado e Correto
