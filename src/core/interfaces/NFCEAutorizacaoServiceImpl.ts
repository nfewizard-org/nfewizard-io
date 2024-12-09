import { LayoutNFe, NFe, ProtNFe, GenericObject } from '@Types';

export interface NFCEAutorizacaoServiceImpl {
    Exec(data: NFe): Promise<{
        success: boolean;
        xMotivo: GenericObject;
        xmls: {
            NFe: LayoutNFe;
            protNFe: ProtNFe;
        }[];
    }>
}