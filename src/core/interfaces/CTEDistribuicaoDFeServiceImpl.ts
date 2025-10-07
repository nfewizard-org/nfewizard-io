import { ConsultaNFe } from '@Types/NFEDistribuicaoDFe';
import { GenericObject } from '@Types/Utils';

export interface CTEDistribuicaoDFeServiceImpl {
    Exec(data: ConsultaNFe): Promise<{
        data: GenericObject;
        xMotivo: any;
        filesList: string[];
    }>
}
