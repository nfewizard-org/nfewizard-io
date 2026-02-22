import { GenericObject } from '@nfewizard/types/shared';
export declare class XmlParser {
    constructor();
    findInObj: (obj: GenericObject, chave: string) => any;
    removeJsonTextAttribute(value: string, parentElement: any): void;
    getStatusServicoBody(jsonData: any): any;
    getConsultaProtocoloBody(jsonData: any): any;
    getRecepcaoEventoBody(jsonData: any): any;
    getDistribuicaoDFe(jsonData: any): any;
    getDistribuicaoDFeProcBody(jsonData: any): any;
    getDistribuicaoDFeResBody(jsonData: any): any;
    getDistribuicaoDFeEventBody(jsonData: any): any;
    getAutorizacaoEventBody(jsonData: any): any;
    getAutorizacaoFinalEventBody(jsonData: any): any;
    getAutorizacaoRetornoEventBody(jsonData: any): any;
    getInutilizacaoRetornoEventBody(jsonData: any): any;
    convertXmlToJson(xml: string, metodo: string, nsu?: string): GenericObject;
}
//# sourceMappingURL=XmlParser.d.ts.map