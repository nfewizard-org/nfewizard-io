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


    async loadEnvironment() {
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
        return { axios }
    }

}

export default Environment;