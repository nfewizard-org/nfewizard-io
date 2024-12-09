import { GenericObject } from '@Types/Utils';
import { AxiosResponse } from 'axios';

export interface SaveFilesImpl {
    salvaArquivos(xmlConsulta: string, responseInJson: GenericObject, xmlRetorno: AxiosResponse<any, any>, metodo: string, options?: Record<string, any>): void
}