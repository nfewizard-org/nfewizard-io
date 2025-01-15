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
import {
    NFeWizardProps,
    EventoNFe,
    ConsultaNFe,
    NFe,
    InutilizacaoData,
    NFEGerarDanfeProps,
    DFePorChaveNFe,
    DFePorUltimoNSU,
    DFePorNSU,
    Cancelamento,
    CienciaDaOperacao,
    ConfirmacaoDaOperacao,
    OperacaoNaoRealizada,
    CartaDeCorrecao,
    DesconhecimentoDaOperacao,
    EPEC,
    EmailParams,
} from 'src/core/types';
import { NFeWizardImpl, NFeWizardServiceImpl } from '@Interfaces';
import NFeWizardService from '@Modules/dfe/nfe/services/NFeWizard/NFeWizardService';

export default class NFeWizard implements NFeWizardImpl {
    private nfeWizardService: NFeWizardServiceImpl;

    constructor() {
        this.nfeWizardService = new NFeWizardService();
    }

    async NFE_LoadEnvironment({ config }: { config: NFeWizardProps }) {
        await this.nfeWizardService.NFE_LoadEnvironment({ config });
    }

    /**
     * Status Serviço
     */
    async NFE_ConsultaStatusServico() {
        return await this.nfeWizardService.NFE_ConsultaStatusServico();
    }

    /**
     * Consulta Protocolo
     */
    async NFE_ConsultaProtocolo(chave: string) {
        return this.nfeWizardService.NFE_ConsultaProtocolo(chave);
    }

    /**
     * Recepção de Eventos
     */
    async NFE_RecepcaoEvento(evento: EventoNFe) {
        return await this.nfeWizardService.NFE_RecepcaoEvento(evento);
    }
    async NFE_EventoPrevioDeEmissaoEmContingencia(evento: EPEC) {
        return await this.nfeWizardService.NFE_EventoPrevioDeEmissaoEmContingencia(evento);
    }
    async NFE_Cancelamento(evento: Cancelamento) {
        return await this.nfeWizardService.NFE_Cancelamento(evento);
    }
    async NFE_CienciaDaOperacao(evento: CienciaDaOperacao) {
        return await this.nfeWizardService.NFE_CienciaDaOperacao(evento);
    }
    async NFE_ConfirmacaoDaOperacao(evento: ConfirmacaoDaOperacao) {
        return await this.nfeWizardService.NFE_ConfirmacaoDaOperacao(evento);
    }
    async NFE_OperacaoNaoRealizada(evento: OperacaoNaoRealizada) {
        return await this.nfeWizardService.NFE_OperacaoNaoRealizada(evento);
    }
    async NFE_CartaDeCorrecao(evento: CartaDeCorrecao) {
        return await this.nfeWizardService.NFE_CartaDeCorrecao(evento);
    }
    async NFE_DesconhecimentoDaOperacao(evento: DesconhecimentoDaOperacao) {
        return await this.nfeWizardService.NFE_DesconhecimentoDaOperacao(evento);
    }

    /**
     * Distribuição DFe
     */
    async NFE_DistribuicaoDFe(data: ConsultaNFe) {
        return await this.nfeWizardService.NFE_DistribuicaoDFe(data);
    }
    async NFE_DistribuicaoDFePorUltNSU(data: DFePorUltimoNSU) {
        return await this.nfeWizardService.NFE_DistribuicaoDFePorUltNSU(data);
    }
    async NFE_DistribuicaoDFePorNSU(data: DFePorNSU) {
        return await this.nfeWizardService.NFE_DistribuicaoDFePorNSU(data);
    }
    async NFE_DistribuicaoDFePorChave(data: DFePorChaveNFe) {
        return await this.nfeWizardService.NFE_DistribuicaoDFePorChave(data);
    }

    /**
     * Autorização
     */
    async NFE_Autorizacao(data: NFe) {
        return await this.nfeWizardService.NFE_Autorizacao(data);
    }
    async NFCE_Autorizacao(data: NFe) {
        return await this.nfeWizardService.NFCE_Autorizacao(data);
    }

    /**
     * Inutilização
     */
    async NFE_Inutilizacao(data: InutilizacaoData) {
        return await this.nfeWizardService.NFE_Inutilizacao(data);
    }


    /**
     * DANFE
     */
    async NFE_GerarDanfe(data: NFEGerarDanfeProps) {
        return await this.nfeWizardService.NFE_GerarDanfe(data);
    }
    async NFCE_GerarDanfe(data: NFEGerarDanfeProps) {
        return await this.nfeWizardService.NFCE_GerarDanfe(data);
    }

    /**
     * Método para envio de e-mail
     * @param {EmailParams} mailParams - Mensagem de texto (aceita html)
     */
    NFE_EnviaEmail(mailParams: EmailParams) {
        return this.nfeWizardService.NFE_EnviaEmail(mailParams);
    }
}