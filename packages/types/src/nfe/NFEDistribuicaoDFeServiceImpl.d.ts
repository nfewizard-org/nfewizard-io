import { ConsultaNFe } from './NFEDistribuicaoDFe.js';
import { GenericObject } from '../shared/Utils.js';
export interface NFEDistribuicaoDFeServiceImpl {
    Exec(data: ConsultaNFe): Promise<{
        data: GenericObject;
        xMotivo: any;
        filesList: string[];
    }>;
}
//# sourceMappingURL=NFEDistribuicaoDFeServiceImpl.d.ts.map