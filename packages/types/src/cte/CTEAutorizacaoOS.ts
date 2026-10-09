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

import { IdeCTe, EmitCTe, Toma4, VPrest, ImpCTe, ComplCTe, InfCTeSupl, AutXmlCTe, InfModal, CobrCTe, InfCteSubCTe } from './CTEDacteGenerator.js';

type IdeCTeOS = Omit<IdeCTe, 'toma3' | 'toma03' | 'toma4' | 'indGlobalizado' | 'retira' | 'xDetRetira'> & {
    /** Percurso do veículo (UF de percurso) */
    infPercurso?: { UFPer: string } | Array<{ UFPer: string }>;
};

/** Tomador/usuário do serviço do CT-e OS (grupo `toma`). */
export type TomaCTeOS = Omit<Toma4, 'toma'>;

export interface InfCteOS {
    /** Informado pela lib a partir da chave de acesso calculada. */
    Id?: string;
    versao?: string;
    ide: IdeCTeOS;
    compl?: ComplCTe;
    emit: EmitCTe;
    toma: TomaCTeOS;
    vPrest: VPrest;
    imp?: ImpCTe;
    /** Grupo do CT-e normal: infServico, infDocRef, seg, infModal (rodoOS), infCteSub, cobr, infGTVe */
    infCTeNorm?: { infModal?: InfModal; infCteSub?: InfCteSubCTe; cobr?: CobrCTe; [campo: string]: any };
    infCteComp?: { chCTe: string };
    autXML?: AutXmlCTe | AutXmlCTe[];
    infRespTec?: Record<string, any>;
    pgtoVinc?: Record<string, any>;
}

/** Layout do CT-e Outros Serviços (modelo 67). */
export interface LayoutCTeOS {
    versao?: string;
    infCte: InfCteOS;
    infCTeSupl?: InfCTeSupl;
}

/** Payload de `CTE_AutorizacaoOS`: um ou mais CT-e OS, transmitidos um por chamada. */
export interface CTeOS {
    CTe: LayoutCTeOS | LayoutCTeOS[];
}
