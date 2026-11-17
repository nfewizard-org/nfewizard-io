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
import NFEAutorizacaoService from '../NFEAutorizacaoService';

/**
 * NT 2026.006 v1.01 - Vinculação com a Transação de Pagamento (grupo YC, NF-e modelo 55).
 *
 * Os XMLs são gerados pelo NFE_GerarXml (XmlBuilder real) e validados contra o
 * leiaute local (PL_010h). Só a assinatura é trocada por um bloco fictício, que
 * precisa apenas respeitar o schema, para o teste não depender de certificado.
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
    const environment: any = { getConfig: () => ({ nfe: { ambiente: 2 }, dfe: { UF: 'PR' } }) };
    const xmlBuilder = new XmlBuilder(environment);
    xmlBuilder.assinarXML = (xml: string) => xml.replace(/<\/NFe>$/, `${ASSINATURA_FICTICIA}</NFe>`);
    return new NFEAutorizacaoService(environment, {} as any, xmlBuilder, {} as any, {} as any, {} as any);
};

const ENDERECO = {
    xLgr: 'Rua Exemplo', nro: '123', xBairro: 'Centro', cMun: 4115200, xMun: 'Maringa',
    UF: 'PR', CEP: '87000000', cPais: 1058, xPais: 'BRASIL',
};

const pagamento = (nPag: number, idTransacao: string, tpMeioPgto = '15') => ({
    nPag, idTransacao, tpMeioPgto, CNPJReceb: '11222333000181', CNPJBasePSP: '11222333',
});

/** Monta o lote; `extras` entra no fim da infNFe, na ordem informada. */
const montarLote = (extras: Record<string, any> = {}): any => ({
    idLote: 1,
    indSinc: 1,
    NFe: [{
        infNFe: {
            ide: {
                cUF: 41, cNF: '83341827', natOp: 'Venda', mod: 55, serie: '1', nNF: '3404',
                dhEmi: '2026-11-17T10:00:00-03:00', tpNF: 1, idDest: 1, cMunFG: 4115200, tpImp: 1,
                tpEmis: 1, cDV: 0, tpAmb: 2, finNFe: 1, indFinal: 1, indPres: 2, indIntermed: 0,
                procEmi: 0, verProc: 'nfewizard-teste',
            },
            emit: { CNPJCPF: '12345678000195', xNome: 'EMITENTE TESTE LTDA', enderEmit: ENDERECO, IE: '9012345678', CRT: 3 },
            dest: { CNPJCPF: '02916265038485', xNome: 'DESTINATARIO TESTE', enderDest: ENDERECO, indIEDest: 9 },
            det: [{
                prod: {
                    cProd: '1', cEAN: 'SEM GTIN', xProd: 'PRODUTO TESTE', NCM: '61091000', CFOP: 5102,
                    uCom: 'UN', qCom: '1.0000', vUnCom: '100.00', vProd: '100.00', cEANTrib: 'SEM GTIN',
                    uTrib: 'UN', qTrib: '1.0000', vUnTrib: '100.00', indTot: 1,
                },
                imposto: {
                    ICMS: { ICMS00: { orig: 0, CST: '00', modBC: 0, vBC: '0.00', pICMS: '0.0000', vICMS: '0.00' } },
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
            pag: { detPag: { indPag: 1, tPag: '15', vPag: '100.00' } },
            ...extras,
        },
    }],
});

const gerarXml = async (lote: any) => (await criarServico().ExecGerarXml(lote)).xmlEnviNFe;

const validar = (xml: string) => NFE_SchemaValidate(xml, 'NFEAutorizacao', { validator: 'validateSchemaJsBased' });

const GRUPO_DOIS_PAGAMENTOS = '</pag><gPgtoVinc>'
    + '<gPgto nPag="1" idTransacao="BOLETO-0001"><tpMeioPgto>15</tpMeioPgto><CNPJReceb>11222333000181</CNPJReceb><CNPJBasePSP>11222333</CNPJBasePSP></gPgto>'
    + '<gPgto nPag="2" idTransacao="PIX-0002"><tpMeioPgto>17</tpMeioPgto><CNPJReceb>11222333000181</CNPJReceb><CNPJBasePSP>11222333</CNPJBasePSP></gPgto>'
    + '</gPgtoVinc><infAdic>';

describe('NFEAutorizacaoService - NT 2026.006 Vinculação com a Transação de Pagamento (modelo 55)', () => {
    it('grava o gPgtoVinc entre pag e infAdic, com nPag e idTransacao como atributos', async () => {
        const xml = await gerarXml(montarLote({
            gPgtoVinc: { gPgto: [pagamento(1, 'BOLETO-0001'), pagamento(2, 'PIX-0002', '17')] },
            infAdic: { infCpl: 'Pagamento por boleto e Pix' },
        }));

        await expect(validar(xml)).resolves.toMatchObject({ success: true });
        expect(xml).toContain(GRUPO_DOIS_PAGAMENTOS);
    });

    it('reposiciona o grupo informado depois do infAdic e do infRespTec e ordena os filhos do gPgto', async () => {
        const xml = await gerarXml(montarLote({
            infAdic: { infCpl: 'Pagamento por Pix' },
            infRespTec: { CNPJ: '12345678000195', xContato: 'Responsavel', email: 'resp@exemplo.com.br', fone: '4433334444' },
            gPgtoVinc: { gPgto: { CNPJBasePSP: '11222333', CNPJReceb: '11222333000181', tpMeioPgto: '20', idTransacao: 'PIX-0003', nPag: 1 } },
        }));

        await expect(validar(xml)).resolves.toMatchObject({ success: true });
        expect(xml).toContain('</pag><gPgtoVinc><gPgto nPag="1" idTransacao="PIX-0003"><tpMeioPgto>20</tpMeioPgto>'
            + '<CNPJReceb>11222333000181</CNPJReceb><CNPJBasePSP>11222333</CNPJBasePSP></gPgto></gPgtoVinc><infAdic>');
    });

    it('mantém os atributos quando a NF-e chega como XML em string', async () => {
        const xmlOriginal = await gerarXml(montarLote({
            gPgtoVinc: { gPgto: [pagamento(1, 'BOLETO-0001'), pagamento(2, 'PIX-0002', '17')] },
            infAdic: { infCpl: 'Pagamento por boleto e Pix' },
        }));

        const xml = await gerarXml(xmlOriginal);

        await expect(validar(xml)).resolves.toMatchObject({ success: true });
        expect(xml).toContain(GRUPO_DOIS_PAGAMENTOS);
    });

    it('XML sem o gPgtoVinc continua válido e sem o grupo', async () => {
        const xml = await gerarXml(montarLote({ infAdic: { infCpl: 'Sem vinculação' } }));

        await expect(validar(xml)).resolves.toMatchObject({ success: true });
        expect(xml).not.toContain('gPgtoVinc');
    });

    it('o schema deve rejeitar nPag repetido', async () => {
        const xml = await gerarXml(montarLote({
            gPgtoVinc: { gPgto: [pagamento(1, 'BOLETO-0001'), pagamento(1, 'PIX-0002', '17')] },
        }));

        await expect(validar(xml)).rejects.toMatchObject({
            success: false,
            errors: [expect.objectContaining({ raw: expect.stringContaining('pk_gPgto_nPag') })],
        });
    });

    it('o schema deve rejeitar idTransacao repetido', async () => {
        const xml = await gerarXml(montarLote({
            gPgtoVinc: { gPgto: [pagamento(1, 'BOLETO-0001'), pagamento(2, 'BOLETO-0001')] },
        }));

        await expect(validar(xml)).rejects.toMatchObject({
            success: false,
            errors: [expect.objectContaining({ raw: expect.stringContaining('pk_gPgto_idTransacao') })],
        });
    });
});
