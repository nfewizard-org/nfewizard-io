import https from 'https';
import { NFeWizardProps } from '@nfewizard/types/shared';
import { AxiosInstance } from 'axios';
declare class Environment {
    config: NFeWizardProps;
    certificate: string;
    cert_key: string;
    agent: https.Agent;
    isLoaded: boolean;
    constructor(config: NFeWizardProps);
    getIsLoaded(): boolean;
    getConfig(): NFeWizardProps;
    getCertKey(): string;
    getCert(): string;
    getHttpAgent(): https.Agent;
    private LoggerInit;
    loadEnvironment(): Promise<{
        axios: AxiosInstance;
    }>;
}
export { Environment };
//# sourceMappingURL=Environment.d.ts.map