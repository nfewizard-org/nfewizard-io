import https from 'https';

export interface HttpClient<T = any> {
    create(config: HttpClientConfig): T;
}

export interface HttpClientConfig {
    headers: Record<string, string>;
    timeout: number;
    agent?: https.Agent;
}