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
import { XmlBuilder } from '@nfewizard/shared';
import { CTEStatusServicoService } from '../CTEStatusServicoService';

function createService(uf = 'PR', ambiente = 2) {
    const environment = { getConfig: () => ({ dfe: { UF: uf }, nfe: { ambiente } }) };
    return new CTEStatusServicoService(environment, undefined, new XmlBuilder(environment));
}

describe('CTEStatusServicoService - gerarXml', () => {
    it('monta o XML consStatServCTe com o código IBGE da UF configurada e o ambiente informado', () => {
        const service = createService('PR', 2);

        const xml = service['gerarXml']();

        expect(xml).toBe(
            '<consStatServCTe versao="4.00" xmlns="http://www.portalfiscal.inf.br/cte"><tpAmb>2</tpAmb><cUF>41</cUF><xServ>STATUS</xServ></consStatServCTe>'
        );
    });

    it('reflete o ambiente de produção (tpAmb=1) quando configurado', () => {
        const service = createService('SP', 1);

        const xml = service['gerarXml']();

        expect(xml).toContain('<tpAmb>1</tpAmb>');
        expect(xml).toContain('<cUF>35</cUF>');
    });
});
