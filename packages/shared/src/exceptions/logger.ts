import winston from 'winston';
import path from 'path';
import fs from 'fs';
import { JsonArrayTransport } from './JsonArrayTransporter.js';

export interface LoggerConfig {
    exibirLogNoConsole: boolean;
    armazenarLogs: boolean;
    pathLogs?: string;
}

class AppLogger {
    private static instance: AppLogger;
    private logger: winston.Logger;
    private isInitialized: boolean = false;

    private constructor() {
        // Logger padrão (sem configuração)
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.errors({ stack: true }),
                winston.format.json()
            ),
            transports: []
        });
    }

    public static getInstance(): AppLogger {
        if (!AppLogger.instance) {
            AppLogger.instance = new AppLogger();
        }
        return AppLogger.instance;
    }

    // Função para filtrar logs por nível específico
    private filterOnly(level: string) {
        return winston.format((info) => {
            return info.level === level ? info : false;
        })();
    }

    // Função para filtrar logs excluindo um nível específico
    private filterExcluding(excludeLevel: string) {
        return winston.format((info) => {
            return info.level !== excludeLevel ? info : false;
        })();
    }

    public initialize(config: LoggerConfig): void {
        if (this.isInitialized) {
            return; // Já foi inicializado
        }

        const transports: winston.transport[] = [];

        // Configurar console se habilitado - formato em uma linha
        if (config.exibirLogNoConsole) {
            transports.push(
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                        winston.format.printf(({ timestamp, level, message, context, method, ...meta }) => {
                            const contextStr = context ? `[${context}]` : '';
                            const methodStr = method ? `[${method}]` : '';
                            
                            // JSON em uma linha para console
                            const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
                            return `${timestamp} ${level}: ${contextStr}${methodStr} ${message}${metaStr}`;
                        })
                    )
                })
            );
        }

        // Configurar arquivo se habilitado - formato JSONL (uma linha por log)
        if (config.armazenarLogs && config.pathLogs) {
            // Criar diretório se não existir
            if (!fs.existsSync(config.pathLogs)) {
                fs.mkdirSync(config.pathLogs, { recursive: true });
            }

            // Formato comum para arquivos - JSON em linha única
            const fileFormat = winston.format.combine(
                winston.format.timestamp(),
                winston.format.errors({ stack: true }),
                winston.format.json()
            );

            // Log de aplicação (info, warn, error, debug) - EXCLUINDO http
            transports.push(
                new JsonArrayTransport({
                    filename: 'app.jsonl',
                    dirname: config.pathLogs,
                    maxsize: 10 * 1024 * 1024, // 10MB
                    maxFiles: 5,
                    format: winston.format.combine(
                        this.filterExcluding('http'), // Excluir logs http
                        fileFormat
                    )
                })
            );

            // Log apenas de erros
            transports.push(
                new JsonArrayTransport({
                    filename: 'error.jsonl',
                    dirname: config.pathLogs,
                    level: 'error',
                    maxsize: 5 * 1024 * 1024, // 5MB
                    maxFiles: 3,
                    format: winston.format.combine(
                        this.filterOnly('error'), // Apenas logs de erro
                        fileFormat
                    )
                })
            );

            // Log APENAS de requisições HTTP
            transports.push(
                new JsonArrayTransport({
                    filename: 'http.jsonl',
                    dirname: config.pathLogs,
                    level: 'http',
                    maxsize: 20 * 1024 * 1024, // 20MB
                    maxFiles: 3,
                    format: winston.format.combine(
                        this.filterOnly('http'), // Apenas logs http
                        fileFormat
                    )
                })
            );
        }

        // Recriar o logger com as novas configurações
        this.logger = winston.createLogger({
            level: 'debug',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.errors({ stack: true })
            ),
            transports
        });

        this.isInitialized = true;
        this.info('Logger inicializado com sucesso', {
            context: 'Logger',
            config: {
                console: config.exibirLogNoConsole,
                arquivo: config.armazenarLogs,
                path: config.pathLogs
            }
        });
    }

    public info(message: string, meta?: any): void {
        if (this.isInitialized) {
            this.logger.info(message, meta);
        }
    }

    public warn(message: string, meta?: any): void {
        if (this.isInitialized) {
            this.logger.warn(message, meta);
        }
    }

    public error(message: string, error?: Error | any, meta?: any): void {
        if (this.isInitialized) {
            const logData = { ...meta };
            if (error) {
                logData.error = error instanceof Error ? {
                    message: error.message,
                    stack: error.stack,
                    name: error.name
                } : error;
            }
            this.logger.error(message, logData);
        }
    }

    public debug(message: string, meta?: any): void {
        if (this.isInitialized) {
            this.logger.debug(message, meta);
        }
    }

    public http(message: string, meta?: any): void {
        if (this.isInitialized) {
            this.logger.http(message, meta);
        }
    }
}

// Exportar instância singleton
export const logger = AppLogger.getInstance();