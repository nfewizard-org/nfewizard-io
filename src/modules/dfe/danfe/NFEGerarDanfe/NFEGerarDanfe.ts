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
import path from 'path';
import fs from 'fs';
import { ICMS, IPI, DetProd, NFEGerarDanfeProps, Ide, Dest, Emit, Total, Transp, InfAdic, Vol, ProtNFe } from 'src/core/types';
import { format } from 'date-fns';
import PDFDocument from 'pdfkit';
import { fileURLToPath } from 'url';
import ValidaCPFCNPJ from '@Core/utils/ValidaCPFCNPJ';

const baseDir = path.dirname(fileURLToPath(import.meta.url))
const barcodePath = process.env.NODE_ENV === 'production' ? '../tmp' : '../../../../../tmp'

class NFEGerarDanfe {
    data: NFEGerarDanfeProps['data'];
    chave: string;
    enviada: boolean;
    outputPath: string
    barcodePath: string;
    documento: ValidaCPFCNPJ;
    protNFe: ProtNFe | undefined;
    det: DetProd | DetProd[];
    ide: Ide;
    dest: Dest | undefined;
    emit: Emit;
    total: Total;
    transp: Transp;
    infAdic: InfAdic | undefined;
    exibirMarcaDaguaDanfe?: boolean;
    doc: InstanceType<typeof PDFDocument>;

    constructor(props: NFEGerarDanfeProps) {
        const { data, chave, outputPath } = props;

        this.data = data;
        this.chave = chave.trim();
        this.outputPath = outputPath;
        this.enviada = false; // Valor padrão
        this.barcodePath = barcodePath;
        this.documento = new ValidaCPFCNPJ(); // Inicialização correta
        this.protNFe = data.protNFe;

        const nfeData = Array.isArray(data.NFe) ? data.NFe[0] : data.NFe;
        const { det, ide, emit, dest, total, transp, infAdic } = nfeData.infNFe;

        this.det = det;
        this.ide = ide;
        this.emit = emit;
        this.total = total;
        this.transp = transp;
        this.infAdic = infAdic;
        if (dest) this.dest = dest;

        if (this.protNFe?.infProt.nProt) {
            this.enviada = true;
        }

        // Área útil ignorando margem à direita (22.68) e esquerda (5.67) = 566.93
        this.doc = new PDFDocument({
            margins: { top: 22, right: 22.68, bottom: 12, left: 5.67 },
            size: 'a4', // 595.28 * 841.89
            bufferPages: true,
            layout: 'portrait',
            font: 'Times-Roman',
        });
    }

    createDir(path: string) {
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true });
        }
    }

    async generateBarcode(data: string) {
        try {
            const png = await bwipjs.toBuffer({
                bcid: 'code128',       // Tipo de código de barras
                text: data,            // Dado a ser codificado
                scaleX: 4,             // Fator de escala
                height: 14,            // Altura da barra
                includetext: false,    // Incluir texto
            });
            const barcode = png.toString('base64');
            const barcodeDir = this.barcodePath;
            const filePath = path.resolve(baseDir, this.barcodePath);
            this.createDir(barcodeDir);
            fs.writeFileSync(`${filePath}/barcode.png`, Buffer.from(barcode, 'base64'));
        } catch (err) {
            console.error('Erro ao gerar código de barras:', err);
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
        // this.doc.moveDown();
    }

    drawFooter() {
        this._buildFooter();
    }

    _buildGuia() {
        const { top, left } = this.doc.page.margins;
        this.setLineStyle(0.75, '#1c1c1c');

        /** TOP LEFT */
        this.doc.rect(left, top, 470, 21).stroke();
        this.doc.fontSize(5).text(`RECEBEMOS DE ${this.emit.xNome} OS PRODUTOS / SERVIÇOS CONSTANTES DA NOTA FISCAL INDICADO AO LADO`, 10, 26, {
            characterSpacing: 0.5
        });
        this.doc.fontSize(6).text(`EMISSÃO: ${format(new Date(this.ide.dhEmi), 'dd-MM-yyyy')} -  DEST. / REM.: ${this.dest?.xNome || ''}  -  VALOR TOTAL: R$ ${parseFloat(String(this.total.ICMSTot.vNF)).toFixed(2)}`, 10, 33.5, {
            characterSpacing: 0.5
        });
        /** RIGHT */
        this.doc.rect(left + 470, top, 96.93, 42).stroke();
        this.doc.fontSize(11).text(`NF-e`, 480, 27, {
            characterSpacing: 1.5,
            align: 'center'
        });
        this.doc.fontSize(8.8).font('Times-Bold').text(`Nº ${String(this.ide.nNF).padStart(2, '0')}`, 480, 40.5, {
            characterSpacing: 1.5,
            align: 'center',
        });
        this.doc.fontSize(8.5).font('Times-Roman').text(`SÉRIE ${this.ide.serie.padStart(3, '0')}`, 480, 53, {
            characterSpacing: 1.5,
            align: 'center',
        });
        /** BOTTON LEFT */
        this.doc.rect(left, top + 21, 75, 21).stroke();
        this.doc.fontSize(5).text(`DATA DE RECEBIMENTO`, 10, 46.5, {
            characterSpacing: 0.5,
        });
        /** BOTTON RIGHT */
        this.doc.rect(left + 75, top + 21, 395, 21).stroke();
        this.doc.fontSize(5).text(`IDENTIFICAÇÃO E ASSINATURA DO RECEBEDOR`, 75 + 10, 46.5, {
            characterSpacing: 0.5
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
        const CNPJCPF = this.emit.CNPJCPF?.toString() 
        const CNPJ = this.emit.CNPJ?.toString() 
        const CPF = this.emit.CPF?.toString()
        const documento = this.documento.mascaraCnpjCpf(CNPJCPF || CNPJ || CPF || '')
        this.setLineStyle(0.75, '#1c1c1c');

        const topIdentificacao_1 = top + pos;
        const identificationJoined = `\nCEP: ${this.emit.enderEmit.CEP} - ${this.emit.enderEmit.xBairro} - ${this.emit.enderEmit.UF}\nTEL: ${this.emit.enderEmit.fone} - FAX: ${this.emit.enderEmit.fone}`

        /** IDENTIFICACAO EMITENTE */
        const _buildIdentificacaoEmit = () => {
            this.doc.rect(left, topIdentificacao_1, 197.5, 98).stroke();
            this.doc.fontSize(5).text(`IDENTIFICAÇÃO DO EMITENTE`, 10, topIdentificacao_1 + 3.5, {
                characterSpacing: 0.5,
            });
            this.doc.fontSize(8).font('Times-Bold').text(this.emit.xNome, 35, topIdentificacao_1 + 14, {
                characterSpacing: 1,
                width: 170,
                lineBreak: true,
                lineGap: 4
            });
            this.doc.fontSize(7).font('Times-Roman').text(`${this.emit.enderEmit.xLgr}, ${this.emit.enderEmit.nro} ${this.emit.xFant ? `- ${this.emit.xFant}` : ''}`, 10, topIdentificacao_1 + 44, {
                characterSpacing: 1,
                width: 181,
                lineBreak: true,
                lineGap: 2,
                continued: true
            }).text(identificationJoined);
        }

        /** IDENTIFICACAO NFe */
        const _buildIdentificacaoDanfe = () => {
            this.doc.rect(left + 197.5, topIdentificacao_1, 112.7, 98).stroke();
            this.doc.fontSize(12).font('Times-Bold').text(`DANFE`, 203, topIdentificacao_1 + 8, {
                characterSpacing: 1.5,
                width: 112.7,
                align: 'center'
            });
            this.doc.fontSize(6).text(`DOCUMENTO AUXILIAR DA NOTA FISCAL ELETRÔNICA`, 215, topIdentificacao_1 + 20, {
                characterSpacing: 0.5,
                width: 95,
                align: 'left',
                lineGap: 2,
            });
            this.doc.fontSize(8).font('Times-Roman').text(`0 - ENTRADA`, 217, topIdentificacao_1 + 40, {
                characterSpacing: 0.5,
                align: 'left',
            });
            this.doc.fontSize(8).text(`1 - SAÍDA`, 217, topIdentificacao_1 + 50, {
                characterSpacing: 0.5,
                align: 'left',
            });
            this.doc.rect(left + 275, topIdentificacao_1 + 38, 18, 18).stroke();
            this.doc.fontSize(14).font('Times-Bold').text(String(this.ide.tpNF), left + 280, topIdentificacao_1 + 42.5);
            this.doc.fontSize(8.8).text(`Nº ${String(this.ide.nNF).padStart(2, '0')}`, 208, topIdentificacao_1 + 65, {
                characterSpacing: 1,
            });
            this.doc.fontSize(10).font('Times-Roman').text(`fl. ${page.start + 1}/${page.count}`, 240, topIdentificacao_1 + 65, {
                characterSpacing: 1.5,
                width: 112.7,
                align: 'center'
            });
            this.doc.fontSize(8.8).text(`SÉRIE ${this.ide.serie.padStart(3, '0')}`, 208, topIdentificacao_1 + 78, {
                characterSpacing: 1.5,
                width: 112.7,
                align: 'center'
            });
        }

        /** IDENTIFICACAO NFe */
        const _buildIdentificacaoNFe = () => {
            this.doc.rect(left + 310.2, topIdentificacao_1, 256.73, 35).stroke();
            const filePath = path.resolve(baseDir, this.barcodePath);
            this.doc.image(`${filePath}/barcode.png`, left + 323.5, topIdentificacao_1 + 3, { width: 230, height: 30 });
            if (Number(this.ide.tpAmb) !== 2 && !this.enviada) {
                this.doc.fontSize(14).font('Times-Bold').fillColor('red').text('NF-E NÃO ENVIADA PARA SEFAZ', left + 316, topIdentificacao_1 + 12, {
                    characterSpacing: 1,
                    width: 256.73,
                });
            }
            this.setLineStyle(0.75, '#1c1c1c')
            this.doc.rect(left + 310.2, topIdentificacao_1 + 35, 256.73, 23).stroke();
            this.doc.fontSize(5).font('Times-Roman').text(`CHAVE DE ACESSO`, left + 314, topIdentificacao_1 + 38, {
                characterSpacing: 0.5,
            });
            this.doc.fontSize(6).text(this.chave, left + 310.2, topIdentificacao_1 + 47, {
                characterSpacing: 1,
                width: 256.73,
                align: 'center'
            });

            this.doc.rect(left + 310.2, topIdentificacao_1 + 58, 256.73, 40).stroke();
            if (Number(this.ide.tpAmb) === 2 || this.enviada) {
                this.doc.fontSize(6.5).text('Consulta de autenticidade no portal nacional da NF-e', left + 310.2, topIdentificacao_1 + 65, {
                    characterSpacing: 0.5,
                    width: 256.73,
                    align: 'center'
                });
                this.doc.fontSize(6.5).text('www.nfe.fazenda.gov.br/portal', left + 310.2, topIdentificacao_1 + 75, {
                    characterSpacing: 0.5,
                    width: 256.73,
                    align: 'center'
                });
                this.doc.fontSize(6.5).text('ou no site da Sefaz Autorizadora', left + 310.2, topIdentificacao_1 + 85, {
                    characterSpacing: 0.5,
                    width: 256.73,
                    align: 'center'
                });
            }

            this.doc.rect(left, topIdentificacao_1 + 98, 310.2, 23).stroke();
            this.doc.fontSize(5).text('NATUREZA DE OPERAÇÃO', left + 4, topIdentificacao_1 + 102, {
                characterSpacing: 0.5,
            });
            this.doc.fontSize(8).text(this.ide.natOp, left + 4, topIdentificacao_1 + 112, {
                characterSpacing: 1,
            });

            this.doc.rect(left + 310.2, topIdentificacao_1 + 98, 256.73, 23).stroke();
            if (Number(this.ide.tpAmb) === 2 || this.enviada) {
                let dhRecbto = '';
                if (this.protNFe?.infProt.dhRecbto) {
                    dhRecbto = format(new Date(this.protNFe?.infProt.dhRecbto), 'dd/MM/yyyy HH:mm:ss')
                }
                const xProtNfe = `${String(this.protNFe?.infProt.nProt || '')} ${dhRecbto}`;
                this.doc.fontSize(5).text('PROTOCOLO DE AUTORIZAÇÃO DE USO', left + 314.2, topIdentificacao_1 + 102, {
                    characterSpacing: 0.5,
                });
                this.doc.fontSize(8).text(xProtNfe, left + 314.2, topIdentificacao_1 + 112, {
                    characterSpacing: 1,
                });
            }
        }

        /** IDENTIFICACAO PESSOA */
        const _buildIdentificacaoPessoa = () => {
            this.doc.rect(left, topIdentificacao_1 + 121, 189.5, 23).stroke();
            this.doc.fontSize(5).text('INSCRIÇÃO ESTADUAL', left + 4, topIdentificacao_1 + 125, {
                characterSpacing: 0.5,
            });
            this.doc.fontSize(8).text(this.emit.IE, left + 5, topIdentificacao_1 + 135, {
                characterSpacing: 1,
            });

            this.doc.rect(left + 189.5, topIdentificacao_1 + 121, 187.93, 23).stroke();
            this.doc.fontSize(5).text('INSCRIÇÃO ESTADUAL DO SUBST. TRIB.', left + 193.5, topIdentificacao_1 + 125, {
                characterSpacing: 0.5,
            });
            this.doc.fontSize(8).text(String(this.emit.IEST || ''), left + 194.5, topIdentificacao_1 + 135, {
                characterSpacing: 1,
            });

            this.doc.rect(left + 377.43, topIdentificacao_1 + 121, 189.5, 23).stroke();
            this.doc.fontSize(5).text('CNPJ / CPF', left + 381.43, topIdentificacao_1 + 125, {
                characterSpacing: 0.5,
            });
            this.doc.fontSize(8).text(documento, left + 386.43, topIdentificacao_1 + 135, {
                characterSpacing: 1,
            });
        }

        _buildIdentificacaoEmit();
        _buildIdentificacaoDanfe();
        _buildIdentificacaoNFe();
        _buildIdentificacaoPessoa();
    }

    _buildDestinatario() {
        const { top, left } = this.doc.page.margins;
        const docDest = this.documento.mascaraCnpjCpf(this.dest?.CNPJCPF || this.dest?.CNPJ || this.dest?.CPF || '')
        this.setLineStyle(0.75, '#1c1c1c');
        const topDestinatario = top + 90;

        const _buildDestPessoa = () => {
            this.doc.rect(left, topDestinatario + 120, 398, 23).stroke();
            let xNome = 'NF-E EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL';
            if (Number(this.ide.tpAmb) !== 2) {
                xNome = String(this.dest?.xNome || '');
            }
            this.doc.fontSize(5).font('Times-Roman').text('NOME / RAZÃO SOCIAL', left + 4, topDestinatario + 125, {
                characterSpacing: 0.5,
            });
            this.doc.fontSize(8).text(xNome, left + 5, topDestinatario + 135, {
                characterSpacing: 1,
            });

            this.doc.rect(left + 398, topDestinatario + 120, 94, 23).stroke();
            this.doc.fontSize(5).text('CNPJ / CPF', left + 402, topDestinatario + 125, {
                characterSpacing: 0.5,
            });
            this.doc.fontSize(8).text(docDest, left + 403, topDestinatario + 135, {
                characterSpacing: 1,
            });

            this.doc.rect(left + 492, topDestinatario + 120, 74.3, 23).stroke();
            this.doc.fontSize(5).text('DATA DA EMISSÃO', left + 496, topDestinatario + 125, {
                characterSpacing: 0.5,
            });
            this.doc.fontSize(8).text(format(new Date(this.ide.dhEmi), 'dd-MM-yyyy'), left + 497, topDestinatario + 135, {
                characterSpacing: 1,
            });
        }
        const _buildDestLogradouro = () => {
            this.doc.rect(left, topDestinatario + 143, 320, 23).stroke();
            this.doc.fontSize(5).text('ENDEREÇO', left + 4, topDestinatario + 148, {
                characterSpacing: 0.5,
            });
            this.doc.fontSize(8).text(`${this.dest?.enderDest?.xLgr  || ''}, ${this.dest?.enderDest?.nro  || ''}`, left + 5, topDestinatario + 158, {
                characterSpacing: 1,
            });

            this.doc.rect(left + 320, topDestinatario + 143, 118.5, 23).stroke();
            this.doc.fontSize(5).text('BAIRRO / DISTRITO', left + 324, topDestinatario + 148, {
                characterSpacing: 0.5,
            });
            this.doc.fontSize(8).text(String(this.dest?.enderDest?.xBairro  || ''), left + 326, topDestinatario + 158, {
                characterSpacing: 1,
            });

            this.doc.rect(left + 438.5, topDestinatario + 143, 53.5, 23).stroke();
            this.doc.fontSize(5).text('CEP', left + 442.5, topDestinatario + 148, {
                characterSpacing: 0.5,
            });
            this.doc.fontSize(8).text(String(this.dest?.enderDest?.CEP  || ''), left + 443.5, topDestinatario + 158, {
                characterSpacing: 1,
            });

            this.doc.rect(left + 492, topDestinatario + 143, 74.3, 23).stroke();
            this.doc.fontSize(5).text('DATA SAÍDA / ENTRADA', left + 496, topDestinatario + 148, {
                characterSpacing: 0.5,
            });
            this.doc.fontSize(8).text(format(new Date(), 'dd-MM-yyyy'), left + 497, topDestinatario + 158, {
                characterSpacing: 1,
            });
        }
        const _buildDestEndereco = () => {
            this.doc.rect(left, topDestinatario + 166, 246.5, 23).stroke();
            this.doc.fontSize(5).text('MUNICÍPIO', left + 4, topDestinatario + 171, {
                characterSpacing: 0.5,
            });
            this.doc.fontSize(8).text(String(this.dest?.enderDest?.xMun || ''), left + 5, topDestinatario + 181, {
                characterSpacing: 1,
            });

            this.doc.rect(left + 246.5, topDestinatario + 166, 113, 23).stroke();
            this.doc.fontSize(5).text('FONE / FAX', left + 250.5, topDestinatario + 171, {
                characterSpacing: 0.5,
            });
            this.doc.fontSize(8).text(this.dest?.enderDest?.fone  || '', left + 250.5, topDestinatario + 181, {
                characterSpacing: 1,
            });

            this.doc.rect(left + 359.5, topDestinatario + 166, 40, 23).stroke();
            this.doc.fontSize(5).text('UF', left + 363.5, topDestinatario + 171, {
                characterSpacing: 0.5,
            });
            this.doc.fontSize(8).text(String(this.dest?.enderDest?.UF || ''), left + 363.5, topDestinatario + 181, {
                characterSpacing: 1,
            });

            this.doc.rect(left + 399.5, topDestinatario + 166, 92.5, 23).stroke();
            this.doc.fontSize(5).text('INSCRIÇÃO ESTADUAL', left + 403.5, topDestinatario + 171, {
                characterSpacing: 0.5,
            });
            this.doc.fontSize(8).text(String(this.dest?.indIEDest || ''), left + 403.5, topDestinatario + 181, {
                characterSpacing: 1,
            });

            this.doc.rect(left + 492, topDestinatario + 166, 74.3, 23).stroke();
            this.doc.fontSize(5).text('HORA DA SAÍDA', left + 496, topDestinatario + 171, {
                characterSpacing: 0.5,
            });
            this.doc.fontSize(8).text(format(new Date(), 'HH:mm'), left + 497, topDestinatario + 181, {
                characterSpacing: 1,
            });
        }

        this.doc.fontSize(6).font('Times-Bold').text('DESTINATÁRIO / REMETENTE', left, topDestinatario + 114, {
            characterSpacing: 0.5,
        });
        _buildDestPessoa();
        _buildDestLogradouro();
        _buildDestEndereco();

    }

    _builCalculoImposto() {
        const { top, left } = this.doc.page.margins;
        this.setLineStyle(0.75, '#1c1c1c');
        const topDestinatario = top + 173;

        const _buildCalcImposto = () => {
            /** LINHA 1 */
            this.doc.rect(left, topDestinatario + 120, 86, 23).stroke();
            this.doc.fontSize(5).font('Times-Roman').text('BASE DE CÁLCULO DO ICMS', left + 4, topDestinatario + 125, {
                characterSpacing: 0.5,
            });
            this.doc.fontSize(8).text(parseFloat(String(this.total.ICMSTot.vBC)).toFixed(2), left - 8, topDestinatario + 135, {
                characterSpacing: 1,
                align: 'right',
                width: 86
            });
            this.doc.rect(left + 86, topDestinatario + 120, 79, 23).stroke();
            this.doc.fontSize(5).text('VALOR DO ICMS', left + 90, topDestinatario + 125, {
                characterSpacing: 0.5,
            });
            this.doc.fontSize(8).text(parseFloat(String(this.total.ICMSTot.vICMS)).toFixed(2), left + 86 - 16, topDestinatario + 135, {
                characterSpacing: 1,
                align: 'right',
                width: 86
            });
            this.doc.rect(left + 165, topDestinatario + 120, 79, 23).stroke();
            this.doc.fontSize(5).text('BASE CÁLC. ICMS SUBST', left + 169, topDestinatario + 125, {
                characterSpacing: 0.5,
            });
            this.doc.fontSize(8).text(parseFloat(String(this.total.ICMSTot.vBCST)).toFixed(2), left + 165 - 16, topDestinatario + 135, {
                characterSpacing: 1,
                align: 'right',
                width: 86
            });
            this.doc.rect(left + 244, topDestinatario + 120, 79, 23).stroke();
            this.doc.fontSize(5).text('VALOR DO ICMS SUBST.', left + 248, topDestinatario + 125, {
                characterSpacing: 0.5,
            });
            this.doc.fontSize(8).text(parseFloat(String(this.total.ICMSTot.vST)).toFixed(2), left + 244 - 16, topDestinatario + 135, {
                characterSpacing: 1,
                align: 'right',
                width: 86
            });
            this.doc.rect(left + 323, topDestinatario + 120, 91, 23).stroke();
            this.doc.fontSize(5).text('VALOR APROX. DOS TRIBUTOS', left + 327, topDestinatario + 125, {
                characterSpacing: 0.5,
            });
            this.doc.fontSize(8).text(parseFloat(this.total.ICMSTot.vTotTrib || '0').toFixed(2), left + 323 - 6, topDestinatario + 135, {
                characterSpacing: 1,
                align: 'right',
                width: 86
            });
            this.doc.rect(left + 414, topDestinatario + 120, 152.93, 23).fillAndStroke('#DDDDDD', '#1c1c1c');
            this.setLineStyle(0.75, '#1c1c1c');
            this.doc.fontSize(5).text('VALOR TOTAL DOS PRODUTOS', left + 418, topDestinatario + 125, {
                characterSpacing: 0.5,
            });
            this.doc.fontSize(8).text(parseFloat(String(this.total.ICMSTot.vProd)).toFixed(2), left + 480 - 8, topDestinatario + 135, {
                characterSpacing: 1,
                align: 'right',
                width: 86
            });

            /** LINHA 2 */
            this.doc.rect(left, topDestinatario + 143, 86, 23).stroke();
            this.doc.fontSize(5).text('VALOR DO FRETE', left + 4, topDestinatario + 148, {
                characterSpacing: 0.5,
            });
            this.doc.fontSize(8).text(parseFloat(String(this.total.ICMSTot.vFrete)).toFixed(2), left - 8, topDestinatario + 158, {
                characterSpacing: 1,
                align: 'right',
                width: 86
            });

            this.doc.rect(left + 86, topDestinatario + 143, 79, 23).stroke();
            this.doc.fontSize(5).text('VALOR DO SEGURO', left + 90, topDestinatario + 148, {
                characterSpacing: 0.5,
            });
            this.doc.fontSize(8).text(parseFloat(String(this.total.ICMSTot.vSeg)).toFixed(2), left + 86 - 16, topDestinatario + 158, {
                characterSpacing: 1,
                align: 'right',
                width: 86
            });
            this.doc.rect(left + 165, topDestinatario + 143, 79, 23).stroke();
            this.doc.fontSize(5).text('DESCONTO', left + 169, topDestinatario + 148, {
                characterSpacing: 0.5,
            });
            this.doc.fontSize(8).text(parseFloat(String(this.total.ICMSTot.vDesc)).toFixed(2), left + 165 - 16, topDestinatario + 158, {
                characterSpacing: 1,
                align: 'right',
                width: 86
            });
            this.doc.rect(left + 244, topDestinatario + 143, 79, 23).stroke();
            this.doc.fontSize(5).text('OUTRAS DESP. ACESS.', left + 248, topDestinatario + 148, {
                characterSpacing: 0.5,
            });
            this.doc.fontSize(8).text(parseFloat(String(this.total.ICMSTot.vOutro)).toFixed(2), left + 244 - 16, topDestinatario + 158, {
                characterSpacing: 1,
                align: 'right',
                width: 86
            });
            this.doc.rect(left + 323, topDestinatario + 143, 91, 23).stroke();
            this.doc.fontSize(5).text('VALOR DO IPI', left + 327, topDestinatario + 148, {
                characterSpacing: 0.5,
            });
            this.doc.fontSize(8).text(parseFloat(String(this.total.ICMSTot.vIPI)).toFixed(2), left + 323 - 6, topDestinatario + 158, {
                characterSpacing: 1,
                align: 'right',
                width: 86
            });
            this.doc.rect(left + 414, topDestinatario + 143, 152.93, 23).fillAndStroke('#DDDDDD', '#1c1c1c');
            this.setLineStyle(0.75, '#1c1c1c');
            this.doc.fontSize(5).text('VALOR TOTAL DA NOTA', left + 418, topDestinatario + 148, {
                characterSpacing: 0.5,
            });
            this.doc.fontSize(8).text(parseFloat(String(this.total.ICMSTot.vNF)).toFixed(2), left + 480 - 8, topDestinatario + 158, {
                characterSpacing: 1,
                align: 'right',
                width: 86
            });
        }

        this.doc.fontSize(6).font('Times-Bold').text('CÁLCULO DO IMPOSTO', left, topDestinatario + 114, {
            characterSpacing: 0.5,
        });
        _buildCalcImposto();

    }

    _builTransporte() {
        const { top, left } = this.doc.page.margins;
        this.setLineStyle(0.75, '#1c1c1c');
        const topDestinatario = top + 233;

        const getModFrete = () => {
            // * 0=Contratação do Frete por conta do Remetente (CIF)
            // * 1=Contratação do Frete por conta do Destinatário (FOB)
            // * 2=Contratação do Frete por conta de Terceiros
            // * 3=Transporte Próprio por conta do Remetente
            // * 4=Transporte Próprio por conta do Destinatário
            // * 9=Sem Ocorrência de Transporte. (Atualizado na NT 2016/002)
            const modFrete = parseInt(String(this.transp.modFrete));
            switch (modFrete) {
                case 0:
                    return `${modFrete} - REMETENTE`;
                case 1:
                    return `${modFrete} - DESTINATÁRIO`;
                case 2:
                    return `${modFrete} - TERCEIROS`;
                case 3:
                    return `${modFrete} - REMETENTE`;
                case 4:
                    return `${modFrete} - DESTINATÁRIO`;
                case 9:
                    return '';
                default:
                    return '';
            }
        }

        const _buildVolumeTransporte = () => {
            if (this.transp.vol) {
                /** Posição da primeira linha */
                let topTrnasport = topDestinatario + 166;
                let topTrnasportTitle = topDestinatario + 171;
                let topTrnasportValue = topDestinatario + 181;

                const createVolume = (vol: Vol) => {
                    this.doc.rect(left, topTrnasport, 68.5, 23).stroke();
                    this.doc.fontSize(5).text('QUANTIDADE', left + 4, topTrnasportTitle, {
                        characterSpacing: 0.5,
                    });
                    this.doc.fontSize(8).text(String(vol?.qVol || ''), left - 8, topTrnasportValue, {
                        characterSpacing: 1,
                        align: 'right',
                        width: 68.5
                    });
                    this.doc.rect(left + 68.5, topTrnasport, 100.5, 23).stroke();
                    this.doc.fontSize(5).text('ESPÉCIE', left + 72.5, topTrnasportTitle, {
                        characterSpacing: 0.5,
                    });
                    this.doc.fontSize(8).text(String(vol?.esp || ''), left + 73.5, topTrnasportValue, {
                        characterSpacing: 1,
                    });
                    this.doc.rect(left + 169, topTrnasport, 100.5, 23).stroke();
                    this.doc.fontSize(5).text('MARCA', left + 173, topTrnasportTitle, {
                        characterSpacing: 0.5,
                    });
                    this.doc.fontSize(8).text(String(vol?.marca || ''), left + 174, topTrnasportValue, {
                        characterSpacing: 1,
                    });
                    this.doc.rect(left + 269.5, topTrnasport, 100.5, 23).stroke();
                    this.doc.fontSize(5).text('NUMERAÇÃO', left + 273.5, topTrnasportTitle, {
                        characterSpacing: 0.5,
                    });
                    this.doc.fontSize(8).text(String(vol?.nVol || ''), left + 274.5, topTrnasportValue, {
                        characterSpacing: 1,
                    });
                    this.doc.rect(left + 370, topTrnasport, 102.6, 23).stroke();
                    this.doc.fontSize(5).text('PESO BRUTO', left + 374, topTrnasportTitle, {
                        characterSpacing: 0.5,
                    });
                    this.doc.fontSize(8).text(String(vol?.nVol || ''), left + 375, topTrnasportValue, {
                        characterSpacing: 1,
                    });
                    //96,43
                    this.doc.rect(left + 472.5, topTrnasport, 94.43, 23).stroke();
                    this.doc.fontSize(5).text('PESO LÍQUIDO', left + 474.5, topTrnasportTitle, {
                        characterSpacing: 0.5,
                    });
                    this.doc.fontSize(8).text(String(vol?.nVol || ''), left + 475.5, topTrnasportValue, {
                        characterSpacing: 1,
                    });
                    /** Define posição da nova linha */
                    topTrnasport = topTrnasport + 23;
                    topTrnasportTitle = topTrnasportTitle + 23;
                    topTrnasportValue = topTrnasportValue + 23;
                }

                if (this.transp.vol instanceof Array) {
                    for (let vol of this.transp.vol) {
                        createVolume(vol);
                    }
                } else {
                    createVolume(this.transp.vol);
                }

            }

        }

        const _buildCalcImposto = () => {
            const documento = this.documento.mascaraCnpjCpf(this.transp.transporta?.CNPJCPF || this.transp.transporta?.CNPJ || this.transp.transporta?.CPF || '');
            /** LINHA 1 */
            this.doc.rect(left, topDestinatario + 120, 248.5, 23).stroke();
            this.doc.fontSize(5).font('Times-Roman').text('RAZÃO SOCIAL', left + 4, topDestinatario + 125, {
                characterSpacing: 0.5,
            });
            this.doc.fontSize(8).text(this.transp.transporta?.xNome || '', left + 5, topDestinatario + 135, {
                characterSpacing: 1,
                width: 246
            });
            this.doc.rect(left + 248.5, topDestinatario + 120, 90, 23).stroke();
            this.doc.fontSize(5).text('FRETE POR CONTA', left + 252.5, topDestinatario + 125, {
                characterSpacing: 0.5,
            });
            this.doc.fontSize(8).text(getModFrete(), left + 253.5, topDestinatario + 135, {
                characterSpacing: 1,
            });
            this.doc.rect(left + 338.5, topDestinatario + 120, 50, 23).stroke();
            this.doc.fontSize(5).text('CÓDIGO ANTT', left + 342.5, topDestinatario + 125, {
                characterSpacing: 0.5,
            });
            this.doc.fontSize(8).text(this.transp?.veicTransp?.RNTC || '', left + 343.5, topDestinatario + 135, {
                characterSpacing: 1,
            });
            this.doc.rect(left + 388.5, topDestinatario + 120, 62, 23).stroke();
            this.doc.fontSize(5).text('PLACA DO VEÍCULO', left + 391.5, topDestinatario + 125, {
                characterSpacing: 0.5,
            });
            this.doc.fontSize(8).text(this.transp?.veicTransp?.placa || '', left + 393.5, topDestinatario + 135, {
                characterSpacing: 1,
            });
            this.doc.rect(left + 450.5, topDestinatario + 120, 22, 23).stroke();
            this.doc.fontSize(5).text('UF', left + 454.5, topDestinatario + 125, {
                characterSpacing: 0.5,
            });
            this.doc.fontSize(8).text(this.transp?.transporta?.UF || '', left + 455.5, topDestinatario + 135, {
                characterSpacing: 1,
            });
            this.doc.rect(left + 472.5, topDestinatario + 120, 94.43, 23).stroke();
            this.doc.fontSize(5).text('CNPJ / CPF', left + 476.5, topDestinatario + 125, {
                characterSpacing: 0.5,
            });
            this.doc.fontSize(8).text(documento, left + 477.5, topDestinatario + 135, {
                characterSpacing: 1,
            });

            /** LINHA 2 */
            this.doc.rect(left, topDestinatario + 143, 338.5, 23).stroke();
            this.doc.fontSize(5).text('ENDEREÇO', left + 4, topDestinatario + 148, {
                characterSpacing: 0.5,
            });
            this.doc.fontSize(8).text(this.transp.transporta?.xEnder || '', left + 4, topDestinatario + 158, {
                characterSpacing: 1,
            });
            this.doc.rect(left + 338.5, topDestinatario + 143, 112, 23).stroke();
            this.doc.fontSize(5).text('MUNICÍPIO', left + 342.5, topDestinatario + 148, {
                characterSpacing: 0.5,
            });
            this.doc.fontSize(8).text(this.transp.transporta?.xMun || '', left + 343.5, topDestinatario + 158, {
                characterSpacing: 1,
            });
            this.doc.rect(left + 450.5, topDestinatario + 143, 22, 23).stroke();
            this.doc.fontSize(5).text('UF', left + 454.5, topDestinatario + 148, {
                characterSpacing: 0.5,
            });
            this.doc.fontSize(8).text(this.transp?.transporta?.UF || '', left + 455.5, topDestinatario + 158, {
                characterSpacing: 1,
            });
            this.doc.rect(left + 472.5, topDestinatario + 143, 94.43, 23).stroke();
            this.doc.fontSize(5).text('INSCRIÇÃO ESTADUAL', left + 476.5, topDestinatario + 148, {
                characterSpacing: 0.5,
            });
            this.doc.fontSize(8).text(this.transp?.transporta?.IE || '', left + 476.5, topDestinatario + 158, {
                characterSpacing: 1,
            });
        }

        this.doc.fontSize(6).font('Times-Bold').text('TRANSPORTADOR / VOLUMES TRANSPORTADOS', left, topDestinatario + 114, {
            characterSpacing: 0.5,
        });
        _buildCalcImposto();
        _buildVolumeTransporte();

    }

    _buildProdutos() {
        const { top, left } = this.doc.page.margins;
        this.setLineStyle(0.75, '#1c1c1c');

        this.doc.fontSize(6).font('Times-Bold').fillColor('black').text('DADOS DO PRODUTO / SERVIÇOS', left, 452, {
            characterSpacing: 0.5,
        });

        const tableTop = 458;
        const defaultItemHeight = 15;
        let y = tableTop;
        let currentPage = 0;

        const header = (top: number) => {
            this.doc.rect(left, top, 40, defaultItemHeight).fillAndStroke('#DDDDDD', '#1c1c1c');
            this.setLineStyle(0.75, '#1c1c1c');
            this.doc.font('Times-Roman').fontSize(5.7).text('CÓDIGO DO PROD. / SERV', left, top + 2.8, {
                width: 40,
                align: 'center',
            });
            this.doc.rect(left + 40, top, 138, defaultItemHeight).fillAndStroke('#DDDDDD', '#1c1c1c');
            this.setLineStyle(0.75, '#1c1c1c');
            this.doc.text('DESCRIÇÃO DO PRODUTO / SERVIÇO', left + 40, top + 5.9, {
                width: 138,
                align: 'center'
            });
            this.doc.rect(left + 178, top, 30, defaultItemHeight).fillAndStroke('#DDDDDD', '#1c1c1c');
            this.setLineStyle(0.75, '#1c1c1c');
            this.doc.text('NCM / SH', left + 178, top + 5.9, {
                width: 30,
                align: 'center'
            });
            this.doc.rect(left + 208, top, 17, defaultItemHeight).fillAndStroke('#DDDDDD', '#1c1c1c');
            this.setLineStyle(0.75, '#1c1c1c');
            this.doc.text('CST', left + 208, top + 5.9, {
                width: 17,
                align: 'center'
            });
            this.doc.rect(left + 225, top, 28, defaultItemHeight).fillAndStroke('#DDDDDD', '#1c1c1c');
            this.setLineStyle(0.75, '#1c1c1c');
            this.doc.text('CFOP', left + 225, top + 5.9, {
                width: 28,
                align: 'center'
            });
            this.doc.rect(left + 253, top, 23, defaultItemHeight).fillAndStroke('#DDDDDD', '#1c1c1c');
            this.setLineStyle(0.75, '#1c1c1c');
            this.doc.text('UNID.', left + 253, top + 5.9, {
                width: 23,
                align: 'center'
            });
            this.doc.rect(left + 276, top, 25, defaultItemHeight).fillAndStroke('#DDDDDD', '#1c1c1c');
            this.setLineStyle(0.75, '#1c1c1c');
            this.doc.text('QUANT.', left + 276, top + 5.9, {
                width: 25,
                align: 'center'
            });
            this.doc.rect(left + 301, top, 37.23, defaultItemHeight).fillAndStroke('#DDDDDD', '#1c1c1c');
            this.setLineStyle(0.75, '#1c1c1c');
            this.doc.text('VALOR UNITÁRIO', left + 301, top + 2.9, {
                width: 37.23,
                align: 'center'
            });
            this.doc.rect(left + 338.23, top, 39.23, defaultItemHeight).fillAndStroke('#DDDDDD', '#1c1c1c');
            this.setLineStyle(0.75, '#1c1c1c');
            this.doc.text('VALOR DESCONTO', left + 338.23, top + 2.9, {
                width: 39.23,
                align: 'center'
            });
            this.doc.rect(left + 377.46, top, 33.23, defaultItemHeight).fillAndStroke('#DDDDDD', '#1c1c1c');
            this.setLineStyle(0.75, '#1c1c1c');
            this.doc.text('VALOR LIQUIDO', left + 377.46, top + 2.9, {
                width: 33.23,
                align: 'center'
            });
            this.doc.rect(left + 410.69, top, 38, defaultItemHeight).fillAndStroke('#DDDDDD', '#1c1c1c');
            this.setLineStyle(0.75, '#1c1c1c');
            this.doc.text('BASE CÁLC. ICMS', left + 413.8, top + 2.9, {
                width: 32,
                align: 'center'
            });
            this.doc.rect(left + 448.69, top, 35, defaultItemHeight).fillAndStroke('#DDDDDD', '#1c1c1c');
            this.setLineStyle(0.75, '#1c1c1c');
            this.doc.text('VALOR I.C.M.S.', left + 448.69, top + 2.9, {
                width: 35,
                align: 'center'
            });
            this.doc.rect(left + 483.69, top, 38, defaultItemHeight).fillAndStroke('#DDDDDD', '#1c1c1c');
            this.setLineStyle(0.75, '#1c1c1c');
            this.doc.text('VALOR I.P.I.', left + 490.69, top + 2.9, {
                width: 25,
                align: 'center'
            });
            this.doc.rect(left + 521.69, top, 45.2, 7.5).fillAndStroke('#DDDDDD', '#1c1c1c');
            this.setLineStyle(0.75, '#1c1c1c');
            this.doc.text('ALÍQUOTAS', left + 521.69, top + 2, {
                width: 45,
                align: 'center'
            });
            this.doc.rect(left + 521.69, top + 7.5, 22.5, 7.5).fillAndStroke('#DDDDDD', '#1c1c1c');
            this.setLineStyle(0.75, '#1c1c1c');
            this.doc.text('ICMS', left + 521.69, top + 9.5, {
                width: 22.5,
                align: 'center'
            });
            this.doc.rect(left + 544.19, top + 7.5, 22.75, 7.5).fillAndStroke('#DDDDDD', '#1c1c1c');
            this.setLineStyle(0.75, '#1c1c1c');
            this.doc.text('IPI', left + 544.19, top + 9.5, {
                width: 22.5,
                align: 'center'
            });
        };

        const row = (top: number, item: DetProd) => {
            function getCST(ICMS: ICMS): string {
                const chavesICMS: (keyof ICMS)[] = Object.keys(ICMS) as (keyof ICMS)[];

                const listaIcmsSemCST = [
                    'ICMSSN101',
                    'ICMSSN102',
                    'ICMSSN201',
                    'ICMSSN202',
                    'ICMSSN500',
                    'ICMSSN900'
                ];

                const icmsSemCST = listaIcmsSemCST.includes(chavesICMS[0]);

                let CST = '';
                if (chavesICMS.length > 0) {
                    const tipoICMS = chavesICMS[0];
                    if (!icmsSemCST) {
                        CST = (ICMS[tipoICMS] as any).CST;
                    }
                }
                return CST;
            }
            function getValoresItem(ICMS: ICMS): {
                vBC: string,
                vICMS: string,
                pICMS: string
            } {
                const chavesICMS: (keyof ICMS)[] = Object.keys(ICMS) as (keyof ICMS)[];

                const listaIcmsSemvBC = [
                    'ICMS02',
                    'ICMS15',
                    'ICMS30',
                    'ICMS40',
                    'ICMS53',
                    'ICMS60',
                    'ICMS61',
                    'ICMSST',
                    'ICMSSN101',
                    'ICMSSN102',
                    'ICMSSN201',
                    'ICMSSN202',
                    'ICMSSN500'
                ];
                const icmsSemvBC = listaIcmsSemvBC.includes(chavesICMS[0]);

                let vBC = '0,00';
                let vICMS = '0,00';
                let pICMS = '0,00';
                if (chavesICMS.length > 0) {
                    const tipoICMS = chavesICMS[0];
                    if (!icmsSemvBC) {
                        vBC = (ICMS[tipoICMS] as any).vBC;
                        vICMS = (ICMS[tipoICMS] as any).vICMS
                        pICMS = (ICMS[tipoICMS] as any).pICMS
                        return {
                            vBC: parseFloat(vBC).toFixed(2),
                            vICMS: parseFloat(vBC).toFixed(2),
                            pICMS: parseFloat(pICMS).toFixed(2)
                        };
                    }
                }
                return { vBC, vICMS, pICMS };
            }
            function getValoresIPI(IPI: IPI | undefined): { vIPI: string, pIPI: string } {
                if (!IPI) {
                    return {
                        vIPI: '0,00',
                        pIPI: '0,00'
                    }
                }

                let vIPI = parseFloat(String(IPI.IPITrib.vIPI)).toFixed(2);
                let pIPI = parseFloat(String(IPI.IPITrib.pIPI)).toFixed(2);
                return { vIPI, pIPI }
            }
            const CST = getCST(item.imposto.ICMS);
            const { vIPI, pIPI } = getValoresIPI(item.imposto.IPI);
            const { vBC, vICMS, pICMS } = getValoresItem(item.imposto.ICMS);

            const text = item.infAdProd ? `${item.prod.xProd || ''}\n${item.infAdProd}` : item.prod.xProd || '';
            const textHeight = this.doc.heightOfString(text, {
                width: 138,
                align: 'center'
            });

            const itemHeight = Math.max(defaultItemHeight, textHeight + 10); // 10 is padding

            this.setLineStyle(0.75, '#1c1c1c');
            this.doc.rect(left, top, 40, itemHeight).stroke();
            this.doc.font('Times-Roman').fontSize(6).text(item.prod.cProd || '', left + 2, top + 3, {
                width: 40,
            });

            this.doc.rect(left + 40, top, 138, itemHeight).stroke();
            this.doc.text(text, left + 43, top + 4, {
                width: 137,
            });

            this.doc.rect(left + 178, top, 30, itemHeight).stroke();
            this.doc.text(String(item.prod.NCM) || '', left + 178, top + 5.9, {
                width: 30,
                align: 'center'
            });

            this.doc.rect(left + 208, top, 17, itemHeight).stroke();
            this.doc.text(CST, left + 208, top + 5.9, {
                width: 17,
                align: 'center'
            });

            this.doc.rect(left + 225, top, 28, itemHeight).stroke();
            this.doc.text(String(item.prod.CFOP || ''), left + 225, top + 5.9, {
                width: 28,
                align: 'center'
            });

            this.doc.rect(left + 253, top, 23, itemHeight).stroke();
            this.doc.text(item.prod.uCom || item.prod.uTrib || '', left + 256, top + 5.9, {
                width: 23,
            });

            const quant = parseFloat(String(item.prod.qCom || item.prod.qTrib)).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 3 });
            this.doc.rect(left + 276, top, 25, itemHeight).stroke();
            this.doc.text(String(quant || ''), left + 274.5, top + 5.9, {
                width: 25,
                align: 'right'
            });

            const valUnit = parseFloat(String(item.prod.vUnCom || item.prod.vUnTrib || '0')).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            this.doc.rect(left + 301, top, 37.23, itemHeight).stroke();
            this.doc.text(valUnit, left + 299.5, top + 5.9, {
                width: 37.23,
                align: 'right'
            });

            const valDesc = parseFloat(String(item.prod.vDesc || '0')).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            this.doc.rect(left + 338.23, top, 39.23, itemHeight).stroke();
            this.doc.text(valDesc, left + 336.73, top + 5.9, {
                width: 39.23,
                align: 'right'
            });

            const valLiq = parseFloat(String(item.prod.vProd || '0')).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            this.doc.rect(left + 377.46, top, 33.23, itemHeight).stroke();
            this.doc.text(valLiq, left + 375.96, top + 5.9, {
                width: 33.23,
                align: 'right'
            });

            this.doc.rect(left + 410.69, top, 38, itemHeight).stroke();
            this.doc.text(vBC, left + 409.19, top + 5.9, {
                width: 38,
                align: 'right'
            });

            this.doc.rect(left + 448.69, top, 35, itemHeight).stroke();
            this.doc.text(vICMS, left + 447.19, top + 5.9, {
                width: 35,
                align: 'right'
            });

            this.doc.rect(left + 483.69, top, 38, itemHeight).stroke();
            this.doc.text(vIPI, left + 482.19, top + 5.9, {
                width: 38,
                align: 'right'
            });

            this.doc.rect(left + 521.69, top, 22.5, itemHeight).stroke();
            this.doc.text(pICMS, left + 520.19, top + 5.9, {
                width: 22.5,
                align: 'right'
            });

            this.doc.rect(left + 544.19, top, 22.75, itemHeight).stroke();
            this.doc.text(pIPI, left + 542.69, top + 5.9, {
                width: 22.5,
                align: 'right'
            });

            return itemHeight;
        };

        header(458);

        const createTable = (prod: DetProd) => {
            if (y + defaultItemHeight > this.doc.page.height - 160) {
                this.doc.addPage();
                currentPage++;
                if (currentPage > 0) {
                    y = 185;
                    this.doc.fontSize(6).font('Times-Bold').fillColor('black').text('DADOS DO PRODUTO / SERVIÇOS', left, 175, {
                        characterSpacing: 0.5,
                    });
                    header(185);
                }
            }
            const itemHeight = row(y + 15, prod);
            y += itemHeight;
        }

        // Adicionando itens da tabela
        if (this.det instanceof Array) {
            for (let i = 0; i < this.det.length; i++) {
                const prod = this.det[i];
                createTable(prod);
            }
        } else {
            createTable(this.det);
        }
    }

    _buildFooter() {
        const { left } = this.doc.page.margins;

        this.setLineStyle(0.75, '#1c1c1c');
        const topDestinatario = 820.45 - 88.5;

        this.doc.fontSize(6).font('Times-Bold').text('DADOS ADICIONAIS', left, topDestinatario - 5, {
            characterSpacing: 0.5,
        });
        this.doc.rect(left, topDestinatario, 408, 95).stroke();
        this.doc.fontSize(5).font('Times-Roman').text('INFORMAÇÕES COMPLEMENTARES', 10, topDestinatario + 4.5, {
            characterSpacing: 0.5
        });
        this.doc.fontSize(8).text(this.infAdic?.infCpl || '', 13, topDestinatario + 13, {
            characterSpacing: 1,
            width: 400,
        });
        this.doc.rect(left + 408, topDestinatario, 158.93, 95).stroke();
        this.doc.fontSize(5).text('RESERVADO AO FISCO', 408 + 10, topDestinatario + 4.5, {
            characterSpacing: 0.5
        });
        this.doc.fontSize(8).text(String(this.infAdic?.infAdFisco || ''), 13, topDestinatario + 13, {
            characterSpacing: 1,
            width: 400,
        });

        if (this.exibirMarcaDaguaDanfe) {
            const topPosition = Number(Number(this.ide.tpAmb)) !== 2 ? topDestinatario + 38 : topDestinatario + 58;
            const leftPosition = Number(Number(this.ide.tpAmb)) !== 2 ? left + 150 : left + 100;
            this.doc.fontSize(26).font('Times-Bold').fillColor('#c7c7c7').text('NFeWizard-io', leftPosition, topPosition, {
                characterSpacing: 0.5,
            });
        }

        if (Number(Number(this.ide.tpAmb)) === 2) {
            this.doc.fontSize(14).font('Times-Bold').fillColor('grey').text('AMBIENTE DE HOMOLOGAÇÃO - NF-E SEM VALOR FISCAL', left + 100, topDestinatario + 45, {
                characterSpacing: 1
            });
        }
        // .rotate(45, { origin: [0, 0] })
    }

    async generatePDF(exibirMarcaDaguaDanfe?: boolean) {
        try {
            this.exibirMarcaDaguaDanfe = exibirMarcaDaguaDanfe || true;
            const chave = this.chave;

            await this.generateBarcode(chave);

            this.doc.pipe(fs.createWriteStream(this.outputPath));

            this.drawHeader(true);

            this._buildDestinatario();
            this._builCalculoImposto();
            this._builTransporte();

            this.doc.on('pageAdded', () => {
                this.drawHeader(false);
            });
            this.drawFooter();
            this.doc.on('pageAdded', () => {
                this.drawFooter();
            });

            this._buildProdutos();
            this.doc.end();

            return {
                message: `  DANFE Gerada em '${this.outputPath}'`,
                success: true,
            };
        } catch (error: any) {
            throw new Error(`Erro ao gerar DANFE: ${error.message}`);
        }
    }
}

export default NFEGerarDanfe;
