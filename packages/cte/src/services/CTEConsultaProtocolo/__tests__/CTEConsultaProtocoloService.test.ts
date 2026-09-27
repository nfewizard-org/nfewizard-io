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
import { CTEConsultaProtocoloService } from '../CTEConsultaProtocoloService';

const CHAVE_VALIDA = '41240612345678000199570010000000011000000015';

function createService(ambiente = 2) {
    const environment = { getConfig: () => ({ nfe: { ambiente } }) };
    return new CTEConsultaProtocoloService(environment, undefined, new XmlBuilder(environment));
}

describe('CTEConsultaProtocoloService - gerarXml', () => {
    it('monta o XML consSitCTe com a chave de acesso informada', () => {
        const service = createService(2);

        const xml = service['gerarXml'](CHAVE_VALIDA);

        expect(xml).toBe(
            `<consSitCTe versao="4.00" xmlns="http://www.portalfiscal.inf.br/cte"><tpAmb>2</tpAmb><xServ>CONSULTAR</xServ><chCTe>${CHAVE_VALIDA}</chCTe></consSitCTe>`
        );
    });

    it('lança erro quando a chave de acesso não possui 44 dígitos', () => {
        const service = createService();

        expect(() => service['gerarXml']('12345')).toThrow(
            'Chave de acesso do CT-e inválida: deve conter 44 dígitos.'
        );
    });
});
