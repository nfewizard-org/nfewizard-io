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
import { CTEAutorizacaoService } from '../CTEAutorizacaoService';

function createService() {
    return new CTEAutorizacaoService();
}

describe('CTEAutorizacaoService - calcularDigitoVerificador', () => {
    it('calcula a chave de acesso e o dígito verificador (módulo 11) a partir dos campos de ide/emit', () => {
        const service = createService();

        const cte = {
            infCte: {
                ide: {
                    cUF: 41,
                    dhEmi: '2024-01-15T10:00:00-03:00',
                    mod: 57,
                    serie: 1,
                    nCT: 1,
                    tpEmis: 1,
                    cCT: '12345678',
                },
                emit: {
                    CNPJCPF: '11222333000181',
                },
            },
        };

        const { chaveAcesso, dv } = service['calcularDigitoVerificador'](cte);

        expect(dv).toBe(2);
        expect(chaveAcesso).toBe('CTe41240111222333000181570010000000011123456782');
        // cCT/mod/tpEmis normalizados de volta no objeto original
        expect(cte.infCte.ide.cCT).toBe('12345678');
        expect(cte.infCte.ide.mod).toBe(57);
    });

    it('gera um cCT aleatório de 8 dígitos quando não informado', () => {
        const service = createService();

        const cte = {
            infCte: {
                ide: {
                    cUF: 41,
                    dhEmi: '2024-01-15T10:00:00-03:00',
                    serie: 1,
                    nCT: 1,
                },
                emit: { CNPJCPF: '11222333000181' },
            },
        };

        service['calcularDigitoVerificador'](cte);

        expect(cte.infCte.ide.cCT).toMatch(/^\d{8}$/);
    });

    it('reaproveita a chave de acesso quando infCte.Id já estiver preenchido', () => {
        const service = createService();
        const id = '41240111222333000181570010000000011123456782';

        const cte = {
            infCte: {
                Id: id,
                ide: {},
                emit: {},
            },
        };

        const { chaveAcesso, dv } = service['calcularDigitoVerificador'](cte);

        expect(chaveAcesso).toBe(`CTe${id}`);
        expect(dv).toBe(2);
    });
});

describe('CTEAutorizacaoService - normalizaParticipante / validaDocumento', () => {
    it('converte CNPJCPF válido para a tag CNPJ e remove os campos internos', () => {
        const service = createService();

        const rem = {
            CNPJCPF: '11222333000181',
            xNome: 'TRANSPORTADORA TESTE',
        };

        const result = service['normalizaParticipante'](rem, 'remetente');

        expect(result).toMatchObject({
            CNPJ: '11222333000181',
            xNome: 'TRANSPORTADORA TESTE',
        });
        expect(result.CNPJCPF).toBeUndefined();
    });

    it('retorna o participante inalterado quando não há documento informado', () => {
        const service = createService();
        const dest = { xNome: 'SEM DOCUMENTO' };

        const result = service['normalizaParticipante'](dest, 'destinatário');

        expect(result).toBe(dest);
    });

    it('lança erro quando o documento informado é inválido', () => {
        const service = createService();
        const rem = { CNPJCPF: '00000000000000', xNome: 'INVALIDO' };

        expect(() => service['normalizaParticipante'](rem, 'remetente')).toThrow(
            'CNPJ do remetente é inválido'
        );
    });
});
