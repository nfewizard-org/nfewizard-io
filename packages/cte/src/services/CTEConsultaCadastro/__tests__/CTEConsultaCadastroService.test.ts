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

import { CTEConsultaCadastroService } from '../CTEConsultaCadastroService';

function create() {
    const environment = { getConfig: () => ({ dfe: { UF: 'PR' } }) };
    return new CTEConsultaCadastroService(environment, undefined, new XmlBuilder(environment));
}

describe('CTEConsultaCadastroService', () => {
    it('reaproveita o método NfeConsultaCadastro e monta o ConsCad com a UF configurada', () => {
        const s = create();
        expect(s.metodo).toBe('NfeConsultaCadastro');
        expect(s['gerarXml']({ cnpj: '11222333000181' })).toBe(
            '<ConsCad versao="2.00" xmlns="http://www.portalfiscal.inf.br/nfe"><infCons><xServ>CONS-CAD</xServ><UF>PR</UF><CNPJ>11222333000181</CNPJ></infCons></ConsCad>'
        );
    });

    it('exige exatamente um dentre cnpj, cpf e ie', () => {
        expect(() => create()['gerarXml']({})).toThrow("Informe exatamente um dos campos 'cnpj', 'cpf' ou 'ie'");
    });
});
