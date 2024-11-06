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

import fs from 'fs';
import xsdValidator from 'xsd-schema-validator';
import NFeServicosUrl from '../config/NFeServicosUrl.json';
import soapMethod from '../config/soapMethod.json';
import cStatError from '../config/cStatError.json';
import { getSchema } from './getSchema';
import Environment from '@Classes/Environment';
import { NFeWizardProps, GenericObject, SoapMethod, NFeServicosUrlType, SaveXMLProps, SaveJSONProps, ProtNFe } from '@Protocols';
import { Json } from './xml2json';
import xml2js from 'xml2js';
import path from 'path';
import libxmljs from 'libxmljs';

class Utility {
    environment;
    json: Json;
    constructor(environment: Environment) {
        this.environment = environment;
        this.json = new Json();
    }

    /**
     * Método utilitário para criar diretórios
     */
    createDir(path: string) {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
        }
    }

    /**
     * Método utilitário para escrever arquivo
     */
    createFile(path: string, fileName: string, file: any, extension: string) {
        if (extension.toLowerCase() === 'json') {
            fs.writeFileSync(`${path}/${fileName}.${extension}`, JSON.stringify(file));
        } else {
            fs.writeFileSync(`${path}/${fileName}.${extension}`, file);
        }
    }

    /**
     * Função recursiva para encontrar a chave em qualquer nivel do objeto
     */
    findInObj = (obj: GenericObject, chave: string): any => {
        if (obj.hasOwnProperty(chave)) {
            return obj[chave];
        }
        for (let prop in obj) {
            if (typeof obj[prop] === 'object') {
                const result = this.findInObj(obj[prop], chave); // Passar a chave aqui
                if (result) {
                    return result;
                }
            }
        }
        return '';
    };

    /**
     * Método responsável por gravar o XML como json
     */
    salvaJSON(props: SaveJSONProps) {
        const { fileName, metodo, path, data } = props;
        try {
            let pathJson = path;

            if (!pathJson || pathJson.trim() === '') {
                pathJson = `../tmp/${metodo}/`
            }

            // Utiliza a função recursiva para encontrar a chave chNFe
            // const chNFe = this.findInObj(json, 'chNFe');

            this.createDir(pathJson);

            this.createFile(pathJson, fileName, data, 'json');
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    /**
     * Método responsável por gravar os XML recebidos em disco
     */
    salvaXMLFromJson(config: NFeWizardProps, xmlInJson: any, fileName = "", metodo = "") {
        try {
            let pathXml = config.dfe.pathXMLRetorno;

            if (!pathXml || pathXml.trim() === '') {
                pathXml = `../tmp/${metodo}/`
            }

            const { xml } = xmlInJson;

            // Utiliza a função recursiva para encontrar a chave chNFe
            const chNFe = this.findInObj(xmlInJson, 'chNFe');

            this.createDir(pathXml);

            this.createFile(pathXml, fileName || chNFe, xml, 'xml');

        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    salvaXML(props: SaveXMLProps) {
        const { fileName, metodo, path, data } = props;
        try {
            let pathXml = path;

            if (!pathXml || pathXml.trim() === '') {
                pathXml = `../tmp/${metodo}/`
            }

            // busca a chave chNFe
            // xml2js.parseString(xml, (err, result) => {
            //     if (err) {
            //         console.error('Erro ao parsear o XML para captura do chNFe:', err);
            //     } else {
            //         console.log(result);
            //     }
            // });

            this.createDir(pathXml);

            this.createFile(pathXml, fileName, data, 'xml');

        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    /**
     * Recupera url para action e metoodo do SOAP
     */
    getSoapInfo(metodo: string) {
        const methodConfig = soapMethod as SoapMethod;
        const methodInfo = methodConfig[metodo];
        if (!methodInfo) {
            throw new Error("Método não encontrado no arquivo de configuração SOAP.");
        }
        return {
            method: methodInfo.method,
            action: methodInfo.action,
        };
    }


    getLatestURLConsulta(data: Record<string, string>, metodo: string): string | null {
        // Obtem todas as chaves do objeto
        const keys = Object.keys(data);

        // Monta o prefixo dinâmico com base no método fornecido
        const prefix = `${metodo}_`;

        // Filtra as chaves que começam com o prefixo dinâmico e extrai as versões
        const versions = keys
            .map(key => {
                const match = key.match(new RegExp(`^${prefix}(\\d+\\.\\d+)$`));
                return match ? parseFloat(match[1]) : null; // Extrai a versão como número
            })
            .filter(version => version !== null) // Remove versões que não existem
            .sort((a, b) => b - a); // Ordena em ordem decrescente

        // Busca a primeira URL que corresponder à versão mais alta
        for (let version of versions) {
            const key = `${prefix}${version.toFixed(2)}`; // Formata a chave
            if (data[key]) {
                return data[key]; // Retorna a URL encontrada
            }
        }

        // Caso não encontre nenhuma versão numerada, retorna a URL sem versão
        return data[metodo] || null;
    };


    /**
     * Define o ambiente (UF e Produção ou Homologação) para geração das chaves de recuperação da URL do webservice
     */
    setAmbiente(metodo: string, ambienteNacional = false, versao: string, mod: string) {
        const config = this.environment.getConfig();
        const ambiente = config.nfe.ambiente === 2 ? 'H' : 'P';

        const versaoDF = versao !== "" ? versao : config.nfe.versaoDF;

        if (ambienteNacional) {
            const chaveMae = `${mod}_AN_${ambiente}`;
            const chaveFilha = `${metodo}_${versaoDF}`;

            return { chaveMae, chaveFilha };
        }

        const chaveMae = `${mod}_${config.dfe.UF}_${ambiente}`;
        const chaveFilha = `${metodo}_${versaoDF}`;

        return { chaveMae, chaveFilha };
    }

    /**
     * Retorna a url correta do webservice
     */
    getWebServiceUrl(metodo: string, ambienteNacional = false, versao = "", mod = "NFe"): string {
        let { chaveMae, chaveFilha } = this.setAmbiente(metodo, ambienteNacional, versao, mod);
        const urls = NFeServicosUrl as NFeServicosUrlType;

        if ('Usar' in urls[chaveMae])
            chaveMae = urls[chaveMae].Usar

        const url = urls[chaveMae] && urls[chaveMae][chaveFilha];
        if (!url) {
            throw new Error(`Não foi possível recuperar a url para o webservice: ${chaveFilha}`);
        }
        return url;
    }

    getUrlNFCe(metodo: string, ambienteNacional = false, versao = ""): string {
        let { chaveMae } = this.setAmbiente(metodo, ambienteNacional, versao, 'NFCe');
        const urls = NFeServicosUrl as NFeServicosUrlType;

        if ('Usar' in urls[chaveMae])
            chaveMae = urls[chaveMae].Usar

        const chaveFilha = this.getLatestURLConsulta(urls[chaveMae], metodo);
        const url = urls[chaveMae] && this.getLatestURLConsulta(urls[chaveMae], metodo)

        if (!url) {
            throw new Error(`Não foi possível recuperar a url para consulta de NFCe: ${chaveFilha}`);
        }
        return url;
    }

    /**
     * Função para validar XML com Schema
     */

    formatErrorMessage(message: string) {
        // Esta função extrai e formata a mensagem de erro
        const regex = /\[error\]\s(.+?)\:\s(.+?)\s\((\d+):(\d+)\)/;
        const match = message.match(regex);
        if (match) {
            const [_, errorCode, errorDescription, line, column] = match;
            return `Erro na Validação do XML: ${errorCode} na linha ${line}, coluna ${column}. Descrição: ${errorDescription}`;
        } else {
            return `Erro Não Identificado na Validação do XML: ${message}`; // Retorna a mensagem original se ela não corresponder ao formato esperado
        }
    }

    async readXSD(filePath: string, firstFile: boolean): Promise<string> {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    return reject(err);
                }
    
                // Remover declaração XML dos arquivos incluídos
                if (!firstFile) {
                    data = data.replace(/<\?xml.*?\?>\s*/i, '');
                }
    
                // Remover tags <xs:schema> de arquivos incluídos
                if (!firstFile) {
                    data = data.replace(/<xs:schema[^>]*>/i, '').replace(/<\/xs:schema>/i, '');
                }
    
                resolve(data);
            });
        });
    }
    

    extractIncludes(xsdContent: string): Array<any> {
        const includes = [];
        const includeRegex = /<xs:include\s+schemaLocation="([^"]+)"\s*\/?>/g;
        let match;

        while ((match = includeRegex.exec(xsdContent)) !== null) {
            includes.push({
                schemaLocation: match[1],
                original: match[0],  // Guardar o include original para substituição posterior
            });
        }

        return includes;
    }

    async resolveXSDIncludes(xsdPath: string,  firstFile: boolean, basePath = '.') {
        let schemaContent = await this.readXSD(xsdPath, firstFile);
        const includes = this.extractIncludes(schemaContent);

        // Resolver todos os includes de forma recursiva
        for (const include of includes) {
            const includePath = path.resolve(basePath, include.schemaLocation);
            // console.log({includePath})
            const includedXSD = await this.resolveXSDIncludes(includePath,  false, basePath);
            // console.log({includedXSD})
            schemaContent = schemaContent.replace(include.original, includedXSD);
        }
        // console.log(schemaContent)
        return schemaContent;
    }

    validateSchema(xml: any, metodo: string) {
        return new Promise(async (resolve, reject) => {
            try {
                const { basePath, schemaPath } = getSchema(metodo);
                console.log(schemaPath)
                // const completeXSD = await this.resolveXSDIncludes(schemaPath, true, basePath);
                // console.log(completeXSD)
                const completeXSD = `<?xml version="1.0" encoding="UTF-8"?><xs:schema xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns="http://www.portalfiscal.inf.br/nfe" xmlns:xs="http://www.w3.org/2001/XMLSchema" targetNamespace="http://www.portalfiscal.inf.br/nfe" elementFormDefault="qualified" attributeFormDefault="unqualified"><xs:complexType name="TConsStatServ"><xs:annotation><xs:documentation>Tipo Pedido de Consulta do Status do Serviço</xs:documentation></xs:annotation><xs:sequence><xs:element name="tpAmb" type="TAmb"><xs:annotation><xs:documentation>Identificação do Ambiente: 1 - Produção 2 - Homologação</xs:documentation></xs:annotation></xs:element><xs:element name="cUF" type="TCodUfIBGE"><xs:annotation><xs:documentation>Sigla da UF consultada</xs:documentation></xs:annotation></xs:element><xs:element name="xServ"><xs:annotation><xs:documentation>Serviço Solicitado</xs:documentation></xs:annotation><xs:simpleType><xs:restriction base="TServ"><xs:enumeration value="STATUS"/></xs:restriction></xs:simpleType></xs:element></xs:sequence><xs:attribute name="versao" type="TVerConsStatServ" use="required"/></xs:complexType><xs:complexType name="TRetConsStatServ"><xs:annotation><xs:documentation>Tipo Resultado da Consulta do Status do Serviço</xs:documentation></xs:annotation><xs:sequence><xs:element name="tpAmb" type="TAmb"><xs:annotation><xs:documentation>Identificação do Ambiente: 1 - Produção 2 - Homologação</xs:documentation></xs:annotation></xs:element><xs:element name="verAplic" type="TVerAplic"><xs:annotation><xs:documentation>Versão do Aplicativo que processou a NF-e</xs:documentation></xs:annotation></xs:element><xs:element name="cStat" type="TStat"><xs:annotation><xs:documentation>Código do status da mensagem enviada.</xs:documentation></xs:annotation></xs:element><xs:element name="xMotivo" type="TMotivo"><xs:annotation><xs:documentation>Descrição literal do status do serviço solicitado.</xs:documentation></xs:annotation></xs:element><xs:element name="cUF" type="TCodUfIBGE"><xs:annotation><xs:documentation>Código da UF responsável pelo serviço</xs:documentation></xs:annotation></xs:element><xs:element name="dhRecbto" type="TDateTimeUTC"><xs:annotation><xs:documentation>Data e hora do recebimento da consulta no formato AAAA-MM-DDTHH:MM:SSTZD</xs:documentation></xs:annotation></xs:element><xs:element name="tMed" type="TMed" minOccurs="0"><xs:annotation><xs:documentation>Tempo médio de resposta do serviço (em segundos) dos últimos 5 minutos</xs:documentation></xs:annotation></xs:element><xs:element name="dhRetorno" type="TDateTimeUTC" minOccurs="0"><xs:annotation><xs:documentation>AAAA-MM-DDTHH:MM:SSDeve ser preenchida com data e hora previstas para o retorno dos serviços prestados.</xs:documentation></xs:annotation></xs:element><xs:element name="xObs" type="TMotivo" minOccurs="0"><xs:annotation><xs:documentation>Campo observação utilizado para incluir informações ao contribuinte</xs:documentation></xs:annotation></xs:element></xs:sequence><xs:attribute name="versao" type="TVerConsStatServ" use="required"/></xs:complexType><xs:simpleType name="TVerConsStatServ"><xs:annotation><xs:documentation>Tipo versão do leiuate da Consulta Status do Serviço 4.00</xs:documentation></xs:annotation><xs:restriction base="xs:token"><xs:pattern value="4\.00"/></xs:restriction></xs:simpleType><xs:element name="consStatServ" type="TConsStatServ"><xs:annotation><xs:documentation>Schema XML de validação do Pedido de Consulta do Status do Serviço</xs:documentation></xs:annotation></xs:element></xs:schema>`
                
                const teste: string = await new Promise((resolve, reject) => {
                    fs.readFile(schemaPath, 'utf8', (err, data) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve(data);
                    });
                })
                console.log({ teste })
                const xmlDoc = libxmljs.parseXml(xml);
                const xsdDoc = libxmljs.parseXml(teste);
                
                const isValid = xmlDoc.validate(xsdDoc);

                if (isValid) {
                  console.log('O XML é válido!');
                } else {
                  console.log('O XML não é válido. Erros:');
                  console.log(xmlDoc.validationErrors);
                }
                // console.log('XSD Completo com Includes Resolvidos:\n', completeXSD);
                throw new Error('teste')
                xsdValidator.validateXML(xml, schemaPath, (err, validationResult) => {
                    if (err) {
                        reject({
                            success: false,
                            message: this.formatErrorMessage(err.message),
                        });
                    } else if (!validationResult.valid) {
                        reject({
                            success: false,
                            message: this.formatErrorMessage(validationResult.messages[0]),
                        });
                    } else {
                        resolve({
                            success: true,
                            message: 'XML válido.',
                        });
                    }
                });
            } catch (error: any) {
                console.log(error)
                reject({
                    success: false,
                    message: this.formatErrorMessage(error.message),
                });
            }
        });
    }

    verificaRejeicao(data: string, metodo: string, name?: string) {
        const responseInJson = this.json.convertXmlToJson(data, metodo);

        // Gera erro em caso de Rejeição
        const xMotivo = this.findInObj(responseInJson, 'xMotivo');
        const infProt = this.findInObj(responseInJson, 'infProt');

        // Salva XML de retorno
        this.salvaRetorno(data, responseInJson, metodo, name);

        // Gera erro em caso de Rejeição
        if (xMotivo && (xMotivo.includes('Rejeição') || xMotivo.includes('Rejeicao'))) {
            throw new Error(xMotivo);
        }
        if (infProt && (infProt?.xMotivo.includes('Rejeição') || infProt?.xMotivo.includes('Rejeicao'))) {
            throw new Error(infProt?.xMotivo);
        }
        // if (infEvento && (infEvento?.xMotivo.includes('Rejeição') || infEvento?.xMotivo.includes('Rejeicao'))) {
        //     throw new Error(xMotivo);
        // }

        return responseInJson;
    }

    getProtNFe(xmlRetorno: string): {
        protNFe: ProtNFe[] | undefined;
        nRec: string;
    } {
        let nRec = '';
        let protNFe: ProtNFe[] | undefined;
        xml2js.parseString(xmlRetorno, (err, result) => {
            if (err) {
                console.error('Erro ao parsear o XML para captura do nRec e protNFe:', err);
            } else {
                const nRecTag = this.findInObj(result, 'nRec')
                nRec = nRecTag[0]

                const protNFeTag = this.findInObj(result, 'protNFe')
                protNFe = protNFeTag
            }
        });
        return {
            protNFe,
            nRec
        };
    }

    private getRequestLogFileName(metodo: string, tipo: string) {
        switch (metodo) {
            case 'NFEStatusServico':
                return `NFeStatusServico-${tipo}`
            case 'NFEConsultaProtocolo':
                return `NFeConsultaProtocolo-${tipo}`
            case 'NFeDistribuicaoDFe':
                return `NFeDistribuicaoDFe-${tipo}`
            case 'RecepcaoEvento':
                return `RecepcaoEvento-${tipo}`
            case 'NFECancelamento':
                return `NFECancelamento-${tipo}`
            case 'NFEInutilizacao':
                return `NFEInutilizacao-${tipo}`
            case 'NFEAutorizacao':
                return `NFEAutorizacao-${tipo}`
            case 'NFCEAutorizacao':
                return `NFCEAutorizacao-${tipo}`
            case 'NFERetornoAutorizacao':
                return `NFERetornoAutorizacao-${tipo}`

            default:
                throw new Error('Erro: Requisição de nome para método não implementado.')
        }
    }

    salvaConsulta(xmlConsulta: string, xmlFormated: string, metodo: string, name?: string) {
        try {
            const fileName = name || this.getRequestLogFileName(metodo, 'consulta');
            const { armazenarXMLConsulta, pathXMLConsulta, armazenarXMLConsultaComTagSoap } = this.environment.config.dfe
            const xmlConsultaASalvar = armazenarXMLConsultaComTagSoap ? xmlFormated : xmlConsulta;

            if (armazenarXMLConsulta) {
                this.salvaXML({
                    data: xmlConsultaASalvar,
                    fileName,
                    metodo,
                    path: pathXMLConsulta,
                });
            }
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    salvaRetorno(xmlRetorno: string, responseInJson: GenericObject, metodo: string, name?: string) {
        try {
            const fileName = name || this.getRequestLogFileName(metodo, 'retorno');
            const { armazenarXMLRetorno, pathXMLRetorno, armazenarRetornoEmJSON } = this.environment.config.dfe

            if (armazenarXMLRetorno) {
                this.salvaXML({
                    data: xmlRetorno,
                    fileName,
                    metodo,
                    path: pathXMLRetorno,
                });

                if (armazenarRetornoEmJSON) {
                    this.salvaJSON({
                        data: responseInJson,
                        fileName,
                        metodo,
                        path: pathXMLRetorno,
                    });
                }
            }
        } catch (error: any) {
            throw new Error(error.message)
        }
    }
}

export default Utility;