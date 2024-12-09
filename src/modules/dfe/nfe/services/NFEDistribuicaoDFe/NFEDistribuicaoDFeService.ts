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
import { AxiosInstance } from 'axios';
import DistribuicaoHandler from './util/DistribuicaoHandler.js';
import Environment from '@Modules/environment/Environment.js';
import Utility from '@Utils/Utility.js';
import XmlBuilder from '@Adapters/XmlBuilder.js';
import { ConsultaNFe } from '@Types';
import BaseNFE from '@Modules/dfe/base/BaseNFe.js';
import { GerarConsultaImpl, SaveFilesImpl } from '@Interfaces';

class NFEDistribuicaoDFeService extends BaseNFE {
    constructor(environment: Environment, utility: Utility, xmlBuilder: XmlBuilder, axios: AxiosInstance, saveFiles: SaveFilesImpl, gerarConsulta: GerarConsultaImpl) {
        super(environment, utility, xmlBuilder, 'NFeDistribuicaoDFe', axios, saveFiles, gerarConsulta);
    }

    protected gerarXml(data: ConsultaNFe): string {
        return this.gerarXmlNFeDistribuicaoDFe(data);
    }


    gerarXmlNFeDistribuicaoDFe(data: ConsultaNFe) {
        const { nfe: { ambiente } } = this.environment.getConfig();

        //  XML
        const xmlObject = {
            $: {
                versao: "1.01",
                xmlns: 'http://www.portalfiscal.inf.br/nfe'
            },
            tpAmb: ambiente,
            ...data,
        }

        return this.xmlBuilder.gerarXml(xmlObject, 'distDFeInt')
    }


    async Exec(data: ConsultaNFe) {
        try {
            // Gerando XML para consulta de Status do Serviço
            const xmlConsulta = this.gerarXmlNFeDistribuicaoDFe(data);


            const { xmlFormated, agent, webServiceUrl, action } = await this.gerarConsulta.gerarConsulta(xmlConsulta, this.metodo, true, '1.01', 'NFe', true, 'nfeDistDFeInteresse');

            // Salva XML de Consulta
            this.utility.salvaConsulta(xmlConsulta, xmlFormated, this.metodo);

            // Efetua requisição para o webservice NFEStatusServico
            const xmlRetorno = await this.axios.post(webServiceUrl, xmlFormated, {
                headers: {
                    'Content-Type': 'text/xml; charset=utf-8',
                    'SOAPAction': action,
                },
                httpsAgent: agent
            });

            // Verifica se houve rejeição
            const responseInJson = this.utility.verificaRejeicao(xmlRetorno.data, this.metodo);

            // Salva XML de Retorno
            this.utility.salvaRetorno(xmlRetorno.data, responseInJson, this.metodo);

            /**
             * Descompacta XML
             * Converte XML para Json
             * Salva XML
             * Gera erro em caso de rejeição
             */
            const handlerDistribuicao = new DistribuicaoHandler(this.environment, this.utility, this.metodo);
            const filesList = handlerDistribuicao.deCompressDFeXML(xmlRetorno.data, this.metodo, xmlConsulta);
            const xMotivo = this.utility.findInObj(responseInJson, 'xMotivo');

            return {
                data: responseInJson,
                xMotivo,
                filesList,
            }
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

}

export default NFEDistribuicaoDFeService;