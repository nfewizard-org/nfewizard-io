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
import pako from 'pako';
import xml2js from 'xml2js';
import XmlParser from '@Utils/XmlParser.js';
import Utility from '@Utils/Utility.js';
import { GenericObject } from '@Types';
import Environment from '@Modules/environment/Environment.js';
import { AxiosResponse } from 'axios';
import { logger } from '@Core/exceptions/logger';

class DistribuicaoHandler {
    environment: Environment;
    utility: Utility;
    metodo: string;
    constructor(environment: Environment, utility: Utility, metodo: string) {
        this.utility = utility;
        this.environment = environment;
        this.metodo = metodo;
    }

    /**
     * Métodos para tratativas do DistribuicaoDFe
     */

    protected salvaArquivos(XMLDistribuicaoInJson: GenericObject, XMLDistribuicao: string, chNFe: string): void {
        const { pathXMLDistribuicao, baixarXMLDistribuicao, armazenarRetornoEmJSON } = this.environment.config.dfe

        if (baixarXMLDistribuicao) {
            this.utility.salvaXML({
                data: XMLDistribuicao,
                fileName: chNFe,
                metodo: this.metodo,
                path: pathXMLDistribuicao,
            });

            if (armazenarRetornoEmJSON) {
                this.utility.salvaJSON({
                    data: XMLDistribuicaoInJson,
                    fileName: chNFe,
                    metodo: this.metodo,
                    path: pathXMLDistribuicao,
                });
            }
        }
    }

    deCompressDFeXML(loteDistDFeInt: AxiosResponse<any, any>, metodo: string, xmlConsulta: string) {
        logger.info('Descomprimindo XML', {
            context: 'DistribuicaoHandler',
        });
        const json = new XmlParser()
        const files: string[] = [];
        xml2js.parseString(loteDistDFeInt, (err, result) => {
            if (err) {
                throw new Error(`Erro ao descomprimir o XML: ${err}`);
            }

            const docZips = this.utility.findInObj(result, 'docZip');
            docZips.forEach((docZip: any) => {
                const xmlString = this.decodeDocZip(docZip);
                const cleanedXml = this.removeSignatureTag(xmlString);

                const parsedResult = this.parseXml(cleanedXml);
                if (!parsedResult) return;

                let chNFe = this.getChNFe(parsedResult);
                let tipo = this.getTipo(parsedResult);
                const nsu = docZip['$'].NSU;

                if (parsedResult['procEventoNFe']) {
                    const tpEvento = this.utility.findInObj(parsedResult, 'tpEvento');
                    chNFe = `${chNFe}-event-${tpEvento}`;
                    tipo = 'event';
                }

                const xmlDistribuicaoInJson = json.convertXmlToJson(cleanedXml, `${metodo}_${tipo}`, nsu);
                this.handleResponse(xmlDistribuicaoInJson, cleanedXml, chNFe);
                files.push(chNFe);
            });
        });
        return files;
    }

    decodeDocZip(docZip: any) {
        logger.info('Decodificando DocZip', {
            context: 'DistribuicaoHandler',
        });
        const base64String = docZip['_'];
        let binaryString = atob(base64String);
        let bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        let decompressedData = pako.inflate(bytes);
        return new TextDecoder("utf-8").decode(decompressedData);
    }

    removeSignatureTag(xmlString: string) {
        return xmlString.replace(/<Signature.*?<\/Signature>/gs, '');
    }

    parseXml(xmlString: string) {
        let parsedResult;
        xml2js.parseString(xmlString, (err, result) => {
            if (err) {
                console.error('Erro ao parsear o XML decomprimido:', err);
                parsedResult = null;
            } else {
                parsedResult = result;
            }
        });
        return parsedResult;
    }

    getChNFe(parsedResult: GenericObject) {
        return this.utility.findInObj(parsedResult, 'chNFe');
    }

    getTipo(parsedResult: GenericObject) {
        if (this.utility.findInObj(parsedResult, 'resNFe')) {
            return 'res';
        } else if (parsedResult['procEventoNFe']) {
            return 'event';
        }
        return 'proc';
    }

    handleResponse(XMLDistribuicaoInJson: GenericObject, XMLDistribuicao: string, chNFe: string) {

        this.salvaArquivos(XMLDistribuicaoInJson, XMLDistribuicao, chNFe)

        // Gera erro em caso de Rejeição
        const xMotivo = this.utility.findInObj(XMLDistribuicaoInJson, 'xMotivo')
        if (xMotivo && (xMotivo.includes('Rejeição') || xMotivo.includes('Rejeicao'))) {
            throw new Error(XMLDistribuicaoInJson.xMotivo)
        }
    }

}

export default DistribuicaoHandler;