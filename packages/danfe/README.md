# @nfewizard/danfe 🪄

## Atenção: Ao abrir uma issue certifique-se de adicionar as informações abaixo:

Ao abrir issue ou PR, inclua:

```markdown
## Parametrização
- Tipo de DANFE: NFe / NFCe
```

## Logs Relevantes

Inclua também informações detalhadas sobre o erro:

```jsonl
{"context":"DANFE_NFe","error":{"message":"Erro ao gerar PDF",...}
```

## Sobre a Biblioteca

@nfewizard/danfe é uma biblioteca Node.js especializada na geração de DANFEs (Documento Auxiliar da Nota Fiscal Eletrônica) em formato PDF. A biblioteca oferece uma solução completa e profissional para criar documentos auxiliares de alta qualidade, incluindo:

- **DANFE para NFe**: Geração do Documento Auxiliar da Nota Fiscal Eletrônica com layout padrão, incluindo:
    - Código de barras
    - Dados do emitente e destinatário
    - Produtos e serviços
    - Totalizadores e impostos
    - Informações adicionais
    - Suporte para múltiplas páginas

- **DANFE para NFCe**: Geração do Documento Auxiliar da Nota Fiscal de Consumidor Eletrônica com:
    - QR Code para consulta
    - Layout simplificado para cupom fiscal
    - Dados do consumidor
    - Produtos e totalizadores
    - Informações de pagamento

## Características

- ✅ **Suporta NFe e NFCe**
- ✅ **QR Code** para NFCe
- ✅ **Código de barras** para NFe
- ✅ **TypeScript** - Tipos completos incluídos
- ✅ **Alta qualidade** - PDFs profissionais e bem formatados

## Instalação

```bash
npm install @nfewizard/danfe
# ou
pnpm add @nfewizard/danfe
```

## Exemplo de Utilização

### DANFE para NFe

```typescript
import { NFCeGerarDanfe } from '@nfewizard/danfe';

// Json de retorno da lib nfewizard-io ou @nfewizard/nfce
const data = {} as any;

// Gerar DANFE
const danfe = new NFCeGerarDanfe({
    data, // Objeto completo com NFe, protNFe e xml
    chave: chave,
    outputPath: './nfce-danfe.pdf', // Caminho onde o PDF será salvo
    pageWidth: 226.772 
})

```

### DANFE para NFCe

```typescript
import { NFeGerarDanfe } from '@nfewizard/danfe';

// Json de retorno da lib nfewizard-io ou @nfewizard/nfce
const data = {} as any;

// Gerar DANFE
const danfe = new NFeGerarDanfe({
    data, // Objeto completo com NFe, protNFe e xml
    chave: chave,
    outputPath: './nfe-danfe.pdf', // Caminho onde o PDF será salvo
})

```

## Documentação

Para a documentação completa acesse [NFeWizard-io - Docs](https://nfewizard-org.github.io/)

## Observações

- `NodeJs`: Testado com versões 16 ou superiores.
- `Fontes`: A biblioteca inclui fontes Arial para garantir consistência visual.
- `PDF`: Os PDFs gerados seguem o layout padrão definido pela SEFAZ.

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
