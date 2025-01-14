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

import { GenericObject } from 'src/core/types';
import * as convert from "xml-js";

export default class XmlParser {
    constructor() { }

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

    removeJsonTextAttribute(value: string, parentElement: any) {
        const pOpKeys = Object.keys(parentElement._parent);
        const keyNo = pOpKeys.length;
        const keyName = pOpKeys[keyNo - 1];
        const arrOfKey = parentElement._parent[keyName];
        const arrOfKeyLen = arrOfKey.length;
        if (arrOfKeyLen > 0) {
            const arr = arrOfKey;
            const arrIndex = arrOfKey.length - 1;
            arr[arrIndex] = value;
        } else {
            parentElement._parent[keyName] = value;
        }
    }

    getStatusServicoBody(jsonData: any): any {
        ;
        return this.findInObj(jsonData, 'retConsStatServ');
    }
    getConsultaProtocoloBody(jsonData: any): any {
        return this.findInObj(jsonData, 'retConsSitNFe');
    }
    getRecepcaoEventoBody(jsonData: any): any {
        return this.findInObj(jsonData, 'retEnvEvento');
    }
    getDistribuicaoDFe(jsonData: any): any {
        return this.findInObj(jsonData, 'nfeDistDFeInteresseResult');
    }
    getDistribuicaoDFeProcBody(jsonData: any): any {
        return this.findInObj(jsonData, 'NFe');
    }
    getDistribuicaoDFeResBody(jsonData: any): any {
        return this.findInObj(jsonData, 'resNFe');
    }
    getDistribuicaoDFeEventBody(jsonData: any): any {
        return this.findInObj(jsonData, 'evento');
    }
    getAutorizacaoEventBody(jsonData: any): any {
        return this.findInObj(jsonData, 'retEnviNFe');
    }
    getAutorizacaoFinalEventBody(jsonData: any): any {
        return this.findInObj(jsonData, 'nfeProc');
    }
    getAutorizacaoRetornoEventBody(jsonData: any): any {
        return this.findInObj(jsonData, 'protNFe');
    }
    getInutilizacaoRetornoEventBody(jsonData: any): any {
        return this.findInObj(jsonData, 'infInut');
    }

    convertXmlToJson(xml: string, metodo: string, nsu?: string): GenericObject {
        try {
            const jsonAsString = convert.xml2json(xml, {
                compact: true,
                spaces: 2,
                ignoreAttributes: true,
                ignoreDeclaration: true,
                trim: true,
                ignoreInstruction: true,
                ignoreComment: true,
                ignoreCdata: true,
                ignoreDoctype: true,
                textFn: this.removeJsonTextAttribute,
            });

            const jsonData = JSON.parse(jsonAsString);
            let jsonBody: any;

            switch (metodo) {
                case 'NFEStatusServico':
                    jsonBody = this.getStatusServicoBody(jsonData)
                    break;
                case 'NFEConsultaProtocolo':
                    jsonBody = this.getConsultaProtocoloBody(jsonData)
                    break;
                case 'RecepcaoEvento':
                    jsonBody = this.getRecepcaoEventoBody(jsonData)
                    break;
                case 'NFeDistribuicaoDFe':
                    jsonBody = this.getDistribuicaoDFe(jsonData)
                    break;
                case 'NFeDistribuicaoDFe_proc':
                    jsonBody = jsonData
                    break;
                case 'NFeDistribuicaoDFe_res':
                    jsonBody = this.getDistribuicaoDFeResBody(jsonData)
                    break;
                case 'NFeDistribuicaoDFe_event':
                    jsonBody = this.getDistribuicaoDFeEventBody(jsonData)
                    break;
                case 'NFEAutorizacao':
                    jsonBody = this.getAutorizacaoEventBody(jsonData)
                    break;
                case 'NFEAutorizacaoFinal':
                    jsonBody = this.getAutorizacaoFinalEventBody(jsonData)
                    break;
                case 'NFCEAutorizacaoFinal':
                    jsonBody = this.getAutorizacaoFinalEventBody(jsonData)
                    break;
                case 'NFERetornoAutorizacao':
                    jsonBody = this.getAutorizacaoRetornoEventBody(jsonData)
                    break;
                case 'NFEInutilizacao':
                    jsonBody = this.getInutilizacaoRetornoEventBody(jsonData)
                    break;
                default:
                    throw new Error('Formato de XML desconhecido');
            }

            if (jsonBody) {
                if (nsu) {
                    jsonBody.nsu = nsu;
                }
                jsonBody.xml = xml;
            }

            return jsonBody;
        } catch (error) {
            throw new Error(`Erro ao converter XML para Json: ${error}`);
        }
    }
}
