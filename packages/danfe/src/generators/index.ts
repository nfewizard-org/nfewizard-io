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
 * NFeWizard DANFE Generators
 * @module @nfewizard/danfe/generators
 * @license GPL-3.0-or-later
 */

import { NFeGerarDanfe } from './NFEGerarDanfe.js';
import { NFCeGerarDanfe } from './NFCEGerarDanfe.js';
import { NFSeGerarDanfe } from './NFSeGerarDanfe.js';
import type { NFEGerarDanfeProps, NFCEGerarDanfeProps } from '@nfewizard/types/nfe';
import type { NFSeGerarDanfeProps } from './NFSeGerarDanfe.js';

// Exporta as classes originais
export { NFeGerarDanfe, NFCeGerarDanfe, NFSeGerarDanfe };

/**
 * Gera DANFE para NFe
 * @param params - Parâmetros para geração do DANFE NFe
 * @returns Promise com o resultado da geração do PDF
 */
export async function NFE_GerarDanfe(params: NFEGerarDanfeProps) {
    const danfe = new NFeGerarDanfe(params);
    return await danfe.generatePDF();
}

/**
 * Gera DANFE para NFCe
 * @param params - Parâmetros para geração do DANFE NFCe
 * @returns Promise com o resultado da geração do PDF
 */
export async function NFCE_GerarDanfe(params: NFCEGerarDanfeProps) {
    const danfe = new NFCeGerarDanfe(params);
    return await danfe.generatePDF();
}

/**
 * Gera DANFSe (Documento Auxiliar da NFSe)
 * @param params - Parâmetros para geração do DANFSe
 * @returns Promise com o resultado da geração do PDF
 */
export async function NFSE_GerarDanfe(params: {
    environment: any;
    axios: any;
    data: NFSeGerarDanfeProps;
}) {
    return await NFSeGerarDanfe(params);
}
