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
import { TP_EMIS, TP_EMIS_CONTINGENCIA } from '../util/CTeContingencia.js';
import { gerarQrCodeCTe } from '../util/CTeQrCode.js';

const METHOD_NAME = 'CTeAutorizacao';

/** Campos iniciais de `ide`, na ordem do schema (idêntica em CT-e 57, OS, GTV-e e Simplificado). */
const ORDEM_INICIAL_IDE = ['cUF', 'cCT', 'CFOP', 'natOp', 'mod', 'serie', 'nCT', 'dhEmi', 'tpImp', 'tpEmis', 'cDV', 'tpAmb', 'tpCTe', 'procEmi', 'verProc'];

const emSvc = (tpEmis: number) => tpEmis === TP_EMIS.SVC_RS || tpEmis === TP_EMIS.SVC_SP;

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
    /** Tag raiz do XML assinado (`CTe`, `CTeOS`, `GTVe`, `CTeSimp`). */
    protected rootTag = 'CTe';
    /** Modelo do documento usado na chave de acesso quando `ide.mod` não é informado. */
    protected modeloPadrao: number | string = 57;

    constructor(environment: Environment, utility: Utility, xmlBuilder: XmlBuilder, axios: AxiosInstance, saveFiles: SaveFilesImpl, gerarConsulta: GerarConsultaImpl, metodo: string = METHOD_NAME) {
        super(environment, utility, xmlBuilder, metodo, axios, saveFiles, gerarConsulta);
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
        const mod = ide.mod ?? this.modeloPadrao;
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
    protected normalizaParticipante<T extends { CNPJCPF?: string; CNPJ?: string; CPF?: string }>(participante: T, campo: string): T {
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

    protected static readonly TEXTO_HOMOLOGACAO = 'CTE EMITIDO EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL';

    /**
     * Valida/normaliza os documentos dos participantes do CT-e modelo 57. Subclasses de outros
     * documentos (CT-e OS, GTV-e, Simplificado) sobrescrevem com os participantes do seu leiaute.
     */
    protected normalizarParticipantes(infCte: LayoutCTe['infCte']): void {
        if (infCte.rem) infCte.rem = this.normalizaParticipante(infCte.rem, 'remetente');
        if (infCte.dest) infCte.dest = this.normalizaParticipante(infCte.dest, 'destinatário');
        if (infCte.exped) infCte.exped = this.normalizaParticipante(infCte.exped, 'expedidor');
        if (infCte.receb) infCte.receb = this.normalizaParticipante(infCte.receb, 'recebedor');
        if (infCte.ide.toma4) infCte.ide.toma4 = this.normalizaParticipante(infCte.ide.toma4, 'tomador');
    }

    /**
     * Em homologação o MOC exige a razão social (xNome) de cada participante existente
     * igual a "CTE EMITIDO EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL" (modelo 57: rem, exped, receb e dest).
     */
    protected aplicarTextoHomologacao(infCte: LayoutCTe['infCte']): void {
        for (const participante of [infCte.rem, infCte.exped, infCte.receb, infCte.dest]) {
            if (participante) participante.xNome = CTEAutorizacaoService.TEXTO_HOMOLOGACAO;
        }
    }

    /**
     * Contingência: dhCont e xJust são obrigatórios (e só nela). Nas SVC, o tpEmis precisa corresponder
     * à SVC da UF do emitente (7=SVC-RS para SP/MT/MS; 8=SVC-SP para as demais).
     */
    protected validarContingencia(ide: LayoutCTe['infCte']['ide']): void {
        const tpEmis = Number(ide.tpEmis ?? TP_EMIS.NORMAL);
        const emContingencia = TP_EMIS_CONTINGENCIA.includes(tpEmis);

        if (emContingencia && (!ide.dhCont || !ide.xJust)) {
            throw new Error(`Emissão em contingência (tpEmis=${tpEmis}) exige dhCont e xJust em ide.`);
        }
        if (tpEmis === TP_EMIS.NORMAL && (ide.dhCont || ide.xJust)) {
            throw new Error('dhCont e xJust não devem ser informados na emissão normal (tpEmis=1).');
        }
        if (tpEmis === TP_EMIS.SVC_RS || tpEmis === TP_EMIS.SVC_SP) {
            const esperado = this.utility.getSvcCTe() === 'SVC-RS' ? TP_EMIS.SVC_RS : TP_EMIS.SVC_SP;
            if (tpEmis !== esperado) {
                throw new Error(`A UF do emitente é atendida pela ${this.utility.getSvcCTe()}: use tpEmis=${esperado}.`);
            }
        }
    }

    /**
     * Texto do QR Code (`infCTeSupl/qrCodCTe`). Em contingência FS-DA/EPEC a chave é assinada
     * com o certificado do emitente (`sign`), conforme o MOC.
     */
    protected gerarQrCode(chCTe: string, tpAmb: number | string, tpEmis: number): string {
        const url = this.utility.getWebServiceUrl('CTeQrCode', false, CTE_VERSAO, 'CTe');
        const assina = tpEmis === TP_EMIS.EPEC || tpEmis === TP_EMIS.FSDA;
        return gerarQrCodeCTe({ url, chCTe, tpAmb, privateKey: assina ? this.environment.getCertKey() : undefined });
    }

    /**
     * Campos calculados pela lib (cDV, cCT, mod, tpEmis, verProc) podem não vir no payload e seriam
     * acrescentados ao fim de `ide`; o schema exige a sequência, então reposiciona os campos iniciais.
     */
    private ordenarIde<T extends object>(ide: T): T {
        const origem = ide as Record<string, any>;
        const ordenado: Record<string, any> = {};
        for (const chave of ORDEM_INICIAL_IDE) {
            if (chave in origem) ordenado[chave] = origem[chave];
        }
        for (const chave of Object.keys(origem)) {
            if (!(chave in ordenado)) ordenado[chave] = origem[chave];
        }
        return ordenado as T;
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

        this.validarContingencia(cte.infCte.ide);

        const { chaveAcesso, dv } = this.calcularDigitoVerificador(cte);

        cte.infCte.ide.cDV = dv;
        cte.infCte.ide.verProc = cte.infCte.ide.verProc || '1.0.0.0';
        cte.infCte.ide = this.ordenarIde(cte.infCte.ide);
        delete cte.infCte.Id;

        // Valida documento do emitente (sempre obrigatório)
        const emitDoc = (cte.infCte.emit as any).CNPJCPF || cte.infCte.emit.CNPJ || cte.infCte.emit.CPF;
        cte.infCte.emit = this.normalizaParticipante(Object.assign({ CNPJCPF: emitDoc }, cte.infCte.emit), 'emitente');

        this.normalizarParticipantes(cte.infCte);

        if (String(cte.infCte.ide.tpAmb) === '2') {
            this.aplicarTextoHomologacao(cte.infCte);
        }

        const qrCodCTe = cte.infCTeSupl?.qrCodCTe
            || this.gerarQrCode(chaveAcesso.replace('CTe', ''), cte.infCte.ide.tpAmb, Number(cte.infCte.ide.tpEmis));

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
            },
            infCTeSupl: { qrCodCTe },
        };

        const cteXML = this.xmlBuilder.gerarXml(xmlObject, this.rootTag, this.metodo);
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
                emSvc(Number(cte.infCte.ide.tpEmis)) ? 'CTeSVC' : 'CTe',
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

    async Exec(data: CTe | string | any): Promise<CTeAutorizacaoResultado<any>> {
        const dataAsJson = this.converterParaJson(data);
        const ctes = Array.isArray(dataAsJson.CTe) ? dataAsJson.CTe : [dataAsJson.CTe];
        return this.autorizar(ctes);
    }

    /**
     * Transmite ao autorizador normal os CT-e emitidos em contingência EPEC (tpEmis=4) ou FS-DA (tpEmis=5),
     * após o restabelecimento do serviço. CT-e de SVC (7/8) já são autorizados na própria SVC via `Exec`.
     */
    async ExecTransmitirContingencia(data: CTe | string | any): Promise<CTeAutorizacaoResultado<any>> {
        const dataAsJson = this.converterParaJson(data);
        const ctes = Array.isArray(dataAsJson.CTe) ? dataAsJson.CTe : [dataAsJson.CTe];

        for (const cte of ctes) {
            const tpEmis = Number(cte.infCte.ide.tpEmis);
            if (tpEmis !== TP_EMIS.EPEC && tpEmis !== TP_EMIS.FSDA) {
                throw new Error(`CTE_TransmitirContingencia: tpEmis=${tpEmis} inválido. Use apenas tpEmis=4 (EPEC) ou tpEmis=5 (FS-DA).`);
            }
        }
        return this.autorizar(ctes);
    }

    protected async autorizar<T = LayoutCTe>(ctes: T[]): Promise<CTeAutorizacaoResultado<T>> {
        const resultados: CTeAutorizacaoResultadoItem<T>[] = [];
        for (const cte of ctes) {
            resultados.push(await this.autorizarUmCTe(cte as unknown as LayoutCTe) as unknown as CTeAutorizacaoResultadoItem<T>);
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
