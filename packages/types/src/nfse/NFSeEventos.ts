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
 * Tipos de eventos NFSe
 */
export enum TipoEventoNFSe {
    CANCELAMENTO = 101101,
    SOLICITACAO_CANCELAMENTO_ANALISE_FISCAL = 101103,
    CANCELAMENTO_POR_SUBSTITUICAO = 105102,
    CANCELAMENTO_DEFERIDO_ANALISE_FISCAL = 105104,
    CANCELAMENTO_INDEFERIDO_ANALISE_FISCAL = 105105,
    CONFIRMACAO_PRESTADOR = 202201,
    REJEICAO_PRESTADOR = 202205,
    CONFIRMACAO_TOMADOR = 203202,
    REJEICAO_TOMADOR = 203206,
    CONFIRMACAO_INTERMEDIARIO = 204203,
    REJEICAO_INTERMEDIARIO = 204207,
    CONFIRMACAO_TACITA = 205204,
    ANULACAO_REJEICAO = 205208,
    CANCELAMENTO_POR_OFICIO = 305101,
    BLOQUEIO_POR_OFICIO = 305102,
    DESBLOQUEIO_POR_OFICIO = 305103,
    INCLUSAO_NFSE_DAN = 907201,
    TRIBUTOS_NFSE_RECOLHIDOS = 907209
}

import { LayoutPedRegEvento } from './LayoutPedRegEvento.js';

/**
 * Requisição de registro de evento
 */
export type NFSeEventoRequest = {
    chaveAcesso: string;
    pedidoRegistroEventoXmlGZipB64?: string; // Opcional, se pedRegEvento for fornecido
    pedRegEvento?: LayoutPedRegEvento; // Novo campo para JSON do evento
};

/**
 * Consulta de evento
 */
export type NFSeEventoConsulta = {
    chaveAcesso: string;
    tipoEvento: TipoEventoNFSe;
    numSeqEvento: number;
};

/**
 * Resposta de sucesso de evento (registro)
 */
export type NFSeEventoResponse = {
    tipoAmbiente: 1 | 2;
    versaoAplicativo: string;
    dataHoraProcessamento: string;
    eventoXmlGZipB64?: string; // Presente no registro de evento
    eventos?: Array<{ // Presente na consulta de evento
        chaveAcesso: string;
        tipoEvento: number;
        numeroPedidoRegistroEvento: number;
        dataHoraRecebimento: string;
        arquivoXml: string; // Base64 do XML do evento
    }>;
};
