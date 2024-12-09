import { ProtNFe } from '@Types';

export interface NFCERetornoAutorizacaoServiceImpl {
    getXmlRetorno({ tipoEmissao, nRec, protNFe, xmlNFe }: {
        tipoEmissao: number;
        nRec?: string;
        protNFe?: ProtNFe[];
        xmlNFe: string[];
    }): Promise<{
        success: boolean;
        message: any;
        data: string[];
    }>
}