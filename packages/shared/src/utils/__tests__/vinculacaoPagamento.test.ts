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
import path from 'path';
import libxmljs from 'libxmljs2';
import xml2js from 'xml2js';
import xsdAssembler from 'xsd-assembler';
import { formatarDetEventoVinculacaoPagamento, formatarGrupoPgtoVinc } from '../vinculacaoPagamento';

const PASTA_SCHEMAS = path.resolve(__dirname, '../../../resources/schemas');
const NAMESPACE_NFE = 'http://www.portalfiscal.inf.br/nfe';

/** Serializa como o XmlBuilder da lib: xml2js, sem declaração e sem indentação. */
const gerarXml = (obj: object, raiz: string): string =>
    new xml2js.Builder({ rootName: raiz, headless: true, renderOpts: { pretty: false } }).buildObject(obj);

/** Valida o XML contra um schema de resources/schemas, montado como no validador JS da lib. */
const validar = async (xml: string, schema: string) => {
    const xsd = await xsdAssembler.assemble(path.join(PASTA_SCHEMAS, schema));
    const xsdDoc = libxmljs.parseXml(xsd, { baseUrl: `${PASTA_SCHEMAS.split(path.sep).join('/')}/` });
    const xmlDoc = libxmljs.parseXml(xml);
    const valido = xmlDoc.validate(xsdDoc);
    return { valido, erros: xmlDoc.validationErrors.map(erro => erro.message.trim()) };
};

const pagamento = (nPag: number, idTransacao: string) => ({
    nPag, idTransacao, tpMeioPgto: '15', CNPJReceb: '11222333000181', CNPJBasePSP: '11222333',
});

describe('formatarGrupoPgtoVinc (NT 2026.006, grupo YC)', () => {
    it('não altera a infNFe sem gPgtoVinc', () => {
        const infNFe = { ide: {}, pag: { detPag: [] }, infAdic: { infCpl: 'x' } };
        const original = JSON.stringify(infNFe);

        formatarGrupoPgtoVinc(infNFe);

        expect(JSON.stringify(infNFe)).toBe(original);
    });

    it('grava nPag e idTransacao como atributos e mantém a ordem dos pagamentos', () => {
        const infNFe: any = { pag: {}, gPgtoVinc: { gPgto: [pagamento(1, 'BOLETO-1'), pagamento(2, 'PIX-2')] } };

        formatarGrupoPgtoVinc(infNFe);

        expect(infNFe.gPgtoVinc.gPgto).toEqual([
            { $: { nPag: 1, idTransacao: 'BOLETO-1' }, tpMeioPgto: '15', CNPJReceb: '11222333000181', CNPJBasePSP: '11222333' },
            { $: { nPag: 2, idTransacao: 'PIX-2' }, tpMeioPgto: '15', CNPJReceb: '11222333000181', CNPJBasePSP: '11222333' },
        ]);
    });

    it('move o grupo para antes do infAdic e ordena os filhos do gPgto', () => {
        const infNFe: any = {
            ide: {},
            pag: {},
            infIntermed: { CNPJ: '99999999000191', idCadIntTran: 'loja' },
            infAdic: { infCpl: 'x' },
            infRespTec: { CNPJ: '99999999000191' },
            gPgtoVinc: { gPgto: { CNPJBasePSP: '11222333', idTransacao: 'PIX-1', CNPJReceb: '11222333000181', tpMeioPgto: '17', nPag: '1' } },
        };

        formatarGrupoPgtoVinc(infNFe);

        expect(Object.keys(infNFe)).toEqual(['ide', 'pag', 'infIntermed', 'gPgtoVinc', 'infAdic', 'infRespTec']);
        expect(Object.keys(infNFe.gPgtoVinc.gPgto)).toEqual(['$', 'tpMeioPgto', 'CNPJReceb', 'CNPJBasePSP']);
        expect(infNFe.gPgtoVinc.gPgto.$).toEqual({ nPag: '1', idTransacao: 'PIX-1' });
    });

    it('deixa o grupo no fim quando não há grupo posterior a ele', () => {
        const infNFe: any = { gPgtoVinc: { gPgto: pagamento(1, 'TED-1') }, ide: {}, pag: {} };

        formatarGrupoPgtoVinc(infNFe);

        expect(Object.keys(infNFe)).toEqual(['ide', 'pag', 'gPgtoVinc']);
    });

    it('aproveita atributos já informados em `$`', () => {
        const infNFe: any = {
            gPgtoVinc: { gPgto: { $: { nPag: 3, idTransacao: 'TEF-3' }, tpMeioPgto: '24', CNPJReceb: '11222333000181', CNPJBasePSP: '11222333' } },
        };

        formatarGrupoPgtoVinc(infNFe);

        expect(infNFe.gPgtoVinc.gPgto.$).toEqual({ nPag: 3, idTransacao: 'TEF-3' });
        expect(gerarXml(infNFe.gPgtoVinc, 'gPgtoVinc')).toBe(
            '<gPgtoVinc><gPgto nPag="3" idTransacao="TEF-3"><tpMeioPgto>24</tpMeioPgto>'
            + '<CNPJReceb>11222333000181</CNPJReceb><CNPJBasePSP>11222333</CNPJBasePSP></gPgto></gPgtoVinc>',
        );
    });
});

describe('formatarDetEventoVinculacaoPagamento (evento 110300)', () => {
    const detEvento = {
        gPgto: { CNPJReceb: '11222333000181', idTransacao: 'TX123456', tpMeioPgto: '17', CNPJBasePSP: '11222333' },
        descEvento: 'Vinculação Pagamento',
        cOrgaoAutor: 41,
        tpAutor: 1,
        verAplic: 'nfewizard-teste',
        nProt: '141260000000001',
    };

    const gerarDetEvento = (det: object) =>
        gerarXml({ $: { versao: '1.00', xmlns: NAMESPACE_NFE }, ...formatarDetEventoVinculacaoPagamento(det) }, 'detEvento');

    it('grava idTransacao como atributo, põe o gPgto no fim e não altera o objeto recebido', () => {
        const formatado: any = formatarDetEventoVinculacaoPagamento(detEvento);

        expect(Object.keys(formatado)).toEqual(['descEvento', 'cOrgaoAutor', 'tpAutor', 'verAplic', 'nProt', 'gPgto']);
        expect(formatado.gPgto).toEqual({
            $: { idTransacao: 'TX123456' }, tpMeioPgto: '17', CNPJReceb: '11222333000181', CNPJBasePSP: '11222333',
        });
        expect(detEvento.gPgto).toEqual({ CNPJReceb: '11222333000181', idTransacao: 'TX123456', tpMeioPgto: '17', CNPJBasePSP: '11222333' });
    });

    it('devolve o detEvento como está quando não há gPgto', () => {
        const semPagamento = { descEvento: 'Vinculação Pagamento' };

        expect(formatarDetEventoVinculacaoPagamento(semPagamento)).toBe(semPagamento);
    });

    it('gera um detEvento válido no schema e110300_v1.00.xsd', async () => {
        const xml = gerarDetEvento(detEvento);

        expect(xml).toContain('<nProt>141260000000001</nProt><gPgto idTransacao="TX123456"><tpMeioPgto>17</tpMeioPgto>');
        await expect(validar(xml, 'e110300_v1.00.xsd')).resolves.toEqual({ valido: true, erros: [] });
    });

    it('o schema e110300 rejeita nPag no evento e tpAutor diferente de 1', async () => {
        const comNPag = await validar(gerarDetEvento({ ...detEvento, gPgto: { nPag: 1, ...detEvento.gPgto } }), 'e110300_v1.00.xsd');
        const outroAutor = await validar(gerarDetEvento({ ...detEvento, tpAutor: 2 }), 'e110300_v1.00.xsd');

        expect(comNPag.valido).toBe(false);
        expect(comNPag.erros.join(' ')).toContain('nPag');
        expect(outroAutor.valido).toBe(false);
        expect(outroAutor.erros.join(' ')).toContain('tpAutor');
    });
});

describe('Cancelamento de Evento (110001) da Vinculação Pagamento', () => {
    const gerarCancelamento = (tpEventoAut: string) => gerarXml({
        $: { versao: '1.00', xmlns: NAMESPACE_NFE },
        descEvento: 'Cancelamento de Evento',
        cOrgaoAutor: 41,
        verAplic: 'nfewizard-teste',
        tpEventoAut,
        nProtEvento: '141260000000002',
    }, 'detEvento');

    it('o schema e110001_v1.00.xsd aceita o cancelamento do evento 110300', async () => {
        await expect(validar(gerarCancelamento('110300'), 'e110001_v1.00.xsd')).resolves.toEqual({ valido: true, erros: [] });
    });

    it('o schema e110001_v1.00.xsd não aceita cancelar o cancelamento da NF-e (110111)', async () => {
        const resultado = await validar(gerarCancelamento('110111'), 'e110001_v1.00.xsd');

        expect(resultado.valido).toBe(false);
        expect(resultado.erros.join(' ')).toContain('tpEventoAut');
    });
});
