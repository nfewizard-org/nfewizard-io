---
'nfewizard-io': major
---

**Breaking change:** atualiza o `nodemailer` de `^8.0.5` para `^10.3.1` para corrigir 15 alertas de segurança do Dependabot (todos com correção só a partir da 10.1.4). O `nodemailer` 10 exige Node.js 20 ou superior, então o `nfewizard-io` passa a declarar `"engines": { "node": ">=20.0.0" }` e deixa de suportar Node.js 16 e 18. A API de envio de e-mail (`MailAdapter`) não muda. Também atualiza o `axios` para `^1.21.0`.
