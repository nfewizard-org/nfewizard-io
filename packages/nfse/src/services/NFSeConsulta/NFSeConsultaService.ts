/*
 * This file is part of Treeunfe DFe.
 * 
 * Treeunfe DFe is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * Treeunfe DFe is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with Treeunfe DFe. If not, see <https://www.gnu.org/licenses/>.
 */
import { XmlBuilder, Environment, Utility, BaseNFSe } from '@nfewizard/shared';
import { GerarConsultaImpl, NFSeConsultaServiceImpl, SaveFilesImpl } from '@nfewizard/types/interfaces';
import { DpsConsultaPorId, DpsConsultaResponse, NFSeConsultaPorChave, NFSeConsultaResponse } from '@nfewizard/types';
import { AxiosInstance } from 'axios';

class NFSeConsultaService extends BaseNFSe implements NFSeConsultaServiceImpl {
    private consultaTipo: 'NFSe' | 'DPS' = 'NFSe';

    constructor(environment: Environment, utility: Utility, xmlBuilder: XmlBuilder, axios: AxiosInstance, saveFiles: SaveFilesImpl, gerarConsulta: GerarConsultaImpl) {
        super(environment, utility, xmlBuilder, 'NFSe_Consulta', axios, saveFiles, gerarConsulta);
    }

    protected prepararDados(_data?: any): any {
        return null; // GET request não precisa de body
    }

    protected getHttpMethod(): 'GET' | 'POST' | 'PUT' | 'DELETE' {
        return 'GET';
    }

    protected getUrlPath(data?: any): string {
        if (this.consultaTipo === 'DPS' && data && 'id' in data) {
            return `/${(data as DpsConsultaPorId).id}`;
        }
        if (data && 'chaveAcesso' in data) {
            return `/${(data as NFSeConsultaPorChave).chaveAcesso}`;
        }
        return '';
    }

    protected getWebServiceUrl(): string {
        if (this.consultaTipo === 'DPS') {
            return this.utility.getWebServiceUrlNFSe('NFSe_ConsultaDPS');
        }
        return this.utility.getWebServiceUrlNFSe('NFSe_Consulta');
    }

    async Exec(data: NFSeConsultaPorChave): Promise<NFSeConsultaResponse> {
        this.consultaTipo = 'NFSe';
        return await super.Exec(data) as NFSeConsultaResponse;
    }

    async ConsultaDPS(data: DpsConsultaPorId): Promise<DpsConsultaResponse> {
        this.consultaTipo = 'DPS';
        return await super.Exec(data) as DpsConsultaResponse;
    }
}

export default NFSeConsultaService;
