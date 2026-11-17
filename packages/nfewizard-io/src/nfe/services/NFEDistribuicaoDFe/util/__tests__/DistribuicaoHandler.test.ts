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
import { gzipSync } from 'zlib';
import { XmlParser } from '@nfewizard/shared';
import { DetEventoTributacaoSimplesNacional } from '@nfewizard/types/nfe';
import { DistribuicaoHandler } from '../DistribuicaoHandler.js';

describe('NFEDistribuicaoDFe - file naming', () => {
    const makeHandler = () => {
        const environment = { config: { dfe: {} } } as any;
        const utility = {} as any;
        return new DistribuicaoHandler(environment, utility, 'NFeDistribuicaoDFe');
    };

    it('should build unique names for res, proc and event using NSU', () => {
        const handler = makeHandler() as any;

        expect(handler.buildFileName('35123456789012345678901234567890123456789012', 'res', '000000000000001', '')).toBe('35123456789012345678901234567890123456789012-res-000000000000001');
        expect(handler.buildFileName('35123456789012345678901234567890123456789012', 'proc', '000000000000002', '')).toBe('35123456789012345678901234567890123456789012-proc-000000000000002');
        expect(handler.buildFileName('35123456789012345678901234567890123456789012', 'event', '000000000000003', '110110')).toBe('35123456789012345678901234567890123456789012-event-110110-000000000000003');
    });

    it('should fallback to deterministic index NSU when NSU is not available', () => {
        const handler = makeHandler() as any;

        expect(handler.getDocNsu({ $: { NSU: '' } }, 7)).toBe('idx-7');
        expect(handler.getDocNsu({}, 3)).toBe('idx-3');
    });

    it('should sanitize invalid filename characters and keep output stable', () => {
        const handler = makeHandler() as any;

        expect(handler.buildFileName('35/123', 'event', '0001', '110/110')).toBe('35_123-event-110_110-0001');
        expect(handler.buildFileName('', 'proc', '', '')).toBe('sem-chave-proc-sem-nsu');
    });
});

describe('NFEDistribuicaoDFe - evento 412140 Tributação do Simples Nacional (NT 2026.005)', () => {
    const CHAVE = '41261112345678000195550010000034031833418270';
    const NSU = '000000000000123';

    const procEvento = `<procEventoNFe versao="1.00" xmlns="http://www.portalfiscal.inf.br/nfe"><evento versao="1.00"><infEvento Id="ID412140${CHAVE}01">`
        + `<cOrgao>91</cOrgao><tpAmb>2</tpAmb><CNPJ>12345678000195</CNPJ><chNFe>${CHAVE}</chNFe><dhEvento>2026-12-01T10:00:00-03:00</dhEvento>`
        + '<tpEvento>412140</tpEvento><nSeqEvento>1</nSeqEvento><verEvento>1.00</verEvento>'
        + '<detEvento versao="1.00"><descEvento>Tributação do Simples Nacional</descEvento><cOrgaoAutor>41</cOrgaoAutor><tpAutor>5</tpAutor><verAplic>SVRS202611</verAplic>'
        + '<gTribItemSN nItem="1"><vRBSNitem>100.00</vRBSNitem><tpRBSN>1</tpRBSN><pIBSSN>2.0000</pIBSSN><vIBSSN>2.00</vIBSSN><pCBSSN>5.0000</pCBSSN><vCBSSN>5.00</vCBSSN></gTribItemSN>'
        + '<gTribItemSN nItem="2"><vRBSNitem>50.00</vRBSNitem><tpRBSN>3</tpRBSN></gTribItemSN>'
        + '<gTotalSN><vRBSNtot>150.00</vRBSNtot><vIBSSNtot>2.00</vIBSSNtot><vCBSSNtot>5.00</vCBSSNtot></gTotalSN></detEvento>'
        + '</infEvento></evento><retEvento versao="1.00"><infEvento><tpAmb>2</tpAmb><verAplic>SVRS202611</verAplic><cOrgao>91</cOrgao><cStat>135</cStat>'
        + `<xMotivo>Evento registrado e vinculado a NF-e</xMotivo><chNFe>${CHAVE}</chNFe><tpEvento>412140</tpEvento><xEvento>Tributação do Simples Nacional</xEvento>`
        + '<nSeqEvento>1</nSeqEvento><dhRegEvento>2026-12-01T10:00:01-03:00</dhRegEvento><nProt>141260000000001</nProt></infEvento></retEvento></procEventoNFe>';

    const retDistDFeInt = '<retDistDFeInt versao="1.01" xmlns="http://www.portalfiscal.inf.br/nfe"><tpAmb>2</tpAmb><cStat>138</cStat><xMotivo>Documento localizado</xMotivo>'
        + `<ultNSU>${NSU}</ultNSU><maxNSU>${NSU}</maxNSU><loteDistDFeInt>`
        + `<docZip NSU="${NSU}" schema="procEventoNFe_v1.00.xsd">${gzipSync(Buffer.from(procEvento, 'utf-8')).toString('base64')}</docZip>`
        + '</loteDistDFeInt></retDistDFeInt>';

    it('deve reconhecer o evento e expor o detalhamento por item e os totais', () => {
        const environment = { config: { dfe: {} } } as any;
        const utility = { findInObj: new XmlParser().findInObj } as any;
        const handler = new DistribuicaoHandler(environment, utility, 'NFeDistribuicaoDFe');
        const handleResponse = jest.spyOn(handler, 'handleResponse');

        const files = handler.deCompressDFeXML(retDistDFeInt as any, 'NFeDistribuicaoDFe', '');

        expect(files).toEqual([`${CHAVE}-event-412140-${NSU}`]);

        const evento = handleResponse.mock.calls[0][0];
        expect(evento.infEvento.tpEvento).toBe('412140');

        const detEvento: DetEventoTributacaoSimplesNacional = evento.infEvento.detEvento;
        expect(detEvento).toMatchObject({
            descEvento: 'Tributação do Simples Nacional',
            tpAutor: '5',
            gTribItemSN: [
                { vRBSNitem: '100.00', tpRBSN: '1', pIBSSN: '2.0000', vIBSSN: '2.00', pCBSSN: '5.0000', vCBSSN: '5.00' },
                { vRBSNitem: '50.00', tpRBSN: '3' },
            ],
            gTotalSN: { vRBSNtot: '150.00', vIBSSNtot: '2.00', vCBSSNtot: '5.00' },
        });
    });
});
