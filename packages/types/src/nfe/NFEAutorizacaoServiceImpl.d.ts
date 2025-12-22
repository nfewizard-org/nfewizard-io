import { GenericObject } from '../shared/Utils.js';
import { LayoutNFe, NFe, ProtNFe } from './index.js';
export interface NFEAutorizacaoServiceImpl {
    Exec(data: NFe): Promise<{
        success: boolean;
        xMotivo: GenericObject;
        xmls: {
            NFe: LayoutNFe;
            protNFe: ProtNFe;
        }[];
    }>;
}
//# sourceMappingURL=NFEAutorizacaoServiceImpl.d.ts.map