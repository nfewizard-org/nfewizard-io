---
'@nfewizard/types': minor
'@nfewizard/shared': minor
'nfewizard-io': minor
'@nfewizard/nfce': minor
---

Suporte à NT 2026.005 v1.00 (Reforma Tributária – Simples Nacional) na NF-e e na NFC-e. Os schemas passam para o Pacote de Liberação 010h v1.03: `leiauteNFe_v4.00.xsd`, `DFeTiposBasicos_v1.00.xsd`, `e110001_v1.00.xsd` e o novo `e412140_v1.00.xsd`. O pacote também traz o grupo opcional `gPgtoVinc` da NT 2026.006, ainda sem tipos. Entram os tipos de `emit.tpRegimeIBSCBS` (C21a), `prod.cAtivSN` (I17d), `IBSCBS.gTribSN` (UB115a) e `IBSCBSTot.gTribSN` (W59h), e `DetEventoTributacaoSimplesNacional` para ler o evento 412140 nos retornos de consulta e distribuição. `NFE_Autorizacao`, `NFCE_Autorizacao` e `NFE_GerarXml` colocam esses campos na posição do leiaute mesmo quando chegam em outra ordem no objeto; XMLs sem os campos novos não mudam. O `vNFTot` passa a ser tipado em `total`, onde o leiaute o espera; em `IBSCBSTot` fica marcado como obsoleto.
