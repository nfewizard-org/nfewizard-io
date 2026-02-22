export type EmailConfig = {
    /**
     * @param {string} host - Host SMTP do seu provedor de e-mail
     */
    host: string;
    /**
     * @param {number} port - Porta do servidor SMTP
     */
    port: number;
    /**
     * @param {boolean} secure - true para SSL, false para outros
     */
    secure: boolean;
    /**
     * @param auth - Dados para autenticação no servidor SMTP
     */
    auth: {
        /**
         * @param {string} user - Seu e-mail para autenticação no servidor SMTP
         */
        user: string;
        /**
         * @param {string} pass -  Sua senha para autenticação no servidor SMTP
         */
        pass: string;
    };
    /**
     * @param emailParams -  Dados para enviao do e-mail
     */
    emailParams: {
        /**
         * @param {string} from -  Remetente padrão
         */
        from: string;
        /**
         * @param {string} to -  Destinatário padrão
         */
        to: string;
    };
};
interface Attachment {
    /**
     * @param {string | false} filename -  Nome do arquivo à anexar (Ex: danfe.pdf)
     */
    filename?: string | false;
    /**
     * @param {string} path -  Caminho completo para o arquivo (Ex: ./src/assets/danfe.pdf)
     */
    path: string;
}
export type EmailParams = {
    /**
     * @param message -  Mensagem de texto (aceita html)
     */
    message: string;
    /**
     * @param {string} subject -  Assunto do email
     */
    subject: string;
    /**
     * @param {Attachment[] | undefined} attachments -  Anexos do email
     */
    attachments?: Attachment[];
};
export {};
//# sourceMappingURL=EmailConfig.d.ts.map