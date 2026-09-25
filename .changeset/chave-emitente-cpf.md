---
'nfewizard-io': patch
'@nfewizard/nfce': patch
---

Corrige a chave de acesso da NF-e e da NFC-e quando o emitente é pessoa física. O CPF de 11 dígitos entrava direto na chave, que saía com 41 posições e DV errado; passa a ser completado com zeros à esquerda até as 14 posições reservadas ao documento do emitente. Chaves com CNPJ não mudam.
