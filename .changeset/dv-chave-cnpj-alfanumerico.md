---
'nfewizard-io': patch
'@nfewizard/nfce': patch
---

Corrige o dígito verificador da chave de acesso da NF-e e da NFC-e quando o emitente tem CNPJ alfanumérico. O cálculo usava `parseInt` em cada caractere e as letras viravam `NaN`; passa a usar o valor ASCII menos 48, como já faz o `ValidaCPFCNPJ`. Chaves com CNPJ numérico mantêm o mesmo DV.
