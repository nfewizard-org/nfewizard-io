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

const { NFCEAutorizacao } = require('../NFCEAutorizacao');

describe('NFCEAutorizacao operation', () => {
    it('deve delegar ExecTransmitirContingencia para o service', async () => {
        const retornoEsperado = { success: true };
        const service = {
            Exec: jest.fn(),
            ExecTransmitirContingencia: jest.fn().mockResolvedValue(retornoEsperado),
        };

        const operation = new NFCEAutorizacao(service);
        const payload = { foo: 'bar' };

        const response = await operation.ExecTransmitirContingencia(payload);

        expect(service.ExecTransmitirContingencia).toHaveBeenCalledWith(payload);
        expect(response).toBe(retornoEsperado);
    });

    it('deve lançar erro quando service não implementar ExecTransmitirContingencia', async () => {
        const service = {
            Exec: jest.fn(),
        };

        const operation = new NFCEAutorizacao(service);

        await expect(operation.ExecTransmitirContingencia({})).rejects.toThrow(
            'Método ExecTransmitirContingencia não implementado no serviço de autorização NFCe.'
        );
    });
});
