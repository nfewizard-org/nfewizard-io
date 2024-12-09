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
import { getCodIBGE } from '@Utils/getCodIBGE.js';
import Environment from '@Modules/environment/Environment.js';
import XmlBuilder from '@Adapters/XmlBuilder.js';
import Utility from '@Utils/Utility.js';
import BaseNFE from '@Modules/dfe/base/BaseNFe.js';
import { AxiosInstance } from 'axios';
import { SaveFilesImpl, GerarConsultaImpl, NFEStatusServicoServiceImpl } from '@Interfaces';

class NFEStatusServicoService extends BaseNFE implements NFEStatusServicoServiceImpl {
    constructor(environment: Environment, utility: Utility, xmlBuilder: XmlBuilder, axios: AxiosInstance, saveFiles: SaveFilesImpl, gerarConsulta: GerarConsultaImpl) {
        super(environment, utility, xmlBuilder, 'NFEStatusServico', axios, saveFiles, gerarConsulta);
    }

    protected gerarXml(): string {
        try {
            const { nfe: { ambiente, versaoDF }, dfe: { UF } } = this.environment.getConfig();

            const xmlObject = {
                $: {
                    versao: versaoDF,
                    xmlns: 'http://www.portalfiscal.inf.br/nfe'
                },
                tpAmb: ambiente,
                cUF: getCodIBGE(UF),
                xServ: 'STATUS',
            }

            return this.xmlBuilder.gerarXml(xmlObject, 'consStatServ')
        } catch (error: any) {
            throw new Error(error.message)
        }
    }
}

export default NFEStatusServicoService;