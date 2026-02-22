# Instalação Local - Testando sem publicar no npm

Este guia explica como testar a biblioteca **nfewizard-io** localmente antes de publicá-la no npm.

## 🎯 Por que usar instalação local?

Ao desenvolver a biblioteca, você precisa testá-la em um projeto real **antes de publicar no npm**. Os scripts de instalação local simulam exatamente como a biblioteca funcionará quando instalada via `npm install`.

## 📋 Scripts Disponíveis

### 1. `local-install.sh` - Instalação Completa

**Uso:** Teste rápido de todos os módulos.

```bash
./scripts/local-install.sh ~/Documents/projetos/NFeWizard/Testes/NFeWizard
```

**O que instala:**
- ✅ `@nfewizard/types`
- ✅ `@nfewizard/shared` (com 335 CA certs + 143 schemas XSD)
- ✅ `@nfewizard/danfe`
- ✅ `@nfewizard/nfce`
- ✅ `@nfewizard/cte`
- ✅ `nfewizard-io`

**Quando usar:** Desenvolvimento ativo, teste completo da biblioteca.

---

### 2. `local-install-single.sh` - Instalação Única

**Uso:** Simula exatamente como o usuário instalará via `npm install <pacote>`.

```bash
./scripts/local-install-single.sh <pacote> <diretório-destino>
```

**Exemplos:**

```bash
# Instalar apenas NFe
./scripts/local-install-single.sh nfewizard-io ~/meu-projeto

# Instalar apenas NFCe
./scripts/local-install-single.sh @nfewizard/nfce ~/meu-projeto

# Instalar apenas CTe
./scripts/local-install-single.sh @nfewizard/cte ~/meu-projeto

# Instalar apenas DANFE
./scripts/local-install-single.sh @nfewizard/danfe ~/meu-projeto
```

**Quando usar:** Testar cenário real de instalação, validar dependências automáticas.

---

## ⚙️ O que os scripts fazem

Ambos os scripts executam estas etapas automaticamente:

### Passo 1: Instalar Dependências Externas
```bash
pnpm add axios libxmljs2 xml2js pdfkit qrcode ...
```
- 21 dependências externas
- Compila módulos nativos (libxmljs2, xsd-schema-validator)
- Cria `.npmrc` para permitir build scripts

### Passo 2: Build dos Pacotes
```bash
pnpm build
```
- Compila TypeScript → JavaScript
- Gera arquivos `.d.ts`
- Cria bundles ESM e CJS

### Passo 3: Preparar Pacotes
```bash
# Copia para diretório temporário
.local-packages/
├── @nfewizard/
│   ├── types/
│   ├── shared/
│   └── ...
└── nfewizard-io/
```

### Passo 4: Instalar no Projeto
```bash
# Copia para node_modules do projeto de teste
node_modules/
├── @nfewizard/
│   ├── types/
│   ├── shared/ (com resources/)
│   └── ...
└── nfewizard-io/
```

---

## 🔄 Workflow de Desenvolvimento

### Cenário típico:

```bash
# 1. Edite código
vim packages/shared/src/adapters/SchemaLoader.ts

# 2. Reinstale localmente (escolha um método)
./scripts/local-install.sh ~/projeto-teste              # Completo
./scripts/local-install-single.sh nfewizard-io ~/projeto-teste  # Único

# 3. Execute teste
cd ~/projeto-teste
node index.js
```

**Observação:** Os scripts fazem **rebuild automático** antes de copiar, então você não precisa rodar `pnpm build` manualmente.

---

## 🆚 Diferenças entre os Scripts

| Aspecto | local-install.sh | local-install-single.sh |
|---------|------------------|-------------------------|
| **Build** | Todos os 6 pacotes | Apenas necessários |
| **Instala** | Todos os 6 pacotes | 1 pacote + deps |
| **Tempo** | ~30s | ~15s |
| **Uso** | Teste completo | Teste realista |
| **Simula** | Instalação manual de tudo | `npm install <pacote>` |

---

## 🎯 Dependências Automáticas

Quando você instala um pacote, as dependências vêm automaticamente:

### `nfewizard-io`
```bash
./scripts/local-install-single.sh nfewizard-io ~/projeto
```
→ Instala: `nfewizard-io` + `@nfewizard/types` + `@nfewizard/shared` + `@nfewizard/danfe`

### `@nfewizard/nfce`
```bash
./scripts/local-install-single.sh @nfewizard/nfce ~/projeto
```
→ Instala: `@nfewizard/nfce` + `@nfewizard/types` + `@nfewizard/shared`

### `@nfewizard/cte`
```bash
./scripts/local-install-single.sh @nfewizard/cte ~/projeto
```
→ Instala: `@nfewizard/cte` + `@nfewizard/types` + `@nfewizard/shared`

### `@nfewizard/danfe`
```bash
./scripts/local-install-single.sh @nfewizard/danfe ~/projeto
```
→ Instala: `@nfewizard/danfe` + `@nfewizard/types`

---

## 📦 Recursos Incluídos

### Certificados CA (335 arquivos)
```bash
node_modules/@nfewizard/shared/resources/certs/
├── AC_JUS_v6.crt
├── ICP-Brasilv12.crt
├── AC_Certisign_G8.crt
└── ... (332 outros)
```

Usados para validar conexão SSL/TLS com SEFAZ.

### Schemas XSD (143 arquivos)
```bash
node_modules/@nfewizard/shared/resources/schemas/
├── leiauteNFe_v4.00.xsd
├── tiposBasico_v4.00.xsd
├── xmldsig-core-schema_v1.01.xsd
└── ... (140 outros)
```

Usados para validar XMLs contra os schemas oficiais.

### libxmljs2 (módulo nativo)
```bash
node_modules/.pnpm/libxmljs2@*/node_modules/libxmljs2/build/Release/xmljs.node
```

Binário C++ compilado para validação XML de alta performance.

---

## ✅ Verificar Instalação

Após executar o script, verifique se tudo foi instalado corretamente:

### Verificar pacotes:
```bash
ls -la ~/projeto-teste/node_modules/@nfewizard/
ls -la ~/projeto-teste/node_modules/nfewizard-io/
```

### Verificar CA certs:
```bash
ls ~/projeto-teste/node_modules/@nfewizard/shared/resources/certs/ | wc -l
# Deve retornar: 335
```

### Verificar schemas:
```bash
ls ~/projeto-teste/node_modules/@nfewizard/shared/resources/schemas/ | wc -l
# Deve retornar: 143
```

### Verificar libxmljs2:
```bash
ls ~/projeto-teste/node_modules/.pnpm/libxmljs2@*/node_modules/libxmljs2/build/Release/
# Deve mostrar: xmljs.node
```

---

## 🐛 Troubleshooting

### Erro: "Cannot find module @nfewizard/shared"
→ Execute o script novamente, as dependências não foram copiadas corretamente.

### Erro: "bindings file not found" (libxmljs2)
→ O módulo nativo não compilou. Verifique se você tem compiladores C++:
```bash
# Linux
sudo apt install build-essential

# macOS
xcode-select --install
```

### Erro: "ENOENT: no such file or directory, scandir .../certs"
→ Os CA certs não foram copiados. Execute novamente ou verifique:
```bash
ls packages/shared/resources/certs/ | wc -l
# Deve mostrar 335 certificados
```

### Erro: "unable to get local issuer certificate"
→ Em homologação (ambiente=2), isso pode ser ignorado. O código aceita certificados auto-assinados.

---

## 🚀 Próximos Passos

Após testar localmente com sucesso:

1. **Commite suas mudanças**
   ```bash
   git add .
   git commit -m "feat: implementação X"
   ```

2. **Atualize versões dos pacotes**
   ```bash
   cd packages/shared && npm version patch
   cd packages/nfewizard-io && npm version patch
   ```

3. **Publique no npm** (veja [BUILD.md](BUILD.md))
   ```bash
   pnpm publish -r
   ```

---

## 📚 Documentação Relacionada

- **[BUILD.md](BUILD.md)** - Guia completo de build e publicação
- **[../scripts/README.md](../scripts/README.md)** - Documentação detalhada dos scripts
- **[../README.md](../README.md)** - Documentação principal da biblioteca

---

## 💡 Exemplo de Teste Mínimo

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
cd ~/projeto-teste
node test.js
```

Saída esperada:
```
Status SEFAZ: Serviço em Operação
```

---

Agora você está pronto para desenvolver e testar a biblioteca localmente! 🎉
