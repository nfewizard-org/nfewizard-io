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

const { DCEAutorizacao } = require('../DCEAutorizacao');

describe('DCEAutorizacao operation', () => {
    it('deve delegar ExecZip para o service', async () => {
        const retornoEsperado = { success: true, xMotivo: 'Lote recebido', response: {} };
        const service = {
            Exec: jest.fn(),
            ExecZip: jest.fn().mockResolvedValue(retornoEsperado),
        };

        const operation = new DCEAutorizacao(service);
        const payload = { xml: '<DCe />' };

        const response = await operation.ExecZip(payload);

        expect(service.ExecZip).toHaveBeenCalledWith(payload);
        expect(response).toBe(retornoEsperado);
    });

    it('deve lancar erro quando service nao implementar ExecZip', async () => {
        const service = {
            Exec: jest.fn(),
        };

        const operation = new DCEAutorizacao(service);

        await expect(operation.ExecZip({})).rejects.toThrow(
            'Metodo ExecZip nao implementado no servico de autorizacao DCe.'
        );
    });
});