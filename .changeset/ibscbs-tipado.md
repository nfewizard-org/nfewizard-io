---
'@nfewizard/types': minor
'@nfewizard/nfse': minor
---

Tipa completamente o bloco `IBSCBS` da DPS (antes `any`). O Código de Situação Tributária (CST/CSTReg) não é mais aceito como campo separado: é sempre derivado dos 3 primeiros dígitos do `cClassTrib`/`cClassTribReg`, conforme a regra de negócio 627 do SEFIN Nacional, evitando gerar um par CST/cClassTrib inconsistente.
