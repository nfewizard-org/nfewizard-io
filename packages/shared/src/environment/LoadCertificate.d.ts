import { CertificateLoadReturn, NFeWizardProps } from '@nfewizard/types/shared';
declare class LoadCertificate {
    private config;
    private certificate;
    private cert_key;
    constructor(config: NFeWizardProps);
    private loadCertificateWithPEM;
    private loadCertificateWithNodeForge;
    loadCertificate(): Promise<CertificateLoadReturn>;
}
export { LoadCertificate };
//# sourceMappingURL=LoadCertificate.d.ts.map