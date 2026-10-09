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
import { AxiosResponse } from 'axios';
import { BaseNFE, logger } from '@nfewizard/shared';
import { GenericObject } from '@nfewizard/types/shared';

/** Versão vigente do leiaute/serviços do CT-e (MOC 4.00). */
export const CTE_VERSAO = '4.00';

/**
 * Base comum aos serviços de CT-e que usam o padrão síncrono simples do MOC
 * (Status Serviço, Consulta Protocolo, Recepção de Evento, Autorização):
 * mensagem "sem lote", corpo do SOAP embrulhado na tag `cteDadosMsg`
 * (diferente do padrão `nfeDadosMsg` usado pelo NF-e) e resolução de URL
 * por UF do emitente (ver `Utility.getWebServiceUrl`).
 *
 * A Distribuição DFe do CT-e (`CTEDistribuicaoDFeService`) não usa esta base
 * porque tem regras próprias de compactação/decompactação de lote.
 */
abstract class CTEBaseService extends BaseNFE {
    /**
     * Valor repassado como `mod` ao resolver a URL. `'CTe'` usa o autorizador normal da UF;
     * `'CTeSVC'` direciona à Sefaz Virtual de Contingência (ver `Utility.getWebServiceUrl`).
     */
    protected getModelo(_data?: any): string {
        return 'CTe';
    }

    async Exec(data?: any): Promise<any> {
        let xmlConsulta = '';
        let xmlConsultaSoap = '';
        let responseInJson: GenericObject | undefined = undefined;
        let xmlRetorno: AxiosResponse<any, any> = {} as AxiosResponse<any, any>;
        const ContentType = this.setContentType();

        try {
            xmlConsulta = this.gerarXml(data);

            const { xmlFormated, agent, webServiceUrl, action } = await this.gerarConsulta.gerarConsulta(
                xmlConsulta,
                this.metodo,
                false,
                CTE_VERSAO,
                this.getModelo(data),
                false,
                '',
                'cteDadosMsg'
            );

            xmlConsultaSoap = xmlFormated;

            xmlRetorno = await this.callWebService(xmlFormated, webServiceUrl, ContentType, action, agent);

            responseInJson = this.utility.verificaRejeicao(xmlRetorno.data, this.metodo);

            return responseInJson;
        } catch (error: any) {
            logger.error(``, error, { context: this.constructor.name, method: this.metodo });
            throw error;
        } finally {
            this.utility.salvaConsulta(xmlConsulta, xmlConsultaSoap, this.metodo);
            this.utility.salvaRetorno(xmlRetorno.data, responseInJson, this.metodo);
        }
    }
}

export { CTEBaseService };
