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

/**
 * Códigos de status (`cStat`) relevantes ao retorno da Consulta de
 * Situação/Protocolo do CT-e (`retConsSitCTe`), conforme MOC do CT-e.
 */
export type CStatConsultaProtocoloCTe =
    | 100 // Autorizado o uso do CT-e
    | 101 // Cancelamento de CT-e homologado
    | 110 // Uso Denegado (mantido por compatibilidade com CT-e antigos)
    | 217 // CT-e não consta na base de dados da SEFAZ
    | 252 // Ambiente informado diverge do Ambiente de recebimento
    | number;

/** Estrutura do protocolo de autorização (`protCTe`) retornado pela consulta. */
export interface InfProtCTeConsulta {
    tpAmb: number;
    verAplic: string;
    chCTe: string;
    dhRecbto: string;
    nProt?: string;
    digVal?: string;
    cStat: CStatConsultaProtocoloCTe;
    xMotivo: string;
}

export interface ProtCTeConsulta {
    infProt: InfProtCTeConsulta;
}

/** Evento vinculado ao CT-e retornado pela consulta (`procEventoCTe`). */
export interface ProcEventoCTeConsulta {
    [key: string]: any;
}

/** Retorno de `CTE_ConsultaProtocolo`. */
export interface RetConsSitCTe {
    versao: string;
    tpAmb: number;
    verAplic: string;
    cStat: CStatConsultaProtocoloCTe;
    xMotivo: string;
    cUF: string;
    protCTe?: ProtCTeConsulta;
    procEventoCTe?: ProcEventoCTeConsulta[];
}
