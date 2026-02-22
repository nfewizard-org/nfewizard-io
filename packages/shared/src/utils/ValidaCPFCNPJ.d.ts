declare class ValidaCPFCNPJ {
    constructor();
    validarCpfCnpj(cpfCnpj: string): {
        documentoValido: boolean;
        tipoDoDocumento: 'CPF' | 'CNPJ' | 'Desconhecido';
    };
    private documentoValidoateCpf;
    private documentoValidoateCnpj;
    mascaraCnpjCpf(cpfcnpj: string): string;
}
export { ValidaCPFCNPJ };
//# sourceMappingURL=ValidaCPFCNPJ.d.ts.map