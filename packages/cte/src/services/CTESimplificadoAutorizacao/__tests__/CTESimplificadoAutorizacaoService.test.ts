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

import { CTESimplificadoAutorizacaoService } from '../CTESimplificadoAutorizacaoService';

describe('CTESimplificadoAutorizacaoService', () => {
    it('usa o serviço CTeSimplificadoAutorizacao, raiz CTeSimp e modelo 57', () => {
        const real = new XmlBuilder({} as any);
        const s = new CTESimplificadoAutorizacaoService(undefined, { getWebServiceUrl: () => 'https://qr.example/qrcode', getSvcCTe: () => 'SVC-SP' }, { gerarXml: real.gerarXml.bind(real), assinarXML: (x: string) => x });
        const xml = s['gerarXml']({
            infCte: {
                ide: { cUF: 41, dhEmi: '2024-01-15T10:00:00-03:00', serie: 1, nCT: 1, cCT: '12345678', tpAmb: 1 },
                emit: { CNPJCPF: '11222333000181', xNome: 'EMIT' },
                toma: { CNPJCPF: '11222333000181', xNome: 'TOMADOR' },
            },
        });

        expect(s.metodo).toBe('CTeSimplificadoAutorizacao');
        expect(xml.startsWith('<CTeSimp xmlns="http://www.portalfiscal.inf.br/cte">')).toBe(true);
        expect(xml).toContain('<mod>57</mod>');
    });
});
