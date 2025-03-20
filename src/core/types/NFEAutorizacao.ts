/*
 * This file is part of NFeWizard-io.
 * 
 * NFeWizard-io is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * NFeWizard-io is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with NFeWizard-io. If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * [NFe]
 * TAG raiz da NF-e
 */
export interface LayoutNFe {
    /**
     * @param {InfNFe} infNFe - Informações da NF-e 
     */
    infNFe: InfNFe;
    /**
     * @param {InfNFeSupl} infNFeSupl - Informações suplementares da Nota Fiscal
     * Informações suplementares da Nota Fiscal, não afetando a assinatura digital. (NT 2015.002)
     */
    infNFeSupl?: InfNFeSupl;
    /**
     * @param {any} Signature - Assinatura XML da NF-e Segundo o Padrão XML Digital Signature
     */
    Signature?: any;
}

/**
 * [infNFe] 
 * Informações da NF-e 
 * GRUPO A
 */
export type InfNFe = {
    /**
     * @param {4.00} versao - Versão do leiaute	
     *  Versão do leiaute (4.00)
     * Gerado automaticamente pela Lib
     */
    versao?: '4.00';
    /**
     * @param {string} Id - Identificador da TAG a ser assinada	
     *  Informar a Chave de Acesso precedida do literal ‘NFe’
     *  Gerado automaticamente pela Lib
     */
    Id?: string;
    /**
     * @param {Ide} ide - Informação de Documentos Fiscais referenciados
     */
    ide: Ide;
    /**
     * @param {NFref[] | NFref} NFref - Informação de Documentos Fiscais referenciados
     */
    NFref?: NFref[] | NFref;
    /**
     * @param {Emit} emit - Identificação do emitente da NF-e
     * Max: 999 ocorrências
     */
    emit: Emit;
    /**
     * @param {Avulsa} avulsa - Informações do fisco emitente (uso exclusivo do fisco)
     */
    avulsa?: Avulsa;
    /**
     * @param {Dest} dest - Identificação do Destinatário da NF-e	
     */
    dest?: Dest;
    /**
     * @param {AutXml} autXML - Pessoas autorizadas a acessar o XML da NF-e
     * Max: 10 ocorrências
     */
    autXML?: AutXml[] | AutXml;
    /**
     * @param {Retirada} retirada - Identificação do Destinatário da NF-e
     */
    retirada?: Retirada;
    /**
     * @param {Entrega} entrega - Identificação do Local de entrega	
     */
    entrega?: Entrega;
    /**
     * @param {DetProd[]} det - Detalhamento de Produtos e Serviços
     */
    det: DetProd[] | DetProd;
    /**
     * @param {Total} total - Grupo Totais da NF-e
     * O grupo de valores totais da NF-e deve ser informado com o somatório do campo correspondente dos itens.
     */
    total: Total;
    /**
     * @param {Transp} transp - Grupo Informações do Transporte	
     */
    transp: Transp;
    /**
     * @param {Cobr} cobr - Grupo Cobrança
     */
    cobr?: Cobr;
    /**
     * @param {Pag} pag - Grupo de Informações de Pagamento	
     * Obrigatório o preenchimento do Grupo Informações de Pagamento para NF-e e NFC-e. Para as notas com finalidade de Ajuste ou Devolução o campo Meio de Pagamento deve ser preenchido com 90=Sem Pagamento.
     */
    pag: Pag;
    /**
     * @param {InfIntermed} infIntermed - Grupo do Intermediador da Transação	
     * Obrigatório o preenchimento do Grupo de Informações do Intermediador da Transação nos casos de “operação não presencial pela internet em site de terceiros (intermediadores) (Incluído na NT2020.006)
     */
    infIntermed?: InfIntermed;
    /**
     * @param {InfAdic} infAdic - Grupo do Intermediador da Transação	
     */
    infAdic?: InfAdic;
    /**
     * @param {Exporta} exporta - Grupo Exportação	
     * Informar apenas na exportação.
     */
    exporta?: Exporta;
    /**
     * @param {Compra} compra - Grupo Compra	
     * Informação adicional de compra
     */
    compra?: Compra;
    /**
     * @param {Cana} cana - Grupo Cana	
     * Informações de registro aquisições de cana v2.0
     */
    cana?: Cana;
    /**
     * @param {InfRespTec} infRespTec - Informações do Responsável Técnico pela emissão do DF-e	
     * Grupo para informações do responsável técnico pelo sistema de emissão do DF-e
     */
    infRespTec?: InfRespTec;
    /**
     * @param {InfSolicNFF} infSolicNFF - Informações de solicitação da NFF (NT 2021.002)	
     * Grupo para informações da solicitação da NFF
     */
    infSolicNFF?: InfSolicNFF;
}


/**
 * [Ide]
 * Informações de identificação da NF-e	
 * GRUPO B
 */
export type Ide = {
    /** [ide] - Informações de identificação da NF-e */
    /**
     * @param {number} cUF - Código da UF do emitente do Documento Fiscal
     * Código da UF do emitente do Documento Fiscal. Utilizar a Utilizar a Tabela de código de UF do IBGE
     */
    cUF: number;
    /**
     * @param {string} cNF - Código Numérico que compõe a Chave de Acesso
     * Código numérico que compõe a Chave de Acesso. Número aleatório gerado pelo emitente para cada NF-e para evitar acessos indevidos da NF-e. (v2.0)
     */
    cNF: string;
    /**
     * @param {string} natOp - Descrição da Natureza da Operação
     * Informar a natureza da operação de que decorrer a saída ou a entrada, tais como: venda, compra, transferência, devolução, importação, consignação, remessa (para fins de demonstração, de industrialização ou outra), conforme previsto na alínea 'i', inciso I, art. 19 do CONVÊNIO S/Nº, de 15 de dezembro de 1970.
     */
    natOp: string;
    /**
     * @param {number} mod - Código do Modelo do Documento Fiscal
     * 55=NF-e emitida em substituição ao modelo 1 ou 1A; 65=NFC-e, utilizada nas operações de venda no varejo (a critério da UF aceitar este modelo de documento).
     */
    mod: number;
    /**
     * @param {string} serie - Série do Documento Fiscal
     * Série do Documento Fiscal, preencher com zeros na hipótese de a NF-e não possuir série. Série na faixa:
     * - [000-889]: Aplicativo do Contribuinte; Emitente=CNPJ; Assinatura pelo e-CNPJ do contribuinte (procEmi<>1,2);
     * - [890-899]: Emissão no site do Fisco (NFA-e - Avulsa); Emitente= CNPJ / CPF; Assinatura pelo e-CNPJ da SEFAZ (procEmi=1);
     * - [900-909]: Emissão no site do Fisco (NFA-e); Emitente= CNPJ; Assinatura pelo e-CNPJ da SEFAZ (procEmi=1), ou Assinatura pelo e-CNPJ do contribuinte (procEmi=2);
     * - [910-919]: Emissão no site do Fisco (NFA-e); Emitente= CPF; Assinatura pelo e-CNPJ da SEFAZ (procEmi=1), ou Assinatura pelo e-CPF do contribuinte (procEmi=2);
     * - [920-969]: Aplicativo do Contribuinte; Emitente=CPF; Assinatura pelo e-CPF do contribuinte (procEmi<>1,2);
     * (Atualizado NT 2018/001)
     */
    serie: string;
    /**
     * @param {number | string} nNF - Número do Documento Fiscal
     * Número do Documento Fiscal.
     */
    nNF: number | string;
    /**
     * @param {string} dhEmi - Data e hora de emissão do Documento Fiscal
     * Data e hora no formato UTC (Universal Coordinated Time): AAAA-MM-DDThh:mm:ssTZD
     */
    dhEmi: string;
    /**
     * @param {string | undefined} dhSaiEnt - Data e hora de Saída ou da Entrada da Mercadoria/Produto
     * Data e hora no formato UTC (Universal Coordinated Time): AAAA-MM-DDThh:mm:ssTZD.
     * Não informar este campo para a NFC-e.
     */
    dhSaiEnt?: string;
    /**
     * @param {number} tpNF - Tipo de Operação
     * 0=Entrada; 1=Saída
     */
    tpNF: number;
    /**
     * @param {number} idDest - Identificador de local de destino da operação
     * 1=Operação interna; 2=Operação interestadual; 3=Operação com exterior.
     */
    idDest: number;
    /**
     * @param {number} cMunFG - Código do Município de Ocorrência do Fato Gerador
     * Informar o município de ocorrência do fato gerador do ICMS. Utilizar a Utilizar a Tabela de código de Município do IBGE
     */
    cMunFG: number;
    /**
     * @param {number} tpImp - Formato de Impressão do DANFE
     * 0=Sem geração de DANFE; 1=DANFE normal, Retrato; 2=DANFE normal, Paisagem; 3=DANFE Simplificado; 4=DANFE NFC-e; 5=DANFE NFC-e em mensagem eletrônica (o envio de mensagem eletrônica pode ser feita de forma simultânea com a impressão do DANFE; usar o tpImp=5 quando esta for a única forma de disponibilização do DANFE).
     */
    tpImp: number;
    /**
     * @param {number} tpEmis - Tipo de Emissão da NF-e
     * 1=Emissão normal (não em contingência); 2=Contingência FS-IA, com impressão do DANFE em Formulário de Segurança - Impressor Autônomo; 3= Regime Especial NFF (NT 2021.002)Contingência SCAN (Sistema de Contingência do Ambiente Nacional); *Desativado * NT 2015/002 4=Contingência EPEC (Evento Prévio da Emissão em Contingência); 5=Contingência FS-DA, com impressão do DANFE em Formulário de Segurança - Documento Auxiliar; 6=Contingência SVC-AN (SEFAZ Virtual de Contingência do AN); 7=Contingência SVC-RS (SEFAZ Virtual de Contingência do RS); <8>9=Contingência off-line da NFC-e; Para a NFC-e somente é válida a opção de contingência: 9-Contingência Off-Line e, a critério da UF, opção 4-Contingência EPEC. (NT 2015/002)
     */
    tpEmis: number;
    /**
     * @param {number} cDV - Dígito Verificador da Chave de Acesso da NF-e
     * Informar o DV da Chave de Acesso da NF-e, o DV será calculado com a aplicação do algoritmo módulo 11 (base 2,9) da Chave de Acesso. (vide item 2.2.6.2 do MOC – Visão Geral)
     */
    cDV?: number;
    /**
     * @param {number} tpAmb - Identificação do Ambiente
     * 1=Produção; 2=Homologação
     */
    tpAmb: number;
    /**
     * @param {number} finNFe - Finalidade de emissão da NF-e
     * 1=NF-e normal; 2=NF-e complementar; 3=NF-e de ajuste; 4=Devolução de mercadoria.
     */
    finNFe: number;
    /**
     * @param {number} indFinal - Indica operação com Consumidor final
     * 0=Normal; 1=Consumidor final;
     */
    indFinal: number;
    /**
     * @param {number} indPres - Indicador de presença do comprador no estabelecimento comercial no momento da operação
     * 0=Não se aplica (por exemplo, Nota Fiscal complementar ou de ajuste); 1=Operação presencial; 2=Operação não presencial, pela Internet; 3=Operação não presencial, Teleatendimento; 4=NFC-e em operação com entrega a domicílio; 5=Operação presencial, fora do estabelecimento; (incluído NT 2016/002) 9=Operação não presencial, outros.
     */
    indPres: number;
    /**
     * @param {number} indIntermed - Indicador de intermediador/marketplace
     * 0=Operação sem intermediador (em site ou plataforma própria) 1=Operação em site ou plataforma de terceiros (intermediadores/marketplace) Considera-se intermediador/marketplace os prestadores de serviços e de negócios referentes às transações comerciais ou de prestação de serviços intermediadas, realizadas por pessoas jurídicas inscritas no Cadastro Nacional de Pessoa Jurídica - CNPJ ou pessoas físicas inscritas no Cadastro de Pessoa Física - CPF, ainda que não inscritas no cadastro de contribuintes do ICMS. Considera-se site/plataforma própria as vendas que não foram intermediadas (por marketplace), como venda em site próprio, teleatendimento.
     */
    indIntermed?: number;
    /**
     * @param {number} procEmi - Processo de emissão da NF-e
     * 0=Emissão de NF-e com aplicativo do contribuinte; 1=Emissão de NF-e avulsa pelo Fisco; 2=Emissão de NF-e avulsa, pelo contribuinte com seu certificado digital, através do site do Fisco; 3=Emissão NF-e pelo contribuinte com aplicativo fornecido pelo Fisco.
     */
    procEmi: number;
    /**
     * @param {string} verProc - Versão do Processo de emissão da NF-e
     * Informar a versão do aplicativo emissor de NF-e.
     * Gerado automaticamente pela Lib como 1.0.0.0
     */
    verProc?: string;
    /**
     * @param {string} dhCont - Data e Hora da entrada em contingência
     * Data e hora no formato UTC (Universal Coordinated Time): AAAA-MM-DDThh:mm:ssTZD
     */
    dhCont?: string;
    /**
     * @param {string} xJust - Justificativa da entrada em contingência
     * (v2.0)
     */
    xJust?: string;
}

/**
 * [NFref]
 * Informação de Documentos Fiscais referenciados
 * GRUPO BA
 */
export type NFref = {
    /**
     * @param {string} refNFe - Chave de acesso da NF-e referenciada
     * Referencia uma NF-e (modelo 55) emitida anteriormente, vinculada a NF-e atual, ou uma NFC-e (modelo 65)
     */
    refNFe: string;
    /**
     * @param {string} refNFeSig - Chave da NF-e com código numérico zerado (NT 2022.003)
     * Referencia uma NF-e (modelo 55) emitida anteriormente pela sua Chave de Acesso com código numérico zerado, permitindo manter o sigilo da NF-e referenciada.
     */
    refNFeSig: string;
    /**
     * @param {RefNF} refNF - Informação da NF modelo 1/1A ou NF modelo 2 referenciada (alterado pela NT2016.002)
     */
    refNF?: RefNF;
    /**
     * @param {refNFP} refNFP - Informações da NF de produtor rural referenciada	
     */
    refNFP?: refNFP;
    /**
     * @param {refECF} refECF - Informações do Cupom Fiscal referenciado
     * Grupo do Cupom Fiscal vinculado à NF-e (v2.0).
     */
    refECF?: refECF;

}
/** [refNF] - Informação da NF modelo 1/1A ou NF modelo 2 referenciada (alterado pela NT2016.002)*/
export type RefNF = {
    /**
    * @param {number} cUF - Código da UF do emitente
    * Utilizar a Tabela de código de UF do IBGE
    */
    cUF: number;
    /**
     * @param {number} AAMM - Ano e Mês de emissão da NF-e
     * AAMM da emissão da NF
     */
    AAMM: number;
    /**
     * @param {string} CNPJ - CNPJ do emitente
     * Informar o CNPJ do emitente da NF
     */
    CNPJ: string;
    /**
     * @param {number} mod - Modelo do Documento Fiscal
     * 01=modelo 01, 02=modelo 02 (incluído na NT 2016/002), 04=NF de Produtor
     */
    mod: number;
    /**
     * @param {string} serie - Série do Documento Fiscal
     * Informar zero se não utilizada Série do documento fiscal.
     */
    serie: string;
    /**
     * @param {number} nNF - Número do Documento Fiscal
     * Faixa: 1–999999999
     */
    nNF: number;
}
/** [refNFP] - Informações da NF de produtor rural referenciada	*/
export type refNFP = {
    /**
    * @param {number} cUF - Código da UF do emitente
    * Utilizar a Tabela de código de UF do IBGE
    */
    cUF: number;
    /**
     * @param {number} AAMM - Ano e Mês de emissão da NF-e
     * AAMM da emissão da NF de produtor (v2.0)
     */
    AAMM: number;
    /**
     * @param {string} CNPJCPF - CPF do emitente / CNPJ do emitente
     * IInformar o CPF ou CNPJ do emitente da NF de produtor (v2.0)
     */
    CNPJCPF?: string;
    /**
    * @param {string} IE - IE do emitente
    * Informar a IE do emitente da NF de Produtor ou o literal “ISENTO” (v2.0)
    */
    IE: string;
    /**
     * @param {number} mod - Modelo do Documento Fiscal
     * 01=NF (v2.0), 04=NF de Produtor
     */
    mod: number;
    /**
     * @param {string} serie - Série do Documento Fiscal
     * Informar a série do documento fiscal (informar zero se inexistente) (v2.0).
     */
    serie: string;
    /**
     * @param {number} nNF - Número do Documento Fiscal
     * Faixa: 1–999999999
     */
    nNF: number;
    /**
     * @param {string} refCTe - Chave de acesso do CT-e referenciada
     * Utilizar esta TAG para referenciar um CT-e emitido anteriormente, vinculada a NF-e atual - (v2.0).
     */
    refCTe: string;
}
/** [refECF] - Informações do Cupom Fiscal referenciado	*/
export type refECF = {
    /**
     * @param {number} mod - Modelo do Documento Fiscal
     * "2B"=Cupom Fiscal emitido por máquina registradora (não ECF);
     * "2C"=Cupom Fiscal PDV;
     * "2D"=Cupom Fiscal (emitido por ECF) (v2.0).
     */
    mod: number;
    /**
     * @param {number} nECF - Número de ordem sequencial do ECF	
     * Informar o número de ordem sequencial do ECF que emitiu o Cupom Fiscal vinculado à NF-e (v2.0).
     */
    nECF: string;
    /**
     * @param {number} nCOO - Número do Contador de Ordem de Operação - COO	
     * Informar o Número do Contador de Ordem de Operação - COO vinculado à NF-e (v2.0).
     */
    nCOO: number;
}

/**
 * [emit] 
 * Identificação do emitente da NF-e	
 * GRUPO C
 */
export type Emit = {
    /**
     * @param {string} CNPJCPF - CNPJ ou CPF do emitente
     * Informar o CNPJ do emitente.
     * Na emissão de NF-e avulsa pelo Fisco, as informações do remetente serão informadas neste grupo.
     * O CNPJ ou CPF deverão ser informados com os zeros não significativos.
     */
    CNPJCPF?: string;
    /**
     * @param {string} xNome - Nome do remetente
     */
    xNome: string;
    /**
     * @param {string} xFant - Nome fantasia
     */
    xFant?: string;
    /**
     * @param {number} enderEmit - Número sequencial auto incremental, de controle correspondente ao identificador único do lote enviado.
     *  A responsabilidade de gerar e controlar esse número é exclusiva do contribuinte.
     */
    enderEmit: EnderEmit;
    /**
     * @param {string} IM - Inscrição Municipal do Prestador de Serviço	
     * Informado na emissão de NF-e conjugada, com itens de produtos sujeitos ao ICMS e itens de serviços sujeitos ao ISSQN.
    */
    IM?: string;
    /**
     * @param {number} CNAE - CNAE fiscal	
     * Campo Opcional. Pode ser informado quando a Inscrição Municipal (id:C19) for informada.
    */
    CNAE?: number;
    /**
     * @param {number} CRT - Código de Regime Tributário	
     * 1=Simples Nacional;
     * 2=Simples Nacional, excesso sublimite de receita bruta;
     * 3=Regime Normal;
     * 4=Simples Nacional - Microempreendedor Individual - MEI
    */
    CRT?: number;
    /**
     * @param {string} IE - Inscrição Estadual do Emitente
     * Informar somente os algarismos, sem os caracteres de formatação (ponto, barra, hífen, etc.).
     */
    IE: string;
    /**
     * @param {string} IEST - IE do Substituto Tributário
     * IE do Substituto Tributário da UF de destino da mercadoria, quando houver a retenção do ICMS ST para a UF de destino.
     */
    IEST?: string;
    [key: string]: string | number | EnderEmit | undefined;
}
/** [EnderEmit] - Endereço do emitente */
export type EnderEmit = {
    /**
    * @param {string} xLgr - Logradouro
    */
    xLgr: string;
    /**
     * @param {string} nro - Número
     */
    nro: string;
    /**
     * @param {string} xCpl - Complemento
     */
    xCpl?: string;
    /**
     * @param {string} xBairro - Bairro
     */
    xBairro: string;
    /**
     * @param {number} cMun - Código do município
     * Utilizar a Tabela de código de Município do IBGE
     */
    cMun: number;
    /**
     * @param {string} xMun - Nome do município
     */
    xMun: string;
    /**
     * @param {string} UF - Sigla da UF
     */
    UF: string;
    /**
     * @param {string} CEP - Código do CEP
     * Informar os zeros não significativos. (NT 2011/004)
     */
    CEP: string;
    /**
     * @param {number} cPais - Código do País
     * 1058=Brasil
     */
    cPais?: number;
    /**
     * @param {string} xPais - Nome do País
     * Brasil ou BRASIL
     */
    xPais?: string;
    /**
     * @param {string} fone - Telefone
     * Preencher com o Código DDD + número do telefone. Nas operações com exterior é permitido informar o código do país + código da localidade + número do telefone (v2.0)
     */
    fone?: string;
}

/**
 * [avulsa] 
 * Informações do fisco emitente (uso exclusivo do fisco)
 * GRUPO D
 */
export type Avulsa = {
    /**
    * @param {string} CNPJ - CNPJ do órgão emitente
    * Informar os zeros não significativos.
    */
    CNPJ: string;
    /**
     * @param {string} xOrgao - Órgão emitente
     */
    xOrgao: string;
    /**
     * @param {string} matr - Matrícula do agente do Fisco
     */
    matr: string;
    /**
     * @param {string} xAgente - Nome do agente do Fisco
     */
    xAgente: string;
    /**
     * @param {string} fone - Telefone
     * Preencher com Código DDD + número do telefone (v2.0) (NT 2011/004)
     */
    fone?: string;
    /**
     * @param {string} UF - Sigla da UF
     */
    UF: string;
    /**
     * @param {string} nDAR - Número do Documento de Arrecadação de Receita
     */
    nDAR?: string;
    /**
     * @param {string} dEmi - Data de emissão do Documento de Arrecadação
     * Formato: “AAAA-MM-DD” (NT 2011/004)
     */
    dEmi?: string;
    /**
     * @param {number} vDAR - Valor Total constante no Documento de arrecadação de Receita
     */
    vDAR?: number;
    /**
     * @param {string} repEmi - Repartição Fiscal emitente
     */
    repEmi: string;
    /**
     * @param {string} dPag - Data de pagamento do Documento de Arrecadação
     * Formato: “AAAA-MM-DD”
     */
    dPag?: string;
}

/**
 * [dest] 
 * Identificação do Destinatário da NF-e	
 * GRUPO E
 */
export type Dest = {
    // /**
    // * @param {string} CNPJ - CNPJ do destinatário
    // * Informar o CNPJ ou o CPF do destinatário, preenchendo os zeros não significativos.
    // * No caso de operação com o exterior, ou para comprador estrangeiro informar a tag "idEstrangeiro”.
    /**
     * @param {string} CNPJ - CNPJ do destinatário
     */
    CNPJ?: string;
    /**
     * @param {string} CPF - CPF do destinatário
     */
    CPF?: string;
    /**
     * @param {string} CNPJCPF - CNPJ ou CPF do destinatário
     * Informar o CNPJ ou o CPF do destinatário, preenchendo os zeros não significativos.
     * No caso de operação com o exterior, ou para comprador estrangeiro informar a tag "idEstrangeiro”.
     */
    CNPJCPF?: string;
    /**
     * @param {string} idEstrangeiro - Identificação do destinatário no caso de comprador estrangeiro
     * Informar esta tag no caso de operação com o exterior, ou para comprador estrangeiro.
     * Informar o número do passaporte ou outro documento legal para identificar pessoa estrangeira (campo aceita valor nulo).
     * Campo aceita algarismos, letras (maiúsculas e minúsculas) e os caracteres do conjunto que segue: [:.+-/()]
     */
    idEstrangeiro?: string;
    /**
     * @param {string} xNome - Razão Social ou nome do destinatário
     * Tag obrigatória para a NF-e (modelo 55) e opcional para a NFC-e.
     */
    xNome?: string;
    /**
     * @param {string} enderDest - Endereço do Destinatário da NF-e	
     * Grupo obrigatório para a NF-e (modelo 55).
     */
    enderDest?: EnderDest;
    /**
     * @param {number} indIEDest - Indicador da IE do Destinatário
     * 1=Contribuinte ICMS (informar a IE do destinatário);
     * 2=Contribuinte isento de Inscrição no cadastro de Contribuintes
     * 9=Não Contribuinte, que pode ou não possuir Inscrição Estadual no Cadastro de Contribuintes do ICMS.
     * Nota 1: No caso de NFC-e informar indIEDest=9 e não informar a tag IE do destinatário;
     * Nota 2: No caso de operação com o Exterior informar indIEDest=9 e não informar a tag IE do destinatário;
     * Nota 3: No caso de Contribuinte Isento de Inscrição (indIEDest=2), não informar a tag IE do destinatário.
     */
    indIEDest?: number;
    /**
     * @param {string} IE - Inscrição Estadual do Destinatário
     * Campo opcional. Informar somente os algarismos, sem os caracteres de formatação (ponto, barra, hífen, etc.).
     */
    IE?: string;
    /**
     * @param {string} ISUF - Inscrição na SUFRAMA
     * Obrigatório, nas operações que se beneficiam de incentivos fiscais existentes nas áreas sob controle da SUFRAMA.
     * A omissão desta informação impede o processamento da operação pelo Sistema de Mercadoria Nacional da SUFRAMA e a liberação da Declaração de Ingresso, prejudicando a comprovação do ingresso / internamento da mercadoria nestas áreas. (v2.0)
     */
    ISUF?: string;
    /**
     * @param {string} IM - Inscrição Municipal do Tomador do Serviço
     * Campo opcional, pode ser informado na NF-e conjugada, com itens de produtos sujeitos ao ICMS e itens de serviços sujeitos ao ISSQN.
     */
    IM?: string;
    /**
     * @param {string} email - Email
     * Campo pode ser utilizado para informar o e-mail de recepção da NF-e indicada pelo destinatário (v2.0)
     */
    email?: string;
}
/** [EnderDest] - Endereço do destinatário */
export type EnderDest = {
    /**
    * @param {string} xLgr - Logradouro
    */
    xLgr: string;
    /**
     * @param {string} nro - Número
     */
    nro: string;
    /**
     * @param {string} xCpl - Complemento
     */
    xCpl?: string;
    /**
     * @param {string} xBairro - Bairro
     */
    xBairro: string;
    /**
     * @param {number} cMun - Código do município
     * Utilizar a Tabela de código de Município do IBGE
     */
    cMun: number;
    /**
     * @param {string} xMun - Nome do município
     * Informar ‘EXTERIOR ‘para operações com o exterior.
     */
    xMun: string;
    /**
     * @param {string} UF - Sigla da UF
     * Informar ‘EX’ para operações com o exterior.
     */
    UF: string;
    /**
     * @param {string} CEP - Código do CEP
     * Informar os zeros não significativos.
     */
    CEP?: string;
    /**
     * @param {number} cPais - Código do País
     * Utilizar a Tabela de código de País do Bacen
     */
    cPais?: number;
    /**
     * @param {string} xPais - Nome do País
     */
    xPais?: string;
    /**
     * @param {number} fone - Telefone
     * Preencher com o Código DDD + número do telefone. Nas operações com exterior é permitido informar o código do país + código da localidade + número do telefone (v2.0)
     */
    fone?: string;
}

/**
 * [retirada] 
 * Identificação do Local de retirada	
 * GRUPO F
 */
export type Retirada = {
    /**
    * @param {string} CNPJ - CNPJ
    * Informar CNPJ ou CPF. Preencher os zeros não significativos.
    */
    CNPJ?: string;
    /**
     * @param {string} CPF - CPF
     */
    CPF?: string;
    /**
     * @param {string} xNome - Razão Social ou Nome do Expedidor
     * (Criado na NT 2018.005)
     */
    xNome?: string;
    /**
     * @param {string} xLgr - Logradouro
     */
    xLgr: string;
    /**
     * @param {string} nro - Número
     */
    nro: string;
    /**
     * @param {string} xCpl - Complemento
     */
    xCpl?: string;
    /**
     * @param {string} xBairro - Bairro
     */
    xBairro: string;
    /**
     * @param {number} cMun - Código do município
     * Utilizar a Tabela de código de Município do IBGE
     * Informar ‘9999999 ‘para operações com o exterior.
     */
    cMun: number;
    /**
     * @param {string} xMun - Nome do município
     * Informar 'EXTERIOR' para operações com o exterior.
     */
    xMun: string;
    /**
     * @param {string} UF - Sigla da UF
     * Informar 'EX' para operações com o exterior.
     */
    UF: string;
    /**
     * @param {number} CEP - Código do CEP
     * Informar os zeros não significativos. (Criado na NT 2018.005)
     */
    CEP?: number;
    /**
     * @param {number} cPais - Código do País
     * Utilizar a Tabela de código de País do Bacen (Criado na NT 2018.005)
     */
    cPais?: number;
    /**
     * @param {string} xPais - Nome do País (Criado na NT 2018.005)
     */
    xPais?: string;
    /**
     * @param {number} fone - Telefone
     * Preencher com o Código DDD + número do telefone. Nas operações com exterior é permitido informar o código do país + código da localidade + número do telefone (v2.0) (Criado na NT 2018.005)
     */
    fone?: number;
    /**
     * @param {string} email - Endereço de e-mail do Expedidor (Criado na NT 2018.005)
     */
    email?: string;
    /**
     * @param {string} IE - Inscrição Estadual do Estabelecimento Expedidor
     * Informar somente os algarismos, sem os caracteres de formatação (ponto, barra, hífen, etc.). (Criado na NT 2018.005)
     */
    IE?: string;
}

/**
 * [entrega] 
 * Identificação do Local de entrega	
 * GRUPO G
 */
export type Entrega = {
    /**
     * @param {string} CNPJ - CNPJ
     * Informar CNPJ ou CPF. Preencher os zeros não significativos. (v2.0)
     */
    CNPJ?: string;
    /**
     * @param {string} CPF - CPF
     */
    CPF?: string;
    /**
     * @param {string} xNome - Razão Social ou Nome do Recebedor
     * (Criado na NT 2018.005)
     */
    xNome?: string;
    /**
     * @param {string} xLgr - Logradouro
     */
    xLgr: string;
    /**
     * @param {string} nro - Número
     */
    nro: string;
    /**
     * @param {string} xCpl - Complemento
     */
    xCpl?: string;
    /**
     * @param {string} xBairro - Bairro
     */
    xBairro: string;
    /**
     * @param {number} cMun - Código do município
     * Utilizar a Tabela de código de Município do IBGE
     * Informar ‘9999999 ‘para operações com o exterior.
     */
    cMun: number;
    /**
     * @param {string} xMun - Nome do município
     * Informar 'EXTERIOR' para operações com o exterior.
     */
    xMun: string;
    /**
     * @param {string} UF - Sigla da UF
     * Informar 'EX' para operações com o exterior.
     */
    UF: string;
    /**
     * @param {number} CEP - Código do CEP
     * Informar os zeros não significativos. (Criado na NT 2018.005)
     */
    CEP?: number;
    /**
     * @param {number} cPais - Código do País
     * Utilizar a Tabela de código de País do Bacen (Criado na NT 2018.005)
     */
    cPais?: number;
    /**
     * @param {string} xPais - Nome do País (Criado na NT 2018.005)
     */
    xPais?: string;
    /**
     * @param {number} fone - Telefone
     * Preencher com o Código DDD + número do telefone. Nas operações com exterior é permitido informar o código do país + código da localidade + número do telefone (v2.0) (Criado na NT 2018.005)
     */
    fone?: number;
    /**
     * @param {string} email - Endereço de e-mail do Recebedor (Criado na NT 2018.005)
     */
    email?: string;
    /**
     * @param {string} IE - Inscrição Estadual do Estabelecimento Recebedor
     * Informar somente os algarismos, sem os caracteres de formatação (ponto, barra, hífen, etc.). (Criado na NT 2018.005)
     */
    IE?: string;
}

/**
 * [autXML] 
 * Pessoas autorizadas a acessar o XML da NF-e	
 * GRUPO GA
 */
export type AutXml = {
    /**
     * CNPJ Autorizado
     * Informar CNPJ ou CPF. Preencher os zeros não significativos.
     */
    CNPJ?: string;
    /**
     * CPF Autorizado
     */
    CPF?: string;
}

/**
 * [det] 
 * Detalhamento de Produtos e Serviços	
 * GRUPO H
 */
export type DetProd = {
    /**
     * @param {Prod} prod - Detalhamento de Produtos e Serviços	
     */
    prod: Prod;
    /**
     * @param {Imposto} imposto - Tributos incidentes no Produto ou Serviço
     */
    imposto: Imposto;
    /**
     * @param {string} infAdProd - Informações Adicionais do Produto	
     * Norma referenciada, informações complementares, etc.
     */
    infAdProd?: string;
    /**
     * @param {ObsItem} obsItem - Grupo de observações de uso livre (para o item da NF-e)
     * NT 2021.004
     */
    obsItem?: ObsItem;
}

/**
 * [prod] 
 * Detalhamento de Produtos e Serviços	
 * GRUPO I
 */
export type Prod = {
    /**
     * @param {string} cProd - Código do produto ou serviço
     * Preencher com CFOP, caso se trate de itens não relacionados com mercadorias/produtos e que o contribuinte não possua codificação própria.
     * Formato: 'CFOP9999'
     */
    cProd: string;
    /**
     * @param {string} cEAN - GTIN (Global Trade Item Number) do produto, antigo código EAN ou código de barras
     * Preencher com o código GTIN-8, GTIN-12, GTIN-13 ou GTIN-14 (antigos códigos EAN, UPC e DUN-14).
     * Para produtos que não possuem código de barras com GTIN, deve ser informado o literal “SEM GTIN”;
     */
    cEAN?: string;
    /**
     * @param {string} cBarra - Código de barras diferente do padrão GTIN
     * Preencher com o Código de Barras próprio ou de terceiros que seja diferente do padrão GTIN
     */
    cBarra?: string;
    /**
     * @param {string} xProd - Descrição do produto ou serviço
     */
    xProd: string;
    /**
     * @param {number | string} NCM - Código NCM com 8 dígitos
     * Obrigatória informação do NCM completo (8 dígitos).
     * Em caso de item de serviço ou item que não tenham produto (ex. transferência de crédito, crédito do ativo imobilizado, etc.), informar o valor 00 (dois zeros).
     */
    NCM: number | string;
    /**
     * @param {string[]} NVE - Codificação NVE - Nomenclatura de Valor Aduaneiro e Estatística
     * Codificação opcional que detalha alguns NCM. Formato: duas letras maiúsculas e 4 algarismos.
     * Se a mercadoria se enquadrar em mais de uma codificação, informar até 8 codificações principais.
     */
    NVE?: string[] | string;
    /**
     * @param {number} CEST - Código CEST
     * Campo CEST (Código Especificador da Substituição Tributária), que estabelece a sistemática de uniformização e identificação das mercadorias e bens passíveis de sujeição aos regimes de substituição tributária e de antecipação de recolhimento do ICMS.
     */
    CEST?: number;
    /**
     * @param {'S' | 'N'} indEscala - Indicador de Escala Relevante
     * Indicador de Produção em escala relevante, conforme Cláusula 23 do Convenio ICMS 52/2017:
     * S - Produzido em Escala Relevante;
     * N – Produzido em Escala NÃO Relevante.
     * Nota: preenchimento obrigatório para produtos com NCM relacionado no Anexo XXVII do Convenio 52/2017
     */
    indEscala?: 'S' | 'N';
    /**
     * @param {string} CNPJFab - CNPJ do Fabricante da Mercadoria
     * CNPJ do Fabricante da Mercadoria, obrigatório para produto em escala NÃO relevante.
     */
    CNPJFab?: string;
    /**
     * @param {string} cBenef - Código de Benefício Fiscal na UF aplicado ao item
     * Código de Benefício Fiscal utilizado pela UF, aplicado ao item.
     * Obs.: Deve ser utilizado o mesmo código adotado na EFD e outras declarações, nas UF que o exigem.
     */
    cBenef?: string;
    /**
     * @param {gCred[]} gCred - Grupo de informações sobre o Crédito Presumido
     * Grupo opcional para informações do Crédito Presumido.
     * Obs.: A exigência do preenchimento das informações do crédito presumido fica a critério de cada UF.
     */
    gCred?: {
        /**
         * @param {string} cCredPresumido - Código de Benefício Fiscal de Crédito Presumido na UF aplicado ao item
         * Código de Benefício Fiscal de Crédito Presumido utilizado pela UF, aplicado ao item.
         * Obs.: Deve ser utilizado o mesmo código adotado na EFD e outras declarações, nas UF que o exigem.
         */
        cCredPresumido: string;
        /**
         * @param {number} pCredPresumido - Percentual do Crédito Presumido
         * Informar o percentual do crédito presumido relativo ao código do crédito presumido informado.
         */
        pCredPresumido: number;
        /**
         * @param {number} vCredPresumido - Valor do Crédito Presumido
         * Informar o valor do crédito presumido relativo ao código do crédito presumido informado.
         */
        vCredPresumido: number;
    }[] | {
        /**
         * @param {string} cCredPresumido - Código de Benefício Fiscal de Crédito Presumido na UF aplicado ao item
         * Código de Benefício Fiscal de Crédito Presumido utilizado pela UF, aplicado ao item.
         * Obs.: Deve ser utilizado o mesmo código adotado na EFD e outras declarações, nas UF que o exigem.
         */
        cCredPresumido: string;
        /**
         * @param {number} pCredPresumido - Percentual do Crédito Presumido
         * Informar o percentual do crédito presumido relativo ao código do crédito presumido informado.
         */
        pCredPresumido: number;
        /**
         * @param {number} vCredPresumido - Valor do Crédito Presumido
         * Informar o valor do crédito presumido relativo ao código do crédito presumido informado.
         */
        vCredPresumido: number;
    };
    /**
     * @param {string} EXTIPI - EX_TIPI
     * Preencher de acordo com o código EX da TIPI. Em caso de serviço, não incluir a TAG.
     */
    EXTIPI?: string;
    /**
     * @param {number} CFOP - Código Fiscal de Operações e Prestações
     * Utilizar Tabela de CFOP.
     */
    CFOP: number;
    /**
     * @param {string} uCom - Unidade Comercial
     * Informar a unidade de comercialização do produto.
     */
    uCom: string;
    /**
     * @param {number} qCom - Quantidade Comercial
     * Informar a quantidade de comercialização do produto.
     */
    qCom: number;
    /**
     * @param {number} vUnCom - Valor Unitário de Comercialização
     * Informar o valor unitário de comercialização do produto, campo meramente informativo, o contribuinte pode utilizar a precisão desejada (0-10 decimais).
     * Para efeitos de cálculo, o valor unitário será obtido pela divisão do valor do produto pela quantidade comercial.
     */
    vUnCom: string;
    /**
     * @param {number} vProd - Valor Total Bruto dos Produtos ou Serviços
     * O valor do ICMS faz parte do Valor Total Bruto, exceto nas notas de importação (NT 2020.005)
     */
    vProd: string;
    /**
     * @param {string} cEANTrib - GTIN (Global Trade Item Number) da unidade tributável, antigo código EAN ou código de barras
     * O GTIN da unidade tributável deve corresponder àquele da menor unidade comercializável identificada por código GTIN.
     */
    cEANTrib: string;
    /**
     * @param {string} cBarraTrib - Código de Barras da unidade tributável que seja diferente do padrão GTIN
     * Preencher com o Código de Barras próprio ou de terceiros, que seja diferente do padrão GTIN, correspondente àquele da menor unidade comercializável identificado por Código de Barras
     */
    cBarraTrib?: string;
    /**
     * @param {string} uTrib - Unidade Tributável
     * Informar a unidade de tributação do produto.
     */
    uTrib: string;
    /**
     * @param {number} qTrib - Quantidade Tributável
     * Informar a quantidade de tributação do produto.
     */
    qTrib: number;
    /**
     * @param {string} vUnTrib - Valor Unitário de tributação
     * Informar o valor unitário de tributação do produto.
     */
    vUnTrib: string;
    /**
     * @param {string} vFrete - Valor Total do Frete
     */
    vFrete?: string;
    /**
     * @param {string} vSeg - Valor Total do Seguro
     */
    vSeg?: string;
    /**
     * @param {string} vDesc - Valor do Desconto
     */
    vDesc?: string;
    /**
     * @param {string} vOutro - Outras despesas acessórias
     */
    vOutro?: string;
    /**
     * @param {0 | 1} indTot - Indica se valor do Item (vProd) entra no valor total da NF-e (vProd)
     * 0=Valor do item (vProd) não compõe o valor total da NF-e
     * 1=Valor do item (vProd) compõe o valor total da NF-e (vProd)
     */
    indTot: number;
}

/**
 * [imposto] 
 * Tributos incidentes no Produto ou Serviço	
 * GRUPO I
 */
export type Imposto = {
    /**
     * @param {ICMS} ICMS - Informações do ICMS da Operação própria e ST
     */
    ICMS: ICMS;
    /**
     * @param {ICMSUFDest} ICMSUFDest - Informação do ICMS Interestadual
     * Grupo a ser informado nas vendas interestaduais para consumidor final, 
     * não contribuinte do ICMS. Este grupo não deve ser utilizado nas operações com veículos automotores 
     * novos efetuadas por meio de faturamento direto para o consumidor (Convênio ICMS 51/00), 
     * as quais possuem grupo de campos próprio (ICMSPart) (Grupo criado na NT 2015/003)	
     */
    ICMSUFDest?: ICMSUFDest;
    /**
     * @param {IPI} IPI - Grupo IPI
     * Informar apenas quando o item for sujeito ao IPI
     */
    IPI?: IPI;
    /**
     * @param {II} II - Grupo Imposto de Importação	
     * Informar apenas quando o item for sujeito ao II
     */
    II?: II;
    /**
     * @param {PIS} PIS - Grupo PIS	
     * Informar apenas um dos grupos Q02, Q03, Q04 ou Q05 com base valor atribuído ao campo Q06 – CST do PIS
     */
    PIS: PIS;
    /**
     * @param {PISST} PISST - Grupo PIS Substituição Tributária	
     */
    PISST?: PISST;
    /**
     * @param {COFINS} COFINS - Grupo COFINS
     * Informar apenas um dos grupos S02, S03, S04 ou S04 com base valor atribuído ao campo de CST da COFINS
     */
    COFINS: COFINS;
    /**
     * @param {COFINSST} COFINSST - Grupo COFINS Substituição Tributária
     */
    COFINSST?: COFINSST;
    /**
     * @param {ISSQN} ISSQN - Grupo ISSQN	
     * Campos para cálculo do ISSQN na NF-e conjugada, onde há a prestação de serviços sujeitos ao ISSQN e fornecimento de peças sujeitas ao ICMS.
     */
    ISSQN?: ISSQN;
    /**
     * @param {impostoDevol} impostoDevol - Informação do Imposto devolvido	
     * O motivo da devolução deverá ser informado pela empresa no campo de Informações Adicionais do Produto (tag:infAdProd).
     */
    impostoDevol?: impostoDevol;
    /**
     * @param {number} vTotTrib - Valor aproximado total de tributos federais, estaduais e municipais.
     */
    vTotTrib?: number;
}

/**
 * [ICMS] 
 * Informações do ICMS da Operação própria e ST	
 * GRUPO N01
 */
export type ICMS = {
    /**
     * @param {ICMS00} ICMS00 - Grupo Tributação do ICMS = 00
     * Tributada integralmente
     */
    ICMS00?: ICMS00;
    /**
     * @param {ICMS02} ICMS02 - Grupo Tributação do ICMS monofásico
     * Tributação monofásica própria sobre combustíveis
     */
    ICMS02?: ICMS02;
    /**
     * @param {ICMS10} ICMS10 - Grupo Tributação do ICMS = 10
     * Tributada e com cobrança do ICMS por substituição tributária
     */
    ICMS10?: ICMS10;
    /**
     * @param {ICMS15} ICMS15 - Grupo Tributação do ICMS monofásico	
     * Tributação monofásica própria e com responsabilidade pela retenção sobre combustíveis;
     */
    ICMS15?: ICMS15;
    /**
     * @param {ICMS20} ICMS20 - Grupo Tributação do ICMS = 20
     * Tributação com redução de base de cálculo
     */
    ICMS20?: ICMS20;


    /**
     * @param {ICMS30} ICMS30 - Grupo Tributação do ICMS = 30
     * Tributação Isenta ou não tributada e com cobrança do ICMS por substituição tributária
     */
    ICMS30?: ICMS30;
    /**
     * @param {ICMS40} ICMS40 - Grupo Tributação ICMS = 40, 41, 50
     * Tributação Isenta, Não tributada ou Suspensão.
     */
    ICMS40?: ICMS40;
    /**
     * @param {ICMS51} ICMS51 - Grupo Tributação do ICMS = 51
     * Tributação com Diferimento (a exigência do preenchimento das informações do ICMS diferido fica a critério de cada UF).
     */
    ICMS51?: ICMS51;
    /**
     * @param {ICMS53} ICMS53 - Grupo Tributação do ICMS monofásico
     * Tributação monofásica própria sobre combustíveis com recolhimento diferido;
     */
    ICMS53?: ICMS53;
    /**
     * @param {ICMS60} ICMS60 - Grupo Tributação do ICMS = 60
     * Tributação ICMS cobrado anteriormente por substituição tributária
     */
    ICMS60?: ICMS60;
    /**
     * @param {ICMS61} ICMS61 - Grupo Tributação do ICMS monofásico
     * Tributação monofásica própria sobre combustíveis cobrada anteriormente;
     */
    ICMS61?: ICMS61;
    /**
     * @param {ICMS70} ICMS70 - Grupo Tributação do ICMS = 70
     * Tributação ICMS com redução de base de cálculo e cobrança do ICMS por substituição tributária
     */
    ICMS70?: ICMS70;
    /**
     * @param {ICMS90} ICMS90 - Grupo Tributação do ICMS = 90
     * Tributação ICMS?: Outros
     */
    ICMS90?: ICMS90;
    /**
     * @param {ICMSPart} ICMSPart - Grupo de Partilha do ICMS entre a UF de origem e UF de destino ou a UF definida na legislação.
     * Operação interestadual para consumidor final com partilha do ICMS devido na operação entre a UF de origem e a do destinatário, ou a UF definida na legislação. (Ex. UF da concessionária de entrega do veículo) (v2.0)
     */
    ICMSPart?: ICMSPart;
    /**
     * @param {ICMSST} ICMSST - Grupo de Repasse de ICMS ST retido anteriormente em operações interestaduais com repasses através do Substituto Tributário
     * Grupo de informação do ICMS ST devido para a UF de destino, nas operações interestaduais de produtos que tiveram retenção antecipada de ICMS por ST na UF do remetente. Repasse via Substituto Tributário. (v2.0)
     */
    ICMSST?: ICMSST;
    /**
     * @param {ICMSSN101} ICMSSN101 - Grupo CRT=1 – Simples Nacional e CSOSN=101
     * Tributação ICMS pelo Simples Nacional, CSOSN=101 (v2.0)
     */
    ICMSSN101?: ICMSSN101;
    /**
     * @param {ICMSSN102} ICMSSN102 - Grupo CRT=1 – Simples Nacional, CRT=4 – MEI e CSOSN=102, 103, 300 ou 400
     * Tributação ICMS pelo Simples Nacional, CSOSN=102, 103, 300 ou 400 (v2.0)
     */
    ICMSSN102?: ICMSSN102;
    /**
     * @param {ICMSSN201} ICMSSN201 - Grupo CRT=1 – Simples Nacional e CSOSN=201
     * Tributação ICMS pelo Simples Nacional, CSOSN=201 (v2.0)
     */
    ICMSSN201?: ICMSSN201;
    /**
     * @param {ICMSSN202} ICMSSN202 - Grupo CRT=1 – Simples Nacional e CSOSN=202 ou 203
     * Tributação ICMS pelo Simples Nacional, CSOSN=202 ou 203 (v2.0)
     */
    ICMSSN202?: ICMSSN202;
    /**
     * @param {ICMSSN500} ICMSSN500 - Grupo CRT=1 – Simples Nacional e CSOSN = 500
     * Tributação ICMS pelo Simples Nacional, CSOSN=500 (v2.0)
     */
    ICMSSN500?: ICMSSN500;
    /**
     * @param {ICMSSN900} ICMSSN900 - Grupo CRT=1 – Simples Nacional, CRT=4 – MEI e CSOSN=900
     * Tributação ICMS pelo Simples Nacional, CSOSN=900 (v2.0)
     */
    ICMSSN900?: ICMSSN900;
    /**
     * @param {dadosICMS} data - Caso não tenha certeza do grupo do ICMS a ser utilizado
     * Informe os dados dentro da tag 'dadosICMS' que a lib tentará definir automaticamente.
     */
    dadosICMS?: dadosICMS;
}
/** [ICMS00] - Tributação do ICMS = 00	*/
export type ICMS00 = {
    /**
     * @param {'00'} CST - Tributação do ICMS = 00
     */
    CST: string;
    /**
     * @param {number} orig - Origem da mercadoria
     * 0 - Nacional, exceto as indicadas nos códigos 3, 4, 5 e 8
     * 1 - Estrangeira - Importação direta, exceto a indicada no código 6
     * 2 - Estrangeira - Adquirida no mercado interno, exceto a indicada no código 7
     * 3 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 40% e inferior ou igual a 70%
     * 4 - Nacional, cuja produção tenha sido feita em conformidade com os processos produtivos básicos de que tratam as legislações citadas nos Ajustes
     * 5 - Nacional, mercadoria ou bem com Conteúdo de Importação inferior ou igual a 40%
     * 6 - Estrangeira - Importação direta, sem similar nacional, constante em lista da CAMEX e gás natural
     * 7 - Estrangeira - Adquirida no mercado interno, sem similar nacional, constante lista CAMEX e gás natural
     * 8 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 70%
     */
    orig: number;
    /**
     * @param {number} modBC - Modalidade de determinação da BC do ICMS
     * 0=Margem Valor Agregado (%)
     * 1=Pauta (Valor)
     * 2=Preço Tabelado Máx. (valor)
     * 3=Valor da operação.
     */
    modBC: number;
    /**
     * @param {number} vBC - Valor da BC do ICMS
     */
    vBC: string;
    /**
     * @param {number} pICMS - Alíquota do imposto
     * Alíquota do ICMS sem o FCP. Quando for o caso, informar a alíquota do FCP no campo pFCP
     */
    pICMS: string;
    /**
     * @param {number} vICMS - Valor do ICMS
     */
    vICMS: string;
    /**
     * @param {number} pFCP - Percentual do ICMS relativo ao Fundo de Combate à Pobreza (FCP)
     * Percentual relativo ao Fundo de Combate à Pobreza (FCP).
     */
    pFCP?: number;
    /**
     * @param {number} vFCP - Valor do Fundo de Combate à Pobreza (FCP)
     * Valor do ICMS relativo ao Fundo de Combate à Pobreza (FCP).
     */
    vFCP?: number;
}
/** [ICMS02] - Grupo Tributação do ICMS monofásico */
export type ICMS02 = {
    /**
     * @param {'02'} CST - Tributação do ICMS
     * 02= Tributação monofásica própria sobre combustíveis;
     */
    CST: '02';
    /**
     * @param {number} orig - Origem da mercadoria
     * 0 - Nacional, exceto as indicadas nos códigos 3, 4, 5 e 8
     * 1 - Estrangeira - Importação direta, exceto a indicada no código 6
     * 2 - Estrangeira - Adquirida no mercado interno, exceto a indicada no código 7
     * 3 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 40% e inferior ou igual a 70%
     * 4 - Nacional, cuja produção tenha sido feita em conformidade com os processos produtivos básicos de que tratam as legislações citadas nos Ajustes
     * 5 - Nacional, mercadoria ou bem com Conteúdo de Importação inferior ou igual a 40%
     * 6 - Estrangeira - Importação direta, sem similar nacional, constante em lista da CAMEX e gás natural
     * 7 - Estrangeira - Adquirida no mercado interno, sem similar nacional, constante lista CAMEX e gás natural
     * 8 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 70%
     */
    orig: number;
    /**
     * @param {number} qBCMono - Quantidade tributada
     * Informar a BC do ICMS próprio em quantidade conforme unidade de medida estabelecida na legislação para o produto.
     */
    qBCMono?: number;
    /**
     * @param {number} adRemICMS - Alíquota ad rem do imposto
     * Alíquota ad rem do ICMS, estabelecida na legislação para o produto.
     */
    adRemICMS: number;
    /**
     * @param {number} vICMSMono - Valor do ICMS próprio
     * O valor do ICMS é obtido pela multiplicação da alíquota ad rem pela quantidade do produto conforme unidade de medida estabelecida na legislação.
     */
    vICMSMono: number;
}
/** [ICMS10] - Grupo Tributação do ICMS = 10 */
export type ICMS10 = {
    /**
     * @param {'10'} CST - Tributação do ICMS
     * 10=Tributada e com cobrança do ICMS por substituição tributária
     */
    CST: '10';
    /**
     * @param {number} orig - Origem da mercadoria
     * 0 - Nacional, exceto as indicadas nos códigos 3, 4, 5 e 8
     * 1 - Estrangeira - Importação direta, exceto a indicada no código 6
     * 2 - Estrangeira - Adquirida no mercado interno, exceto a indicada no código 7
     * 3 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 40% e inferior ou igual a 70%
     * 4 - Nacional, cuja produção tenha sido feita em conformidade com os processos produtivos básicos de que tratam as legislações citadas nos Ajustes
     * 5 - Nacional, mercadoria ou bem com Conteúdo de Importação inferior ou igual a 40%
     * 6 - Estrangeira - Importação direta, sem similar nacional, constante em lista da CAMEX e gás natural
     * 7 - Estrangeira - Adquirida no mercado interno, sem similar nacional, constante lista CAMEX e gás natural
     * 8 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 70%
     */
    orig: number;
    /**
     * @param {number} modBC - Modalidade de determinação da BC do ICMS
     * 0=Margem Valor Agregado (%);
     * 1=Pauta (Valor);
     * 2=Preço Tabelado Máx. (valor);
     * 3=Valor da operação.
     */
    modBC: number;
    /**
     * @param {number} vBC - Valor da BC do ICMS
     */
    vBC: string;
    /**
     * @param {number} pICMS - Alíquota do imposto
     * Alíquota do ICMS sem o FCP. Quando for o caso, informar a alíquota do FCP no campo pFCP.
     */
    pICMS: string;
    /**
     * @param {number} vICMS - Valor do ICMS
     */
    vICMS: string;
    /**
     * @param {number} pBCST - Percentual da BC efetiva de tributação do ICMS ST
     */
    pBCST: string
    /**
     * @param {number} vBCST - Valor da BC do ICMS ST
     */
    vBCST: string;
    /**
     * @param {number} pICMSST - Alíquota do imposto do ICMS ST
     * Alíquota do ICMS ST sem o FCP. Quando for o caso, informar a alíquota do FCP no campo pFCPST.
     */
    pICMSST: number;
    /**
     * @param {number} vICMSST - Valor do ICMS ST
     * Valor do ICMS ST retido
     */
    vICMSST: number;
    /**
     * @param {number} pFCP - Percentual do Fundo de Combate à Pobreza (FCP) sobre o ICMS
     */
    pFCP?: number;
    /**
     * @param {number} vFCP - Valor do Fundo de Combate à Pobreza (FCP) sobre o ICMS
     */
    vFCP?: number;
    /**
     * @param {number} pFCPST - Percentual do Fundo de Combate à Pobreza (FCP) sobre o ICMS ST
     */
    pFCpST?: number | string;
    /**
     * @param {number} vFCPST - Valor do Fundo de Combate à Pobreza (FCP) sobre o ICMS ST
     */
    vFCpST?: number | string;
    /**
     * @param {number} vICMSDeson - Valor do ICMS desonerado
     * Informar apenas nos motivos de desoneração documentados abaixo
     */
    vICMSDeson?: number;
    /**
     * @param {number} motDesICMS - Motivo da desoneração do ICMS
     * Campo será preenchido quando o campo anterior estiver preenchido. Informar o motivo da desoneração:
     * 3=Uso na agropecuária;
     * 9=Outros;
     * 12=Órgão de fomento e desenvolvimento agropecuário
     */
    motDesICMS?: 3 | 9 | 12;
}
/** [ICMS15] - Grupo Tributação do ICMS monofásico */
export type ICMS15 = {
    /**
     * @param {'15'} CST - Tributação do ICMS
     * 15=Tributação monofásica própria e com responsabilidade pela retenção sobre combustíveis
     */
    CST: '15';
    /**
     * @param {number} orig - Origem da mercadoria
     * 0 - Nacional, exceto as indicadas nos códigos 3, 4, 5 e 8
     * 1 - Estrangeira - Importação direta, exceto a indicada no código 6
     * 2 - Estrangeira - Adquirida no mercado interno, exceto a indicada no código 7
     * 3 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 40% e inferior ou igual a 70%
     * 4 - Nacional, cuja produção tenha sido feita em conformidade com os processos produtivos básicos de que tratam as legislações citadas nos Ajustes
     * 5 - Nacional, mercadoria ou bem com Conteúdo de Importação inferior ou igual a 40%
     * 6 - Estrangeira - Importação direta, sem similar nacional, constante em lista da CAMEX e gás natural
     * 7 - Estrangeira - Adquirida no mercado interno, sem similar nacional, constante lista CAMEX e gás natural
     * 8 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 70%
     */
    orig: number;
    /**
     * @param {number} vBC - Valor da BC do ICMS
     * Informar a BC do ICMS próprio em quantidade conforme unidade de medida estabelecida na legislação para o produto.
     */
    qBCMono: number;
    /**
     * @param {number} pICMS - Alíquota ad rem do imposto
     * Alíquota ad rem do ICMS, estabelecida na legislação para o produto.
     */
    adRemICMS: number;
    /**
     * @param {number} vICMS - Valor do ICMS próprio
     * O valor do ICMS é obtido pela multiplicação da alíquota ad rem pela quantidade do produto conforme unidade de medida estabelecida na legislação.
     */
    vICMSMono: number;
    /**
     * @param {number} qBCMonoReten - Quantidade tributada sujeita a retenção
     * Informar a BC do ICMS sujeita a retenção em quantidade conforme unidade de medida estabelecida na legislação para o produto.
     */
    qBCMonoReten?: number;
    /**
     * @param {number} adRemICMSReten - Alíquota ad rem do imposto com retenção
     * Alíquota ad rem do ICMS sobre o biocombustível a ser adicionado para a composição da mistura vendida a consumidor final estabelecida na legislação para o produto.
     */
    adRemICMSReten?: number;
    /**
     * @param {number} vICMSMonoReten - Valor do ICMS com retenção
     * O valor do ICMS é obtido pela multiplicação da alíquota ad rem pela quantidade do produto conforme unidade de medida estabelecida na legislação.
     */
    vICMSMonoReten?: number;
    /**
     * @param {number} pRedAdRem - Percentual de redução do valor da alíquota adrem do ICMS
     * Informar o percentual de redução do valor da alíquota ad rem do ICMS.
     */
    pRedAdRem?: number;
    /**
     * @param {number} motRedAdRem - Motivo da redução do adrem
     * Campo será preenchido quando o campo anterior estiver preenchido. Informar o motivo da redução:
     * 1= Transporte coletivo de passageiros;
     * 9=Outros;
     */
    motRedAdRem?: 1 | 9;
}
/** [ICMS20] - Grupo Tributação do ICMS = 20 */
export type ICMS20 = {
    /**
     * @param {'20'} CST - Tributação do ICMS
     * 20=Com redução de base de cálculo
     */
    CST: '20';
    /**
     * @param {number} orig - Origem da mercadoria
     * 0 - Nacional, exceto as indicadas nos códigos 3, 4, 5 e 8
     * 1 - Estrangeira - Importação direta, exceto a indicada no código 6
     * 2 - Estrangeira - Adquirida no mercado interno, exceto a indicada no código 7
     * 3 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 40% e inferior ou igual a 70%
     * 4 - Nacional, cuja produção tenha sido feita em conformidade com os processos produtivos básicos de que tratam as legislações citadas nos Ajustes
     * 5 - Nacional, mercadoria ou bem com Conteúdo de Importação inferior ou igual a 40%
     * 6 - Estrangeira - Importação direta, sem similar nacional, constante em lista da CAMEX e gás natural
     * 7 - Estrangeira - Adquirida no mercado interno, sem similar nacional, constante lista CAMEX e gás natural
     * 8 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 70%
     */
    orig: number;
    /**
     * @param {number} modBC - Modalidade de determinação da BC do ICMS
     * 0=Margem Valor Agregado (%);
     * 1=Pauta (Valor);
     * 2=Preço Tabelado Máx. (valor);
     * 3=Valor da Operação.
     */
    modBC: number;
    /**
     * @param {number} pRedBC - Percentual da Redução de BC
     */
    pRedBC: number;
    /**
     * @param {number} vBC - Valor da BC do ICMS
     */
    vBC: string;
    /**
     * @param {number} pICMS - Alíquota do imposto
     * Alíquota do ICMS sem o FCP. Quando for o caso, informar a alíquota do FCP no campo pFCP
     */
    pICMS: string;
    /**
     * @param {number} vICMS - Valor do ICMS
     */
    vICMS: string;
    /**
     * @param {number} vBCFCP - Valor da Base de Cálculo do FCP
     * Informar o valor da Base de Cálculo do FCP
     */
    vBCFCP?: number;
    /**
     * @param {number} pFCP - Percentual do ICMS relativo ao Fundo de Combate à Pobreza (FCP)
     * Percentual relativo ao Fundo de Combate à Pobreza (FCP)
     */
    pFCP?: number;
    /**
     * @param {number} vFCP - Valor do ICMS relativo ao Fundo de Combate à Pobreza (FCP)
     * Valor do ICMS relativo ao Fundo de Combate à Pobreza (FCP)
     */
    vFCP?: number;
    /**
     * @param {number} vICMSDeson - Valor do ICMS desonerado
     * Informar apenas nos motivos de desoneração documentados abaixo.
     */
    vICMSDeson?: number;
    /**
     * @param {number} motDesICMS - Motivo da desoneração do ICMS
     * Campo será preenchido quando o campo anterior estiver preenchido. Informar o motivo da desoneração:
     * 3=Uso na agropecuária;
     * 9=Outros;
     * 12=Órgão de fomento e desenvolvimento agropecuário.
     */
    motDesICMS?: 3 | 9 | 12;
    /**
     * @param {boolean} indDeduzDeson - Indica se o valor do ICMS desonerado (vICMSDeson) deduz do valor do item (vProd)
     * O campo só pode ser preenchido com:
     * 0=Valor do ICMS desonerado (vICMSDeson) não deduz do valor do item (vProd) / total da NF-e.
     * 1=Valor do ICMS desonerado (vICMSDeson) deduz do valor do item (vProd) / total da NF-e.
     */
    indDeduzDeson?: boolean;
}
/** [ICMS30] - Grupo Tributação do ICMS = 30 */
export type ICMS30 = {
    /**
     * @param {'30'} CST - Tributação do ICMS
     * 30=Isenta ou não tributada e com cobrança do ICMS por substituição tributária
     */
    CST: '30';
    /**
     * @param {number} orig - Origem da mercadoria
     * 0 - Nacional, exceto as indicadas nos códigos 3, 4, 5 e 8
     * 1 - Estrangeira - Importação direta, exceto a indicada no código 6
     * 2 - Estrangeira - Adquirida no mercado interno, exceto a indicada no código 7
     * 3 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 40% e inferior ou igual a 70%
     * 4 - Nacional, cuja produção tenha sido feita em conformidade com os processos produtivos básicos de que tratam as legislações citadas nos Ajustes
     * 5 - Nacional, mercadoria ou bem com Conteúdo de Importação inferior ou igual a 40%
     * 6 - Estrangeira - Importação direta, sem similar nacional, constante em lista da CAMEX e gás natural
     * 7 - Estrangeira - Adquirida no mercado interno, sem similar nacional, constante lista CAMEX e gás natural
     * 8 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 70%
     */
    orig: number;
    /**
     * @param {number} modBCST - Modalidade de determinação da BC do ICMS ST
     * 0=Preço tabelado ou máximo sugerido
     * 1=Lista Negativa (valor)
     * 2=Lista Positiva (valor)
     * 3=Lista Neutra (valor)
     * 4=Margem Valor Agregado (%)
     * 5=Pauta (valor);
     * 6=Valor da Operação;
     */
    modBCST: number | 4 | 5 | 6;
    /**
     * @param {number} pMVAST - Percentual da margem de valor Adicionado do ICMS ST
     */
    pMVAST?: number;
    /**
     * @param {number} pRedBCST - Percentual da Redução de BC do ICMS ST
     */
    pRedBCST?: number;
    /**
     * @param {number} vBCST - Valor da BC do ICMS ST
     */
    vBCST: string;
    /**
     * @param {number} pICMSST - Alíquota do imposto do ICMS ST
     * Alíquota do ICMS ST sem o FCP. Quando for o caso, informar a alíquota do FCP no campo pFCP (Atualizado NT 2016/002)
     */
    pICMSST: number;
    /**
     * @param {number} vICMSST - Valor do ICMS ST
     * Valor do ICMS ST retido
     */
    vICMSST: number;
    /**
     * @param {number} vBCFCPST - Valor da Base de Cálculo do FCP
     * Informar o valor da Base de Cálculo do FCP retido por Substituição Tributária
     */
    vBCFCpST?: number | string;
    /**
     * @param {number} pFCPST - Percentual do FCP retido por Substituição Tributária
     * Percentual relativo ao Fundo de Combate à Pobreza (FCP) retido por substituição tributária.
     */
    pFCpST?: number | string;
    /**
     * @param {number} vFCPST - Valor do FCP retido por Substituição Tributária
     * Valor do ICMS relativo ao Fundo de Combate à Pobreza (FCP) retido por substituição tributária.
     */
    vFCpST?: number | string;
    /**
     * @param {number} vICMSDeson - Valor do ICMS desonerado
     * Informar apenas nos motivos de desoneração documentados abaixo.
     */
    vICMSDeson?: number;
    /**
     * @param {number} motDesICMS - Motivo da desoneração do ICMS
     * Campo será preenchido quando o campo anterior estiver preenchido. Informar o motivo da desoneração:
     * 6=Utilitários e Motocicletas da Amazônia Ocidental e Áreas de Livre Comércio (Resolução 714/88 e 790/94 – CONTRAN e suas alterações);
     * 7=SUFRAMA;
     * 9=Outros;
     */
    motDesICMS?: 6 | 7 | 9;
    /**
     * @param {boolean} indDeduzDeson - Indica se o valor do ICMS desonerado (vICMSDeson) deduz do valor do item (vProd)
     * O campo só pode ser preenchido com:
     * 0=Valor do ICMS desonerado (vICMSDeson) não deduz do valor do item (vProd) / total da NF-e.
     * 1=Valor do ICMS desonerado (vICMSDeson) deduz do valor do item (vProd) / total da NF-e.
     */
    indDeduzDeson?: boolean;
}
/** [ICMS40] - Grupo Tributação ICMS = 40, 41, 50 */
export type ICMS40 = {
    /**
     * @param {'40' | '41' | '50'} CST - Tributação do ICMS
     * 40=Isenta
     * 41=Não tributada
     * 50=Suspensão.
     */
    CST: '40' | '41' | '50';
    /**
     * @param {number} orig - Origem da mercadoria
     * 0 - Nacional, exceto as indicadas nos códigos 3, 4, 5 e 8
     * 1 - Estrangeira - Importação direta, exceto a indicada no código 6
     * 2 - Estrangeira - Adquirida no mercado interno, exceto a indicada no código 7
     * 3 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 40% e inferior ou igual a 70%
     * 4 - Nacional, cuja produção tenha sido feita em conformidade com os processos produtivos básicos de que tratam as legislações citadas nos Ajustes
     * 5 - Nacional, mercadoria ou bem com Conteúdo de Importação inferior ou igual a 40%
     * 6 - Estrangeira - Importação direta, sem similar nacional, constante em lista da CAMEX e gás natural
     * 7 - Estrangeira - Adquirida no mercado interno, sem similar nacional, constante lista CAMEX e gás natural
     * 8 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 70%
     */
    orig: number;
    /**
     * @param {number} vICMSDeson - Valor do ICMS
     * Informar nas operações:
     * a) com produtos beneficiados com a desoneração condicional do ICMS.
     * b) destinadas à SUFRAMA, informando-se o valor que seria devido se não houvesse isenção.
     * c) de venda a órgão da administração pública direta e suas fundações e autarquias com isenção do ICMS. (NT 2011/004
     * d) demais casos solicitados pelo Fisco. (NT 2016/002)
     */
    vICMSDeson?: number;
    /**
     * @param {number} motDesICMS - Motivo da desoneração do ICMS
     * Campo será preenchido quando o campo anterior estiver preenchido. Informar o motivo da desoneração:
     * 1=Táxi
     * 3=Produtor Agropecuário
     * 4=Frotista/Locadora
     * 5=Diplomático/Consular
     * 6=Utilitários e Motocicletas da Amazônia Ocidental e Áreas de Livre Comércio (Resolução 714/88 e 790/94 – CONTRAN e suas alterações)
     * 7=SUFRAMA
     * 8=Venda a Órgão Público
     * 9=Outros. (NT 2011/004)
     * 10=Deficiente Condutor (Convênio ICMS 38/12)
     * 11=Deficiente Não Condutor (Convênio ICMS 38/12)
     * 16=Olimpíadas Rio 2016 (NT 2015.002)
     * 90=Solicitado pelo Fisco (NT 2016/002)
     * Revogada a partir da versão 3.10 a possibilidade de usar o motivo 2=Deficiente Físico
     */
    motDesICMS?: number;
    /**
     * @param {boolean} indDeduzDeson - Indica se o valor do ICMS desonerado (vICMSDeson) deduz do valor do item (vProd)
     * O campo só pode ser preenchido com:
     * 0=Valor do ICMS desonerado (vICMSDeson) não deduz do valor do item (vProd) / total da NF-e.
     * 1=Valor do ICMS desonerado (vICMSDeson) deduz do valor do item (vProd) / total da NF-e.
     */
    indDeduzDeson?: boolean;
}
/** [ICMS51] - Grupo Tributação do ICMS = 51 */
export type ICMS51 = {
    /**
     * @param {'51'} CST - Tributação do ICMS
     * 51=Diferimento
     */
    CST: '51';
    /**
     * @param {number} orig - Origem da mercadoria
     * 0 - Nacional, exceto as indicadas nos códigos 3, 4, 5 e 8
     * 1 - Estrangeira - Importação direta, exceto a indicada no código 6
     * 2 - Estrangeira - Adquirida no mercado interno, exceto a indicada no código 7
     * 3 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 40% e inferior ou igual a 70%
     * 4 - Nacional, cuja produção tenha sido feita em conformidade com os processos produtivos básicos de que tratam as legislações citadas nos Ajustes
     * 5 - Nacional, mercadoria ou bem com Conteúdo de Importação inferior ou igual a 40%
     * 6 - Estrangeira - Importação direta, sem similar nacional, constante em lista da CAMEX e gás natural
     * 7 - Estrangeira - Adquirida no mercado interno, sem similar nacional, constante lista CAMEX e gás natural
     * 8 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 70%
     */
    orig: number;
    /**
     * @param {number} modBC - Modalidade de determinação da BC do ICMS
     * 0=Margem Valor Agregado (%)
     * 1=Pauta (Valor)
     * 2=Preço Tabelado Máx. (valor)
     * 3=Valor da operação.
     */
    modBC?: number;
    /**
     * @param {number} pRedBC - Percentual da Redução de BC
     */
    pRedBC?: number;
    /**
     * @param {number} cBenefRBC - Código de Benefício Fiscal na UF aplicado ao item quando houver RBC.
     */
    cBenefRBC?: number;
    /**
     * @param {number} vBC - Valor da BC do ICMS
     */
    vBC?: number;
    /**
     * @param {number} pICMS - Alíquota do imposto do ICMS
     */
    pICMS?: number;
    /**
     * @param {number} vICMSOp - Valor do ICMS da Operação
     * Valor como se não tivesse o diferimento
     */
    vICMSOp?: number;
    /**
     * @param {number} pDif - Percentual do diferimento
     * No caso de diferimento total, informar o percentual de diferimento "100".
     */
    pDif?: number;
    /**
     * @param {number} vICMSDif - Valor do ICMS diferido
     */
    vICMSDif?: number;
    /**
     * @param {number} vICMS - Valor do ICMS
     * Informar o valor realmente devido.
     */
    vICMS?: number;
    /**
     * @param {number} vBCFCP - Valor da Base de Cálculo do FCP
     * Informar o valor da Base de Cálculo do FCP
     */
    vBCFCP?: number;
    /**
     * @param {number} pFCP - Percentual do ICMS relativo ao Fundo de Combate à Pobreza (FCP)
     * Percentual relativo ao Fundo de Combate à Pobreza (FCP).
     */
    pFCP?: number;
    /**
     * @param {number} vFCP - Valor do ICMS relativo ao Fundo de Combate à Pobreza (FCP)
     * Valor do ICMS relativo ao Fundo de Combate à Pobreza (FCP). Valor realmente devido, já considerando o diferimento(NT 2020.005)
     */
    vFCP?: number;
    /**
     * @param {number} pFCPDif - Percentual do diferimento do ICMS relativo ao Fundo de Combate à Pobreza (FCP)
     * Percentual do diferimento do ICMS relativo ao Fundo de Combate à Pobreza (FCP). No caso de diferimento total, informar o percentual de diferimento "100"
     */
    pFCPDif?: number;
    /**
     * @param {number} vFCPDif - Valor do ICMS relativo ao Fundo de Combate à Pobreza (FCP) diferido
     * Valor do ICMS relativo ao Fundo de Combate à Pobreza (FCP) diferido
     */
    vFCPDif?: number;
    /**
     * @param {number} vFCPEfet - Valor efetivo do ICMS relativo ao Fundo de Combate à Pobreza (FCP)
     * Valor do ICMS relativo ao Fundo de Combate à Pobreza (FCP) realmente devido.
     */
    vFCPEfet?: number;
}
/** [ICMS53] - Grupo Tributação do ICMS monofásico */
export type ICMS53 = {
    /**
     * @param {'53'} CST - Tributação do ICMS
     * 53= Tributação monofásica própria sobre combustíveis com recolhimento diferido;
     */
    CST: '53';
    /**
     * @param {number} orig - Origem da mercadoria
     * 0 - Nacional, exceto as indicadas nos códigos 3, 4, 5 e 8
     * 1 - Estrangeira - Importação direta, exceto a indicada no código 6
     * 2 - Estrangeira - Adquirida no mercado interno, exceto a indicada no código 7
     * 3 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 40% e inferior ou igual a 70%
     * 4 - Nacional, cuja produção tenha sido feita em conformidade com os processos produtivos básicos de que tratam as legislações citadas nos Ajustes
     * 5 - Nacional, mercadoria ou bem com Conteúdo de Importação inferior ou igual a 40%
     * 6 - Estrangeira - Importação direta, sem similar nacional, constante em lista da CAMEX e gás natural
     * 7 - Estrangeira - Adquirida no mercado interno, sem similar nacional, constante lista CAMEX e gás natural
     * 8 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 70%
     */
    orig: number;
    /**
     * @param {number} qBCMono - Quantidade Tributada
     * Informar a BC do ICMS em quantidade conforme unidade de medida estabelecida na legislação para o produto.
     */
    qBCMono?: number;
    /**
     * @param {number} adRemICMS - Alíquota adRem do imposto
     * Alíquota ad rem do ICMS estabelecida na legislação para o produto.
     */
    adRemICMS?: number;
    /**
     * @param {number} vICMSMonoOp - Valor do ICMS da operação
     * O valor do ICMS é obtido pela multiplicação da alíquota ad rem pela quantidade do produto conforme unidade de medida estabelecida em legislação, como se não houvesse o diferimento
     */
    vICMSMonoOp?: number;
    /**
     * @param {number} pDif - Percentual do diferimento
     * No caso de diferimento total, informar o percentual de diferimento "100".
     */
    pDif?: number;
    /**
     * @param {number} vICMSMonoDif - Valor do ICMS diferido
     * O valor do ICMS é obtido pela multiplicação da alíquota ad rem pela quantidade do produto conforme unidade de medida estabelecida, multiplicado pelo percentual de diferimento.
     */
    vICMSMonoDif?: number;
    /**
     * @param {number} vICMSMono - Valor do ICMS próprio devido
     * O valor do ICMS próprio devido é o resultado do valor do ICMS da operação menos valor do ICMS diferido.
     */
    vICMSMono?: number;
    /**
     * @param {number} qBCMonoDif - Quantidade tributada diferida
     * Informar a BC do ICMS diferido em quantidade conforme unidade de medida estabelecida na legislação para o produto.
     */
    qBCMonoDif?: number;
    /**
     * @param {number} adRemICMSDif - Alíquota ad rem do imposto diferido
     * Alíquota ad rem do ICMS estabelecida na legislação para o produto.
     */
    adRemICMSDif?: number;
}
/** [ICMS60] - Grupo Tributação do ICMS = 60 */
export type ICMS60 = {
    /**
     * @param {'60'} CST - Tributação do ICMS
     * 60=ICMS cobrado anteriormente por substituição tributária
     */
    CST: '60';
    /**
     * @param {number} orig - Origem da mercadoria
     * 0 - Nacional, exceto as indicadas nos códigos 3, 4, 5 e 8
     * 1 - Estrangeira - Importação direta, exceto a indicada no código 6
     * 2 - Estrangeira - Adquirida no mercado interno, exceto a indicada no código 7
     * 3 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 40% e inferior ou igual a 70%
     * 4 - Nacional, cuja produção tenha sido feita em conformidade com os processos produtivos básicos de que tratam as legislações citadas nos Ajustes
     * 5 - Nacional, mercadoria ou bem com Conteúdo de Importação inferior ou igual a 40%
     * 6 - Estrangeira - Importação direta, sem similar nacional, constante em lista da CAMEX e gás natural
     * 7 - Estrangeira - Adquirida no mercado interno, sem similar nacional, constante lista CAMEX e gás natural
     * 8 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 70%
     */
    orig: number;
    /**
     * @param {number} vBCSTRet - Valor da BC do ICMS ST retido
     * Valor da BC do ICMS ST cobrado anteriormente por ST (v2.0). O valor pode ser omitido quando a legislação não exigir a sua informação.
     */
    vBCSTRet?: number | string;
    /**
     * @param {number} pST - Alíquota suportada pelo Consumidor Final
     * Deve ser informada a alíquota do cálculo do ICMS-ST, já incluso o FCP caso incida sobre a mercadoria.
     * Exemplo: alíquota da mercadoria na venda ao consumidor final = 18% e 2% de FCP. A alíquota a ser informada no campo pST deve ser 20%. (Atualizado NT 2016/002)
     */
    pST?: number | string;
    /**
     * @param {number} vICMSSubstituto - Valor do ICMS próprio do Substituto
     * Valor do ICMS Próprio do Substituto cobrado em operação anterior (Criado na NT 2018.005)
     */
    vICMSSubstituto?: number | string;
    /**
     * @param {number} vICMSSTRet - Valor do ICMS ST retido
     * Valor do ICMS ST cobrado anteriormente por ST (v2.0). O valor pode ser omitido quando a legislação não exigir a sua informação.
     */
    vICMSSTRet?: number | string;
    /**
     * @param {number} vBCFCPSTRet - Valor da Base de Cálculo do FCP retido anteriormente
     * Informar o valor da Base de Cálculo do FCP retido anteriormente por ST
     */
    vBCFCPSTRet?: number;
    /**
     * @param {number} pFCPSTRet - Percentual do FCP retido anteriormente por Substituição Tributária
     * Percentual relativo ao Fundo de Combate à Pobreza (FCP) retido por substituição tributária.
     */
    pFCPSTRet?: number;
    /**
     * @param {number} vFCPSTRet - Valor do FCP retido por Substituição Tributária
     * Valor do ICMS relativo ao Fundo de Combate à Pobreza (FCP) retido por substituição tributária.
     */
    vFCPSTRet?: number;
    /**
     * @param {number} pRedBCEfet - Percentual de redução da base de cálculo efetiva
     * Percentual de redução, caso estivesse submetida ao regime comum de tributação, para obtenção da base de cálculo efetiva (vBCEfet). Obs.: opcional a critério da UF.
     */
    pRedBCEfet?: number;
    /**
     * @param {number} vBCEfet - Valor da base de cálculo efetiva
     * Valor da base de cálculo que seria atribuída à operação própria do contribuinte substituído, caso estivesse submetida ao regime comum de tributação, obtida pelo produto do Vprod por (1- pRedBCEfet). Obs.: opcional a critério da UF.
     */
    vBCEfet?: number;
    /**
     * @param {number} pICMSEfet - Alíquota do ICMS efetiva
     * Alíquota do ICMS na operação a consumidor final, caso estivesse submetida ao regime comum de tributação. Obs.: opcional a critério da UF.
     */
    pICMSEfet?: number;
    /**
     * @param {number} vICMSEfet - Valor do ICMS efetivo
     * Obtido pelo produto do valor do campo pICMSEfet pelo valor do campo vBCEfet, caso estivesse submetida ao regime comum de tributação. Obs.: opcional a critério da UF.
     */
    vICMSEfet?: number;
}
/** [ICMS61] - Grupo Tributação do ICMS monofásico */
export type ICMS61 = {
    /**
     * @param {'61'} CST - Tributação do ICMS
     * 61= Tributação monofásica sobre combustíveis cobrada anteriormente;
     */
    CST: '61';
    /**
     * @param {number} orig - Origem da mercadoria
     * 0 - Nacional, exceto as indicadas nos códigos 3, 4, 5 e 8
     * 1 - Estrangeira - Importação direta, exceto a indicada no código 6
     * 2 - Estrangeira - Adquirida no mercado interno, exceto a indicada no código 7
     * 3 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 40% e inferior ou igual a 70%
     * 4 - Nacional, cuja produção tenha sido feita em conformidade com os processos produtivos básicos de que tratam as legislações citadas nos Ajustes
     * 5 - Nacional, mercadoria ou bem com Conteúdo de Importação inferior ou igual a 40%
     * 6 - Estrangeira - Importação direta, sem similar nacional, constante em lista da CAMEX e gás natural
     * 7 - Estrangeira - Adquirida no mercado interno, sem similar nacional, constante lista CAMEX e gás natural
     * 8 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 70%
     */
    orig: number;
    /**
     * @param {number} qBCMonoRet - Quantidade tributada retida anteriormente
     * Informar a BC do ICMS em quantidade conforme unidade de medida estabelecida na legislação.
     */
    qBCMonoRet?: number;
    /**
     * @param {number} adRemICMSRet - Alíquota ad rem do imposto retido anteriormente
     * Alíquota ad rem do ICMS, estabelecida na legislação para o produto.
     */
    adRemICMSRet: number;
    /**
     * @param {number} vICMSMonoRet - Valor do ICMS retido anteriormente
     * O valor do ICMS é obtido pela multiplicação da alíquota ad rem pela quantidade do produto conforme unidade de medida estabelecida na legislação.
     */
    vICMSMonoRet: number;
}
/** [ICMS70] - Grupo Tributação do ICMS = 70 */
export type ICMS70 = {
    /**
     * @param {'70'} CST - Tributação do ICMS
     * 70=Com redução de base de cálculo e cobrança do ICMS por substituição tributária
     */
    CST: '70';
    /**
     * @param {number} orig - Origem da mercadoria
     * 0 - Nacional, exceto as indicadas nos códigos 3, 4, 5 e 8
     * 1 - Estrangeira - Importação direta, exceto a indicada no código 6
     * 2 - Estrangeira - Adquirida no mercado interno, exceto a indicada no código 7
     * 3 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 40% e inferior ou igual a 70%
     * 4 - Nacional, cuja produção tenha sido feita em conformidade com os processos produtivos básicos de que tratam as legislações citadas nos Ajustes
     * 5 - Nacional, mercadoria ou bem com Conteúdo de Importação inferior ou igual a 40%
     * 6 - Estrangeira - Importação direta, sem similar nacional, constante em lista da CAMEX e gás natural
     * 7 - Estrangeira - Adquirida no mercado interno, sem similar nacional, constante lista CAMEX e gás natural
     * 8 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 70%
     */
    orig: number;
    /**
     * @param {number} modBC - Modalidade de determinação da BC do ICMS
     * 0=Margem Valor Agregado (%)
     * 1=Pauta (Valor)
     * 2=Preço Tabelado Máx. (valor)
     * 3=Valor da operação.
     */
    modBC: number;
    /**
     * @param {number} pRedBC - Percentual da Redução de BC
     */
    pRedBC: number;
    /**
     * @param {number} vBC - Valor da BC do ICMS
     */
    vBC: string;
    /**
     * @param {number} pICMS - Alíquota do imposto
     */
    pICMS: string;
    /**
     * @param {number} vICMS - Valor do ICMS
     */
    vICMS: string;
    /**
     * @param {number} modBCST - Modalidade de determinação da BC do ICMS ST
     * 0=Preço tabelado ou máximo sugerido
     * 1=Lista Negativa (valor)
     * 2=Lista Positiva (valor)
     * 3=Lista Neutra (valor)
     * 4=Margem Valor Agregado (%)
     * 5=Pauta (valor);
     */
    modBCST: number | 4 | 5;
    /**
     * @param {number} pMVAST - Percentual da margem de valor Adicionado do ICMS ST
     */
    pMVAST?: number;
    /**
     * @param {number} pRedBCST - Percentual da Redução de BC do ICMS ST
     */
    pRedBCST?: number;
    /**
     * @param {number} vBCST - Valor da BC do ICMS ST
     */
    vBCST: string;
    /**
     * @param {number} pICMSST - Alíquota do imposto do ICMS ST
     */
    pICMSST: number;
    /**
     * @param {number} vICMSST - Valor do ICMS ST
     */
    vICMSST: number;
}
/** [ICMS90] - Grupo Tributação do ICMS = 90 */
export type ICMS90 = {
    /**
     * @param {'90'} CST - Tributação do ICMS
     * 90=Outros
     */
    CST: '90';
    /**
     * @param {number} orig - Origem da mercadoria
     * 0 - Nacional, exceto as indicadas nos códigos 3, 4, 5 e 8
     * 1 - Estrangeira - Importação direta, exceto a indicada no código 6
     * 2 - Estrangeira - Adquirida no mercado interno, exceto a indicada no código 7
     * 3 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 40% e inferior ou igual a 70%
     * 4 - Nacional, cuja produção tenha sido feita em conformidade com os processos produtivos básicos de que tratam as legislações citadas nos Ajustes
     * 5 - Nacional, mercadoria ou bem com Conteúdo de Importação inferior ou igual a 40%
     * 6 - Estrangeira - Importação direta, sem similar nacional, constante em lista da CAMEX e gás natural
     * 7 - Estrangeira - Adquirida no mercado interno, sem similar nacional, constante lista CAMEX e gás natural
     * 8 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 70%
     */
    orig: number;
    /**
     * @param {number} modBC - Modalidade de determinação da BC do ICMS
     * 0=Margem Valor Agregado (%)
     * 1=Pauta (Valor)
     * 2=Preço Tabelado Máx. (valor)
     * 3=Valor da operação.
     */
    modBC: number;
    /**
     * @param {number} pRedBC - Percentual da Redução de BC
     */
    pRedBC?: number;
    /**
     * @param {number} vBC - Valor da BC do ICMS
     */
    vBC: string;
    /**
     * @param {number} pICMS - Alíquota do imposto
     */
    pICMS: string;
    /**
     * @param {number} vICMS - Valor do ICMS
     */
    vICMS: string;
    /**
     * @param {number} modBCST - Modalidade de determinação da BC do ICMS ST
     * 0=Preço tabelado ou máximo sugerido
     * 1=Lista Negativa (valor)
     * 2=Lista Positiva (valor)
     * 3=Lista Neutra (valor)
     * 4=Margem Valor Agregado (%)
     * 5=Pauta (valor);
     */
    modBCST: number | 4 | 5;
    /**
     * @param {number} pMVAST - Percentual da margem de valor Adicionado do ICMS ST
     */
    pMVAST?: number;
    /**
     * @param {number} pRedBCST - Percentual da Redução de BC do ICMS ST
     */
    pRedBCST?: number;
    /**
     * @param {number} vBCST - Valor da BC do ICMS ST
     */
    vBCST: string;
    /**
     * @param {number} pICMSST - Alíquota do imposto do ICMS ST
     */
    pICMSST: number;
    /**
     * @param {number} vICMSST - Valor do ICMS ST
     */
    vICMSST: number;
}
/** [ICMSPart] - Grupo de Partilha do ICMS entre a UF de origem e UF de destino ou a UF definida na legislação. */
export type ICMSPart = {
    /**
     * @param {number} orig - Origem da mercadoria
     * 0 - Nacional, exceto as indicadas nos códigos 3, 4, 5 e 8
     * 1 - Estrangeira - Importação direta, exceto a indicada no código 6
     * 2 - Estrangeira - Adquirida no mercado interno, exceto a indicada no código 7
     * 3 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 40% e inferior ou igual a 70%
     * 4 - Nacional, cuja produção tenha sido feita em conformidade com os processos produtivos básicos de que tratam as legislações citadas nos Ajustes
     * 5 - Nacional, mercadoria ou bem com Conteúdo de Importação inferior ou igual a 40%
     * 6 - Estrangeira - Importação direta, sem similar nacional, constante em lista da CAMEX e gás natural
     * 7 - Estrangeira - Adquirida no mercado interno, sem similar nacional, constante lista CAMEX e gás natural
     * 8 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 70%
     */
    orig: number;
    /**
     * @param {'10' | '90'} CST - Tributação do ICMS
     * 10=Tributada e com cobrança do ICMS por substituição tributária;
     * 90=Outros.
     */
    CST: '10' | '90';
    /**
     * @param {number} modBC - Modalidade de determinação da BC do ICMS
     * 0=Margem Valor Agregado (%)
     * 1=Pauta (Valor)
     * 2=Preço Tabelado Máx. (valor)
     * 3=Valor da operação.
     */
    modBC: number;
    /**
     * @param {number} pRedBC - Percentual da Redução de BC
     */
    pRedBC?: number;
    /**
     * @param {number} vBC - Valor da BC do ICMS
     */
    vBC: string;
    /**
     * @param {number} pICMS - Alíquota do imposto
     */
    pICMS: string;
    /**
     * @param {number} vICMS - Valor do ICMS
     */
    vICMS: string;
    /**
     * @param {number} modBCST - Modalidade de determinação da BC do ICMS ST
     * 0=Preço tabelado ou máximo sugerido
     * 1=Lista Negativa (valor)
     * 2=Lista Positiva (valor)
     * 3=Lista Neutra (valor)
     * 4=Margem Valor Agregado (%)
     * 5=Pauta (valor)
     */
    modBCST: number | 4 | 5;
    /**
     * @param {number} pMVAST - Percentual da margem de valor Adicionado do ICMS ST
     */
    pMVAST?: number;
    /**
     * @param {number} pRedBCST - Percentual da Redução de BC do ICMS ST
     */
    pRedBCST?: number;
    /**
     * @param {number} vBCST - Valor da BC do ICMS ST
     */
    vBCST: string;
    /**
     * @param {number} pICMSST - Alíquota do imposto do ICMS ST
     */
    pICMSST: number;
    /**
     * @param {number} vICMSST - Valor do ICMS ST
     */
    vICMSST: number;
    /**
     * @param {number} pBCOp - Percentual da BC operação própria
     */
    pBCOp: number;
    /**
     * @param {string} UFST - UF para qual é devido o ICMS ST
     * Sigla da UF para qual é devido o ICMS ST da operação. Informar "EX" para Exterior.
     */
    UFST: string;
}
/** [ICMSST] - Grupo de Repasse de ICMS ST retido anteriormente em operações interestaduais com repasses através do Substituto Tributário */
export type ICMSST = {
    /**
     * @param {number} orig - Origem da mercadoria
     * 0 - Nacional, exceto as indicadas nos códigos 3, 4, 5 e 8
     * 1 - Estrangeira - Importação direta, exceto a indicada no código 6
     * 2 - Estrangeira - Adquirida no mercado interno, exceto a indicada no código 7
     * 3 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 40% e inferior ou igual a 70%
     * 4 - Nacional, cuja produção tenha sido feita em conformidade com os processos produtivos básicos de que tratam as legislações citadas nos Ajustes
     * 5 - Nacional, mercadoria ou bem com Conteúdo de Importação inferior ou igual a 40%
     * 6 - Estrangeira - Importação direta, sem similar nacional, constante em lista da CAMEX e gás natural
     * 7 - Estrangeira - Adquirida no mercado interno, sem similar nacional, constante lista CAMEX e gás natural
     * 8 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 70%
     */
    orig: number;
    /**
     * @param {'41' | '60'} CST - Tributação do ICMS
     * 41=Não Tributado
     * 60=cobrado anteriormente por substituição tributária
     */
    CST: '41' | '60';
    /**
     * @param {number} vBCSTRet - Valor do BC do ICMS ST retido na UF remetente
     */
    vBCSTRet: number | string;
    /**
     * @param {number} pST - Alíquota suportada pelo Consumidor Final
     * Deve ser informada a alíquota do cálculo do ICMS-ST, já incluso o FCP caso incida sobre a mercadoria.
     * Exemplo: alíquota da mercadoria na venda ao consumidor final = 18% e 2% de FCP. A alíquota a ser informada no campo pST deve ser 20%.
     */
    pST: number | string
    /**
     * @param {number} vICMSSubstituto - Valor do ICMS próprio do Substituto
     * Valor do ICMS Próprio do Substituto cobrado em operação anterior
     */
    vICMSSubstituto: number;
    /**
     * @param {number} vICMSSTRet - Valor do ICMS ST retido na UF remetente
     */
    vICMSSTRet: number;
    /**
     * @param {number} vBCSTDest - Valor da BC do ICMS ST da UF destino
     */
    vBCSTDest: number;
    /**
     * @param {number} vICMSSTDest - Valor do ICMS ST da UF destino
     */
    vICMSSTDest: number;
}
/** [ICMSSN101] - Grupo CRT=1 – Simples Nacional e CSOSN=101 */
export type ICMSSN101 = {
    /**
     * @param {number} orig - Origem da mercadoria
     * 0 - Nacional, exceto as indicadas nos códigos 3, 4, 5 e 8
     * 1 - Estrangeira - Importação direta, exceto a indicada no código 6
     * 2 - Estrangeira - Adquirida no mercado interno, exceto a indicada no código 7
     * 3 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 40% e inferior ou igual a 70%
     * 4 - Nacional, cuja produção tenha sido feita em conformidade com os processos produtivos básicos de que tratam as legislações citadas nos Ajustes
     * 5 - Nacional, mercadoria ou bem com Conteúdo de Importação inferior ou igual a 40%
     * 6 - Estrangeira - Importação direta, sem similar nacional, constante em lista da CAMEX e gás natural
     * 7 - Estrangeira - Adquirida no mercado interno, sem similar nacional, constante lista CAMEX e gás natural
     * 8 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 70%
     */
    orig: number;
    /**
     * @param {number} CSOSN - Código de Situação da Operação – Simples Nacional
     * 101=Tributada pelo Simples Nacional com permissão de crédito.
     */
    CSOSN: 101;
    /**
     * @param {number} pCredSN - Alíquota aplicável de cálculo do crédito (Simples Nacional).
     */
    pCredSN: number;
    /**
     * @param {number} vCredICMSSN - Valor crédito do ICMS que pode ser aproveitado nos termos do art. 23 da LC 123 (Simples Nacional)
     */
    vCredICMSSN: number;
}
/** [ICMSSN102] - Grupo CRT=1 – Simples Nacional, CRT=4 – MEI e CSOSN=102, 103, 300 ou 400 */
export type ICMSSN102 = {
    /**
     * @param {number} orig - Origem da mercadoria
     * 0 - Nacional, exceto as indicadas nos códigos 3, 4, 5 e 8
     * 1 - Estrangeira - Importação direta, exceto a indicada no código 6
     * 2 - Estrangeira - Adquirida no mercado interno, exceto a indicada no código 7
     * 3 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 40% e inferior ou igual a 70%
     * 4 - Nacional, cuja produção tenha sido feita em conformidade com os processos produtivos básicos de que tratam as legislações citadas nos Ajustes
     * 5 - Nacional, mercadoria ou bem com Conteúdo de Importação inferior ou igual a 40%
     * 6 - Estrangeira - Importação direta, sem similar nacional, constante em lista da CAMEX e gás natural
     * 7 - Estrangeira - Adquirida no mercado interno, sem similar nacional, constante lista CAMEX e gás natural
     * 8 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 70%
     */
    orig?: number;
    /**
     * @param {number} CSOSN - Código de Situação da Operação – Simples Nacional
     * 102=Tributada pelo Simples Nacional sem permissão de crédito.
     * 103=Isenção do ICMS no Simples Nacional para faixa de receita bruta.
     * 300=Imune.
     * 400=Não tributada pelo Simples Nacional
     */
    CSOSN: 102 | 103 | 300 | 400;
}
/** [ICMSSN201] - Grupo CRT=1 – Simples Nacional e CSOSN=201 */
export type ICMSSN201 = {
    /**
     * @param {number} orig - Origem da mercadoria
     * 0 - Nacional, exceto as indicadas nos códigos 3, 4, 5 e 8
     * 1 - Estrangeira - Importação direta, exceto a indicada no código 6
     * 2 - Estrangeira - Adquirida no mercado interno, exceto a indicada no código 7
     * 3 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 40% e inferior ou igual a 70%
     * 4 - Nacional, cuja produção tenha sido feita em conformidade com os processos produtivos básicos de que tratam as legislações citadas nos Ajustes
     * 5 - Nacional, mercadoria ou bem com Conteúdo de Importação inferior ou igual a 40%
     * 6 - Estrangeira - Importação direta, sem similar nacional, constante em lista da CAMEX e gás natural
     * 7 - Estrangeira - Adquirida no mercado interno, sem similar nacional, constante lista CAMEX e gás natural
     * 8 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 70%
     */
    orig: number;
    /**
     * @param {number} CSOSN - Código de Situação da Operação – Simples Nacional
     * 201=Tributada pelo Simples Nacional com permissão de crédito e com cobrança do ICMS por Substituição Tributária
     */
    CSOSN: 201;
    /**
     * @param {number} modBCST - Modalidade de determinação da BC do ICMS ST
     * 0=Preço tabelado ou máximo sugerido
     * 1=Lista Negativa (valor)
     * 2=Lista Positiva (valor)
     * 3=Lista Neutra (valor)
     * 4=Margem Valor Agregado (%)
     * 5=Pauta (valor)
     */
    modBCST?: number | 4 | 5;
    /**
     * @param {number} pMVAST - Percentual da margem de valor Adicionado do ICMS ST
     */
    pMVAST?: number;
    /**
     * @param {number} pRedBCST - Percentual da Redução de BC do ICMS ST
     */
    pRedBCST?: number;
    /**
     * @param {number} vBCST - Valor da BC do ICMS ST
     */
    vBCST?: number;
    /**
     * @param {number} pICMSST - Alíquota do imposto do ICMS ST
     * Alíquota do ICMS ST sem o FCP. Quando for o caso, informar a alíquota do FCP no campo pFCP
     */
    pICMSST?: number;
    /**
     * @param {number} vICMSST - Valor do ICMS ST retido
     */
    vICMSST?: number;
    /**
     * @param {number} pCredSN - Alíquota aplicável de cálculo do crédito (SIMPLES NACIONAL)
     */
    pCredSN?: number;
    /**
     * @param {number} vCredICMSSN - Valor crédito do ICMS que pode ser aproveitado nos termos do art. 23 da LC 123 (SIMPLES NACIONAL)
     */
    vCredICMSSN?: number;
}
/** [ICMSSN202] - Grupo CRT=1 – Simples Nacional e CSOSN=202 ou 203 */
export type ICMSSN202 = {
    /**
     * @param {number} orig - Origem da mercadoria
     * 0 - Nacional, exceto as indicadas nos códigos 3, 4, 5 e 8
     * 1 - Estrangeira - Importação direta, exceto a indicada no código 6
     * 2 - Estrangeira - Adquirida no mercado interno, exceto a indicada no código 7
     * 3 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 40% e inferior ou igual a 70%
     * 4 - Nacional, cuja produção tenha sido feita em conformidade com os processos produtivos básicos de que tratam as legislações citadas nos Ajustes
     * 5 - Nacional, mercadoria ou bem com Conteúdo de Importação inferior ou igual a 40%
     * 6 - Estrangeira - Importação direta, sem similar nacional, constante em lista da CAMEX e gás natural
     * 7 - Estrangeira - Adquirida no mercado interno, sem similar nacional, constante lista CAMEX e gás natural
     * 8 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 70%
     */
    orig: number;
    /**
     * @param {number} CSOSN - Código de Situação da Operação – Simples Nacional
     * 202=Tributada pelo Simples Nacional sem permissão de crédito e com cobrança do ICMS por Substituição Tributária
     * 203= Isenção do ICMS nos Simples Nacional para faixa de receita bruta e com cobrança do ICMS por Substituição Tributária
     */
    CSOSN: 202 | 203;
    /**
     * @param {number} modBCST - Modalidade de determinação da BC do ICMS ST
     * 0=Preço tabelado ou máximo sugerido
     * 1=Lista Negativa (valor)
     * 2=Lista Positiva (valor)
     * 3=Lista Neutra (valor)
     * 4=Margem Valor Agregado (%)
     * 5=Pauta (valor)
     */
    modBCST?: number | 4 | 5;
    /**
     * @param {number} pMVAST - Percentual da margem de valor Adicionado do ICMS ST
     */
    pMVAST?: number;
    /**
     * @param {number} pRedBCST - Percentual da Redução de BC do ICMS ST
     */
    pRedBCST?: number;
    /**
     * @param {number} vBCST - Valor da BC do ICMS ST
     */
    vBCST?: number;
    /**
     * @param {number} pICMSST - Alíquota do imposto do ICMS ST
     * Alíquota do ICMS ST sem o FCP. Quando for o caso, informar a alíquota do FCP no campo pFCP
     */
    pICMSST?: number;
    /**
     * @param {number} vICMSST - Valor do ICMS ST retido
     */
    vICMSST?: number;
    /**
     * @param {number} pCredSN - Alíquota aplicável de cálculo do crédito (SIMPLES NACIONAL)
     */
    pCredSN?: number;
    /**
     * @param {number} vCredICMSSN - Valor crédito do ICMS que pode ser aproveitado nos termos do art. 23 da LC 123 (SIMPLES NACIONAL)
     */
    vCredICMSSN?: number;
}
/** [ICMSSN500] - Grupo CRT=1 – Simples Nacional e CSOSN = 500 */
export type ICMSSN500 = {
    /**
     * @param {number} orig - Origem da mercadoria
     * 0 - Nacional, exceto as indicadas nos códigos 3, 4, 5 e 8
     * 1 - Estrangeira - Importação direta, exceto a indicada no código 6
     * 2 - Estrangeira - Adquirida no mercado interno, exceto a indicada no código 7
     * 3 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 40% e inferior ou igual a 70%
     * 4 - Nacional, cuja produção tenha sido feita em conformidade com os processos produtivos básicos de que tratam as legislações citadas nos Ajustes
     * 5 - Nacional, mercadoria ou bem com Conteúdo de Importação inferior ou igual a 40%
     * 6 - Estrangeira - Importação direta, sem similar nacional, constante em lista da CAMEX e gás natural
     * 7 - Estrangeira - Adquirida no mercado interno, sem similar nacional, constante lista CAMEX e gás natural
     * 8 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 70%
     */
    orig: number;
    /**
     * @param {number} CSOSN - Código de Situação da Operação – Simples Nacional
     * 500=ICMS cobrado anteriormente por substituição tributária (substituído) ou por antecipação
     */
    CSOSN: 500;
    /**
     * @param {number} vBCSTRet - Valor da BC do ICMS ST retido
     * Valor da BC do ICMS ST cobrado anteriormente por ST (v2.0). O valor pode ser omitido quando a legislação não exigir a sua informação.
     */
    vBCSTRet?: number | string;
    /**
     * @param {number} pST - Alíquota suportada pelo Consumidor Final
     * Deve ser informada a alíquota do cálculo do ICMS-ST, já incluso o FCP.
     */
    pST?: number | string;
    /**
     * @param {number} vICMSSubstituto - Valor do ICMS próprio do Substituto
     * Valor do ICMS próprio do Substituto cobrado em operação anterior
     */
    vICMSSubstituto?: number | string;
    /**
     * @param {number} vICMSSTRet - Valor do ICMS ST retido
     * Valor do ICMS ST cobrado anteriormente por ST (v2.0). O valor pode ser omitido quando a legislação não exigir a sua informação.
     */
    vICMSSTRet?: number | string;
    /**
     * @param {number} vBCFCPSTRet - Valor da Base de Cálculo do FCP retido anteriormente
     * Informar o valor da Base de Cálculo do FCP retido anteriormente por ST
     */
    vBCFCPSTRet?: number;
    /**
     * @param {number} pFCPSTRet - Percentual do FCP retido anteriormente por Substituição Tributária
     * Percentual relativo ao Fundo de Combate à Pobreza.
     */
    pFCPSTRet?: number;
    /**
     * @param {number} vFCPSTRet - Valor do FCP retido anteriormente por Substituição Tributária
     * Valor do ICMS relativo ao Fundo de Combate à Pobreza (FCP) retido por substituição tributária.
     */
    vFCPSTRet?: number;
    /**
     * @param {number} pRedBCEfet - Percentual de redução da base de cálculo efetiva
     * Percentual de redução, caso estivesse submetida ao regime comum de tributação, para obtenção da base de cálculo efetiva (vBCEfet).
     */
    pRedBCEfet?: number;
    /**
     * @param {number} vBCEfet - Valor da base de cálculo efetiva
     * Valor da base de cálculo que seria atribuída à operação própria do contribuinte substituído, caso estivesse submetida ao regime comum de tributação, obtida pelo produto do Vprod por (1- pRedBCEfet).
     */
    vBCEfet?: number;
    /**
     * @param {number} pICMSEfet - Alíquota do ICMS efetiva
     * Alíquota do ICMS na operação a consumidor final, caso estivesse submetida ao regime comum de tributação.
     */
    pICMSEfet?: number;
    /**
     * @param {number} vICMSEfet - Valor do ICMS efetivo
     * Obtido pelo produto do valor do campo pICMSEfet pelo valor do campo vBCEfet, caso estivesse submetida ao regime comum de tributação.
     */
    vICMSEfet?: number;
}
/** [ICMSSN900] - Grupo CRT=1 – Simples Nacional, CRT=4 – MEI e CSOSN=900 */
export type ICMSSN900 = {
    /**
     * @param {number} orig - Origem da mercadoria
     * 0 - Nacional, exceto as indicadas nos códigos 3, 4, 5 e 8
     * 1 - Estrangeira - Importação direta, exceto a indicada no código 6
     * 2 - Estrangeira - Adquirida no mercado interno, exceto a indicada no código 7
     * 3 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 40% e inferior ou igual a 70%
     * 4 - Nacional, cuja produção tenha sido feita em conformidade com os processos produtivos básicos de que tratam as legislações citadas nos Ajustes
     * 5 - Nacional, mercadoria ou bem com Conteúdo de Importação inferior ou igual a 40%
     * 6 - Estrangeira - Importação direta, sem similar nacional, constante em lista da CAMEX e gás natural
     * 7 - Estrangeira - Adquirida no mercado interno, sem similar nacional, constante lista CAMEX e gás natural
     * 8 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 70%
     */
    orig?: number;
    /**
     * @param {number} CSOSN - Código de Situação da Operação – SIMPLES NACIONAL
     * 900=Outros (v2.0)
     */
    CSOSN: 900;
    /**
     * @param {number} modBC - Modalidade de determinação da BC do ICMS
     * 0=Margem Valor Agregado (%)
     * 1=Pauta (Valor)
     * 2=Preço Tabelado Máx. (valor)
     * 3=Valor da operação.
     */
    modBC: number;
    /**
     * @param {number} vBC - Valor da BC do ICMS
     * (v2.0)
     */
    vBC: string;
    /**
     * @param {number} pRedBC - Percentual da Redução de BC
     * (v2.0)
     */
    pRedBC?: number;
    /**
     * @param {number} pICMS - Alíquota do imposto
     * (v2.0)
     */
    pICMS: string;
    /**
     * @param {number} vICMS - Valor do ICMS
     * (v2.0)
     */
    vICMS: string;
    /**
     * @param {number} modBCST - Modalidade de determinação da BC do ICMS ST
     * 0=Preço tabelado ou máximo sugerido
     * 1=Lista Negativa (valor)
     * 2=Lista Positiva (valor)
     * 3=Lista Neutra (valor)
     * 4=Margem Valor Agregado (%)
     * 5=Pauta (valor)
     */
    modBCST: number | 4 | 5;
    /**
     * @param {number} pMVAST - Percentual da margem de valor Adicionado do ICMS ST
     * (v2.0)
     */
    pMVAST?: number;
    /**
     * @param {number} pRedBCST - Percentual da Redução de BC do ICMS ST
     * (v2.0)
     */
    pRedBCST?: number;
    /**
     * @param {number} vBCST - Valor da BC do ICMS ST
     * (v2.0)
     */
    vBCST: string;
    /**
     * @param {number} pICMSST - Alíquota do imposto do ICMS ST
     * Alíquota do ICMS ST sem o FCP. Quando for o caso, informar a alíquota do FCP no campo pFCP
     */
    pICMSST: number;
    /**
     * @param {number} vICMSST - Valor do ICMS ST
     * Valor do ICMS ST retido(v2.0)
     */
    vICMSST: number;
    /**
     * @param {number} vBCFCPST - Valor da Base de Cálculo do FCP retido por Substituição Tributária
     * Informar o valor da Base de Cálculo do FCP retido por Substituição Tributária
     */
    vBCFCpST?: number | string;
    /**
     * @param {number} pFCPST - Percentual do FCP retido por Substituição Tributária
     * Percentual relativo ao Fundo de Combate à Pobreza (FCP) retido por substituição tributária.
     */
    pFCpST?: number | string;
    /**
     * @param {number} vFCPST - Valor do FCP retido por Substituição Tributária
     * Valor do ICMS relativo ao Fundo de Combate à Pobreza (FCP) retido por substituição tributária.
     */
    vFCpST?: number | string;
    /**
     * @param {number} pCredSN - Alíquota aplicável de cálculo do crédito (Simples Nacional)
     * (v2.0)
     */
    pCredSN?: number;
    /**
     * @param {number} vCredICMSSN - Valor crédito do ICMS que pode ser aproveitado nos termos do art. 23 da LC 123/2006 (Simples Nacional)
     * (v2.0)
     */
    vCredICMSSN?: number;
}
/** [ICMSUFDest] - Informação do ICMS Interestadual	 */
export type ICMSUFDest = {
    /**
     * @param {number} vBCUFDest - Valor da BC do ICMS na UF de destino
     * Valor da Base de Cálculo do ICMS na UF de destino.
     */
    vBCUFDest: number;
    /**
     * @param {number} vBCFCPUFDest - Valor da BC FCP na UF de destino
     * Valor da Base de Cálculo do FCP na UF de destino. (Incluído na NT 2016/002)
     */
    vBCFCPUFDest: number;
    /**
     * @param {number} pFCPUFDest - Percentual do ICMS relativo ao Fundo de Combate à Pobreza (FCP) na UF de destino
     * Percentual adicional inserido na alíquota interna da UF de destino, relativo ao Fundo de Combate à Pobreza (FCP) naquela UF. Nota: Percentual máximo de 2%, conforme a legislação.
     */
    pFCPUFDest?: number;
    /**
     * @param {number} pICMSUFDest - Alíquota interna da UF de destino
     * Alíquota adotada nas operações internas na UF de destino para o produto / mercadoria. A alíquota do Fundo de Combate a Pobreza, se existente para o produto / mercadoria, deve ser informada no campo próprio (pFCPUFDest) não devendo ser somada à essa alíquota interna.
     */
    pICMSUFDest: number;
    /**
     * @param {number} pICMSInter - Alíquota interestadual das UF envolvidas
     * Alíquota interestadual das UF envolvidas:
     * - 4% alíquota interestadual para produtos importados
     * - 7% para os Estados de origem do Sul e Sudeste (exceto ES), destinado para os Estados do Norte, Nordeste, Centro-Oeste e Espírito Santo
     * - 12% para os demais casos.
     */
    pICMSInter: number;
    /**
     * @param {number} pICMSInterPart - Percentual provisório de partilha do ICMS Interestadual
     * Percentual de ICMS Interestadual para a UF de destino:
     * - 40% em 2016
     * - 60% em 2017
     * - 80% em 2018
     * - 100% a partir de 2019.
     */
    pICMSInterPart: number;
    /**
     * @param {number} vFCPUFDest - Valor do ICMS relativo ao Fundo de Combate à Pobreza (FCP) da UF de destino
     * Valor do ICMS relativo ao Fundo de Combate à Pobreza (FCP) da UF de destino. (Atualizado na NT 2016/002)
     */
    vFCPUFDest?: number;
    /**
     * @param {number} vICMSUFDest - Valor do ICMS Interestadual para a UF de destino
     * Valor do ICMS Interestadual para a UF de destino, já considerando o valor do ICMS relativo ao Fundo de Combate à Pobreza naquela UF.
     */
    vICMSUFDest: number;
    /**
     * @param {number} vICMSUFRemet - Valor do ICMS Interestadual para a UF do remetente
     * Valor do ICMS Interestadual para a UF do remetente. Nota: A partir de 2019, este valor será zero.
     */
    vICMSUFRemet: number;
};

export type dadosICMS = {
    /**
     * @param {number} orig - Origem da mercadoria
     * 0 - Nacional, exceto as indicadas nos códigos 3, 4, 5 e 8
     * 1 - Estrangeira - Importação direta, exceto a indicada no código 6
     * 2 - Estrangeira - Adquirida no mercado interno, exceto a indicada no código 7
     * 3 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 40% e inferior ou igual a 70%
     * 4 - Nacional, cuja produção tenha sido feita em conformidade com os processos produtivos básicos de que tratam as legislações citadas nos Ajustes
     * 5 - Nacional, mercadoria ou bem com Conteúdo de Importação inferior ou igual a 40%
     * 6 - Estrangeira - Importação direta, sem similar nacional, constante em lista da CAMEX e gás natural
     * 7 - Estrangeira - Adquirida no mercado interno, sem similar nacional, constante lista CAMEX e gás natural
     * 8 - Nacional, mercadoria ou bem com Conteúdo de Importação superior a 70%
     */
    orig?: number;
    /**
     * @param {string} CST - Tributação do ICMS
     */
    CST: string;
    /**
     * @param {number} modBC - Modalidade de determinação da BC do ICMS
     * 0=Margem Valor Agregado (%)
     * 1=Pauta (Valor)
     * 2=Preço Tabelado Máx. (valor)
     * 3=Valor da operação.
     */
    modBC?: number | '';
    /**
     * @param {number} vBC - Valor da BC do ICMS
     */
    vBC?: string | '';
    /**
     * @param {number} vICMS - Valor do ICMS
     */
    vICMS?: string | '';
    /**
     * @param {number} pFCP - Percentual do ICMS relativo ao Fundo de Combate à Pobreza (FCP)
     * Percentual relativo ao Fundo de Combate à Pobreza (FCP).
     */
    pFCP?: number | '';
    /**
     * @param {number} vFCP - Valor do Fundo de Combate à Pobreza (FCP)
     * Valor do ICMS relativo ao Fundo de Combate à Pobreza (FCP).
     */
    vFCP?: number | '';
    /**
     * @param {number} pICMS - Alíquota do imposto
     * Alíquota do ICMS sem o FCP. Quando for o caso, informar a alíquota do FCP no campo pFCP
     */
    pICMS?: string | '';
    /**
     * @param {number} vBCFCP - Valor da Base de Cálculo do FCP
     * Informar o valor da Base de Cálculo do FCP
     */
    vBCFCP?: number | '';
    /**
     * @param {number} qBCMono - Quantidade Tributada
     * Informar a BC do ICMS em quantidade conforme unidade de medida estabelecida na legislação para o produto.
     */
    qBCMono?: number | '';
    /**
     * @param {number} adRemICMSRet - Alíquota ad rem do imposto retido anteriormente
     * Alíquota ad rem do ICMS, estabelecida na legislação para o produto.
     */
    adRemICMSRet?: number | '';
    /**
     * @param {number} vICMSMono - Valor do ICMS próprio devido
     * O valor do ICMS próprio devido é o resultado do valor do ICMS da operação menos valor do ICMS diferido.
     */
    vICMSMono?: number | '';
    /**
     * @param {number} modBCST - Modalidade de determinação da BC do ICMS ST
     * 0=Preço tabelado ou máximo sugerido
     * 1=Lista Negativa (valor)
     * 2=Lista Positiva (valor)
     * 3=Lista Neutra (valor)
     * 4=Margem Valor Agregado (%)
     * 5=Pauta (valor)
     */
    modBCST?: number | '';
    /**
     * @param {number} pMVAST - Percentual da margem de valor Adicionado do ICMS ST
     * (v2.0)
     */
    pMVAST?: number | '';
    /**
     * @param {number} pRedBCST - Percentual da Redução de BC do ICMS ST
     * (v2.0)
     */
    pRedBCST?: number | '';
    /**
     * @param {number} vBCST - Valor da BC do ICMS ST
     * (v2.0)
     */
    vBCST?: string | '';
    /**
     * @param {number} pICMSST - Alíquota do imposto do ICMS ST
     * Alíquota do ICMS ST sem o FCP. Quando for o caso, informar a alíquota do FCP no campo pFCP
     */
    pICMSST?: number | '';
    /**
     * @param {number} vICMSST - Valor do ICMS ST
     * Valor do ICMS ST retido(v2.0)
     */
    vICMSST?: number | '';
    /**
     * @param {number} vICMSSTDeson - 
     */
    vICMSSTDeson?: number | '';
    /**
     * @param {string} motDesICMSST - 
     */
    motDesICMSST?: string | '';
    /**
     * @param {number} vICMSDeson - Valor do ICMS
     * Informar nas operações:
     * a) com produtos beneficiados com a desoneração condicional do ICMS.
     * b) destinadas à SUFRAMA, informando-se o valor que seria devido se não houvesse isenção.
     * c) de venda a órgão da administração pública direta e suas fundações e autarquias com isenção do ICMS. (NT 2011/004
     * d) demais casos solicitados pelo Fisco. (NT 2016/002)
     */
    vICMSDeson?: number | '';
    /**
     * @param {number} motDesICMS - Motivo da desoneração do ICMS
     * Campo será preenchido quando o campo anterior estiver preenchido. Informar o motivo da desoneração:
     * 1=Táxi
     * 3=Produtor Agropecuário
     * 4=Frotista/Locadora
     * 5=Diplomático/Consular
     * 6=Utilitários e Motocicletas da Amazônia Ocidental e Áreas de Livre Comércio (Resolução 714/88 e 790/94 – CONTRAN e suas alterações)
     * 7=SUFRAMA
     * 8=Venda a Órgão Público
     * 9=Outros. (NT 2011/004)
     * 10=Deficiente Condutor (Convênio ICMS 38/12)
     * 11=Deficiente Não Condutor (Convênio ICMS 38/12)
     * 16=Olimpíadas Rio 2016 (NT 2015.002)
     * 90=Solicitado pelo Fisco (NT 2016/002)
     * Revogada a partir da versão 3.10 a possibilidade de usar o motivo 2=Deficiente Físico
     */
    motDesICMS?: number | '';
    /**
     * @param {boolean} indDeduzDeson - Indica se o valor do ICMS desonerado (vICMSDeson) deduz do valor do item (vProd)
     * O campo só pode ser preenchido com:
     * 0=Valor do ICMS desonerado (vICMSDeson) não deduz do valor do item (vProd) / total da NF-e.
     * 1=Valor do ICMS desonerado (vICMSDeson) deduz do valor do item (vProd) / total da NF-e.
     */
    indDeduzDeson?: boolean | '';
    /**
     * @param {number} qBCMonoReten - Quantidade tributada sujeita a retenção
     * Informar a BC do ICMS sujeita a retenção em quantidade conforme unidade de medida estabelecida na legislação para o produto.
     */
    qBCMonoReten?: number | '';
    /**
     * @param {number} adRemICMSReten - Alíquota ad rem do imposto com retenção
     * Alíquota ad rem do ICMS sobre o biocombustível a ser adicionado para a composição da mistura vendida a consumidor final estabelecida na legislação para o produto.
     */
    adRemICMSReten?: number | '';
    /**
     * @param {number} vICMSMonoReten - Valor do ICMS com retenção
     * O valor do ICMS é obtido pela multiplicação da alíquota ad rem pela quantidade do produto conforme unidade de medida estabelecida na legislação.
     */
    vICMSMonoReten?: number | '';
    /**
     * @param {number} pRedAdRem - Percentual de redução do valor da alíquota adrem do ICMS
     * Informar o percentual de redução do valor da alíquota ad rem do ICMS.
     */
    pRedAdRem?: number | '';
    /**
     * @param {number} ICMSOp - 
     */
    ICMSOp?: number,
    /**
     * @param {number} pDif - Percentual do diferimento
     * No caso de diferimento total, informar o percentual de diferimento "100".
     */
    pDif?: number | '';
    /**
     * @param {number} vICMSDif - Valor do ICMS diferido
     */
    vICMSDif?: number | '';
    /**
     * @param {number} vICMSMonoOp - Valor do ICMS da operação
     * O valor do ICMS é obtido pela multiplicação da alíquota ad rem pela quantidade do produto conforme unidade de medida estabelecida em legislação, como se não houvesse o diferimento
     */
    vICMSMonoOp?: number | '';
    /**
     * @param {number} vICMSMonoDif - Valor do ICMS diferido
     * O valor do ICMS é obtido pela multiplicação da alíquota ad rem pela quantidade do produto conforme unidade de medida estabelecida, multiplicado pelo percentual de diferimento.
     */
    vICMSMonoDif?: number | '';
    /**
     * @param {number} qBCMonoDif - Quantidade tributada diferida
     * Informar a BC do ICMS diferido em quantidade conforme unidade de medida estabelecida na legislação para o produto.
     */
    qBCMonoDif?: number | '';
    /**
     * @param {number} adRemICMSDif - Alíquota ad rem do imposto diferido
     * Alíquota ad rem do ICMS estabelecida na legislação para o produto.
     */
    adRemICMSDif?: number | '';
    /**
     * @param {number} vBCSTRet - Valor da BC do ICMS ST retido
     * Valor da BC do ICMS ST cobrado anteriormente por ST (v2.0). O valor pode ser omitido quando a legislação não exigir a sua informação.
     */
    vBCSTRet?: number | string;
    /**
     * @param {number} pST - Alíquota suportada pelo Consumidor Final
     * Deve ser informada a alíquota do cálculo do ICMS-ST, já incluso o FCP.
     */
    pST?: number | string | '';
    /**
     * @param {number} vICMSSubstituto - Valor do ICMS próprio do Substituto
     * Valor do ICMS próprio do Substituto cobrado em operação anterior
     */
    vICMSSubstituto?: number | string | '';
    /**
     * @param {number} vICMSSTRet - Valor do ICMS ST retido
     * Valor do ICMS ST cobrado anteriormente por ST (v2.0). O valor pode ser omitido quando a legislação não exigir a sua informação.
     */
    vICMSSTRet?: number | string | '';
    /**
     * @param {number} vBCFCPSTRet - Valor da Base de Cálculo do FCP retido anteriormente
     * Informar o valor da Base de Cálculo do FCP retido anteriormente por ST
     */
    vBCFCPSTRet?: number | '';
    /**
     * @param {number} pFCPSTRet - Percentual do FCP retido anteriormente por Substituição Tributária
     * Percentual relativo ao Fundo de Combate à Pobreza.
     */
    pFCPSTRet?: number | '';
    /**
     * @param {number} vFCPSTRet - Valor do FCP retido anteriormente por Substituição Tributária
     * Valor do ICMS relativo ao Fundo de Combate à Pobreza (FCP) retido por substituição tributária.
     */
    vFCPSTRet?: number | '';
    /**
     * @param {number} pRedBCEfet - Percentual de redução da base de cálculo efetiva
     * Percentual de redução, caso estivesse submetida ao regime comum de tributação, para obtenção da base de cálculo efetiva (vBCEfet).
     */
    pRedBCEfet?: number | '';
    /**
     * @param {number} vBCEfet - Valor da base de cálculo efetiva
     * Valor da base de cálculo que seria atribuída à operação própria do contribuinte substituído, caso estivesse submetida ao regime comum de tributação, obtida pelo produto do Vprod por (1- pRedBCEfet).
     */
    vBCEfet?: number | '';
    /**
     * @param {number} pICMSEfet - Alíquota do ICMS efetiva
     * Alíquota do ICMS na operação a consumidor final, caso estivesse submetida ao regime comum de tributação.
     */
    pICMSEfet?: number | '';
    /**
     * @param {number} vICMSEfet - Valor do ICMS efetivo
     * Obtido pelo produto do valor do campo pICMSEfet pelo valor do campo vBCEfet, caso estivesse submetida ao regime comum de tributação.
     */
    vICMSEfet?: number | '';
    /**
     * @param {number} vBCSTDest - Valor da BC do ICMS ST da UF destino
     */
    vBCSTDest?: number | '';
    /**
     * @param {number} vICMSSTDest - Valor do ICMS ST da UF destino
     */
    vICMSSTDest?: number | '';
    /**
     * @param {number} CSOSN - Código de Situação da Operação
     */
    CSOSN?: string;
    /**
     * @param {number} pCredSN - Alíquota aplicável de cálculo do crédito (Simples Nacional)
     * (v2.0)
     */
    pCredSN?: number | '';
    /**
     * @param {number} vCredICMSSN - Valor crédito do ICMS que pode ser aproveitado nos termos do art. 23 da LC 123/2006 (Simples Nacional)
     * (v2.0)
     */
    vCredICMSSN?: number | '';
    /**
     * @param {number} pBCOp - Percentual da BC operação própria
     */
    pBCOp?: number | '';
    /**
     * @param {string} UFST - UF para qual é devido o ICMS ST
     * Sigla da UF para qual é devido o ICMS ST da operação. Informar "EX" para Exterior.
     */
    UFST?: string | '';
}

/**
 * [IPI] 
 * Grupo IPI
 * GRUPO O
 */
export type IPI = {
    /**
     * @param {number} clEnq - Classe de enquadramento do IPI para Cigarros e Bebidas
     * Preenchimento conforme Atos Normativos editados pela Receita Federal (Observação 2)
     * (Excluído no leiaute 4.0 - NT 2016/002)
     */
    clEnq?: number;
    /**
     * @param {string} CNPJProd - CNPJ do produtor da mercadoria, quando diferente do emitente. Somente para os casos de exportação direta ou indireta.
     * Informar os zeros não significativos
     */
    CNPJProd?: string;
    /**
     * @param {string} cSelo - Código do selo de controle IPI
     * Preenchimento conforme Anexo II-A da Instrução Normativa RFB Nº 770/2007
     * TIPO DE SELO	CÓDIGO	COR DO SELO
     * Produto Nacional	9710-01	Verde combinado com marrom
     * Produto Nacional para Exportação - Tipo "1"	9710-10	Verde Escuro combinado com marrom
     * Produto Nacional para Exportação - Tipo "2"	9710-11	Verde Escuro combinado com marrom
     * Produto Nacional para Exportação - Tipo "3"	9710-12	Verde Escuro combinado com marrom
     * Produto Estrangeiro	8610-09	Vermelho combinado com azul
     * (Atualizado na NT 2016/002)
     */
    cSelo?: string;
    /**
     * @param {number} qSelo - Quantidade de selo de controle
     */
    qSelo?: number;
    /**
     * @param {number} cEnq - Código de Enquadramento Legal do IPI
     * Preenchimento conforme item 8.9. Código de Enquadramento Legal do IPI do MOC – Visão Geral
     */
    cEnq: number;
    /**
     * @param {IPITrib} IPITrib - Grupo do CST 00, 49, 50 e 99
     * Informar apenas um dos grupos O07 ou O08 com base valor atribuído ao campo O09 – CST do IPI
     */
    IPITrib: IPITrib;
    /**
     * @param {IPINT} IPINT - Grupo CST 01, 02, 03, 04, 51, 52, 53
     */
    IPINT?: IPINT;
};
export type IPITrib = {
    /**
     * @param {number} CST - Código da situação tributária do IPI
     * 00=Entrada com recuperação de crédito
     * 49=Outras entradas
     * 50=Saída tributada
     * 99=Outras saídas
     */
    CST: number;
    /**
     * @param {number} vBC - Valor da BC do IPI
     */
    vBC: string;
    /**
     * @param {number} pIPI - Alíquota do IPI
     */
    pIPI: number;
    /**
     * @param {number} qUnid - Quantidade total na unidade padrão para tributação (somente para os produtos tributados por unidade)
     */
    qUnid: number;
    /**
     * @param {number} vUnid - Valor por Unidade Tributável
     */
    vUnid: number;
    /**
     * @param {number} vIPI - Valor do IPI
     * Informar os campos O11 e O12 se o cálculo do IPI for de valor por unidade.
     */
    vIPI: string;
};
export type IPINT = {
    /**
     * @param {number} CST - Código da situação tributária do IPI
     * 01=Entrada tributada com alíquota zero
     * 02=Entrada isenta
     * 03=Entrada não-tributada
     * 04=Entrada imune
     * 05=Entrada com suspensão
     * 51=Saída tributada com alíquota zero
     * 52=Saída isenta
     * 53=Saída não-tributada
     * 54=Saída imune
     * 55=Saída com suspensão
     */
    CST: number;
};

/**
 * [II] 
 * Grupo Imposto de Importação	
 * GRUPO OP
 */
export type II = {
    /**
     * @param {number} vBC - Valor BC do Imposto de Importação
     */
    vBC: string;
    /**
     * @param {number} vDespAdu - Valor despesas aduaneiras
     */
    vDespAdu: number;
    /**
     * @param {number} vII - Valor Imposto de Importação
     */
    vII: string;
    /**
     * @param {number} vIOF - Valor Imposto sobre Operações Financeiras
     */
    vIOF: number;
};

/**
 * [PIS] 
 * Grupo PIS
 * GRUPO Q
 */
export type PIS = {
    /**
     * @param {PISAliq} PISAliq - Grupo PIS tributado pela alíquota
     */
    PISAliq?: PISAliq;
    /**
     * @param {PISQtde} PISQtde - Grupo PIS tributado por Qtde
     */
    PISQtde?: PISQtde;
    /**
     * @param {PISQtde} PISQtde - Grupo PIS não tributado
     */
    PISNT?: PISNT;
    /**
     * @param {PISQtde} PISQtde - Grupo PIS Outras Operações
     */
    PISOutr?: PISOutr;
    /**
     * @param {dadosPIS} dadosPIS - Caso não tenha certeza do grupo do PIS a ser utilizado
     * Informe os dados dentro da tag 'dadosPIS' que a lib tentará definir automaticamente
     */
    dadosPIS?: dadosPIS;
};
export type PISAliq = {
    /**
     * @param {string} CST - Código de Situação Tributária do PIS
     * 01=Operação Tributável (base de cálculo = valor da operação alíquota normal (cumulativo/não cumulativo))
     * 02=Operação Tributável (base de cálculo = valor da operação (alíquota diferenciada))
     */
    CST: string
    /**
     * @param {number} vBC -Valor da Base de Cálculo do PIS
     */
    vBC: string;
    /**
     * @param {number} pPIS - Alíquota do PIS (em percentual)
     */
    pPIS: string;
    /**
     * @param {number} vPIS - Valor do PIS
     */
    vPIS: string;
}
export type PISQtde = {
    /**
     * @param {string} CST - Código de Situação Tributária do PIS
     * @observation 03=Operação Tributável (base de cálculo = quantidade vendida x alíquota por unidade de produto)
     */
    CST: string
    /**
     * @param {number} qBCProd - Quantidade Vendida
     */
    qBCProd: number;
    /**
     * @param {number} vAliqProd - Alíquota do PIS (em reais)
     */
    vAliqProd: number;
    /**
     * @param {number} vPIS - Valor do PIS
     */
    vPIS: string;
}
export type PISNT = {
    /**
     * @param {string} CST - Código de Situação Tributária do PIS
     * @observation 04=Operação Tributável (tributação monofásica (alíquota zero))
     * 05=Operação Tributável (Substituição Tributária)
     * 06=Operação Tributável (alíquota zero)
     * 07=Operação Isenta da Contribuição
     * 08=Operação Sem Incidência da Contribuição
     * 09=Operação com Suspensão da Contribuição;
     */
    CST: string
}
export type PISOutr = {
    /**
     * @param {string} CST -Código de Situação Tributária do PIS
     * @observation 49=Outras Operações de Saída
     * 50=Operação com Direito a Crédito - Vinculada Exclusivamente a Receita Tributada no Mercado Interno
     * 51=Operação com Direito a Crédito - Vinculada Exclusivamente a Receita Não Tributada no Mercado Interno
     * 52=Operação com Direito a Crédito – Vinculada Exclusivamente a Receita de Exportação
     * 53=Operação com Direito a Crédito - Vinculada a Receitas Tributadas e Não-Tributadas no Mercado Interno
     * 54=Operação com Direito a Crédito - Vinculada a Receitas Tributadas no Mercado Interno e de Exportação
     * 55=Operação com Direito a Crédito - Vinculada a Receitas Não-Tributadas no Mercado Interno e de Exportação
     * 56=Operação com Direito a Crédito - Vinculada a Receitas Tributadas e Não-Tributadas no Mercado Interno, e de Exportação
     * 60=Crédito Presumido - Operação de Aquisição Vinculada Exclusivamente a Receita Tributada no Mercado Interno
     * 61=Crédito Presumido - Operação de Aquisição Vinculada Exclusivamente a Receita Não Tributada no Mercado Interno
     * 62=Crédito Presumido - Operação de Aquisição Vinculada Exclusivamente a Receita de Exportação
     * 63=Crédito Presumido - Operação de Aquisição Vinculada a Receitas Tributadas e Não-Tributadas no Mercado Interno
     * 64=Crédito Presumido - Operação de Aquisição Vinculada a Receitas Tributadas no Mercado Interno e de Exportação
     * 65=Crédito Presumido - Operação de Aquisição Vinculada a Receitas Não-Tributadas no Mercado Interno e de Exportação
     * 66=Crédito Presumido - Operação de Aquisição Vinculada a Receitas Tributadas e Não-Tributadas no Mercado Interno, e de Exportação
     * 67=Crédito Presumido - Outras Operações
     * 70=Operação de Aquisição sem Direito a Crédito
     * 71=Operação de Aquisição com Isenção
     * 72=Operação de Aquisição com Suspensão
     * 73=Operação de Aquisição a Alíquota Zero
     * 74=Operação de Aquisição; sem Incidência da Contribuição
     * 75=Operação de Aquisição por Substituição Tributária
     * 98=Outras Operações de Entrada
     * 99=Outras Operações
     */
    CST: string
    /**
     * @param {number} vBC - Valor da Base de Cálculo do PIS
     */
    vBC?: number;
    /**
     * @param {number} pPIS - Alíquota do PIS (em percentual)
     */
    pPIS?: number;
    /**
     * @param {number} qBCProd - Quantidade Vendida
     */
    qBCProd?: number;
    /**
     * @param {number} vAliqProd - Alíquota do PIS (em reais)
     */
    vAliqProd?: number;
    /**
     * @param {number} vPIS - Valor do PIS
     */
    vPIS?: number;
}
export type dadosPIS = {
    /**
     * @param {string} CST - Código de Situação Tributária do PIS
     */
    CST: string;
    /**
     * @param {number} vBC - Valor da Base de Cálculo do PIS	
     */
    vBC?: string | '';
    /**
     * @param {number} pPIS - Alíquota do PIS (em percentual)	
     */
    pPIS?: string | '';
    /**
     * @param {number} vPIS - Valor do PIS	
     */
    vPIS?: string | '';
    /**
     * @param {number} qBCProd - Quantidade Vendida	
     */
    qBCProd?: string | '';
    /**
     * @param {number} vAliqProd - Alíquota do PIS (em reais)
     */
    vAliqProd?: string | '';
}

/**
 * [PISST] 
 * Grupo PIS Substituição Tributária	
 * GRUPO R
 */
export type PISST = {
    /**
     * @param {number} vBC - Valor da Base de Cálculo do PIS
     */
    vBC: string;
    /**
     * @param {number} pPIS - Alíquota do PIS (em percentual)
     */
    pPIS: string;
    /**
     * @param {number} qBCProd - Quantidade Vendida
     */
    qBCProd?: number;
    /**
     * @param {number} vAliqProd - Alíquota do PIS (em reais)
     */
    vAliqProd?: number;
    /**
     * @param {number} vPIS - Valor do PIS
     */
    vPIS: string;
    /**
     * @param {number} indSomaPISST - Indica se o valor do PISST compõe o valor total da NF-e
     * 0=Valor do PISST não compõe o valor total da NF-e
     * 1=Valor do PISST compõe o valor total da NF-e
     */
    indSomaPISST?: number;
};

/**
 * [COFINS] 
 * Grupo COFINS	
 * GRUPO S
 */
export type COFINS = {
    /**
     * @param {COFINSAliq} COFINSAliq - Grupo COFINS tributado pela alíquota
     */
    COFINSAliq?: COFINSAliq;
    /**
     * @param {COFINSQtde} COFINSQtde - Grupo de COFINS tributado por Qtde
     */
    COFINSQtde?: COFINSQtde;
    /**
     * @param {COFINSNT} COFINSNT - Grupo COFINS não tributado
     */
    COFINSNT?: COFINSNT;
    /**
     * @param {COFINSOutr} COFINSOutr - Grupo COFINS Outras Operações
     */
    COFINSOutr?: COFINSOutr;
    /**
     * @param {dadosCOFINS} dadosCOFINS - Caso não tenha certeza do grupo do COFINS a ser utilizado
     * Informe os dados dentro da tag 'dadosCOFINS' que a lib tentará definir automaticamente
     */
    dadosCOFINS?: dadosCOFINS;
};
export type COFINSAliq = {
    /**
     * @param {string} CST - Código de Situação Tributária da COFINS
     * @observation 01=Operação Tributável (base de cálculo = valor da operação alíquota normal (cumulativo/não cumulativo))
     * 02=Operação Tributável (base de cálculo = valor da operação (alíquota diferenciada))
     */
    CST: string;
    /**
     * @param {number} vBC - Valor da Base de Cálculo da COFINS
     */
    vBC: string;
    /**
     * @param {number} pCOFINS - Alíquota da COFINS (em percentual)
     */
    pCOFINS: string;
    /**
     * @param {number} vCOFINS - Valor da COFINS
     */
    vCOFINS: string;
};
export type COFINSQtde = {
    /**
     * @param {string} CST - Código de Situação Tributária da COFINS
     * @observation 03=Operação Tributável (base de cálculo = quantidade vendida x alíquota por unidade de produto)
     */
    CST: string;
    /**
     * @param {number} qBCProd - Quantidade Vendida
     */
    qBCProd: number;
    /**
     * @param {number} vAliqProd - Alíquota da COFINS (em reais)
     */
    vAliqProd: number;
    /**
     * @param {number} vCOFINS - Valor da COFINS
     */
    vCOFINS: string;
};
export type COFINSNT = {
    /**
     * @param {string} CST - Código de Situação Tributária da COFINS
     * @observation 04=Operação Tributável (tributação monofásica, alíquota zero)
     * 05=Operação Tributável (Substituição Tributária)
     * 06=Operação Tributável (alíquota zero)
     * 07=Operação Isenta da Contribuição
     * 08=Operação Sem Incidência da Contribuição
     * 09=Operação com Suspensão da Contribuição
     */
    CST: string;
};
export type COFINSOutr = {
    /**
     * @param {number} CST - Código de Situação Tributária da COFINS
     * @observation 49=Outras Operações de Saída
     * 50=Operação com Direito a Crédito - Vinculada Exclusivamente a Receita Tributada no Mercado Interno
     * 51=Operação com Direito a Crédito - Vinculada Exclusivamente a Receita Não Tributada no Mercado Interno
     * 52=Operação com Direito a Crédito – Vinculada Exclusivamente a Receita de Exportação
     * 53=Operação com Direito a Crédito - Vinculada a Receitas Tributadas e Não-Tributadas no Mercado Interno
     * 54=Operação com Direito a Crédito - Vinculada a Receitas Tributadas no Mercado Interno e de Exportação
     * 55=Operação com Direito a Crédito - Vinculada a Receitas Não-Tributadas no Mercado Interno e de Exportação
     * 56=Operação com Direito a Crédito - Vinculada a Receitas Tributadas e Não-Tributadas no Mercado Interno, e de Exportação
     * 60=Crédito Presumido - Operação de Aquisição Vinculada Exclusivamente a Receita Tributada no Mercado Interno
     * 61=Crédito Presumido - Operação de Aquisição Vinculada Exclusivamente a Receita Não-Tributada no Mercado Interno
     * 62=Crédito Presumido - Operação de Aquisição Vinculada Exclusivamente a Receita de Exportação
     * 63=Crédito Presumido - Operação de Aquisição Vinculada a Receitas Tributadas e Não-Tributadas no Mercado Interno
     * 64=Crédito Presumido - Operação de Aquisição Vinculada a Receitas Tributadas no Mercado Interno e de Exportação
     * 65=Crédito Presumido - Operação de Aquisição Vinculada a Receitas Não-Tributadas no Mercado Interno e de Exportação
     * 66=Crédito Presumido - Operação de Aquisição Vinculada a Receitas Tributadas e Não-Tributadas no Mercado Interno, e de Exportação
     * 67=Crédito Presumido - Outras Operações
     * 70=Operação de Aquisição sem Direito a Crédito
     * 71=Operação de Aquisição com Isenção
     * 72=Operação de Aquisição com Suspensão
     * 73=Operação de Aquisição a Alíquota Zero
     * 74=Operação de Aquisição; sem Incidência da Contribuição
     * 75=Operação de Aquisição por Substituição Tributária
     * 98=Outras Operações de Entrada
     * 99=Outras Operações
     */
    CST: string;
    /**
     * @param {number} vBC - Valor da Base de Cálculo da COFINS
     */
    vBC?: number;
    /**
     * @param {number} pCOFINS - Alíquota da COFINS (em percentual)
     */
    pCOFINS?: number;
    /**
     * @param {number} qBCProd - Quantidade Vendida
     */
    qBCProd?: number;
    /**
     * @param {number} vAliqProd - Alíquota da COFINS (em reais)
     */
    vAliqProd?: number;
    /**
     * @param {number} vCOFINS - Valor da COFINS
     */
    vCOFINS?: number;
};
export type dadosCOFINS = {
    /**
     * @param {string} CST - Código de Situação Tributária do COFINS
     */
    CST: string;
    /**
     * @param {number} vBC - Valor da Base de Cálculo do COFINS	
     */
    vBC?: string | '';
    /**
     * @param {number} pPIS - Alíquota do COFINS (em percentual)	
     */
    pCOFINS?: string | '';
    /**
     * @param {number} vPIS - Valor do COFINS	
     */
    vCOFINS?: string | '';
    /**
     * @param {number} qBCProd - Quantidade Vendida	
     */
    qBCProd?: string | '';
    /**
     * @param {number} vAliqProd - Alíquota do COFINS (em reais)
     */
    vAliqProd?: string | '';
}

/**
 * [COFINSST] 
 * Grupo COFINS Substituição Tributária
 * GRUPO T
 */
export type COFINSST = {
    /**
     * @param {number} vBC - Valor da Base de Cálculo da COFINS
     */
    vBC: string;
    /**
     * @param {number} pCOFINS - Alíquota da COFINS (em percentual)
     */
    pCOFINS: string;
    /**
     * @param {number} qBCProd - Quantidade Vendida
     */
    qBCProd?: number;
    /**
     * @param {number} vAliqProd - Alíquota da COFINS (em reais)
     */
    vAliqProd?: number;
    /**
     * @param {number} vCOFINS - Valor da COFINS
     */
    vCOFINS: string;
    /**
     * @param {number} indSomaCOFINSST - Indica se o valor da COFINS ST compõe o valor total da NFe
     * 0=Valor da COFINSST não compõe o valor total da NF-e
     * 1=Valor da COFINSST compõe o valor total da NF-e
     */
    indSomaCOFINSST?: number;
};

/**
 * [ISSQN] 
 * Grupo ISSQN	
 * GRUPO U
 */
export type ISSQN = {
    /**
     * @param {number} vBC - Valor da Base de Cálculo do ISSQN
     */
    vBC: string;
    /**
     * @param {number} vAliq - Alíquota do ISSQN
     */
    vAliq: number;
    /**
     * @param {number} vISSQN - Valor do ISSQN
     */
    vISSQN: number;
    /**
     * @param {number} cMunFG - Código do município de ocorrência do fato gerador do ISSQN
     */
    cMunFG: number;
    /**
     * @param {string} cListServ - Item da Lista de Serviços
     */
    cListServ: string;
    /**
     * @param {number} [vDeducao] - Valor dedução para redução da Base de Cálculo
     */
    vDeducao?: number;
    /**
     * @param {number} [vOutro] - Valor outras retenções
     */
    vOutro?: number;
    /**
     * @param {number} [vDescIncond] - Valor desconto incondicionado
     */
    vDescIncond?: number;
    /**
     * @param {number} [vDescCond] - Valor desconto condicionado
     */
    vDescCond?: number;
    /**
     * @param {number} [vISSRet] - Valor retenção ISS
     */
    vISSRet?: number;
    /**
     * @param {number} indISS - Indicador da exigibilidade do ISS
     * 1=Exigível
     * 2=Não incidência
     * 3=Isenção
     * 4=Exportação
     * 5=Imunidade
     * 6=Exigibilidade Suspensa por Decisão Judicial
     * 7=Exigibilidade Suspensa por Processo Administrativo
     */
    indISS: 1 | 2 | 3 | 4 | 5 | 6 | 7;
    /**
     * @param {string} [cServico] - Código do serviço prestado dentro do município
     */
    cServico?: string;
    /**
     * @param {number} [cMun] - Código do Município de incidência do imposto
     */
    cMun?: number;
    /**
     * @param {number} [cPais] - Código do País onde o serviço foi prestado
     */
    cPais?: number;
    /**
     * @param {string} [nProcesso] - Número do processo judicial ou administrativo de suspensão da exigibilidade
     */
    nProcesso?: string;
    /**
     * @param {number} indIncentivo - Indicador de incentivo Fiscal
     * 1=Sim
     * 2=Não
     */
    indIncentivo: 1 | 2;
};

/**
 * [ISSQN] 
 * Grupo ISSQN	
 * GRUPO U
 */
export type impostoDevol = {
    /**
     * @param {number} pDevol - Percentual da mercadoria devolvida
     * O valor máximo deste percentual é 100%, no caso de devolução total da mercadoria.
     */
    pDevol: number;
    /**
     * @param {IPIDevol} IPIDevol - Informação do IPIDevol devolvido
     */
    IPI: IPIDevol;

};
export type IPIDevol = {
    /**
    * @param {number} vIPIDevol - Valor do IPI devolvido
    */
    vIPIDevol: string;
};

/**
 * [obsItem] 
 * Grupo de observações de uso livre (para o item da NF-e)	
 * GRUPO VA
 */
export type ObsItem = {
    /**
     * @param {string} obsItem - Grupo de observações de uso livre (para o item da NF-e)
     */
    obsItem: string;
    /**
     * @param {ObsCont} obsCont - Grupo de observações de uso livre do Contribuinte
     */
    obsCont?: ObsCont;
    /**
     * @param {ObsFisco} obsFisco - Grupo de observações de uso livre do Fisco
     */
    obsFisco?: ObsFisco;
};
export type ObsCont = {
    /**
     * @param {string} xCampo - Identificação do campo
     */
    xCampo: string;
    /**
     * @param {string} xTexto - Conteúdo do campo
     */
    xTexto: string;
};
export type ObsFisco = {
    /**
     * @param {string} xCampo - Identificação do campo
     */
    xCampo: string;
    /**
     * @param {string} xTexto - Conteúdo do campo
     */
    xTexto: string;
};

/**
 * [total] 
 * Grupo Totais da NF-e	
 * GRUPO W
 */
export type Total = {
    /**
     * @param {ICMSTot} ICMSTot - Grupo Totais referentes ao ICMS
     * O grupo de valores totais da NF-e deve ser informado com o somatório do campo correspondente dos itens.
     */
    ICMSTot: ICMSTot;
    /**
     * @param {ISSQNtot} ISSQNtot - Grupo Totais referentes ao ISSQN	
     */
    ISSQNtot?: ISSQNtot;
    /**
     * @param {RetTrib} retTrib - Grupo Totais referentes ao ISSQN	
     */
    retTrib?: RetTrib;
}
export type ICMSTot = {
    /**
     * @param {string} vBC - Base de Cálculo do ICMS
     * 
     */
    vBC: string;
    /**
     * @param {string} vICMS - Valor Total do ICMS
     * 
     */
    vICMS: string;
    /**
     * @param {string} vICMSDeson - Valor Total do ICMS desonerado
     * 
     */
    vICMSDeson: string;
    /**
     * @param {string} vFCPUFDest - Valor total do ICMS relativo Fundo de Combate à Pobreza (FCP) da UF de destino  Observação: Valor total do ICMS relativo ao Fundo de Combate à Pobreza (FCP) para a UF de destino. (Incluído na NT 2015/003)
     */
    vFCPUFDest?: string;
    /**
     * @param {string} vICMSUFDest - Valor total do ICMS Interestadual para a UF de destino  Observação: Valor total do ICMS Interestadual para a UF de destino, já considerando o valor do ICMS relativo ao Fundo de Combate à Pobreza naquela UF. (Incluído na NT 2015/003)
     */
    vICMSUFDest?: string;
    /**
     * @param {string} vICMSUFRemet - Valor total do ICMS Interestadual para a UF do remetente  Observação: A partir de 2019, este valor será zero. (Incluído na NT 2015/003)
     */
    vICMSUFRemet?: string;
    /**
     * @param {string} vFCP - Valor Total do FCP (Fundo de Combate à Pobreza)  Observação: Corresponde ao total da soma dos campos id: N17c (Incluído na NT 2016/002)
     */
    vFCP: string;
    /**
     * @param {string} vBCST - Base de Cálculo do ICMS ST
     * 
     */
    vBCST: string;
    /**
     * @param {string} vST - Valor Total do ICMS ST
     */
    vST: string;
    /**
     * @param {string} vFCPST - Valor Total do FCP (Fundo de Combate à Pobreza) retido por substituição tributária  Observação: Corresponde ao total da soma dos campos id:N23d (Incluído na NT 2016/002)
     */
    vFCPST: string;
    /**
     * @param {string} vFCPSTRet - Valor Total do FCP retido anteriormente por Substituição Tributária  Observação: Corresponde ao total da soma dos campos id:N27d (Incluído na NT 2016/002)
     */
    vFCPSTRet: string;
    /**
     * @param {string} qBCMono - Valor total da quantidade tributada do ICMS monofásico próprio  Observação: Correspondente ao total da soma dos campos id:N37a
     */
    qBCMono?: string;
    /**
     * @param {string} vICMSMono - Valor total do ICMS monofásico próprio  Observação: Correspondente ao total da soma dos campos id:N39
     */
    vICMSMono?: string;
    /**
     * @param {string} qBCMonoReten - Valor total da quantidade tributada do ICMS monofásico sujeito a retenção  Observação: Correspondente ao total da soma dos campos id:N39a
     */
    qBCMonoReten?: string;
    /**
     * @param {string} vICMSMonoReten - Valor total do ICMS monofásico retido anteriormente  Observação: Correspondente ao total da soma dos campos id:N41 (NT 2021.001)
     */
    vICMSMonoReten?: string;
    /**
     * @param {string} qBCMonoRet - Valor total da quantidade tributada do ICMS monofásico retido anteriormente  Observação: Correspondente ao total da soma dos campos id:N43a
     */
    qBCMonoRet?: string;
    /**
     * @param {string} vICMSMonoRet - Valor total do ICMS monofásico retido anteriormente  Observação: Correspondente ao total da soma dos campos id:N45
     */
    vICMSMonoRet?: string;
    /**
     * @param {string} vProd - Valor Total dos produtos e serviços
     * 
     */
    vProd: string;
    /**
     * @param {string} vFrete - Valor Total do Frete
     * 
     */
    vFrete: string;
    /**
     * @param {string} vSeg - Valor Total do Seguro
     * 
     */
    vSeg: string;
    /**
     * @param {string} vDesc - Valor Total do Desconto
     * 
     */
    vDesc: string;
    /**
     * @param {string} vII - Valor Total do II
     * 
     */
    vII: string;
    /**
     * @param {string} vIPI - Valor Total do IPI
     * 
     */
    vIPI: string;
    /**
     * @param {string} vIPIDevol - Valor Total do IPI devolvido  Observação: Deve ser informado quando preenchido o Grupo Tributos Devolvidos na emissão de nota finNFe=4 (devolução) nas operações com não contribuintes do IPI. Corresponde ao total da soma dos campos id:UA04. (Incluído na NT 2016/002)
     */
    vIPIDevol: string;
    /**
     * @param {string} vPIS - Valor do PIS
     * 
     */
    vPIS: string;
    /**
     * @param {string} vCOFINS - Valor da COFINS
     * 
     */
    vCOFINS: string;
    /**
     * @param {string} vOutro - Outras Despesas acessórias
     * 
     */
    vOutro: string;
    /**
     * @param {string} vNF - Valor Total da NF-e  Observação: Vide validação para este campo na regra de validação "W16-xx".
     */
    vNF: string;
    /**
     * @param {string} vTotTrib - Valor aproximado total de tributos federais, estaduais e municipais.
     * Observação: (NT 2013/003)
     */
    vTotTrib?: string;
}
export type ISSQNtot = {
    /**
     * @param {number} vServ - Valor total dos Serviços sob não- incidência ou não tributados pelo ICMS
     * 
     */
    vServ?: number;
    /**
     * @param {number} vBC - Valor total Base de Cálculo do ISS
     * 
     */
    vBC?: number;
    /**
     * @param {number} vISS - Valor total do ISS
     * 
     */
    vISS?: number;
    /**
     * @param {number} vPIS - Valor total do PIS sobre serviços
     * 
     */
    vPIS?: number;
    /**
     * @param {number} vCOFINS - Valor total da COFINS sobre serviços
     * 
     */
    vCOFINS?: number;
    /**
     * @param {string} dCompet - Data da prestação do serviço  Formato: “AAAA-MM-DD”
     */
    dCompet: string;
    /**
     * @param {number} vDeducao - Valor total dedução para redução da Base de Cálculo
     * 
     */
    vDeducao?: number;
    /**
     * @param {number} vOutro - Valor total outras retenções  Observação: Valor declaratório
     */
    vOutro?: number;
    /**
     * @param {number} vDescIncond - Valor total desconto incondicionado
     * 
     */
    vDescIncond?: number;
    /**
     * @param {number} vDescCond - Valor total desconto condicionado
     * 
     */
    vDescCond?: number;
    /**
     * @param {number} vISSRet - Valor total retenção ISS
     * 
     */
    vISSRet?: number;
    /**
     * @param {number} cRegTrib - Código do Regime Especial de Tributação  1=Microempresa Municipal
     * 2=Estimativa
     * 3=Sociedade de Profissionais
     * 4=Cooperativa
     * 5=Microempresário Individual (MEI)
     * 6=Microempresário e Empresa de Pequeno Porte
     */
    cRegTrib?: 1 | 2 | 3 | 4 | 5 | 6;
}
export type RetTrib = {
    /**
     * @param {number} vRetPIS - Valor Retido de PIS  
     */
    vRetPIS?: number;
    /**
     * @param {number} vRetCOFINS - Valor Retido de COFINS  
     */
    vRetCOFINS?: number;
    /**
     * @param {number} vRetCSLL - Valor Retido de CSLL  
     */
    vRetCSLL?: number;
    /**
     * @param {number} vBCIRRF - Base de Cálculo do IRRF  
     */
    vBCIRRF?: number;
    /**
     * @param {number} vIRRF - Valor Retido do IRRF  
     */
    vIRRF?: number;
    /**
     * @param {number} vBCRetPrev - Base de Cálculo da Retenção da Previdência Social  
     */
    vBCRetPrev?: number;
    /**
     * @param {number} vRetPrev - Valor da Retenção da Previdência Social  
     */
    vRetPrev?: number;
}

/**
 * [transp] 
 * Grupo Informações do Transporte	
 * GRUPO X
 */
export type Transp = {
    /**
     * @param {number | 4 | 9} modFrete - Modalidade do frete  
     * 0=Contratação do Frete por conta do Remetente (CIF)
     * 1=Contratação do Frete por conta do Destinatário (FOB)
     * 2=Contratação do Frete por conta de Terceiros
     * 3=Transporte Próprio por conta do Remetente
     * 4=Transporte Próprio por conta do Destinatário
     * 9=Sem Ocorrência de Transporte. (Atualizado na NT 2016/002)
     */
    modFrete: number | 4 | 9;
    /**
     * @param {Transporta} transporta - Grupo Transportador  
     */
    transporta?: Transporta;
    /**
     * @param {RetTransp} retTransp - Grupo Retenção ICMS transporte  
     */
    retTransp?: RetTransp;
    /**
     * @param {veicTransp} veicTransp - Grupo Veículo Transporte  
     */
    veicTransp?: veicTransp;
    /**
     * @param {Reboque[]} reboque - Grupo Reboque
     * Informar os reboques/Dolly (v2.0)
     */
    reboque?: Reboque[] | Reboque;
    /**
     * @param {string} vagao - Identificação do vagão  
     */
    vagao?: string;
    /**
     * @param {string} balsa - Identificação da balsa  
     */
    balsa?: string;
    /**
     * @param {Vol[]} vol - Grupo Volumes  
     */
    vol?: Vol[] | Vol;
}
export type Transporta = {
    /**
     * @param {string} CNPJCPF - CNPJ/CPF do Transportador  
     */
    CNPJCPF?: string;
    /**
     * @param {string} CNPJ - CNPJ do Transportador  
     */
    CNPJ?: string;
    /**
     * @param {string} CPF - CPF do Transportador  
     */
    CPF?: string;
    /**
     * @param {string} xNome - Razão Social ou nome  
     */
    xNome?: string;
    /**
     * @param {string} IE - Inscrição Estadual do Transportador  
     */
    IE?: string;
    /**
     * @param {string} xEnder - Endereço Completo  
     */
    xEnder?: string;
    /**
     * @param {string} xMun - Nome do município  
     */
    xMun?: string;
    /**
     * @param {string} UF - Sigla da UF  
     */
    UF?: string;
}
export type RetTransp = {
    /**
     * @param {number} vServ - Valor do Serviço  
     */
    vServ: number;
    /**
     * @param {number} vBCRet - BC da Retenção do ICMS  
     */
    vBCRet: number;
    /**
     * @param {number} pICMSRet - Alíquota da Retenção  
     */
    pICMSRet: number;
    /**
     * @param {number} vICMSRet - Valor do ICMS Retido  
     */
    vICMSRet: number;
    /**
     * @param {string} CFOP - CFOP  
     */
    CFOP: string;
    /**
     * @param {string} cMunFG - Código do município de ocorrência do fato gerador do ICMS do transporte  
     */
    cMunFG: string;
}
export type veicTransp = {
    /**
     * @param {string} placa - Placa do Veículo  
     * Informar somente letras e dígitos
     */
    placa: string;
    /**
     * @param {string} UF - Sigla da UF  
     * Informar a sigla da UF do registro do veículo, pode ser omitido quando tratar-se de placa do Mercosul
     */
    UF?: string;
    /**
     * @param {string} RNTC - Registro Nacional de Transportador de Carga (ANTT)  
     */
    RNTC?: string;
}
export type Reboque = {
    /**
     * @param {string} placa - Placa do Veículo  
     * Informar somente letras e dígitos
     */
    placa: string;
    /**
     * @param {string} UF - Sigla da UF  
     * Informar a sigla da UF do registro do veículo, pode ser omitido quando tratar-se de placa do Mercosul
     */
    UF?: string;
    /**
     * @param {string} RNTC - Registro Nacional de Transportador de Carga (ANTT)  
     */
    RNTC?: string;
}
export type Vol = {
    /**
     * @param {number} qVol - Quantidade de volumes transportados  
     */
    qVol?: number;
    /**
     * @param {string} esp - Espécie dos volumes transportados  
     */
    esp?: string;
    /**
     * @param {string} marca - Marca dos volumes transportados  
     */
    marca?: string;
    /**
     * @param {string} nVol - Numeração dos volumes transportados  
     */
    nVol?: string;
    /**
     * @param {string} pesoL - Peso Líquido (em kg)  
     */
    pesoL?: string;
    /**
     * @param {string} pesoB - Peso Bruto (em kg)  
     */
    pesoB?: string;
    /**
     * @param {Lacres[]} lacres - Grupo Lacres  
     */
    lacres?: Lacres[] | Lacres;
}
export type Lacres = {
    /**
     * @param {string} nLacre - Número dos Lacres  
     */
    nLacre: string;
}

/**
 * [cobr] 
 * Grupo Cobrança	
 * GRUPO Y
 */
export type Cobr = {
    /**
     * @param {Fatura} fat - Grupo Fatura
     */
    fat?: Fatura;
    /**
     * @param {Parcela[]} dup - Grupo Parcelas
     */
    dup?: Parcela[] | Parcela;
}
export type Fatura = {
    /**
     * @param {string} nFat - Número da Fatura
     * Observação: este padrão de preenchimento será obrigatório somente a partir de 03/09/2018
     */
    nFat?: string;
    /**
     * @param {number} vOrig - Valor Original da Fatura
     */
    vOrig?: number;
    /**
     * @param {number} vDesc - Valor do desconto
     */
    vDesc?: number;
    /**
     * @param {number} vLiq - Valor Líquido da Fatura
     */
    vLiq?: number;
}
export type Parcela = {
    /**
     * @param {string} nDup - Número da Parcela
     * Observação: este padrão de preenchimento será obrigatório somente a partir de 03/09/2018
     */
    nDup?: string;
    /**
     * @param {string} dVenc - Data de vencimento
     * Formato: “AAAA-MM-DD”. Obrigatória a informação da data de vencimento na ordem crescente das datas. Ex.: “2018-06-01”,”2018-07-01”, “2018-08-01”,...
     */
    dVenc?: string;
    /**
     * @param {number} vDup - Valor da Parcela
     */
    vDup: number;
}

/**
 * [cobr] 
 * Grupo de Informações de Pagamento
 * GRUPO YA
 */
export type Pag = {
    /**
     * @param {DetPag[]} detPag - Grupo Detalhamento do Pagamento
     */
    detPag: DetPag[] | DetPag;
    /**
     * @param {string} vTroco - Valor do troco  
     * Valor do troco (Incluído na NT 2016/002)
     */
    vTroco?: string;
}
export type DetPag = {
    /**
     * @param {0 | 1} indPag - Indicador da Forma de Pagamento  
     * 0= Pagamento à Vista
     * 1= Pagamento à Prazo (Incluído na NT 2016/002)
     */
    indPag: number;
    /**
     * @param {string} tPag - Meio de pagamento  
     * Utilizar a Tabela de códigos dos meios de pagamentos publicada no Portal Nacional da Nota Fiscal Eletrônica
     * Atualizado na NT 2020.006
     */
    tPag: string;
    /**
     * @param {string} xPag - Descrição do Meio de Pagamento  
     * Descrição do meio de pagamento. Preencher informando o meio de pagamento utilizado quando o código do meio de pagamento for informado como 99-outros.
     */
    xPag?: string;
    /**
     * @param {number} vPag - Valor do Pagamento  
     */
    vPag: string;
    /**
     * @param {string} dPag - Data do Pagamento  
     * Formato: “AAAA-MM-DD”.
     */
    dPag?: string;
    /**
     * @param {string} CNPJPag - CNPJ transacional do pagamento  
     * Preencher informando o CNPJ do estabelecimento onde o pagamento foi processado/transacionado/recebido quando a emissão do documento fiscal ocorrer em estabelecimento distinto.
     */
    CNPJPag?: string;
    /**
     * @param {string} UFPag - UF do CNPJ do estabelecimento onde o pagamento foi processado/transacionado/recebido  
     * UF do CNPJ do estabelecimento onde o pagamento foi processado/transacionado/recebido.
     */
    UFPag?: string;
    /**
     * @param {Card} card - Grupo de Cartões PIX, Boletos e outros Pagamentos Eletrônicos  
     */
    card?: Card;
    /**
     * @param {string} vTroco - Valor do troco  
     * Valor do troco (Incluído na NT 2016/002)
     */
    vTroco?: string;
    /**
     * @param {string} CNPJReceb - CNPJ do beneficiário do pagamento  
     * Informar o CNPJ do estabelecimento beneficiário do pagamento
     */
    CNPJReceb?: string;
    /**
     * @param {string} idTermPag - Identificador do terminal de pagamento  
     * Identificar o terminal em que foi realizado o pagamento
     */
    idTermPag?: string;
}
export type Card = {
    /**
     * @param {string} tpIntegra - Tipo de Integração para pagamento  
     * Tipo de Integração do processo de pagamento com o sistema de automação da empresa:
     * 1=Pagamento integrado com o sistema de automação da empresa (Ex.: equipamento TEF, Comércio Eletrônico, POS Integrado)
     * 2= Pagamento não integrado com o sistema de automação da empresa (Ex.: equipamento POS Simples)
     */
    tpIntegra: '1' | '2';
    /**
     * @param {string} CNPJ - CNPJ da instituição de pagamento  
     * Informar o CNPJ da instituição de pagamento, adquirente ou subadquirente. Caso o pagamento seja processado pelo intermediador da transação, informar o CNPJ do intermediador.
     */
    CNPJ?: string;
    /**
     * @param {string} tBand - Bandeira da operadora de cartão de crédito e/ou débito  
     * Utilizar a Tabela de Códigos das Operadoras de cartão de crédito e/ou débito publicada no Portal Nacional da Nota Fiscal Eletrônica.
     */
    tBand?: string;
    /**
     * @param {string} cAut - Número de autorização da operação com cartões, PIX, boletos e outros pagamentos eletrônicos  
     * Identifica o número da autorização da transação da operação com cartões, PIX, boletos e outros pagamentos eletrônicos
     */
    cAut?: string;
}

/**
 * [infIntermed] 
 * Grupo Grupo do Intermediador da Transação	
 * GRUPO YB
 */
export type InfIntermed = {
    /**
     * @param {string} CNPJ - CNPJ do Intermediador da Transação
     * Ocor.
     * Informar o CNPJ do Intermediador da Transação (agenciador, plataforma de delivery, marketplace e similar) de serviços e de negócios.
     */
    CNPJ: string;
    /**
     * @param {string} idCadIntTran - Identificador cadastrado no intermediador
     * Ocor.
     * Nome do usuário ou identificação do perfil do vendedor no site do intermediador (agenciador, plataforma de delivery, marketplace e similar) de serviços e de negócios.
     */
    idCadIntTran: string;
}

/**
 * [infAdic] 
 * Informações Adicionais da NF-e
 * GRUPO Z
 */
export type InfAdic = {
    /**
     * @param {InfAdFisco} infAdFisco - Informações Adicionais de Interesse do Fisco
     */
    infAdFisco?: InfAdFisco;
    /**
     * @param {string} infCpl - Informações Complementares de interesse do Contribuinte
     */
    infCpl?: string;
    /**
     * @param {ObsCont[]} obsCont - Grupo Campo de uso livre do contribuinte
     */
    obsCont?: ObsCont[] | ObsCont;
    /**
     * @param {ObsFisco[]} obsFisco - Grupo Campo de uso livre do Fisco
     */
    obsFisco?: ObsFisco[] | ObsFisco;
    /**
     * @param {ProcRef[]} procRef - Grupo Processo referenciado
     */
    procRef?: ProcRef[] | ProcRef;
}
export type InfAdFisco = {
    /**
     * @param {string} infAdFisco - Informações Adicionais de Interesse do Fisco
     */
    infAdFisco: string;
}
export type ProcRef = {
    /**
     * @param {string} nProc - Identificador do processo ou ato concessório
     */
    nProc: string;
    /**
     * @param {number} indProc - Indicador da origem do processo
     */
    indProc: number;
    /**
     * @param {number} tpAto - Tipo do ato concessório
     */
    tpAto?: number;
}

/**
 * [exporta] 
 * Grupo Exportação	
 * GRUPO ZA
 */
export type Exporta = {
    /**
     * @param {string} UFSaidaPais - Sigla da UF de Embarque ou de transposição de fronteira
     */
    UFSaidaPais: string;
    /**
     * @param {string} xLocExporta - Descrição do Local de Embarque ou de transposição de fronteira
     */
    xLocExporta: string;
    /**
     * @param {string} xLocDespacho - Descrição do local de despacho
     */
    xLocDespacho?: string;
}

/**
 * [compra] 
 * Grupo Compra	
 * GRUPO ZB
 */
export type Compra = {
    /**
     * @param {string} xNEmp - Nota de Empenho
     */
    xNEmp?: string;
    /**
     * @param {string} xPed - Pedido
     */
    xPed?: string;
    /**
     * @param {string} xCont - Contrato
     */
    xCont?: string;
}

/**
 * [cana] 
 * Grupo Compra	
 * GRUPO ZC
 */
export type Cana = {
    /**
     * @param {string} safra - Identificação da safra
     */
    safra: string;
    /**
     * @param {string} ref - Mês e ano de referência
     */
    ref: string;
    /**
     * @param {forDia[]} forDia - Grupo Fornecimento diário de cana
     */
    forDia: forDia[] | forDia;
    /**
     * @param {number} qTotMes - Quantidade Total do Mês
     */
    qTotMes: number;
    /**
     * @param {number} qTotAnt - Quantidade Total Anterior
     */
    qTotAnt: number;
    /**
     * @param {number} qTotGer - Quantidade Total Geral
     */
    qTotGer: number;
    /**
     * @param {Deducao[]} deduc - Grupo Deduções – Taxas e Contribuições
     */
    deduc?: Deducao[] | Deducao;
    /**
     * @param {number} vFor - Valor dos Fornecimentos
     */
    vFor: number;
    /**
     * @param {number} vTotDed - Valor Total da Dedução
     */
    vTotDed: number;
    /**
     * @param {number} vLiqFor - Valor Líquido dos Fornecimentos
     */
    vLiqFor: number;
}
export type forDia = {
    /**
     * @param {number} dia - Dia
     */
    dia: number;
    /**
     * @param {number} qtde - Quantidade
     */
    qtde: number;
}
export type Deducao = {
    /**
     * @param {string} xDed - Descrição da Dedução
     */
    xDed: string;
    /**
     * @param {number} vDed - Valor da Dedução
     */
    vDed: number;
}

/**
 * [infRespTec] 
 * Informações do Responsável Técnico pela emissão do DF-e	
 * GRUPO ZD
 */
export type InfRespTec = {
    /**
     * @param {string} CNPJ - CNPJ da pessoa jurídica responsável pelo sistema utilizado na emissão do documento fiscal eletrônico
     */
    CNPJ: string;
    /**
     * @param {string} xContato - Nome da pessoa a ser contatada
     */
    xContato: string;
    /**
     * @param {string} email - E-mail da pessoa jurídica a ser contatada
     */
    email: string;
    /**
     * @param {string} fone - Telefone da pessoa jurídica/física a ser contatada
     */
    fone: string;
    /**
     * @param {CSRT} - Sequência XML
     */
    CSRT?: CSRT;
}
export type CSRT = {
    /**
     * @param {number} idCSRT - Identificador do CSRT
     */
    idCSRT: number;
    /**
     * @param {string} hashCSRT - Hash do CSRT
     */
    hashCSRT: string;
}

/**
 * [infSolicNFF] 
 * Informações de solicitação da NFF (NT 2021.002)	
 * GRUPO ZE
 */
export type InfSolicNFF = {
    /**
     * @param {string} xSolic - Solicitação de pedido de emissão da NFF	
     * Campos do pedido preenchidos no aplicativo móvel (app) da NFF, no formato JSON
     */
    xSolic: string;
}

/**
 * [infSolicNFF] 
 * Informações de solicitação da NFF (NT 2021.002)	
 * GRUPO ZX
 */
export type InfNFeSupl = {
    /**
     * @param {string} qrCode - Texto com o QR-Code impresso no DANFE NFC-e
     */
    qrCode: string;
    /**
     * @param {string} urlChave - Texto com a URL de consulta por chave de acesso a ser impressa no DANFE NFC-e
     */
    urlChave: string;
}

export type ProtNFe = {
    infProt: {
        tpAmb: number;
        verAplic: string;
        chNFe: string;
        dhRecbto: string;
        nProt: string;
        digVal: string;
        cStat: string;
        xMotivo: string;
    }
}

/**
 * Layout da NFe
 */
export type NFe = {
    /**
     * @param {number} idLote - Número sequencial auto incremental, de controle correspondente ao identificador único do lote enviado.
     *  A responsabilidade de gerar e controlar esse número é exclusiva do contribuinte.
     */
    idLote: number;
    /**
     * @param {number} indSinc - 0=Não / 1=Empresa solicita processamento síncrono do Lote de NF-e (sem a geração de Recibo para consulta futura);
     *  O processamento síncrono do Lote corresponde a entrega da resposta do processamento das NF-e do Lote, sem a geração de um Recibo de Lote para consulta futura.
     *  A resposta de forma síncrona pela SEFAZ Autorizadora só ocorrerá se:
     *  • a empresa solicitar e constar unicamente uma NF-e no Lote;
     *  • a SEFAZ Autorizadora implementar o processamento síncrono para a resposta do Lote de NF-e.
     */
    indSinc: number;

    /**
     * @param {LayoutNFe} NFe - Dados da NFe
     */
    NFe: LayoutNFe[] | LayoutNFe;
    /**
     * @param {ProtNFe} protNFe - Dados da aturoziação de uso da NFe
     */
    protNFe?: ProtNFe;
}


export type NFeDanfe = {
    NFe: LayoutNFe[] | LayoutNFe;
    protNFe?: ProtNFe;
} & Record<string, any>;