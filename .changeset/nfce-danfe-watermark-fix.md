---
'@nfewizard/danfe': patch
---

Corrige a impossibilidade de desabilitar a marca d'água na DANFE de NFC-e. O método `NFCeGerarDanfe.generatePDF` usava `exibirMarcaDaguaDanfe || true`, o que forçava a marca d'água sempre ativa e ignorava o valor `false`. Passa a usar `?? true`, como já ocorre na DANFE de NF-e, permitindo desabilitar a marca d'água ao passar `false`.
