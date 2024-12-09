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

export type TipoEvento = EventoCienciaDaOperacao | EventoCartaDeCorrecao | EventoCancelamento | EventoConfirmacaoDaOperacao | EventoEPEC | EventoOperacaoNaoRealizada | EventoDesconhecimentoDaOperacao

export interface EventoNFe {
    /**
     * @param {number} idLote - dentificador de controle do Lote de envio do Evento. Número sequencial único para identificação do Lote, de uso exclusivo do autor do evento. O Web Service não faz qualquer uso deste identificador.
     */
    idLote: number;
    /**
     * @param {'55' | '65'} modelo - Modelo do documento a ser cancelado (informar apenas para cancelamento/epec)
     */
    modelo?: '55' | '65';
    /**
     * @param {TipoEvento} evento - Máximo de 20 eventos por lote
     */
    evento: TipoEvento[]
}

/**
 * Ciência da Operação
 */
interface EventoCienciaDaOperacao {
    /**
     * @param {number} cOrgao - Código do órgão de recepção do Evento, conforme Tabela do IBGE ou: 91=Ambiente NacionalInformar o código da UF para este evento.
     */
    cOrgao: number;
    /**
     * @param {number} tpAmb - Identificação do Ambiente: 1- Produção; 2- Homologação;
     */
    tpAmb: number;
    /**
     * @param {string} CNPJ - CNPJ do autor do evento
     */
    CNPJ?: string;
    /**
     * @param {string} CPF - CPF do autor do evento
     */
    CPF?: string;
    /**
     * @param {string} chNFe - Chave de Acesso da NF-e à qual o evento será vinculado
     */
    chNFe: string;
    /**
     * @param {string} dhEvento - Data e hora do evento no formato AAAA-MM-DD-Thh:mm:ssTZD (UTC – Universal Coordinated Time)
     */
    dhEvento: string;
    /**
     * @param {string} tpEvento - 210210 Ciência da Operação
     */
    tpEvento: '210210';
    /**
     * @param {number} nSeqEvento - Sequencial do evento para o mesmo tipo de evento. Informar o valor “1” para este evento.
     */
    nSeqEvento: number;
    /**
     * @param {string} verEvento - Versão do grupo de detalhe do evento.
     */
    verEvento: string;
    /**
     * @param {any} detEvento - Detalhes do evento. Inserir neste local o XML específico do tipo de evento (ex: cancelamento, carta correção, registro de passagem).
     */
    detEvento: {
        /**
         * @param {string} descEvento - Informar a descrição do evento:
         * Confirmacao da Operacao
         * Ciencia da Operacao
         * Desconhecimento da Operacao
         * Operacao nao Realizada
         */
        descEvento: string;
    };
}

export interface CienciaDaOperacao {
    /**
     * @param {number} idLote - dentificador de controle do Lote de envio do Evento. Número sequencial único para identificação do Lote, de uso exclusivo do autor do evento. O Web Service não faz qualquer uso deste identificador.
     */
    idLote: number;
    /**
     * @param {'55' | '65'} modelo - Modelo do documento a ser cancelado (informar apenas para cancelamento/epec)
     */
    modelo?: '55' | '65';
    /**
     * @param {EventoCienciaDaOperacao} evento - Máximo de 20 eventos por lote
     */
    evento: EventoCienciaDaOperacao[]
}

/**
 * Carta de Correção
 */
interface EventoCartaDeCorrecao {
    /**
     * @param {number} cOrgao - Código do órgão de recepção do Evento, conforme Tabela do IBGE ou: 91=Ambiente NacionalInformar o código da UF para este evento.
     */
    cOrgao: number;
    /**
     * @param {number} tpAmb - Identificação do Ambiente: 1- Produção; 2- Homologação;
     */
    tpAmb: number;
    /**
     * @param {string} CNPJ - CNPJ do autor do evento
     */
    CNPJ?: string;
    /**
     * @param {string} CPF - CPF do autor do evento
     */
    CPF?: string;
    /**
     * @param {string} chNFe - Chave de Acesso da NF-e à qual o evento será vinculado
     */
    chNFe: string;
    /**
     * @param {string} dhEvento - Data e hora do evento no formato AAAA-MM-DD-Thh:mm:ssTZD (UTC – Universal Coordinated Time)
     */
    dhEvento: string;
    /**
     * @param {string} tpEvento - 110110 Carta de Correção
     */
    tpEvento: '110110';
    /**
     * @param {number} nSeqEvento - Sequencial do evento para o mesmo tipo de evento. Informar o valor “1” para este evento.
     */
    nSeqEvento: number;
    /**
     * @param {string} verEvento - Versão do grupo de detalhe do evento.
     */
    verEvento: string;
    /**
     * @param {any} detEvento - Detalhes do evento. Inserir neste local o XML específico do tipo de evento (ex: cancelamento, carta correção, registro de passagem).
     */
    detEvento: {
        /**
         * @param {string} descEvento - “Carta de Correção” ou “Carta de Correcao”
         */
        descEvento: string;
        /**
         * @param {string} xCorrecao - Correção a ser considerada, texto livre. A correção mais recente substitui as anteriores.
         */
        xCorrecao: string;
        /**
         * @param {string} xCondUso - Condições de uso da Carta de Correção, informar a literal : “A Carta de Correção é disciplinada pelo § 1º-A do art. 7º do Convênio S/N, de 15 de dezembro de 1970 e pode ser utilizada para regularização de erro ocorrido na emissão de documento fiscal, desde que o erro não esteja relacionado com: I - as variáveis que determinam o valor do imposto tais como: base de cálculo, alíquota, diferença de preço, quantidade, valor da operação ou da prestação; II - a correção de dados cadastrais que implique mudança do remetente ou do destinatário; III - a data de emissão ou de saída.” (texto com acentuação)
         * ou
         * “A Carta de Correcao e disciplinada pelo paragrafo 1o-A do art. 7o do Convenio S/N, de 15 de dezembro de 1970 e pode ser utilizada para regularizacao de erro ocorrido na emissao de documento fiscal, desde que o erro nao esteja relacionado com: I - as variaveis que determinam o valor do imposto tais como: base de calculo, aliquota, diferenca de preco, quantidade, valor da operacao ou da prestacao; II - a correcao de dados cadastrais que implique mudanca do remetente ou do destinatario; III - a data de emissao ou de saida.” (texto sem acentuação)
         */
        xCondUso: string;
    };
}

export interface CartaDeCorrecao {
    /**
     * @param {number} idLote - dentificador de controle do Lote de envio do Evento. Número sequencial único para identificação do Lote, de uso exclusivo do autor do evento. O Web Service não faz qualquer uso deste identificador.
     */
    idLote: number;
    /**
     * @param {'55' | '65'} modelo - Modelo do documento a ser cancelado (informar apenas para cancelamento/epec)
     */
    modelo?: '55' | '65';
    /**
     * @param {EventoCartaDeCorrecao} evento - Máximo de 20 eventos por lote
     */
    evento: EventoCartaDeCorrecao[]
}

/**
 * Cancelamento
 */
interface EventoCancelamento {
    /**
     * @param {number} tpAmb - Identificação do Ambiente: 1- Produção; 2- Homologação;
     */
    tpAmb: number;
    /**
     * @param {number} cOrgao - Código do órgão de recepção do Evento, conforme Tabela do IBGE ou: 91=Ambiente NacionalInformar o código da UF para este evento.
     */
    cOrgao: number;
    /**
     * @param {string} CNPJ - CNPJ do autor do evento
     */
    CNPJ?: string;
    /**
     * @param {string} CPF - CPF do autor do evento
     */
    CPF?: string;
    /**
     * @param {string} chNFe - Chave de Acesso da NF-e à qual o evento será vinculado
     */
    chNFe: string;
    /**
     * @param {string} dhEvento - Data e hora do evento no formato AAAA-MM-DD-Thh:mm:ssTZD (UTC – Universal Coordinated Time)
     */
    dhEvento: string;
    /**
     * @param {string} tpEvento - 110111 Cancelamento - 110112 Cancelamento por substituição
     */
    tpEvento: '110111' | '“110112';
    /**
     * @param {number} nSeqEvento - Sequencial do evento para o mesmo tipo de evento. Informar o valor “1” para este evento.
     */
    nSeqEvento: number;
    /**
     * @param {string} verEvento - Versão do grupo de detalhe do evento.
     */
    verEvento: string;
    /**
     * @param {any} detEvento - Detalhes do evento. Inserir neste local o XML específico do tipo de evento (ex: cancelamento, carta correção, registro de passagem).
     */
    detEvento: {
        /**
         * @param {string} descEvento - Informar a descrição do evento: Cancelamento ou Cancelamento por substituição
         */
        descEvento: string;
        /**
         * @param {number} cOrgaoAutor - Código do Órgão Autor do Evento. Informar o Código da UF para este Evento.
         * Nota: Campo exclusivo do Evento “110112 – Cancelamento por substituição”.
         */
        cOrgaoAutor?: number;
        /**
         * @param {number} tpAutor - Informar 1=Empresa Emitente.
         * Valores: 1=Empresa Emitente, 2=Empresa destinatária; 3=Empresa; 5=Fisco; 6=RFB; 9=Outros Órgãos;
         * Nota: Campo exclusivo do Evento “110112 – Cancelamento por substituição”.
         */
        tpAutor?: number;
        /**
         * @param {string} verAplic - Versão do aplicativo do Autor do Evento.
         * Nota: Campo exclusivo do Evento “110112 – Cancelamento por substituição”.
         */
        verAplic?: string;
        /**
         * @param {string} nProt - Informar o número do Protocolo de Autorização da NFe a ser Cancelada.
         */
        nProt: string;
        /**
         * @param {string} xJust - Informar a justificativa do cancelamento
         */
        xJust: string;
        /**
         * @param {string} chNFeRef - Informa a chave de acesso da NF-e substituta da NF-e a ser cancelada.
         * Nota: Campo exclusivo do Evento “110112 – Cancelamento por substituição”.
         */
        chNFeRef?: string;
    };
}
export interface Cancelamento {
    /**
     * @param {number} idLote - dentificador de controle do Lote de envio do Evento. Número sequencial único para identificação do Lote, de uso exclusivo do autor do evento. O Web Service não faz qualquer uso deste identificador.
     */
    idLote: number;
    /**
     * @param {'55' | '65'} modelo - Modelo do documento a ser cancelado (informar apenas para cancelamento/epec)
     */
    modelo?: '55' | '65';
    /**
     * @param {EventoCancelamento} evento - Máximo de 20 eventos por lote
     */
    evento: EventoCancelamento[]
}

/**
 * Confirmação da Operação
 */
interface EventoConfirmacaoDaOperacao {
    /**
     * @param {number} tpAmb - Identificação do Ambiente: 1- Produção; 2- Homologação;
     */
    tpAmb: number;
    /**
     * @param {number} cOrgao - Código do órgão de recepção do Evento, conforme Tabela do IBGE ou: 91=Ambiente NacionalInformar o código da UF para este evento.
     */
    cOrgao: number;
    /**
     * @param {string} CNPJ - CNPJ do autor do evento
     */
    CNPJ?: string;
    /**
     * @param {string} CPF - CPF do autor do evento
     */
    CPF?: string;
    /**
     * @param {string} chNFe - Chave de Acesso da NF-e à qual o evento será vinculado
     */
    chNFe: string;
    /**
     * @param {string} dhEvento - Data e hora do evento no formato AAAA-MM-DD-Thh:mm:ssTZD (UTC – Universal Coordinated Time)
     */
    dhEvento: string;
    /**
     * @param {string} tpEvento - 210200 Confirmação da Operação
     */
    tpEvento: '210200';
    /**
     * @param {number} nSeqEvento - Sequencial do evento para o mesmo tipo de evento. Informar o valor “1” para este evento.
     */
    nSeqEvento: number;
    /**
     * @param {string} verEvento - Versão do grupo de detalhe do evento.
     */
    verEvento: string;
    /**
     * @param {any} detEvento - Detalhes do evento. Inserir neste local o XML específico do tipo de evento (ex: cancelamento, carta correção, registro de passagem).
     */
    detEvento: {
        /**
         * @param {string} descEvento - Informar a descrição do evento: Confirmacao da Operacao
         */
        descEvento: string;
    };
}
export interface ConfirmacaoDaOperacao {
    /**
     * @param {number} idLote - dentificador de controle do Lote de envio do Evento. Número sequencial único para identificação do Lote, de uso exclusivo do autor do evento. O Web Service não faz qualquer uso deste identificador.
     */
    idLote: number;
    /**
     * @param {'55' | '65'} modelo - Modelo do documento a ser cancelado (informar apenas para cancelamento/epec)
     */
    modelo?: '55' | '65';
    /**
     * @param {EventoConfirmacaoDaOperacao} evento - Máximo de 20 eventos por lote
     */
    evento: EventoConfirmacaoDaOperacao[]
}

/**
 * EPEC
 */
interface EventoEPEC {
    /**
     * @param {number} tpAmb - Identificação do Ambiente: 1- Produção; 2- Homologação;
     */
    tpAmb: number;
    /**
     * @param {number} cOrgao - Código do órgão de recepção do Evento, conforme Tabela do IBGE ou: 91=Ambiente NacionalInformar o código da UF para este evento.
     */
    cOrgao: number;
    /**
     * @param {string} CNPJ - CNPJ do autor do evento
     */
    CNPJ?: string;
    /**
     * @param {string} CPF - CPF do autor do evento
     */
    CPF?: string;
    /**
     * @param {string} chNFe - Chave de Acesso da NF-e à qual o evento será vinculado
     */
    chNFe: string;
    /**
     * @param {string} dhEvento - Data e hora do evento no formato AAAA-MM-DD-Thh:mm:ssTZD (UTC – Universal Coordinated Time)
     */
    dhEvento: string;
    /**
     * @param {string} tpEvento - 110140 EPEC
     */
    tpEvento: '110140';
    /**
     * @param {number} nSeqEvento - Sequencial do evento para o mesmo tipo de evento. Informar o valor “1” para este evento.
     */
    nSeqEvento: number;
    /**
     * @param {string} verEvento - Versão do grupo de detalhe do evento.
     */
    verEvento: string;
    /**
     * @param {any} detEvento - Detalhes do evento. Inserir neste local o XML específico do tipo de evento (ex: cancelamento, carta correção, registro de passagem).
     */
    detEvento: {
        /**
         * @param {string} descEvento - “EPEC”
         */
        descEvento: string;
        /**
         * @param {number} cOrgaoAutor - Código do Órgão do Autor do Evento.Nota: Informar o código da UF do Emitente para este evento.
         */
        cOrgaoAutor: number;
        /**
         * @param {number} tpAutor - Informar "1=Empresa Emitente/Pessoa Física" para este evento.(NT 2018.004)
         * Nota: 1=Empresa Emitente; 2=Empresa Destinatária; 3=Empresa; 5=Fisco; 6=RFB; 9=Outros Órgãos.
         */
        tpAutor: number;
        /**
         * @param {string} verAplic - Versão do aplicativo do Autor do Evento.
         */
        verAplic: string;
        /**
         * @param {string} dhEmi - Data e hora no formato UTC (Universal Coordinated Time): "AAAA-MM-DDThh:mm:ss TZD"
         */
        dhEmi: string;
        /**
         * @param {number} tpNF - 0- Entrada
         * 1- Saída
         */
        tpNF: number;
        /**
         * @param {string} IE - IE do Emitente
         */
        IE: string;
        /**
         * @param {any} dest
         */
        dest: {
            /**
             * @param {string} UF - Sigla da UF do destinatário.
             * Informar “EX” no caso de operação com o exterior.
             */
            UF: string;
            /**
             * @param {string} CNPJ - Informar o CNPJ do destinatário, preenchendo os zeros não significativos. No caso de operação com exterior, ou para comprador estrangeiro, informar a tag “idEstrangeiro”, com o número do passaporte, ou outro documento legal (campo aceita valor Nulo no caso de operação com exterior).
             */
            CNPJ?: string;
            /**
             * @param {string} CPF - Informar o CPF do destinatário, preenchendo os zeros não significativos. No caso de operação com exterior, ou para comprador estrangeiro, informar a tag “idEstrangeiro”, com o número do passaporte, ou outro documento legal (campo aceita valor Nulo no caso de operação com exterior).
             */
            CPF?: string;
            /**
             * @param {string} idEstrangeiro -  No caso de operação com exterior, ou para comprador estrangeiro, informar a tag “idEstrangeiro”, com o número do passaporte, ou outro documento legal (campo aceita valor Nulo no caso de operação com exterior).
             */
            idEstrangeiro?: string;
            /**
             * @param {string} IE - Informar a IE do destinatário somente quando o contribuinte destinatário possuir uma inscrição estadual. Omitir a tag no caso de destinatário “ISENTO”, ou destinatário não possuir IE.
             */
            IE: string;
            /**
             * @param {string} vNF - Valor total da NF-e
             */
            vNF: string;
            /**
             * @param {string} vICMS - Valor total do ICMS
             */
            vICMS: string;
            /**
             * @param {string} vST - Valor total do ICMS Substituição Tributária
             */
            vST: string;
        };
    };
}
export interface EPEC {
    /**
     * @param {number} idLote - dentificador de controle do Lote de envio do Evento. Número sequencial único para identificação do Lote, de uso exclusivo do autor do evento. O Web Service não faz qualquer uso deste identificador.
     */
    idLote: number;
    /**
     * @param {'55' | '65'} modelo - Modelo do documento a ser cancelado (informar apenas para cancelamento/epec)
     */
    modelo?: '55' | '65';
    /**
     * @param {EventoEPEC} evento - Máximo de 20 eventos por lote
     */
    evento: EventoEPEC[]
}

/**
 * Confirmação da Operação
 */
interface EventoOperacaoNaoRealizada {
    /**
     * @param {number} tpAmb - Identificação do Ambiente: 1- Produção; 2- Homologação;
     */
    tpAmb: number;
    /**
     * @param {number} cOrgao - Código do órgão de recepção do Evento, conforme Tabela do IBGE ou: 91=Ambiente NacionalInformar o código da UF para este evento.
     */
    cOrgao: number;
    /**
     * @param {string} CNPJ - CNPJ do autor do evento
     */
    CNPJ?: string;
    /**
     * @param {string} CPF - CPF do autor do evento
     */
    CPF?: string;
    /**
     * @param {string} chNFe - Chave de Acesso da NF-e à qual o evento será vinculado
     */
    chNFe: string;
    /**
     * @param {string} dhEvento - Data e hora do evento no formato AAAA-MM-DD-Thh:mm:ssTZD (UTC – Universal Coordinated Time)
     */
    dhEvento: string;
    /**
     * @param {string} tpEvento - 210240 Operacao nao Realizada
     */
    tpEvento: '210240';
    /**
     * @param {number} nSeqEvento - Sequencial do evento para o mesmo tipo de evento. Informar o valor “1” para este evento.
     */
    nSeqEvento: number;
    /**
     * @param {string} verEvento - Versão do grupo de detalhe do evento.
     */
    verEvento: string;
    /**
     * @param {any} detEvento - Detalhes do evento. Inserir neste local o XML específico do tipo de evento (ex: cancelamento, carta correção, registro de passagem).
     */
    detEvento: {
        /**
         * @param {string} descEvento - Informar a descrição do evento: Operacao nao Realizada
         */
        descEvento: string;
        /**
         * @param {string} xJust - Informar a justificativa porque a operação não foi realizada, este campo deve ser informado somente no evento de Operação não Realizada.
         */
        xJust: string;
    };
}
export interface OperacaoNaoRealizada {
    /**
     * @param {number} idLote - dentificador de controle do Lote de envio do Evento. Número sequencial único para identificação do Lote, de uso exclusivo do autor do evento. O Web Service não faz qualquer uso deste identificador.
     */
    idLote: number;
    /**
     * @param {'55' | '65'} modelo - Modelo do documento a ser cancelado (informar apenas para cancelamento/epec)
     */
    modelo?: '55' | '65';
    /**
     * @param {EventoOperacaoNaoRealizada} evento - Máximo de 20 eventos por lote
     */
    evento: EventoOperacaoNaoRealizada[]
}

/**
 * Desconhecimento da Operação
 */
interface EventoDesconhecimentoDaOperacao {
    /**
     * @param {number} cOrgao - Código do órgão de recepção do Evento, conforme Tabela do IBGE ou: 91=Ambiente NacionalInformar o código da UF para este evento.
     */
    cOrgao: number;
    /**
     * @param {number} tpAmb - Identificação do Ambiente: 1- Produção; 2- Homologação;
     */
    tpAmb: number;
    /**
     * @param {string} CNPJ - CNPJ do autor do evento
     */
    CNPJ?: string;
    /**
     * @param {string} CPF - CPF do autor do evento
     */
    CPF?: string;
    /**
     * @param {string} chNFe - Chave de Acesso da NF-e à qual o evento será vinculado
     */
    chNFe: string;
    /**
     * @param {string} dhEvento - Data e hora do evento no formato AAAA-MM-DD-Thh:mm:ssTZD (UTC – Universal Coordinated Time)
     */
    dhEvento: string;
    /**
     * @param {string} tpEvento - 210220 Desconhecimento da Operacao
     */
    tpEvento: '210220';
    /**
     * @param {number} nSeqEvento - Sequencial do evento para o mesmo tipo de evento. Informar o valor “1” para este evento.
     */
    nSeqEvento: number;
    /**
     * @param {string} verEvento - Versão do grupo de detalhe do evento.
     */
    verEvento: string;
    /**
     * @param {any} detEvento - Detalhes do evento. Inserir neste local o XML específico do tipo de evento (ex: cancelamento, carta correção, registro de passagem).
     */
    detEvento: {
        /**
         * @param {string} descEvento - Informar a descrição do evento: Desconhecimento da Operacao
         */
        descEvento: string;
    };
}

export interface DesconhecimentoDaOperacao {
    /**
     * @param {number} idLote - dentificador de controle do Lote de envio do Evento. Número sequencial único para identificação do Lote, de uso exclusivo do autor do evento. O Web Service não faz qualquer uso deste identificador.
     */
    idLote: number;
    /**
     * @param {'55' | '65'} modelo - Modelo do documento a ser cancelado (informar apenas para cancelamento/epec)
     */
    modelo?: '55' | '65';
    /**
     * @param {EventoDesconhecimentoDaOperacao} evento - Máximo de 20 eventos por lote
     */
    evento: EventoDesconhecimentoDaOperacao[]
}