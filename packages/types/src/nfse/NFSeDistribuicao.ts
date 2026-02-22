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
 * Consulta de distribuição por NSU
 */
export type NFSeDistribuicaoPorNSU = {
    nsu: number;
    cnpjConsulta?: string;
    lote?: boolean;
};

/**
 * Consulta de eventos por chave de acesso
 */
export type NFSeEventosPorChave = {
    chaveAcesso: string;
};

/**
 * Item de distribuição
 */
export type DistribuicaoNSU = {
    NSU?: number;
    ChaveAcesso?: string;
    TipoDocumento?: string;
    TipoEvento?: string;
    ArquivoXml?: string;
    DataHoraGeracao?: string;
};

/**
 * Resposta de distribuição
 */
export type NFSeDistribuicaoResponse = {
    StatusProcessamento: 'REJEICAO' | 'NENHUM_DOCUMENTO_LOCALIZADO' | 'DOCUMENTOS_LOCALIZADOS';
    LoteDFe?: DistribuicaoNSU[];
    Alertas?: any[];
    Erros?: any[];
    TipoAmbiente: 'PRODUCAO' | 'HOMOLOGACAO';
    VersaoAplicativo?: string;
    DataHoraProcessamento: string;
};
