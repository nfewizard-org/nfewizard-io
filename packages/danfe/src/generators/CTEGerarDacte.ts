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
import bwipjs from 'bwip-js';
import fs from 'fs';
import {
    CompCTe,
    CTEGerarDacteProps,
    ComplCTe,
    DestCTe,
    EmitCTe,
    EnderCTe,
    ExpedCTe,
    ICMSCTe,
    IdeCTe,
    ImpCTe,
    InfCarga,
    InfCTeNorm,
    InfCTeSupl,
    InfDocCTe,
    InfModal,
    InfNFCTe,
    InfNFeCTe,
    InfOutrosCTe,
    InfQ,
    ObsCTe,
    OccCTe,
    ProtCTe,
    RecebCTe,
    RemCTe,
    VPrest,
} from '@nfewizard/types/cte';
import { format, parseISO } from 'date-fns';
import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { ValidaCPFCNPJ } from '@nfewizard/shared';

/** Largura útil da página A4 descontadas as margens (595.28 - 22.68 - 5.67). */
const LARGURA_UTIL = 566.93;
/** Topo do rodapé fixo (observações / modal / uso exclusivo). */
const TOPO_RODAPE = 700;
/** Topo da tabela de documentos originários na primeira página. */
const TOPO_DOCUMENTOS = 601;
/** Topo da tabela de documentos originários nas demais páginas. */
const TOPO_DOCUMENTOS_CONTINUACAO = 195;
/** Altura de cada linha da tabela de documentos originários. */
const ALTURA_LINHA_DOCUMENTO = 11;

/** Participante do CT-e já normalizado para impressão. */
type ParticipanteDacte = {
    xNome: string;
    documento: string;
    IE: string;
    endereco: string;
    municipio: string;
    UF: string;
    CEP: string;
    pais: string;
    fone: string;
};

/** Documento originário (NF-e, NF em papel ou outros) normalizado para a tabela. */
type DocumentoOriginario = {
    tipo: string;
    documentoEmitente: string;
    serieNumero: string;
    chave: string;
};

/** Opções de renderização de um campo (retângulo + rótulo + conteúdo). */
type CampoOptions = {
    align?: 'left' | 'center' | 'right';
    fontSize?: number;
    labelSize?: number;
    valueTop?: number;
    multiline?: boolean;
    bold?: boolean;
};

const DESCRICAO_MODAL: Record<string, string> = {
    '01': 'RODOVIÁRIO',
    '02': 'AÉREO',
    '03': 'AQUAVIÁRIO',
    '04': 'FERROVIÁRIO',
    '05': 'DUTOVIÁRIO',
    '06': 'MULTIMODAL',
};

const DESCRICAO_TIPO_CTE: Record<string, string> = {
    '0': '0 - NORMAL',
    '1': '1 - COMPLEMENTO DE VALORES',
    '2': '2 - ANULAÇÃO DE VALORES',
    '3': '3 - SUBSTITUTO',
};

const DESCRICAO_TIPO_SERVICO: Record<string, string> = {
    '0': '0 - NORMAL',
    '1': '1 - SUBCONTRATAÇÃO',
    '2': '2 - REDESPACHO',
    '3': '3 - REDESPACHO INTERMEDIÁRIO',
    '4': '4 - SERVIÇO VINCULADO A MULTIMODAL',
};

const DESCRICAO_UNIDADE_CARGA: Record<string, string> = {
    '00': 'M3',
    '01': 'KG',
    '02': 'TON',
    '03': 'UNIDADE',
    '04': 'LITROS',
    '05': 'MMBTU',
};

const DESCRICAO_TIPO_DOCUMENTO: Record<string, string> = {
    '00': 'DECLARAÇÃO',
    '10': 'DUTOVIÁRIO',
    '59': 'CF-e SAT',
    '65': 'NFC-e',
    '99': 'OUTROS',
};

const DESCRICAO_CST: Record<string, string> = {
    '00': '00 - TRIBUTAÇÃO NORMAL DO ICMS',
    '20': '20 - TRIBUTAÇÃO COM BC REDUZIDA',
    '40': '40 - ICMS ISENÇÃO',
    '41': '41 - ICMS NÃO TRIBUTADA',
    '45': '45 - ICMS ISENTO / NÃO TRIBUTADO',
    '51': '51 - ICMS DIFERIDO',
    '60': '60 - ICMS COBRADO POR ST',
    '90': '90 - ICMS OUTROS',
};

class CTeGerarDacte {
    data: CTEGerarDacteProps['data'];
    chave: string;
    enviada: boolean;
    outputPath: string;
    documento: ValidaCPFCNPJ;
    protCTe: ProtCTe | undefined;
    ide: IdeCTe;
    emit: EmitCTe;
    compl: ComplCTe | undefined;
    rem: RemCTe | undefined;
    exped: ExpedCTe | undefined;
    receb: RecebCTe | undefined;
    dest: DestCTe | undefined;
    vPrest: VPrest | undefined;
    imp: ImpCTe | undefined;
    infCTeNorm: InfCTeNorm | undefined;
    infCTeSupl: InfCTeSupl | undefined;
    totalPaginas: number;
    exibirMarcaDaguaDacte?: boolean;
    doc: InstanceType<typeof PDFDocument>;
    barcodeBuffer: Buffer | null = null;
    qrcodeBuffer: Buffer | null = null;

    constructor(props: CTEGerarDacteProps) {
        const { data, chave, outputPath } = props;

        this.data = data;
        this.chave = chave.trim();
        this.outputPath = outputPath;
        this.enviada = false;
        this.documento = new ValidaCPFCNPJ();
        this.protCTe = data.protCTe;

        const cteData = Array.isArray(data.CTe) ? data.CTe[0] : data.CTe;
        const { ide, emit, compl, rem, exped, receb, dest, vPrest, imp, infCTeNorm } = cteData.infCte;

        this.ide = ide;
        this.emit = emit;
        this.compl = compl;
        this.rem = rem;
        this.exped = exped;
        this.receb = receb;
        this.dest = dest;
        this.vPrest = vPrest;
        this.imp = imp;
        this.infCTeNorm = infCTeNorm;
        this.infCTeSupl = cteData.infCTeSupl;

        if (this.protCTe?.infProt.nProt) {
            this.enviada = true;
        }

        this.totalPaginas = this.calcularTotalPaginas(this.getDocumentosOriginarios().length);

        // Área útil ignorando margem à direita (22.68) e esquerda (5.67) = 566.93
        this.doc = new PDFDocument({
            margins: { top: 22, right: 22.68, bottom: 12, left: 5.67 },
            size: 'a4', // 595.28 * 841.89
            bufferPages: true,
            layout: 'portrait',
            font: 'Times-Roman',
        });
    }

    async generateBarcode(data: string): Promise<Buffer | null> {
        try {
            const pngBuffer = await bwipjs.toBuffer({
                bcid: 'code128',
                text: data,
                scaleX: 4,
                height: 14,
                includetext: false,
            });
            this.barcodeBuffer = pngBuffer; // Armazena o buffer na instância
            return pngBuffer; // Retorna o buffer
        } catch (err) {
            console.error('Erro ao gerar código de barras:', err);
            this.barcodeBuffer = null;
            return null;
        }
    }

    async generateQRCode(text: string): Promise<Buffer | null> {
        if (!text) {
            this.qrcodeBuffer = null;
            return null;
        }
        try {
            const pngBuffer = await QRCode.toBuffer(text, {
                color: {
                    dark: '#000000', // Cor do código
                    light: '#FFFFFF', // Cor de fundo
                },
                margin: 1,
                width: 300, // Largura da imagem
            });
            this.qrcodeBuffer = pngBuffer;
            return pngBuffer;
        } catch (err) {
            console.error('Erro ao gerar QR Code:', err);
            this.qrcodeBuffer = null;
            return null;
        }
    }

    setLineStyle(lineWidth: number, strokeColor: string) {
        this.doc.lineWidth(lineWidth).strokeColor(strokeColor).fill('black');
    }

    drawHeader(isFirstPage: boolean) {
        if (isFirstPage) {
            this._buildGuia();
            this._buildSeparator();
            this._buildHeader(52);
        } else {
            this._buildHeader(0);
        }
    }

    drawFooter() {
        this._buildFooter();
    }

    formatDecimal(value: string | number | undefined | null, minimumFractionDigits = 2, maximumFractionDigits = 2): string {
        const valueText = String(value ?? '0').trim();
        const normalizedValue = valueText.includes(',') ? valueText.replace(/\./g, '').replace(',', '.') : valueText;
        const parsedValue = parseFloat(normalizedValue);
        const numericValue = Number.isNaN(parsedValue) ? 0 : parsedValue;

        return numericValue.toLocaleString('pt-BR', {
            minimumFractionDigits,
            maximumFractionDigits,
        });
    }

    formatDate(value: string | undefined | null, mask = 'dd/MM/yyyy'): string {
        if (!value) {
            return '';
        }
        try {
            return format(parseISO(String(value)), mask);
        } catch {
            return String(value);
        }
    }

    /**
     * Quantidade de páginas necessárias para imprimir os documentos
     * originários. A primeira página tem menos espaço porque divide a
     * área útil com os demais blocos do DACTE.
     */
    calcularTotalPaginas(qtdDocumentos: number) {
        const linhasPrimeiraPagina = Math.floor((TOPO_RODAPE - 6 - (TOPO_DOCUMENTOS + ALTURA_LINHA_DOCUMENTO)) / ALTURA_LINHA_DOCUMENTO);
        const linhasDemaisPaginas = Math.floor((TOPO_RODAPE - 6 - (TOPO_DOCUMENTOS_CONTINUACAO + ALTURA_LINHA_DOCUMENTO)) / ALTURA_LINHA_DOCUMENTO);

        if (qtdDocumentos <= linhasPrimeiraPagina) {
            return 1;
        }
        return 1 + Math.ceil((qtdDocumentos - linhasPrimeiraPagina) / linhasDemaisPaginas);
    }

    /**
     * Desenha um campo do DACTE: retângulo, rótulo em fonte reduzida e
     * o conteúdo logo abaixo.
     */
    _campo(x: number, y: number, width: number, height: number, label: string, value: string, options: CampoOptions = {}) {
        const {
            align = 'left',
            fontSize = 7,
            labelSize = 5,
            valueTop = height >= 18 ? 9 : 7.6,
            multiline = false,
            bold = false,
        } = options;

        this.setLineStyle(0.75, '#1c1c1c');
        this.doc.rect(x, y, width, height).stroke();
        this.doc.font('Times-Roman').fontSize(labelSize).text(label, x + 3, y + 1.8, {
            characterSpacing: 0.4,
            width: width - 5,
            lineBreak: false,
            ellipsis: true,
        });
        this.doc.font(bold ? 'Times-Bold' : 'Times-Roman').fontSize(fontSize).text(value, x + 3.5, y + valueTop, {
            characterSpacing: 0.4,
            width: width - 6,
            align,
            lineBreak: multiline,
            ellipsis: !multiline,
            ...(multiline ? { height: height - valueTop - 1.5 } : {}),
        });
        this.doc.font('Times-Roman').fontSize(7);
    }

    /** Título de uma seção do DACTE, impresso acima dos retângulos do bloco. */
    _tituloSecao(top: number, titulo: string, x?: number) {
        const { left } = this.doc.page.margins;
        this.doc.font('Times-Bold').fontSize(6).fillColor('black').text(titulo, x ?? left, top, {
            characterSpacing: 0.5,
            lineBreak: false,
        });
        this.doc.font('Times-Roman');
    }

    _buildGuia() {
        const { top, left } = this.doc.page.margins;
        this.setLineStyle(0.75, '#1c1c1c');

        /** TOP LEFT */
        this.doc.rect(left, top, 470, 21).stroke();
        this.doc.fontSize(5).text('DECLARO QUE RECEBI OS VOLUMES DESTE CONHECIMENTO EM PERFEITO ESTADO PELO QUE DOU POR CUMPRIDO O PRESENTE CONTRATO DE TRANSPORTE', 10, 26, {
            characterSpacing: 0.5,
            width: 458,
            lineBreak: false,
            ellipsis: true,
        });
        this.doc.fontSize(6).text(`EMISSÃO: ${this.formatDate(this.ide.dhEmi)}  -  REMETENTE: ${this.rem?.xNome || ''}  -  VALOR TOTAL: R$ ${this.formatDecimal(this.vPrest?.vTPrest)}`, 10, 33.5, {
            characterSpacing: 0.5,
            width: 458,
            lineBreak: false,
            ellipsis: true,
        });
        /** RIGHT */
        this.doc.rect(left + 470, top, 96.93, 42).stroke();
        this.doc.fontSize(11).text('CT-e', 480, 27, {
            characterSpacing: 1.5,
            align: 'center',
        });
        this.doc.fontSize(8.8).font('Times-Bold').text(`Nº ${String(this.ide.nCT).padStart(2, '0')}`, 480, 40.5, {
            characterSpacing: 1.5,
            align: 'center',
        });
        this.doc.fontSize(8.5).font('Times-Roman').text(`SÉRIE ${String(this.ide.serie).padStart(3, '0')}`, 480, 53, {
            characterSpacing: 1.5,
            align: 'center',
        });
        /** BOTTON LEFT */
        this.doc.rect(left, top + 21, 75, 21).stroke();
        this.doc.fontSize(5).text('DATA DE RECEBIMENTO', 10, 46.5, {
            characterSpacing: 0.5,
        });
        /** BOTTON RIGHT */
        this.doc.rect(left + 75, top + 21, 395, 21).stroke();
        this.doc.fontSize(5).text('IDENTIFICAÇÃO E ASSINATURA DO RECEBEDOR', 75 + 10, 46.5, {
            characterSpacing: 0.5,
        });
    }

    _buildSeparator() {
        const { left, right } = this.doc.page.margins;
        const pageWidth = 595.28; // Largura da página A4 em pontos

        // Calcule a largura da linha, considerando as margens esquerda e direita
        const lineWidth = pageWidth - left - right;

        // Desenhe a linha
        this.doc.moveTo(left, 69) // Início da linha
            .lineTo(left + lineWidth, 69) // Fim da linha
            .lineWidth(1) // Espessura da linha
            .dash(1.5, { space: 1.5 }) // Estilo pontilhado
            .strokeColor('black') // Cor da linha
            .stroke(); // Desenhar a linha

        this.doc.undash();
    }

    _buildHeader(pos: number) {
        const { top, left } = this.doc.page.margins;
        const page = this.doc.bufferedPageRange();
        const documento = this.documento.mascaraCnpjCpf(this.emit.CNPJCPF || this.emit.CNPJ || this.emit.CPF || '');
        this.setLineStyle(0.75, '#1c1c1c');

        const topIdentificacao = top + pos;
        const enderEmit = this.emit.enderEmit || {};
        const identificacaoJoined = `\nCEP: ${enderEmit.CEP || ''} - ${enderEmit.xBairro || ''} - ${enderEmit.xMun || ''}/${enderEmit.UF || ''}\nCNPJ/CPF: ${documento} - IE: ${this.emit.IE || ''}`;

        /** IDENTIFICACAO EMITENTE */
        const _buildIdentificacaoEmit = () => {
            this.doc.rect(left, topIdentificacao, 197.5, 98).stroke();
            this.doc.fontSize(5).text('IDENTIFICAÇÃO DO EMITENTE', 10, topIdentificacao + 3.5, {
                characterSpacing: 0.5,
            });
            this.doc.fontSize(8).font('Times-Bold').text(this.emit.xNome, 12, topIdentificacao + 14, {
                characterSpacing: 1,
                width: 183,
                lineBreak: true,
                lineGap: 3,
            });
            this.doc.fontSize(6.5).font('Times-Roman').text(`${enderEmit.xLgr || ''}, ${enderEmit.nro || ''}${enderEmit.xCpl ? ` - ${enderEmit.xCpl}` : ''}`, 10, topIdentificacao + 44, {
                characterSpacing: 0.8,
                width: 183,
                lineBreak: true,
                lineGap: 2,
                continued: true,
            }).text(identificacaoJoined);
        };

        /** IDENTIFICACAO DACTE */
        const _buildIdentificacaoDacte = () => {
            const x = left + 197.5;
            const largura = 112.7;
            this.doc.rect(x, topIdentificacao, largura, 98).stroke();
            this.doc.fontSize(12).font('Times-Bold').text('DACTE', x, topIdentificacao + 4, {
                characterSpacing: 1.5,
                width: largura,
                align: 'center',
            });
            this.doc.fontSize(5).font('Times-Roman').text('Documento Auxiliar do Conhecimento de Transporte Eletrônico', x + 6, topIdentificacao + 19, {
                characterSpacing: 0.4,
                width: largura - 12,
                align: 'center',
                lineGap: 1,
            });

            /** MODELO / SÉRIE / NÚMERO / FL */
            this._campo(x, topIdentificacao + 38, 30, 15, 'MODELO', String(this.ide.mod || '57'), { align: 'center', fontSize: 6.5 });
            this._campo(x + 30, topIdentificacao + 38, 23, 15, 'SÉRIE', String(this.ide.serie ?? ''), { align: 'center', fontSize: 6.5 });
            this._campo(x + 53, topIdentificacao + 38, 36.7, 15, 'NÚMERO', String(this.ide.nCT ?? ''), { align: 'center', fontSize: 6.5 });
            this._campo(x + 89.7, topIdentificacao + 38, 23, 15, 'FL', `${page.count}/${this.totalPaginas}`, { align: 'center', fontSize: 6.5 });

            this._campo(x, topIdentificacao + 53, largura, 15, 'DATA E HORA DE EMISSÃO', this.formatDate(this.ide.dhEmi, 'dd/MM/yyyy HH:mm:ss'), { align: 'center', fontSize: 6.5 });
            this._campo(x, topIdentificacao + 68, largura, 15, 'MODAL', this.getDescricaoModal(), { align: 'center', fontSize: 6.5 });
            this._campo(x, topIdentificacao + 83, largura, 15, 'TIPO DO CT-E', this.getDescricaoTipoCTe(), { align: 'center', fontSize: 6 });
        };

        /** IDENTIFICACAO CT-e (Barcode, Chave e Protocolo) */
        const _buildIdentificacaoCTe = () => {
            const x = left + 310.2;
            const largura = 256.73;

            this.setLineStyle(0.75, '#1c1c1c');
            this.doc.rect(x, topIdentificacao, largura, 35).stroke();
            if (this.barcodeBuffer) { // Verifica se o buffer do barcode existe
                this.doc.image(this.barcodeBuffer, x + 13.3, topIdentificacao + 3, { width: 230, height: 30 });
            } else {
                this.doc.fontSize(8).fillColor('red').text('Erro ao carregar barcode', x + 6, topIdentificacao + 12, {
                    width: largura, align: 'center',
                });
            }

            if (Number(this.ide.tpAmb) !== 2 && !this.enviada && !this.data.forceTransmitida) {
                this.doc.fontSize(14).font('Times-Bold').fillColor('red').text('CT-E NÃO ENVIADO PARA SEFAZ', x + 6, topIdentificacao + 12, {
                    characterSpacing: 1,
                    width: largura,
                });
            }
            this.setLineStyle(0.75, '#1c1c1c');
            this.doc.font('Times-Roman');

            this.doc.rect(x, topIdentificacao + 35, largura, 23).stroke();
            this.doc.fontSize(5).text('CHAVE DE ACESSO', x + 4, topIdentificacao + 38, {
                characterSpacing: 0.5,
            });
            this.doc.fontSize(6).text(this.chave, x, topIdentificacao + 47, {
                characterSpacing: 1,
                width: largura,
                align: 'center',
            });

            this.doc.rect(x, topIdentificacao + 58, largura, 22).stroke();
            this.doc.fontSize(6.5).text('Consulte a autenticidade no portal nacional do CT-e,', x, topIdentificacao + 62, {
                characterSpacing: 0.4,
                width: largura,
                align: 'center',
            });
            this.doc.fontSize(6.5).text('www.cte.fazenda.gov.br, ou no site da Sefaz Autorizadora', x, topIdentificacao + 71, {
                characterSpacing: 0.4,
                width: largura,
                align: 'center',
            });

            const dhRecbto = this.formatDate(this.protCTe?.infProt.dhRecbto, 'dd/MM/yyyy HH:mm:ss');
            const protocolo = this.enviada ? `${this.protCTe?.infProt.nProt || ''} ${dhRecbto}`.trim() : '';
            this._campo(x, topIdentificacao + 80, largura, 18, 'PROTOCOLO DE AUTORIZAÇÃO DE USO', protocolo, { align: 'center', fontSize: 7 });
        };

        /** CFOP, TIPOS E PRESTAÇÃO */
        const _buildDadosPrestacao = () => {
            const yCfop = topIdentificacao + 98;
            this._campo(left, yCfop, 60, 22, 'CFOP', String(this.ide.CFOP ?? ''), { fontSize: 8, valueTop: 9 });
            this._campo(left + 60, yCfop, LARGURA_UTIL - 60, 22, 'NATUREZA DA PRESTAÇÃO', String(this.ide.natOp || ''), { fontSize: 8, valueTop: 9 });

            const yTipos = yCfop + 22;
            const larguraTipo = LARGURA_UTIL / 4;
            this._campo(left, yTipos, larguraTipo, 22, 'TIPO DO SERVIÇO', this.getDescricaoTipoServico(), { valueTop: 9 });
            this._campo(left + larguraTipo, yTipos, larguraTipo, 22, 'TOMADOR DO SERVIÇO', this.getDescricaoTomador(), { valueTop: 9 });
            this._campo(left + larguraTipo * 2, yTipos, larguraTipo, 22, 'CARACTERÍSTICA ADIC. DO TRANSPORTE', String(this.compl?.xCaracAd || ''), { valueTop: 9 });
            this._campo(left + larguraTipo * 3, yTipos, larguraTipo, 22, 'CARACTERÍSTICA ADIC. DO SERVIÇO', String(this.compl?.xCaracSer || ''), { valueTop: 9 });

            const yPrestacao = yTipos + 22;
            const larguraPrestacao = LARGURA_UTIL / 2;
            this._campo(left, yPrestacao, larguraPrestacao, 22, 'ORIGEM DA PRESTAÇÃO', `${this.ide.xMunIni || ''} - ${this.ide.UFIni || ''}`, { fontSize: 8, valueTop: 9 });
            this._campo(left + larguraPrestacao, yPrestacao, larguraPrestacao, 22, 'DESTINO DA PRESTAÇÃO', `${this.ide.xMunFim || ''} - ${this.ide.UFFim || ''}`, { fontSize: 8, valueTop: 9 });
        };

        _buildIdentificacaoEmit();
        _buildIdentificacaoDacte();
        _buildIdentificacaoCTe();
        _buildDadosPrestacao();
    }

    /**
     * Bloco de um participante do CT-e (remetente, destinatário, expedidor,
     * recebedor). Todos compartilham o mesmo conjunto de campos.
     */
    _buildParticipante(x: number, y: number, width: number, titulo: string, participante: ParticipanteDacte) {
        const alturaLinha = 16;
        this._tituloSecao(y - 7, titulo, x);

        this._campo(x, y, width, alturaLinha, 'NOME / RAZÃO SOCIAL', participante.xNome);
        this._campo(x, y + alturaLinha, width, alturaLinha, 'ENDEREÇO', participante.endereco);

        this._campo(x, y + alturaLinha * 2, width * 0.55, alturaLinha, 'MUNICÍPIO', participante.municipio);
        this._campo(x + width * 0.55, y + alturaLinha * 2, width * 0.15, alturaLinha, 'UF', participante.UF, { align: 'center' });
        this._campo(x + width * 0.70, y + alturaLinha * 2, width * 0.30, alturaLinha, 'CEP', participante.CEP);

        this._campo(x, y + alturaLinha * 3, width * 0.5, alturaLinha, 'CNPJ / CPF', participante.documento);
        this._campo(x + width * 0.5, y + alturaLinha * 3, width * 0.5, alturaLinha, 'INSCRIÇÃO ESTADUAL', participante.IE);

        this._campo(x, y + alturaLinha * 4, width * 0.5, alturaLinha, 'PAÍS', participante.pais);
        this._campo(x + width * 0.5, y + alturaLinha * 4, width * 0.5, alturaLinha, 'FONE', participante.fone);
    }

    _buildRemetenteDestinatario() {
        const { left } = this.doc.page.margins;
        const largura = LARGURA_UTIL / 2;

        this._buildParticipante(left, 247, largura, 'REMETENTE', this.normalizarParticipante(this.rem, this.rem?.enderReme));
        this._buildParticipante(left + largura, 247, largura, 'DESTINATÁRIO', this.normalizarParticipante(this.dest, this.dest?.enderDest));
    }

    _buildExpedidorRecebedor() {
        const { left } = this.doc.page.margins;
        const largura = LARGURA_UTIL / 2;

        this._buildParticipante(left, 336, largura, 'EXPEDIDOR', this.normalizarParticipante(this.exped, this.exped?.enderExped));
        this._buildParticipante(left + largura, 336, largura, 'RECEBEDOR', this.normalizarParticipante(this.receb, this.receb?.enderReceb));
    }

    _buildTomador() {
        const { left } = this.doc.page.margins;
        const alturaLinha = 16;
        const top = 425;
        const tomador = this.getTomador();

        this._tituloSecao(top - 7, 'TOMADOR DO SERVIÇO');

        this._campo(left, top, LARGURA_UTIL * 0.5, alturaLinha, 'NOME / RAZÃO SOCIAL', tomador.xNome);
        this._campo(left + LARGURA_UTIL * 0.5, top, LARGURA_UTIL * 0.28, alturaLinha, 'CNPJ / CPF', tomador.documento);
        this._campo(left + LARGURA_UTIL * 0.78, top, LARGURA_UTIL * 0.22, alturaLinha, 'INSCRIÇÃO ESTADUAL', tomador.IE);

        this._campo(left, top + alturaLinha, LARGURA_UTIL * 0.42, alturaLinha, 'ENDEREÇO', tomador.endereco);
        this._campo(left + LARGURA_UTIL * 0.42, top + alturaLinha, LARGURA_UTIL * 0.28, alturaLinha, 'MUNICÍPIO', tomador.municipio);
        this._campo(left + LARGURA_UTIL * 0.70, top + alturaLinha, LARGURA_UTIL * 0.10, alturaLinha, 'UF', tomador.UF, { align: 'center' });
        this._campo(left + LARGURA_UTIL * 0.80, top + alturaLinha, LARGURA_UTIL * 0.20, alturaLinha, 'CEP', tomador.CEP);

        this._campo(left, top + alturaLinha * 2, LARGURA_UTIL * 0.5, alturaLinha, 'PAÍS', tomador.pais);
        this._campo(left + LARGURA_UTIL * 0.5, top + alturaLinha * 2, LARGURA_UTIL * 0.5, alturaLinha, 'FONE', tomador.fone);
    }

    _buildCarga() {
        const { left } = this.doc.page.margins;
        const top = 482;
        const alturaLinha = 18;
        const infCarga: InfCarga = this.infCTeNorm?.infCarga || {};

        this._tituloSecao(top - 7, 'DADOS DA CARGA');

        this._campo(left, top, LARGURA_UTIL * 0.45, alturaLinha, 'PRODUTO PREDOMINANTE', String(infCarga.proPred || ''));
        this._campo(left + LARGURA_UTIL * 0.45, top, LARGURA_UTIL * 0.35, alturaLinha, 'OUTRAS CARACTERÍSTICAS DA CARGA', String(infCarga.xOutCat || ''));
        this._campo(left + LARGURA_UTIL * 0.80, top, LARGURA_UTIL * 0.20, alturaLinha, 'VALOR TOTAL DA CARGA', this.formatDecimal(infCarga.vCarga), { align: 'right' });

        const quantidades = this.toArray<InfQ>(infCarga.infQ).slice(0, 5);
        const larguraCelula = LARGURA_UTIL / 5;
        for (let i = 0; i < 5; i++) {
            const item = quantidades[i];
            const unidade = item ? DESCRICAO_UNIDADE_CARGA[String(item.cUnid ?? '').padStart(2, '0')] || '' : '';
            const label = item ? `${String(item.tpMed || 'QUANTIDADE')}${unidade ? ` (${unidade})` : ''}` : 'TIPO DA MEDIDA / QUANTIDADE';
            const valor = item ? this.formatDecimal(item.qCarga, 2, 4) : '';
            this._campo(left + larguraCelula * i, top + alturaLinha, larguraCelula, alturaLinha, label, valor, { align: 'right' });
        }
    }

    _buildComponentesValor() {
        const { left } = this.doc.page.margins;
        const top = 527;
        const alturaLinha = 18;
        const larguraComponentes = LARGURA_UTIL * 0.62;
        const larguraTotais = LARGURA_UTIL - larguraComponentes;
        const larguraCelula = larguraComponentes / 3;
        const componentes = this.toArray<CompCTe>(this.vPrest?.Comp).slice(0, 6);

        this._tituloSecao(top - 7, 'COMPONENTES DO VALOR DA PRESTAÇÃO DO SERVIÇO');

        for (let i = 0; i < 6; i++) {
            const componente = componentes[i];
            const coluna = i % 3;
            const linha = Math.floor(i / 3);
            this._campo(
                left + larguraCelula * coluna,
                top + alturaLinha * linha,
                larguraCelula,
                alturaLinha,
                componente ? String(componente.xNome || 'COMPONENTE') : 'COMPONENTE',
                componente ? this.formatDecimal(componente.vComp) : '',
                { align: 'right' },
            );
        }

        this._campo(left + larguraComponentes, top, larguraTotais, alturaLinha, 'VALOR TOTAL DO SERVIÇO', this.formatDecimal(this.vPrest?.vTPrest), { align: 'right', fontSize: 8, bold: true });
        this._campo(left + larguraComponentes, top + alturaLinha, larguraTotais, alturaLinha, 'VALOR A RECEBER', this.formatDecimal(this.vPrest?.vRec), { align: 'right', fontSize: 8, bold: true });
    }

    _buildImposto() {
        const { left } = this.doc.page.margins;
        const top = 572;
        const altura = 20;
        const icms = this.getInfoICMS();

        this._tituloSecao(top - 7, 'INFORMAÇÕES RELATIVAS AO IMPOSTO');

        this._campo(left, top, LARGURA_UTIL * 0.24, altura, 'SITUAÇÃO TRIBUTÁRIA', icms.situacao, { fontSize: 6, valueTop: 9 });
        this._campo(left + LARGURA_UTIL * 0.24, top, LARGURA_UTIL * 0.17, altura, 'BASE DE CÁLCULO', icms.vBC, { align: 'right', fontSize: 8, valueTop: 9 });
        this._campo(left + LARGURA_UTIL * 0.41, top, LARGURA_UTIL * 0.11, altura, 'ALÍQ. ICMS', icms.pICMS, { align: 'right', fontSize: 8, valueTop: 9 });
        this._campo(left + LARGURA_UTIL * 0.52, top, LARGURA_UTIL * 0.17, altura, 'VALOR ICMS', icms.vICMS, { align: 'right', fontSize: 8, valueTop: 9 });
        this._campo(left + LARGURA_UTIL * 0.69, top, LARGURA_UTIL * 0.14, altura, '% RED. BC ICMS', icms.pRedBC, { align: 'right', fontSize: 8, valueTop: 9 });
        this._campo(left + LARGURA_UTIL * 0.83, top, LARGURA_UTIL * 0.17, altura, 'ICMS ST', icms.vICMSST, { align: 'right', fontSize: 8, valueTop: 9 });
    }

    _buildDocumentosOriginarios() {
        const { left } = this.doc.page.margins;
        const documentos = this.getDocumentosOriginarios();
        const colunas = [
            { label: 'TIPO DOC', width: 55, align: 'left' as const },
            { label: 'CNPJ / CPF DO EMITENTE', width: 110, align: 'left' as const },
            { label: 'SÉRIE / NRO. DOCUMENTO', width: 110, align: 'left' as const },
            { label: 'CHAVE DE ACESSO / OBSERVAÇÃO', width: LARGURA_UTIL - 275, align: 'left' as const },
        ];

        const header = (top: number) => {
            this._tituloSecao(top - 7, 'DOCUMENTOS ORIGINÁRIOS');
            let x = left;
            for (const coluna of colunas) {
                this.doc.rect(x, top, coluna.width, ALTURA_LINHA_DOCUMENTO).fillAndStroke('#DDDDDD', '#1c1c1c');
                this.setLineStyle(0.75, '#1c1c1c');
                this.doc.font('Times-Roman').fontSize(5.7).text(coluna.label, x, top + 3, {
                    width: coluna.width,
                    align: 'center',
                    lineBreak: false,
                });
                x += coluna.width;
            }
        };

        const row = (top: number, documento: DocumentoOriginario) => {
            const valores = [documento.tipo, documento.documentoEmitente, documento.serieNumero, documento.chave];
            this.setLineStyle(0.75, '#1c1c1c');
            let x = left;
            colunas.forEach((coluna, indice) => {
                this.doc.rect(x, top, coluna.width, ALTURA_LINHA_DOCUMENTO).stroke();
                this.doc.font('Times-Roman').fontSize(6).text(valores[indice] || '', x + 3, top + 3, {
                    width: coluna.width - 6,
                    align: coluna.align,
                    lineBreak: false,
                    ellipsis: true,
                });
                x += coluna.width;
            });
        };

        header(TOPO_DOCUMENTOS);
        let y = TOPO_DOCUMENTOS + ALTURA_LINHA_DOCUMENTO;

        for (const documento of documentos) {
            if (y + ALTURA_LINHA_DOCUMENTO > TOPO_RODAPE - 6) {
                this.doc.addPage();
                header(TOPO_DOCUMENTOS_CONTINUACAO);
                y = TOPO_DOCUMENTOS_CONTINUACAO + ALTURA_LINHA_DOCUMENTO;
            }
            row(y, documento);
            y += ALTURA_LINHA_DOCUMENTO;
        }
    }

    _buildFooter() {
        const { left } = this.doc.page.margins;
        this.setLineStyle(0.75, '#1c1c1c');

        /** OBSERVAÇÕES */
        const topObservacoes = TOPO_RODAPE + 9;
        this._tituloSecao(TOPO_RODAPE + 2, 'OBSERVAÇÕES');
        this._campo(left, topObservacoes, LARGURA_UTIL, 36, 'OBSERVAÇÕES GERAIS', this.getObservacoes(), {
            fontSize: 7,
            valueTop: 9,
            multiline: true,
        });

        /** MODAL */
        const topModal = topObservacoes + 45;
        const camposModal = this.getCamposModal();
        this._tituloSecao(topModal - 7, `INFORMAÇÕES ESPECÍFICAS DO MODAL ${this.getDescricaoModal()}`);
        const larguraModal = LARGURA_UTIL / camposModal.length;
        camposModal.forEach((campo, indice) => {
            this._campo(left + larguraModal * indice, topModal, larguraModal, 20, campo.label, campo.value, { fontSize: 7, valueTop: 9 });
        });

        /** USO EXCLUSIVO / FISCO / QR CODE */
        const topRodape = topModal + 29;
        const larguraEmissor = LARGURA_UTIL * 0.55;
        const larguraFisco = LARGURA_UTIL * 0.30;
        const larguraQrCode = LARGURA_UTIL - larguraEmissor - larguraFisco;

        this._tituloSecao(topRodape - 7, 'USO EXCLUSIVO DO EMISSOR DO CT-E');
        this._campo(left, topRodape, larguraEmissor, 44, 'INFORMAÇÕES DE USO DO EMISSOR', this.getUsoExclusivoEmissor(), {
            fontSize: 6.5,
            valueTop: 9,
            multiline: true,
        });
        this._campo(left + larguraEmissor, topRodape, larguraFisco, 44, 'RESERVADO AO FISCO', String(this.imp?.infAdFisco || ''), {
            fontSize: 6.5,
            valueTop: 9,
            multiline: true,
        });

        this.setLineStyle(0.75, '#1c1c1c');
        this.doc.rect(left + larguraEmissor + larguraFisco, topRodape, larguraQrCode, 44).stroke();
        if (this.qrcodeBuffer) {
            this.doc.image(this.qrcodeBuffer, left + larguraEmissor + larguraFisco + (larguraQrCode - 38) / 2, topRodape + 3, { width: 38, height: 38 });
        }

        // Marca d'água e aviso de homologação ocupam faixas distintas da caixa
        // de observações para não se sobreporem entre si.
        if (Number(this.ide.tpAmb) === 2) {
            this.doc.fontSize(12).font('Times-Bold').fillColor('grey').text('AMBIENTE DE HOMOLOGAÇÃO - CT-E SEM VALOR FISCAL', left + 118, topObservacoes + 4, {
                characterSpacing: 1,
                lineBreak: false,
            });
        }

        if (this.exibirMarcaDaguaDacte) {
            this.doc.fontSize(14).font('Times-Bold').fillColor('#c7c7c7').text('NFeWizard-io', left + 243, topObservacoes + 19, {
                characterSpacing: 0.5,
                lineBreak: false,
            });
        }

        this.doc.font('Times-Roman').fillColor('black');
    }

    /** Normaliza remetente / destinatário / expedidor / recebedor para impressão. */
    normalizarParticipante(participante?: RemCTe | DestCTe | ExpedCTe | RecebCTe, endereco?: EnderCTe): ParticipanteDacte {
        const ender = endereco || {};
        const documento = this.documento.mascaraCnpjCpf(participante?.CNPJCPF || participante?.CNPJ || participante?.CPF || '');

        return {
            xNome: String(participante?.xNome || ''),
            documento: String(documento || ''),
            IE: String(participante?.IE || ''),
            endereco: participante ? `${ender.xLgr || ''}${ender.nro ? `, ${ender.nro}` : ''}${ender.xBairro ? ` - ${ender.xBairro}` : ''}` : '',
            municipio: String(ender.xMun || ''),
            UF: String(ender.UF || ''),
            CEP: String(ender.CEP || ''),
            pais: String(ender.xPais || (participante ? 'BRASIL' : '')),
            fone: String(participante?.fone || ''),
        };
    }

    /**
     * Resolve o tomador do serviço. Quando o tomador é um dos participantes
     * do CT-e (`toma3`/`toma03`), reaproveita os dados já informados; caso
     * contrário (`toma4`), usa o grupo próprio do tomador.
     */
    getTomador(): ParticipanteDacte {
        const toma3 = this.ide.toma3 || this.ide.toma03;

        if (toma3) {
            switch (String(toma3.toma)) {
                case '0':
                    return this.normalizarParticipante(this.rem, this.rem?.enderReme);
                case '1':
                    return this.normalizarParticipante(this.exped, this.exped?.enderExped);
                case '2':
                    return this.normalizarParticipante(this.receb, this.receb?.enderReceb);
                default:
                    return this.normalizarParticipante(this.dest, this.dest?.enderDest);
            }
        }

        const toma4 = this.ide.toma4;
        if (!toma4) {
            return this.normalizarParticipante(undefined, undefined);
        }

        const ender = toma4.enderToma || {};
        const documento = this.documento.mascaraCnpjCpf(toma4.CNPJCPF || toma4.CNPJ || toma4.CPF || '');

        return {
            xNome: String(toma4.xNome || ''),
            documento: String(documento || ''),
            IE: String(toma4.IE || ''),
            endereco: `${ender.xLgr || ''}${ender.nro ? `, ${ender.nro}` : ''}${ender.xBairro ? ` - ${ender.xBairro}` : ''}`,
            municipio: String(ender.xMun || ''),
            UF: String(ender.UF || ''),
            CEP: String(ender.CEP || ''),
            pais: String(ender.xPais || 'BRASIL'),
            fone: String(toma4.fone || ''),
        };
    }

    getDescricaoModal(): string {
        return DESCRICAO_MODAL[String(this.ide.modal ?? '').padStart(2, '0')] || String(this.ide.modal ?? '');
    }

    getDescricaoTipoCTe(): string {
        return DESCRICAO_TIPO_CTE[String(this.ide.tpCTe ?? '')] || String(this.ide.tpCTe ?? '');
    }

    getDescricaoTipoServico(): string {
        return DESCRICAO_TIPO_SERVICO[String(this.ide.tpServ ?? '')] || String(this.ide.tpServ ?? '');
    }

    getDescricaoTomador(): string {
        const toma3 = this.ide.toma3 || this.ide.toma03;
        const codigo = toma3 ? String(toma3.toma) : String(this.ide.toma4?.toma ?? '4');

        const descricoes: Record<string, string> = {
            '0': '0 - REMETENTE',
            '1': '1 - EXPEDIDOR',
            '2': '2 - RECEBEDOR',
            '3': '3 - DESTINATÁRIO',
            '4': '4 - OUTROS',
        };

        return descricoes[codigo] || codigo;
    }

    /**
     * Extrai da tag de ICMS efetivamente informada (`ICMS00`, `ICMS20`,
     * `ICMS45`, `ICMS60`, `ICMS90`, `ICMSOutraUF` ou `ICMSSN`) os valores
     * exibidos no quadro de imposto do DACTE.
     */
    getInfoICMS(): { situacao: string; vBC: string; pICMS: string; vICMS: string; pRedBC: string; vICMSST: string } {
        const vazio = {
            situacao: '',
            vBC: this.formatDecimal(0),
            pICMS: this.formatDecimal(0),
            vICMS: this.formatDecimal(0),
            pRedBC: this.formatDecimal(0),
            vICMSST: this.formatDecimal(0),
        };

        const icms = this.imp?.ICMS;
        if (!icms) {
            return vazio;
        }

        const tipo = (Object.keys(icms) as (keyof ICMSCTe)[]).find(chave => icms[chave]);
        if (!tipo) {
            return vazio;
        }

        const grupo = icms[tipo] as Record<string, string | number | undefined>;
        const cst = String(grupo.CST ?? (tipo === 'ICMS45' ? '45' : ''));
        const situacao = DESCRICAO_CST[cst] || cst;

        if (tipo === 'ICMSOutraUF') {
            return {
                situacao,
                vBC: this.formatDecimal(grupo.vBCOutraUF),
                pICMS: this.formatDecimal(grupo.pICMSOutraUF),
                vICMS: this.formatDecimal(grupo.vICMSOutraUF),
                pRedBC: this.formatDecimal(grupo.pRedBCOutraUF),
                vICMSST: this.formatDecimal(0),
            };
        }

        if (tipo === 'ICMS60') {
            return {
                situacao,
                vBC: this.formatDecimal(grupo.vBCSTRet),
                pICMS: this.formatDecimal(grupo.pICMSSTRet),
                vICMS: this.formatDecimal(0),
                pRedBC: this.formatDecimal(0),
                vICMSST: this.formatDecimal(grupo.vICMSSTRet),
            };
        }

        return {
            situacao,
            vBC: this.formatDecimal(grupo.vBC),
            pICMS: this.formatDecimal(grupo.pICMS),
            vICMS: this.formatDecimal(grupo.vICMS),
            pRedBC: this.formatDecimal(grupo.pRedBC),
            vICMSST: this.formatDecimal(0),
        };
    }

    /**
     * Achata `infNFe`, `infNF` e `infOutros` em uma única lista para a
     * tabela de documentos originários.
     */
    getDocumentosOriginarios(): DocumentoOriginario[] {
        const infDoc: InfDocCTe = this.infCTeNorm?.infDoc || {};
        const documentos: DocumentoOriginario[] = [];

        for (const item of this.toArray<InfNFeCTe>(infDoc.infNFe)) {
            const chave = String(item.chave || '').replace(/\D/g, '');
            documentos.push({
                tipo: 'NF-e',
                documentoEmitente: chave.length === 44 ? this.documento.mascaraCnpjCpf(chave.substring(6, 20)) : '',
                serieNumero: chave.length === 44 ? `${chave.substring(22, 25)} / ${String(Number(chave.substring(25, 34)))}` : '',
                chave: String(item.chave || ''),
            });
        }

        for (const item of this.toArray<InfNFCTe>(infDoc.infNF)) {
            documentos.push({
                tipo: `NF MOD. ${String(item.mod ?? '')}`,
                documentoEmitente: '',
                serieNumero: `${String(item.serie ?? '')} / ${String(item.nDoc ?? '')}`,
                chave: `EMISSÃO: ${this.formatDate(item.dEmi)} - VALOR: ${this.formatDecimal(item.vNF)}`,
            });
        }

        for (const item of this.toArray<InfOutrosCTe>(infDoc.infOutros)) {
            const tpDoc = String(item.tpDoc ?? '').padStart(2, '0');
            documentos.push({
                tipo: DESCRICAO_TIPO_DOCUMENTO[tpDoc] || tpDoc,
                documentoEmitente: '',
                serieNumero: String(item.nDoc || ''),
                chave: [item.descOutros, item.dEmi ? `EMISSÃO: ${this.formatDate(item.dEmi)}` : ''].filter(Boolean).join(' - '),
            });
        }

        return documentos;
    }

    /** Campos exibidos no quadro específico do modal informado no CT-e. */
    getCamposModal(): { label: string; value: string }[] {
        const infModal: InfModal = this.infCTeNorm?.infModal || {};

        if (infModal.rodo) {
            const ordens = this.toArray<OccCTe>(infModal.rodo.occ)
                .map(occ => `${String(occ.nOcc ?? '')}/${String(occ.serie ?? '')}`)
                .join(', ');
            return [
                { label: 'RNTRC DA EMPRESA', value: String(infModal.rodo.RNTRC || '') },
                { label: 'ORDEM DE COLETA (Nº/SÉRIE)', value: ordens },
                { label: 'DATA PREVISTA DE ENTREGA', value: this.getPrevisaoEntrega() },
            ];
        }

        if (infModal.aereo) {
            return [
                { label: 'NÚMERO DA MINUTA', value: String(infModal.aereo.nMinu || '') },
                { label: 'NÚMERO OPERACIONAL DO CONHECIMENTO AÉREO', value: String(infModal.aereo.nOCA || '') },
                { label: 'DATA PREVISTA DE ENTREGA', value: this.formatDate(infModal.aereo.dPrevAereo) || this.getPrevisaoEntrega() },
            ];
        }

        if (infModal.aquav) {
            return [
                { label: 'IDENTIFICAÇÃO DO NAVIO', value: String(infModal.aquav.xNavio || '') },
                { label: 'Nº DA VIAGEM', value: String(infModal.aquav.nViag ?? '') },
                { label: 'VALOR DO AFRMM', value: this.formatDecimal(infModal.aquav.vAFRMM) },
            ];
        }

        if (infModal.ferrov) {
            return [
                { label: 'TIPO DE TRÁFEGO', value: String(infModal.ferrov.tpTraf ?? '') },
                { label: 'FLUXO FERROVIÁRIO', value: String(infModal.ferrov.fluxo || '') },
                { label: 'DATA PREVISTA DE ENTREGA', value: this.getPrevisaoEntrega() },
            ];
        }

        if (infModal.duto) {
            return [
                { label: 'VALOR DA TARIFA', value: this.formatDecimal(infModal.duto.vTar) },
                { label: 'INÍCIO DA PRESTAÇÃO', value: this.formatDate(infModal.duto.dIni) },
                { label: 'FIM DA PRESTAÇÃO', value: this.formatDate(infModal.duto.dFim) },
            ];
        }

        if (infModal.multimodal) {
            return [
                { label: 'Nº DO CERTIFICADO DO OPERADOR (COTM)', value: String(infModal.multimodal.COTM || '') },
                { label: 'INDICADOR NEGOCIÁVEL', value: String(infModal.multimodal.indNegociavel ?? '') },
                { label: 'DATA PREVISTA DE ENTREGA', value: this.getPrevisaoEntrega() },
            ];
        }

        return [
            { label: 'INFORMAÇÕES DO MODAL', value: '' },
            { label: 'DATA PREVISTA DE ENTREGA', value: this.getPrevisaoEntrega() },
        ];
    }

    /** Previsão de entrega informada em `compl.Entrega`. */
    getPrevisaoEntrega(): string {
        const entrega = this.compl?.Entrega;
        if (!entrega) {
            return '';
        }

        if (entrega.comData?.dProg) {
            return this.formatDate(entrega.comData.dProg);
        }
        if (entrega.noPeriodo?.dIni || entrega.noPeriodo?.dFim) {
            return `${this.formatDate(entrega.noPeriodo.dIni)} a ${this.formatDate(entrega.noPeriodo.dFim)}`;
        }
        return '';
    }

    /** Observações gerais e campos de uso livre do contribuinte. */
    getObservacoes(): string {
        const observacoes = this.toArray<ObsCTe>(this.compl?.ObsCont)
            .map(obs => `${obs.xCampo ? `${obs.xCampo}: ` : ''}${obs.xTexto || ''}`.trim())
            .filter(Boolean);

        return [String(this.compl?.xObs || ''), ...observacoes].filter(Boolean).join(' | ');
    }

    /** Dados operacionais do emissor: funcionário, fluxo e CT-e substituído. */
    getUsoExclusivoEmissor(): string {
        const fluxo = this.compl?.fluxo;
        const infCteSub = this.infCTeNorm?.infCteSub;

        return [
            this.compl?.xEmi ? `EMISSOR: ${this.compl.xEmi}` : '',
            fluxo?.xOrig ? `ORIGEM: ${fluxo.xOrig}` : '',
            fluxo?.xDest ? `DESTINO: ${fluxo.xDest}` : '',
            fluxo?.xRota ? `ROTA: ${fluxo.xRota}` : '',
            infCteSub?.chCte ? `CT-E SUBSTITUÍDO: ${infCteSub.chCte}` : '',
        ].filter(Boolean).join(' | ');
    }

    /** Normaliza as tags que o XML pode trazer como objeto único ou lista. */
    toArray<T>(value: T | T[] | undefined): T[] {
        if (!value) {
            return [];
        }
        return (Array.isArray(value) ? value : [value]).filter(Boolean);
    }

    async generatePDF(exibirMarcaDaguaDacte?: boolean) {
        try {
            this.exibirMarcaDaguaDacte = exibirMarcaDaguaDacte ?? true;

            await this.generateBarcode(this.chave);
            await this.generateQRCode(this.infCTeSupl?.qrCodCTe || '');

            this.doc.pipe(fs.createWriteStream(this.outputPath));

            this.drawHeader(true);

            this._buildRemetenteDestinatario();
            this._buildExpedidorRecebedor();
            this._buildTomador();
            this._buildCarga();
            this._buildComponentesValor();
            this._buildImposto();

            this.doc.on('pageAdded', () => {
                this.drawHeader(false);
            });
            this.drawFooter();
            this.doc.on('pageAdded', () => {
                this.drawFooter();
            });

            this._buildDocumentosOriginarios();
            this.doc.end();

            return {
                message: `  DACTE Gerado em '${this.outputPath}'`,
                success: true,
            };
        } catch (error: any) {
            throw new Error(`Erro ao gerar DACTE: ${error.message}`);
        }
    }
}

export { CTeGerarDacte };
