import { Utility } from '../utils/Utility.js';
import { SaveFilesImpl } from '@nfewizard/types/shared';
import { Environment } from '../environment/Environment.js';
import { GenericObject } from '@nfewizard/types/shared';
import { AxiosResponse } from 'axios';
declare class SaveFiles implements SaveFilesImpl {
    utility: Utility;
    environment: Environment;
    constructor(environment: Environment, utility: Utility);
    salvaArquivos(xmlConsulta: string, responseInJson: GenericObject | undefined, xmlRetorno: AxiosResponse<any, any>, metodo: string, xmlFormated?: string, options?: Record<string, any>): void;
}
export { SaveFiles };
//# sourceMappingURL=SaveFiles.d.ts.map