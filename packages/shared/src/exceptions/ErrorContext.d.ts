export interface ErrorContext {
    context: string;
    method?: string;
    webServiceUrl?: string;
    xmlConsultaSize?: number;
    responseStatus?: number;
    responseData?: string;
    httpStatus?: number;
    httpStatusText?: string;
    timeout?: number;
    [key: string]: any;
}
export declare class NFeError extends Error {
    readonly context: ErrorContext;
    readonly originalError: Error;
    readonly timestamp: Date;
    constructor(message: string, originalError: Error, context: ErrorContext);
    /**
     * Método estático para criar erro a partir de exception do axios
     */
    static fromAxiosError(error: any, context: ErrorContext): NFeError;
    /**
     * Método estático para criar erro de conversão XML
     */
    static fromXmlError(error: Error, xmlData: string, method: string): NFeError;
    /**
     * Método estático para criar erro de rejeição SEFAZ
     */
    static fromSefazRejection(motivo: string, responseData: any, method: string): NFeError;
    /**
     * Log do erro com todas as informações contextuais
     */
    logError(): void;
    /**
     * Determina se deve ser logado como warning (ex: rejeições SEFAZ esperadas)
     */
    private shouldLogAsWarning;
    private static detectXmlType;
}
//# sourceMappingURL=ErrorContext.d.ts.map