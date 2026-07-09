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

import { logger } from '../exceptions/logger.js';
import { GenericObject } from '@nfewizard/types/shared';
import * as convert from "xml-js";

export class XmlParser {
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
        return this.findInObj(jsonData, 'retConsStatServ');
    }
    getConsultaProtocoloBody(jsonData: any): any {
        return this.findInObj(jsonData, 'retConsSitNFe');
    }
    getRecepcaoEventoBody(jsonData: any): any {
        return this.findInObj(jsonData, 'retEnvEvento');
    }
    getDistribuicaoDFe(jsonData: any): any {
        // Tenta encontrar resposta NFe primeiro
        let result = this.findInObj(jsonData, 'nfeDistDFeInteresseResult');
        // Se não encontrar, tenta resposta CTe
        if (!result) {
            result = this.findInObj(jsonData, 'cteDistDFeInteresseResult');
        }
        return result;
    }
    getDistribuicaoDFeProcBody(jsonData: any): any {
        return this.findInObj(jsonData, 'NFe');
    }
    getDistribuicaoDFeResBody(jsonData: any): any {
        // Tenta encontrar resNFe primeiro, senão tenta resCTe
        let result = this.findInObj(jsonData, 'resNFe');
        if (!result) {
            result = this.findInObj(jsonData, 'resCTe');
        }
        return result;
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
    getNFSeAutorizacaoBody(jsonData: any): any {
        return this.findInObj(jsonData, 'NFSe') || this.findInObj(jsonData, 'infNFSe') || jsonData;
    }

    convertXmlToJson(xml: string, metodo: string, nsu?: string): GenericObject {
        logger.info(`Convertendo XML para JSON [${metodo}]`, {
            context: 'XmlParser',
        });
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
            case 'CTeDistribuicaoDFe':
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
            case 'CTeDistribuicaoDFe_proc':
                jsonBody = jsonData
                break;
            case 'CTeDistribuicaoDFe_res':
                jsonBody = this.getDistribuicaoDFeResBody(jsonData)
                break;
            case 'CTeDistribuicaoDFe_event':
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
            case 'NFERetAutorizacao':
                jsonBody = this.getAutorizacaoRetornoEventBody(jsonData)
                break;
            case 'NFEInutilizacao':
                jsonBody = this.getInutilizacaoRetornoEventBody(jsonData)
                break;
            case 'NFSeAutorizacao':
            case 'NFSEAutorizacao':
                jsonBody = this.getNFSeAutorizacaoBody(jsonData)
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
    }

    /**
     * Converte um XML de envio (`enviNFe`) ou uma `NFe` solo em uma
     * estrutura JSON compatível com o tipo `NFe` esperado pelos serviços
     * de Autorização de NFe/NFCe (`{ idLote, indSinc, NFe }`).
     *
     * Formatos aceitos:
     *  - Envelope `enviNFe` contendo uma ou mais `NFe`.
     *  - `nfeProc` (XML autorizado) — extrai a `NFe` interna.
     *  - `NFe` solo — empacota com defaults (`idLote=1`, `indSinc=1`).
     *
     * Defaults são aplicáveis somente para os campos do envelope; o
     * conteúdo de `infNFe` não é alterado e segue o fluxo normal de
     * geração/assinatura no service.
     *
     * @param xml String XML de entrada.
     * @param overrides Permite sobrescrever `idLote`/`indSinc` quando o XML
     *                  não contém envelope.
     */
    convertXmlEnvioNFeToJson(xml: string, overrides?: { idLote?: string | number; indSinc?: 0 | 1 }): GenericObject {
        logger.info('Convertendo XML de envio para JSON', {
            context: 'XmlParser',
            method: 'convertXmlEnvioNFeToJson',
        });

        const jsonData = this.parseNfeLikeXml(xml);

        let envelope: any = this.findInObj(jsonData, 'enviNFe');
        if (!envelope) {
            const nfeProc = this.findInObj(jsonData, 'nfeProc');
            const nfeNode = nfeProc ? this.findInObj(nfeProc, 'NFe') : this.findInObj(jsonData, 'NFe');
            if (!nfeNode) {
                throw new Error('XML inválido: não foi possível localizar `enviNFe` ou `NFe`.');
            }
            envelope = {
                idLote: overrides?.idLote ?? '1',
                indSinc: overrides?.indSinc ?? 1,
                NFe: nfeNode,
            };
        }

        // Normaliza CNPJ/CPF -> CNPJCPF nas NFe (formato esperado pela lib)
        const nfeList = Array.isArray(envelope.NFe) ? envelope.NFe : [envelope.NFe];
        nfeList.forEach((n: any) => this.normalizeNfeForLibFormat(n));

        return {
            idLote: envelope.idLote ?? overrides?.idLote ?? '1',
            indSinc: Number(envelope.indSinc ?? overrides?.indSinc ?? 1),
            NFe: envelope.NFe,
        };
    }

    /**
     * Converte um XML autorizado (`nfeProc`) ou uma `NFe` solo em uma
     * estrutura JSON compatível com o gerador de DANFE
     * (`{ NFe, protNFe? }`), além de retornar a chave de acesso quando
     * disponível.
     *
     * @param xml String XML de entrada.
     */
    convertXmlNfeProcToJson(xml: string): { data: GenericObject; chave: string } {
        logger.info('Convertendo nfeProc para JSON', {
            context: 'XmlParser',
            method: 'convertXmlNfeProcToJson',
        });

        const jsonData = this.parseNfeLikeXml(xml);

        const nfeProc = this.findInObj(jsonData, 'nfeProc');
        const NFe = nfeProc ? this.findInObj(nfeProc, 'NFe') : this.findInObj(jsonData, 'NFe');
        if (!NFe) {
            throw new Error('XML inválido: não foi possível localizar `NFe` ou `nfeProc`.');
        }

        const protNFe = nfeProc ? this.findInObj(nfeProc, 'protNFe') : this.findInObj(jsonData, 'protNFe');

        const chFromProt = protNFe?.infProt?.chNFe;
        const idAttr: string = NFe?.infNFe?.Id ?? '';
        const chFromId = typeof idAttr === 'string' ? idAttr.replace(/^NFe/, '') : '';
        const chave = chFromProt || chFromId || '';

        const data: GenericObject = { NFe };
        if (protNFe) data.protNFe = protNFe;

        return { data, chave };
    }

    /**
     * Faz o parse de um XML de NFe/NFCe (envio, retorno ou solo) preservando
     * atributos e elevando-os para o nível do elemento (ex.: `Id` em `infNFe`,
     * `versao` em `NFe`, `nItem` em `det`). Necessário para alimentar o
     * fluxo interno da lib que espera atributos como propriedades comuns.
     */
    private parseNfeLikeXml(xml: string): any {
        const jsonAsString = convert.xml2json(xml, {
            compact: true,
            spaces: 2,
            ignoreAttributes: false,
            ignoreDeclaration: true,
            trim: true,
            ignoreInstruction: true,
            ignoreComment: true,
            ignoreCdata: true,
            ignoreDoctype: true,
            textFn: this.removeJsonTextAttribute,
        });

        const parsed = JSON.parse(jsonAsString);
        this.liftAttributes(parsed);
        return parsed;
    }

    /**
     * Eleva, recursivamente, as chaves de `_attributes` para o próprio nível
     * do elemento e remove o nó `_attributes`. Compatível com a saída de
     * `xml-js` em modo compacto.
     */
    private liftAttributes(node: any): void {
        if (!node || typeof node !== 'object') return;

        if (Array.isArray(node)) {
            node.forEach(item => this.liftAttributes(item));
            return;
        }

        if (node._attributes && typeof node._attributes === 'object') {
            for (const attrKey of Object.keys(node._attributes)) {
                if (!(attrKey in node)) {
                    node[attrKey] = node._attributes[attrKey];
                }
            }
            delete node._attributes;
        }

        for (const key of Object.keys(node)) {
            const value = node[key];
            if (value && typeof value === 'object') {
                this.liftAttributes(value);
            }
        }
    }

    /**
     * Normaliza uma `NFe` parseada de XML para o formato interno da lib:
     *  - converte `CNPJ`/`CPF`/`idEstrangeiro` em `CNPJCPF` em `emit`,
     *    `dest`, `transp.transporta` e `NFref.refNFP`.
     *  - remove atributos elevados que a lib re-aplica via `$` ao montar
     *    o XML final (`infNFe.versao`, `det.nItem`), evitando duplicidade
     *    no XML gerado.
     *
     * Observação: `infRespTec` mantém o campo `CNPJ` original — a lib não
     * unifica documento para esse nó.
     */
    private normalizeNfeForLibFormat(nfeNode: any): void {
        const infNFe = nfeNode?.infNFe;
        if (!infNFe || typeof infNFe !== 'object') return;

        // versao é re-aplicado pela lib via $ ao montar `infNFe`
        delete infNFe.versao;

        // O atributo `Id` no XML vem com prefixo "NFe" (ex.: "NFe4126..."),
        // mas a lib espera apenas a chave de 44 dígitos em `infNFe.Id` —
        // ela própria re-prefixa com "NFe" ao calcular `chaveAcesso`.
        if (typeof infNFe.Id === 'string' && /^NFe\d{44}$/.test(infNFe.Id)) {
            infNFe.Id = infNFe.Id.slice(3);
        }

        this.unifyDocFields(infNFe.emit);
        this.unifyDocFields(infNFe.dest);
        this.unifyDocFields(infNFe.transp?.transporta);

        // nItem é re-aplicado pela lib via $ em cada `det` quando é array.
        // Por isso normalizamos sempre para array (no XML, com 1 item, viraria
        // objeto único e a lib não re-aplicaria nItem, quebrando a validação XSD).
        const det = infNFe.det;
        if (Array.isArray(det)) {
            det.forEach((d: any) => { if (d && typeof d === 'object') delete d.nItem; });
        } else if (det && typeof det === 'object') {
            delete det.nItem;
            infNFe.det = [det];
        }

        const NFref = infNFe.NFref;
        if (Array.isArray(NFref)) {
            NFref.forEach((ref: any) => this.unifyDocFields(ref?.refNFP));
        } else if (NFref && typeof NFref === 'object') {
            this.unifyDocFields(NFref.refNFP);
        }
    }

    /**
     * Em um nó (ex.: `emit`, `dest`), unifica `CNPJ`/`CPF`/`idEstrangeiro`
     * em um único campo `CNPJCPF`, removendo as chaves originais. Mantém a
     * primeira não-vazia encontrada na ordem `CNPJ → CPF → idEstrangeiro`.
     */
    private unifyDocFields(target: any): void {
        if (!target || typeof target !== 'object') return;
        if (target.CNPJCPF) return;

        const candidate = target.CNPJ || target.CPF || target.idEstrangeiro;
        if (candidate) {
            target.CNPJCPF = candidate;
        }
        delete target.CNPJ;
        delete target.CPF;
        delete target.idEstrangeiro;
    }
}
