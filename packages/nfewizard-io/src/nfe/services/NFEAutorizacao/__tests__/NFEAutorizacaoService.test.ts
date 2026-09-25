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

describe('NFEAutorizacaoService - DV da chave de acesso com CNPJ alfanumérico', () => {
    // CNPJ de exemplo da Receita (12.ABC.345/01DE-35); os DVs esperados foram
    // conferidos com o Keys::verifyingDigit do sped-common
    const buildNFeComEmitente = (CNPJCPF: string) => ({
        infNFe: {
            Id: undefined,
            ide: {
                cUF: 35,
                mod: 55,
                serie: '1',
                nNF: '123',
                tpEmis: 1,
                cNF: '12345678',
                dhEmi: '2026-09-23T10:00:00-03:00',
            },
            emit: {
                CNPJCPF,
            },
        },
    });

    it('deve calcular o DV com o valor ASCII menos 48 quando o CNPJ tem letras', () => {
        const service = new NFEAutorizacaoService();
        expect(service['calcularModulo11']('35260912ABC34501DE3555001000000123112345678')).toBe(4);
    });

    it('deve manter o DV das chaves com CNPJ numérico', () => {
        const service = new NFEAutorizacaoService();
        expect(service['calcularModulo11']('3526091122233300018155001000000123112345678')).toBe(3);
    });

    it('deve montar a chave de acesso completa para emitente com CNPJ alfanumérico', () => {
        const service = new NFEAutorizacaoService();
        const nfe = buildNFeComEmitente('12ABC34501DE35');
        const { chaveAcesso, dv } = service['calcularDigitoVerificador'](nfe);
        expect(dv).toBe(4);
        expect(chaveAcesso).toBe('NFe35260912ABC34501DE35550010000001231123456784');
        expect(chaveAcesso.replace('NFe', '')).toMatch(/^[0-9]{6}[0-9A-Z]{12}[0-9]{26}$/);
    });
});

describe('NFEAutorizacaoService - chave de acesso com emitente pessoa física (CPF)', () => {
    // CPF fictício 111.444.777-35; a chave esperada foi conferida com o
    // Keys::build do sped-common, que completa o CPF com zeros até 14 posições
    const buildNFeComCpf = (CNPJCPF: string) => ({
        infNFe: {
            Id: undefined,
            ide: {
                cUF: 51,
                mod: 55,
                serie: '1',
                nNF: '123',
                tpEmis: 1,
                cNF: '12345678',
                dhEmi: '2026-09-24T10:00:00-04:00',
            },
            emit: {
                CNPJCPF,
            },
        },
    });

    it('deve completar o CPF do emitente com zeros à esquerda na chave de acesso', () => {
        const service = new NFEAutorizacaoService();
        const nfe = buildNFeComCpf('11144477735');
        const { chaveAcesso, dv } = service['calcularDigitoVerificador'](nfe);
        expect(dv).toBe(2);
        expect(chaveAcesso).toBe('NFe51260900011144477735550010000001231123456782');
    });

    it('deve gerar a chave com 44 posições quando o emitente é CPF', () => {
        const service = new NFEAutorizacaoService();
        const nfe = buildNFeComCpf('11144477735');
        const { chaveAcesso } = service['calcularDigitoVerificador'](nfe);
        expect(chaveAcesso.replace('NFe', '')).toMatch(/^[0-9]{44}$/);
    });
});
