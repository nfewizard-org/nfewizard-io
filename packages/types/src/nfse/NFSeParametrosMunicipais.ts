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
 * Consulta de alíquota
 */
export type NFSeConsultaAliquota = {
    codigoMunicipio: number;
    codigoServico: string;
    competencia: string; // ISO date-time format
};

/**
 * Consulta de histórico de alíquotas
 */
export type NFSeConsultaHistoricoAliquotas = {
    codigoMunicipio: number;
    codigoServico: string;
};

/**
 * Consulta de benefício municipal
 */
export type NFSeConsultaBeneficio = {
    codigoMunicipio: number;
    numeroBeneficio: string;
    competencia: string; // ISO date-time format
};

/**
 * Consulta de convênio municipal
 */
export type NFSeConsultaConvenio = {
    codigoMunicipio: number;
};

/**
 * Consulta de regimes especiais
 */
export type NFSeConsultaRegimesEspeciais = {
    codigoMunicipio: number;
    codigoServico: string;
    competencia: string; // ISO date-time format
};

/**
 * Alteração de parâmetros de benefícios municipais
 */
export type NFSeAlteracaoBeneficioMunicipal = {
    codigoMunicipio: number;
    idManut: string;
    tipoAmbiente: 1 | 2;
    paramXmlGZipB64: string; // PARAM compactado em GZip e codificado em Base64
};

/**
 * Alteração de parâmetros de retenções municipais
 */
export type NFSeAlteracaoRetencoes = {
    codigoMunicipio: number;
    idManut: string;
    tipoAmbiente: 1 | 2;
    paramXmlGZipB64: string; // PARAM compactado em GZip e codificado em Base64
};

/**
 * Alíquota
 */
export type Aliquota = {
    Incidencia?: string;
    Aliq?: number;
    DtIni: string;
    DtFim?: string;
};

/**
 * Resultado da consulta de alíquotas
 */
export type NFSeConsultaAliquotaResponse = {
    mensagem?: string;
    aliquotas?: Record<string, Aliquota[]>;
};

/**
 * Benefício
 */
export type Beneficio = {
    codigoBeneficio?: string;
    descricao?: string;
    dataInicioVigencia: string;
    dataFimVigencia?: string;
    tipoBeneficio?: 1 | 2 | 3 | 4;
    tipoReducaoBC?: 1 | 2;
    reducaoPercentualBC?: number;
    aliquotaDiferenciada?: number;
    restritoAoMunicipio?: boolean;
    servicos?: BeneficioServico[];
    contribuintes?: BeneficioInscricao[];
};

/**
 * Serviço de benefício
 */
export type BeneficioServico = {
    codigoServico?: string;
    dataInicioVigencia: string;
    dataFimVigencia?: string;
};

/**
 * Inscrição de benefício
 */
export type BeneficioInscricao = {
    tipoInscricao: 0 | 1 | 2 | 3 | 4;
    inscricao?: string;
    dataInicioVigencia: string;
    dataFimVigencia?: string;
};

/**
 * Resultado da consulta de benefício
 */
export type NFSeConsultaBeneficioResponse = {
    mensagem?: string;
    beneficio?: Beneficio;
};

/**
 * Parâmetros de configuração de convênio
 */
export type ParametrosConfiguracaoConvenio = {
    tipoConvenioDeserializationSetter?: 1 | 2;
    aderenteAmbienteNacional?: 0 | 1 | -1;
    aderenteEmissorNacional?: 0 | 1 | -1;
    situacaoEmissaoPadraoContribuintesRFB?: string;
    aderenteMAN?: 0 | 1 | -1;
    permiteAproveitametoDeCreditos?: boolean;
};

/**
 * Resultado da consulta de convênio
 */
export type NFSeConsultaConvenioResponse = {
    mensagem?: string;
    parametrosConvenio?: ParametrosConfiguracaoConvenio;
};

/**
 * Regime especial
 */
export type RegimeEspecial = {
    situacao?: 1 | 2 | 3;
    dataInicio: string;
    dataFim?: string;
    observacoes?: string;
};

/**
 * Resultado da consulta de regimes especiais
 */
export type NFSeConsultaRegimesEspeciaisResponse = {
    mensagem?: string;
    regimesEspeciais?: Record<string, Record<string, RegimeEspecial[]>>;
};

/**
 * Resposta genérica de alteração
 */
export type NFSeAlteracaoResponse = {
    sucesso: boolean;
    mensagem?: string;
};
