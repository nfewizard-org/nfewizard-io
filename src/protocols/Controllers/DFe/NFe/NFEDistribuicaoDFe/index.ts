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

export type ConsultaNFe = DFePorUltimoNSU | DFePorNSU | DFePorChaveNFe

export interface DFePorUltimoNSU {
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


export interface DFePorNSU {
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
         * @param {number} NSU - Número Sequencial Único. Geralmente esta consulta será utilizada quando identificado pelo interessado um NSU faltante. O Web Service retornará o documento ou informará que o NSU não existe no Ambiente Nacional. Assim, esta consulta fechará a lacuna do NSU identificado como faltante
         */
        NSU: string;
    };
}

export interface DFePorChaveNFe {
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
     * @param {any} consChNFe - Grupo para consultar uma NF-e pela chave de acesso
     */
    consChNFe: {
        /**
         * @param {string} chNFe - Chave de acesso específica.
         */
        chNFe: string;
    };
}