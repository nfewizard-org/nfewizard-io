import Transport from 'winston-transport';
import winston from 'winston';
export declare class JsonArrayTransport extends Transport {
    private filename;
    private dirname;
    private maxsize;
    private maxFiles;
    private logFormat;
    constructor(options: {
        filename: string;
        dirname?: string;
        maxsize?: number;
        maxFiles?: number;
        level?: string;
        format?: winston.Logform.Format;
    });
    private get fullPath();
    log(info: any, callback: () => void): void;
    private writeToFile;
    private rotateFile;
}
//# sourceMappingURL=JsonArrayTransporter.d.ts.map