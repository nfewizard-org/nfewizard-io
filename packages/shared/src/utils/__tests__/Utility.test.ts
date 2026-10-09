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
// SchemaLoader usa import.meta, não suportado pelo ts-jest em CommonJS
jest.mock('../../adapters/SchemaLoader', () => ({ getSchema: () => ({}) }));

import { Utility } from '../Utility';

function utility(UF: string, ambiente = 2) {
    return new Utility({ config: { dfe: { UF }, nfe: { ambiente } } } as any);
}

describe('Utility - URLs de CT-e', () => {
    it('resolve por UF, com indireção para a SVRS (ex.: BA) e endpoint próprio (ex.: PR)', () => {
        expect(utility('BA').getWebServiceUrl('CTeStatusServico', false, '4.00', 'CTe'))
            .toBe('https://cte-homologacao.svrs.rs.gov.br/ws/CTeStatusServicoV4/CTeStatusServicoV4.asmx');
        expect(utility('PR', 1).getWebServiceUrl('CTeAutorizacao', false, '4.00', 'CTe'))
            .toBe('https://cte.fazenda.pr.gov.br/cte4/CTeRecepcaoSincV4');
    });

    it('mantém a Distribuição DFe no Ambiente Nacional', () => {
        expect(utility('PR', 1).getWebServiceUrl('CTeDistribuicaoDFe', true, '1.00', 'CTe'))
            .toBe('https://www1.cte.fazenda.gov.br/CTeDistribuicaoDFe/CTeDistribuicaoDFe.asmx');
    });

    it('direciona à SVC: SP/MT/MS -> SVC-RS (SVRS); demais UFs -> SVC-SP (SVSP)', () => {
        expect(utility('SP').getSvcCTe()).toBe('SVC-RS');
        expect(utility('MG').getSvcCTe()).toBe('SVC-SP');
        expect(utility('MT').getWebServiceUrl('CTeAutorizacao', false, '4.00', 'CTeSVC'))
            .toBe('https://cte-homologacao.svrs.rs.gov.br/ws/CTeRecepcaoSincV4/CTeRecepcaoSincV4.asmx');
        expect(utility('PR', 1).getWebServiceUrl('CTeRecepcaoEvento', false, '4.00', 'CTeSVC'))
            .toBe('https://nfe.fazenda.sp.gov.br/CTeWS/WS/CTeRecepcaoEventoV4.asmx');
    });

    it('retorna o endereço de QR Code da UF', () => {
        expect(utility('MG', 1).getWebServiceUrl('CTeQrCode', false, '4.00', 'CTe'))
            .toBe('https://portalcte.fazenda.mg.gov.br/portalcte/sistema/qrcode.xhtml');
    });
});
