# Changelog

## [0.5.0] - 2025-08-31

### Feat
- **Leiaute da NF-e (Modelo 55 e 65) - Reforma Tributária - [NT 2025.002 v1.10]**
  - Atualiza Grupo B - Identificação da Nota Fiscal eletrônica
  - Atualiza Grupo N01 - ICMS Normal e ST
  - Atualiza Grupo W03 - Total da NF-e - IBS / CBS / I
  - Adiciona Grupo BB - Grupo de notas de antecipação de pagamento
  - Adiciona Grupo I - Produtos e Serviços da NF-e
  - Adiciona Grupo UB - Informações dos tributos IBS / CBS e Imposto Seletivo
  - Adiciona Grupo VB - Identificação da Nota Fiscal eletrônica
  - Adiciona Grupo VC - Referenciamento de item de outro Documento Fiscal Eletrônico - DF-e
  - Atualiza Schemas XML NF-e/NFC-e - Schema dos eventos da NT 2025.002 v.1.20
  - Atualiza Schemas XML NF-e/NFC-e - Pacote de Liberação nº 010b v. 1.21 (Novo leiaute da NF-e, NT 2025.002 v.1.20, NT 2024.003 e NT 2025.001)
  - Adiciona validação para CNPJ alfanumérico - NTC 2025.001
  - Atualiza URL-QRCode - Atualizada URL-QRCode para Goias

## [0.4.7] - 2025-08-14

### Fix
- **Rollup Config**
  - Externaliza libxmljs2.

## [0.4.6] - 2025-08-08

### Feat
- **Utility Module**
  - Altera método `verificaRejeicao` para buscar Rejeição em todos os níveis do XML.

## [0.4.5] - 2025-08-03

### Fixed
- **Utility Module**
  - Substitui libxmljs por libxmljs2, sanando problema de compatibilidade com node v24.

## [0.4.4] - 2025-07-06

### Fixed
- **package**
  - Corrige versão para build

## [0.4.3] - 2025-07-06

### Fixed
- **NFCEGerarDanfe**
  - Correções no Layout do DANFE NFC-e

## [0.4.0] - 2025-06-27

### Fixed
- **NFeWizardService**
  - Retorna propagação de erro aos métodos do NFeWizardService

## [0.3.29] - 2025-06-26

### Added
- **Sistema de Logs Estruturado:**
  - Implementado sistema de logs estruturado com suporte a JSONL (JSON Lines)
  - Logs separados por tipo: `app.jsonl`, `error.jsonl`, `http.jsonl`
  - Rotação automática de arquivos de log com controle de tamanho
  - Logs contextuais com informações detalhadas para debug
  - Suporte a diferentes níveis de log (info, error, http)

- **Sistema de Tratamento de Erros (EM DESENVOLVIMENTO):**
  - Criada classe `NFeError` para erros contextuais estruturados
  - Implementado sistema de captura e log automático de erros
  - Tratamento específico para erros de Axios, XML e rejeições SEFAZ
  - Context enrichment com informações técnicas detalhadas

- **Ferramentas de Debug:**
  - Configuração completa de debug para VS Code com suporte TypeScript
  - Arquivo `src/debug.ts` para facilitar testes durante desenvolvimento
  - Breakpoints funcionais com source maps

- **Documentação de Contribuição:**
  - Guia completo de contribuição (`CONTRIBUTING.md`)
  - Instruções detalhadas para setup do ambiente de desenvolvimento
  - Padrões de código e boas práticas documentados
  - Templates para Pull Requests e Issues

### Changed
- **Logging de Requisições HTTP:**
  - Logs HTTP agora incluem métricas de performance (duração, tamanho)
  - Informações detalhadas sobre headers, URLs e status codes

- **Tratamento de Erros nos Services NFe:**
  - Melhorado tratamento de exceções com contexto detalhado
  - Logs automáticos com stack trace e informações técnicas
  - Preservação do erro original com context enrichment

### Fixed
- Logs estruturados agora mantêm formato consistente entre console e arquivo

### Technical Improvements
- Transport customizado para Winston com suporte a JSONL
- Filtros de log por nível e contexto
- Sistema de debug não-intrusivo que não afeta produção

## [0.3.28] - 2025-06-26

### Changed
- Adiciona ICMS61 ao método mountICMS.

## [0.3.27] - 2025-06-26

### Changed
- Adiciona tratativas para emissão de NFCe com combustíveis e lubrificantes.

## [0.3.25] - 2025-06-11

### Fixed
- Corrige geração de código de barras para Danfe NFe
- Corrige exception ao utilizar o método de distribuição DFe quando não há novos documentos a serem retornados.

## [0.3.14] - 2025-03-27

### Fixed
- Ajusta método de captura de URl's para NFCe
- Ajusta URLs de Consulta de Protocolo

## [0.3.2] - 2025-01-21

### Fixed
- Remove criação do arquivo teste.xsd

## [0.3.1] - 2025-01-15

### Fixed
- Diversos ajustes na emissão de NFC-e

### Changed
- Altera estrutura de pastas da lib (existem mais alterações estruturais por vir)
- Build alterada para  gerar arquivos cjs e esm
- Ajustes no package.json para tratar a importação correta de cjs e esm por ambiente

## [0.2.3] - [0.2.4] - 2024-11-14

### Fixed
- Corrige definição do método wsdl e action soap para consulta protocolo
- Ajusta posicionamento, exibição e geração de DANFE NFCe

## [0.2.2] - 2024-11-14

### Fixed
- Corrige definição do método wsdl e action soap
- Atualizados schemas de validação XSD

## [0.2.0] - [0.2.1] - 2024-11-07


### Changed
- Externaliza libxmljs
- Finaliza ajustes para funcionamento em ambiente lambda
  

## [0.1.9] - 2024-11-07

### Changed
- **Carregamento do Ambiente:**
  - Adicionada propriedade useForSchemaValidation (config - lib - useForSchemaValidation). Caso 'validateSchemaJsBased' chama um método que não utiliza JAVA para validar o xml. Caso 'validateSchemaJavaBased' chama um método baseado em JAAVA para validar o xml.

- **Validação de XML:**
  - Adicionado método de *validateSchemaJsBased* e *validateSchemaJavaBased* para validação do XML condicionado à propriedade *useForSchemaValidation* na configuração do ambiente.

## [0.1.3] - [0.1.8] - 2024-11-05

### Fixed
- Alterado arquivo rollup.config.js para manter a build CJS como padrão.

### Changed
  
- **Carregamento do Ambiente:**
  - Adicionada flag useOpenSSL (config - lib - useOpenSSL). Caso true utiliza a lib PEM para leitura do certificado digital. Caso false utiliza node-forge. (Permite trabalhar em ambientes sem o openssl) - Default true.

- **Leitura de certificado:**
  - Adicionado método de *loadCertificateWithNodeForge* para leitura do certificado sem utilização do OpenSSL.
  - Alterado nome do método de *loadCertificate* para *loadCertificateWithPEM* - utiliza OpenSSL.

## [0.1.2] - 2024-10-30

### Fixed
- Corrigidos problemas de tipagem que impediam a *build* e a geração de DANFE.

### Changed
- **Build e Exportação:**
  - Adicionado método de *build* com Rollup, incluindo suporte para exportação em formato CJS.
  - Adicionada exportação de todos os tipos e interfaces relacionadas a NFe.
  
- **Geração de XML e DANFE:**
  - Implementados métodos para geração automática dos grupos tributários ICMS, PIS e COFINS na criação do XML de NFe e NFCe.
  - Adicionada geração de QR Code para DANFE NFC-e em versão beta.
  - Exportados os métodos para geração automática dos grupos ICMS, PIS e COFINS.

## [0.1.0] - 2024-09-05

### Changed
- Criada classe para Autorização de NFCe.
- Efetuados testes para Autorização de NFCe normal e em contingência (tpEmis = 9).

### Fixed
- Remove texto fixado no campo natOp na geração da DANFE NFe.
- Efetua parse do valor modFrete para number na definição do remetente (frete) da DANFE NFe.
- Corrige definição de URL dos WebServices que deveriam apontar para outro estado.

## [0.0.9] - 2024-08-05

### Fixed
- Corrigida criação de diretório para armazenamento temporário do código de barras na geração da DANFE.

## [0.0.8] - 2024-08-03

### Changed
- Atualizada tipagem NFe para indicar que o autXML deve vir logo após o dest.

### Fixed
- Alterado nome do campo autXml para autXML.
