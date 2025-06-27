import { NFeWizardProps } from '@Types';
import https from 'https';
import { HttpClient } from '@Interfaces';
import { logger } from '@Core/exceptions/logger';

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

export default HttpClientBuilder;