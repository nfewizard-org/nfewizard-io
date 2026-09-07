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
import { getCstOrCsosn } from '../getCstOrCsosn';

describe('getCstOrCsosn', () => {
    it('retorna o CST para grupos de ICMS do regime normal (ICMS00)', () => {
        const ICMS = {
            ICMS00: {
                orig: '0',
                CST: '00',
                modBC: '0',
                vBC: '100.00',
                pICMS: '18.00',
                vICMS: '18.00',
            },
        } as any;

        expect(getCstOrCsosn(ICMS)).toBe('00');
    });

    it('retorna o CSOSN para grupos do Simples Nacional (ICMSSN102)', () => {
        const ICMS = {
            ICMSSN102: {
                orig: '0',
                CSOSN: '102',
            },
        } as any;

        expect(getCstOrCsosn(ICMS)).toBe('102');
    });

    it('retorna string vazia quando o ICMS não possui nenhum grupo', () => {
        expect(getCstOrCsosn({} as any)).toBe('');
    });
});
