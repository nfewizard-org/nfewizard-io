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
import { XmlParser, Utility, Environment } from '@nfewizard/shared';
import { GenericObject } from '@nfewizard/types/shared';
import { AxiosResponse } from 'axios';

export class DistribuicaoHandler {
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

    protected salvaArquivos(XMLDistribuicaoInJson: GenericObject, XMLDistribuicao: string, fileName: string): void {
        const { pathXMLDistribuicao, baixarXMLDistribuicao, armazenarRetornoEmJSON } = this.environment.config.dfe

        if (baixarXMLDistribuicao) {
            this.utility.salvaXML({
                data: XMLDistribuicao,
                fileName,
                metodo: this.metodo,
                path: pathXMLDistribuicao,
            });

            if (armazenarRetornoEmJSON) {
                this.utility.salvaJSON({
                    data: XMLDistribuicaoInJson,
                    fileName,
                    metodo: this.metodo,
                    path: pathXMLDistribuicao,
                });
            }
        }
    }

    deCompressDFeXML(loteDistDFeInt: AxiosResponse<any, any>, metodo: string, _xmlConsulta: string) {
        try {
            const json = new XmlParser()
            const files: string[] = [];
            xml2js.parseString(loteDistDFeInt, (err, result) => {
                if (err) {
                    throw new Error(`Erro ao descomprimir o XML: ${err}`);
                }

                const docZips = this.utility.findInObj(result, 'docZip');
                docZips.forEach((docZip: any, index: number) => {
                    const xmlString = this.decodeDocZip(docZip);
                    const cleanedXml = this.removeSignatureTag(xmlString);

                    const parsedResult = this.parseXml(cleanedXml);
                    if (!parsedResult) return;

                    const chNFe = this.getChNFe(parsedResult);
                    const tipo = this.getTipo(parsedResult);
                    const nsu = this.getDocNsu(docZip, index);
                    const tpEvento = tipo === 'event' ? this.utility.findInObj(parsedResult, 'tpEvento') : '';
                    const fileName = this.buildFileName(chNFe, tipo, nsu, tpEvento);

                    const xmlDistribuicaoInJson = json.convertXmlToJson(cleanedXml, `${metodo}_${tipo}`, nsu);
                    this.handleResponse(xmlDistribuicaoInJson, cleanedXml, fileName);
                    files.push(fileName);
                });
            });
            return files;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    private getDocNsu(docZip: any, index: number): string {
        const nsu = (docZip?.$?.NSU ?? '').toString().trim();
        return nsu || `idx-${index}`;
    }

    private sanitizeFileNamePart(value: any): string {
        const normalizedValue = (value ?? '').toString().trim();
        if (!normalizedValue) {
            return '';
        }

        return normalizedValue.replace(/[^a-zA-Z0-9_.-]/g, '_');
    }

    private buildFileName(chNFe: string, tipo: string, nsu: string, tpEvento: string): string {
        const safeChNFe = this.sanitizeFileNamePart(chNFe) || 'sem-chave';
        const safeNsu = this.sanitizeFileNamePart(nsu) || 'sem-nsu';

        if (tipo === 'res') {
            return `${safeChNFe}-res-${safeNsu}`;
        }

        if (tipo === 'event') {
            const safeTpEvento = this.sanitizeFileNamePart(tpEvento) || 'sem-tpevento';
            return `${safeChNFe}-event-${safeTpEvento}-${safeNsu}`;
        }

        return `${safeChNFe}-proc-${safeNsu}`;
    }

    decodeDocZip(docZip: any) {
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

    handleResponse(XMLDistribuicaoInJson: GenericObject, XMLDistribuicao: string, fileName: string) {
        // Gera erro em caso de Rejeição
        const xMotivo = this.utility.findInObj(XMLDistribuicaoInJson, 'xMotivo')
        if (xMotivo && (xMotivo.includes('Rejeição') || xMotivo.includes('Rejeicao'))) {
            throw new Error(XMLDistribuicaoInJson.xMotivo)
        }

        this.salvaArquivos(XMLDistribuicaoInJson, XMLDistribuicao, fileName)
    }

}

export default DistribuicaoHandler;