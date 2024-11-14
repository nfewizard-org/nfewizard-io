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
import Environment from '@Classes/Environment.js';
import Utility from '@Utils/Utility.js';
import XmlBuilder from '@Classes/XmlBuilder.js';
import { ConsultaNFe, GenericObject } from '@Protocols';
import BaseNFE from '../BaseNFe/BaseNFe.js';

class NFEDistribuicaoDFe extends BaseNFE {
    constructor(environment: Environment, utility: Utility, xmlBuilder: XmlBuilder, axios: AxiosInstance) {
        super(environment, utility, xmlBuilder, 'NFeDistribuicaoDFe', axios);
    }

    protected gerarXml(data: ConsultaNFe): string {
        return this.gerarXmlNFeDistribuicaoDFe(data);
    }

    /**
     * Método utilitário para criação do XML a partir de um Objeto
     */
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

    protected async gerarConsulta(xmlConsulta: string) {
        try {
            const config = this.environment.getConfig();
            // Valida Schema
            if (config.lib?.useForSchemaValidation !== 'validateSchemaJsBased') {
                await this.utility.validateSchemaJavaBased(xmlConsulta, this.metodo);
            } else {
                await this.utility.validateSchemaJsBased(xmlConsulta, this.metodo);
            }

            // Capturando a url do método para o namespace xmlns
            const { method, action } = this.utility.getSoapInfo(config.dfe.UF, this.metodo);

            // Criando envelop SOAP (estrutura para e envio do XML)
            const rootTagObj = {
                tag: "nfeDistDFeInteresse",
                namespace: method,
            };
            const xmlFormated = this.xmlBuilder.buildSoapEnvelope(xmlConsulta, method, 'soap12', rootTagObj);

            // Retorna o Http.Agent contendo os certificados das Autoridades Certificadoras
            const agent = this.environment.getHttpAgent();

            // Retorna a url do webservice NFEStatusServico
            const webServiceUrl = this.utility.getWebServiceUrl(this.metodo, true, '1.01');

            return {
                xmlFormated,
                agent,
                webServiceUrl,
                action
            }

        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    async Exec(data: ConsultaNFe) {
        try {
            // Gerando XML para consulta de Status do Serviço
            const xmlConsulta = this.gerarXmlNFeDistribuicaoDFe(data);

            const { xmlFormated, agent, webServiceUrl, action } = await this.gerarConsulta(xmlConsulta);

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
             * Descompactar XML
             * Converte XML para Json
             * Gera erro em caso de rejeição
             * Salva XML
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

export default NFEDistribuicaoDFe;