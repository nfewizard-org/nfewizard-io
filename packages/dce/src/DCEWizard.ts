/*
 * This file is part of NFeWizard-io.
 * 
 * NFeWizard-io is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * NFeWizard-io is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with NFeWizard-io. If not, see <https://www.gnu.org/licenses/>.
 */

import { AxiosInstance } from 'axios';
import { NFeWizardProps } from '@nfewizard/types/shared';
import { DCEAutorizacaoPayload, DCEAutorizacaoResponse } from '@nfewizard/types/dce';
import { Environment, Utility, XmlBuilder, GerarConsulta, SaveFiles, logger } from '@nfewizard/shared';
import { DCEAutorizacaoService } from './services/DCEAutorizacao/DCEAutorizacaoService.js';
import { DCEAutorizacao } from './operations/DCEAutorizacao/DCEAutorizacao.js';

export class DCEWizard {
    private config: NFeWizardProps = {} as NFeWizardProps;
    private environment: Environment = {} as Environment;
    private utility: Utility = {} as Utility;
    private xmlBuilder: XmlBuilder = {} as XmlBuilder;
    private axios: AxiosInstance = {} as AxiosInstance;
    private saveFiles: SaveFiles = {} as SaveFiles;
    private gerarConsulta: GerarConsulta = {} as GerarConsulta;

    constructor() {
        // Construtor vazio - environment sera carregado via NFE_LoadEnvironment
    }

    async NFE_LoadEnvironment({ config }: { config: NFeWizardProps }) {
        try {
            this.config = config;
            this.environment = new Environment(this.config);
            const { axios } = await this.environment.loadEnvironment();
            this.axios = axios;

            this.utility = new Utility(this.environment);
            this.saveFiles = new SaveFiles(this.environment, this.utility);

            this.xmlBuilder = new XmlBuilder(this.environment);
            this.gerarConsulta = new GerarConsulta(this.environment, this.utility, this.xmlBuilder);
        } catch (error) {
            logger.error('', error, { context: 'NFE_LoadEnvironment' });
            throw new Error(`Erro ao inicializar a lib: ${error}`);
        }
    }

    async DCE_Autorizacao(data?: DCEAutorizacaoPayload): Promise<DCEAutorizacaoResponse> {
        try {
            const dceAutorizacaoService = new DCEAutorizacaoService(
                this.environment,
                this.utility,
                this.xmlBuilder,
                this.axios,
                this.saveFiles,
                this.gerarConsulta
            );
            const dceAutorizacao = new DCEAutorizacao(dceAutorizacaoService);
            return await dceAutorizacao.Exec(data);
        } catch (error: any) {
            logger.error('', error, { context: 'DCE_Autorizacao' });
            throw new Error(`DCE_Autorizacao: ${error.message}`);
        }
    }

    async DCE_AutorizacaoZip(data?: DCEAutorizacaoPayload): Promise<DCEAutorizacaoResponse> {
        try {
            const dceAutorizacaoService = new DCEAutorizacaoService(
                this.environment,
                this.utility,
                this.xmlBuilder,
                this.axios,
                this.saveFiles,
                this.gerarConsulta
            );
            const dceAutorizacao = new DCEAutorizacao(dceAutorizacaoService);
            return await dceAutorizacao.ExecZip(data);
        } catch (error: any) {
            logger.error('', error, { context: 'DCE_AutorizacaoZip' });
            throw new Error(`DCE_AutorizacaoZip: ${error.message}`);
        }
    }

    getEnvironment(): Environment {
        return this.environment;
    }
}
