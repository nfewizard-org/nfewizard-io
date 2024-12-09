import { EventoNFe } from '@Types/NFERecepcaoEvento';
import { GenericObject } from '@Types/Utils';

export interface NFERecepcaoEventoServiceImpl {
    Exec(data: EventoNFe): Promise<{
        success: boolean;
        xMotivos: any[];
        response: GenericObject[];
    }>
}