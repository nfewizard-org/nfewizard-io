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

function utilityNFe(UF: string, ambiente = 2) {
    const config = { dfe: { UF }, nfe: { ambiente, versaoDF: '4.00' } };
    return new Utility({ config, getConfig: () => config } as any);
}

describe('Utility - URLs de NF-e para contribuinte exclusivo do IBS/CBS (NT 2026.007)', () => {
    it('direciona a autorização e o retorno da autorização para a SVRS, independentemente da UF', () => {
        expect(utilityNFe('SP').getWebServiceUrl('NFEAutorizacao', false, '4.00', 'NFeSVRS'))
            .toBe('https://nfe-homologacao.svrs.rs.gov.br/ws/NfeAutorizacao/NFeAutorizacao4.asmx');
        expect(utilityNFe('MG', 1).getWebServiceUrl('NFERetAutorizacao', false, '4.00', 'NFeSVRS'))
            .toBe('https://nfe.svrs.rs.gov.br/ws/NfeRetAutorizacao/NFeRetAutorizacao4.asmx');
    });

    it('direciona os eventos regionais para a SVRS e mantém os eventos nacionais no Ambiente Nacional', () => {
        expect(utilityNFe('SP', 1).getWebServiceUrl('RecepcaoEvento', false, '4.00', 'NFeSVRS'))
            .toBe('https://nfe.svrs.rs.gov.br/ws/recepcaoevento/recepcaoevento4.asmx');
        expect(utilityNFe('SP', 1).getWebServiceUrl('RecepcaoEvento', true, '4.00', 'NFeSVRS'))
            .toBe(utilityNFe('SP', 1).getWebServiceUrl('RecepcaoEvento', true, '4.00', 'NFe'));
    });

    it('mantém a UF do emitente quando o modelo é NFe', () => {
        expect(utilityNFe('SP').getWebServiceUrl('NFEAutorizacao', false, '4.00', 'NFe'))
            .toBe('https://homologacao.nfe.fazenda.sp.gov.br/ws/nfeautorizacao4.asmx');
    });
});

describe('Utility - Autorização com alerta (NT 2026.002)', () => {
    const retornoConsulta = (cStat: string, xMotivo: string, mensagens = '') =>
        `<retConsSitNFe xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00"><tpAmb>2</tpAmb><verAplic>SVRS</verAplic><cStat>${cStat}</cStat><xMotivo>${xMotivo}</xMotivo><cUF>35</cUF><chNFe>35261012345678000199650010000000011000000019</chNFe><protNFe versao="4.00"><infProt><tpAmb>2</tpAmb><verAplic>SVRS</verAplic><chNFe>35261012345678000199650010000000011000000019</chNFe><dhRecbto>2026-10-05T10:00:00-03:00</dhRecbto><nProt>135260000000001</nProt><digVal>aGFzaA==</digVal><cStat>${cStat}</cStat><xMotivo>${xMotivo}</xMotivo>${mensagens}</infProt></protNFe></retConsSitNFe>`;

    it('não trata o cStat 120 como rejeição', () => {
        const retorno = utilityNFe('SP').verificaRejeicao(retornoConsulta('120', 'Autorizado o uso da NF-e, com alerta'), 'NFEConsultaProtocolo');
        expect(retorno.cStat).toBe('120');
    });

    it('continua tratando rejeições como erro', () => {
        expect(() => utilityNFe('SP').verificaRejeicao(retornoConsulta('539', 'Rejeição: Duplicidade de NF-e'), 'NFEConsultaProtocolo'))
            .toThrow('Rejeição: Duplicidade de NF-e');
    });

    it('retorna os alertas do grupo PR13 com cMsg e xMsg pareados', () => {
        const mensagens = '<cMsg>172</cMsg><xMsg>Alerta: Situação do CNPJ destinatário inabilitado no momento da autorização</xMsg><cMsg>173</cMsg><xMsg>Alerta: Outro alerta</xMsg>';
        const retorno = utilityNFe('SP').verificaRejeicao(retornoConsulta('120', 'Autorizado o uso da NF-e, com alerta', mensagens), 'NFEConsultaProtocolo');

        expect(utilityNFe('SP').getAlertas(retorno.protNFe.infProt)).toEqual([
            { cMsg: '172', xMsg: 'Alerta: Situação do CNPJ destinatário inabilitado no momento da autorização' },
            { cMsg: '173', xMsg: 'Alerta: Outro alerta' },
        ]);
    });

    it('retorna um único alerta e lista vazia quando não há mensagens', () => {
        const u = utilityNFe('SP');
        expect(u.getAlertas({ cMsg: '172', xMsg: 'Alerta' })).toEqual([{ cMsg: '172', xMsg: 'Alerta' }]);
        expect(u.getAlertas({ cStat: '100' })).toEqual([]);
    });
});
