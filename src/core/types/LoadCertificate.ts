import https from 'https';

export type CertificateLoadResult = {
    success: boolean;
    agent: https.Agent;
    message: string;
}

export type CertificateLoadReturn = {
    certificate: string;
    cert_key: string;
    agent: https.Agent;
}