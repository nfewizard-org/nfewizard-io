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
import { NFE_SchemaValidate, XmlBuilder } from '@nfewizard/shared';
import { NFCEAutorizacaoService } from '../NFCEAutorizacaoService';

/**
 * NT 2026.006 v1.01 - Vinculação com a Transação de Pagamento (grupo YC, NFC-e modelo 65).
 *
 * O XML é gerado pelo serviço com o XmlBuilder real e validado contra o leiaute
 * local (PL_010h). Só a assinatura é trocada por um bloco fictício, que precisa
 * apenas respeitar o schema, para o teste não depender de certificado.
 */

const ASSINATURA_FICTICIA = '<Signature xmlns="http://www.w3.org/2000/09/xmldsig#"><SignedInfo>'
    + '<CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>'
    + '<SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"/>'
    + '<Reference URI="#NFe"><Transforms>'
    + '<Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>'
    + '<Transform Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>'
    + '</Transforms><DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/>'
    + '<DigestValue>AAAA</DigestValue></Reference></SignedInfo><SignatureValue>AAAA</SignatureValue>'
    + '<KeyInfo><X509Data><X509Certificate>AAAA</X509Certificate></X509Data></KeyInfo></Signature>';

const criarServico = () => {
    const config = { nfe: { ambiente: 2, idCSC: 1, tokenCSC: 'TOKEN-CSC-TESTE' }, dfe: { UF: 'PR' } };
    const environment: any = { getConfig: () => config };
    const utility: any = {
        getUrlNFCe: (metodo: string) => metodo === 'URL-QRCode'
            ? 'http://www.fazenda.pr.gov.br/nfce/qrcode'
            : 'http://www.fazenda.pr.gov.br/nfce/consulta',
    };
    const xmlBuilder = new XmlBuilder(environment);
    xmlBuilder.assinarXML = (xml: string) => xml.replace(/<\/NFe>$/, `${ASSINATURA_FICTICIA}</NFe>`);
    return new NFCEAutorizacaoService(environment, utility, xmlBuilder, {} as any, {} as any, {} as any);
};

/** Monta o lote; `extras` entra no fim da infNFe, na ordem informada. */
const montarLote = (extras: Record<string, any> = {}): any => ({
    idLote: 1,
    indSinc: 1,
    NFe: [{
        infNFe: {
            ide: {
                cUF: 41, cNF: '83341827', natOp: 'Venda', mod: 65, serie: '1', nNF: '502',
                dhEmi: '2026-11-17T10:00:00-03:00', tpNF: 1, idDest: 1, cMunFG: 4115200, tpImp: 4,
                tpEmis: 1, cDV: 0, tpAmb: 2, finNFe: 1, indFinal: 1, indPres: 1, indIntermed: 0,
                procEmi: 0, verProc: 'nfewizard-teste',
            },
            emit: {
                CNPJCPF: '12345678000195',
                xNome: 'EMITENTE TESTE LTDA',
                enderEmit: {
                    xLgr: 'Rua Exemplo', nro: '123', xBairro: 'Centro', cMun: 4115200, xMun: 'Maringa',
                    UF: 'PR', CEP: '87000000', cPais: 1058, xPais: 'BRASIL',
                },
                IE: '9012345678',
                CRT: 1,
            },
            det: [{
                prod: {
                    cProd: '1', cEAN: 'SEM GTIN', xProd: 'PRODUTO TESTE', NCM: '61091000', CFOP: 5102,
                    uCom: 'UN', qCom: '1.0000', vUnCom: '100.00', vProd: '100.00', cEANTrib: 'SEM GTIN',
                    uTrib: 'UN', qTrib: '1.0000', vUnTrib: '100.00', indTot: 1,
                },
                imposto: {
                    ICMS: { ICMSSN102: { orig: 0, CSOSN: '102' } },
                    PIS: { PISNT: { CST: '07' } },
                    COFINS: { COFINSNT: { CST: '07' } },
                },
            }],
            total: {
                ICMSTot: {
                    vBC: '0.00', vICMS: '0.00', vICMSDeson: '0.00', vFCP: '0.00', vBCST: '0.00', vST: '0.00',
                    vFCPST: '0.00', vFCPSTRet: '0.00', vProd: '100.00', vFrete: '0.00', vSeg: '0.00',
                    vDesc: '0.00', vII: '0.00', vIPI: '0.00', vIPIDevol: '0.00', vPIS: '0.00',
                    vCOFINS: '0.00', vOutro: '0.00', vNF: '100.00',
                },
            },
            transp: { modFrete: 9 },
            pag: { detPag: { indPag: 0, tPag: '17', vPag: '100.00' } },
            ...extras,
        },
    }],
});

const gerarXml = (lote: any): string => criarServico()['gerarXmlNFCEAutorizacao'](lote);

const validar = (xml: string) => NFE_SchemaValidate(xml, 'NFEAutorizacao', { validator: 'validateSchemaJsBased' });

describe('NFCEAutorizacaoService - NT 2026.006 Vinculação com a Transação de Pagamento (modelo 65)', () => {
    it('grava o gPgtoVinc entre pag e infAdic, com nPag e idTransacao como atributos', async () => {
        const xml = gerarXml(montarLote({
            infAdic: { infCpl: 'Pix QR Code gerado antes da emissao' },
            gPgtoVinc: { gPgto: { CNPJBasePSP: '11222333', CNPJReceb: '11222333000181', tpMeioPgto: '17', idTransacao: 'PIX-0001', nPag: 1 } },
        }));

        await expect(validar(xml)).resolves.toMatchObject({ success: true });
        expect(xml).toContain('<mod>65</mod>');
        expect(xml).toContain('</pag><gPgtoVinc><gPgto nPag="1" idTransacao="PIX-0001"><tpMeioPgto>17</tpMeioPgto>'
            + '<CNPJReceb>11222333000181</CNPJReceb><CNPJBasePSP>11222333</CNPJBasePSP></gPgto></gPgtoVinc><infAdic>');
    });

    it('XML sem o gPgtoVinc continua válido e sem o grupo', async () => {
        const xml = gerarXml(montarLote());

        await expect(validar(xml)).resolves.toMatchObject({ success: true });
        expect(xml).not.toContain('gPgtoVinc');
    });
});
