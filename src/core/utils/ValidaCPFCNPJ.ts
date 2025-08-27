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

class ValidaCPFCNPJ {
    constructor() { }

    public validarCpfCnpj(cpfCnpj: string): { documentoValido: boolean, tipoDoDocumento: 'CPF' | 'CNPJ' | 'Desconhecido' } {
        if (!cpfCnpj || typeof cpfCnpj !== 'string') {
            return { documentoValido: false, tipoDoDocumento: 'Desconhecido' };
        }

        // Remove apenas máscaras e espaços, mantem letras (para CNPJ-alfa)
        const clean = cpfCnpj.replace(/[.\-\/\s]/g, '').toUpperCase();

        const isCpf = /^\d{11}$/.test(clean);
        // 12 primeiras posições alfanuméricas, 2 últimas obrigatoriamente numéricas
        const isCnpj = /^[A-Z0-9]{12}[0-9]{2}$/.test(clean);

        if (!isCpf && !isCnpj) {
            return { documentoValido: false, tipoDoDocumento: 'Desconhecido' };
        }

        if (isCpf) {
            if (clean === "00000000000") {
                return { documentoValido: false, tipoDoDocumento: 'CPF' };
            }

            if (!this.documentoValidoateCpf(clean)) {
                return { documentoValido: false, tipoDoDocumento: 'CPF' };
            }

            return { documentoValido: true, tipoDoDocumento: 'CPF' };
        } else {
            // CNPJ (numérico ou alfa conforme regex)
            if (!this.documentoValidoateCnpj(clean)) {
                return { documentoValido: false, tipoDoDocumento: 'CNPJ' };
            }
            return { documentoValido: true, tipoDoDocumento: 'CNPJ' };
        }
    }

    private documentoValidoateCpf(cpf: string): boolean {
        let sum = 0;
        let remainder;

        for (let i = 1; i <= 9; i++) {
            sum += parseInt(cpf.substring(i - 1, i), 10) * (11 - i);
        }

        remainder = (sum * 10) % 11;
        if ((remainder === 10) || (remainder === 11)) remainder = 0;
        if (remainder !== parseInt(cpf.substring(9, 10), 10)) return false;

        sum = 0;
        for (let i = 1; i <= 10; i++) {
            sum += parseInt(cpf.substring(i - 1, i), 10) * (12 - i);
        }

        remainder = (sum * 10) % 11;
        if ((remainder === 10) || (remainder === 11)) remainder = 0;
        if (remainder !== parseInt(cpf.substring(10, 11), 10)) return false;

        return true;
    }

    private documentoValidoateCnpj(cnpj: string): boolean {
        // aceita 14 chars: 12 (alfanum) + 2 (num)
        if (!/^[A-Z0-9]{12}[0-9]{2}$/.test(cnpj)) return false;

        // rejeita CNPJ zerado (caso numérico)
        if (cnpj === "00000000000000") return false;

        // converte cada caractere -> charCode - 48 (conforme NT)
        const vals: number[] = [];
        for (let i = 0; i < 14; i++) {
            const ch = cnpj.charAt(i);
            if (!/[0-9A-Z]/.test(ch)) return false; // redundante mas seguro
            vals.push(cnpj.charCodeAt(i) - 48);
        }

        // pesos do CNPJ
        const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];    // para primeiro DV (12 posições)
        const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]; // para segundo DV (13 posições)

        // calcula DV1 a partir das 12 primeiras posições
        let soma1 = 0;
        for (let i = 0; i < 12; i++) soma1 += vals[i] * pesos1[i];
        const resto1 = soma1 % 11;
        const dv1 = resto1 < 2 ? 0 : 11 - resto1;

        // verifica com o primeiro DV informado (posição 12)
        if (dv1 !== vals[12]) return false;

        // calcula DV2 usando as 12 primeiras posições + dv1 calculado (não confiar no dígito informado)
        const valsParaDV2 = vals.slice(0, 12).concat([dv1]);
        let soma2 = 0;
        for (let i = 0; i < 13; i++) soma2 += valsParaDV2[i] * pesos2[i];
        const resto2 = soma2 % 11;
        const dv2 = resto2 < 2 ? 0 : 11 - resto2;

        // compara com o segundo DV informado (posição 13)
        if (dv2 !== vals[13]) return false;

        return true;
    }

    public mascaraCnpjCpf(cpfcnpj: string) {
        if (!cpfcnpj || typeof cpfcnpj !== 'string') return cpfcnpj;
        let clean = cpfcnpj.replace(/[.\-\/\s]/g, '').toUpperCase();

        if (clean.length === 11 && /^\d{11}$/.test(clean)) { // CPF
            return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else if (clean.length === 14) { // CNPJ alfa ou numérico
            return clean.replace(/(.{2})(.{3})(.{3})(.{4})(.{2})/, '$1.$2.$3/$4-$5');
        } else {
            return cpfcnpj;
        }
    }
}

export default ValidaCPFCNPJ;
