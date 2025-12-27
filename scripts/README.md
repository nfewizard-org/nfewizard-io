# Scripts de Instalação Local

Scripts para testar os pacotes localmente antes de publicar no npm.

## 📋 Scripts Disponíveis

### 1. `local-install.sh` - Instalação Completa

Instala **TODOS** os pacotes do monorepo de uma vez.

**Quando usar:** Desenvolvimento rápido, testes completos da biblioteca.

```bash
./scripts/local-install.sh ~/Documents/projetos/NFeWizard/Testes/NFeWizard
```

**Instala:**
- `@nfewizard/types`
- `@nfewizard/shared` (com 335 CA certs + 143 schemas)
- `@nfewizard/danfe`
- `@nfewizard/nfce`
- `@nfewizard/cte`
- `nfewizard-io`

---

### 2. `local-install-single.sh` - Instalação Única

Instala **apenas 1 pacote** + suas dependências (simula `npm install <pacote>`).

**Quando usar:** Testar como usuário final instalará, validar dependências.

#### Sintaxe:
```bash
./scripts/local-install-single.sh <pacote> <diretório-destino>
```

#### Exemplos:

**Instalar apenas NFe:**
```bash
./scripts/local-install-single.sh nfewizard-io ~/meu-projeto
```
→ Instala: `nfewizard-io` + `@nfewizard/types` + `@nfewizard/shared` + `@nfewizard/danfe`

**Instalar apenas NFCe:**
```bash
./scripts/local-install-single.sh @nfewizard/nfce ~/meu-projeto
```
→ Instala: `@nfewizard/nfce` + `@nfewizard/types` + `@nfewizard/shared`

**Instalar apenas CTe:**
```bash
./scripts/local-install-single.sh @nfewizard/cte ~/meu-projeto
```
→ Instala: `@nfewizard/cte` + `@nfewizard/types` + `@nfewizard/shared`

**Instalar apenas DANFE:**
```bash
./scripts/local-install-single.sh @nfewizard/danfe ~/meu-projeto
```
→ Instala: `@nfewizard/danfe` + `@nfewizard/types`

---

## 🔄 Workflow de Desenvolvimento

### Após alterar código da lib:

```bash
# 1. Edite o código
vim packages/shared/src/adapters/SchemaLoader.ts

# 2. Reinstale (escolha um):
./scripts/local-install.sh ~/projeto-teste              # Completo
./scripts/local-install-single.sh nfewizard-io ~/projeto-teste  # Único

# 3. Teste
cd ~/projeto-teste
node index.js
```

---

## ⚙️ O que os scripts fazem

### Ambos os scripts executam:

1. **Instalam dependências externas** (axios, libxmljs2, pdfkit, etc.)
2. **Compilam módulos nativos** (libxmljs2, xsd-schema-validator)
3. **Buildam os pacotes** (`pnpm build`)
4. **Copiam para node_modules** (simula npm install)
5. **Incluem recursos** (CA certs, schemas XSD)

### Diferenças:

| Script | Build | Instala | Tempo |
|--------|-------|---------|-------|
| `local-install.sh` | Todos os pacotes | Todos os pacotes | ~30s |
| `local-install-single.sh` | Apenas necessários | 1 pacote + deps | ~15s |

---

## 📦 Pacotes Disponíveis

| Pacote | Descrição | Dependências |
|--------|-----------|--------------|
| `nfewizard-io` | Pacote principal NFe | types, shared, danfe |
| `@nfewizard/nfce` | Operações NFCe | types, shared |
| `@nfewizard/cte` | Operações CTe | types, shared |
| `@nfewizard/danfe` | Gerador de DANFE PDF | types |
| `@nfewizard/shared` | Core (XML, SOAP, Certs) | types |
| `@nfewizard/types` | Tipos TypeScript | - |

---

## 🚨 Requisitos

- **pnpm** instalado (`npm install -g pnpm`)
- **Node.js** 18+ (para módulos nativos)
- **Compiladores C++** (para libxmljs2):
  - Linux: `build-essential`
  - macOS: Xcode Command Line Tools
  - Windows: Visual Studio Build Tools

---

## 💡 Dicas

**Verificar instalação:**
```bash
ls -la ~/projeto-teste/node_modules/@nfewizard/
ls -la ~/projeto-teste/node_modules/nfewizard-io/
```

**Verificar CA certs:**
```bash
ls ~/projeto-teste/node_modules/@nfewizard/shared/resources/certs/ | wc -l
# Deve retornar: 335
```

**Verificar schemas:**
```bash
ls ~/projeto-teste/node_modules/@nfewizard/shared/resources/schemas/ | wc -l
# Deve retornar: 143
```

**Verificar libxmljs2:**
```bash
ls ~/projeto-teste/node_modules/.pnpm/libxmljs2@*/node_modules/libxmljs2/build/Release/
# Deve mostrar: xmljs.node
```

---

## 🐛 Troubleshooting

**Erro: "Cannot find module @nfewizard/shared"**
→ Execute o script novamente, as dependências não foram copiadas

**Erro: "bindings file not found" (libxmljs2)**
→ O módulo nativo não compilou. Verifique se tem compiladores C++

**Erro: "ENOENT: no such file or directory, scandir .../certs"**
→ Os CA certs não foram copiados. Verifique se existem em `packages/shared/resources/certs/`

**Erro: "unable to get local issuer certificate"**
→ Em homologação, isso é normal se não houver CA certs. O código aceita self-signed em ambiente=2

---

## 📄 Exemplo de Teste Mínimo

Crie `~/projeto-teste/test.js`:

```javascript
import NFeWizard from 'nfewizard-io';

const nfe = new NFeWizard();

await nfe.NFE_LoadEnvironment({
  dfe: {
    pathCertificado: 'certificado.pfx',
    senhaCertificado: '1234',
    ambiente: 2  // Homologação
  }
});

const resultado = await nfe.NFE_ConsultaStatusServico({
  cUF: 35,  // São Paulo
  tpAmb: 2  // Homologação
});

console.log('Status SEFAZ:', resultado.retornoSOAP.xMotivo);
```

Execute:
```bash
node test.js
```

Saída esperada:
```
Status SEFAZ: Serviço em Operação
```
