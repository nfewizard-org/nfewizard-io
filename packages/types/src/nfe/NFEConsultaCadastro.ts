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
 * Dados de entrada para a Consulta Cadastro de Contribuintes do ICMS
 * (webservice `CadConsultaCadastro4` da SEFAZ).
 *
 * Deve ser informado exatamente um dos campos `cnpj`, `cpf` ou `ie`.
 */
export type ConsultaCadastroData = {
    /** Sigla da UF a ser consultada (ex.: 'SP'). Utiliza a UF configurada no `dfe.UF` quando omitida. */
    uf?: string;
    /** CNPJ do contribuinte a ser consultado. */
    cnpj?: string;
    /** CPF do contribuinte a ser consultado. */
    cpf?: string;
    /** Inscrição Estadual do contribuinte a ser consultado. */
    ie?: string;
}

/** Endereço do contribuinte retornado pela Consulta Cadastro. */
export type ConsultaCadastroEndereco = {
    xLgr?: string;
    nro?: string;
    xCpl?: string;
    xBairro?: string;
    cMun?: string;
    xMun?: string;
    CEP?: string;
}

/** Informações cadastrais de um contribuinte retornadas pela Consulta Cadastro. */
export type ConsultaCadastroInfCad = {
    IE: string;
    CNPJ?: string;
    CPF?: string;
    UF: string;
    cSit: string;
    indCredNFe: string;
    indCredCTe: string;
    xNome: string;
    xFant?: string;
    xRegApur?: string;
    CNAE?: string;
    dIniAtiv?: string;
    dUltSit?: string;
    dBaixa?: string;
    IEUnica?: string;
    IEAtual?: string;
    ender?: ConsultaCadastroEndereco;
}

/** Retorno da Consulta Cadastro de Contribuintes do ICMS. */
export type ConsultaCadastroResponse = {
    verAplic: string;
    cStat: string;
    xMotivo: string;
    UF: string;
    CNPJ?: string;
    CPF?: string;
    IE?: string;
    dhCons: string;
    cUF: string;
    infCad?: ConsultaCadastroInfCad | ConsultaCadastroInfCad[];
}
