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
     * Métodos para tratativas do DistribuicaoDFe do CTe
     */

    protected salvaArquivos(XMLDistribuicaoInJson: GenericObject, XMLDistribuicao: string, chCTe: string): void {
        const { pathXMLDistribuicao, baixarXMLDistribuicao, armazenarRetornoEmJSON } = this.environment.config.dfe

        if (baixarXMLDistribuicao) {
            this.utility.salvaXML({
                data: XMLDistribuicao,
                fileName: chCTe,
                metodo: this.metodo,
                path: pathXMLDistribuicao,
            });

            if (armazenarRetornoEmJSON) {
                this.utility.salvaJSON({
                    data: XMLDistribuicaoInJson,
                    fileName: chCTe,
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

                let chCTe = this.getChCTe(parsedResult);
                let tipo = this.getTipo(parsedResult);
                const nsu = docZip['$'].NSU;

                if (parsedResult['procEventoCTe']) {
                    const tpEvento = this.utility.findInObj(parsedResult, 'tpEvento');
                    chCTe = `${chCTe}-event-${tpEvento}`;
                    tipo = 'event';
                }

                const xmlDistribuicaoInJson = json.convertXmlToJson(cleanedXml, `${metodo}_${tipo}`, nsu);
                this.handleResponse(xmlDistribuicaoInJson, cleanedXml, chCTe);
                files.push(chCTe);
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

    getChCTe(parsedResult: GenericObject) {
        return this.utility.findInObj(parsedResult, 'chCTe');
    }

    getTipo(parsedResult: GenericObject) {
        if (this.utility.findInObj(parsedResult, 'resCTe')) {
            return 'res';
        } else if (parsedResult['procEventoCTe']) {
            return 'event';
        }
        return 'proc';
    }

    handleResponse(XMLDistribuicaoInJson: GenericObject, XMLDistribuicao: string, chCTe: string) {

        this.salvaArquivos(XMLDistribuicaoInJson, XMLDistribuicao, chCTe)

        // Gera erro em caso de Rejeição
        const xMotivo = this.utility.findInObj(XMLDistribuicaoInJson, 'xMotivo')
        if (xMotivo && (xMotivo.includes('Rejeição') || xMotivo.includes('Rejeicao'))) {
            throw new Error(XMLDistribuicaoInJson.xMotivo)
        }
    }

}

export default DistribuicaoHandler;
