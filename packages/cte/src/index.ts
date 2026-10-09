/*
 * This file is part of NFeWizard-io.
 * 
 * NFeWizard-io is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * NFeWizard-io is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with NFeWizard-io. If not, see <https://www.gnu.org/licenses/>.
 */

// Main CTe Wizard class (default export for easy usage)
export { CTEWizard } from './CTEWizard.js';
export { CTEWizard as default } from './CTEWizard.js';

// CTe Operations
export { CTEDistribuicaoDFe } from './operations/CTEDistribuicaoDFe/CTEDistribuicaoDFe.js';
export { CTEDistribuicaoDFePorNSU } from './operations/CTEDistribuicaoDFe/CTEDistribuicaoDFePorNSU.js';
export { CTEDistribuicaoDFePorUltNSU } from './operations/CTEDistribuicaoDFe/CTEDistribuicaoDFePorUltNSU.js';
export { CTEStatusServico } from './operations/CTEStatusServico/CTEStatusServico.js';
export { CTEConsultaProtocolo } from './operations/CTEConsultaProtocolo/CTEConsultaProtocolo.js';
export { CTEAutorizacao } from './operations/CTEAutorizacao/CTEAutorizacao.js';
export { CTEAutorizacaoOS } from './operations/CTEAutorizacaoOS/CTEAutorizacaoOS.js';
export { GTVeAutorizacao } from './operations/GTVeAutorizacao/GTVeAutorizacao.js';
export { CTESimplificadoAutorizacao } from './operations/CTESimplificadoAutorizacao/CTESimplificadoAutorizacao.js';
export { CTEConsultaCadastro } from './operations/CTEConsultaCadastro/CTEConsultaCadastro.js';
export { CTECancelamento } from './operations/CTERecepcaoEvento/CTECancelamento.js';
export { CTECartaDeCorrecao } from './operations/CTERecepcaoEvento/CTECartaDeCorrecao.js';
export { CTEEpec } from './operations/CTERecepcaoEvento/CTEEpec.js';
export { CTERegistroMultimodal } from './operations/CTERecepcaoEvento/CTERegistroMultimodal.js';
export { CTEPrestacaoDesacordo } from './operations/CTERecepcaoEvento/CTEPrestacaoDesacordo.js';
export { CTECancelamentoPrestacaoDesacordo } from './operations/CTERecepcaoEvento/CTECancelamentoPrestacaoDesacordo.js';
export { CTEComprovanteEntrega } from './operations/CTERecepcaoEvento/CTEComprovanteEntrega.js';
export { CTECancelamentoComprovanteEntrega } from './operations/CTERecepcaoEvento/CTECancelamentoComprovanteEntrega.js';
export { CTEInsucessoEntrega } from './operations/CTERecepcaoEvento/CTEInsucessoEntrega.js';
export { CTECancelamentoInsucessoEntrega } from './operations/CTERecepcaoEvento/CTECancelamentoInsucessoEntrega.js';
export { CTEVinculacaoPagamento } from './operations/CTERecepcaoEvento/CTEVinculacaoPagamento.js';
export { CTECancelamentoVinculacaoPagamento } from './operations/CTERecepcaoEvento/CTECancelamentoVinculacaoPagamento.js';

// CTe Services
export { CTEDistribuicaoDFeService } from './services/CTEDistribuicaoDFe/CTEDistribuicaoDFeService.js';
export { CTEDistribuicaoDFePorNSUService } from './services/CTEDistribuicaoDFe/CTEDistribuicaoDFePorNSU.js';
export { CTEDistribuicaoDFePorUltNSUService } from './services/CTEDistribuicaoDFe/CTEDistribuicaoDFePorUltNSU.js';
export { CTEStatusServicoService } from './services/CTEStatusServico/CTEStatusServicoService.js';
export { CTEConsultaProtocoloService } from './services/CTEConsultaProtocolo/CTEConsultaProtocoloService.js';
export { CTEAutorizacaoService } from './services/CTEAutorizacao/CTEAutorizacaoService.js';
export { CTEAutorizacaoOSService } from './services/CTEAutorizacaoOS/CTEAutorizacaoOSService.js';
export { GTVeAutorizacaoService } from './services/GTVeAutorizacao/GTVeAutorizacaoService.js';
export { CTESimplificadoAutorizacaoService } from './services/CTESimplificadoAutorizacao/CTESimplificadoAutorizacaoService.js';
export { CTEConsultaCadastroService } from './services/CTEConsultaCadastro/CTEConsultaCadastroService.js';
export { CTERecepcaoEventoService } from './services/CTERecepcaoEvento/CTERecepcaoEventoService.js';
export { CTECancelamentoService } from './services/CTERecepcaoEvento/CTECancelamentoService.js';
export { CTECartaDeCorrecaoService } from './services/CTERecepcaoEvento/CTECartaDeCorrecaoService.js';
export { CTEEpecService } from './services/CTERecepcaoEvento/CTEEpecService.js';
export { TP_EMIS, tpEmisDaChave, chaveEmSvc } from './services/util/CTeContingencia.js';
export { gerarQrCodeCTe } from './services/util/CTeQrCode.js';
export { CTERegistroMultimodalService } from './services/CTERecepcaoEvento/CTERegistroMultimodalService.js';
export { CTEPrestacaoDesacordoService } from './services/CTERecepcaoEvento/CTEPrestacaoDesacordoService.js';
export { CTECancelamentoPrestacaoDesacordoService } from './services/CTERecepcaoEvento/CTECancelamentoPrestacaoDesacordoService.js';
export { CTEComprovanteEntregaService } from './services/CTERecepcaoEvento/CTEComprovanteEntregaService.js';
export { CTECancelamentoComprovanteEntregaService } from './services/CTERecepcaoEvento/CTECancelamentoComprovanteEntregaService.js';
export { CTEInsucessoEntregaService } from './services/CTERecepcaoEvento/CTEInsucessoEntregaService.js';
export { CTECancelamentoInsucessoEntregaService } from './services/CTERecepcaoEvento/CTECancelamentoInsucessoEntregaService.js';
export { CTEVinculacaoPagamentoService } from './services/CTERecepcaoEvento/CTEVinculacaoPagamentoService.js';
export { CTECancelamentoVinculacaoPagamentoService } from './services/CTERecepcaoEvento/CTECancelamentoVinculacaoPagamentoService.js';
export { CTEBaseService, CTE_VERSAO } from './services/util/CTEBaseService.js';

// CTe Utilities
export { DistribuicaoHandler } from './services/CTEDistribuicaoDFe/util/DistribuicaoHandler.js';

// Re-export types for convenience (user doesn't need to install @nfewizard/types separately)
export type * from '@nfewizard/types/cte';
export type * from '@nfewizard/types/shared';
