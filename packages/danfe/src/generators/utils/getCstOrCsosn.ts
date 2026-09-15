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
import { ICMS } from '@nfewizard/types/nfe';

/**
 * Para os grupos ICMSSNxxx (Simples Nacional) o DANFE deve exibir o CSOSN.
 * Para os demais grupos de ICMS (regime normal), o DANFE deve exibir o CST.
 */
export function getCstOrCsosn(ICMS: ICMS): string {
    const chavesICMS = Object.keys(ICMS) as (keyof ICMS)[];

    if (chavesICMS.length === 0) {
        return '';
    }

    const tipoICMS = chavesICMS[0];
    const dadosICMS = ICMS[tipoICMS] as any;

    if (!dadosICMS) {
        return '';
    }

    if (String(tipoICMS).startsWith('ICMSSN')) {
        return String(dadosICMS.CSOSN ?? '');
    }

    return String(dadosICMS.CST ?? '');
}
