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
import { XmlBuilder } from "@nfewizard/shared";

import { CTEAutorizacaoOSService } from '../CTEAutorizacaoOSService';

function create() {
    const real = new XmlBuilder({} as any);
    return new CTEAutorizacaoOSService(undefined, { getWebServiceUrl: () => 'https://qr.example/qrcode', getSvcCTe: () => 'SVC-SP' }, { gerarXml: real.gerarXml.bind(real), assinarXML: (x: string) => x });
}

const cteOS = (tpAmb = 2) => ({
    infCte: {
        ide: { cUF: 41, dhEmi: '2024-01-15T10:00:00-03:00', serie: 1, nCT: 1, cCT: '12345678', tpAmb },
        emit: { CNPJCPF: '11222333000181', xNome: 'EMIT' },
        toma: { CNPJCPF: '11222333000181', xNome: 'TOMADOR REAL' },
    },
});

describe('CTEAutorizacaoOSService', () => {
    it('usa o serviço CTeAutorizacaoOS, raiz CTeOS e modelo 67 na chave de acesso', () => {
        const s = create();
        const xml = s['gerarXml'](cteOS(1));

        expect(s.metodo).toBe('CTeAutorizacaoOS');
        expect(xml.startsWith('<CTeOS xmlns="http://www.portalfiscal.inf.br/cte"><infCte versao="4.00" Id="CTe41240111222333000181670010000000011123456')).toBe(true);
        expect(xml).toContain('<mod>67</mod>');
        expect(xml).toContain('<toma><CNPJ>11222333000181</CNPJ><xNome>TOMADOR REAL</xNome></toma>');
    });

    it('em homologação troca a razão social do tomador pelo texto oficial', () => {
        const xml = create()['gerarXml'](cteOS(2));
        expect(xml).toContain('<xNome>CTE EMITIDO EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL</xNome>');
        expect(xml).not.toContain('TOMADOR REAL');
    });
});
