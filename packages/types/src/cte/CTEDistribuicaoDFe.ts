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

export type ConsultaCTe = DFePorUltimoNSUCTe | DFePorNSUCTe

export interface DFePorUltimoNSUCTe {
    /**
     * @param {number} cUFAutor - Código da UF do Autor
     */
    cUFAutor: number;
    /**
     * @param {string} CNPJ - CNPJ do interessado no DF-e
     */
    CNPJ?: string;
    /**
     * @param {string} CPF - CPF do interessado no DF-e
     */
    CPF?: string;
    /**
     * @param {any} distNSU - Grupo para distribuir DF-e de interesse
     */
    distNSU: {
        /**
         * @param {number} ultNSU - Último NSU recebido pelo ator. Caso seja informado com zero, ou com um NSU muito antigo, a consulta retornará unicamente as informações resumidas e documentos fiscais eletrônicos que tenham sido recepcionados pelo Ambiente Nacional nos últimos 3 meses.
         */
        ultNSU: string;
    };
}

export interface DFePorNSUCTe {
    /**
     * @param {number} cUFAutor - Código da UF do Autor
     */
    cUFAutor: number;
    /**
     * @param {string} CNPJ - CNPJ do interessado no DF-e
     */
    CNPJ?: string;
    /**
     * @param {string} CPF - CPF do interessado no DF-e
     */
    CPF?: string;
    /**
     * @param {any} consNSU - Grupo para consultar um DF-e a partir de um NSU específico
     */
    consNSU: {
        /**
         * @param {string} NSU - Número Sequencial Único. Geralmente esta consulta será utilizada quando identificado que existe um documento a ser buscado através de consulta prévia.
         */
        NSU: string;
    };
}