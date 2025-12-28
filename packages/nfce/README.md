# @nfewizard/nfce 🪄

## 🛠️ Lib atualizada com NT 2025.002 v.130 - Reforma Tributária

## Atenção: Ao abrir uma issue certifique-se de adicionar as informações abaixo:

Ao abrir issue ou PR, inclua:

```markdown
## Parametrização
- UF: SP
- Certificado: A1
- Método: NFCE_Autorizacao
- Status: ✅ Funcionando / ❌ Com erro
```

## Logs Relevantes

Inclua também os logs gerados no diretório configurado em `pathLogs`.
Lembre-se de adicionar os logs **app.jsonl**, **error.jsonl** e **http.jsonl**.

```jsonl
{"context":"NFCE_Autorizacao","error":{"message":"Rejeição: Consumo Indevido",...}
```

## Sobre a Biblioteca

@nfewizard/nfce é uma biblioteca Node.js especializada em NFCe (Nota Fiscal de Consumidor Eletrônica), projetada para simplificar a interação com os webservices da SEFAZ. A biblioteca oferece uma solução robusta e otimizada para automação de processos relacionados à NFCe, incluindo:

- **Autorização (Emissão de NFCe)**: Submissão de Notas Fiscais de Consumidor Eletrônica para autorização junto à SEFAZ.
- **Consulta de Protocolo**: Verificação da situação atual da NFCe na Base de Dados do Portal da Secretaria de Fazenda Estadual.
- **Recepção de Eventos**: Tratamento de eventos relacionados à NFCe:
    - **Cancelamento de NFCe**: Cancelamento de notas fiscais autorizadas dentro do prazo permitido pela SEFAZ.

## Características

- ✅ **Bundle otimizado** - ~3MB
- ✅ **Certificado A1** - Suporte completo para certificados digitais
- ✅ **TypeScript** - Tipos completos incluídos
- ✅ **Validação de Schema** - Validação automática de XMLs
- ✅ **Logs estruturados** - Sistema de logs em JSONL
- ✅ **Eventos NFCe** - Cancelamento e outros eventos

## Instalação

```bash
npm install @nfewizard/nfce
# ou
pnpm add @nfewizard/nfce
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
import { NFCeWizard } from '@nfewizard/nfce';
import { NFe } from '@nfewizard/types';

// Instanciar
const nfceWizard = new NFCeWizard();

// Inicializar
await nfceWizard.NFCE_LoadEnvironment({
    config: {
        dfe: {
            armazenarXMLAutorizacao: true,
            pathXMLAutorizacao: "tmp/NFCe/Autorizacao",
            armazenarXMLRetorno: true,
            pathXMLRetorno: "tmp/NFCe/Retorno",
            armazenarXMLConsulta: true,
            pathXMLConsulta: "tmp/NFCe/Consulta",
            
            pathCertificado: "certificado.pfx",
            senhaCertificado: "1234",
            UF: "SP",
            CPFCNPJ: "99999999999999",
        },
        nfce: {
            ambiente: 2, // 1=Produção, 2=Homologação
            versaoDF: "4.00",
            idCSC: 1,
            tokenCSC: '99999999-9999-9999-9999-999999999999'
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
            useForSchemaValidation: 'validateSchemaJsBased',
        }
    }
});

// Exemplo de Autorização de NFCe
const nfceData: NFe = {} as NFe;

const resultado = await nfceWizard.NFCE_Autorizacao(nfceData);
console.log(resultado);

// Exemplo de Cancelamento de NFCe
const eventoCancelamento: Cancelamento = {
    idLote: Date.now(),
    evento: [{
        cOrgao: 35, // Código do órgão (35 = São Paulo)
        tpAmb: 2,   // 1=Produção, 2=Homologação
        CNPJ: '99999999999999',
        chNFe: '35000000000000000000000000000000000000000001',
        dhEvento: new Date().toISOString(),
        tpEvento: '110111', // Cancelamento
        nSeqEvento: 1,
        verEvento: '1.00',
        detEvento: {
            descEvento: 'Cancelamento',
            nProt: '135000000000000',
            xJust: 'Motivo do cancelamento com no mínimo 15 caracteres'
        }
    }]
};

const resultadoCancelamento = await nfceWizard.NFCE_Cancelamento(eventoCancelamento);
console.log(resultadoCancelamento);
```

## Documentação

Para a documentação completa acesse [NFeWizard-io - Docs](https://nfewizard-org.github.io/)

## Observações

- `Certificado`: Implementado apenas em certificados A1.
- `NodeJs`: Testado com versões 16 ou superiores.
- `UF`: Testado principalmente para São Paulo. Por favor, abra uma issue caso encontre problemas com outros estados.

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
