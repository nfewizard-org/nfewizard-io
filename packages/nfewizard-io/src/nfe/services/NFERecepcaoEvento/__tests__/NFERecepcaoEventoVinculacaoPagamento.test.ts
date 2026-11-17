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
import { TipoEvento } from '@nfewizard/types/nfe';
import NFERecepcaoEventoService from '../NFERecepcaoEventoService';

/**
 * NT 2026.006 v1.01 - Evento Vinculação Pagamento (110300) e o cancelamento pelo
 * evento genérico 110001 (NT 2025.002). O XML do lote é gerado com o XmlBuilder real e
 * validado contra o envEvento_v1.00.xsd; a assinatura é um bloco fictício que só
 * precisa respeitar o schema.
 */

const ASSINATURA_FICTICIA = '<Signature xmlns="http://www.w3.org/2000/09/xmldsig#"><SignedInfo>'
    + '<CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>'
    + '<SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"/>'
    + '<Reference URI="#ID"><Transforms>'
    + '<Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>'
    + '<Transform Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>'
    + '</Transforms><DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/>'
    + '<DigestValue>AAAA</DigestValue></Reference></SignedInfo><SignatureValue>AAAA</SignatureValue>'
    + '<KeyInfo><X509Data><X509Certificate>AAAA</X509Certificate></X509Data></KeyInfo></Signature>';

const CHAVE = '41261112345678000195550010000034041833418270';

const criarServico = () => {
    const environment: any = { getConfig: () => ({ nfe: { ambiente: 2 }, dfe: { UF: 'PR' } }) };
    const xmlBuilder = new XmlBuilder(environment);
    xmlBuilder.assinarXML = (xml: string) => xml.replace(/<\/evento>$/, `${ASSINATURA_FICTICIA}</evento>`);
    return new NFERecepcaoEventoService(environment, {} as any, xmlBuilder, {} as any, {} as any, {} as any);
};

const vinculacao = (): TipoEvento => ({
    cOrgao: 41,
    tpAmb: 2,
    CNPJ: '12345678000195',
    chNFe: CHAVE,
    dhEvento: '2026-11-17T11:00:00-03:00',
    tpEvento: '110300',
    nSeqEvento: 1,
    verEvento: '1.00',
    detEvento: {
        descEvento: 'Vinculação Pagamento',
        cOrgaoAutor: 41,
        tpAutor: 1,
        verAplic: 'nfewizard-teste',
        nProt: '141260000000001',
        gPgto: { idTransacao: 'PIX-0003', tpMeioPgto: '17', CNPJReceb: '11222333000181', CNPJBasePSP: '11222333' },
    },
});

const cancelamentoDaVinculacao = (): TipoEvento => ({
    cOrgao: 41,
    tpAmb: 2,
    CNPJ: '12345678000195',
    chNFe: CHAVE,
    dhEvento: '2026-11-17T12:00:00-03:00',
    tpEvento: '110001',
    nSeqEvento: 1,
    verEvento: '1.00',
    detEvento: {
        descEvento: 'Cancelamento de Evento',
        cOrgaoAutor: 41,
        verAplic: 'nfewizard-teste',
        tpEventoAut: '110300',
        nProtEvento: '141260000000002',
    },
});

const gerarLote = (evento: TipoEvento): string => criarServico()['gerarXmlRecepcaoEvento']([evento], 1, false);

const validar = (xml: string) => NFE_SchemaValidate(xml, 'RecepcaoEvento', { validator: 'validateSchemaJsBased' });

describe('NFERecepcaoEventoService - Vinculação Pagamento (110300) e Cancelamento de Evento (110001)', () => {
    it('monta o detEvento do 110300 com idTransacao como atributo do gPgto', async () => {
        const evento = vinculacao();

        const xml = gerarLote(evento);

        await expect(validar(xml)).resolves.toMatchObject({ success: true });
        expect(xml).toContain(`<infEvento Id="ID110300${CHAVE}01"><cOrgao>41</cOrgao>`);
        expect(xml).toContain('<detEvento versao="1.00"><descEvento>Vinculação Pagamento</descEvento><cOrgaoAutor>41</cOrgaoAutor>'
            + '<tpAutor>1</tpAutor><verAplic>nfewizard-teste</verAplic><nProt>141260000000001</nProt>'
            + '<gPgto idTransacao="PIX-0003"><tpMeioPgto>17</tpMeioPgto><CNPJReceb>11222333000181</CNPJReceb>'
            + '<CNPJBasePSP>11222333</CNPJBasePSP></gPgto></detEvento>');
        expect(evento.detEvento).toEqual(vinculacao().detEvento);
    });

    it('monta o cancelamento genérico 110001 apontando o evento 110300', async () => {
        const xml = gerarLote(cancelamentoDaVinculacao());

        await expect(validar(xml)).resolves.toMatchObject({ success: true });
        expect(xml).toContain('<detEvento versao="1.00"><descEvento>Cancelamento de Evento</descEvento><cOrgaoAutor>41</cOrgaoAutor>'
            + '<verAplic>nfewizard-teste</verAplic><tpEventoAut>110300</tpEventoAut><nProtEvento>141260000000002</nProtEvento></detEvento>');
    });

    it('envia os dois eventos à SEFAZ autorizadora e os nomeia no retorno', () => {
        const servico = criarServico();

        const { nacional, regional } = servico['separaEventosPorAmbiente']([vinculacao(), cancelamentoDaVinculacao()]);

        expect(nacional).toHaveLength(0);
        expect(regional).toHaveLength(2);
        expect(servico['getTipoEventoName']('110300')).toBe('Vinculação Pagamento');
        expect(servico['getTipoEventoName']('110001')).toBe('Cancelamento de Evento');
    });
});
