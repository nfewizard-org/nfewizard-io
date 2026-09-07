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
const NFEConsultaCadastroService = require('../NFEConsultaCadastroService').default;

function createService(uf = 'SP') {
    const environment = { getConfig: () => ({ dfe: { UF: uf } }) };
    return new NFEConsultaCadastroService(environment);
}

describe('NFEConsultaCadastroService - gerarXml', () => {
    it('monta o XML consCad para consulta por CNPJ, usando a UF do ambiente configurado', () => {
        const service = createService('SP');

        const xml = service['gerarXml']({ cnpj: '11222333000181' });

        expect(xml).toBe(
            '<ConsCad versao="2.00" xmlns="http://www.portalfiscal.inf.br/nfe"><infCons><xServ>CONS-CAD</xServ><UF>SP</UF><CNPJ>11222333000181</CNPJ></infCons></ConsCad>'
        );
    });

    it('permite sobrescrever a UF informada explicitamente em `data.uf`', () => {
        const service = createService('SP');

        const xml = service['gerarXml']({ ie: '123456789012', uf: 'MG' });

        expect(xml).toBe(
            '<ConsCad versao="2.00" xmlns="http://www.portalfiscal.inf.br/nfe"><infCons><xServ>CONS-CAD</xServ><UF>MG</UF><IE>123456789012</IE></infCons></ConsCad>'
        );
    });

    it('monta o XML para consulta por CPF', () => {
        const service = createService('RJ');

        const xml = service['gerarXml']({ cpf: '12345678909' });

        expect(xml).toContain('<CPF>12345678909</CPF>');
        expect(xml).toContain('<UF>RJ</UF>');
    });

    it('lança erro quando nenhum dos campos cnpj/cpf/ie é informado', () => {
        const service = createService();

        expect(() => service['gerarXml']({})).toThrow(
            "Informe exatamente um dos campos 'cnpj', 'cpf' ou 'ie' para a Consulta Cadastro."
        );
    });

    it('lança erro quando mais de um dos campos cnpj/cpf/ie é informado', () => {
        const service = createService();

        expect(() => service['gerarXml']({ cnpj: '11222333000181', ie: '123456789012' })).toThrow(
            "Informe exatamente um dos campos 'cnpj', 'cpf' ou 'ie' para a Consulta Cadastro."
        );
    });
});
