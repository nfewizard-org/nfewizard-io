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
import pako from 'pako';
import { Environment, Utility, XmlBuilder, XmlParser, ValidaCPFCNPJ, BaseNFE, logger } from '@nfewizard/shared';
import { GerarConsultaImpl, SaveFilesImpl, CTEAutorizacaoServiceImpl } from '@nfewizard/types/shared';
import { CTe, CTeAutorizacaoResultado, CTeAutorizacaoResultadoItem, LayoutCTe } from '@nfewizard/types/cte';
import { CTE_VERSAO } from '../util/CTEBaseService.js';

const METHOD_NAME = 'CTeAutorizacao';

/**
 * Autorização do CT-e de Transporte de Carga (modelo 57).
 *
 * Diferenças relevantes em relação à `NFEAutorizacaoService` (NF-e):
 *  - O serviço `CTeRecepcaoSincV4` é síncrono e recebe **um único CT-e por chamada**
 *    (não há envelope de lote como o `enviNFe`/`idLote` da NF-e). Quando `data.CTe`
 *    é um array, cada CT-e é transmitido em uma chamada separada e sequencial.
 *  - A mensagem enviada em `cteDadosMsg` é o XML assinado comprimido em GZip e
 *    convertido para Base64 (MOC item 9.1), diferente dos demais serviços de CT-e
 *    (Status, Consulta, Evento), que trafegam XML puro sem compactação.
 */
export class CTEAutorizacaoService extends BaseNFE implements CTEAutorizacaoServiceImpl {
    constructor(environment: Environment, utility: Utility, xmlBuilder: XmlBuilder, axios: AxiosInstance, saveFiles: SaveFilesImpl, gerarConsulta: GerarConsultaImpl) {
        super(environment, utility, xmlBuilder, METHOD_NAME, axios, saveFiles, gerarConsulta);
    }

    private converterParaJson(data: CTe | string): CTe {
        return typeof data === 'string'
            ? { CTe: new XmlParser().convertXmlCteProcToJson(data).data.CTe as LayoutCTe }
            : data;
    }

    private anoMesEmissao(dhEmi: string): string {
        const match = String(dhEmi).match(/^(\d{4})-(\d{2})/);
        if (match) return match[1].slice(-2) + match[2];
        const dataAtual = new Date(dhEmi);
        const ano = dataAtual.getUTCFullYear().toString().slice(-2);
        const mes = (dataAtual.getUTCMonth() + 1).toString().padStart(2, '0');
        return ano + mes;
    }

    private gerarCodigoNumerico(): string {
        return Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
    }

    private calcularModulo11(sequencia: string): number {
        const pesos = [4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

        let somatoria = 0;
        for (let i = 0; i < sequencia.length; i++) {
            somatoria += parseInt(sequencia.charAt(i)) * pesos[i];
        }

        const restoDivisao = somatoria % 11;
        return restoDivisao === 0 || restoDivisao === 1 ? 0 : 11 - restoDivisao;
    }

    private calcularDigitoVerificador(cte: LayoutCTe): { chaveAcesso: string; dv: number } {
        const { infCte } = cte;
        const { Id, ide, emit } = infCte;

        if (Id) {
            this.chaveNfe = Id;
            return {
                chaveAcesso: `CTe${Id}`,
                dv: parseInt(Id.charAt(Id.length - 1), 10),
            };
        }

        const cUF = ide.cUF;
        const mod = ide.mod ?? 57;
        const serie = ide.serie;
        const nCT = ide.nCT;
        const tpEmis = ide.tpEmis ?? 1;
        const CNPJCPF = (emit as any).CNPJCPF || emit.CNPJ || emit.CPF;

        const anoMes = this.anoMesEmissao(ide.dhEmi);
        const cCT = ide.cCT || this.gerarCodigoNumerico();

        const sequencia = `${cUF}${anoMes}${CNPJCPF}${String(mod).padStart(2, '0')}${String(serie).padStart(3, '0')}${String(nCT).padStart(9, '0')}${tpEmis}${cCT}`;

        const dv = this.calcularModulo11(sequencia);
        const chaveAcesso = `CTe${sequencia}${dv}`;
        this.chaveNfe = `${sequencia}${dv}`;

        // Grava de volta o cCT/mod efetivamente utilizados (caso tenham sido gerados/normalizados)
        ide.cCT = cCT;
        ide.mod = mod;
        ide.tpEmis = tpEmis;

        return { chaveAcesso, dv };
    }

    private validaDocumento(doc: string, campo: string): 'CPF' | 'CNPJ' {
        const validador = new ValidaCPFCNPJ();
        const { documentoValido, tipoDoDocumento } = validador.validarCpfCnpj(doc);
        if (!documentoValido || tipoDoDocumento === 'Desconhecido') {
            const message = tipoDoDocumento === 'Desconhecido'
                ? `Documento do ${campo} ausente ou inválido`
                : `${tipoDoDocumento} do ${campo} é inválido`;
            throw new Error(message);
        }
        return tipoDoDocumento;
    }

    /**
     * Normaliza um participante do CT-e (emitente, remetente, destinatário, expedidor,
     * recebedor ou tomador) trocando o campo interno `CNPJCPF`/`CNPJ`/`CPF` pelo campo
     * correto (`CNPJ` ou `CPF`) exigido no XML, validando o documento informado.
     */
    private normalizaParticipante<T extends { CNPJCPF?: string; CNPJ?: string; CPF?: string }>(participante: T, campo: string): T {
        const documento = participante.CNPJCPF || participante.CNPJ || participante.CPF;
        if (!documento) return participante;

        const tipoDocumento = this.validaDocumento(String(documento), campo);
        const { CNPJCPF, CNPJ, CPF, ...resto } = participante as any;

        return {
            [tipoDocumento]: documento,
            ...resto,
        } as T;
    }

    private compactarXml(xml: string): string {
        const compressed = pako.gzip(xml);
        let binaryString = '';
        for (let i = 0; i < compressed.length; i++) {
            binaryString += String.fromCharCode(compressed[i]);
        }
        return btoa(binaryString);
    }

    /**
     * Monta e assina o XML de um único CT-e, mutando `cte` com os campos calculados
     * (`cDV`, `cCT`, `mod`, `verProc`) para que o objeto original reflita o que foi
     * efetivamente transmitido.
     */
    protected gerarXml(cte: LayoutCTe): string {
        logger.info('Montando estrutura do XML em JSON', {
            context: 'CTEAutorizacaoService',
        });

        const { chaveAcesso, dv } = this.calcularDigitoVerificador(cte);

        cte.infCte.ide.cDV = dv;
        cte.infCte.ide.verProc = cte.infCte.ide.verProc || '1.0.0.0';
        delete cte.infCte.Id;

        // Valida documento do emitente (sempre obrigatório)
        const emitDoc = (cte.infCte.emit as any).CNPJCPF || cte.infCte.emit.CNPJ || cte.infCte.emit.CPF;
        cte.infCte.emit = this.normalizaParticipante(Object.assign({ CNPJCPF: emitDoc }, cte.infCte.emit), 'emitente');

        // Valida documentos dos demais participantes (opcionais conforme o modal/serviço)
        if (cte.infCte.rem) cte.infCte.rem = this.normalizaParticipante(cte.infCte.rem, 'remetente');
        if (cte.infCte.dest) cte.infCte.dest = this.normalizaParticipante(cte.infCte.dest, 'destinatário');
        if (cte.infCte.exped) cte.infCte.exped = this.normalizaParticipante(cte.infCte.exped, 'expedidor');
        if (cte.infCte.receb) cte.infCte.receb = this.normalizaParticipante(cte.infCte.receb, 'recebedor');
        if (cte.infCte.ide.toma4) cte.infCte.ide.toma4 = this.normalizaParticipante(cte.infCte.ide.toma4, 'tomador');

        // Ambiente de homologação: texto obrigatório de identificação (destinatário, ou tomador quando não há destinatário próprio)
        if (String(cte.infCte.ide.tpAmb) === '2') {
            const textoHomologacao = 'CTE EMITIDO EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL';
            if (cte.infCte.dest) cte.infCte.dest.xNome = textoHomologacao;
            else if (cte.infCte.ide.toma4) cte.infCte.ide.toma4.xNome = textoHomologacao;
        }

        const xmlObject = {
            $: {
                xmlns: 'http://www.portalfiscal.inf.br/cte'
            },
            infCte: {
                $: {
                    versao: CTE_VERSAO,
                    Id: chaveAcesso,
                },
                ...cte.infCte
            }
        };

        const cteXML = this.xmlBuilder.gerarXml(xmlObject, 'CTe', this.metodo);
        return this.xmlBuilder.assinarXML(cteXML, 'infCte');
    }

    protected async callWebService(xmlConsulta: string, webServiceUrl: string, ContentType: string, action: string, agent: any): Promise<AxiosResponse<any, any>> {
        logger.http('Iniciando comunicação com o webservice', {
            context: 'CTEAutorizacaoService',
            method: this.metodo,
            url: webServiceUrl,
            action,
        });

        const response = await this.axios.post(webServiceUrl, xmlConsulta, {
            headers: { 'Content-Type': ContentType },
            httpsAgent: agent,
        });

        logger.http('Comunicação concluída com sucesso', {
            context: 'CTEAutorizacaoService',
            method: this.metodo,
        });

        return response;
    }

    private async autorizarUmCTe(cte: LayoutCTe): Promise<CTeAutorizacaoResultadoItem> {
        let xmlAssinado = '';
        let xmlCompactado = '';
        let xmlConsultaSoap = '';
        let responseInJson: any;
        let xmlRetorno: AxiosResponse<any, any> = {} as AxiosResponse<any, any>;
        const ContentType = this.setContentType();

        try {
            xmlAssinado = this.gerarXml(cte);
            xmlCompactado = this.compactarXml(xmlAssinado);

            const { xmlFormated, agent, webServiceUrl, action } = await this.gerarConsulta.gerarConsulta(
                xmlCompactado,
                this.metodo,
                false,
                CTE_VERSAO,
                'CTe',
                false,
                '',
                'cteDadosMsg'
            );

            xmlConsultaSoap = xmlFormated;

            xmlRetorno = await this.callWebService(xmlFormated, webServiceUrl, ContentType, action, agent);

            responseInJson = this.utility.verificaRejeicao(xmlRetorno.data, this.metodo);

            return {
                CTe: cte,
                protCTe: responseInJson?.protCTe,
                xmlAssinado,
            };
        } finally {
            this.utility.salvaConsulta(xmlAssinado, xmlConsultaSoap, this.metodo);
            this.utility.salvaRetorno(xmlRetorno.data, responseInJson, this.metodo);
        }
    }

    async Exec(data: CTe | string): Promise<CTeAutorizacaoResultado> {
        const dataAsJson = this.converterParaJson(data);
        const ctes = Array.isArray(dataAsJson.CTe) ? dataAsJson.CTe : [dataAsJson.CTe];

        const resultados: CTeAutorizacaoResultadoItem[] = [];
        for (const cte of ctes) {
            resultados.push(await this.autorizarUmCTe(cte));
        }

        const xMotivo = resultados.map(r => ({
            chCTe: r.protCTe?.infProt?.chCTe,
            cStat: r.protCTe?.infProt?.cStat,
            xMotivo: r.protCTe?.infProt?.xMotivo,
        }));

        const success = resultados.every(r => String(r.protCTe?.infProt?.cStat) === '100');

        logger.info('CT-e transmitido(s)', {
            context: 'CTEAutorizacaoService',
        });

        return { success, xMotivo, xmls: resultados };
    }
}

export default CTEAutorizacaoService;
