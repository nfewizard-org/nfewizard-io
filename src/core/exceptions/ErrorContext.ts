import { logger } from './logger.js';
import { AxiosResponse } from 'axios';

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

export class NFeError extends Error {
    public readonly context: ErrorContext;
    public readonly originalError: Error;
    public readonly timestamp: Date;

    constructor(message: string, originalError: Error, context: ErrorContext) {
        super(message);
        this.name = 'NFeError';
        this.context = context;
        this.originalError = originalError;
        this.timestamp = new Date();

        // Manter o stack trace original
        if (originalError.stack) {
            this.stack = originalError.stack;
        }
    }

    /**
     * Método estático para criar erro a partir de exception do axios
     */
    static fromAxiosError(error: any, context: ErrorContext): NFeError {
        let message = error.message;
        const enhancedContext = { ...context };

        if (error.response) {
            enhancedContext.httpStatus = error.response.status;
            enhancedContext.httpStatusText = error.response.statusText;
            enhancedContext.responseData = error.response.data ?
                error.response.data.substring(0, 500) + '...' : 'Sem dados';
            message = `Erro HTTP ${error.response.status}: ${error.response.statusText}`;
        } else if (error.request) {
            message = 'Erro de rede - sem resposta do servidor';
        } else {
            message = 'Erro na configuração da requisição';
        }

        return new NFeError(message, error, enhancedContext);
    }

    /**
     * Método estático para criar erro de conversão XML
     */
    static fromXmlError(error: Error, xmlData: string, method: string): NFeError {
        const context: ErrorContext = {
            context: 'XmlParser',
            method,
            xmlSize: xmlData?.length || 0,
            xmlPreview: xmlData?.substring(0, 300) + '...',
            xmlType: NFeError.detectXmlType(xmlData)
        };

        return new NFeError(`Erro ao converter XML para JSON: ${error.message}`, error, context);
    }

    /**
     * Método estático para criar erro de rejeição SEFAZ
     */
    static fromSefazRejection(motivo: string, responseData: any, method: string): NFeError {
        const context: ErrorContext = {
            context: 'SEFAZ',
            method,
            rejectionReason: motivo,
            cStat: responseData.cStat,
            dhRecbto: responseData.dhRecbto
        };

        return new NFeError(`Rejeição SEFAZ: ${motivo}`, new Error(motivo), context);
    }

    /**
     * Log do erro com todas as informações contextuais
     */
    logError(): void {
        const logLevel = this.shouldLogAsWarning() ? 'warn' : 'error';

        if (logLevel === 'warn') {
            logger.warn(this.message, this.context);
        } else {
            logger.error(this.message, this.originalError, this.context);
        }
    }

    /**
     * Determina se deve ser logado como warning (ex: rejeições SEFAZ esperadas)
     */
    private shouldLogAsWarning(): boolean {
        return this.context.context === 'SEFAZ' &&
            this.message.includes('Rejeição');
    }

    private static detectXmlType(xmlData: string): string {
        if (!xmlData) return 'XML vazio';

        if (xmlData.includes('soap:Envelope')) return 'SOAP';
        if (xmlData.includes('nfeResultMsg')) return 'NFe Result';
        if (xmlData.includes('retConsStatServ')) return 'Status Serviço';
        if (xmlData.includes('retEnviNFe')) return 'Retorno Envio NFe';
        if (xmlData.includes('retConsReciNFe')) return 'Consulta Recibo';
        if (xmlData.includes('fault')) return 'SOAP Fault';

        return 'Formato desconhecido';
    }
}