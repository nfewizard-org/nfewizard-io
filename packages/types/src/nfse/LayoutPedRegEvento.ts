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
 * Layout do Pedido de Registro de Evento (pedRegEvento)
 */
export interface LayoutPedRegEvento {
  infPedReg: InfPedReg;
  Signature?: any;
}

export type InfPedReg = {
  tpAmb: 1 | 2;
  verAplic: string;
  dhEvento: string;
  CNPJAutor?: string;
  CPFAutor?: string;
  chNFSe: string;
  e101101?: EventoCancelamento; // Cancelamento
  e105102?: EventoCancelamentoSubstituicao; // Cancelamento por substituição
  e101103?: any; // Solicitação de Análise Fiscal para Cancelamento
  e105104?: any; // Cancelamento Deferido por Análise Fiscal
  e105105?: any; // Cancelamento Indeferido por Análise Fiscal
  e202201?: any; // Confirmação do Prestador
  e203202?: any; // Confirmação do Tomador
  e204203?: any; // Confirmação do Intermediário
  e205204?: any; // Confirmação Tácita
  e202205?: any; // Rejeição do Prestador
  e203206?: any; // Rejeição do Tomador
  e204207?: any; // Rejeição do Intermediário
  e205208?: any; // Anulação da Rejeição
  e305101?: any; // Cancelamento por Ofício
  e305102?: any; // Bloqueio por Ofício
  e305103?: any; // Desbloqueio por Ofício
  e907201?: any; // Inclusão NFSe DAN
  e907209?: any; // Tributos NFSe Recolhidos
};

/**
 * Evento de Cancelamento (e101101)
 */
export type EventoCancelamento = {
  xDesc: 'Cancelamento de NFS-e';
  cMotivo: 1 | 2 | 9; // 1 - Erro na Emissão; 2 - Serviço não Prestado; 9 - Outros
  xMotivo: string; // Descrição do motivo
};

/**
 * Evento de Cancelamento por Substituição (e105102)
 */
export type EventoCancelamentoSubstituicao = {
  xDesc: 'Cancelamento de NFS-e por Substituição';
  chNFSeSubst: string; // Chave da NFSe substituta
};
