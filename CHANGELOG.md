# Changelog

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
