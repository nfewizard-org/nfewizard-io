import { Environment } from '../environment/Environment.js';
import { XmlBuilder } from '../adapters/XmlBuilder.js';
import { Utility } from '../utils/Utility.js';
import { AxiosInstance, AxiosResponse } from 'axios';
import { SaveFilesImpl, GerarConsultaImpl } from '@nfewizard/types/shared';
import { Agent } from 'http';
declare abstract class BaseNFE {
    environment: Environment;
    utility: Utility;
    metodo: string;
    xmlBuilder: XmlBuilder;
    chaveNfe: string;
    axios: AxiosInstance;
    saveFiles: SaveFilesImpl;
    gerarConsulta: GerarConsultaImpl;
    modelo?: string;
    constructor(environment: Environment, utility: Utility, xmlBuilder: XmlBuilder, metodo: string, axios: AxiosInstance, saveFiles: SaveFilesImpl, gerarConsulta: GerarConsultaImpl);
    /**
     * Método de geração do XML - Deve ser implementado pelas subclasses
     */
    protected gerarXml(data?: any): string;
    protected setContentType(): "text/xml; charset=utf-8" | "application/soap+xml";
    protected callWebService(xmlConsulta: string, webServiceUrl: string, ContentType: string, action: string, agent: Agent): Promise<AxiosResponse<any, any>>;
    /**
     * Método para obter o modelo
     */
    protected getModelo(data?: any): string;
    /**
     * Executa a requisição ao webservice SEFAZ
     * @param {any} [data] - Dados opcionais usados para gerar o XML em algumas subclasses.
     * @returns {Promise<any>} A resposta do webservice em JSON.
     */
    Exec(data?: any): Promise<any>;
}
export { BaseNFE };
//# sourceMappingURL=BaseNFe.d.ts.map