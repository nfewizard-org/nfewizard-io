import { ProtNFe } from './index.js';
export interface NFERetornoAutorizacaoServiceImpl {
    getXmlRetorno({ tipoEmissao, nRec, protNFe, xmlNFe }: {
        tipoEmissao: number;
        nRec?: string;
        protNFe?: ProtNFe[];
        xmlNFe: string[];
    }): Promise<{
        success: boolean;
        message: any;
        data: string[];
    }>;
}
//# sourceMappingURL=NFERetornoAutorizacaoServiceImpl.d.ts.map