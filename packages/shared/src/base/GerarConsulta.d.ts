import { XmlBuilder } from '../adapters/XmlBuilder.js';
import { Utility } from '../utils/Utility.js';
import { GerarConsultaImpl } from '@nfewizard/types/shared';
import { Environment } from '../environment/Environment.js';
declare class GerarConsulta implements GerarConsultaImpl {
    utility: Utility;
    environment: Environment;
    xmlBuilder: XmlBuilder;
    constructor(environment: Environment, utility: Utility, xmlBuilder: XmlBuilder);
    createSoapEnvelop(xmlConsulta: string, metodo: string, method: string, rootTag?: boolean, tag?: string, dadosMsgTag?: string): any;
    gerarConsulta(xmlConsulta: string, metodo: string, ambienteNacional?: boolean, versao?: string, mod?: string, rootTag?: boolean, tag?: string, dadosMsgTag?: string): Promise<{
        xmlFormated: any;
        agent: import("https").Agent;
        webServiceUrl: string;
        action: any;
    }>;
}
export { GerarConsulta };
//# sourceMappingURL=GerarConsulta.d.ts.map