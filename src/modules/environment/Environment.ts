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
import https from 'https';

import { NFeWizardProps } from 'src/core/types'
import { AxiosInstance } from 'axios';

import AxiosHttpClient from './AxiosHttpClient';
import HttpClientBuilder from './HttpClientBuilder';
import ValidateEnvironment from './ValidateEnvironment';
import LoadCertificate from './LoadCertificate';
import { logger } from '@Core/exceptions/logger';

class Environment {
    config: NFeWizardProps;
    certificate: string;
    cert_key: string;
    agent: https.Agent;
    public isLoaded: boolean;
    constructor(config: NFeWizardProps) {
        this.config = config;
        this.certificate = '';
        this.cert_key = '';
        this.agent = {} as https.Agent;
        this.isLoaded = false;
    }

    getIsLoaded() {
        return this.isLoaded;
    }

    getConfig() {
        return this.config;
    }

    getCertKey() {
        return this.cert_key;
    }

    getCert() {
        return this.certificate;
    }

    getHttpAgent() {
        return this.agent;
    }

    private LoggerInit(config: NFeWizardProps) {
        try {
            if (config.lib?.log) {
                logger.initialize({
                    exibirLogNoConsole: config.lib.log.exibirLogNoConsole ?? false,
                    armazenarLogs: config.lib.log.armazenarLogs ?? false,
                    pathLogs: config.lib.log.pathLogs
                });
            }

            logger.info('Inicializando ambiente NFeWizard', {
                context: 'Environment',
                // config,
            });

        } catch (error) {
            logger.error('Erro ao inicializar ambiente NFeWizard', error, { context: 'Environment' });
            throw error;
        }
    }

    async loadEnvironment() {
        /** 
         * Inicializa Logger 
         * */
        this.LoggerInit(this.config);

        /** 
         * Verifica configurações obrigatórias 
         * */
        const validateEnvironment = new ValidateEnvironment();
        validateEnvironment.checkRequiredSettings(this.config);

        /** 
         * Carrega Certificados 
         * */
        const loadCertificate = new LoadCertificate(this.config);
        const { agent, certificate, cert_key } = await loadCertificate.loadCertificate();

        this.agent = agent;
        this.certificate = certificate;
        this.cert_key = cert_key;


        /** 
         * Configura HttpClient 
         * */
        const httpClient = new AxiosHttpClient();
        const configAgent = new HttpClientBuilder<AxiosInstance>(this.config, this.agent, httpClient);
        const axios = configAgent.createHttpClient();

        /** 
         * Armazena informação de ambiente carregado 
         * */
        this.isLoaded = true;

        logger.info('Ambiente NFe Wizard inicializado com sucesso', { context: 'Environment' });

        return { axios }
    }

}

export default Environment;