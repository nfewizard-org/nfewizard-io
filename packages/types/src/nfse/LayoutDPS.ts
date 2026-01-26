/*
 * This file is part of Treeunfe DFe.
 * 
 * Treeunfe DFe is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * Treeunfe DFe is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with Treeunfe DFe. If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * Layout do DPS (Documento de Prestação de Serviços)
 * Similar ao LayoutNFe, mas para NFSe
 */
export interface LayoutDPS {
    /**
     * Informações do DPS
     */
    infDps: InfDPS;
    /**
     * Assinatura XML do DPS (gerada automaticamente)
     */
    Signature?: any;
}

/**
 * Informações do DPS
 */
export type InfDPS = {
    /**
     * Identificador único do DPS (gerado automaticamente)
     */
    Id?: string;
    /**
     * Tipo de ambiente: 1 - Produção; 2 - Homologação
     */
    tpAmb: 1 | 2;
    /**
     * Data e hora da emissão do DPS (formato UTC: AAAA-MM-DDThh:mm:ssTZD)
     */
    dhEmi: string;
    /**
     * Versão do aplicativo que gerou o DPS
     */
    verAplic: string;
    /**
     * Série do DPS
     */
    serie: string;
    /**
     * Número do DPS
     */
    nDPS: string;
    /**
     * Data de competência (AAAAMMDD)
     */
    dCompet: string;
    /**
     * Tipo de emitente: 1 - Prestador; 2 - Tomador; 3 - Intermediário
     */
    tpEmit: 1 | 2 | 3;
    /**
     * Código do município emissor (IBGE)
     */
    cLocEmi: string;
    /**
     * Informações do prestador
     */
    prest: InfoPrestador;
    /**
     * Informações do tomador (opcional)
     */
    toma?: InfoPessoa;
    /**
     * Informações do intermediário (opcional)
     */
    interm?: InfoPessoa;
    /**
     * Informações do serviço
     */
    serv: InfoServico;
    /**
     * Valores do serviço
     */
    valores: InfoValores;
    /**
     * Motivo de emissão pelo Tomador/Intermediário (opcional)
     */
    cMotivoEmisTI?: 1 | 2 | 3 | 4;
    /**
     * Chave de acesso da NFSe rejeitada (opcional)
     */
    chNFSeRej?: string;
    /**
     * Informações de substituição (opcional)
     */
    subst?: InfoSubstituicao;
    /**
     * Informações de IBS/CBS (opcional)
     */
    IBSCBS?: any;
};

/**
 * Informações do prestador
 */
export type InfoPrestador = {
    /**
     * CNPJ ou CPF ou NIF
     */
    CNPJ?: string;
    CPF?: string;
    NIF?: string;
    cNaoNIF?: 0 | 1 | 2;
    /**
     * CAEPF (opcional)
     */
    CAEPF?: string;
    /**
     * Inscrição Municipal (opcional)
     */
    IM?: string;
    /**
     * Nome/Razão Social (opcional)
     */
    xNome?: string;
    /**
     * Endereço (opcional)
     */
    end?: Endereco;
    /**
     * Telefone (opcional)
     */
    fone?: string;
    /**
     * E-mail (opcional)
     */
    email?: string;
    /**
     * Regime de tributação
     */
    regTrib: RegTrib;
};

/**
 * Informações de pessoa (tomador/intermediário)
 */
export type InfoPessoa = {
    /**
     * CNPJ ou CPF ou NIF
     */
    CNPJ?: string;
    CPF?: string;
    NIF?: string;
    cNaoNIF?: 0 | 1 | 2;
    /**
     * CAEPF (opcional)
     */
    CAEPF?: string;
    /**
     * Inscrição Municipal (opcional)
     */
    IM?: string;
    /**
     * Nome/Razão Social
     */
    xNome: string;
    /**
     * Endereço (opcional)
     */
    end?: Endereco;
    /**
     * Telefone (opcional)
     */
    fone?: string;
    /**
     * E-mail (opcional)
     */
    email?: string;
};

/**
 * Endereço
 */
export type Endereco = {
    /**
     * Endereço nacional ou exterior
     */
    endNac?: EnderecoNacional;
    endExt?: any;
    /**
     * Logradouro
     */
    xLgr: string;
    /**
     * Número
     */
    nro: string;
    /**
     * Complemento (opcional)
     */
    xCpl?: string;
    /**
     * Bairro
     */
    xBairro: string;
};

/**
 * Endereço nacional
 */
export type EnderecoNacional = {
    /**
     * CEP
     */
    CEP: string;
    /**
     * Código do município (IBGE)
     */
    cMun: string;
    /**
     * UF
     */
    UF: string;
};

/**
 * Regime de tributação
 */
export type RegTrib = {
    /**
     * Situação perante o Simples Nacional:
     * 1 - Não Optante;
     * 2 - Optante - Microempreendedor Individual (MEI);
     * 3 - Optante - Microempresa ou Empresa de Pequeno Porte (ME/EPP)
     */
    opSimpNac: 1 | 2 | 3;
    /**
     * Regime de apuração do Simples Nacional (opcional)
     */
    regApTribSN?: 1 | 2 | 3;
    /**
     * Regime especial de tributação: 0 - Nenhum; 1-9 - Outros
     */
    regEspTrib: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 9;
};

/**
 * Informações do serviço
 */
export type InfoServico = {
    /**
     * Local da prestação do serviço (obrigatório - primeiro elemento)
     */
    locPrest: LocPrest;
    /**
     * Código do serviço prestado (obrigatório - segundo elemento)
     */
    cServ: CServ;
    /**
     * Comércio exterior (opcional)
     */
    comExt?: ComExterior;
    /**
     * Informações de obra (opcional)
     */
    obra?: any;
    /**
     * Atividade de evento (opcional)
     */
    atvEvento?: any;
    /**
     * Informações complementares (opcional)
     */
    infoCompl?: any;
};

/**
 * Local da prestação do serviço
 */
export type LocPrest = {
    /**
     * Código do município onde o serviço foi prestado (IBGE) - OU
     */
    cLocPrestacao?: string;
    /**
     * Código do país onde o serviço foi prestado (ISO) - OU
     */
    cPaisPrestacao?: string;
};

/**
 * Código do serviço prestado
 */
export type CServ = {
    /**
     * Código de tributação nacional do ISSQN (6 dígitos: 2 Item + 2 Subitem + 2 Desdobro)
     */
    cTribNac: string;
    /**
     * Código de tributação municipal do ISSQN (opcional)
     */
    cTribMun?: string;
    /**
     * Descrição completa do serviço prestado
     */
    xDescServ: string;
    /**
     * Código NBS (opcional)
     */
    cNBS?: string;
    /**
     * Código interno do contribuinte (opcional)
     */
    cIntContrib?: string;
};

/**
 * Comércio exterior
 */
export type ComExterior = {
    /**
     * Modo de prestação: 0 - Desconhecido; 1 - Transfronteiriço; 2 - Consumo no Brasil; 3 - Presença física no exterior
     */
    mdPrestacao: 0 | 1 | 2 | 3;
    /**
     * Outras informações (opcional)
     */
    [key: string]: any;
};

/**
 * Informações de valores
 */
export type InfoValores = {
    /**
     * Valores do serviço prestado (obrigatório - primeiro elemento)
     */
    vServPrest: VServPrest;
    /**
     * Descontos condicionados e incondicionados (opcional)
     */
    vDescCondIncond?: VDescCondIncond;
    /**
     * Dedução/redução (opcional)
     */
    vDedRed?: any;
    /**
     * Tributação (obrigatório)
     */
    trib: InfoTributacao;
};

/**
 * Valores do serviço prestado
 */
export type VServPrest = {
    /**
     * Valor recebido pelo intermediário (opcional)
     */
    vReceb?: number;
    /**
     * Valor dos serviços em R$ (obrigatório)
     */
    vServ: number;
};

/**
 * Descontos condicionados e incondicionados
 */
export type VDescCondIncond = {
    /**
     * Valor do desconto incondicionado (opcional)
     */
    vDescIncond?: number;
    /**
     * Valor do desconto condicionado (opcional)
     */
    vDescCond?: number;
};

/**
 * Informações de tributação
 */
export type InfoTributacao = {
    /**
     * Tributação municipal (obrigatório)
     */
    tribMun: TribMunicipal;
    /**
     * Tributação federal (opcional)
     */
    tribFed?: any;
    /**
     * Totais de tributos (obrigatório)
     */
    totTrib: any;
};

/**
 * Tributação municipal
 */
export type TribMunicipal = {
    /**
     * Tributação do ISSQN: 1 - Operação tributável; 2 - Imunidade; 3 - Exportação; 4 - Não Incidência
     */
    tribISSQN: 1 | 2 | 3 | 4;
    /**
     * Código do país de resultado (opcional)
     */
    cPaisResult?: string;
    /**
     * Tipo de imunidade (opcional)
     */
    tpImunidade?: number;
    /**
     * Exigibilidade suspensa (opcional)
     */
    exigSusp?: any;
    /**
     * Benefício municipal (opcional)
     */
    BM?: any;
    /**
     * Tipo de retenção do ISSQN: 1 - Não Retido; 2 - Retido pelo Tomador; 3 - Retido pelo Intermediário (obrigatório)
     */
    tpRetISSQN: 1 | 2 | 3;
    /**
     * Alíquota do ISSQN (%) (opcional)
     */
    pAliq?: number;
};


/**
 * Informações de substituição
 */
export type InfoSubstituicao = {
    /**
     * Chave de acesso da NFSe a ser substituída
     */
    chSubstda: string;
    /**
     * Código do motivo da substituição
     */
    cMotivo: string;
    /**
     * Descrição do motivo (opcional)
     */
    xMotivo?: string;
};
