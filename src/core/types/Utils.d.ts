export type GenericObject = Record<string, any>;
export interface SoapMethod {
    [key: string]: {
        method: string;
        action: string;
    };
}
export interface ServicesUrl {
    [key: string]: {
        [key: string]: string;
    };
}
export interface NFeServicosUrlType {
    [estado: string]: {
        [servico: string]: string;
    };
}
export interface SaveXMLProps {
    data: any;
    fileName: string;
    metodo: string;
    path: string | undefined;
}
export interface SaveJSONProps {
    data: any;
    fileName: string;
    metodo: string;
    path: string | undefined;
}
//# sourceMappingURL=Utils.d.ts.map