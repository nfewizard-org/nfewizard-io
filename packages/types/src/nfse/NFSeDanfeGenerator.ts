/*
 * This file is part of Treeunfe DFe.
 * 
 * Treeunfe DFe is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * Treeunfe DFe is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with Treeunfe DFe. If not, see <https://www.gnu.org/licenses/>.
 */

export type NFSeGerarDanfeProps = {
    /**
     * @param {string} data - XML da NFSe, XML em Base64 ou GZip + Base64
     */
    data: string;
    /**
     * @param {string} outputPath - Local onde a DANFSe será gravada
     */
    outputPath: string;
    /** Chave de acesso, caso não esteja disponível no atributo `Id` do XML. */
    chave?: string;
    /** Exibe a marca d'água "NFeWizard-io" no rodapé. */
    exibirMarcaDaguaDanfe?: boolean;
    /** URL base usada na consulta de autenticidade e no QR Code. */
    urlConsulta?: string;
};
