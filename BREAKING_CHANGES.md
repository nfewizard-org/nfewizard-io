# 🚨 Breaking Changes - Versão 1.0.0

## Modularização do Projeto

A partir da versão 1.0.0, o projeto **NFeWizard-io** foi modularizado em pacotes menores para melhor manutenibilidade, otimização de bundle e separação de responsabilidades.

---

## 📦 Estrutura Antiga vs Nova

### ❌ Versão Antiga (< 1.0.0)

**Instalação:**
```bash
npm install nfewizard-io
```

**Uso:**
```typescript
import NFeWizard from 'nfewizard-io';

const nfeWizard = new NFeWizard();

// NFe
await nfeWizard.NFE_Autorizacao(nfeData);

// NFCe
await nfeWizard.NFCE_Autorizacao(nfceData);

// DANFE
import { NFEGerarDanfe } from 'nfewizard-io';
await NFEGerarDanfe({ xml: nfeXml });
```

---

### ✅ Versão Nova (>= 1.0.0)

A biblioteca agora é dividida em **6 pacotes independentes**:

| Pacote | Descrição | Compactado | Descompactado |
|--------|-----------|------------|---------------|
| `@nfewizard/types` | Tipos TypeScript compartilhados | 97.5 KB | 491.6 KB |
| `@nfewizard/shared` | Utilitários compartilhados (XML, HTTP, Certificado) | 764.4 KB | 3.38 MB |
| `@nfewizard/nfce` | Operações NFCe | 200.4 KB | 965.0 KB |
| `@nfewizard/danfe` | Geração de DANFE (NFe e NFCe) em PDF | 1.07 MB | 2.29 MB |
| `@nfewizard/cte` | Operações CTe | 164.2 KB | 787.3 KB |
| `nfewizard-io` | Operações NFe (pacote principal) | 101.4 KB | 507.5 KB |

---

## 🔄 Guia de Migração

### 1. Para Operações de NFe (Breaking Change - DANFE Removido)

Se você usa apenas **NFe**, a API permanece igual, mas **a geração de DANFE foi removida** do pacote principal:

```bash
npm install nfewizard-io
```

```typescript
// Continua funcionando exatamente igual para operações NFe
import NFeWizard from 'nfewizard-io';

const nfeWizard = new NFeWizard();
await nfeWizard.NFE_LoadEnvironment({ config });
await nfeWizard.NFE_Autorizacao(nfeData);
await nfeWizard.NFE_Cancelamento(evento);
```

**✅ Sem Breaking Changes para operações NFe!**
**⚠️ Breaking Change: DANFE removido** - veja seção 3 abaixo

---

### 2. Para Operações de NFCe (Breaking Change)

#### ❌ Antes:
```typescript
import NFeWizard from 'nfewizard-io';

const nfeWizard = new NFeWizard();
await nfeWizard.NFCE_LoadEnvironment({ config });
await nfeWizard.NFCE_Autorizacao(nfceData);
```

#### ✅ Depois:
```typescript
import NFCeWizard from '@nfewizard/nfce';

const nfceWizard = new NFCeWizard();
await nfceWizard.NFE_LoadEnvironment({ config }); // Mesmo nome de método!
await nfceWizard.NFCE_Autorizacao(nfceData);
await nfceWizard.NFCE_Cancelamento(eventoCancelamento); // ✨ NOVO!
```

**Instalação:**
```bash
npm install @nfewizard/nfce
```
> **Nota**: As dependências `@nfewizard/types` e `@nfewizard/shared` são instaladas automaticamente.

**Mudanças:**
- ✅ Classe: `NFeWizard` → `NFCeWizard`
- ✅ Pacote: `nfewizard-io` → `@nfewizard/nfce`
- ✅ API: Permanece idêntica (mesmos métodos e configurações)
- ✨ **NOVO**: Método `NFCE_Cancelamento()` adicionado

---

### 3. Para Geração de DANFE (Breaking Change para NFe e NFCe)

#### ❌ Antes:
```typescript
import { NFEGerarDanfe, NFCEGerarDanfe } from 'nfewizard-io';
```

#### ✅ Depois:
```typescript
import { NFE_GerarDanfe, NFCE_GerarDanfe } from '@nfewizard/danfe';

// DANFE NFe
await NFE_GerarDanfe({
    data, // Objeto completo com NFe, protNFe e xml
    chave,
    outputPath: './danfe.pdf' // Caminho onde o PDF será salvo
});

// DANFE NFCe
await NFCE_GerarDanfe({
    data, // Objeto completo com NFe, protNFe e xml
    chave,
    outputPath: './nfce-danfe.pdf',
    pageWidth: 226.772 // Largura específica para NFCe
});
```

**Instalação:**
```bash
npm install @nfewizard/danfe
```

**Mudanças:**
- ✅ Nomes: `NFEGerarDanfe` → `NFE_GerarDanfe`, `NFCEGerarDanfe` → `NFCE_GerarDanfe`
- ✅ Comportamento: Agora retorna Promise (usar com `await`)
- ✅ Pacote: `nfewizard-io` → `@nfewizard/danfe`
- 🎯 **Benefício**: DANFE agora é **opcional** - só instala quem precisa gerar PDF
- ⚠️ **Breaking**: nfewizard-io não inclui mais geração de DANFE

---

### 4. Para Operações de CTe (Breaking Change)

#### ❌ Antes:
```typescript
import NFeWizard from 'nfewizard-io';

const nfeWizard = new NFeWizard();
await nfeWizard.CTE_DistribuicaoDFePorNSU(params);
```

#### ✅ Depois:
```typescript
import CTeWizard from '@nfewizard/cte';

const cteWizard = new CTeWizard();

await cteWizard.NFE_LoadEnvironment({ config });

await cteWizard.CTE_DistribuicaoDFePorUltNSU({
        cUFAutor: 35,  // Código da UF (35 = São Paulo)
        CNPJ: '99999999999999',  // Seu CNPJ
        distNSU: {
            ultNSU: '000000000000000'  // Último NSU
        }
});
```

**Instalação:**
```bash
npm install @nfewizard/cte
```

---

### 5. Para Tipos TypeScript (Sem Breaking Changes)

#### ❌ Antes:
```typescript
import { NFe, NFCe, EventoNFe } from 'nfewizard-io';
```

#### ✅ Depois:
```typescript
import { NFe, EventoNFe, Cancelamento } from '@nfewizard/types/nfe';
import { DFePorUltimoNSUCTe } from '@nfewizard/types/cte';

```

---

## 📊 Comparação de Tamanhos

### Antes (Pacote Único)
```bash
nfewizard-io: 19.1 MB (descompactado)
```
**Problema**: Se você só usa NFe, instala NFCe, CTe e DANFE desnecessariamente.

### Depois (Modular)
```bash
# Apenas NFe
nfewizard-io + @nfewizard/types + @nfewizard/shared: 
  Compactado: 963.3 KB | Descompactado: 4.37 MB

# Apenas NFCe
@nfewizard/nfce + @nfewizard/types + @nfewizard/shared: 
  Compactado: 1.06 MB | Descompactado: 4.84 MB

# NFe + DANFE
nfewizard-io + @nfewizard/danfe + @nfewizard/types + @nfewizard/shared: 
  Compactado: 2.03 MB | Descompactado: 6.66 MB

# NFe + NFCe + DANFE
nfewizard-io + @nfewizard/nfce + @nfewizard/danfe + @nfewizard/types + @nfewizard/shared: 
  Compactado: 2.23 MB | Descompactado: 7.63 MB

# Todos os pacotes
TOTAL: Compactado: 2.37 MB | Descompactado: 8.36 MB
```

**✅ Benefício**: Redução de até 77% no bundle para casos de uso específicos (apenas NFe: 4.37 MB vs 19.1 MB).

---

## 🎯 Casos de Uso Comuns

### Caso 1: Uso Apenas NFe
```bash
npm install nfewizard-io
```
```typescript
import NFeWizard from 'nfewizard-io';
// Operações NFe funcionam sem alterações
// ⚠️ DANFE removido - use @nfewizard/danfe separadamente
// ⚠️ NFCe removido - use @nfewizard/nfce separadamente
// ⚠️ CTe removido - use @nfewizard/cte separadamente
```

### Caso 2: Uso Apenas NFCe
```bash
npm install @nfewizard/nfce
```
```typescript
import NFCeWizard from '@nfewizard/nfce';

const nfceWizard = new NFCeWizard();
await nfceWizard.NFE_LoadEnvironment({ config });
await nfceWizard.NFCE_Autorizacao(nfceData);
```

### Caso 3: NFe + NFCe (Migração Necessária)
```bash
npm install nfewizard-io @nfewizard/nfce
```
```typescript
import NFeWizard from 'nfewizard-io';
import NFCeWizard from '@nfewizard/nfce';

// NFe
const nfeWizard = new NFeWizard();
await nfeWizard.NFE_LoadEnvironment({ config });

// NFCe
const nfceWizard = new NFCeWizard();
await nfceWizard.NFE_LoadEnvironment({ config }); // Mesma config!
```

### Caso 4: DANFE Separado
```bash
npm install @nfewizard/danfe
```
```typescript
import { NFE_GerarDanfe, NFCE_GerarDanfe } from '@nfewizard/danfe';

// DANFE NFe
await NFE_GerarDanfe({
    data, // Objeto com NFe, protNFe e xml
    chave,
    outputPath: './danfe.pdf'
});

// DANFE NFCe
await NFCE_GerarDanfe({
    data, // Objeto com NFe, protNFe e xml
    chave,
    outputPath: './nfce-danfe.pdf',
    pageWidth: 226.772
});
```

---

## ⚙️ Configurações (Sem Mudanças)

A estrutura de configuração permanece **100% compatível**:

```typescript
const config = {
    dfe: {
        pathCertificado: "certificado.pfx",
        senhaCertificado: "1234",
        UF: "SP",
        CPFCNPJ: "99999999999999",
        // ... mesmas propriedades
    },
    nfe: {
        ambiente: 2,
        versaoDF: "4.00",
        // ... mesmas propriedades
    },
    nfce: {
        ambiente: 2,
        versaoDF: "4.00",
        idCSC: 1,
        tokenCSC: 'token',
        // ... mesmas propriedades
    },
    lib: {
        useForSchemaValidation: 'validateSchemaJsBased',
        // ... mesmas propriedades
    }
};
```

---

## 🆕 Novidades

### 1. Cancelamento de NFCe 🆕
Agora é possível cancelar NFCe diretamente pelo pacote `@nfewizard/nfce`:

```typescript
import NFCeWizard from '@nfewizard/nfce';

const nfceWizard = new NFCeWizard();
await nfceWizard.NFCE_Cancelamento({
    idLote: Date.now(),
    evento: [{
        cOrgao: 35,
        tpAmb: 2,
        CNPJ: '99999999999999',
        chNFe: '35000000000000000000000000000000000000000001',
        dhEvento: new Date().toISOString(),
        tpEvento: '110111',
        nSeqEvento: 1,
        verEvento: '1.00',
        detEvento: {
            descEvento: 'Cancelamento',
            nProt: '135000000000000',
            xJust: 'Motivo do cancelamento com no mínimo 15 caracteres'
        }
    }]
});
```

> **Nota**: O modelo `65` (NFCe) é adicionado automaticamente. Não é necessário informá-lo no objeto de evento.

### 2. Geração de DANFE Otimizada
O DANFE agora é um pacote separado, suportando NFe e NFCe:

```typescript
import { NFE_GerarDanfe, NFCE_GerarDanfe } from '@nfewizard/danfe';

// DANFE para NFe
await NFE_GerarDanfe({
    data, // Objeto completo com NFe, protNFe e xml
    chave,
    outputPath: './danfe.pdf'
});

// DANFE para NFCe (com QR Code)
await NFCE_GerarDanfe({
    data, // Objeto completo com NFe, protNFe e xml
    chave,
    outputPath: './nfce-danfe.pdf',
    pageWidth: 226.772
});
```

### 3. Scripts de Instalação Local
```bash
# Instalar todos os pacotes localmente para teste
./scripts/local-install.sh ~/seu-projeto-teste

# Instalar apenas um pacote
./scripts/local-install-single.sh @nfewizard/nfce ~/seu-projeto-teste
```
---

## 📝 Checklist de Migração

- [ ] Identificar quais módulos você usa (NFe, NFCe, CTe, DANFE)
- [ ] Instalar os novos pacotes necessários
- [ ] Atualizar imports de NFCe: `nfewizard-io` → `@nfewizard/nfce`
- [ ] Atualizar imports de DANFE: `nfewizard-io` → `@nfewizard/danfe`
- [ ] Atualizar imports de CTe: `nfewizard-io` → `@nfewizard/cte`
- [ ] Trocar `new NFeWizard()` por `new NFCeWizard()` onde aplicável
- [ ] Atualizar uso de DANFE (adicionar `await` nas chamadas)
- [ ] Testar todas as funcionalidades
- [ ] Remover `nfewizard-io` se não usar NFe

---

## 🐛 Resolução de Problemas

### "Module not found: @nfewizard/nfce"
```bash
npm install @nfewizard/nfce
```
> **Nota**: As dependências `@nfewizard/types` e `@nfewizard/shared` são instaladas automaticamente.

### "Could not find a declaration file"
Os pacotes de tipos são instalados automaticamente como dependências. Se o erro persistir, limpe o cache:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/Maurelima/nfewizard-io/issues)
- **Documentação**: [NFeWizard Docs](https://nfewizard-org.github.io/)
<!-- - **Discord**: [Comunidade NFeWizard](https://discord.gg/nfewizard) -->

---

## 🙏 Agradecimentos

Obrigado por usar o NFeWizard! Se esta biblioteca te ajuda, considere:
- ⭐ Dar uma estrela no [GitHub](https://github.com/Maurelima/nfewizard-io)
- 💰 [Fazer uma doação](https://github.com/sponsors/Maurelima)
- 🐛 Reportar bugs e sugerir melhorias

---

**Projetado com ♥ por [Marco Lima](https://github.com/Maurelima)**
