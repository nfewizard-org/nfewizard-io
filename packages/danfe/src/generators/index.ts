/**
 * NFeWizard DANFE Generators
 * @module @nfewizard/danfe/generators
 * @license GPL-3.0-or-later
 */

import { NFeGerarDanfe } from './NFEGerarDanfe.js';
import { NFCeGerarDanfe } from './NFCEGerarDanfe.js';
import type { NFEGerarDanfeProps, NFCEGerarDanfeProps } from '@nfewizard/types/nfe';

// Exporta as classes originais
export { NFeGerarDanfe, NFCeGerarDanfe };

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
