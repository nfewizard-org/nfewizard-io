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
import Environment from '@Classes/Environment';
import XmlBuilder from '@Classes/XmlBuilder.js';
import Utility from 'src/old/utils/Utility.js';
import { Json } from '../../../../utils/xml2json.js';
import { AxiosInstance, AxiosResponse } from 'axios';
import { GenericObject } from 'src/old/protocols/index.js';
import { format } from 'date-fns';

abstract class BaseNFE {
    environment: Environment;
    utility: Utility;
    metodo: string;
    xmlBuilder: XmlBuilder;
    chaveNfe: string
    axios: AxiosInstance;

    constructor(environment: Environment, utility: Utility, xmlBuilder: XmlBuilder, metodo: string, axios: AxiosInstance) {
        this.environment = environment;
        this.utility = utility;
        this.xmlBuilder = xmlBuilder;
        this.metodo = metodo;
        this.axios = axios;
        this.chaveNfe = "";
    }

    /**
     * Método abstrato que cada classe derivada deve implementar para gerar o XML necessário para a requisição específica do serviço NFE.
     * 
     * @param {any} [data] - Dados opcionais usados para gerar o XML em algumas subclasses.
     * @returns {string} O XML gerado para a requisição.
     */
    protected abstract gerarXml(data?: any): string;

    /**
     * Trata o retorno da requisição ao webservice, processando o XML e convertendo para JSON.
     * Pode ou não ser sobrescrito por classes derivadas para tratamento específico de retorno
     * 
     * @param {string} xmlConsulta - O XML de consulta enviado ao webservice (gerado no método gerarXml).
     * @param {any} responseInJson - O XML de retorno recebido do webservice e convertido em JSON.
     * @param {any} xmlRetorno - O XML de retorno recebido do webservice.
     */
    protected salvaArquivos(xmlConsulta: string, responseInJson: GenericObject, xmlRetorno: AxiosResponse<any, any>, options?: Record<string, any>): void {
        // Recupera configuração do ambiente para verificar se os arquivos gerados serão gravados em disco
        const config = this.environment.getConfig();
        let dateAndTimeInFileName = config.dfe.incluirTimestampNoNomeDosArquivos;

        const createFileName = (prefix: string | undefined) => {
            const dtaTime = dateAndTimeInFileName ? `-${format(new Date(), 'dd-MM-yyyy-HHmm')}` : '';

            const baseFileName = `${this.metodo}`;
            const prefixPart = prefix ? `-${prefix}` : '';
            const nfePart = responseInJson.chNFe ? `-${responseInJson.chNFe}` : '';
            const dateTimePart = dtaTime;

            return `${baseFileName}${prefixPart}${nfePart}${dateTimePart}`;
        }

        const salvarArquivo = (data: any, prefix: string | undefined, path: string | undefined, fileType: 'xml' | 'json') => {
            const fileName = createFileName(prefix);
            const method = fileType === 'xml' ? 'salvaXML' : 'salvaJSON';

            this.utility[method]({
                data: data,
                fileName,
                metodo: this.metodo,
                path,
            });
        };

        if (config.dfe.armazenarXMLConsulta) {
            salvarArquivo(xmlConsulta, 'consulta', config.dfe.pathXMLConsulta, 'xml');
        }
        if (config.dfe.armazenarXMLRetorno) {
            salvarArquivo(xmlRetorno.data, 'retorno', config.dfe.pathXMLRetorno, 'xml');
        }
        if (config.dfe.armazenarRetornoEmJSON) {
            salvarArquivo(responseInJson, undefined, config.dfe.pathRetornoEmJSON, 'json');
        }
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
            const { method } = this.utility.getSoapInfo(config.dfe.UF, this.metodo);

            // Criando envelop SOAP (estrutura para e envio do XML)
            const xmlFormated = this.xmlBuilder.buildSoapEnvelope(xmlConsulta, method);

            // Retorna o Http.Agent contendo os certificados das Autoridades Certificadoras
            const agent = this.environment.getHttpAgent();

            // Retorna a url do webservice NFEStatusServico
            const webServiceUrl = this.utility.getWebServiceUrl(this.metodo);

            return {
                xmlFormated,
                agent,
                webServiceUrl
            }

        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    /**
     * Executa a requisição ao webservice SEFAZ, gerando o XML, validando o esquema, criando o envelope SOAP,
     * enviando a requisição e processando a resposta.
     * 
     * @param {any} [data] - Dados opcionais usados para gerar o XML em algumas subclasses.
     * @returns {Promise<any>} A resposta do webservice em JSON.
     * @throws {Error} Lança um erro se houver uma rejeição ou se ocorrer qualquer outro erro durante a execução.
     */
    async Exec(data?: any): Promise<any> {
        try {
            // Gerando XML específico
            const xmlConsulta = this.gerarXml(data);

            const { xmlFormated, agent, webServiceUrl } = await this.gerarConsulta(xmlConsulta);

            // Salva XML de Consulta
            this.utility.salvaConsulta(xmlConsulta, xmlFormated, this.metodo);

            // Efetua requisição para o webservice NFEStatusServico
            const xmlRetorno = await this.axios.post(webServiceUrl, xmlFormated, {
                headers: {
                    'Content-Type': 'text/xml; charset=utf-8',
                },
                httpsAgent: agent
            });

            // Instanciando classe de utilitários com lib xml-js e convertendo XML para Json
            const json = new Json();
            const responseInJson = json.convertXmlToJson(xmlRetorno.data, this.metodo);

            // Salva XML de Retorno
            this.utility.salvaRetorno(xmlRetorno.data, responseInJson, this.metodo);

            // Gera erro em caso de Rejeição
            if (responseInJson.xMotivo.includes('Rejeição')) {
                throw new Error(responseInJson.xMotivo)
            }

            this.salvaArquivos(xmlConsulta, responseInJson, xmlRetorno);

            return responseInJson;
        } catch (error: any) {
            throw new Error(error.message)
        }
    }
}

export default BaseNFE;