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
 * NT 2026.005 v1.00 - Reforma Tributária: Simples Nacional (NF-e modelo 55).
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

const ICMS_SN_102 = { ICMSSN102: { orig: 0, CSOSN: '102' } };

const ENDERECO = {
    xLgr: 'Rua Exemplo', nro: '123', xBairro: 'Centro', cMun: 4115200, xMun: 'Maringa',
    UF: 'PR', CEP: '87000000', cPais: 1058, xPais: 'BRASIL',
};

type Cenario = {
    emit: Record<string, any>;
    prod?: Record<string, any>;
    ICMS?: Record<string, any>;
    IBSCBS?: Record<string, any>;
    IBSCBSTot?: Record<string, any>;
};

const montarLote = ({ emit, prod = {}, ICMS = ICMS_SN_102, IBSCBS, IBSCBSTot }: Cenario): any => ({
    idLote: 1,
    indSinc: 1,
    NFe: [{
        infNFe: {
            ide: {
                cUF: 41, cNF: '83341827', natOp: 'Venda', mod: 55, serie: '1', nNF: '3403',
                dhEmi: '2026-11-17T10:00:00-03:00', tpNF: 1, idDest: 1, cMunFG: 4115200, tpImp: 1,
                tpEmis: 1, cDV: 0, tpAmb: 2, finNFe: 1, indFinal: 1, indPres: 1, indIntermed: 0,
                procEmi: 0, verProc: 'nfewizard-teste',
            },
            emit: { CNPJCPF: '12345678000195', xNome: 'EMITENTE TESTE LTDA', enderEmit: ENDERECO, IE: '9012345678', ...emit },
            dest: { CNPJCPF: '02916265038485', xNome: 'DESTINATARIO TESTE', enderDest: ENDERECO, indIEDest: 9 },
            det: [{
                prod: {
                    cProd: '1', cEAN: 'SEM GTIN', xProd: 'PRODUTO TESTE', NCM: '61091000', CFOP: 5102,
                    uCom: 'UN', qCom: '1.0000', vUnCom: '100.00', vProd: '100.00', cEANTrib: 'SEM GTIN',
                    uTrib: 'UN', qTrib: '1.0000', vUnTrib: '100.00', indTot: 1, ...prod,
                },
                imposto: {
                    ICMS,
                    PIS: { PISNT: { CST: '07' } },
                    COFINS: { COFINSNT: { CST: '07' } },
                    ...(IBSCBS ? { IBSCBS } : {}),
                },
            }],
            total: {
                ICMSTot: {
                    vBC: '0.00', vICMS: '0.00', vICMSDeson: '0.00', vFCP: '0.00', vBCST: '0.00', vST: '0.00',
                    vFCPST: '0.00', vFCPSTRet: '0.00', vProd: '100.00', vFrete: '0.00', vSeg: '0.00',
                    vDesc: '0.00', vII: '0.00', vIPI: '0.00', vIPIDevol: '0.00', vPIS: '0.00',
                    vCOFINS: '0.00', vOutro: '0.00', vNF: '100.00',
                },
                ...(IBSCBSTot ? { IBSCBSTot } : {}),
            },
            transp: { modFrete: 9 },
            pag: { detPag: { indPag: 0, tPag: '01', vPag: '100.00' } },
        },
    }],
});

const G_IBSCBS = {
    vBC: '100.00',
    gIBSUF: { pIBSUF: '0.10', vIBSUF: '0.10' },
    gIBSMun: { pIBSMun: '0.00', vIBSMun: '0.00' },
    vIBS: '0.10',
    gCBS: { pCBS: '0.90', vCBS: '0.90' },
};

const TOTAIS_IBS_CBS = {
    gIBS: {
        gIBSUF: { vDif: '0.00', vDevTrib: '0.00', vIBSUF: '0.10' },
        gIBSMun: { vDif: '0.00', vDevTrib: '0.00', vIBSMun: '0.00' },
        vIBS: '0.10', vCredPres: '0.00', vCredPresCondSus: '0.00',
    },
    gCBS: { vDif: '0.00', vDevTrib: '0.00', vCBS: '0.90', vCredPres: '0.00', vCredPresCondSus: '0.00' },
};

const gerarXml = async (cenario: Cenario) => {
    const { xmlEnviNFe } = await criarServico().ExecGerarXml(montarLote(cenario));
    return xmlEnviNFe;
};

const validar = (xml: string) => NFE_SchemaValidate(xml, 'NFEAutorizacao', { validator: 'validateSchemaJsBased' });

describe('NFEAutorizacaoService - NT 2026.005 Simples Nacional (modelo 55)', () => {
    it('CRT 1 sem regime regular: gTribSN com gIBSSN e gCBSSN no item e no total', async () => {
        const xml = await gerarXml({
            emit: { CRT: 1 },
            prod: { cAtivSN: '01' },
            IBSCBS: {
                CST: '000',
                cClassTrib: '000001',
                gTribSN: {
                    gIBSSN: { pIBSSN: '2.0000', vIBSSN: '2.00' },
                    gCBSSN: { pCBSSN: '5.0000', vCBSSN: '5.00' },
                },
            },
            IBSCBSTot: { vBCIBSCBS: '100.00', gTribSN: { vIBSSN: '2.00', vCBSSN: '5.00' } },
        });

        await expect(validar(xml)).resolves.toMatchObject({ success: true });
        expect(xml).toContain('<indTot>1</indTot><cAtivSN>01</cAtivSN>');
        expect(xml).toContain('<cClassTrib>000001</cClassTrib><gTribSN><gIBSSN><pIBSSN>2.0000</pIBSSN><vIBSSN>2.00</vIBSSN></gIBSSN><gCBSSN><pCBSSN>5.0000</pCBSSN><vCBSSN>5.00</vCBSSN></gCBSSN></gTribSN>');
        expect(xml).toContain('<vBCIBSCBS>100.00</vBCIBSCBS><gTribSN><vIBSSN>2.00</vIBSSN><vCBSSN>5.00</vCBSSN></gTribSN></IBSCBSTot>');
        expect(xml).not.toContain('tpRegimeIBSCBS');
    });

    it('CRT 2 sem regime regular: gIBSCBS com CBS zerada e gTribSN só com gCBSSN', async () => {
        const xml = await gerarXml({
            emit: { CRT: 2 },
            prod: { cAtivSN: '02' },
            IBSCBS: {
                CST: '000',
                cClassTrib: '000001',
                gIBSCBS: { ...G_IBSCBS, gCBS: { pCBS: '0.00', vCBS: '0.00' } },
                gTribSN: { gCBSSN: { pCBSSN: '5.0000', vCBSSN: '5.00' } },
            },
            IBSCBSTot: {
                vBCIBSCBS: '100.00',
                ...TOTAIS_IBS_CBS,
                gTribSN: { vIBSSN: '0.00', vCBSSN: '5.00' },
            },
        });

        await expect(validar(xml)).resolves.toMatchObject({ success: true });
        expect(xml).toContain('</gIBSCBS><gTribSN><gCBSSN><pCBSSN>5.0000</pCBSSN><vCBSSN>5.00</vCBSSN></gCBSSN></gTribSN>');
        expect(xml).not.toContain('<gIBSSN>');
    });

    it('CRT 1 com regime regular: tpRegimeIBSCBS=1 depois do CRT, cAtivSN e gIBSCBS, sem gTribSN', async () => {
        const xml = await gerarXml({
            emit: { CRT: 1, tpRegimeIBSCBS: 1 },
            prod: { cAtivSN: '01' },
            IBSCBS: { CST: '000', cClassTrib: '000001', gIBSCBS: G_IBSCBS },
            IBSCBSTot: { vBCIBSCBS: '100.00', ...TOTAIS_IBS_CBS },
        });

        await expect(validar(xml)).resolves.toMatchObject({ success: true });
        expect(xml).toContain('<CRT>1</CRT><tpRegimeIBSCBS>1</tpRegimeIBSCBS></emit>');
        expect(xml).not.toContain('gTribSN');
    });

    it('deve reposicionar os campos novos informados fora da ordem do leiaute', async () => {
        const xml = await gerarXml({
            emit: { tpRegimeIBSCBS: 2, CRT: 3, ISUFEmit: '123456789' },
            prod: { xPed: 'PED-1', nItemPed: '1', cAtivSN: '90' },
            IBSCBS: {
                gTribSN: {
                    gCBSSN: { vCBSSN: '5.00', pCBSSN: '5.0000' },
                    gIBSSN: { vIBSSN: '2.00', pIBSSN: '2.0000' },
                },
                CST: '000',
                cClassTrib: '000001',
                gIBSCBS: G_IBSCBS,
                gEstornoCred: { vIBSEstCred: '0.00', vCBSEstCred: '0.00' },
            },
            IBSCBSTot: {
                gTribSN: { vCBSSN: '5.00', vIBSSN: '2.00' },
                vBCIBSCBS: '100.00',
                ...TOTAIS_IBS_CBS,
            },
        });

        await expect(validar(xml)).resolves.toMatchObject({ success: true });
        expect(xml).toContain('<CRT>3</CRT><tpRegimeIBSCBS>2</tpRegimeIBSCBS><ISUFEmit>123456789</ISUFEmit>');
        expect(xml).toContain('<indTot>1</indTot><cAtivSN>90</cAtivSN><xPed>PED-1</xPed>');
        expect(xml).toContain('</gIBSCBS><gTribSN><gIBSSN><pIBSSN>2.0000</pIBSSN><vIBSSN>2.00</vIBSSN></gIBSSN><gCBSSN><pCBSSN>5.0000</pCBSSN><vCBSSN>5.00</vCBSSN></gCBSSN></gTribSN><gEstornoCred>');
        expect(xml).toContain('<gTribSN><vIBSSN>2.00</vIBSSN><vCBSSN>5.00</vCBSSN></gTribSN></IBSCBSTot>');
    });

    it('XML sem os campos da NT continua válido', async () => {
        const xml = await gerarXml({
            emit: { CRT: 3 },
            ICMS: { ICMS00: { orig: 0, CST: '00', modBC: 0, vBC: '0.00', pICMS: '0.0000', vICMS: '0.00' } },
            IBSCBS: { CST: '000', cClassTrib: '000001', gIBSCBS: G_IBSCBS },
            IBSCBSTot: { vBCIBSCBS: '100.00', ...TOTAIS_IBS_CBS },
        });

        await expect(validar(xml)).resolves.toMatchObject({ success: true });
        expect(xml).not.toMatch(/tpRegimeIBSCBS|cAtivSN|gTribSN/);
    });

    it('o schema deve rejeitar cAtivSN fora da tabela da NT', async () => {
        const xml = await gerarXml({ emit: { CRT: 1 }, prod: { cAtivSN: '05' } });

        await expect(validar(xml)).rejects.toMatchObject({
            success: false,
            errors: [expect.objectContaining({ element: 'cAtivSN' })],
        });
    });

    it('o schema deve rejeitar gTribSN sem o gCBSSN', async () => {
        const xml = await gerarXml({
            emit: { CRT: 1 },
            prod: { cAtivSN: '01' },
            IBSCBS: { CST: '000', cClassTrib: '000001', gTribSN: { gIBSSN: { pIBSSN: '2.0000', vIBSSN: '2.00' } } },
            IBSCBSTot: { vBCIBSCBS: '100.00', gTribSN: { vIBSSN: '2.00', vCBSSN: '0.00' } },
        });

        await expect(validar(xml)).rejects.toMatchObject({
            success: false,
            errors: [expect.objectContaining({ element: 'gTribSN', raw: expect.stringContaining('gCBSSN') })],
        });
    });
});
