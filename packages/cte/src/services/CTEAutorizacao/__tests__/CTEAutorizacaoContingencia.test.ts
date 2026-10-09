// @ts-nocheck
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
import { XmlBuilder, Utility } from '@nfewizard/shared';
import { CTEAutorizacaoService } from '../CTEAutorizacaoService';

function create(UF = 'PR', certKey?: string) {
    const environment = { config: { dfe: { UF }, nfe: { ambiente: 2 } }, getCertKey: () => certKey };
    const real = new XmlBuilder(environment as any);
    const utility = { getWebServiceUrl: () => 'https://qr.example/qrcode', getSvcCTe: () => new Utility(environment as any).getSvcCTe() };
    return new CTEAutorizacaoService(environment, utility, { gerarXml: real.gerarXml.bind(real), assinarXML: (x: string) => x });
}

const cte = (ide = {}) => ({
    infCte: {
        ide: { cUF: 41, dhEmi: '2024-01-15T10:00:00-03:00', serie: 1, nCT: 1, cCT: '12345678', tpAmb: 2, ...ide },
        emit: { CNPJCPF: '11222333000181', xNome: 'EMIT' },
    },
});

describe('CTEAutorizacaoService - QR Code e contingência', () => {
    it('preenche infCTeSupl/qrCodCTe (sem sign) na emissão normal, após infCte', () => {
        const xml = create()['gerarXml'](cte());
        expect(xml).toContain('</infCte><infCTeSupl><qrCodCTe>https://qr.example/qrcode?chCTe=41240111222333000181570010000000011123456782&amp;tpAmb=2</qrCodCTe></infCTeSupl>');
    });

    it('preserva o qrCodCTe informado pelo chamador', () => {
        const doc = { ...cte(), infCTeSupl: { qrCodCTe: 'https://meu/qr' } };
        expect(create()['gerarXml'](doc)).toContain('<qrCodCTe>https://meu/qr</qrCodCTe>');
    });

    it('exige dhCont e xJust em contingência e os proíbe na emissão normal', () => {
        const s = create();
        expect(() => s['gerarXml'](cte({ tpEmis: 5 }))).toThrow('exige dhCont e xJust');
        expect(() => s['gerarXml'](cte({ dhCont: '2024-01-15T09:00:00-03:00', xJust: 'Falha de comunicacao com a SEFAZ' }))).toThrow('não devem ser informados na emissão normal');
    });

    it('valida que tpEmis de SVC corresponde à SVC da UF (PR -> SVC-SP = 8; SP -> SVC-RS = 7)', () => {
        const cont = { dhCont: '2024-01-15T09:00:00-03:00', xJust: 'Falha de comunicacao com a SEFAZ' };
        expect(() => create('PR')['gerarXml'](cte({ tpEmis: 7, ...cont }))).toThrow('use tpEmis=8');
        expect(() => create('PR')['gerarXml'](cte({ tpEmis: 8, ...cont }))).not.toThrow();
        expect(() => create('SP')['gerarXml'](cte({ tpEmis: 8, ...cont }))).toThrow('use tpEmis=7');
        expect(() => create('SP')['gerarXml'](cte({ tpEmis: 7, ...cont }))).not.toThrow();
    });

    it('assina o QR Code (sign) em contingência EPEC/FS-DA', () => {
        const { generateKeyPairSync } = require('crypto');
        const pem = generateKeyPairSync('rsa', { modulusLength: 2048 }).privateKey.export({ type: 'pkcs8', format: 'pem' });
        const cont = { dhCont: '2024-01-15T09:00:00-03:00', xJust: 'Falha de comunicacao com a SEFAZ' };

        const xml = create('PR', pem)['gerarXml'](cte({ tpEmis: 5, ...cont }));
        expect(xml).toMatch(/<qrCodCTe>https:\/\/qr\.example\/qrcode\?chCTe=\d{44}&amp;tpAmb=2&amp;sign=[A-Za-z0-9+/=]+<\/qrCodCTe>/);
    });

    it('ExecTransmitirContingencia aceita só tpEmis 4 (EPEC) ou 5 (FS-DA)', async () => {
        await expect(create().ExecTransmitirContingencia({ CTe: cte({ tpEmis: 1 }) })).rejects.toThrow('tpEmis=1 inválido');
    });
});

describe('CTEAutorizacaoService - ordem dos campos de ide', () => {
    it('posiciona cCT, mod, tpEmis, cDV e verProc na sequência do schema mesmo quando omitidos no payload', () => {
        const doc = cte();
        // payload mínimo: sem mod, tpEmis, cDV e verProc, e com tpAmb antes de nCT
        doc.infCte.ide = { cUF: 41, serie: 1, nCT: 1, dhEmi: '2024-01-15T10:00:00-03:00', tpAmb: 2, tpCTe: 0, cCT: '12345678', natOp: 'X', CFOP: 6353 } as any;

        const xml = create()['gerarXml'](doc);
        const ide = xml.match(/<ide>(.*?)<\/ide>/)[1];
        const tags = [...ide.matchAll(/<(\w+)>/g)].map(m => m[1]);

        expect(tags).toEqual(['cUF', 'cCT', 'CFOP', 'natOp', 'mod', 'serie', 'nCT', 'dhEmi', 'tpEmis', 'cDV', 'tpAmb', 'tpCTe', 'verProc']);
    });
});
