/**
    * @description      :
    * @author           :
    * @group            :
    * @created          : 21/03/2025 - 21:50:20
    *
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 21/03/2025
    * - Author          :
    * - Modification    :
**/
import { Environment } from '../environment/Environment.js';
import { GenericObject, SaveXMLProps, SaveJSONProps } from '@nfewizard/types/shared';
import { NFeWizardProps, ProtNFe } from '@nfewizard/types/nfe';
import { XmlParser } from './XmlParser.js';
declare class Utility {
    environment: Environment;
    xmlParser: XmlParser;
    constructor(environment: Environment);
    /**
     * Método utilitário para criar diretórios
     */
    createDir(path: string): void;
    /**
     * Método utilitário para escrever arquivo
     */
    createFile(path: string, fileName: string, file: any, extension: string): void;
    /**
     * Função recursiva para encontrar a chave em qualquer nivel do objeto
     */
    findInObj: (obj: GenericObject, chave: string) => any;
    /**
     * Função recursiva para encontrar todas as ocorrências de uma chave em qualquer nivel do objeto
     */
    findAllInObj: (obj: GenericObject, chave: string) => any[];
    /**
     * Método responsável por gravar o XML como json
     */
    salvaJSON(props: SaveJSONProps): void;
    /**
     * Método responsável por gravar os XML recebidos em disco
     */
    salvaXMLFromJson(config: NFeWizardProps, xmlInJson: any, fileName?: string, metodo?: string): void;
    salvaXML(props: SaveXMLProps): void;
    /**
     * Recupera url para action e metoodo do SOAP
     */
    getSoapInfo1(uf: string, metodo: string): {
        method: string;
        action: string;
    };
    getSoapInfo(uf: string, method: string): {
        method: any;
        action: any;
    };
    /**
     * Marco, adicionei este metodo para concatenar todas url incluido as na Usar, mas no fim nao precisei usar por enquanto
     * @param chave
     * @returns
     */
    getLatestURLConsultaFix(chave: string): Record<string, string>;
    getLatestURLConsulta(data: Record<string, string>, metodo: string): string | null;
    /**
     * Define o ambiente (UF e Produção ou Homologação) para geração das chaves de recuperação da URL do webservice
     */
    setAmbiente(metodo: string, ambienteNacional: boolean | undefined, versao: string, mod: string): {
        chaveMae: string;
        chaveFilha: string;
    };
    /**
     * Retorna a url correta do webservice
     */
    getWebServiceUrl(metodo: string, ambienteNacional?: boolean, versao?: string, mod?: string): string;
    getUrlNFCe(metodo: string, ambienteNacional?: boolean, versao?: string): string;
    /**
     * Função para validar XML com Schema
     */
    formatErrorMessage(message: string): string;
    validateSchemaJsBased(xml: any, metodo: string): Promise<unknown>;
    validateSchemaJavaBased(xml: any, metodo: string): Promise<unknown>;
    verificaRejeicao(data: string, metodo: string, name?: string): GenericObject;
    getProtNFe(xmlRetorno: string): {
        protNFe: ProtNFe[] | undefined;
        nRec: string;
    };
    private getRequestLogFileName;
    salvaConsulta(xmlConsulta: string, xmlFormated: string, metodo: string, name?: string): void;
    salvaRetorno(xmlRetorno: string, responseInJson: GenericObject | undefined, metodo: string, name?: string): void;
}
export { Utility };
//# sourceMappingURL=Utility.d.ts.map