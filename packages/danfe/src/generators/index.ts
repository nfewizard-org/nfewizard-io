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
import { XmlParser } from '@nfewizard/shared';
import type { NFEGerarDanfeProps } from '@nfewizard/types/nfe';
import type { NFSeGerarDanfeProps } from './NFSeGerarDanfe.js';

// `NFCEGerarDanfeProps` n\u00e3o existe como tipo separado: o gerador de NFCe
// reutiliza a mesma forma de `NFEGerarDanfeProps`.
type NFCEGerarDanfePropsLocal = NFEGerarDanfeProps;

// Exporta as classes originais
export { NFeGerarDanfe, NFCeGerarDanfe, NFSeGerarDanfe };

/**
 * Variante de input que aceita o XML autorizado (`nfeProc`) ou a `NFe`
 * solo em string. Internamente, o XML \u00e9 convertido para o JSON do padr\u00e3o
 * esperado pelo gerador antes de prosseguir com o fluxo normal.
 */
export type NFEGerarDanfePropsFromXml = Omit<NFEGerarDanfeProps, 'data' | 'chave'> & {
    /** XML autorizado (`nfeProc`) ou XML da `NFe`. */
    data: string;
    /** Chave de acesso. Opcional quando o XML cont\u00e9m `protNFe.infProt.chNFe` ou `infNFe.Id`. */
    chave?: string;
};

function isXmlInput(params: NFEGerarDanfeProps | NFEGerarDanfePropsFromXml): params is NFEGerarDanfePropsFromXml {
    return typeof (params as NFEGerarDanfePropsFromXml).data === 'string';
}

function normalizeDanfeParams(params: NFEGerarDanfeProps | NFEGerarDanfePropsFromXml): NFEGerarDanfeProps {
    if (!isXmlInput(params)) return params;

    const { data: xml, chave: chaveOverride, ...rest } = params;
    const { data, chave } = new XmlParser().convertXmlNfeProcToJson(xml);

    return {
        ...rest,
        data: data as NFEGerarDanfeProps['data'],
        chave: chaveOverride || chave,
    } as NFEGerarDanfeProps;
}

/**
 * Gera DANFE para NFe.
 *
 * Aceita tanto o JSON do padr\u00e3o da lib (`NFEGerarDanfeProps`) quanto um XML
 * autorizado em string (`NFEGerarDanfePropsFromXml`); neste \u00faltimo caso, o
 * XML \u00e9 convertido em JSON antes de gerar o PDF.
 *
 * @param params - Par\u00e2metros para gera\u00e7\u00e3o do DANFE NFe.
 * @returns Promise com o resultado da gera\u00e7\u00e3o do PDF.
 */
export async function NFE_GerarDanfe(params: NFEGerarDanfeProps | NFEGerarDanfePropsFromXml) {
    const normalized = normalizeDanfeParams(params);
    const danfe = new NFeGerarDanfe(normalized);
    return await danfe.generatePDF();
}

/**
 * Gera DANFE para NFCe.
 *
 * Aceita tanto o JSON do padr\u00e3o da lib (`NFCEGerarDanfeProps`) quanto um XML
 * autorizado em string; neste \u00faltimo caso, o XML \u00e9 convertido em JSON antes
 * de gerar o PDF.
 *
 * @param params - Par\u00e2metros para gera\u00e7\u00e3o do DANFE NFCe.
 * @returns Promise com o resultado da gera\u00e7\u00e3o do PDF.
 */
export async function NFCE_GerarDanfe(params: NFCEGerarDanfePropsLocal | NFEGerarDanfePropsFromXml) {
    const normalized = normalizeDanfeParams(params as NFEGerarDanfeProps | NFEGerarDanfePropsFromXml);
    const danfe = new NFCeGerarDanfe(normalized);
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
