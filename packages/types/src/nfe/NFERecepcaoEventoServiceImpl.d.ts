import { EventoNFe } from './NFERecepcaoEvento.js';
import { GenericObject } from '../shared/Utils.js';
export interface NFERecepcaoEventoServiceImpl {
    Exec(data: EventoNFe): Promise<{
        success: boolean;
        xMotivos: any[];
        response: GenericObject[];
    }>;
}
//# sourceMappingURL=NFERecepcaoEventoServiceImpl.d.ts.map