import { NFeWizardProps } from '@nfewizard/types/shared';
import https from 'https';
import { HttpClient } from '@nfewizard/types/shared';
declare class HttpClientBuilder<T> {
    private config;
    private agent;
    private httpClient;
    constructor(config: NFeWizardProps, agent: https.Agent, httpClient: HttpClient<T>);
    createHttpClient(): T;
}
export { HttpClientBuilder };
//# sourceMappingURL=HttpClientBuilder.d.ts.map