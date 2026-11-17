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
import NFCERecepcaoEventoService from '../NFCERecepcaoEventoService';

/**
 * NT 2026.006 v1.01 - Evento Vinculação Pagamento (110300) na NFC-e. O XML do lote é
 * gerado com o XmlBuilder real e validado contra o envEvento_v1.00.xsd; a assinatura
 * é um bloco fictício que só precisa respeitar o schema.
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

const CHAVE = '41261112345678000195650010000005021833418270';

const criarServico = () => {
    const environment: any = { getConfig: () => ({ nfe: { ambiente: 2 }, dfe: { UF: 'PR' } }) };
    const xmlBuilder = new XmlBuilder(environment);
    xmlBuilder.assinarXML = (xml: string) => xml.replace(/<\/evento>$/, `${ASSINATURA_FICTICIA}</evento>`);
    return new NFCERecepcaoEventoService(environment, {} as any, xmlBuilder, {} as any, {} as any, {} as any);
};

const vinculacao: TipoEvento = {
    cOrgao: 41,
    tpAmb: 2,
    CNPJ: '12345678000195',
    chNFe: CHAVE,
    dhEvento: '2026-11-17T11:00:00-03:00',
    tpEvento: '110300',
    nSeqEvento: 1,
    verEvento: '1.00',
    detEvento: {
        descEvento: 'Vinculacao Pagamento',
        cOrgaoAutor: 41,
        tpAutor: 1,
        verAplic: 'nfewizard-teste',
        nProt: '141260000000003',
        gPgto: { idTransacao: 'BOLETO-0009', tpMeioPgto: '15', CNPJReceb: '11222333000181', CNPJBasePSP: '11222333' },
    },
};

describe('NFCERecepcaoEventoService - Vinculação Pagamento (110300)', () => {
    it('monta o detEvento do 110300 com idTransacao como atributo do gPgto', async () => {
        const xml: string = criarServico()['gerarXmlRecepcaoEvento']([vinculacao], 1, false);

        await expect(NFE_SchemaValidate(xml, 'RecepcaoEvento', { validator: 'validateSchemaJsBased' }))
            .resolves.toMatchObject({ success: true });
        expect(xml).toContain('<nProt>141260000000003</nProt><gPgto idTransacao="BOLETO-0009"><tpMeioPgto>15</tpMeioPgto>'
            + '<CNPJReceb>11222333000181</CNPJReceb><CNPJBasePSP>11222333</CNPJBasePSP></gPgto></detEvento>');
    });

    it('nomeia o 110300 e o 110001 no retorno', () => {
        const servico = criarServico();

        expect(servico['getTipoEventoName']('110300')).toBe('Vinculação Pagamento');
        expect(servico['getTipoEventoName']('110001')).toBe('Cancelamento de Evento');
    });
});
