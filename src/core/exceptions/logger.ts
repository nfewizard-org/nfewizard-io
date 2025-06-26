import winston from 'winston';
import path from 'path';
import fs from 'fs';

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

    public initialize(config: LoggerConfig): void {
        if (this.isInitialized) {
            return; // Já foi inicializado
        }

        const transports: winston.transport[] = [];

        // Configurar console se habilitado
        if (config.exibirLogNoConsole) {
            transports.push(
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                        winston.format.printf(({ timestamp, level, message, context, method, ...meta }) => {
                            const contextStr = context ? method ? `[${context}] [${method}] ` : `[${context}] ` : '';
                            const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
                            return `${timestamp} ${level}: ${contextStr}${message}${metaStr}`;
                        })
                    )
                })
            );
        }

        // Configurar arquivo se habilitado
        if (config.armazenarLogs && config.pathLogs) {
            // Criar diretório se não existir
            if (!fs.existsSync(config.pathLogs)) {
                fs.mkdirSync(config.pathLogs, { recursive: true });
            }

            // Log de aplicação (info, warn, error)
            transports.push(
                new winston.transports.File({
                    filename: path.join(config.pathLogs, 'app.log'),
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.json()
                    )
                })
            );

            // Log apenas de erros
            transports.push(
                new winston.transports.File({
                    filename: path.join(config.pathLogs, 'error.log'),
                    level: 'error',
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.json()
                    )
                })
            );
        }

        // Recriar o logger com as novas configurações
        this.logger = winston.createLogger({
            level: 'debug',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.errors({ stack: true }),
                winston.format.json()
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