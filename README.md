# NFeWizard-io 🪄

## 🛠️ Lib atualizada com NT 2025.002 v.130 - Reforma Tributária

---

## 🚨 BREAKING CHANGES - Versão 1.0.0 (Modularização)

A partir da versão 1.0.0, o **NFeWizard-io foi modularizado** em pacotes independentes:

| Pacote | Descrição | Tamanho |
|--------|-----------|---------|
| `nfewizard-io` | ✅ Operações NFe (pacote principal) | 511.2 KB |
| `@nfewizard/nfce` | 🆕 Operações NFCe + Cancelamento | 997.7 KB |
| `@nfewizard/nfse` | 🆕 Operações NFSe | 578.0 KB |
| `@nfewizard/danfe` | 🆕 Geração de DANFE (NFe e NFCe) | 2.31 MB |
| `@nfewizard/cte` | 🆕 Operações CTe | 801.9 KB |
| `@nfewizard/types` | 📦 Tipos TypeScript | 542.4 KB |
| `@nfewizard/shared` | 📦 Utilitários compartilhados | 4.03 MB |

### 🎯 Principais Mudanças

- ⚠️ **NFCe**: Agora em pacote separado `@nfewizard/nfce` (use `new NFCeWizard()`)
- ⚠️ **NFSe**: Novo pacote `@nfewizard/nfse` para Nota Fiscal de Serviços Eletrônica
- ⚠️ **DANFE**: Removido do pacote principal, use `@nfewizard/danfe` com funções `NFE_GerarDanfe()` e `NFCE_GerarDanfe()`
- ⚠️ **CTe**: Movido para `@nfewizard/cte` (use `new CTEWizard()`)
- ✅ **NFe**: Permanece 100% compatível no pacote `nfewizard-io`
- 🎁 **Novo**: Cancelamento de NFCe disponível em `@nfewizard/nfce`
- 📉 **Benefício**: Redução de até 77% no bundle 

### 📖 Guia Completo de Migração

Para detalhes completos sobre como migrar, exemplos de código e casos de uso, consulte:
**[📋 BREAKING_CHANGES.md](BREAKING_CHANGES.md)**

---

## Atenção: Ao abrir uma issue certifique-se de adicionar as informações abaixo:

Ao abrir issue ou PR, inclua:

```markdown
## Parametrização
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

<!-- ## 🚨 ATENÇÃO: Esta biblioteca será modularizada! 🚨 -->

<!-- A biblioteca nfewizard-io agora está dividida em módulos menores para facilitar a manutenção e otimizar o tamanho do pacote.

⚠️ A partir da versão 1.0.0 este repositório será responsável apenas pelos serviços de NF-e.  Para os serviços de NFC-e utilize o `@nfewizard-io/nfce`. -->

<!-- ## 📦 Como instalar os novos pacotes?

### Para utilizar serviços relacionados à NFCe instale o modulo:
```typescript
npm i @nfewizard-io/nfce
```
🚀 Pronto, agora você pode decidir utilizar apenas os serviços que precisa! -->

## Sobre a Biblioteca
NFeWizard-io é uma biblioteca Node.js projetada para simplificar a interação com os webservices da SEFAZ, proporcionando uma solução robusta para automação de processos relacionados à Nota Fiscal Eletrônica (NF-e), Nota Fiscal de Consumidor Eletrônica (NFC-e), Nota Fiscal de Serviços Eletrônica (NFS-e) e Conhecimento de Transporte Eletrônico (CT-e). A biblioteca oferece métodos abrangentes para diversas operações fiscais, incluindo:

- **Autorização (Emissão de NFe, NFCe e NFSe)**: Submissão de Notas Fiscais Eletrônicas, Notas Fiscais de Consumidor Eletrônica e Notas Fiscais de Serviços Eletrônica para autorização.
- **Distribuição DFe (NF-e, NFS-e e CT-e)**: Consulta e Download de DF-e (Documentos fiscais eletrônicos), facilitando o acesso a documentos fiscais eletrônicos de NF-e, NFS-e e CT-e.
- **Consulta de Protocolo**: Verificação da situação atual da NF-e na Base de Dados do Portal da Secretaria de Fazenda Estadual.
- **Inutilização de NFe**: Processo de inutilização de números de NF-e que não serão utilizados, assegurando a conformidade fiscal.
- **Consulta de Status do Serviço**: Monitoramento do status dos serviços da SEFAZ, garantindo a disponibilidade dos webservices.
- **Recepção de Eventos**: Tratamento de diversos eventos relacionados à NFe e NFCe, incluindo:
    - Cancelamento de NFe e NFCe
    - Carta de Correção
    - Ciência da Operação
    - Confirmação da Operação
    - Desconhecimento da Operação
    - EPEC (Evento Prévio de Emissão em Contingência)
    - Operação Não Realizada
- **Geração de DANFE**: Criação do Documento Auxiliar da Nota Fiscal Eletrônica (DANFE), um resumo impresso da NFe.

## 🚧 ATENÇÃO 🚧
### Requisitos para instalação
Para utilizar algusn funções desta biblioteca, é necessário ter o JDK instalado no ambiente.

Caso esteja rodando em um ambiente sem suporte ao JDK (como a Vercel) ou que não permita a adição de layers (diferente do AWS Lambda), é possível configurar a biblioteca como uma external lib e utilizar a seguinte opção ao inicializá-la:
```typescript
useForSchemaValidation: 'validateSchemaJsBased'
```
### Exemplo de configuração no Serverless Framework
Se estiver usando o Serverless Framework, você pode marcar a biblioteca como external no arquivo de configuração (.yml), garantindo que ela não seja empacotada junto ao código da aplicação:
```yml
build:
  esbuild:
    bundle: true
    minify: true
    sourcemap: true
    target: 'node20'
    format: 'cjs'
    external:
      - better-sqlite3
      - mysql
      - mysql2
      - oracledb
      - tedious
      - sqlite3
      - pg-query-stream
      - nfewizard-io
```
Dessa forma, a nfewizard-io será tratada como uma dependência externa, permitindo sua execução sem a necessidade do JDK no ambiente.

### Exemplo de importação CJS

Para ambientes CJS (CommonJS) a importação utilizada deverá ser feita da seguinte maneira:
```typescript
const NFeWizard = require('nfewizard-io').default;
```


## Exemplo de Utilização

```typescript
import NFeWizard from 'nfewizard-io';
// Instanciar
const nfeWizard = new NFeWizard();

// Inicializar
await nfeWizard.NFE_LoadEnvironment({
        config: {
            dfe: {
                baixarXMLDistribuicao: true,
                pathXMLDistribuicao: "tmp/DistribuicaoDFe",
                armazenarXMLAutorizacao: true,
                pathXMLAutorizacao: "tmp/Autorizacao",
                armazenarXMLRetorno: true,
                pathXMLRetorno: "tmp/RequestLogs",
                armazenarXMLConsulta: true,
                pathXMLConsulta: "tmp/RequestLogs",
                armazenarXMLConsultaComTagSoap: false,
                armazenarRetornoEmJSON: false,
                pathRetornoEmJSON: "tmp/DistribuicaoDFe",

                pathCertificado: "certificado.pfx",
                senhaCertificado: "1234",
                UF: "SP",
                CPFCNPJ: "99999999999999",
            },
            nfe: {
                ambiente: 2,
                versaoDF: "4.00",
                idCSC: 1,
                tokenCSC: '99999999-9999-9999-9999-999999999999'
            },
            email: {
                host: 'mail.provider.com.br',
                port: 465,
                secure: true, 
                auth: {
                    user: 'nfe.example@email.com.br',
                    pass: '123456' 
                },
                emailParams: {
                    from: 'Company <noreply.company@email.com>',
                    to: 'customer.name@email.com.br',
                }
            },
            lib: {
                connection: {
                    timeout: 30000,
                },
                log: {
                    exibirLogNoConsole: true,
                    armazenarLogs: true,
                    pathLogs: 'tmp/Logs'
                },
                useOpenSSL: false,
                useForSchemaValidation: 'validateSchemaJsBased',
            }
        }
    });

    // Exemplo de Utilização
    const chaveNFe: DFePorChaveNFe = {
        cUFAutor: 35,
        CNPJ: '99999999999999',
        consChNFe: {
            chNFe: '00000000000000000000000000000000000000000000'
        },
    }

    await nfeWizard.NFE_DistribuicaoDFePorChave(chaveNFe);
```

## Documentação

- **Documentação completa**: [NFeWizard-io - Docs](https://nfewizard-org.github.io/)
- **Guia de Migração Completo**: [BREAKING_CHANGES.md](BREAKING_CHANGES.md)
- **Exemplos de Uso**: Consulte a pasta [examples/](examples/) com exemplos práticos para NFe, NFCe, NFSe e CTe
  - [Guia de Build](examples/BUILD.md)
  - [Instalação Local para Testes](examples/INSTALACAO_LOCAL.md)
  - [Exemplos de NFe](examples/NFe/)
  - [Exemplos de NFCe](examples/NFCe/)
  - [Exemplos de NFSe](examples/NFSe/)
  - [Documentação CTe](DOCS_CTE.md)
  

## Última Release (1.0.0)

### 🎉 Modularização Completa

- **Breaking Change**: Biblioteca modularizada em 7 pacotes  para otimização de bundle
- **NFCe**: Movido para `@nfewizard/nfce`
- **NFSe**: Novo pacote `@nfewizard/nfse` com suporte a Nota Fiscal de Serviços Eletrônica (em testes)
- **DANFE**: Movido para `@nfewizard/danfe` - agora é opcional
- **CTe**: Movido para `@nfewizard/cte`
- **Redução de bundle**: Até 77% menor para casos de uso específicos (4.37 MB vs 19.1 MB)
- **Novo**: Método `NFCE_Cancelamento()` disponível no pacote NFCe
- **NT 2025.002 v.130**: Suporte à Reforma Tributária

📋 **Consulte o [Guia de Migração Completo](BREAKING_CHANGES.md)** para atualizar seu código

## Observações

- `Certificado`: Implementado apenas em certificados A1.
- `NodeJs`: Testado com versões 16 ou superiores.
- `UF`: Testado apenas para São Paulo. Por favor, abra uma issue caso encontre problemas com outros estados.

**Para uma boa experiência de Debug no VS Code permitindo fazer o "step into" nos métodos do NfeWizzard, usar o launch.json com sourceMpas true e outFiles conforme segue:**:
```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Debug NFe Wizard",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "program": "${workspaceFolder}/src/testes.ts",
            "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/tsx",
            "runtimeArgs": [],
            "console": "integratedTerminal",
            "env": {
                "NODE_ENV": "development"
            },
            "sourceMaps": true,
            "restart": true,
            "protocol": "inspector",
            "outFiles": [
                "${workspaceFolder}/**/*.js"
            ]
        },
        {
            "type": "node",
            "request": "launch",
            "name": "Debug com ts-node",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "program": "${workspaceFolder}/src/testes.ts",
            "runtimeArgs": [
                "--loader", "ts-node/esm"
            ],
            "console": "integratedTerminal",
            "env": {
                "NODE_ENV": "development",
                "NODE_OPTIONS": "--loader ts-node/esm"
            },
            "sourceMaps": true
        }
    ]
}
```

**Exemplo do tsconfig.json do projeto que importa o NFEWizard.IO:**:
```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "nodenext",
    "outDir": "dist", 
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "sourceMap": true,
    "inlineSources": true,
    "inlineSourceMap": false,
    "declaration": true,
    "declarationMap": true,
    "moduleResolution": "nodenext"
  }
}
```

## Em Desenvolvimento

### 🧪 NFSe - Em Fase de Testes

O pacote `@nfewizard/nfse` está disponível mas ainda **em fase de testes**. Use com cautela em produção.

**Funcionalidades implementadas:**
- ✅ Autorização de NFSe
- ✅ Consulta de NFSe por chave
- ✅ Consulta de Parâmetros Municipais
- ✅ Registro de Eventos (Cancelamento, etc.)
- ✅ Distribuição por NSU

**Status**: Aguardando feedback da comunidade para estabilização.

### Próximos Passos

- 🔄 Estabilização do módulo NFSe com base em feedback
- 📊 Melhorias no tratamento de LOGs
- 🧪 Testes adicionais em diferentes municípios

## Contribua para Nossa Biblioteca Open Source

Primeiramente, obrigado por considerar contribuir para nossa biblioteca! Nosso projeto é de código aberto e gratuito para uso, mas manter e desenvolver novas funcionalidades requer tempo e esforço. Se você achar nosso trabalho útil e quiser apoiar nosso desenvolvimento, considere fazer uma doação.

## Por que doar?

- **Suporte Contínuo**: Sua doação ajuda a manter o projeto ativo e em constante evolução.
- **Novos Recursos**: Com seu apoio, podemos adicionar novos recursos e melhorias.
- **Manutenção e Correções**: Garantimos que bugs sejam corrigidos rapidamente e que o código esteja sempre atualizado.
- **Reconhecimento**: Apoiadores são reconhecidos em nossa documentação e página do projeto.
- **Fraldas**: Meu primeiro filho nasceu no inicio desse ano, fraldas são caras! 🍼🚼

## Como doar?

Você pode contribuir através das seguintes plataformas:

- [GitHub Sponsors](https://github.com/sponsors/Maurelima?frequency=recurring&sponsor=Maurelima)
- **Pix**: Se preferir doar via Pix, utilize a seguinte chave:

    ```
    Chave Pix: 944ce2f2-e90f-400a-a388-bb1fe6719e02
    Nome: Marco Lima
    ```

Agradecemos imensamente seu apoio!

## Outras formas de contribuir

Se você não puder doar financeiramente, existem outras maneiras valiosas de contribuir:

- **Reportar Bugs**: Envie relatórios de bugs e problemas que encontrar.
- **Submeter PRs**: Contribua com código, documentação ou testes.
- **Espalhe a Palavra**: Compartilhe nosso projeto com amigos e colegas.

## Agradecimentos

Agradecemos imensamente seu apoio e contribuição. Juntos, podemos construir e manter uma ferramenta incrível para todos!

**Muito obrigado!**


# Contribuidores

## Contribuidores de Código

Agradecemos aos seguintes desenvolvedores por suas contribuições ao projeto:

<table>
  <tr>
    <td align="center"><a href="https://github.com/dliocode"><img src="https://github.com/dliocode.png" width="50px;" style="border-radius:50%" alt=""/><br /><sub><b>dliocode</b></sub></a></td>
    <td align="center"><a href="https://github.com/ThalesAugusto0"><img src="https://github.com/ThalesAugusto0.png" width="50px;" style="border-radius:50%" alt=""/><br /><sub><b>ThalesAugusto0</b></sub></a></td>
    <td align="center"><a href="https://github.com/cassioseffrin"><img src="https://github.com/cassioseffrin.png" width="50px;" style="border-radius:50%" alt=""/><br /><sub><b>cassioseffrin</b></sub></a></td>
    <td align="center"><a href="https://www.linkedin.com/company/infinitedev/?originalSubdomain=br"><img src="https://media.licdn.com/dms/image/v2/C4D0BAQHwL-vRW4A0zw/company-logo_200_200/company-logo_200_200/0/1677157135085/infinitedev_logo?e=1756339200&v=beta&t=QH9t_R-s9-g-RDh-BM1eiu3eaO_d-F60Hk0xy6dy0M4" width="50px;" style="border-radius:50%" alt=""/><br /><sub><b>InfiniteDev</b></sub></a></td>
  </tr>
</table>

## Patrocínios

Agradecemos imensamente aos nossos patrocinadores pela sua generosidade.

### Contribuições

<table>
  <tr>
    <td align="center"><a href="https://github.com/italosll"><img src="https://github.com/italosll.png" width="50px;" style="border-radius:50%" alt=""/><br /><sub><b>italosll</b></sub></a></td>
    <td align="center"><a href="https://www.linkedin.com/company/infinitedev/?originalSubdomain=br"><img src="https://media.licdn.com/dms/image/v2/C4D0BAQHwL-vRW4A0zw/company-logo_200_200/company-logo_200_200/0/1677157135085/infinitedev_logo?e=1756339200&v=beta&t=QH9t_R-s9-g-RDh-BM1eiu3eaO_d-F60Hk0xy6dy0M4" width="50px;" style="border-radius:50%" alt=""/><br /><sub><b>InfiniteDev</b></sub></a></td>
  </tr>
</table>

### Contribuições Mensais

<table>
  <tr>
    <!-- <td align="center"><a href="https://github.com/user5"><img src="https://github.com/user5.png" width="50px;" style="border-radius:50%" alt=""/><br /><sub><b>User5</b></sub></a></td> -->
    <!-- Adicione mais contribuidores conforme necessário -->
  </tr>
</table>

---

## 🛠️ Desenvolvimento

### Testar Localmente (antes de publicar no npm)

Esta biblioteca é um monorepo. Para testar localmente:

**Instalação completa (todos os módulos):**
```bash
./scripts/local-install.sh ~/seu-projeto-teste
```

**Instalação única (simula `npm install <pacote>`):**
```bash
# Testar apenas NFe
./scripts/local-install-single.sh nfewizard-io ~/seu-projeto-teste

# Testar apenas NFCe
./scripts/local-install-single.sh @nfewizard/nfce ~/seu-projeto-teste

# Testar apenas CTe
./scripts/local-install-single.sh @nfewizard/cte ~/seu-projeto-teste
```

### 📖 Documentação

- **[Scripts de Instalação Local](scripts/README.md)** - Como usar os scripts de teste
- **[Guia de Instalação Local](examples/INSTALACAO_LOCAL.md)** - Detalhes sobre testes locais
- **[Guia de Build](examples/BUILD.md)** - Build e publicação no npm

---

## Criadores

| [<img src="https://avatars.githubusercontent.com/u/59918400?s=400&u=3554ebcf0f75263637516867945ebd371e68da71&v=4" width="75px;"/>](https://github.com/Maurelima) |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|                                                            [Marco Lima](https://github.com/Maurelima)                                                            |

## Licença

Projetado com ♥ por [Marco Lima](https://github.com/Maurelima). Licenciado sob a [GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.pt-br.html).
