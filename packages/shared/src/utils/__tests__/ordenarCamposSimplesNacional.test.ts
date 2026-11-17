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
import { ordenarCamposSimplesNacional } from '../ordenarCamposSimplesNacional';

describe('ordenarCamposSimplesNacional (NT 2026.005)', () => {
    it('deve colocar o tpRegimeIBSCBS logo depois do CRT e antes do ISUFEmit', () => {
        const infNFe = {
            emit: { tpRegimeIBSCBS: 4, CNPJ: '12345678000195', xNome: 'EMITENTE', IE: '123', CRT: 3, ISUFEmit: '123456789' },
        };

        ordenarCamposSimplesNacional(infNFe);

        expect(Object.keys(infNFe.emit)).toEqual(['CNPJ', 'xNome', 'IE', 'CRT', 'tpRegimeIBSCBS', 'ISUFEmit']);
        expect(infNFe.emit.tpRegimeIBSCBS).toBe(4);
    });

    it('deve manter o tpRegimeIBSCBS no fim do emit quando não houver ISUFEmit', () => {
        const infNFe = { emit: { CNPJ: '12345678000195', tpRegimeIBSCBS: 1, xNome: 'EMITENTE', CRT: 1 } };

        ordenarCamposSimplesNacional(infNFe);

        expect(Object.keys(infNFe.emit)).toEqual(['CNPJ', 'xNome', 'CRT', 'tpRegimeIBSCBS']);
    });

    it('deve colocar o cAtivSN antes de DI e dos grupos específicos do produto', () => {
        const prod = { cProd: '1', vProd: '10.00', indTot: 1, indBemMovelUsado: 1, DI: {}, rastro: {}, comb: {}, cAtivSN: '01' };

        ordenarCamposSimplesNacional({ det: [{ prod }] });

        expect(Object.keys(prod)).toEqual(['cProd', 'vProd', 'indTot', 'indBemMovelUsado', 'cAtivSN', 'DI', 'rastro', 'comb']);
    });

    it('deve aceitar det como objeto único', () => {
        const prod = { cAtivSN: '90', cProd: '1', indTot: 1 };

        ordenarCamposSimplesNacional({ det: { prod } });

        expect(Object.keys(prod)).toEqual(['cProd', 'indTot', 'cAtivSN']);
    });

    it('deve colocar o gTribSN do item depois do gIBSCBS e antes do gEstornoCred e do crédito presumido', () => {
        const IBSCBS = {
            gTribSN: { gCBSSN: { vCBSSN: '0.50', pCBSSN: '5.0000' }, gIBSSN: { vIBSSN: '0.20', pIBSSN: '2.0000' } },
            CST: '000',
            cClassTrib: '000001',
            gIBSCBS: {},
            gEstornoCred: {},
            gCredPresOper: {},
        };

        ordenarCamposSimplesNacional({ det: [{ $: { nItem: 1 }, prod: {}, imposto: { IBSCBS } }] });

        expect(Object.keys(IBSCBS)).toEqual(['CST', 'cClassTrib', 'gIBSCBS', 'gTribSN', 'gEstornoCred', 'gCredPresOper']);
        expect(Object.keys(IBSCBS.gTribSN)).toEqual(['gIBSSN', 'gCBSSN']);
        expect(Object.keys(IBSCBS.gTribSN.gIBSSN)).toEqual(['pIBSSN', 'vIBSSN']);
        expect(Object.keys(IBSCBS.gTribSN.gCBSSN)).toEqual(['pCBSSN', 'vCBSSN']);
    });

    it('deve colocar o gTribSN dos totais como último filho do IBSCBSTot', () => {
        const IBSCBSTot = { gTribSN: { vCBSSN: '0.50', vIBSSN: '0.20' }, vBCIBSCBS: '10.00', gIBS: {}, gCBS: {}, gEstornoCred: {} };

        ordenarCamposSimplesNacional({ total: { ICMSTot: {}, IBSCBSTot } });

        expect(Object.keys(IBSCBSTot)).toEqual(['vBCIBSCBS', 'gIBS', 'gCBS', 'gEstornoCred', 'gTribSN']);
        expect(Object.keys(IBSCBSTot.gTribSN)).toEqual(['vIBSSN', 'vCBSSN']);
    });

    it('não deve alterar objetos sem os campos da NT', () => {
        const infNFe = {
            emit: { CNPJ: '12345678000195', xNome: 'EMITENTE', CRT: 3 },
            det: [{ $: { nItem: 1 }, prod: { cProd: '1', indTot: 1 }, imposto: { IBSCBS: { CST: '000', cClassTrib: '000001', gIBSCBS: {} } } }],
            total: { ICMSTot: {}, IBSCBSTot: { vBCIBSCBS: '10.00', gIBS: {}, gCBS: {} } },
        };
        const antes = JSON.stringify(infNFe);

        ordenarCamposSimplesNacional(infNFe);

        expect(JSON.stringify(infNFe)).toBe(antes);
    });

    it('deve ignorar entradas vazias ou sem os grupos esperados', () => {
        expect(() => ordenarCamposSimplesNacional(undefined)).not.toThrow();
        expect(() => ordenarCamposSimplesNacional({})).not.toThrow();
        expect(() => ordenarCamposSimplesNacional({ det: [null, { imposto: null }], total: null })).not.toThrow();
    });
});
