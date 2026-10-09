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

// O layout completo do CT-e (`LayoutCTe`, `InfCte`, `ProtCTe`, etc.) já existe em
// `CTEDacteGenerator.ts` (criado originalmente para o gerador de DACTE). Reexportamos
// aqui em vez de duplicar, para que a Autorização e o DACTE compartilhem os mesmos tipos.
import { LayoutCTe, ProtCTe } from './CTEDacteGenerator.js';
export type { LayoutCTe, ProtCTe };

/**
 * Payload aceito por `CTE_Autorizacao`. Ao contrário da NF-e (que processa um lote
 * `enviNFe` com `idLote`/`indSinc`), o serviço de recepção do CT-e (`CTeRecepcaoSincV4`)
 * é síncrono e recebe **um único CT-e por chamada**. Quando `CTe` é um array, o service
 * transmite cada um sequencialmente (uma chamada de webservice por CT-e).
 */
export interface CTe {
    CTe: LayoutCTe | LayoutCTe[];
}

/** Resultado da autorização de um único CT-e. */
export interface CTeAutorizacaoResultadoItem<T = LayoutCTe> {
    CTe: T;
    protCTe?: ProtCTe;
    xmlAssinado?: string;
}

/** Retorno de `CTE_Autorizacao`. */
export interface CTeAutorizacaoResultado<T = LayoutCTe> {
    success: boolean;
    xMotivo: Array<{ chCTe?: string; cStat?: number | string; xMotivo?: string }>;
    xmls: CTeAutorizacaoResultadoItem<T>[];
}
