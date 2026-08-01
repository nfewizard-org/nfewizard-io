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
const NFEAutorizacaoService = require('../NFEAutorizacaoService').default;

describe('NFEAutorizacaoService - normalização do destinatário', () => {
    it('deve preservar idEstrangeiro quando não houver documento brasileiro', () => {
        const service = new NFEAutorizacaoService();
        const dest = {
            idEstrangeiro: 'ABC123',
            xNome: 'CLIENTE EXTERIOR',
            indIEDest: 9,
        };

        const result = service['normalizaDestinatario'](dest);

        expect(result).toMatchObject({
            idEstrangeiro: 'ABC123',
            xNome: 'CLIENTE EXTERIOR',
            indIEDest: 9,
        });
        expect(result.CNPJCPF).toBeUndefined();
        expect(result.CNPJ).toBeUndefined();
        expect(result.CPF).toBeUndefined();
    });

    it('deve preservar idEstrangeiro vazio quando informado sem CPF ou CNPJ', () => {
        const service = new NFEAutorizacaoService();
        const dest = {
            idEstrangeiro: '',
            xNome: 'CLIENTE EXTERIOR',
            indIEDest: 9,
        };

        const result = service['normalizaDestinatario'](dest);

        expect(Object.prototype.hasOwnProperty.call(result, 'idEstrangeiro')).toBe(true);
        expect(result.idEstrangeiro).toBe('');
        expect(result.CNPJCPF).toBeUndefined();
    });

    it('deve converter CNPJCPF válido para a tag de documento correspondente', () => {
        const service = new NFEAutorizacaoService();
        const dest = {
            CNPJCPF: '02916265038485',
            xNome: 'CLIENTE NACIONAL',
        };

        const result = service['normalizaDestinatario'](dest);

        expect(result).toMatchObject({
            CNPJ: '02916265038485',
            xNome: 'CLIENTE NACIONAL',
        });
        expect(result.CNPJCPF).toBeUndefined();
    });
});