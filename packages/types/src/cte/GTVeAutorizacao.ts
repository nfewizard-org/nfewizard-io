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

import { IdeCTe, EmitCTe, EnderCTe, ComplCTe, InfCTeSupl, AutXmlCTe, RemCTe, DestCTe } from './CTEDacteGenerator.js';

type IdeGTVe = Omit<Partial<IdeCTe>, 'toma3' | 'toma03' | 'toma4'> & {
    /** Data/hora de saída da origem */
    dhSaidaOrig?: string;
    /** Data/hora de chegada ao destino */
    dhChegadaDest?: string;
    /** Tomador do serviço */
    toma?: number | string;
    tomaTerceiro?: Record<string, any>;
};

export type LocalGTVe = EnderCTe & { fone?: string };

export interface InfCteGTVe {
    Id?: string;
    versao?: string;
    ide: IdeGTVe;
    compl?: ComplCTe;
    emit: EmitCTe;
    rem?: RemCTe;
    dest?: DestCTe;
    origem?: LocalGTVe;
    destino?: LocalGTVe;
    /** Detalhes da guia: infEspecie, qCarga, infVeiculo */
    detGTV?: Record<string, any>;
    autXML?: AutXmlCTe | AutXmlCTe[];
    infRespTec?: Record<string, any>;
}

/** Layout da Guia de Transporte de Valores eletrônica (modelo 64). */
export interface LayoutGTVe {
    versao?: string;
    infCte: InfCteGTVe;
    infCTeSupl?: InfCTeSupl;
}

/** Payload de `CTE_GTVeAutorizacao`: uma ou mais GTV-e, transmitidas uma por chamada. */
export interface GTVe {
    GTVe: LayoutGTVe | LayoutGTVe[];
}
