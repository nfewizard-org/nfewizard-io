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
import { AxiosInstance, AxiosResponse } from 'axios';
import DistribuicaoHandler from './util/DistribuicaoHandler.js';
import Environment from '@Modules/environment/Environment.js';
import Utility from '@Utils/Utility.js';
import XmlBuilder from '@Adapters/XmlBuilder.js';
import { ConsultaNFe, GenericObject } from '@Types';
import BaseNFE from '@Modules/dfe/base/BaseNFe.js';
import { GerarConsultaImpl, SaveFilesImpl } from '@Interfaces';
import { logger } from '@Core/exceptions/logger.js';
import { Agent } from 'http';

class NFEDistribuicaoDFeService extends BaseNFE {
    constructor(environment: Environment, utility: Utility, xmlBuilder: XmlBuilder, axios: AxiosInstance, saveFiles: SaveFilesImpl, gerarConsulta: GerarConsultaImpl) {
        super(environment, utility, xmlBuilder, 'NFeDistribuicaoDFe', axios, saveFiles, gerarConsulta);
    }

    protected gerarXml(data: ConsultaNFe): string {
        return this.gerarXmlNFeDistribuicaoDFe(data);
    }


    gerarXmlNFeDistribuicaoDFe(data: ConsultaNFe) {
        logger.info('Montando estrutuda do XML em JSON', {
            context: 'NFEDistribuicaoDFeService',
        });
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

        return this.xmlBuilder.gerarXml(xmlObject, 'distDFeInt', this.metodo)
    }

    protected async callWebService(xmlConsulta: string, webServiceUrl: string, ContentType: string, action: string, agent: Agent): Promise<AxiosResponse<any, any>> {
        const startTime = Date.now();

        const headers = {
            'Content-Type': ContentType,
        };

        logger.http('Iniciando comunicação com o webservice', {
            context: `NFEDistribuicaoDFeService`,
            method: this.metodo,
            url: webServiceUrl,
            action,
            headers,
        });

        const response = await this.axios.post(webServiceUrl, xmlConsulta, {
            headers,
            httpsAgent: agent
        });

        const duration = Date.now() - startTime;

        logger.http('Comunicação concluída com sucesso', {
            context: `NFEDistribuicaoDFeService`,
            method: this.metodo,
            duration: `${duration}ms`,
            responseSize: response.data ? JSON.stringify(response.data).length : 0
        });

        return response;
    }

    async Exec(data: ConsultaNFe) {
        let xmlConsulta: string = '';
        let xmlConsultaSoap: string = '';
        let webServiceUrlTmp: string = '';
        let responseInJson: GenericObject | undefined = undefined;
        let xmlRetorno: AxiosResponse<any, any> = {} as AxiosResponse<any, any>;
        const ContentType = this.setContentType();
        try {
            // Gerando XML para consulta de Status do Serviço
            xmlConsulta = this.gerarXmlNFeDistribuicaoDFe(data);


            const { xmlFormated, agent, webServiceUrl, action } = await this.gerarConsulta.gerarConsulta(xmlConsulta, this.metodo, true, '1.01', 'NFe', true, 'nfeDistDFeInteresse');

            xmlConsultaSoap = xmlFormated;
            webServiceUrlTmp = webServiceUrl;

            const xmlRetorno = await this.callWebService(xmlFormated, webServiceUrl, ContentType, action, agent);

            // Verifica se houve rejeição
            responseInJson = this.utility.verificaRejeicao(xmlRetorno.data, this.metodo);

            if (responseInJson.retDistDFeInt.cStat === '137') {
                return {
                    data: {} as GenericObject,
                    xMotivo: responseInJson.retDistDFeInt.xMotivo,
                    filesList: [],
                }
            }
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
        } finally {
            // Salva XML de Consulta
            this.utility.salvaConsulta(xmlConsulta, xmlConsultaSoap, this.metodo);

            // Salva XML de Retorno
            this.utility.salvaRetorno(xmlRetorno.data, responseInJson, this.metodo);
        }
    }

}

export default NFEDistribuicaoDFeService;