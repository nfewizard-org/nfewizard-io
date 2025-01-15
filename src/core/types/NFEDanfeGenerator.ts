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

import { LayoutNFe, ProtNFe } from './NFEAutorizacao';

export type NFEGerarDanfeProps = {
    /**
     * @param {NFe} data - Dados da NFe
     */
    data: {
        /**
         * @param {LayoutNFe  | LayoutNFe[]} NFe - Dados da NFe
         */
        NFe: LayoutNFe | LayoutNFe[];
        /**
         * @param {ProtNFe} protNFe - Dados da aturoziação de uso da NFe
         */
        protNFe?: ProtNFe;
    };
    /**
     * @param {string} chave - Chave da NFe
     */
    chave: string;
    /**
     * @param {string} outputPath - Local onde a DANFE será gravada
     */
    outputPath: string;
    /**
     * @param {number} pageWidth - Largura da Página
     */
    // pageWidth: 226.772 | 158.74;
    pageWidth?: number;
};
