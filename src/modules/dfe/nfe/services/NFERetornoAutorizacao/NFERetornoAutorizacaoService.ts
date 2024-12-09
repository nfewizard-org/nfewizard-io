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
import Environment from '@Modules/environment/Environment.js';
import Utility from '@Utils/Utility.js';
import XmlBuilder from '@Adapters/XmlBuilder.js';
import BaseNFE from '@Modules/dfe/base/BaseNFe.js';
import { ProtNFe } from '@Types';
import { AxiosInstance } from 'axios';
import { GerarConsultaImpl, NFERetornoAutorizacaoServiceImpl, SaveFilesImpl } from '@Interfaces';

class NFERetornoAutorizacaoService extends BaseNFE implements NFERetornoAutorizacaoServiceImpl {
    constructor(environment: Environment, utility: Utility, xmlBuilder: XmlBuilder, axios: AxiosInstance, saveFiles: SaveFilesImpl, gerarConsulta: GerarConsultaImpl) {
        super(environment, utility, xmlBuilder, 'NFERetornoAutorizacao', axios, saveFiles, gerarConsulta);
    }

    protected gerarXml(data: string): string {
        try {
            const { nfe: { ambiente } } = this.environment.getConfig();

            const xmlObject = {
                $: {
                    xmlns: 'http://www.portalfiscal.inf.br/nfe',
                    versao: "4.00",
                },
                tpAmb: ambiente,
                nRec: data
            }
            return this.xmlBuilder.gerarXml(xmlObject, 'consReciNFe')
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    /**
     * Busca o retorno da Autorização pelo número do recibo (nRec)
     * 
     * @param {string} nRec - Número do recibo retornado pela SEFAZ ao emitir uma NFe em modo assíncrono.
     * @param {any} xmlNFe - Array contendo as NFe do lote enviado à SEFAZ.
     * @returns {Promise<string>} XML completo da NFe (já com protocolo de autorização).
     */
    async getRetornoRecibo(nRec: string, xmlNFe: string[]): Promise<{
        success: boolean;
        message: any;
        data: string[];
    }> {
        try {
            /**
             * Gera o XML para consulta de acordo com o número do recibo da emissão (nRec)
             */
            const xmlConsulta = this.gerarXml(nRec);

            const { xmlFormated, agent, webServiceUrl, action } = await this.gerarConsulta.gerarConsulta(xmlConsulta, this.metodo);

            // Salva XML de Consulta
            this.utility.salvaConsulta(xmlConsulta, xmlFormated, this.metodo);

            // Efetua requisição para o webservice NFEStatusServico
            const xmlRetorno = await this.axios.post(webServiceUrl, xmlFormated, {
                headers: {
                    'Content-Type': 'text/xml; charset=utf-8',
                    'SOAPAction': action,
                },
                httpsAgent: agent
            });

            const responseInJson = this.utility.verificaRejeicao(xmlRetorno.data, this.metodo);
            
            // Salva XML de Retorno
            this.utility.salvaRetorno(xmlRetorno.data, responseInJson, this.metodo);

            const { protNFe } = this.utility.getProtNFe(xmlRetorno.data);

            if (!protNFe) {
                throw new Error(`Não foi possível encontrar a tag 'protNFe'. Talvez a NFe ainda não tenha sido processada.`)
            }
            return this.getXmlRetornoAutorizacao(protNFe, xmlNFe);
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    /**
     * Agrega o protNFe ao restante da NFe gerada na emissão.
     * 
     * @param {string} protNFe - Tag protNFe do XML em formato JSON.
     * @param {any} xmlNFe - Array contendo as NFe do lote enviado à SEFAZ.
     * @returns {} XML completo da NFe (já com protocolo de autorização).
     */
    private getXmlRetornoAutorizacao(protNFe: ProtNFe[], xmlNFe: string[]): {
        success: boolean;
        message: any;
        data: string[];
    } {
        try {
            /**
             * Cria o Obj base da NFe já processada (nfeProc)
             */
            const XMLs = []
            for (let i = 0; i < protNFe.length; i++) {
                const baseXML = {
                    $: {
                        versao: "4.00",
                        xmlns: 'http://www.portalfiscal.inf.br/nfe'
                    },
                    _: '[XML]'
                }
                let xml = this.xmlBuilder.gerarXml(baseXML, 'nfeProc')
                /**
                 * Converte a tag protNFe do formato JSON para XML e armazena na string protTag.
                 * Adiciona a tag protNFe (armazenada na string protTag) ao array contendo os dados das NFe.
                 */
                // Expressão regular para capturar o valor do atributo Id
                const formatedProtNFe: any = protNFe;
                const xmlCompleto = xmlNFe.find((item) => item.indexOf(formatedProtNFe[i].infProt[0].chNFe[0]) !== -1);
 
                if (xmlCompleto) {
                    const protTag = this.xmlBuilder.gerarXml(protNFe[i], 'protNFe')
                    const xmlFinal = [xmlCompleto]
                    xmlFinal.push(protTag)

                    /**
                     * Substitui o "[XML]" com as tags NFe e a tag protNFe
                     */
                    xml = xml.replace('[XML]', xmlFinal.join(''));
                    xml = `<?xml version="1.0" encoding="UTF-8"?>${xml}`;

                    XMLs.push(xml)
                }
            }
            return {
                success: true,
                message: 'xMotivo',
                data: XMLs
            }
        } catch (error: any) {
            throw new Error(error.message)
        }

    }

    /**
     * Retorna o XML completo da Autorização (já com o protocolo de autorização)
     * 
     * @param {number} tipoEmissao - Informa se o tipo emissão foi síncrona ou assíncrona (0- Não / 1 - Sim).
     * @param {string | undefined} nRec - Número do recibo retornado pela SEFAZ ao emitir uma NFe em modo assíncrono.
     * @param {ProtNFe | undefined} protNFe - Tag protNFe do XML em formato JSON.
     * @param {string[]} xmlNFe - Array contendo as NFe do lote enviado à SEFAZ.
     * @returns {Promise<string>} XML completo da NFe (já com protocolo de autorização).
     */
    async getXmlRetorno({
        tipoEmissao,
        nRec,
        protNFe,
        xmlNFe
    }: {
        tipoEmissao: number,
        nRec?: string,
        protNFe?: ProtNFe[],
        xmlNFe: string[]
    }): Promise<{
        success: boolean;
        message: any;
        data: string[];
    }> {
        try {

            /**
             * Trata retorno Síncrono
             */
            if (tipoEmissao === 1 && protNFe) {
                return this.getXmlRetornoAutorizacao(protNFe, xmlNFe);
            }

            /**
             * Trata retorno Assíncrono
             */
            if (tipoEmissao === 0 && nRec) {
                return this.getRetornoRecibo(nRec, xmlNFe);
            }

            throw new Error('Não foi possível buscar o retorno da autorização.');

        } catch (error: any) {
            throw new Error(error.message)
        }
    }
}

export default NFERetornoAutorizacaoService;