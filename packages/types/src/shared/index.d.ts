export * from './Utils.js';
export * from './LoadCertificate.js';
export * from './NFEDanfeGenerator.js';
export interface SaveFilesImpl {
    salvaArquivos(...args: any[]): void;
}
export interface GerarConsultaImpl {
    gerarConsulta(...args: any[]): Promise<any>;
}
export interface HttpClient {
    get(...args: any[]): Promise<any>;
    post(...args: any[]): Promise<any>;
}
export interface HttpClientConfig {
    [key: string]: any;
}
export interface NFeWizardServiceImpl {
    [key: string]: any;
}
export interface NFEAutorizacaoServiceImpl {
    Exec(...args: any[]): Promise<any>;
}
export interface NFEconsultaProtocoloServiceImpl {
    Exec(...args: any[]): Promise<any>;
}
export interface NFEDistribuicaoDFeServiceImpl {
    Exec(...args: any[]): Promise<any>;
}
export interface NFEInutilizacaoServiceImpl {
    Exec(...args: any[]): Promise<any>;
}
export interface NFERecepcaoEventoServiceImpl {
    Exec(...args: any[]): Promise<any>;
}
export interface NFERetornoAutorizacaoServiceImpl {
    Exec(...args: any[]): Promise<any>;
}
export interface NFEStatusServicoServiceImpl {
    Exec(...args: any[]): Promise<any>;
}
export interface NFCEAutorizacaoServiceImpl {
    Exec(...args: any[]): Promise<any>;
}
export interface NFCERetornoAutorizacaoServiceImpl {
    getXmlRetorno(...args: any[]): Promise<any>;
}
export interface CTEDistribuicaoDFeServiceImpl {
    Exec(...args: any[]): Promise<any>;
}
//# sourceMappingURL=index.d.ts.map