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
 * Tipos do layout do CT-e utilizados na geração do DACTE
 * (Documento Auxiliar do Conhecimento de Transporte Eletrônico).
 *
 * Compatível com os leiautes 3.00 e 4.00 do CT-e. Campos que existem
 * apenas em uma das versões são opcionais.
 */

export interface LayoutCTe {
    /**
     * @param {string} versao - Versão do leiaute do CT-e (ex.: "4.00")
     */
    versao?: string;
    /**
     * @param {InfCte} infCte - Informações do CT-e
     */
    infCte: InfCte;
    /**
     * @param {InfCTeSupl} infCTeSupl - Informações suplementares (QR Code)
     */
    infCTeSupl?: InfCTeSupl;
}

export type InfCte = {
    /**
     * @param {string} Id - Identificador da tag a ser assinada ("CTe" + chave de acesso)
     */
    Id?: string;
    /**
     * @param {string} versao - Versão do leiaute do CT-e
     */
    versao?: string;
    /**
     * @param {IdeCTe} ide - Identificação do CT-e
     */
    ide: IdeCTe;
    /**
     * @param {ComplCTe} compl - Dados complementares do CT-e para fins operacionais ou comerciais
     */
    compl?: ComplCTe;
    /**
     * @param {EmitCTe} emit - Identificação do emitente do CT-e
     */
    emit: EmitCTe;
    /**
     * @param {RemCTe} rem - Informações do remetente das mercadorias
     */
    rem?: RemCTe;
    /**
     * @param {ExpedCTe} exped - Informações do expedidor da carga
     */
    exped?: ExpedCTe;
    /**
     * @param {RecebCTe} receb - Informações do recebedor da carga
     */
    receb?: RecebCTe;
    /**
     * @param {DestCTe} dest - Informações do destinatário do CT-e
     */
    dest?: DestCTe;
    /**
     * @param {VPrest} vPrest - Valores da prestação de serviço
     */
    vPrest?: VPrest;
    /**
     * @param {ImpCTe} imp - Informações relativas aos impostos
     */
    imp?: ImpCTe;
    /**
     * @param {InfCTeNorm} infCTeNorm - Grupo de informações do CT-e normal e substituto
     */
    infCTeNorm?: InfCTeNorm;
    /**
     * @param {AutXmlCTe | AutXmlCTe[]} autXML - Autorizados para download do XML do DF-e
     */
    autXML?: AutXmlCTe | AutXmlCTe[];
};

export type IdeCTe = {
    /**
     * @param {number | string} cUF - Código da UF do emitente do CT-e
     */
    cUF?: number | string;
    /**
     * @param {string} cCT - Código numérico que compõe a chave de acesso
     */
    cCT?: string;
    /**
     * @param {number | string} CFOP - Código Fiscal de Operações e Prestações
     */
    CFOP: number | string;
    /**
     * @param {string} natOp - Natureza da operação
     */
    natOp: string;
    /**
     * @param {number | string} mod - Modelo do documento fiscal (57=CT-e; 67=CT-e OS)
     */
    mod?: number | string;
    /**
     * @param {number | string} serie - Série do CT-e
     */
    serie: number | string;
    /**
     * @param {number | string} nCT - Número do CT-e
     */
    nCT: number | string;
    /**
     * @param {string} dhEmi - Data e hora de emissão do CT-e (UTC)
     */
    dhEmi: string;
    /**
     * @param {number | string} tpImp - Formato de impressão do DACTE (1=Retrato; 2=Paisagem)
     */
    tpImp?: number | string;
    /**
     * @param {number | string} tpEmis - Forma de emissão do CT-e
     */
    tpEmis?: number | string;
    /**
     * @param {number | string} cDV - Dígito verificador da chave de acesso
     */
    cDV?: number | string;
    /**
     * @param {number | string} tpAmb - Identificação do ambiente (1=Produção; 2=Homologação)
     */
    tpAmb: number | string;
    /**
     * @param {number | string} tpCTe - Tipo do CT-e
     * 0=CT-e Normal; 1=CT-e de Complemento de Valores; 2=CT-e de Anulação; 3=CT-e Substituto
     */
    tpCTe: number | string;
    /**
     * @param {number | string} procEmi - Identificador do processo de emissão do CT-e
     */
    procEmi?: number | string;
    /**
     * @param {string} verProc - Versão do processo de emissão
     */
    verProc?: string;
    /**
     * @param {number | string} indGlobalizado - Indicador de CT-e Globalizado
     */
    indGlobalizado?: number | string;
    /**
     * @param {number | string} cMunEnv - Código do município de envio do CT-e (IBGE)
     */
    cMunEnv?: number | string;
    /**
     * @param {string} xMunEnv - Nome do município de envio do CT-e
     */
    xMunEnv?: string;
    /**
     * @param {string} UFEnv - Sigla da UF de envio do CT-e
     */
    UFEnv?: string;
    /**
     * @param {number | string} modal - Modal
     * 01=Rodoviário; 02=Aéreo; 03=Aquaviário; 04=Ferroviário; 05=Dutoviário; 06=Multimodal
     */
    modal: number | string;
    /**
     * @param {number | string} tpServ - Tipo do serviço
     * 0=Normal; 1=Subcontratação; 2=Redespacho; 3=Redespacho Intermediário; 4=Serviço Vinculado a Multimodal
     */
    tpServ: number | string;
    /**
     * @param {number | string} cMunIni - Código do município de início da prestação (IBGE)
     */
    cMunIni?: number | string;
    /**
     * @param {string} xMunIni - Nome do município de início da prestação
     */
    xMunIni: string;
    /**
     * @param {string} UFIni - UF do início da prestação
     */
    UFIni: string;
    /**
     * @param {number | string} cMunFim - Código do município de término da prestação (IBGE)
     */
    cMunFim?: number | string;
    /**
     * @param {string} xMunFim - Nome do município de término da prestação
     */
    xMunFim: string;
    /**
     * @param {string} UFFim - UF do término da prestação
     */
    UFFim: string;
    /**
     * @param {number | string} retira - Indica se o recebedor retira no aeroporto, filial, porto ou estação
     */
    retira?: number | string;
    /**
     * @param {string} xDetRetira - Detalhes do retira
     */
    xDetRetira?: string;
    /**
     * @param {number | string} indIEToma - Indicador da IE do tomador
     */
    indIEToma?: number | string;
    /**
     * @param {Toma3} toma3 - Tomador é um dos participantes do CT-e (leiaute 4.00)
     */
    toma3?: Toma3;
    /**
     * @param {Toma3} toma03 - Tomador é um dos participantes do CT-e (leiaute 3.00)
     */
    toma03?: Toma3;
    /**
     * @param {Toma4} toma4 - Tomador não é um dos participantes do CT-e
     */
    toma4?: Toma4;
    /**
     * @param {string} dhCont - Data e hora da entrada em contingência
     */
    dhCont?: string;
    /**
     * @param {string} xJust - Justificativa da entrada em contingência
     */
    xJust?: string;
};

export type Toma3 = {
    /**
     * @param {number | string} toma - Tomador do serviço
     * 0=Remetente; 1=Expedidor; 2=Recebedor; 3=Destinatário
     */
    toma: number | string;
};

export type Toma4 = {
    /**
     * @param {number | string} toma - Tomador do serviço (4=Outros)
     */
    toma: number | string;
    /**
     * @param {string} CNPJ - CNPJ do tomador
     */
    CNPJ?: string;
    /**
     * @param {string} CPF - CPF do tomador
     */
    CPF?: string;
    /**
     * @param {string} CNPJCPF - CNPJ ou CPF do tomador (formato interno da lib)
     */
    CNPJCPF?: string;
    /**
     * @param {string} IE - Inscrição Estadual do tomador
     */
    IE?: string;
    /**
     * @param {string} xNome - Razão social ou nome do tomador
     */
    xNome: string;
    /**
     * @param {string} xFant - Nome fantasia do tomador
     */
    xFant?: string;
    /**
     * @param {string} fone - Telefone do tomador
     */
    fone?: string;
    /**
     * @param {EnderCTe} enderToma - Endereço do tomador
     */
    enderToma?: EnderCTe;
    /**
     * @param {string} email - E-mail do tomador
     */
    email?: string;
};

export type EnderCTe = {
    /**
     * @param {string} xLgr - Logradouro
     */
    xLgr?: string;
    /**
     * @param {string | number} nro - Número
     */
    nro?: string | number;
    /**
     * @param {string} xCpl - Complemento
     */
    xCpl?: string;
    /**
     * @param {string} xBairro - Bairro
     */
    xBairro?: string;
    /**
     * @param {number | string} cMun - Código do município (IBGE)
     */
    cMun?: number | string;
    /**
     * @param {string} xMun - Nome do município
     */
    xMun?: string;
    /**
     * @param {string | number} CEP - CEP
     */
    CEP?: string | number;
    /**
     * @param {string} UF - Sigla da UF
     */
    UF?: string;
    /**
     * @param {number | string} cPais - Código do país (BACEN)
     */
    cPais?: number | string;
    /**
     * @param {string} xPais - Nome do país
     */
    xPais?: string;
};

export type EmitCTe = {
    /**
     * @param {string} CNPJ - CNPJ do emitente
     */
    CNPJ?: string;
    /**
     * @param {string} CPF - CPF do emitente
     */
    CPF?: string;
    /**
     * @param {string} CNPJCPF - CNPJ ou CPF do emitente (formato interno da lib)
     */
    CNPJCPF?: string;
    /**
     * @param {string} IE - Inscrição Estadual do emitente
     */
    IE?: string;
    /**
     * @param {string} IEST - Inscrição Estadual do substituto tributário
     */
    IEST?: string;
    /**
     * @param {string} xNome - Razão social ou nome do emitente
     */
    xNome: string;
    /**
     * @param {string} xFant - Nome fantasia do emitente
     */
    xFant?: string;
    /**
     * @param {EnderCTe} enderEmit - Endereço do emitente
     */
    enderEmit: EnderCTe;
    /**
     * @param {number | string} CRT - Código do Regime Tributário
     */
    CRT?: number | string;
};

/**
 * Estrutura comum aos participantes do CT-e (remetente, expedidor,
 * recebedor e destinatário). Cada um deles carrega o endereço em uma
 * tag própria (`enderReme`, `enderExped`, `enderReceb`, `enderDest`).
 */
type ParticipanteCTe = {
    /**
     * @param {string} CNPJ - CNPJ do participante
     */
    CNPJ?: string;
    /**
     * @param {string} CPF - CPF do participante
     */
    CPF?: string;
    /**
     * @param {string} CNPJCPF - CNPJ ou CPF do participante (formato interno da lib)
     */
    CNPJCPF?: string;
    /**
     * @param {string} IE - Inscrição Estadual do participante
     */
    IE?: string;
    /**
     * @param {string} xNome - Razão social ou nome do participante
     */
    xNome: string;
    /**
     * @param {string} xFant - Nome fantasia do participante
     */
    xFant?: string;
    /**
     * @param {string} fone - Telefone do participante
     */
    fone?: string;
    /**
     * @param {string} email - E-mail do participante
     */
    email?: string;
};

export type RemCTe = ParticipanteCTe & {
    /**
     * @param {EnderCTe} enderReme - Endereço do remetente
     */
    enderReme?: EnderCTe;
};

export type ExpedCTe = ParticipanteCTe & {
    /**
     * @param {EnderCTe} enderExped - Endereço do expedidor
     */
    enderExped?: EnderCTe;
};

export type RecebCTe = ParticipanteCTe & {
    /**
     * @param {EnderCTe} enderReceb - Endereço do recebedor
     */
    enderReceb?: EnderCTe;
};

export type DestCTe = ParticipanteCTe & {
    /**
     * @param {string} ISUF - Inscrição na SUFRAMA
     */
    ISUF?: string;
    /**
     * @param {EnderCTe} enderDest - Endereço do destinatário
     */
    enderDest?: EnderCTe;
};

export type VPrest = {
    /**
     * @param {number | string} vTPrest - Valor total da prestação do serviço
     */
    vTPrest?: number | string;
    /**
     * @param {number | string} vRec - Valor a receber
     */
    vRec?: number | string;
    /**
     * @param {CompCTe | CompCTe[]} Comp - Componentes do valor da prestação
     */
    Comp?: CompCTe | CompCTe[];
};

export type CompCTe = {
    /**
     * @param {string} xNome - Nome do componente do valor da prestação
     */
    xNome?: string;
    /**
     * @param {number | string} vComp - Valor do componente
     */
    vComp?: number | string;
};

export type ImpCTe = {
    /**
     * @param {ICMSCTe} ICMS - Informações relativas ao ICMS
     */
    ICMS?: ICMSCTe;
    /**
     * @param {number | string} vTotTrib - Valor total dos tributos
     */
    vTotTrib?: number | string;
    /**
     * @param {string} infAdFisco - Informações adicionais de interesse do Fisco
     */
    infAdFisco?: string;
    /**
     * @param {ICMSUFFimCTe} ICMSUFFim - Partilha do ICMS para a UF de término da prestação (EC 87/15)
     */
    ICMSUFFim?: ICMSUFFimCTe;
};

export type ICMSCTe = {
    /**
     * @param {ICMS00CTe} ICMS00 - Tributação normal do ICMS
     */
    ICMS00?: ICMS00CTe;
    /**
     * @param {ICMS20CTe} ICMS20 - Tributação com redução da base de cálculo
     */
    ICMS20?: ICMS20CTe;
    /**
     * @param {ICMS45CTe} ICMS45 - ICMS isento, não tributado ou diferido
     */
    ICMS45?: ICMS45CTe;
    /**
     * @param {ICMS60CTe} ICMS60 - ICMS cobrado anteriormente por substituição tributária
     */
    ICMS60?: ICMS60CTe;
    /**
     * @param {ICMS90CTe} ICMS90 - ICMS outros
     */
    ICMS90?: ICMS90CTe;
    /**
     * @param {ICMSOutraUFCTe} ICMSOutraUF - ICMS devido à UF de origem da prestação, quando diferente da UF do emitente
     */
    ICMSOutraUF?: ICMSOutraUFCTe;
    /**
     * @param {ICMSSNCTe} ICMSSN - Simples Nacional
     */
    ICMSSN?: ICMSSNCTe;
};

export type ICMS00CTe = {
    /**
     * @param {string} CST - Classificação Tributária do Serviço (00)
     */
    CST?: string;
    /**
     * @param {number | string} vBC - Valor da base de cálculo do ICMS
     */
    vBC?: number | string;
    /**
     * @param {number | string} pICMS - Alíquota do ICMS
     */
    pICMS?: number | string;
    /**
     * @param {number | string} vICMS - Valor do ICMS
     */
    vICMS?: number | string;
};

export type ICMS20CTe = {
    /**
     * @param {string} CST - Classificação Tributária do Serviço (20)
     */
    CST?: string;
    /**
     * @param {number | string} pRedBC - Percentual de redução da base de cálculo
     */
    pRedBC?: number | string;
    /**
     * @param {number | string} vBC - Valor da base de cálculo do ICMS
     */
    vBC?: number | string;
    /**
     * @param {number | string} pICMS - Alíquota do ICMS
     */
    pICMS?: number | string;
    /**
     * @param {number | string} vICMS - Valor do ICMS
     */
    vICMS?: number | string;
};

export type ICMS45CTe = {
    /**
     * @param {string} CST - Classificação Tributária do Serviço (40=Isenta; 41=Não tributada; 51=Diferimento)
     */
    CST?: string;
};

export type ICMS60CTe = {
    /**
     * @param {string} CST - Classificação Tributária do Serviço (60)
     */
    CST?: string;
    /**
     * @param {number | string} vBCSTRet - Valor da base de cálculo do ICMS ST retido
     */
    vBCSTRet?: number | string;
    /**
     * @param {number | string} vICMSSTRet - Valor do ICMS ST retido
     */
    vICMSSTRet?: number | string;
    /**
     * @param {number | string} pICMSSTRet - Alíquota do ICMS ST retido
     */
    pICMSSTRet?: number | string;
    /**
     * @param {number | string} vCred - Valor do crédito outorgado/presumido
     */
    vCred?: number | string;
};

export type ICMS90CTe = {
    /**
     * @param {string} CST - Classificação Tributária do Serviço (90)
     */
    CST?: string;
    /**
     * @param {number | string} pRedBC - Percentual de redução da base de cálculo
     */
    pRedBC?: number | string;
    /**
     * @param {number | string} vBC - Valor da base de cálculo do ICMS
     */
    vBC?: number | string;
    /**
     * @param {number | string} pICMS - Alíquota do ICMS
     */
    pICMS?: number | string;
    /**
     * @param {number | string} vICMS - Valor do ICMS
     */
    vICMS?: number | string;
    /**
     * @param {number | string} vCred - Valor do crédito outorgado/presumido
     */
    vCred?: number | string;
};

export type ICMSOutraUFCTe = {
    /**
     * @param {string} CST - Classificação Tributária do Serviço (90)
     */
    CST?: string;
    /**
     * @param {number | string} pRedBCOutraUF - Percentual de redução da BC na UF de origem
     */
    pRedBCOutraUF?: number | string;
    /**
     * @param {number | string} vBCOutraUF - Valor da BC do ICMS na UF de origem
     */
    vBCOutraUF?: number | string;
    /**
     * @param {number | string} pICMSOutraUF - Alíquota do ICMS na UF de origem
     */
    pICMSOutraUF?: number | string;
    /**
     * @param {number | string} vICMSOutraUF - Valor do ICMS na UF de origem
     */
    vICMSOutraUF?: number | string;
};

export type ICMSSNCTe = {
    /**
     * @param {string} CST - Classificação Tributária do Serviço (90)
     */
    CST?: string;
    /**
     * @param {number | string} indSN - Indica se é contribuinte do Simples Nacional (1=Sim)
     */
    indSN?: number | string;
};

export type ICMSUFFimCTe = {
    /**
     * @param {number | string} vBCUFFim - Valor da BC do ICMS na UF de término da prestação
     */
    vBCUFFim?: number | string;
    /**
     * @param {number | string} pFCPUFFim - Percentual do FCP na UF de término da prestação
     */
    pFCPUFFim?: number | string;
    /**
     * @param {number | string} pICMSUFFim - Alíquota interna na UF de término da prestação
     */
    pICMSUFFim?: number | string;
    /**
     * @param {number | string} pICMSInter - Alíquota interestadual
     */
    pICMSInter?: number | string;
    /**
     * @param {number | string} vFCPUFFim - Valor do FCP na UF de término da prestação
     */
    vFCPUFFim?: number | string;
    /**
     * @param {number | string} vICMSUFFim - Valor do ICMS devido à UF de término da prestação
     */
    vICMSUFFim?: number | string;
    /**
     * @param {number | string} vICMSUFIni - Valor do ICMS devido à UF de início da prestação
     */
    vICMSUFIni?: number | string;
};

export type ComplCTe = {
    /**
     * @param {string} xCaracAd - Característica adicional do transporte
     */
    xCaracAd?: string;
    /**
     * @param {string} xCaracSer - Característica adicional do serviço
     */
    xCaracSer?: string;
    /**
     * @param {string} xEmi - Funcionário emissor do CT-e
     */
    xEmi?: string;
    /**
     * @param {FluxoCTe} fluxo - Previsão do fluxo da carga
     */
    fluxo?: FluxoCTe;
    /**
     * @param {EntregaCTe} Entrega - Informações relativas à previsão de entrega
     */
    Entrega?: EntregaCTe;
    /**
     * @param {number | string} origCalc - Município de origem para efeito de cálculo do frete
     */
    origCalc?: number | string;
    /**
     * @param {number | string} destCalc - Município de destino para efeito de cálculo do frete
     */
    destCalc?: number | string;
    /**
     * @param {string} xObs - Observações gerais
     */
    xObs?: string;
    /**
     * @param {ObsCTe | ObsCTe[]} ObsCont - Campo de uso livre do contribuinte
     */
    ObsCont?: ObsCTe | ObsCTe[];
    /**
     * @param {ObsCTe | ObsCTe[]} ObsFisco - Campo de uso livre do Fisco
     */
    ObsFisco?: ObsCTe | ObsCTe[];
};

export type ObsCTe = {
    /**
     * @param {string} xCampo - Identificação do campo
     */
    xCampo?: string;
    /**
     * @param {string} xTexto - Conteúdo do campo
     */
    xTexto?: string;
};

export type FluxoCTe = {
    /**
     * @param {string} xOrig - Sigla ou código interno da filial/regional de origem
     */
    xOrig?: string;
    /**
     * @param {string} xDest - Sigla ou código interno da filial/regional de destino
     */
    xDest?: string;
    /**
     * @param {string} xRota - Código da rota de entrega
     */
    xRota?: string;
};

export type EntregaCTe = {
    /**
     * @param {PeriodoEntregaCTe} comData - Entrega com data definida
     */
    comData?: PeriodoEntregaCTe;
    /**
     * @param {PeriodoEntregaCTe} noPeriodo - Entrega no período definido
     */
    noPeriodo?: PeriodoEntregaCTe;
    /**
     * @param {PeriodoEntregaCTe} semData - Entrega sem data definida
     */
    semData?: PeriodoEntregaCTe;
};

export type PeriodoEntregaCTe = {
    /**
     * @param {number | string} tpPer - Tipo de período/data
     */
    tpPer?: number | string;
    /**
     * @param {string} dProg - Data programada
     */
    dProg?: string;
    /**
     * @param {string} dIni - Data inicial
     */
    dIni?: string;
    /**
     * @param {string} dFim - Data final
     */
    dFim?: string;
};

export type InfCTeNorm = {
    /**
     * @param {InfCarga} infCarga - Informações da carga do CT-e
     */
    infCarga?: InfCarga;
    /**
     * @param {InfDocCTe} infDoc - Informações dos documentos transportados
     */
    infDoc?: InfDocCTe;
    /**
     * @param {InfModal} infModal - Informações específicas do modal
     */
    infModal?: InfModal;
    /**
     * @param {CobrCTe} cobr - Dados da cobrança do CT-e
     */
    cobr?: CobrCTe;
    /**
     * @param {InfCteSubCTe} infCteSub - Informações do CT-e substituído
     */
    infCteSub?: InfCteSubCTe;
};

export type InfCteSubCTe = {
    /**
     * @param {string} chCte - Chave de acesso do CT-e substituído
     */
    chCte?: string;
    /**
     * @param {string} refCteAnu - Chave de acesso do CT-e de anulação
     */
    refCteAnu?: string;
};

export type InfCarga = {
    /**
     * @param {number | string} vCarga - Valor total da carga
     */
    vCarga?: number | string;
    /**
     * @param {string} proPred - Produto predominante
     */
    proPred?: string;
    /**
     * @param {string} xOutCat - Outras características da carga
     */
    xOutCat?: string;
    /**
     * @param {InfQ | InfQ[]} infQ - Informações de quantidades da carga
     */
    infQ?: InfQ | InfQ[];
    /**
     * @param {number | string} vCargaAverb - Valor da carga para efeito de averbação
     */
    vCargaAverb?: number | string;
};

export type InfQ = {
    /**
     * @param {number | string} cUnid - Código da unidade de medida
     * 00=M3; 01=KG; 02=TON; 03=UNIDADE; 04=LITROS; 05=MMBTU
     */
    cUnid?: number | string;
    /**
     * @param {string} tpMed - Tipo da medida (ex.: PESO BRUTO, PESO CUBADO, LITRAGEM)
     */
    tpMed?: string;
    /**
     * @param {number | string} qCarga - Quantidade
     */
    qCarga?: number | string;
};

export type InfDocCTe = {
    /**
     * @param {InfNFeCTe | InfNFeCTe[]} infNFe - NF-e informadas no CT-e
     */
    infNFe?: InfNFeCTe | InfNFeCTe[];
    /**
     * @param {InfNFCTe | InfNFCTe[]} infNF - Notas fiscais em papel informadas no CT-e
     */
    infNF?: InfNFCTe | InfNFCTe[];
    /**
     * @param {InfOutrosCTe | InfOutrosCTe[]} infOutros - Outros documentos informados no CT-e
     */
    infOutros?: InfOutrosCTe | InfOutrosCTe[];
};

export type InfNFeCTe = {
    /**
     * @param {string} chave - Chave de acesso da NF-e
     */
    chave?: string;
    /**
     * @param {string} PIN - PIN SUFRAMA
     */
    PIN?: string;
    /**
     * @param {string} dPrev - Data prevista de entrega
     */
    dPrev?: string;
};

export type InfNFCTe = {
    /**
     * @param {string} nRoma - Número do romaneio da nota fiscal
     */
    nRoma?: string;
    /**
     * @param {string} nPed - Número do pedido da nota fiscal
     */
    nPed?: string;
    /**
     * @param {number | string} mod - Modelo da nota fiscal
     */
    mod?: number | string;
    /**
     * @param {number | string} serie - Série da nota fiscal
     */
    serie?: number | string;
    /**
     * @param {number | string} nDoc - Número da nota fiscal
     */
    nDoc?: number | string;
    /**
     * @param {string} dEmi - Data de emissão da nota fiscal
     */
    dEmi?: string;
    /**
     * @param {number | string} vBC - Base de cálculo do ICMS
     */
    vBC?: number | string;
    /**
     * @param {number | string} vICMS - Valor total do ICMS
     */
    vICMS?: number | string;
    /**
     * @param {number | string} vBCST - Base de cálculo do ICMS ST
     */
    vBCST?: number | string;
    /**
     * @param {number | string} vST - Valor total do ICMS ST
     */
    vST?: number | string;
    /**
     * @param {number | string} vProd - Valor total dos produtos
     */
    vProd?: number | string;
    /**
     * @param {number | string} vNF - Valor total da nota fiscal
     */
    vNF?: number | string;
    /**
     * @param {number | string} nCFOP - CFOP predominante da nota fiscal
     */
    nCFOP?: number | string;
    /**
     * @param {number | string} nPeso - Peso total em quilogramas
     */
    nPeso?: number | string;
    /**
     * @param {string} PIN - PIN SUFRAMA
     */
    PIN?: string;
    /**
     * @param {string} dPrev - Data prevista de entrega
     */
    dPrev?: string;
};

export type InfOutrosCTe = {
    /**
     * @param {number | string} tpDoc - Tipo do documento originário
     * 00=Declaração; 10=Dutoviário; 59=CF-e SAT; 65=NFC-e; 99=Outros
     */
    tpDoc?: number | string;
    /**
     * @param {string} descOutros - Descrição do documento
     */
    descOutros?: string;
    /**
     * @param {string} nDoc - Número do documento
     */
    nDoc?: string;
    /**
     * @param {string} dEmi - Data de emissão do documento
     */
    dEmi?: string;
    /**
     * @param {number | string} vDocFisc - Valor do documento
     */
    vDocFisc?: number | string;
    /**
     * @param {string} dPrev - Data prevista de entrega
     */
    dPrev?: string;
};

export type InfModal = {
    /**
     * @param {string} versaoModal - Versão do leiaute específico do modal
     */
    versaoModal?: string;
    /**
     * @param {RodoCTe} rodo - Informações do modal rodoviário
     */
    rodo?: RodoCTe;
    /**
     * @param {AereoCTe} aereo - Informações do modal aéreo
     */
    aereo?: AereoCTe;
    /**
     * @param {AquavCTe} aquav - Informações do modal aquaviário
     */
    aquav?: AquavCTe;
    /**
     * @param {FerrovCTe} ferrov - Informações do modal ferroviário
     */
    ferrov?: FerrovCTe;
    /**
     * @param {DutoCTe} duto - Informações do modal dutoviário
     */
    duto?: DutoCTe;
    /**
     * @param {MultimodalCTe} multimodal - Informações do transporte multimodal
     */
    multimodal?: MultimodalCTe;
};

export type RodoCTe = {
    /**
     * @param {string} RNTRC - Registro Nacional de Transportadores Rodoviários de Carga
     */
    RNTRC?: string;
    /**
     * @param {OccCTe | OccCTe[]} occ - Ordens de coleta associadas
     */
    occ?: OccCTe | OccCTe[];
};

export type OccCTe = {
    /**
     * @param {number | string} serie - Série da ordem de coleta
     */
    serie?: number | string;
    /**
     * @param {number | string} nOcc - Número da ordem de coleta
     */
    nOcc?: number | string;
    /**
     * @param {string} dEmi - Data de emissão da ordem de coleta
     */
    dEmi?: string;
};

export type AereoCTe = {
    /**
     * @param {string} nMinu - Número da minuta
     */
    nMinu?: string;
    /**
     * @param {string} nOCA - Número operacional do conhecimento aéreo
     */
    nOCA?: string;
    /**
     * @param {string} dPrevAereo - Data prevista da entrega
     */
    dPrevAereo?: string;
};

export type AquavCTe = {
    /**
     * @param {number | string} vPrest - Valor da prestação base de cálculo do AFRMM
     */
    vPrest?: number | string;
    /**
     * @param {number | string} vAFRMM - Valor do AFRMM
     */
    vAFRMM?: number | string;
    /**
     * @param {string} xNavio - Identificação do navio
     */
    xNavio?: string;
    /**
     * @param {number | string} nViag - Número da viagem
     */
    nViag?: number | string;
};

export type FerrovCTe = {
    /**
     * @param {number | string} tpTraf - Tipo de tráfego
     */
    tpTraf?: number | string;
    /**
     * @param {string} fluxo - Fluxo ferroviário
     */
    fluxo?: string;
};

export type DutoCTe = {
    /**
     * @param {number | string} vTar - Valor da tarifa
     */
    vTar?: number | string;
    /**
     * @param {string} dIni - Data de início da prestação
     */
    dIni?: string;
    /**
     * @param {string} dFim - Data de fim da prestação
     */
    dFim?: string;
};

export type MultimodalCTe = {
    /**
     * @param {string} COTM - Número do Certificado do Operador de Transporte Multimodal
     */
    COTM?: string;
    /**
     * @param {number | string} indNegociavel - Indicador negociável
     */
    indNegociavel?: number | string;
};

export type CobrCTe = {
    /**
     * @param {FatCTe} fat - Dados da fatura
     */
    fat?: FatCTe;
    /**
     * @param {DupCTe | DupCTe[]} dup - Dados das duplicatas
     */
    dup?: DupCTe | DupCTe[];
};

export type FatCTe = {
    /**
     * @param {string} nFat - Número da fatura
     */
    nFat?: string;
    /**
     * @param {number | string} vOrig - Valor original da fatura
     */
    vOrig?: number | string;
    /**
     * @param {number | string} vDesc - Valor do desconto da fatura
     */
    vDesc?: number | string;
    /**
     * @param {number | string} vLiq - Valor líquido da fatura
     */
    vLiq?: number | string;
};

export type DupCTe = {
    /**
     * @param {string} nDup - Número da duplicata
     */
    nDup?: string;
    /**
     * @param {string} dVenc - Data de vencimento
     */
    dVenc?: string;
    /**
     * @param {number | string} vDup - Valor da duplicata
     */
    vDup?: number | string;
};

export type AutXmlCTe = {
    /**
     * @param {string} CNPJ - CNPJ autorizado a baixar o XML
     */
    CNPJ?: string;
    /**
     * @param {string} CPF - CPF autorizado a baixar o XML
     */
    CPF?: string;
};

export type InfCTeSupl = {
    /**
     * @param {string} qrCodCTe - Texto do QR Code do CT-e
     */
    qrCodCTe?: string;
};

export type ProtCTe = {
    /**
     * @param {string} versao - Versão do leiaute do protocolo
     */
    versao?: string;
    /**
     * @param {InfProtCTe} infProt - Dados do protocolo de autorização de uso
     */
    infProt: InfProtCTe;
};

export type InfProtCTe = {
    /**
     * @param {string} Id - Identificador do protocolo
     */
    Id?: string;
    /**
     * @param {number | string} tpAmb - Identificação do ambiente
     */
    tpAmb?: number | string;
    /**
     * @param {string} verAplic - Versão do aplicativo que processou o CT-e
     */
    verAplic?: string;
    /**
     * @param {string} chCTe - Chave de acesso do CT-e
     */
    chCTe?: string;
    /**
     * @param {string} dhRecbto - Data e hora do processamento
     */
    dhRecbto?: string;
    /**
     * @param {string} nProt - Número do protocolo de autorização de uso
     */
    nProt?: string;
    /**
     * @param {string} digVal - Digest Value do CT-e processado
     */
    digVal?: string;
    /**
     * @param {number | string} cStat - Código do status do CT-e
     */
    cStat?: number | string;
    /**
     * @param {string} xMotivo - Descrição do status do CT-e
     */
    xMotivo?: string;
};

export type CTEGerarDacteProps = {
    /**
     * @param {CTe} data - Dados do CT-e
     */
    data: {
        /**
         * @param {LayoutCTe | LayoutCTe[]} CTe - Dados do CT-e
         */
        CTe: LayoutCTe | LayoutCTe[];
        /**
         * @param {ProtCTe} protCTe - Dados da autorização de uso do CT-e
         */
        protCTe?: ProtCTe;
        /**
         * @param {boolean} forceTransmitida - Força a remoção da mensagem de "CT-e não transmitido"
         */
        forceTransmitida?: boolean;
    };
    /**
     * @param {string} chave - Chave de acesso do CT-e
     */
    chave: string;
    /**
     * @param {string} outputPath - Local onde o DACTE será gravado
     */
    outputPath: string;
};
