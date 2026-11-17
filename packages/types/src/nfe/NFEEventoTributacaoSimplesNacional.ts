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
 * Evento 412140 - Tributação do Simples Nacional (NT 2026.005, seção 5).
 *
 * O evento é gerado pela Administração Tributária (tpAutor=5) a partir das NF-e/NFC-e
 * emitidas e recebidas por optantes do Simples Nacional e por contribuintes do Regime
 * Normal com opção pendente. O emitente não envia este evento: ele chega nos retornos da
 * consulta por chave (NFE_ConsultaProtocolo) e da Distribuição DF-e (NFE_DistribuicaoDFe).
 * O cancelamento é feito pelo evento genérico 110001.
 *
 * Os tipos descrevem o `detEvento` depois da conversão de XML para JSON feita pela lib:
 * os valores chegam como string, os atributos (`versao` e `nItem`) são descartados e um
 * grupo repetido vira array quando há mais de uma ocorrência.
 *
 * Schema: e412140_v1.00.xsd (Pacote de Liberação 010h).
 * Implantação: "implementação futura", conforme o cronograma da NT.
 */

/**
 * Tipo de receita bruta do Simples Nacional referente ao cClassTrib do item:
 * 0=Não é receita bruta;
 * 1=Receita bruta - interna;
 * 2=Receita bruta - interna sem cálculo de IBS e CBS;
 * 3=Receita bruta - exportação direta;
 * 4=Receita bruta - exportação indireta;
 * 5=Receita bruta - mercado interno e exportação;
 * 9=Fornecimento incompatível com o Simples Nacional.
 */
export type TipoReceitaBrutaSN = '0' | '1' | '2' | '3' | '4' | '5' | '9';

/**
 * [gTribItemSN] - Detalhamento dos tributos por item - [P23]
 */
export type TribItemSN = {
    /**
     * @param {string} nItem - Número do item (1-990) - [P24]
     * Atributo do XML; não aparece no JSON convertido pela lib.
     */
    nItem?: string;
    /**
     * @param {string} vRBSNitem - Valor da receita bruta do Simples Nacional atribuída ao item - [P26]
     */
    vRBSNitem: string;
    /**
     * @param {TipoReceitaBrutaSN} tpRBSN - Tipo de receita bruta do Simples Nacional referente ao cClassTrib do item - [P27]
     */
    tpRBSN: TipoReceitaBrutaSN;
    /**
     * @param {string} pIBSSN - Alíquota aplicável de cálculo do IBS referente ao item - [P28]
     */
    pIBSSN?: string;
    /**
     * @param {string} vIBSSN - Valor do IBS devido pelo Simples Nacional - [P29]
     */
    vIBSSN?: string;
    /**
     * @param {string} pCBSSN - Alíquota aplicável de cálculo da CBS referente ao item - [P30]
     */
    pCBSSN?: string;
    /**
     * @param {string} vCBSSN - Valor da CBS devida pelo Simples Nacional - [P31]
     */
    vCBSSN?: string;
    /**
     * @param {string} vIBSPendSusp - Valor do IBS pendente ou suspenso referente ao item - [P32]
     */
    vIBSPendSusp?: string;
    /**
     * @param {string} vCBSPendSusp - Valor da CBS pendente ou suspensa referente ao item - [P33]
     */
    vCBSPendSusp?: string;
};

/**
 * [gTotalSN] - Totais da NF-e/NFC-e - [P34]
 */
export type TotalSN = {
    /**
     * @param {string} vRBSNtot - Valor total da receita bruta do Simples Nacional (soma dos valores atribuídos aos itens) - [P35]
     */
    vRBSNtot: string;
    /**
     * @param {string} vIBSSNtot - Valor total do IBS devido pelo Simples Nacional apurado no documento - [P36]
     */
    vIBSSNtot?: string;
    /**
     * @param {string} vIBSSNtotPendSusp - Valor total do IBS devido pelo Simples Nacional com apropriação pendente ou exigibilidade suspensa - [P37]
     */
    vIBSSNtotPendSusp?: string;
    /**
     * @param {string} vCBSSNtot - Valor total da CBS devida pelo Simples Nacional apurada no documento - [P38]
     */
    vCBSSNtot?: string;
    /**
     * @param {string} vCBSSNtotPendSusp - Valor total da CBS devida pelo Simples Nacional com apropriação pendente ou exigibilidade suspensa - [P39]
     */
    vCBSSNtotPendSusp?: string;
};

/**
 * [detEvento] do evento 412140 - Tributação do Simples Nacional - [P17]
 */
export type DetEventoTributacaoSimplesNacional = {
    /**
     * @param {string} versao - Versão do leiaute do evento - [P18]
     * Atributo do XML; não aparece no JSON convertido pela lib.
     */
    versao?: '1.00';
    /**
     * @param {string} descEvento - Descrição do evento - [P19]
     */
    descEvento: 'Tributação do Simples Nacional' | 'Tributacao do Simples Nacional';
    /**
     * @param {string} cOrgaoAutor - Código do órgão autor do evento - [P20]
     */
    cOrgaoAutor: string;
    /**
     * @param {string} tpAutor - Tipo do autor: 5=Fisco - [P21]
     */
    tpAutor: '5';
    /**
     * @param {string} verAplic - Versão do aplicativo do autor do evento - [P22]
     */
    verAplic: string;
    /**
     * @param {TribItemSN | TribItemSN[]} gTribItemSN - Detalhamento dos tributos por item (até 990 ocorrências) - [P23]
     * Objeto quando há um único item; array quando há mais de um.
     */
    gTribItemSN: TribItemSN | TribItemSN[];
    /**
     * @param {TotalSN} gTotalSN - Totais do documento - [P34]
     */
    gTotalSN: TotalSN;
};
