# NFeWizard-io - Guia de Build e Desenvolvimento

Este documento descreve como fazer build, instalar e testar localmente a biblioteca NFeWizard-io após a modularização.

## 📦 Estrutura do Monorepo

O projeto foi modularizado em 6 pacotes independentes:

- **@nfewizard/types** (736KB) - Definições TypeScript e interfaces
- **@nfewizard/shared** (680KB) - Utilitários compartilhados (XML, HTTP, certificados, schemas, 335 CA certs)
- **@nfewizard/danfe** (348KB) - Geradores de DANFE/DACTE (PDF)
- **@nfewizard/nfce** (108KB) - Operações e serviços NFCe
- **@nfewizard/cte** (52KB) - Operações e serviços CTe
- **nfewizard-io** (320KB) - Pacote principal NFe (mantém compatibilidade retroativa)

**Tamanho total:** ~2.2MB (redução de 85% dos ~15MB originais)

### Recursos Críticos em @nfewizard/shared

- **335 Certificados CA** ICP-Brasil em `resources/certs/`
- **143 Schemas XSD** em `resources/schemas/`
- **libxmljs2** compilado para validação XML

## 🛠️ Pré-requisitos

- Node.js >= 18.0.0 (para módulos nativos)
- pnpm >= 8.15.0
- Compiladores C++ (para libxmljs2):
  - **Linux:** `build-essential`
  - **macOS:** Xcode Command Line Tools
  - **Windows:** Visual Studio Build Tools

## 📥 Instalação de Dependências

```bash
# Instalar pnpm globalmente (se ainda não tiver)
npm install -g pnpm

# Instalar todas as dependências do monorepo
pnpm install
```

## 🔨 Build

### Build de todos os pacotes

```bash
# Build completo (recomendado após clonar o repositório)
pnpm run build

# Ou usando turbo (com cache e paralelização)
pnpm turbo build
```

### Build de pacotes individuais

```bash
# Build de um pacote específico
pnpm --filter @nfewizard/types build
pnpm --filter @nfewizard/shared build
pnpm --filter @nfewizard/danfe build
pnpm --filter @nfewizard/nfce build
pnpm --filter @nfewizard/cte build
pnpm --filter nfewizard-io build
```

### Limpar build anterior

```bash
# Limpar todos os pacotes
pnpm run clean

# Limpar pacote específico
pnpm --filter @nfewizard/types clean
```

## 🧪 Testes Locais

Use os scripts de instalação local em [`../scripts/`](../scripts/):

### Opção A: Instalação Completa (todos os módulos)

Testa todos os pacotes de uma vez:

```bash
./scripts/local-install.sh ~/seu-projeto-teste
```

**Instala:**
- `@nfewizard/types`
- `@nfewizard/shared` (com 335 CA certs + 143 schemas XSD)
- `@nfewizard/danfe`
- `@nfewizard/nfce`
- `@nfewizard/cte`
- `nfewizard-io`

### Opção B: Instalação Única (simula npm install)

Testa apenas 1 pacote + suas dependências (simula o que o usuário final fará):

```bash
# Testar apenas NFe
./scripts/local-install-single.sh nfewizard-io ~/seu-projeto-teste

# Testar apenas NFCe
./scripts/local-install-single.sh @nfewizard/nfce ~/seu-projeto-teste

# Testar apenas CTe
./scripts/local-install-single.sh @nfewizard/cte ~/seu-projeto-teste

# Testar apenas DANFE
./scripts/local-install-single.sh @nfewizard/danfe ~/seu-projeto-teste
```

📖 **[Documentação completa dos scripts](../scripts/README.md)**

### Workflow de Desenvolvimento

Após alterar código da lib:

```bash
# 1. Edite o código
vim packages/shared/src/adapters/SchemaLoader.ts

# 2. Reinstale no projeto de teste (escolha um)
./scripts/local-install.sh ~/projeto-teste              # Completo
./scripts/local-install-single.sh nfewizard-io ~/projeto-teste  # Único

# 3. Teste
cd ~/projeto-teste
node index.js
```

### Testar Importações

Crie um arquivo de teste `test.js` ou `test.ts`:

```javascript
// Teste do pacote principal (NFe)
import { NFeWizard } from 'nfewizard-io';

// Teste de pacotes individuais
import { NFCEAutorizacao } from '@nfewizard/nfce';
import { CTEDistribuicaoDFe } from '@nfewizard/cte';
import { NFeDanfeGenerator } from '@nfewizard/danfe';
import { Environment, Utility } from '@nfewizard/shared';

console.log('Importações bem-sucedidas!');
```

Execute o teste:

```bash
# Se estiver usando TypeScript
npx tsx test.ts

# Se estiver usando Node.js com ESM
node test.js
```

### 4. Verificação de Tipos TypeScript

```bash
# Verificar tipos em todos os pacotes
pnpm turbo typecheck

# Verificar tipos em pacote específico
pnpm --filter @nfewizard/nfce typecheck
```

### 5. Testar com Projeto de Exemplo

Crie um projeto de teste:

```bash
mkdir nfewizard-test
cd nfewizard-test
pnpm init
pnpm add ../nfewizard-io/packages/nfewizard-io
```

Crie `index.js`:

```javascript
import { NFeWizard } from 'nfewizard-io';

const config = {
  nfe: {
    ambiente: 2, // 1=Produção, 2=Homologação
    UF: 'SP',
    razaoSocial: 'Empresa Teste LTDA',
    CNPJ: '12345678000190',
    // ... outras configurações
  },
  certificate: {
    pfxPath: './certificado.pfx',
    pfxPassword: 'senha123',
  },
};

async function testar() {
  try {
    const nfe = new NFeWizard(config);
    console.log('NFeWizard inicializado com sucesso!');
  } catch (error) {
    console.error('Erro ao inicializar:', error);
  }
}

testar();
```

## 🔍 Verificação de Erros

```bash
# Verificar erros TypeScript em todo o workspace
pnpm exec tsc --noEmit

# Ver erros em pacote específico
cd packages/nfewizard-io
pnpm typecheck
```

## 📊 Análise de Pacotes

```bash
# Ver tamanho dos pacotes compilados
du -sh packages/*/dist/

# Ver estrutura de arquivos
tree packages/nfewizard-io/dist -L 2
```

## 🚀 Publicação (quando pronto)

```bash
# Publicar todos os pacotes (requer permissões npm)
pnpm publish -r --access public

# Publicar pacote específico
cd packages/nfewizard-io
pnpm publish --access public
```

## 🔧 Desenvolvimento

### Watch Mode (recompilação automática)

```bash
# Observar mudanças e recompilar automaticamente
pnpm --filter @nfewizard/shared build -- --watch
```

### Adicionar Nova Dependência

```bash
# Adicionar ao workspace root
pnpm add -w <pacote>

# Adicionar a pacote específico
pnpm --filter @nfewizard/shared add <pacote>

# Adicionar dependência de desenvolvimento
pnpm --filter @nfewizard/types add -D <pacote>
```

## 📝 Scripts Disponíveis

- `pnpm install` - Instala todas as dependências
- `pnpm run build` - Build de todos os pacotes
- `pnpm run clean` - Remove diretórios dist/
- `pnpm turbo build` - Build com cache Turbo
- `pnpm turbo typecheck` - Verificação TypeScript

## ❓ Troubleshooting

### Erro: "Cannot find module '@nfewizard/types'"

```bash
# Rebuild do pacote types
pnpm --filter @nfewizard/types build
```

### Erro: "Module not found" após modificar código

```bash
# Limpar cache do turbo e rebuildar
rm -rf .turbo
pnpm run clean
pnpm run build
```

### Erro de cache do pnpm

```bash
# Limpar store do pnpm e reinstalar
pnpm store prune
rm -rf node_modules
pnpm install
```

## 📚 Documentação Adicional

- [ROADMAP.md](./ROADMAP.md) - Roadmap do projeto
- [CONTRIBUTING.md](./CONTRIBUTING.md) - Guia de contribuição
- [AUDITORIA.md](./AUDITORIA.md) - Auditoria de dependências
- [modules.md](./modules.md) - Plano de modularização

## 🎯 Compatibilidade Retroativa

O pacote `nfewizard-io` mantém 100% de compatibilidade com a versão anterior. Projetos existentes continuam funcionando sem alterações:

```javascript
// Código existente continua funcionando
import { NFeWizard } from 'nfewizard-io';
```

Novos projetos podem optar por usar apenas os pacotes necessários:

```javascript
// Usar apenas NFCe
import { NFCEAutorizacao } from '@nfewizard/nfce';
```
