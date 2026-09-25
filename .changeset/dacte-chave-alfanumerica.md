---
'@nfewizard/danfe': patch
---

Corrige o DACTE para NF-e com CNPJ alfanumérico nos documentos originários: as letras da chave eram removidas, e o documento do emitente e a série/número saíam em branco. Passa a remover só o que não é letra nem dígito.
