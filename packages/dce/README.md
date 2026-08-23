# @nfewizard/dce 🪄

> Biblioteca especializada em DCe (Declaração de Conteúdo Eletrônica) - Integração com webservices da SEFAZ

## 🧪 BETA — em teste

Este pacote **já pode ser usado** em testes e homologação, mas ainda está em **BETA**.

- A API pública (`DCEWizard`, `DCE_Autorizacao`, `DCE_AutorizacaoZip`) pode mudar.
- O retorno dos serviços e a serialização XML ainda estão em validação.
- Não use em produção sem validar o fluxo no seu ambiente.

Escopo atual da Fase 1:
- `DCE_Autorizacao`
- `DCE_AutorizacaoZip`

## Atenção: Ao abrir uma issue certifique-se de adicionar as informações abaixo:

Ao abrir issue ou PR, inclua:

```markdown
## Parametrização
- UF: PR
- Certificado: A1
- Método: DCE_Autorizacao
- Status: ✅ Funcionando / ❌ Com erro
```

## Logs Relevantes

Inclua também os logs gerados no diretório configurado em `pathLogs`.
Lembre-se de adicionar os logs **app.jsonl**, **error.jsonl** e **http.jsonl**.

```jsonl
{"context":"DCE_Autorizacao","error":{"message":"Rejeição: Consumo Indevido",...}
```

## Sobre a Biblioteca

@nfewizard/dce é uma biblioteca Node.js especializada em DCe (Declaração de Conteúdo Eletrônica), projetada para simplificar a interação com os webservices da SEFAZ. Nesta fase inicial (BETA), a biblioteca oferece:

- **Autorização (Emissão de DCe)**: Submissão da Declaração de Conteúdo Eletrônica para autorização.
- **Autorização compactada (`DCE_AutorizacaoZip`)**: Envio do mesmo fluxo via método zip do webservice.

Operações futuras (consulta, evento, cancelamento e distribuição) ainda não estão expostas na facade.

## Características

- 🧪 **BETA** - Pacote em teste, sujeito a alterações
- ✅ **TypeScript** - Tipos completos incluídos
- ✅ **Certificado A1** - Suporte completo para certificados digitais
- ✅ **Validação de Schema** - Validação automática de XMLs
- ✅ **Logs estruturados** - Sistema de logs em JSONL

## Instalação

```bash
npm install @nfewizard/dce
# ou
pnpm add @nfewizard/dce
```

## 🚧 ATENÇÃO 🚧
### Requisitos para instalação

Para utilizar esta biblioteca, é necessário ter o JDK instalado no ambiente.

Caso esteja rodando em um ambiente sem suporte ao JDK (como a Vercel) ou que não permita a adição de layers (diferente do AWS Lambda), é possível configurar a biblioteca como uma external lib e utilizar a seguinte opção ao inicializá-la:
```typescript
useForSchemaValidation: 'validateSchemaJsBased'
```

## Exemplo de Utilização

```typescript
import { DCEWizard } from '@nfewizard/dce';
import { DCEAutorizacaoPayload } from '@nfewizard/types/dce';

// Instanciar
const dceWizard = new DCEWizard();

// Inicializar
await dceWizard.NFE_LoadEnvironment({
    config: {
        dfe: {
            armazenarXMLAutorizacao: true,
            pathXMLAutorizacao: "tmp/DCe/Autorizacao",
            armazenarXMLRetorno: true,
            pathXMLRetorno: "tmp/DCe/Retorno",
            armazenarXMLConsulta: true,
            pathXMLConsulta: "tmp/DCe/Consulta",

            pathCertificado: "certificado.pfx",
            senhaCertificado: "1234",
            UF: "PR",
            CPFCNPJ: "99999999999999",
        },
        lib: {
            connection: {
                timeout: 30000,
            },
            log: {
                exibirLogNoConsole: true,
                armazenarLogs: true,
                pathLogs: 'tmp/Logs/DCe'
            },
            useForSchemaValidation: 'validateSchemaJsBased',
        }
    }
});

// Exemplo de Autorização de DCe
const dceData: DCEAutorizacaoPayload = {
    xml: '<DCe><infDCe Id="DCe123" /></DCe>',
};

const resultado = await dceWizard.DCE_Autorizacao(dceData);
console.log(resultado.xMotivo);

// Exemplo de Autorização compactada
const resultadoZip = await dceWizard.DCE_AutorizacaoZip(dceData);
console.log(resultadoZip.xMotivo);
```

## Funcionalidades Disponíveis

### 📝 Operações da Fase 1 (BETA)

| Método | Descrição |
|--------|-----------|
| `NFE_LoadEnvironment()` | Inicializa ambiente, certificado e dependências |
| `DCE_Autorizacao()` | Autorização de DCe |
| `DCE_AutorizacaoZip()` | Autorização de DCe via método zip |

> ⚠️ Aviso de BETA: o módulo DCe ainda está em teste e pode receber ajustes na serialização, validação de schema e na resposta bruta dos serviços antes da estabilização da API.

## Documentação

Para a documentação completa acesse [NFeWizard-io - Docs](https://nfewizard-org.github.io/)

## Observações

- `Status`: Pacote em **BETA**. Use preferencialmente em homologação.
- `Certificado`: Implementado apenas em certificados A1.
- `NodeJs`: Testado com versões 16 ou superiores.
- `UF`: Endpoints atuais apontam para a SEFAZ/PR (produção e homologação). Por favor, abra uma issue caso encontre problemas.

## Contribua para Nossa Biblioteca Open Source

Primeiramente, obrigado por considerar contribuir para nossa biblioteca! Nosso projeto é de código aberto e gratuito para uso, mas manter e desenvolver novas funcionalidades requer tempo e esforço. Se você achar nosso trabalho útil e quiser apoiar nosso desenvolvimento, considere fazer uma doação.

### Por que doar?

- **Suporte Contínuo**: Sua doação ajuda a manter o projeto ativo e em constante evolução.
- **Novos Recursos**: Com seu apoio, podemos adicionar novos recursos e melhorias.
- **Manutenção e Correções**: Garantimos que bugs sejam corrigidos rapidamente e que o código esteja sempre atualizado.
- **Reconhecimento**: Apoiadores são reconhecidos em nossa documentação e página do projeto.
- **Fraldas**: Meu primeiro filho nasceu no inicio desse ano, fraldas são caras! 🍼🚼

### Como doar?

Você pode contribuir através das seguintes plataformas:

- [GitHub Sponsors](https://github.com/sponsors/Maurelima?frequency=recurring&sponsor=Maurelima)
- **Pix**: Se preferir doar via Pix, utilize a seguinte chave:

    ```
    Chave Pix: 944ce2f2-e90f-400a-a388-bb1fe6719e02
    Nome: Marco Lima
    ```

Agradecemos imensamente seu apoio!

### Outras formas de contribuir

Se você não puder doar financeiramente, existem outras maneiras valiosas de contribuir:

- **Reportar Bugs**: Envie relatórios de bugs e problemas que encontrar.
- **Submeter PRs**: Contribua com código, documentação ou testes.
- **Espalhe a Palavra**: Compartilhe nosso projeto com amigos e colegas.

## Agradecimentos

Agradecemos imensamente seu apoio e contribuição. Juntos, podemos construir e manter uma ferramenta incrível para todos!

**Muito obrigado!**

## Criadores

| [<img src="https://avatars.githubusercontent.com/u/59918400?s=400&u=3554ebcf0f75263637516867945ebd371e68da71&v=4" width="75px;"/>](https://github.com/Maurelima) |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|                                                            [Marco Lima](https://github.com/Maurelima)                                                            |

## Licença

Projetado com ♥ por [Marco Lima](https://github.com/Maurelima). Licenciado sob a [GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.pt-br.html).
