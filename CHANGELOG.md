# Changelog

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
