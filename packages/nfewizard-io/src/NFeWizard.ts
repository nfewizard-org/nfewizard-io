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
} from '@nfewizard/types/nfe';
import { NFeWizardServiceImpl } from '@nfewizard/types/shared';
import { NFeWizardService } from './nfe/services/NFeWizard/NFeWizardService.js';

export class NFeWizard implements NFeWizardImpl {
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
     * @deprecated A partir da v1.0.0, use o pacote @nfewizard/cte diretamente
     * @example
     * import { CTEWizard } from '@nfewizard/cte';
     * const cteWizard = new CTEWizard();
     * await cteWizard.NFE_LoadEnvironment({ config });
     * await cteWizard.CTE_DistribuicaoDFe(data);
     */
    async CTE_DistribuicaoDFe(_data: any) {
        console.warn('⚠️  AVISO: CTE_DistribuicaoDFe foi movido para o pacote @nfewizard/cte');
        console.warn('📦 Instale: pnpm add @nfewizard/cte');
        console.warn('📖 Use: import { CTEWizard } from "@nfewizard/cte"');
        throw new Error('CTE_DistribuicaoDFe não está mais disponível no nfewizard-io v1.0.0+. Use @nfewizard/cte');
    }

    /**
     * @deprecated A partir da v1.0.0, use o pacote @nfewizard/cte diretamente
     * @example
     * import { CTEWizard } from '@nfewizard/cte';
     * const cteWizard = new CTEWizard();
     * await cteWizard.NFE_LoadEnvironment({ config });
     * await cteWizard.CTE_DistribuicaoDFePorUltNSU(data);
     */
    async CTE_DistribuicaoDFePorUltNSU(_data: any) {
        console.warn('⚠️  AVISO: CTE_DistribuicaoDFePorUltNSU foi movido para o pacote @nfewizard/cte');
        console.warn('📦 Instale: pnpm add @nfewizard/cte');
        console.warn('📖 Use: import { CTEWizard } from "@nfewizard/cte"');
        throw new Error('CTE_DistribuicaoDFePorUltNSU não está mais disponível no nfewizard-io v1.0.0+. Use @nfewizard/cte');
    }

    /**
     * @deprecated A partir da v1.0.0, use o pacote @nfewizard/cte diretamente
     * @example
     * import { CTEWizard } from '@nfewizard/cte';
     * const cteWizard = new CTEWizard();
     * await cteWizard.NFE_LoadEnvironment({ config });
     * await cteWizard.CTE_DistribuicaoDFePorNSU(data);
     */
    async CTE_DistribuicaoDFePorNSU(_data: any) {
        console.warn('⚠️  AVISO: CTE_DistribuicaoDFePorNSU foi movido para o pacote @nfewizard/cte');
        console.warn('📦 Instale: pnpm add @nfewizard/cte');
        console.warn('📖 Use: import { CTEWizard } from "@nfewizard/cte"');
        throw new Error('CTE_DistribuicaoDFePorNSU não está mais disponível no nfewizard-io v1.0.0+. Use @nfewizard/cte');
    }

    /**
     * Autorização NFe
     */
    async NFE_Autorizacao(data: NFe) {
        return await this.nfeWizardService.NFE_Autorizacao(data);
    }

    /**
     * @deprecated A partir da v1.0.0, use o pacote @nfewizard/nfce diretamente
     * @example
     * import { NFCEWizard } from '@nfewizard/nfce';
     * const nfceWizard = new NFCEWizard();
     * await nfceWizard.NFE_LoadEnvironment({ config });
     * await nfceWizard.NFCE_Autorizacao(data);
     */
    async NFCE_Autorizacao(_data: any) {
        console.warn('⚠️  AVISO: NFCE_Autorizacao foi movido para o pacote @nfewizard/nfce');
        console.warn('📦 Instale: pnpm add @nfewizard/nfce');
        console.warn('📖 Use: import { NFCEWizard } from "@nfewizard/nfce"');
        throw new Error('NFCE_Autorizacao não está mais disponível no nfewizard-io v1.0.0+. Use @nfewizard/nfce');
    }

    /**
     * Inutilização
     */
    async NFE_Inutilizacao(data: InutilizacaoData) {
        return await this.nfeWizardService.NFE_Inutilizacao(data);
    }


    /**
     * @deprecated A partir da v1.0.0, use o pacote @nfewizard/danfe diretamente
     * @example
     * import { NFEGerarDanfe } from '@nfewizard/danfe';
     * const danfe = new NFEGerarDanfe(data);
     * await danfe.generatePDF();
     */
    async NFE_GerarDanfe(_data: any) {
        console.warn('⚠️  AVISO: NFE_GerarDanfe foi movido para o pacote @nfewizard/danfe');
        console.warn('📦 Instale: pnpm add @nfewizard/danfe');
        console.warn('📖 Use: import { NFEGerarDanfe } from "@nfewizard/danfe"');
        throw new Error('NFE_GerarDanfe não está mais disponível no nfewizard-io v1.0.0+. Use @nfewizard/danfe');
    }

    /**
     * @deprecated A partir da v1.0.0, use o pacote @nfewizard/danfe diretamente
     * @example
     * import { NFCEGerarDanfe } from '@nfewizard/danfe';
     * const danfe = new NFCEGerarDanfe(data);
     * await danfe.generatePDF();
     */
    async NFCE_GerarDanfe(_data: any) {
        console.warn('⚠️  AVISO: NFCE_GerarDanfe foi movido para o pacote @nfewizard/danfe');
        console.warn('📦 Instale: pnpm add @nfewizard/danfe');
        console.warn('📖 Use: import { NFCEGerarDanfe } from "@nfewizard/danfe"');
        throw new Error('NFCE_GerarDanfe não está mais disponível no nfewizard-io v1.0.0+. Use @nfewizard/danfe');
    }

    /**
     * Método para envio de e-mail
     * @param {EmailParams} mailParams - Mensagem de texto (aceita html)
     */
    NFE_EnviaEmail(mailParams: EmailParams) {
        return this.nfeWizardService.NFE_EnviaEmail(mailParams);
    }
}