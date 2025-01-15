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
import Environment from '@Modules/environment/Environment.js';
import XmlBuilder from '@Adapters/XmlBuilder.js';
import Utility from '../../../core/utils/Utility.js';
import XmlParser from '../../../core/utils/XmlParser.js';
import { AxiosInstance } from 'axios';
import { SaveFilesImpl, GerarConsultaImpl } from '@Interfaces';

abstract class BaseNFE {
    environment: Environment;
    utility: Utility;
    metodo: string;
    xmlBuilder: XmlBuilder;
    chaveNfe: string
    axios: AxiosInstance;
    saveFiles: SaveFilesImpl;
    gerarConsulta: GerarConsultaImpl;

    constructor(environment: Environment, utility: Utility, xmlBuilder: XmlBuilder, metodo: string, axios: AxiosInstance, saveFiles: SaveFilesImpl, gerarConsulta: GerarConsultaImpl) {
        this.environment = environment;
        this.utility = utility;
        this.xmlBuilder = xmlBuilder;
        this.metodo = metodo;
        this.axios = axios;
        this.saveFiles = saveFiles;
        this.gerarConsulta = gerarConsulta;
        this.chaveNfe = "";
    }

    /**
     * Método de geração do XML - Deve ser implementado pelas subclasses
     */
    protected gerarXml(data?: any): string {
        throw new Error("O método 'gerarXml' não foi implementado na subclasse.");
    }

    /**
     * Executa a requisição ao webservice SEFAZ
     * @param {any} [data] - Dados opcionais usados para gerar o XML em algumas subclasses.
     * @returns {Promise<any>} A resposta do webservice em JSON.
     */
    async Exec(data?: any): Promise<any> {
        try {
            // Gerando XML específico
            const xmlConsulta = this.gerarXml(data);

            const { xmlFormated, agent, webServiceUrl } = await this.gerarConsulta.gerarConsulta(xmlConsulta, this.metodo);

            // Salva XML de Consulta
            this.utility.salvaConsulta(xmlConsulta, xmlFormated, this.metodo);

            // Efetua requisição para o webservice NFEStatusServico
            const xmlRetorno = await this.axios.post(webServiceUrl, xmlFormated, {
                headers: {
                    'Content-Type': 'text/xml; charset=utf-8',
                },
                httpsAgent: agent
            });

            // Instanciando classe de utilitários com lib xml-js e convertendo XML para XmlParser
            const json = new XmlParser();
            const responseInJson = json.convertXmlToJson(xmlRetorno.data, this.metodo);

            // Salva XML de Retorno
            this.utility.salvaRetorno(xmlRetorno.data, responseInJson, this.metodo);

            // Gera erro em caso de Rejeição
            if (responseInJson.xMotivo.includes('Rejeição')) {
                throw new Error(responseInJson.xMotivo)
            }

            this.saveFiles.salvaArquivos(xmlConsulta, responseInJson, xmlRetorno, this.metodo);

            return responseInJson;
        } catch (error: any) {
            throw new Error(error.message)
        }
    }
}

export default BaseNFE;