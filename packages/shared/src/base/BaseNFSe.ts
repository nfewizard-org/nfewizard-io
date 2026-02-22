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
import { Environment } from '../environment/Environment.js';
import { XmlBuilder} from '../adapters/XmlBuilder.js';
import { Utility } from '../utils/Utility.js';
import { AxiosInstance, AxiosResponse } from 'axios';
import { SaveFilesImpl, GerarConsultaImpl } from '@nfewizard/types/shared';
import { GenericObject } from '@nfewizard/types/shared';
import { logger } from '../exceptions/logger.js';

abstract class BaseNFSe {
    environment: Environment;
    utility: Utility;
    metodo: string;
    xmlBuilder: XmlBuilder;
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
    }

    /**
     * Método de preparação dos dados - Deve ser implementado pelas subclasses
     */
    protected prepararDados(_data?: any): any {
        throw new Error("O método 'prepararDados' não foi implementado na subclasse.");
    }

    /**
     * Método para obter a URL base do webservice
     */
    protected getWebServiceUrl(): string {
        return this.utility.getWebServiceUrlNFSe(this.metodo);
    }

    /**
     * Método para obter o método HTTP (GET, POST, etc)
     */
    protected getHttpMethod(): 'GET' | 'POST' | 'PUT' | 'DELETE' {
        return 'POST'; // Padrão para NFSe
    }

    /**
     * Método para obter o path adicional da URL (ex: /nfse/{chaveAcesso})
     */
    protected getUrlPath(_data?: any): string {
        return '';
    }

    /**
     * Método para obter query parameters
     */
    protected getQueryParams(_data?: any): Record<string, any> {
        return {};
    }

    /**
     * Executa a requisição ao webservice NFSe (REST API)
     * @param {any} [data] - Dados opcionais usados para preparar a requisição.
     * @returns {Promise<any>} A resposta do webservice em JSON.
     */
    async Exec(data?: any): Promise<any> {
        let requestData: any = null;
        let webServiceUrl: string = '';
        let responseInJson: GenericObject | undefined = undefined;
        let response: AxiosResponse<any, any> = {} as AxiosResponse<any, any>;
        let errorResponse: any = null;

        try {
            // Prepara dados específicos
            requestData = this.prepararDados(data);

            // Obtém URL base
            const baseUrl = this.getWebServiceUrl();
            const path = this.getUrlPath(data);
            const queryParams = this.getQueryParams(data);

            // Monta URL completa
            webServiceUrl = baseUrl + path;
            if (Object.keys(queryParams).length > 0) {
                const queryString = new URLSearchParams(queryParams).toString();
                webServiceUrl += `?${queryString}`;
            }

            const httpMethod = this.getHttpMethod();

            logger.http('Iniciando comunicação com o webservice NFSe', {
                context: `BaseNFSe`,
                method: this.metodo,
                httpMethod,
                url: webServiceUrl,
            });

            // Executa requisição REST
            // Obtém o agent HTTPS do environment para garantir autenticação mútua TLS
            const agent = this.environment.getHttpAgent();

            const requestConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                // Garante que o httpsAgent seja usado explicitamente para autenticação mútua TLS
                httpsAgent: agent
            };

            if (httpMethod === 'GET') {
                response = await this.axios.get(webServiceUrl, requestConfig);
            } else if (httpMethod === 'POST') {
                response = await this.axios.post(webServiceUrl, requestData, requestConfig);
            } else if (httpMethod === 'PUT') {
                response = await this.axios.put(webServiceUrl, requestData, requestConfig);
            } else if (httpMethod === 'DELETE') {
                response = await this.axios.delete(webServiceUrl, requestConfig);
            }

            logger.http('Comunicação concluída com sucesso', {
                context: `BaseNFSe`,
                method: this.metodo,
                responseSize: response.data ? JSON.stringify(response.data).length : 0
            });

            // NFSe retorna JSON diretamente
            responseInJson = response.data;

            // Verifica se há erros na resposta
            if (responseInJson) {
                if (responseInJson.erros && Array.isArray(responseInJson.erros) && responseInJson.erros.length > 0) {
                    const primeiroErro = responseInJson.erros[0];
                    const mensagemErro = primeiroErro.descricao || primeiroErro.Descricao || 'Erro desconhecido';
                    throw new Error(mensagemErro);
                }

                if (responseInJson.Erros && Array.isArray(responseInJson.Erros) && responseInJson.Erros.length > 0) {
                    const primeiroErro = responseInJson.Erros[0];
                    const mensagemErro = primeiroErro.Descricao || primeiroErro.descricao || 'Erro desconhecido';
                    throw new Error(mensagemErro);
                }
            }

            return responseInJson || {};
        } catch (error: any) {
            // Armazena a resposta de erro para uso no finally
            errorResponse = error.response;

            // Tenta extrair mais informações do erro
            let errorMessage = error.message || 'Erro desconhecido';

            if (error.response) {
                // Erro de resposta HTTP
                // Tenta extrair mensagem do body da resposta
                if (error.response.data) {
                    if (typeof error.response.data === 'string') {
                        errorMessage = `HTTP ${error.response.status}: ${error.response.data}`;
                    } else if (error.response.data.erros && Array.isArray(error.response.data.erros) && error.response.data.erros.length > 0) {
                        // NFSe retorna erros em um array
                        const primeiroErro = error.response.data.erros[0];
                        const codigo = primeiroErro.codigo || primeiroErro.Codigo || '';
                        const descricao = primeiroErro.descricao || primeiroErro.Descricao || 'Erro desconhecido';
                        errorMessage = codigo ? `${codigo}: ${descricao}` : descricao;
                    } else if (error.response.data.Erros && Array.isArray(error.response.data.Erros) && error.response.data.Erros.length > 0) {
                        // Variação com E maiúsculo
                        const primeiroErro = error.response.data.Erros[0];
                        const codigo = primeiroErro.Codigo || primeiroErro.codigo || '';
                        const descricao = primeiroErro.Descricao || primeiroErro.descricao || 'Erro desconhecido';
                        errorMessage = codigo ? `${codigo}: ${descricao}` : descricao;
                    } else if (error.response.data.message) {
                        errorMessage = error.response.data.message;
                    } else if (error.response.data.descricao) {
                        errorMessage = error.response.data.descricao;
                    } else if (error.response.data.Descricao) {
                        errorMessage = error.response.data.Descricao;
                    } else {
                        errorMessage = `HTTP ${error.response.status}: ${JSON.stringify(error.response.data)}`;
                    }
                } else {
                    errorMessage = `HTTP ${error.response.status}: ${error.response.statusText}`;
                }
            }

            logger.error(``, error, {
                context: `BaseNFSe][${this.metodo}`
            });

            throw new Error(errorMessage);
        } finally {
            // Salva arquivos (se configurado)
            // Para REST, salva o JSON da requisição
            const xmlConsulta = requestData ? JSON.stringify(requestData, null, 2) : '';
            this.saveFiles.salvaArquivos(
                xmlConsulta,
                responseInJson,
                errorResponse || response,
                this.metodo,
                '' // xmlConsultaSoap vazio para REST
            );
        }
    }
}

export { BaseNFSe };
