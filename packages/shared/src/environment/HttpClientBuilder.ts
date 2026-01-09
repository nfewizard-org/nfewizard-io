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

import { NFeWizardProps } from '@nfewizard/types/shared';
import https from 'https';
import { HttpClient } from '@nfewizard/types/shared';
import { logger } from '../exceptions/logger.js';

class HttpClientBuilder<T> {
    private config: NFeWizardProps;
    private agent: https.Agent;
    private httpClient: HttpClient<T>;

    constructor(config: NFeWizardProps, agent: https.Agent, httpClient: HttpClient<T>) {
        this.config = config;
        this.agent = agent;
        this.httpClient = httpClient;
    }
    createHttpClient(): T {
        logger.info('Criando client HTTP', {
            context: 'createHttpClient',
        });
        try {
            const axiosConfig = {
                headers: {
                    'Content-Type': 'text/xml; charset=utf-8',
                },
                httpsAgent: this.agent,
                timeout: this.config.lib?.connection?.timeout || 60000, // Timeout padrão de 60 segundos se não for configurado
            };

            return this.httpClient.create(axiosConfig);
        } catch (error: any) {
            logger.error('Erro ao criar client HTTP', error, { context: 'createHttpClient' });
            throw new Error(error.message);
        }
    }
}

export { HttpClientBuilder };
