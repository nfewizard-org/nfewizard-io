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
import { AxiosInstance, AxiosResponse } from 'axios';
import NFERetornoAutorizacao from '../../operations/NFERetornoAutorizacao/NFERetornoAutorizacao.js';
import XmlParser from '../../../../../core/utils/XmlParser.js';
import Environment from '@Modules/environment/Environment.js';
import Utility from '@Utils/Utility.js';
import XmlBuilder from '@Adapters/XmlBuilder.js';
import ValidaCPFCNPJ from '../../../../../core/utils/ValidaCPFCNPJ.js';
import { GenericObject, LayoutNFe, NFe, ProtNFe } from '@Types';
import BaseNFE from '@Modules/dfe/base/BaseNFe.js';
import { format } from 'date-fns';
import { mountCOFINS, mountICMS, mountPIS } from '@Utils/NFEImposto.js';
import { GerarConsultaImpl, NFEAutorizacaoServiceImpl, SaveFilesImpl } from '@Interfaces';
import NFERetornoAutorizacaoService from '../NFERetornoAutorizacao/NFERetornoAutorizacaoService.js';

class NFEAutorizacaoService extends BaseNFE implements NFEAutorizacaoServiceImpl {
    xmlNFe: string[];

    constructor(environment: Environment, utility: Utility, xmlBuilder: XmlBuilder, axios: AxiosInstance, saveFiles: SaveFilesImpl, gerarConsulta: GerarConsultaImpl) {
        super(environment, utility, xmlBuilder, 'NFEAutorizacao', axios, saveFiles, gerarConsulta);
        this.xmlNFe = [];
    }

    protected gerarXml(data: NFe): string {
        return this.gerarXmlNFeAutorizacao(data);
    }

    protected salvaArquivos(xmlConsulta: string, responseInJson: GenericObject, xmlRetorno: AxiosResponse<any, any>, options?: Record<string, any>): GenericObject {

        // Recupera configuração do ambiente para verificar se os arquivos gerados serão gravados em disco
        const config = this.environment.getConfig();
        let dateAndTimeInFileName = config.dfe.incluirTimestampNoNomeDosArquivos;

        const createFileName = (prefix: string | undefined, includeMethodName?: boolean) => {
            const dtaTime = dateAndTimeInFileName ? `-${format(new Date(), 'dd-MM-yyyy-HHmm')}` : '';

            const baseFileName = includeMethodName ? `${this.metodo}` : '';
            const prefixPart = prefix ? includeMethodName ? `-${prefix}` : `${prefix}` : '';
            const nfePart = responseInJson.chNFe ? `-${responseInJson.chNFe}` : '';
            const dateTimePart = dtaTime;

            return `${baseFileName}${prefixPart}${nfePart}${dateTimePart}`;
        }

        const salvarArquivo = (data: any, prefix: string | undefined, path: string | undefined, fileType: 'xml' | 'json', includeMethodName?: boolean) => {
            const fileName = createFileName(prefix, includeMethodName);
            const method = fileType === 'xml' ? 'salvaXML' : 'salvaJSON';

            this.utility[method]({
                data: data,
                fileName,
                metodo: this.metodo,
                path,
            });
        };

        let chNFe = ''
        let xmlAutorizacaoInJson: GenericObject = {} as GenericObject;
        let xMotivoPorXml: GenericObject[] = [];
        let xmlsInJson: GenericObject[] = [];
        if (options) {
            const { xmlAutorizacao } = options;

            const json = new XmlParser();

            for (let i = 0; i < xmlAutorizacao.length; i++) {
                xmlAutorizacaoInJson = json.convertXmlToJson(xmlAutorizacao[i], 'NFEAutorizacaoFinal');
                xmlsInJson.push(xmlAutorizacaoInJson);

                const chNFe = xmlAutorizacaoInJson.protNFe.infProt.chNFe;
                const xMotivo = xmlAutorizacaoInJson.protNFe.infProt.xMotivo;
                const cStat = xmlAutorizacaoInJson.protNFe.infProt.cStat;
                xMotivoPorXml.push({
                    chNFe,
                    xMotivo,
                    cStat,
                })

                if (config.dfe.armazenarXMLAutorizacao) {
                    salvarArquivo(xmlAutorizacao[i], chNFe, config.dfe.pathXMLAutorizacao, 'xml', false);
                    salvarArquivo(xmlAutorizacaoInJson, chNFe, config.dfe.pathXMLAutorizacao, 'json', false);
                }
            }

            return {
                success: true,
                xMotivo: xMotivoPorXml,
                response: xmlsInJson,
            }
        }
        return {
            success: true,
            xMotivo: xMotivoPorXml,
            response: xmlsInJson,
        }
    }

    private async trataRetorno(xmlRetorno: string, indSinc: number, responseInJson: GenericObject) {
        try {
            /**
             * Captura o valor nRec e protNFe
             */
            const { nRec, protNFe } = this.utility.getProtNFe(xmlRetorno);

            /**
             * 0 - assíncrona
             * 1 - síncrona
             */
            let tipoEmissao = 0;
            if (indSinc === 1 && protNFe) {
                tipoEmissao = 1;
            }

            const nfeRetornoAutService = new NFERetornoAutorizacaoService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta);
            const nfeRetornoAut = new NFERetornoAutorizacao(nfeRetornoAutService);
    
            await new Promise(resolve => setTimeout(resolve, Number(responseInJson.infRec.tMed) * 1000));

            const retorno = await nfeRetornoAut.getXmlRetorno({
                tipoEmissao,
                nRec,
                protNFe,
                xmlNFe: this.xmlNFe
            });

            return retorno;
        } catch (error: any) {
            throw new Error(error.message)
        }
    }

    /**
     * Método utilitário para criação do XML a partir de um Objeto
     */


    private anoMesEmissao(dhEmi: string) {
        // Lógica para obter o ano e mês de emissão (AAMM)
        const dataAtual = new Date(dhEmi);
        const ano = dataAtual.getFullYear().toString().slice(-2);
        const mes = (dataAtual.getMonth() + 1).toString().padStart(2, '0');

        return ano + mes;
    }

    private gerarCodigoNumerico() {
        // Lógica para gerar um código numérico aleatório de 8 dígitos
        return Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
    }

    private calcularModulo11(sequencia: string) {
        const pesos = [4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

        let somatoria = 0;

        for (let i = 0; i < sequencia.length; i++) {
            somatoria += parseInt(sequencia.charAt(i)) * pesos[i];
        }

        const restoDivisao = somatoria % 11;
        const digitoVerificador = restoDivisao === 0 || restoDivisao === 1 ? 0 : 11 - restoDivisao;

        return digitoVerificador;
    }

    private calcularDigitoVerificador(data: LayoutNFe) {
        const {
            infNFe: {
                ide: { cUF, mod, serie, nNF, tpEmis, cNF, dhEmi },
                emit: { CNPJCPF }
            }
        } = data;

        const anoMes = this.anoMesEmissao(dhEmi);

        // Montando a sequência para o cálculo do dígito verificador
        const sequencia = `${cUF}${anoMes}${CNPJCPF}${mod}${String(serie).padStart(3, '0')}${String(nNF).padStart(9, '0')}${tpEmis}${cNF}`;

        // Calculando o dígito verificador
        const dv = this.calcularModulo11(sequencia);

        // Montando a chave de acesso
        const chaveAcesso = `NFe${sequencia}` + dv;
        this.chaveNfe = `${sequencia}${dv}`;

        return {
            chaveAcesso,
            dv
        };
    }

    private validaDocumento(doc: string, campo: string) {
        // Valida se CPF ou CNPJ
        const nfeAutorizacaoHandler = new ValidaCPFCNPJ();
        const { documentoValido, tipoDoDocumento } = nfeAutorizacaoHandler.validarCpfCnpj(doc);

        if (!documentoValido || tipoDoDocumento === 'Desconhecido') {
            const message = tipoDoDocumento === 'Desconhecido'
                ? `Documento do ${campo} ausente ou inválido`
                : `${tipoDoDocumento} do ${campo} é inválido`
            throw new Error(message);
        }

        return tipoDoDocumento;
    }

    private gerarXmlNFeAutorizacao(data: NFe) {
        const createXML = (NFe: LayoutNFe) => {
            // Verificando se existe mais de um produto
            if (NFe?.infNFe?.det instanceof Array) {
                // Adicionando indice ao item
                const formatedItens = NFe.infNFe.det.map((det, index) => {
                    if (det.imposto.ICMS.dadosICMS) {
                        const icms = mountICMS(det.imposto.ICMS.dadosICMS);
                        det.imposto.ICMS = icms;
                    }
                    if (det.imposto.PIS.dadosPIS) {
                        const pis = mountPIS(det.imposto.PIS.dadosPIS);
                        det.imposto.PIS = pis;
                    }
                    if (det.imposto.COFINS.dadosCOFINS) {
                        const cofins = mountCOFINS(det.imposto.COFINS.dadosCOFINS);
                        det.imposto.COFINS = cofins
                    }
                    return {
                        $: {
                            nItem: index + 1,
                        },
                        ...det,
                    };
                });
                NFe.infNFe.det = formatedItens;
            }

            // Cria chave da nota e grava digito verificador
            const { chaveAcesso, dv } = this.calcularDigitoVerificador(NFe);

            NFe.infNFe.ide.cDV = dv;
            NFe.infNFe.ide.verProc = NFe.infNFe.ide.verProc || '1.0.0.0';

            // Valida Documento do emitente
            NFe.infNFe.emit = Object.assign({ [this.validaDocumento(String(NFe.infNFe.emit.CNPJCPF), 'emitente')]: NFe.infNFe.emit.CNPJCPF }, NFe.infNFe.emit)
            delete NFe.infNFe.emit.CNPJCPF;
            // Valida Documento do destinatário
            if (NFe.infNFe.dest) {
                NFe.infNFe.dest = Object.assign({ [this.validaDocumento(String(NFe.infNFe.dest?.CNPJCPF || ''), 'destinatário')]: NFe.infNFe.dest?.CNPJCPF || '' }, NFe.infNFe.dest)
                delete NFe.infNFe.dest.CNPJCPF;
            }
            // Valida Documento do transportador
            if (NFe.infNFe.transp.transporta) {
                NFe.infNFe.transp.transporta = Object.assign({ [this.validaDocumento(String(NFe.infNFe.transp.transporta?.CNPJCPF), 'transportador')]: NFe.infNFe.transp.transporta?.CNPJCPF }, NFe.infNFe.transp.transporta)
                delete NFe.infNFe.transp.transporta?.CNPJCPF;
            }

            // Valida Documento do produtor rural
            if (NFe.infNFe?.NFref instanceof Array) {
                const NFrefArray = NFe.infNFe.NFref;
                if (NFrefArray && NFrefArray.length > 0) {
                    NFe.infNFe.NFref = NFrefArray.map(NFref => {
                        if (NFref.refNFP) {
                            NFref.refNFP = Object.assign(
                                { [this.validaDocumento(String(NFref.refNFP.CNPJCPF), 'produtor rural')]: NFref.refNFP.CNPJCPF },
                                NFref.refNFP
                            );
                            delete NFref.refNFP.CNPJCPF;
                        }
                        return NFref;
                    });
                }
            } else {
                if (NFe.infNFe.NFref && NFe.infNFe.NFref.refNFP) {
                    NFe.infNFe.NFref.refNFP = Object.assign(
                        { [this.validaDocumento(String(NFe.infNFe.NFref.refNFP.CNPJCPF), 'produtor rural')]: NFe.infNFe.NFref.refNFP.CNPJCPF },
                        NFe.infNFe.NFref.refNFP
                    )
                }
            }

            // Caso Seja hambiente de homologação
            if (NFe.infNFe.dest) {
                if (NFe.infNFe.ide.tpAmb === 2) {
                    NFe.infNFe.dest.xNome = 'NF-E EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL';
                }
            }

            const xmlObject = {
                $: {
                    xmlns: 'http://www.portalfiscal.inf.br/nfe'
                },
                infNFe: {
                    $: {
                        versao: "4.00",
                        Id: chaveAcesso,
                    },
                    ...NFe.infNFe
                }
            }

            const eventoXML = this.xmlBuilder.gerarXml(xmlObject, 'NFe')
            const xmlAssinado = this.xmlBuilder.assinarXML(eventoXML, 'infNFe')
            this.xmlNFe.push(xmlAssinado);
        }

        if (data.NFe instanceof Array) {
            for (let i = 0; i < data.NFe.length; i++) {
                const NFe = data.NFe[i];
                createXML(NFe);
            }
        } else {
            createXML(data.NFe);
        }

        // Base do XML
        const baseXML = {
            $: {
                versao: "4.00",
                xmlns: 'http://www.portalfiscal.inf.br/nfe'
            },
            idLote: data.idLote,
            indSinc: data.indSinc,
            _: '[XML]'
        }

        // Gera base do XML
        const xml = this.xmlBuilder.gerarXml(baseXML, 'enviNFe')

        return xml.replace('[XML]', this.xmlNFe.join(''));
    }

    public async Exec(data: NFe): Promise<{
        success: boolean;
        xMotivo: GenericObject;
        xmls: {
            NFe: LayoutNFe;
            protNFe: ProtNFe
        }[];
    }> {
        let xmlConsulta = '';
        let soapXML = '';
        try {
            // Gerando XML para consulta de Status do Serviço
            xmlConsulta = this.gerarXmlNFeAutorizacao(data);

            const { xmlFormated, agent, webServiceUrl, action } = await this.gerarConsulta.gerarConsulta(xmlConsulta, this.metodo);

            soapXML = xmlFormated

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
            /**
             * Verifica se houve rejeição no processamento do lote
             */
            const responseInJson = this.utility.verificaRejeicao(xmlRetorno.data, this.metodo);

            // Salva XML de Retorno
            this.utility.salvaRetorno(xmlRetorno.data, responseInJson, this.metodo);

            const retorno = await this.trataRetorno(xmlRetorno.data, data.indSinc, responseInJson);

            const xmlFinal = this.salvaArquivos(xmlConsulta, responseInJson, xmlRetorno.data,
                {
                    xmlAutorizacao: retorno.data,
                    xMotivo: retorno.message
                })

            return {
                success: true,
                xMotivo: xmlFinal.xMotivo,
                xmls: xmlFinal.response,
            }

        } catch (error: any) {
            // Salva XML de Consulta
            this.utility.salvaConsulta(xmlConsulta, soapXML, this.metodo);
            throw new Error(error.message)
        }
    }
}

export default NFEAutorizacaoService;