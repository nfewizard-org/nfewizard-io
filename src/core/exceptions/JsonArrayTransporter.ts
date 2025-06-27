import Transport from 'winston-transport';
import fs from 'fs';
import path from 'path';
import winston from 'winston';

export class JsonArrayTransport extends Transport {
    private filename: string;
    private dirname: string;
    private maxsize: number;
    private maxFiles: number;
    private logFormat: winston.Logform.Format;

    constructor(options: {
        filename: string;
        dirname?: string;
        maxsize?: number;
        maxFiles?: number;
        level?: string;
        format?: winston.Logform.Format;
    }) {
        super(options);

        this.filename = options.filename;
        this.dirname = options.dirname || '';
        this.maxsize = options.maxsize || 10 * 1024 * 1024; // 10MB default
        this.maxFiles = options.maxFiles || 5;

        // Usar formato fornecido ou formato padrão
        this.logFormat = options.format || winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            winston.format.json()
        );
    }

    private get fullPath(): string {
        return path.join(this.dirname, this.filename);
    }

    log(info: any, callback: () => void): void {
        setImmediate(() => {
            this.emit('logged', info);
        });

        try {
            // Aplicar formato ao log
            const formatted = this.logFormat.transform(info, this.logFormat.options);
            if (formatted) {
                this.writeToFile(formatted);
            }
            callback();
        } catch (error) {
            this.emit('error', error);
            callback();
        }
    }

    private writeToFile(logEntry: any): void {
        const filePath = this.fullPath;

        // Verificar se precisa rotacionar arquivo
        if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            if (stats.size > this.maxsize) {
                this.rotateFile();
            }
        }

        // Criar diretório se não existir
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Converter para string se necessário
        let logLine: string;
        if (typeof logEntry === 'string') {
            logLine = logEntry + '\n';
        } else {
            logLine = JSON.stringify(logEntry) + '\n';
        }

        fs.appendFileSync(filePath, logLine, 'utf8');
    }

    private rotateFile(): void {
        const filePath = this.fullPath;
        const ext = path.extname(this.filename);
        const basename = path.basename(this.filename, ext);
        const dirname = path.dirname(filePath);

        // Rotacionar arquivos existentes
        for (let i = this.maxFiles - 1; i > 0; i--) {
            const oldFile = path.join(dirname, `${basename}.${i}${ext}`);
            const newFile = path.join(dirname, `${basename}.${i + 1}${ext}`);

            if (fs.existsSync(oldFile)) {
                if (i === this.maxFiles - 1) {
                    fs.unlinkSync(oldFile); // Deletar o mais antigo
                } else {
                    fs.renameSync(oldFile, newFile);
                }
            }
        }

        // Mover arquivo atual para .1
        const rotatedFile = path.join(dirname, `${basename}.1${ext}`);
        if (fs.existsSync(filePath)) {
            fs.renameSync(filePath, rotatedFile);
        }
    }
}