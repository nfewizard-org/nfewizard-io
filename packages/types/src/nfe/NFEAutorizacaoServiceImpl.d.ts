import { GenericObject } from '../shared/Utils.js';
import { LayoutNFe, NFe, ProtNFe } from './index.js';
export interface NFEAutorizacaoServiceImpl {
    Exec(data: NFe | string): Promise<{
        success: boolean;
        xMotivo: GenericObject;
        xmls: {
            NFe: LayoutNFe;
            protNFe: ProtNFe;
            xmlAssinado?: string;
        }[];
    }>;
    ExecTransmitirContingencia?(data: NFe | string): Promise<{
        success: boolean;
        xMotivo: GenericObject;
        xmls: {
            NFe: LayoutNFe;
            protNFe: ProtNFe;
            xmlAssinado?: string;
        }[];
    }>;
}
//# sourceMappingURL=NFEAutorizacaoServiceImpl.d.ts.map