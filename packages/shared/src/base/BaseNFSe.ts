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

type NFSeErroDetalhado = {
    codigo?: string;
    descricao?: string;
    complemento?: string;
    statusHttp?: number;
    raw?: any;
};

type NFSeError = Error & {
    nfseErrorDetail?: NFSeErroDetalhado;
};

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
     * Texto que será salvo como XML de consulta.
     * Subclasses podem sobrescrever para persistir o artefato realmente enviado.
     */
    protected getXmlConsulta(requestData?: any): string {
        return requestData ? JSON.stringify(requestData, null, 2) : '';
    }

    protected getCodigoRetornoParaLog(responseData: any): string | number | undefined {
        if (!responseData || typeof responseData !== 'object') {
            return undefined;
        }

        if (responseData.cStat !== undefined) {
            return responseData.cStat;
        }

        if (responseData.codigoRetorno !== undefined) {
            return responseData.codigoRetorno;
        }

        const erros = responseData.erros || responseData.Erros;
        if (Array.isArray(erros) && erros.length > 0) {
            return erros[0]?.Codigo || erros[0]?.codigo;
        }

        return responseData.Codigo || responseData.codigo;
    }

    protected getMensagemRetornoParaLog(responseData: any): string | undefined {
        if (!responseData || typeof responseData !== 'object') {
            return undefined;
        }

        if (responseData.mensagemRetorno) {
            return responseData.mensagemRetorno;
        }

        if (responseData.xMotivo) {
            return responseData.xMotivo;
        }

        if (responseData.message) {
            return responseData.message;
        }

        if (responseData.Descricao) {
            return responseData.Descricao;
        }

        if (responseData.descricao) {
            return responseData.descricao;
        }

        const erros = responseData.erros || responseData.Erros;
        if (Array.isArray(erros) && erros.length > 0) {
            return erros[0]?.Descricao || erros[0]?.descricao;
        }

        const alertas = responseData.alertas || responseData.Alertas;
        if (Array.isArray(alertas) && alertas.length > 0) {
            return alertas[0]?.Descricao || alertas[0]?.descricao || alertas[0]?.message;
        }

        if (responseData.chaveAcesso) {
            return 'Autorizado';
        }

        return undefined;
    }

    protected getComplementoRetornoParaLog(responseData: any): string | undefined {
        if (!responseData || typeof responseData !== 'object') {
            return undefined;
        }

        if (responseData.complementoRetorno) {
            return responseData.complementoRetorno;
        }

        if (responseData.complemento) {
            return responseData.complemento;
        }

        if (responseData.Complemento) {
            return responseData.Complemento;
        }

        const erros = responseData.erros || responseData.Erros;
        if (Array.isArray(erros) && erros.length > 0) {
            return erros[0]?.complemento || erros[0]?.Complemento;
        }

        const alertas = responseData.alertas || responseData.Alertas;
        if (Array.isArray(alertas) && alertas.length > 0) {
            return alertas[0]?.complemento || alertas[0]?.Complemento;
        }

        return undefined;
    }

    protected getPrimeiroErroRetorno(responseData: any): any | undefined {
        if (!responseData || typeof responseData !== 'object') {
            return undefined;
        }

        const erros = responseData.erros || responseData.Erros;
        if (Array.isArray(erros) && erros.length > 0) {
            return erros[0];
        }

        const alertas = responseData.alertas || responseData.Alertas;
        if (Array.isArray(alertas) && alertas.length > 0) {
            return alertas[0];
        }

        if (
            responseData.codigo !== undefined ||
            responseData.Codigo !== undefined ||
            responseData.descricao !== undefined ||
            responseData.Descricao !== undefined
        ) {
            return responseData;
        }

        return undefined;
    }

    protected extrairErroDetalhado(responseData: any, statusHttp?: number): NFSeErroDetalhado | undefined {
        const primeiroErro = this.getPrimeiroErroRetorno(responseData);
        if (!primeiroErro) {
            return undefined;
        }

        const codigo = primeiroErro.codigo || primeiroErro.Codigo;
        const descricao =
            primeiroErro.descricao ||
            primeiroErro.Descricao ||
            primeiroErro.mensagem ||
            primeiroErro.message;
        const complemento = primeiroErro.complemento || primeiroErro.Complemento;

        return {
            codigo,
            descricao,
            complemento,
            statusHttp,
            raw: primeiroErro,
        };
    }

    protected createNFSeError(message: string, detail?: NFSeErroDetalhado): NFSeError {
        const error = new Error(message) as NFSeError;
        if (detail) {
            error.nfseErrorDetail = detail;
        }
        return error;
    }

    protected normalizarRetornoParaLog(responseData: any, httpStatus?: number): any {
        if (!responseData || typeof responseData !== 'object') {
            return responseData;
        }

        const retornoNormalizado = { ...responseData };
        const erros = retornoNormalizado.erros || retornoNormalizado.Erros;
        const possuiErros = Array.isArray(erros) && erros.length > 0;
        const codigoRetorno = this.getCodigoRetornoParaLog(retornoNormalizado);
        const mensagemRetorno = this.getMensagemRetornoParaLog(retornoNormalizado);
        const complementoRetorno = this.getComplementoRetornoParaLog(retornoNormalizado);

        if (httpStatus !== undefined) {
            retornoNormalizado.statusHttp = httpStatus;
        }

        if (retornoNormalizado.sucesso === undefined) {
            retornoNormalizado.sucesso = !possuiErros && (httpStatus === undefined || httpStatus < 400);
        }

        if (codigoRetorno !== undefined && retornoNormalizado.codigoRetorno === undefined) {
            retornoNormalizado.codigoRetorno = codigoRetorno;
        }

        if (mensagemRetorno && retornoNormalizado.mensagemRetorno === undefined) {
            retornoNormalizado.mensagemRetorno = mensagemRetorno;
        }

        if (complementoRetorno && retornoNormalizado.complementoRetorno === undefined) {
            retornoNormalizado.complementoRetorno = complementoRetorno;
        }

        return retornoNormalizado;
    }

    protected getXmlRetornoParaSalvar(errorResponse: any, response: AxiosResponse<any, any>): AxiosResponse<any, any> {
        const xmlRetornoParaSalvar = errorResponse || response;

        if (xmlRetornoParaSalvar && xmlRetornoParaSalvar.data) {
            return {
                ...xmlRetornoParaSalvar,
                data: this.normalizarRetornoParaLog(
                    xmlRetornoParaSalvar.data,
                    xmlRetornoParaSalvar.status || response?.status,
                ),
            } as AxiosResponse<any, any>;
        }

        return {
            ...(response || {}),
            data: this.normalizarRetornoParaLog({
                sucesso: false,
                metodo: this.metodo,
                mensagem: errorResponse?.message || 'Resposta vazia do webservice NFSe',
                dataHora: new Date().toISOString(),
            }, response?.status),
        } as AxiosResponse<any, any>;
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
                const detalheErroRetorno = this.extrairErroDetalhado(responseInJson, response?.status);
                if (detalheErroRetorno) {
                    const mensagemErro = detalheErroRetorno.codigo
                        ? `${detalheErroRetorno.codigo}: ${detalheErroRetorno.descricao || 'Erro desconhecido'}`
                        : detalheErroRetorno.descricao || 'Erro desconhecido';
                    throw this.createNFSeError(mensagemErro, detalheErroRetorno);
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
                    } else {
                        const detalheErro = this.extrairErroDetalhado(error.response.data, error.response.status);
                        if (detalheErro) {
                            errorMessage = detalheErro.codigo
                                ? `${detalheErro.codigo}: ${detalheErro.descricao || 'Erro desconhecido'}`
                                : detalheErro.descricao || 'Erro desconhecido';
                            error.nfseErrorDetail = detalheErro;
                        }

                        if (!detalheErro && error.response.data.message) {
                            errorMessage = error.response.data.message;
                        } else if (!detalheErro && error.response.data.descricao) {
                            errorMessage = error.response.data.descricao;
                        } else if (!detalheErro && error.response.data.Descricao) {
                            errorMessage = error.response.data.Descricao;
                        } else if (!detalheErro) {
                            errorMessage = `HTTP ${error.response.status}: ${JSON.stringify(error.response.data)}`;
                        }
                    }
                } else {
                    errorMessage = `HTTP ${error.response.status}: ${error.response.statusText}`;
                }
            }

            logger.error(``, error, {
                context: `BaseNFSe][${this.metodo}`
            });

            if (error?.nfseErrorDetail) {
                throw error;
            }

            throw this.createNFSeError(errorMessage, {
                statusHttp: error?.response?.status,
                raw: error?.response?.data,
            });
        } finally {
            // Salva arquivos (se configurado)
            const xmlConsulta = this.getXmlConsulta(requestData);
            const xmlRetornoParaSalvar = this.getXmlRetornoParaSalvar(errorResponse, response);
            this.saveFiles.salvaArquivos(
                xmlConsulta,
                responseInJson,
                xmlRetornoParaSalvar,
                this.metodo,
                '' // xmlConsultaSoap vazio para REST
            );
        }
    }
}

export { BaseNFSe };
