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

import { IdeCTe, EmitCTe, Toma4, ImpCTe, ComplCTe, InfCTeSupl, AutXmlCTe, InfCarga, InfModal, CobrCTe, InfCteSubCTe } from './CTEDacteGenerator.js';

type IdeCTeSimp = Omit<IdeCTe, 'toma3' | 'toma03' | 'toma4' | 'indGlobalizado' | 'CFOP' | 'natOp'> & { CFOP: number | string; natOp: string };

/** Tomador do CT-e Simplificado (grupo `toma`; único tomador por documento). */
export type TomaCTeSimp = Toma4 & { indIEToma?: number | string; ISUF?: string };

export interface InfCteSimp {
    Id?: string;
    versao?: string;
    ide: IdeCTeSimp;
    compl?: ComplCTe;
    emit: EmitCTe;
    toma: TomaCTeSimp;
    infCarga?: InfCarga;
    /** Detalhe por prestação (nItem, municípios, vPrest, infNFe/infDocAnt) — até N ocorrências */
    det: Record<string, any> | Array<Record<string, any>>;
    infModal?: InfModal;
    cobr?: CobrCTe;
    infCteSub?: InfCteSubCTe;
    imp?: ImpCTe;
    total: { vTPrest: number | string; vTRec: number | string };
    autXML?: AutXmlCTe | AutXmlCTe[];
    infRespTec?: Record<string, any>;
    infSolicNFF?: Record<string, any>;
    infPAA?: Record<string, any>;
}

/** Layout do CT-e Simplificado (modelo 57, `CTeRecepcaoSimpV4`). */
export interface LayoutCTeSimp {
    versao?: string;
    infCte: InfCteSimp;
    infCTeSupl?: InfCTeSupl;
}

/** Payload de `CTE_SimplificadoAutorizacao`: um ou mais CT-e Simplificados, transmitidos um por chamada. */
export interface CTeSimp {
    CTe: LayoutCTeSimp | LayoutCTeSimp[];
}
