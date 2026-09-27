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
import { CTEStatusServico } from '../CTEStatusServico';

describe('CTEStatusServico operation', () => {
    it('deve delegar Exec para o service', async () => {
        const retornoEsperado = { retConsStatServCTe: { cStat: '107', xMotivo: 'Servico em Operacao' } };
        const service = { Exec: jest.fn().mockResolvedValue(retornoEsperado) };

        const operation = new CTEStatusServico(service as any);
        const response = await operation.Exec();

        expect(service.Exec).toHaveBeenCalledTimes(1);
        expect(response).toBe(retornoEsperado);
    });
});
