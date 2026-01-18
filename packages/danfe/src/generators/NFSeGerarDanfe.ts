/*
 * This file is part of NFeWizard.
 * 
 * NFeWizard is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * NFeWizard is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with NFeWizard. If not, see <https://www.gnu.org/licenses/>.
 */

import { Environment, logger } from '@nfewizard/shared';
import type { AxiosInstance } from 'axios';
import fs from 'fs';
import path from 'path';

export interface NFSeGerarDanfeProps {
    /**
     * Chave de acesso da NFSe
     */
    chaveAcesso: string;
    
    /**
     * Caminho completo onde o PDF será salvo
     */
    outputPath: string;
}

/**
 * Gera DANFSe (Documento Auxiliar da Nota Fiscal de Serviços Eletrônica) em PDF
 * 
 * @example
 * ```typescript
 * import { NFSeGerarDanfe } from '@nfewizard/danfe';
 * 
 * const resultado = await NFSeGerarDanfe({
 *   environment,
 *   axios,
 *   data: {
 *     chaveAcesso: '35000000000000000000000000000000000000000001',
 *     outputPath: 'tmp/danfse.pdf'
 *   }
 * });
 * ```
 */
export async function NFSeGerarDanfe({
    environment,
    axios,
    data,
}: {
    environment: Environment;
    axios: AxiosInstance;
    data: NFSeGerarDanfeProps;
}): Promise<{
    success: boolean;
    message: string;
}> {
    try {
        // Monta a URL do webservice
        const config = environment.getConfig();
        const baseUrl = getWebServiceUrlNFSe(config);
        const webServiceUrl = `${baseUrl}/${data.chaveAcesso}`;

        logger.http('Iniciando geração de DANFSe', {
            context: 'NFSeGerarDanfe',
            url: webServiceUrl,
            chaveAcesso: data.chaveAcesso,
        });

        // Obtém o agent HTTPS do environment para garantir autenticação mútua TLS
        const agent = environment.getHttpAgent();

        const requestConfig = {
            headers: {
                'Accept': 'application/pdf',
            },
            responseType: 'arraybuffer' as const,
            httpsAgent: agent
        };

        const response = await axios.get(webServiceUrl, requestConfig);

        // Garante que o diretório existe
        const outputDir = path.dirname(data.outputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Salva o PDF
        fs.writeFileSync(data.outputPath, response.data);

        logger.http('DANFSe gerada com sucesso', {
            context: 'NFSeGerarDanfe',
            outputPath: data.outputPath,
        });

        return {
            success: true,
            message: `DANFSe gerada em '${data.outputPath}'`,
        };
    } catch (error: any) {
        logger.error('Erro ao gerar DANFSe', error, {
            context: 'NFSeGerarDanfe',
        });
        throw new Error(`Erro ao gerar DANFSe: ${error.message}`);
    }
}

/**
 * Obtém a URL do webservice de DANFSe
 */
function getWebServiceUrlNFSe(config: any): string {
    const ambiente = config.nfse?.ambiente || 2;
    const uf = config.dfe?.UF || 'SP';
    
    // URLs de exemplo - devem ser ajustadas conforme o município
    const urls: Record<number, Record<string, string>> = {
        1: { // Produção
            'SP': 'https://nfse.prefeitura.sp.gov.br/ws/danfse',
        },
        2: { // Homologação
            'SP': 'https://homologacao.nfse.prefeitura.sp.gov.br/ws/danfse',
        }
    };

    const url = urls[ambiente]?.[uf];
    
    if (!url) {
        throw new Error(`URL de DANFSe não configurada para UF=${uf} e ambiente=${ambiente}`);
    }

    return url;
}
