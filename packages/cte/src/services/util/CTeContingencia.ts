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

/** Formas de emissão (`tpEmis`) do CT-e. */
export const TP_EMIS = {
    NORMAL: 1,
    NFF: 3,
    EPEC: 4,
    FSDA: 5,
    SVC_RS: 7,
    SVC_SP: 8,
} as const;

/** Formas de emissão em contingência, que exigem `dhCont` e `xJust` em `ide`. */
export const TP_EMIS_CONTINGENCIA: number[] = [TP_EMIS.EPEC, TP_EMIS.FSDA, TP_EMIS.SVC_RS, TP_EMIS.SVC_SP];

/** Extrai o `tpEmis` (posição 35) da chave de acesso de 44 dígitos. */
export function tpEmisDaChave(chave: string): number {
    return Number(String(chave).charAt(34));
}

/** A chave pertence a um CT-e autorizado em SVC-RS ou SVC-SP? */
export function chaveEmSvc(chave: string): boolean {
    const tpEmis = tpEmisDaChave(chave);
    return tpEmis === TP_EMIS.SVC_RS || tpEmis === TP_EMIS.SVC_SP;
}
