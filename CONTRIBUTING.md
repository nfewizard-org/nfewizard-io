# Guia de Contribuição - nfewizard-io

Obrigado por considerar contribuir para a `nfewizard-io`! Este documento contém diretrizes completas para colaborar com o projeto. Siga estas instruções para facilitar o processo de colaboração.

---

## 📋 Índice

- [Como Contribuir](#-como-contribuir)
- [Requisitos para Contribuição](#-requisitos-para-contribuição)
- [Configuração do Ambiente](#-configuração-do-ambiente)
- [Processo de Contribuição](#-processo-de-contribuição)
- [Debug e Desenvolvimento](#-debug-e-desenvolvimento)
- [Sistema de Logs](#-sistema-de-logs)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Padrões de Código](#-padrões-de-código)
- [Testes](#-testes)

---

## 🤝 Como Contribuir

Existem várias maneiras de contribuir para o projeto:

- 🐛 **Reportar bugs** ou problemas encontrados
- 💡 **Sugerir novas funcionalidades** ou melhorias
- 🏛️ **Homologar serviços** em diferentes UFs
- 📚 **Melhorar a documentação**
- 🔧 **Corrigir código** existente
- ✅ **Adicionar testes** para aumentar cobertura
- 🎯 **Otimizar performance** de operações

---

## ⚙️ Requisitos para Contribuição

Antes de começar, certifique-se de ter as ferramentas necessárias:

### Ferramentas Obrigatórias
- **Node.js**: Versão 18 ou superior
- **npm**: Para gerenciamento de dependências
- **Git**: Para versionamento de código
- **VS Code**: IDE recomendada (com suporte nativo ao debug)

### Ambiente para Testes
- **Certificado Digital**: Acesso a um certificado `.pfx` válido
- **Dados de Homologação**: CNPJ e credenciais para testes
- **Conexão com Internet**: Para comunicação com webservices da SEFAZ



---

## 🔧 Configuração do Ambiente

### 1. **Fork do Repositório**

#### Para HTTPS:
```bash
# 1. Faça fork do repositório no GitHub
# 2. Clone seu fork localmente
git clone https://github.com/SEU_USUARIO/nfewizard-io.git
cd nfewizard-io

# 3. Adicione o repositório original como upstream
git remote add upstream https://github.com/nfewizard-org/nfewizard-io.git

# 4. Verifique os remotes
git remote -v
```

Para SSH (se você tem chave SSH configurada):
```bash
# 1. Faça fork do repositório no GitHub
# 2. Clone seu fork localmente
git clone git@github.com:SEU_USUARIO/nfewizard-io.git
cd nfewizard-io

# 3. Adicione o repositório original como upstream
git remote add upstream git@github.com:nfewizard-org/nfewizard-io.git

# 4. Verifique os remotes
git remote -v
```

### 2. **Instalação das Dependências**

```bash
# Instalar dependências
npm install

# Verificar se está tudo funcionando
npm run build:rp
```

### 3. **Configuração do Certificado**

```bash
# Crie um diretório para seu certificados
mkdir -p certificados

# Copie seu certificado .pfx para o diretório
cp /caminho/para/seu/certificado.pfx ./certificado.pfx

# Informe o caminho para o certificado no método de inicialização da lib (NFE_LoadEnvironment config -> dfe -> pathCertificado)
```

---

## 🚀 Processo de Contribuição

### 1. **Criando uma Branch**

```bash
# Sempre crie uma nova branch para sua contribuição
git checkout -b feature/nome-da-sua-feature

# Ou para correção de bugs
git checkout -b fix/descricao-do-bug
```

### 2. **Padrão de Commits**

Use o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Exemplos de commits
git commit -m "feat: adicionar suporte para NFSe"
git commit -m "fix: corrigir parsing do XML de retorno"
git commit -m "docs: atualizar README com novos exemplos"
git commit -m "test: adicionar testes para consulta de protocolo"
git commit -m "refactor: melhorar estrutura do BaseNFe"
```

### 3. **Enviando Pull Request**

```bash
# 1. Certifique-se que está atualizado com o upstream
git fetch upstream
git rebase upstream/main

# 2. Push da sua branch
git push origin feature/nome-da-sua-feature

# 3. Abra um Pull Request no GitHub
# - Descreva claramente as mudanças
# - Adicione exemplos de uso se aplicável
# - Referencie issues relacionadas
```

### 4. **Template de Pull Request**

```markdown
## Descrição
Breve descrição das mudanças implementadas.

## Tipo de Mudança
- [ ] Bug fix
- [ ] Nova funcionalidade
- [ ] Documentação

## Como Testar
1. Descomente o método necessário no `src/debug.ts`
2. Configure os dados de teste
3. Execute o debug com `npm run debug`
4. Verifique o comportamento esperado

## Checklist
- [ ] Código segue os padrões do projeto
- [ ] Testes foram adicionados/atualizados
- [ ] Documentação foi atualizada
- [ ] Não quebra funcionalidades existentes
```

---

## 🐛 Debug e Desenvolvimento

### 1. **Configuração do Debug**

O projeto já conta com configuração pronta para debug no VS Code:

**Arquivo: `.vscode/launch.json`** (já configurado)
- ✅ Suporte nativo ao TypeScript
- ✅ Source maps habilitados
- ✅ Console integrado
- ✅ Variáveis de ambiente configuradas

### 2. **Como Usar o Debug**

#### **Passo 1: Configurar dados de teste**
```typescript
// Edite o arquivo src/debug.ts
const nfeWizard = new NFeWizard();

await nfeWizard.NFE_LoadEnvironment({
    config: {
        dfe: {
        // ... outras configurações
            pathCertificado: "certificado.pfx",
            senhaCertificado: "SUA_SENHA",
            UF: "SP", // Sua UF
            CPFCNPJ: "SEU_CNPJ", // Seu CNPJ
        },
        // ... outras configurações
    }
});
```

#### **Passo 2: Descomentar o método desejado**
```typescript
// Exemplo: para testar consulta de status
await nfeWizard.NFE_ConsultaStatusServico(); // ← Descomente esta linha
```

#### **Passo 3: Colocar breakpoints**
1. Clique na margem esquerda da linha onde quer parar
2. Aparecerá um ponto vermelho (breakpoint)
3. Coloque breakpoints em pontos estratégicos

#### **Passo 4: Iniciar debug**
1. Aperte `F5` ou vá em **Run > Start Debugging**
2. Selecione **"Debug NFe Wizard"**
3. O código vai parar nos breakpoints

#### **Passo 5: Navegar no debug**
- **F5**: Continuar
- **F10**: Próxima linha (step over)
- **F11**: Entrar na função (step into)
- **Shift+F11**: Sair da função (step out)

### 3. **Exemplo de Pontos Estratégicos para Debug**

```typescript
// BaseNFe.ts - Pontos importantes para breakpoint
async Exec(data?: any): Promise<any> {
    // BREAKPOINT 1: Ver dados de entrada
    xmlConsulta = this.gerarXml(data); // ← Verificar XML gerado
    
    // BREAKPOINT 2: Ver resposta da SEFAZ  
    xmlRetorno = await this.callWebService(...); // ← Verificar comunicação
    
    // BREAKPOINT 3: Ver XML de retorno
    responseInJson = json.convertXmlToJson(xmlRetorno.data, this.metodo); // ← Verificar parsing
    
    return responseInJson; // ← Verificar resultado final
}
```

### 4. **Analisando Variáveis**

Durante o debug, use os painéis:

- **Variables**: Ver todas as variáveis do escopo
- **Watch**: Adicionar expressões para monitorar
- **Call Stack**: Ver a sequência de chamadas
- **Debug Console**: Executar comandos JavaScript

```javascript
// Exemplos de comandos no Debug Console
xmlRetorno.data.length        // Ver tamanho da resposta
JSON.stringify(responseInJson) // Ver JSON completo
xmlConsulta.substring(0, 200)  // Ver início do XML
```

---

## 📊 Sistema de Logs

O projeto possui um sistema de logs estruturado e configurável:

### 1. **Configuração de Logs**

```typescript
lib: {
    log: {
        exibirLogNoConsole: true,    // Mostrar logs no console
        armazenarLogs: true,         // Salvar logs em arquivos
        pathLogs: 'tmp/Logs'         // Diretório dos logs
    }
}
```

### 2. **Tipos de Log**

#### **Console (desenvolvimento)**
```
2025-06-27 00:48:22 info: [Logger] Logger inicializado com sucesso {"config":{"console":true}}
2025-06-27 00:48:22 http: [BaseNFE][NFEConsultaProtocolo] Iniciando comunicação {"url":"https://..."}
2025-06-27 00:48:22 error: [XmlParser] Erro ao converter XML {"error":"Formato desconhecido"}
```

#### **Arquivos JSONL (produção)**
Os logs são salvos em arquivos separados no formato JSONL (JSON Lines):

**`tmp/Logs/app.jsonl`** - Logs gerais
```jsonl
{"level":"info","message":"Inicializando ambiente","timestamp":"2025-06-27T00:48:22.720Z","context":"Environment"}
{"level":"warn","message":"Certificado expira em 30 dias","timestamp":"2025-06-27T00:48:23.120Z","context":"Certificate"}
```

**`tmp/Logs/error.jsonl`** - Apenas erros
```jsonl
{"level":"error","message":"Erro na conversão XML","timestamp":"2025-06-27T00:48:22.928Z","context":"XmlParser","error":{"message":"Formato inválido","stack":"..."}}
```

**`tmp/Logs/http.jsonl`** - Requisições HTTP
```jsonl
{"level":"http","message":"Requisição iniciada","timestamp":"2025-06-27T00:48:22.771Z","context":"BaseNFE","url":"https://nfe.sefaz.sp.gov.br/ws","duration":"150ms"}
```

### 3. **Vantagens dos Logs JSONL**

- ✅ **Estruturados**: Fácil análise programática
- ✅ **Separados por tipo**: app, error, http
- ✅ **Rotação automática**: Arquivos grandes são rotacionados
- ✅ **Performance**: Append-only, não reescreve arquivo

### 4. **Analisando Logs**

```bash
# Ver últimas 50 linhas do log de aplicação
tail -50 tmp/Logs/app.jsonl

# Filtrar apenas erros de um contexto específico
grep '"context":"XmlParser"' tmp/Logs/error.jsonl

# Ver requisições HTTP que demoraram mais de 1 segundo
grep -E '"duration":"[2-9][0-9]{3}ms"' tmp/Logs/http.jsonl
```

---

## 📁 Estrutura do Projeto

```
src/
├── adapters/           # Adaptadores principais da API
├── core/              # Funcionalidades centrais
│   ├── exceptions/    # Sistema de logs e erros
│   └── utils/         # Utilitários gerais
├── modules/           # Módulos da NFe
│   └── dfe/
│       ├── base/      # Classes base
│       ├── nfe/       # Implementações NFe
│       └── nfce/      # Implementações NFCe
├── types/             # Definições TypeScript
├── debug.ts           # Arquivo para debug/desenvolvimento
```

---

## 🎯 Padrões de Código

### 1. **Nomenclatura**

```typescript
// Classes: PascalCase
class NFeWizardService { }

// Métodos públicos: PascalCase com prefixo
public async NFE_ConsultaStatusServico(): Promise<any> { }

// Métodos privados: camelCase
private gerarXmlConsulta(): string { }

// Variáveis: camelCase
const xmlConsulta: string = '';
```

### 2. **Logging**

```typescript
import { logger } from '@Core/exceptions/logger.js';

// Use contexto consistente
logger.info('Iniciando operação', { 
    context: 'MinhaClasse', 
    method: 'meuMetodo',
    parametros: { id: 123 }
});

// Para HTTP, use nível http
logger.http('Requisição enviada', {
    context: 'MinhaClasse',
    url: webServiceUrl,
    method: 'POST'
});
```

---

## ✅ Testes

### 1. **Testando Funcionalidades**

Use o arquivo `src/debug.ts` para testar:

```typescript
// 1. Configure seus dados
const nfeWizard = new NFeWizard();
await nfeWizard.NFE_LoadEnvironment({ /* sua config */ });

// 2. Descomente o método que quer testar
await nfeWizard.NFE_ConsultaStatusServico();

// 3. Execute com debug para analisar o comportamento
```

### 2. **Validação de UFs**

Para homologar uma nova UF:

```typescript
// Teste todos os métodos principais
await nfeWizard.NFE_ConsultaStatusServico();    // ✅ Status OK
await nfeWizard.NFE_ConsultaProtocolo('chave'); // ✅ Consulta OK  
await nfeWizard.NFE_DistribuicaoDFe(params);   // ✅ Distribuição OK
await nfeWizard.NFE_Autorizacao(nfe);          // ✅ Autorização OK
```

Adicione ao arquivo `STATUS_HOMOLOGACAO.md`:


### 3. **Issues E PRs**

Ao abrir issue ou PR, inclua:

```markdown
## Ambiente Testado
- UF: SP
- Certificado: A1
- Método: NFE_ConsultaStatusServico
- Status: ✅ Funcionando / ❌ Com erro
```

## Logs Relevantes

Inclua também os logs gerados no diretório configurado em `pathLogs`.
Lembre-se de adicionar os logs **app.jsonl**, **error.jsonl** e **http.jsonl**.

```jsonl
{"context":"NFE_ConsultaProtocolo","error":{"message":"Rejeição: Consumo Indevido",...}
```

## Evidências
- [ ] Screenshots dos logs
- [ ] XML de request/response (sem dados sensíveis)
- [ ] Configuração utilizada
```

---

## 📞 Suporte

### Issues no GitHub
- 🐛 **Bug Report**: Use template de bug report
- 💡 **Feature Request**: Descreva a funcionalidade desejada
- ❓ **Pergunta**: Para dúvidas sobre uso

### Informações Úteis para Issues
- Versão do Node.js
- Sistema operacional
- UF sendo testada
- Logs relevantes (sem dados sensíveis)
- Configuração utilizada

---

## 🎉 Reconhecimento

Todos os contribuidores são reconhecidos no projeto! Suas contribuições ajudam a melhorar o ecossistema NFe para toda a comunidade brasileira.

**Obrigado por contribuir! 🚀**

---

*Para dúvidas específicas sobre desenvolvimento, consulte os logs ou abra uma issue no GitHub.*