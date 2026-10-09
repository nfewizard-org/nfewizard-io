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
import { Environment, XmlBuilder, Utility, logger } from '@nfewizard/shared';
import { AxiosInstance } from 'axios';
import { SaveFilesImpl, GerarConsultaImpl, CTEConsultaProtocoloServiceImpl } from '@nfewizard/types/shared';
import { CTEBaseService, CTE_VERSAO } from '../util/CTEBaseService.js';
import { chaveEmSvc } from '../util/CTeContingencia.js';

const METHOD_NAME = 'CTeConsultaProtocolo';

export class CTEConsultaProtocoloService extends CTEBaseService implements CTEConsultaProtocoloServiceImpl {
    constructor(environment: Environment, utility: Utility, xmlBuilder: XmlBuilder, axios: AxiosInstance, saveFiles: SaveFilesImpl, gerarConsulta: GerarConsultaImpl) {
        super(environment, utility, xmlBuilder, METHOD_NAME, axios, saveFiles, gerarConsulta);
    }

    /** CT-e autorizado em SVC (tpEmis 7/8) só é consultado no ambiente da SVC. */
    protected getModelo(chCTe?: string): string {
        return chCTe && chaveEmSvc(chCTe) ? 'CTeSVC' : 'CTe';
    }

    protected gerarXml(chCTe: string): string {
        logger.info('Montando estrutura do XML em JSON', {
            context: 'CTEConsultaProtocoloService',
        });

        if (!chCTe || chCTe.length !== 44) {
            throw new Error('Chave de acesso do CT-e inválida: deve conter 44 dígitos.');
        }

        const { nfe: { ambiente } } = this.environment.getConfig();

        const xmlObject = {
            $: {
                versao: CTE_VERSAO,
                xmlns: 'http://www.portalfiscal.inf.br/cte'
            },
            tpAmb: ambiente,
            xServ: 'CONSULTAR',
            chCTe,
        }

        return this.xmlBuilder.gerarXml(xmlObject, 'consSitCTe', this.metodo);
    }
}

export default CTEConsultaProtocoloService;
