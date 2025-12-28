export type ConsultaCTe = DFePorUltimoNSUCTe | DFePorNSUCTe;
export interface DFePorUltimoNSUCTe {
    /**
     * @param {number} cUFAutor - Código da UF do Autor
     */
    cUFAutor: number;
    /**
     * @param {string} CNPJ - CNPJ do interessado no DF-e
     */
    CNPJ?: string;
    /**
     * @param {string} CPF - CPF do interessado no DF-e
     */
    CPF?: string;
    /**
     * @param {any} distNSU - Grupo para distribuir DF-e de interesse
     */
    distNSU: {
        /**
         * @param {number} ultNSU - Último NSU recebido pelo ator. Caso seja informado com zero, ou com um NSU muito antigo, a consulta retornará unicamente as informações resumidas e documentos fiscais eletrônicos que tenham sido recepcionados pelo Ambiente Nacional nos últimos 3 meses.
         */
        ultNSU: string;
    };
}
export interface DFePorNSUCTe {
    /**
     * @param {number} cUFAutor - Código da UF do Autor
     */
    cUFAutor: number;
    /**
     * @param {string} CNPJ - CNPJ do interessado no DF-e
     */
    CNPJ?: string;
    /**
     * @param {string} CPF - CPF do interessado no DF-e
     */
    CPF?: string;
    /**
     * @param {any} consNSU - Grupo para consultar um DF-e a partir de um NSU específico
     */
    consNSU: {
        /**
         * @param {string} NSU - Número Sequencial Único. Geralmente esta consulta será utilizada quando identificado que existe um documento a ser buscado através de consulta prévia.
         */
        NSU: string;
    };
}
//# sourceMappingURL=CTEDistribuicaoDFe.d.ts.map