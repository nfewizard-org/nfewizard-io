---
'@nfewizard/types': minor
'@nfewizard/shared': minor
'nfewizard-io': minor
'@nfewizard/nfce': minor
---

Suporte à NT 2026.006 v1.01 (Vinculação com a Transação de Pagamento do DF-e, split payment) na NF-e e na NFC-e. Entra o grupo `gPgtoVinc` (YC) no tipo `InfNFe`: `NFE_Autorizacao`, `NFCE_Autorizacao` e `NFE_GerarXml` gravam `nPag` e `idTransacao` como atributos do `gPgto`, também quando a nota chega como XML em string, e colocam o grupo entre `infIntermed` e `infAdic`. XMLs sem o grupo não mudam. Novos métodos `NFE_VinculacaoPagamento` / `NFCE_VinculacaoPagamento` (evento 110300) e `NFE_CancelamentoEvento` / `NFCE_CancelamentoEvento` (evento genérico 110001 da NT 2025.002), com os tipos `VinculacaoPagamento`, `PagamentoVinculadoNFe` e `CancelamentoEvento`; os dois eventos também são aceitos por `NFE_RecepcaoEvento`. Os schemas passam para o Pacote de Liberação 010h v1.03: `leiauteNFe_v4.00.xsd`, `DFeTiposBasicos_v1.00.xsd` e `e110001_v1.00.xsd`. O pacote também traz os campos opcionais da NT 2026.005, ainda sem tipos. Entra o `e110300_v1.00.xsd`, e o `tiposBasico_v1.03.xsd` ganha só o tipo `TCnpjBase`, de que ele precisa.
