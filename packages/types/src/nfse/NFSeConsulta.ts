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

/**
 * Consulta de NFSe por chave de acesso
 */
export type NFSeConsultaPorChave = {
    chaveAcesso: string;
};

/**
 * Consulta de DPS por ID
 */
export type DpsConsultaPorId = {
    id: string;
};

/**
 * Resposta de consulta de NFSe
 */
export type NFSeConsultaResponse = {
    tipoAmbiente: 1 | 2;
    versaoAplicativo: string;
    dataHoraProcessamento: string;
    chaveAcesso: string;
    nfseXmlGZipB64: string;
};

/**
 * Resposta de consulta de DPS
 */
export type DpsConsultaResponse = {
    tipoAmbiente: 1 | 2;
    versaoAplicativo: string;
    dataHoraProcessamento: string;
    idDps: string;
    chaveAcesso: string;
};
