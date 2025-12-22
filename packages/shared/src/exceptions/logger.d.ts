export interface LoggerConfig {
    exibirLogNoConsole: boolean;
    armazenarLogs: boolean;
    pathLogs?: string;
}
declare class AppLogger {
    private static instance;
    private logger;
    private isInitialized;
    private constructor();
    static getInstance(): AppLogger;
    private filterOnly;
    private filterExcluding;
    initialize(config: LoggerConfig): void;
    info(message: string, meta?: any): void;
    warn(message: string, meta?: any): void;
    error(message: string, error?: Error | any, meta?: any): void;
    debug(message: string, meta?: any): void;
    http(message: string, meta?: any): void;
}
export declare const logger: AppLogger;
export {};
//# sourceMappingURL=logger.d.ts.map