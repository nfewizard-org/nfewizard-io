/*
 * This file is part of NFeWizard.
 * 
 * NFeWizard is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * NFeWizard is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with NFeWizard. If not, see <https://www.gnu.org/licenses/>.
 */
import { getCodIBGE } from '../../../../utils/getCodIBGE.js';
import Environment from '@Classes/Environment';
import XmlBuilder from '@Classes/XmlBuilder.js';
import Utility from '@Utils/Utility.js';
import { GenericObject } from '@Protocols/index.js';
import BaseNFE from '../BaseNFe/BaseNFe.js';
import { AxiosInstance, AxiosResponse } from 'axios';

class NFEStatusServico extends BaseNFE {
    constructor(environment: Environment, utility: Utility, xmlBuilder: XmlBuilder, axios: AxiosInstance) {
        super(environment, utility, xmlBuilder, 'NFEStatusServico', axios);
    }

    protected gerarXml(): string {
        return this.gerarXmlStatusServico();
    }

    protected salvaArquivos(xmlConsulta: string, responseInJson: GenericObject, xmlRetorno: AxiosResponse<any, any>, options?: Record<string, any>): void {}

    /**
     * Método utilitário para criação do XML a partir de um Objeto
     */
    gerarXmlStatusServico() {
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

export default NFEStatusServico;