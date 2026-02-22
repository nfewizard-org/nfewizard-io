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

import { LayoutDPS } from './LayoutDPS.js';

/**
 * Estrutura principal para autorização de NFSe
 * Aceita tanto JSON (DPS) quanto Base64 (dpsXmlGZipB64)
 */
export type NFSe = {
  /**
   * DPS (Documento de Prestação de Serviços) em formato JSON
   * A biblioteca montará o XML, assinará, compactará e codificará automaticamente
   */
  DPS?: LayoutDPS | LayoutDPS[];
  /**
   * DPS (Documento de Prestação de Serviços) já compactado em GZip e codificado em Base64
   * Use este campo se já tiver o DPS processado
   */
  dpsXmlGZipB64?: string;
};

/**
 * Resposta de sucesso da autorização de NFSe
 */
export type NFSeAutorizacaoResponse = {
  tipoAmbiente: 1 | 2;
  versaoAplicativo: string;
  dataHoraProcessamento: string;
  idDps: string;
  chaveAcesso: string;
  nfseXmlGZipB64: string;
  alertas?: MensagemProcessamento[];
};

/**
 * Resposta de erro da autorização de NFSe
 */
export type NFSeAutorizacaoErroResponse = {
  tipoAmbiente: 1 | 2;
  versaoAplicativo: string;
  dataHoraProcessamento: string;
  idDPS?: string;
  erros: MensagemProcessamento[];
};

/**
 * Mensagem de processamento
 */
export type MensagemProcessamento = {
  mensagem?: string;
  codigo?: string;
  descricao?: string;
  complemento?: string;
};

/**
 * Layout da NFSe (após descompactação e parsing)
 */
export type LayoutNFSe = {
  [key: string]: any;
};
