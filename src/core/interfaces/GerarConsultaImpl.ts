import { Agent } from 'http';

export interface GerarConsultaImpl {
    gerarConsulta(xmlConsulta: string, metodo: string, ambienteNacional?: boolean, versao?: string, mod?: string, rootTag?: boolean, tag?: string): Promise<{
        xmlFormated: string;
        agent: Agent;
        webServiceUrl: string;
        action: string;
    }>
}