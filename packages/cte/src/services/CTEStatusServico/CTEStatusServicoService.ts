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
import { getCodIBGE, Environment, XmlBuilder, Utility, logger } from '@nfewizard/shared';
import { AxiosInstance } from 'axios';
import { SaveFilesImpl, GerarConsultaImpl, CTEStatusServicoServiceImpl } from '@nfewizard/types/shared';
import { CTEBaseService, CTE_VERSAO } from '../util/CTEBaseService.js';

const METHOD_NAME = 'CTeStatusServico';

export class CTEStatusServicoService extends CTEBaseService implements CTEStatusServicoServiceImpl {
    constructor(environment: Environment, utility: Utility, xmlBuilder: XmlBuilder, axios: AxiosInstance, saveFiles: SaveFilesImpl, gerarConsulta: GerarConsultaImpl) {
        super(environment, utility, xmlBuilder, METHOD_NAME, axios, saveFiles, gerarConsulta);
    }

    protected gerarXml(): string {
        logger.info('Montando estrutura do XML em JSON', {
            context: 'CTEStatusServicoService',
        });
        const { dfe: { UF } } = this.environment.getConfig();

        const xmlObject = {
            $: {
                versao: CTE_VERSAO,
                xmlns: 'http://www.portalfiscal.inf.br/cte'
            },
            tpAmb: this.getTpAmb(),
            cUF: getCodIBGE(UF),
            xServ: 'STATUS',
        }

        return this.xmlBuilder.gerarXml(xmlObject, 'consStatServCTe', this.metodo)
    }

    private getTpAmb(): number {
        return this.environment.getConfig().nfe.ambiente;
    }
}

export default CTEStatusServicoService;
