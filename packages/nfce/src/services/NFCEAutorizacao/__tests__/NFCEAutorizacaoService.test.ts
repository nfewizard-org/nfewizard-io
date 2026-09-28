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
const NFCEAutorizacaoService = require('../NFCEAutorizacaoService').NFCEAutorizacaoService;

/**
 * Monta um objeto LayoutNFe mínimo para testar o cálculo da chave de acesso.
 * O campo dhEmi é a variável de interesse para o teste de fuso horário.
 */
const buildNFe = (dhEmi: string) => ({
    infNFe: {
        Id: undefined,
        ide: {
            cUF: 35,
            mod: 65,
            serie: '1',
            nNF: '1',
            tpEmis: 1,
            cNF: '00000001',
            dhEmi,
        },
        emit: {
            CNPJCPF: '02916265038485',
        },
    },
});

describe('NFCEAutorizacaoService - cálculo de chave de acesso', () => {
    let service: any;

    beforeEach(() => {
        service = new NFCEAutorizacaoService();
    });

    describe('anoMesEmissao via calcularDigitoVerificador', () => {
        it('deve extrair AAMM correto de string ISO com offset BRT (-03:00)', () => {
            // 2026-01-31T22:00:00-03:00 → mês deve ser 01 (janeiro), não 02
            const nfe = buildNFe('2026-01-31T22:00:00-03:00');
            const { chaveAcesso } = service['calcularDigitoVerificador'](nfe);
            // Posição 2-5 da chave (após cUF de 2 dígitos) contém AAMM
            const aamm = chaveAcesso.replace('NFe', '').substring(2, 6);
            expect(aamm).toBe('2601');
        });

        it('deve extrair AAMM correto no último dia do mês às 23:59 BRT', () => {
            // 2026-06-30T23:59:59-03:00 → mês deve ser 06 (junho), não 07
            const nfe = buildNFe('2026-06-30T23:59:59-03:00');
            const { chaveAcesso } = service['calcularDigitoVerificador'](nfe);
            const aamm = chaveAcesso.replace('NFe', '').substring(2, 6);
            expect(aamm).toBe('2606');
        });

        it('deve extrair AAMM correto no último dia do ano às 23:00 BRT', () => {
            // 2025-12-31T23:00:00-03:00 → mês deve ser 12 e ano 25, não 01/26
            const nfe = buildNFe('2025-12-31T23:00:00-03:00');
            const { chaveAcesso } = service['calcularDigitoVerificador'](nfe);
            const aamm = chaveAcesso.replace('NFe', '').substring(2, 6);
            expect(aamm).toBe('2512');
        });

        it('deve extrair AAMM correto em horário normal', () => {
            // 2026-07-02T08:00:00-03:00 → mês 07, ano 26
            const nfe = buildNFe('2026-07-02T08:00:00-03:00');
            const { chaveAcesso } = service['calcularDigitoVerificador'](nfe);
            const aamm = chaveAcesso.replace('NFe', '').substring(2, 6);
            expect(aamm).toBe('2607');
        });
    });
});

describe('NFCEAutorizacaoService - DV da chave de acesso com CNPJ alfanumérico', () => {
    let service: any;

    // CNPJ de exemplo da Receita (12.ABC.345/01DE-35); os DVs esperados foram
    // conferidos com o Keys::verifyingDigit do sped-common
    const buildNFeComEmitente = (CNPJCPF: string) => ({
        infNFe: {
            Id: undefined,
            ide: {
                cUF: 35,
                mod: 65,
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

    beforeEach(() => {
        service = new NFCEAutorizacaoService();
    });

    it('deve calcular o DV com o valor ASCII menos 48 quando o CNPJ tem letras', () => {
        expect(service['calcularModulo11']('35260912ABC34501DE3565001000000123112345678')).toBe(7);
    });

    it('deve manter o DV das chaves com CNPJ numérico', () => {
        expect(service['calcularModulo11']('3526091122233300018165001000000123112345678')).toBe(6);
    });

    it('deve montar a chave de acesso completa para emitente com CNPJ alfanumérico', () => {
        const nfe = buildNFeComEmitente('12ABC34501DE35');
        const { chaveAcesso, dv } = service['calcularDigitoVerificador'](nfe);
        expect(dv).toBe(7);
        expect(chaveAcesso).toBe('NFe35260912ABC34501DE35650010000001231123456787');
        expect(chaveAcesso.replace('NFe', '')).toMatch(/^[0-9]{6}[0-9A-Z]{12}[0-9]{26}$/);
    });
});

describe('NFCEAutorizacaoService - chave de acesso com emitente pessoa física (CPF)', () => {
    let service: any;

    // CPF fictício 111.444.777-35; a chave esperada foi conferida com o
    // Keys::build do sped-common, que completa o CPF com zeros até 14 posições
    const buildNFeComCpf = (CNPJCPF: string) => ({
        infNFe: {
            Id: undefined,
            ide: {
                cUF: 51,
                mod: 65,
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

    beforeEach(() => {
        service = new NFCEAutorizacaoService();
    });

    it('deve completar o CPF do emitente com zeros à esquerda na chave de acesso', () => {
        const nfe = buildNFeComCpf('11144477735');
        const { chaveAcesso, dv } = service['calcularDigitoVerificador'](nfe);
        expect(dv).toBe(5);
        expect(chaveAcesso).toBe('NFe51260900011144477735650010000001231123456785');
    });

    it('deve gerar a chave com 44 posições quando o emitente é CPF', () => {
        const nfe = buildNFeComCpf('11144477735');
        const { chaveAcesso } = service['calcularDigitoVerificador'](nfe);
        expect(chaveAcesso.replace('NFe', '')).toMatch(/^[0-9]{44}$/);
    });
});
