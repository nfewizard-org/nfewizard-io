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

    /**
     * Valida o CPF ou CNPJ.
     * @param cpfCnpj CPF ou CNPJ à validar.
     * @returns Retorna um objeto com o tipo do documento e um boolean se é um documento válido ou não
     */
    public validarCpfCnpj(cpfCnpj: string): { documentoValido: boolean, tipoDoDocumento: 'CPF' | 'CNPJ' | 'Desconhecido' } {
        const isCpf = cpfCnpj.length === 11;
        const isCnpj = cpfCnpj.length === 14;

        if (!isCpf && !isCnpj) {
            return { documentoValido: false, tipoDoDocumento: 'Desconhecido' };
        }

        const cleanCpfCnpj = cpfCnpj.replace(/\D/g, '');

        if (isCpf) {
            // CPF
            if (cleanCpfCnpj === "00000000000") {
                return { documentoValido: false, tipoDoDocumento: 'CPF' };
            }

            if (!this.documentoValidoateCpf(cleanCpfCnpj)) {
                return { documentoValido: false, tipoDoDocumento: 'CPF' };
            }

            return { documentoValido: true, tipoDoDocumento: 'CPF' };
        } else {
            // CNPJ
            if (!this.documentoValidoateCnpj(cleanCpfCnpj)) {
                return { documentoValido: false, tipoDoDocumento: 'CNPJ' };
            }

            return { documentoValido: true, tipoDoDocumento: 'CNPJ' };
        }
    }

    /**
     * Validoa o CPF
     * @param cpf 
     * @returns Retorna se o CPF é valido ou não
     */
    private documentoValidoateCpf(cpf: string): boolean {
        let sum = 0;
        let remainder;

        for (let i = 1; i <= 9; i++) {
            sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        }

        remainder = (sum * 10) % 11;

        if ((remainder === 10) || (remainder === 11)) {
            remainder = 0;
        }

        if (remainder !== parseInt(cpf.substring(9, 10))) {
            return false;
        }

        sum = 0;

        for (let i = 1; i <= 10; i++) {
            sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }

        remainder = (sum * 10) % 11;

        if ((remainder === 10) || (remainder === 11)) {
            remainder = 0;
        }

        if (remainder !== parseInt(cpf.substring(10, 11))) {
            return false;
        }

        return true;
    }

    /**
     * Validoa o CNPJ
     * @param CNPJ 
     * @returns Retorna se o CNPJ é valido ou não
     */
    private documentoValidoateCnpj(cnpj: string): boolean {
        let size = cnpj.length - 2;
        let numbers = cnpj.substring(0, size);
        const digits = cnpj.substring(size);
        let sum = 0;
        let pos = size - 7;

        for (let i = size; i >= 1; i--) {
            sum += parseInt(numbers.charAt(size - i)) * pos--;
            if (pos < 2) {
                pos = 9;
            }
        }

        let result = sum % 11 < 2 ? 0 : 11 - sum % 11;

        if (result != parseInt(digits.charAt(0))) {
            return false;
        }

        size = size + 1;
        numbers = cnpj.substring(0, size);
        sum = 0;
        pos = size - 7;

        for (let i = size; i >= 1; i--) {
            sum += parseInt(numbers.charAt(size - i)) * pos--;
            if (pos < 2) {
                pos = 9;
            }
        }

        result = sum % 11 < 2 ? 0 : 11 - sum % 11;

        if (result != parseInt(digits.charAt(1))) {
            return false;
        }

        return true;
    }

    /**
     * Adiciona máscara ao CPF/CNPJ.
     * @param cpfCnpj CPF ou CNPJ à adicionar máscara.
     * @returns Retorna o documento com máscara.
     */
    public mascaraCnpjCpf(cpfcnpj: string) {
        cpfcnpj = cpfcnpj.replace(/\D/g, '');
        if (cpfcnpj.length === 11) { // CPF
            return cpfcnpj.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else if (cpfcnpj.length === 14) { // CNPJ
            return cpfcnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        } else {
            return cpfcnpj;
        }
    }
}

export default ValidaCPFCNPJ;
