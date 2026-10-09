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
 * Campos comuns a todos os eventos do CT-e (`eventoCTe/infEvento`).
 *
 * Diferente da NF-e, o CT-e registra **um evento por chamada** (sem `idLote`/`envEvento`).
 * Quando `evento` é um array, cada item é transmitido em uma chamada separada e sequencial.
 */
interface EventoCTeBase {
    /**
     * @param {number} cOrgao - Código IBGE do órgão de recepção do evento. Se omitido, usa a UF da chave de acesso.
     */
    cOrgao?: number;
    /**
     * @param {string} CNPJ - CNPJ do autor do evento. Se CNPJ e CPF forem omitidos, usa o CNPJ do emitente da chave de acesso.
     */
    CNPJ?: string;
    /**
     * @param {string} CPF - CPF do autor do evento
     */
    CPF?: string;
    /**
     * @param {string} chCTe - Chave de acesso (44 dígitos) do CT-e vinculado ao evento
     */
    chCTe: string;
    /**
     * @param {string} dhEvento - Data/hora do evento (AAAA-MM-DDThh:mm:ssTZD). Se omitido, usa o horário atual.
     */
    dhEvento?: string;
    /**
     * @param {number} nSeqEvento - Sequencial do evento para o mesmo tipo (1-999). Padrão: 1.
     */
    nSeqEvento?: number;
    /**
     * @param {string} versaoEvento - Versão do leiaute específico do evento. Padrão: "4.00".
     */
    versaoEvento?: string;
}

/** Cancelamento (110111) — CT-e 57, CT-e OS 67 e GTV-e 64. */
export interface EventoCancelamentoCTe extends EventoCTeBase {
    tpEvento: '110111';
    detEvento: {
        /** "Cancelamento" */
        descEvento: string;
        /** Número do protocolo de autorização do CT-e a ser cancelado */
        nProt: string;
        /** Justificativa do cancelamento */
        xJust: string;
    };
}

/** Item de correção da Carta de Correção Eletrônica (CC-e). */
export interface InfCorrecaoCTe {
    /** Grupo do campo alterado (ex.: "ide") */
    grupoAlterado: string;
    /** Nome do campo modificado (ex.: "natOp") */
    campoAlterado: string;
    /** Novo valor do campo */
    valorAlterado: string;
    /** Índice (iniciando em 1) do item alterado, quando o campo pertence a uma lista */
    nroItemAlterado?: number;
}

/** Carta de Correção Eletrônica (110110) — CT-e 57 e CT-e OS 67. */
export interface EventoCartaDeCorrecaoCTe extends EventoCTeBase {
    tpEvento: '110110';
    detEvento: {
        /** "Carta de Correção" ou "Carta de Correcao" */
        descEvento: string;
        infCorrecao: InfCorrecaoCTe | InfCorrecaoCTe[];
        /** Condições de uso (Art. 58-B do Convênio SINIEF 06/89). Se omitido, a lib preenche o texto oficial com acentuação. */
        xCondUso?: string;
    };
}

/**
 * EPEC — Evento Prévio de Emissão em Contingência (110113), somente CT-e 57.
 * Enviado à SVC (não exige CT-e autorizado). A chave `chCTe` deve ter tpEmis=4 e o CT-e correspondente
 * precisa ser transmitido ao autorizador normal em até 7 dias (168h).
 */
export interface EventoEpecCTe extends EventoCTeBase {
    tpEvento: '110113';
    detEvento: {
        /** "EPEC" */
        descEvento: string;
        /** Justificativa da entrada em contingência (15-255) */
        xJust: string;
        /** Valor do ICMS (vICMS, vICMSRet ou vICMSOutraUF) */
        vICMS: number | string;
        vICMSST?: number | string;
        vTPrest: number | string;
        vCarga: number | string;
        toma4: {
            /** 0-Remetente; 1-Expedidor; 2-Recebedor; 3-Destinatário; 4-Outro */
            toma: number | string;
            UF: string;
            CNPJ?: string;
            CPF?: string;
            IE?: string;
        };
        /** 01-Rodoviário; 02-Aéreo; 03-Aquaviário; 04-Ferroviário; 05-Dutoviário; 06-Multimodal */
        modal: string;
        UFIni: string;
        UFFim: string;
        /** Obrigatoriamente 0 (CT-e Normal) */
        tpCTe: number | string;
        dhEmi: string;
    };
}

/** Registro do Multimodal (110160) — CT-e 57 multimodal. */
export interface EventoRegistroMultimodalCTe extends EventoCTeBase {
    tpEvento: '110160';
    detEvento: {
        /** "Registro Multimodal" */
        descEvento: string;
        /** Informações sobre o tipo de documento utilizado e ressalvas (Lei 9.611/98), 15-1000 caracteres */
        xRegistro: string;
        /** Número do documento lançado no CT-e multimodal */
        nDoc?: string;
    };
}

/**
 * Prestação do Serviço em Desacordo (610110) — autor é o **tomador**: informe CNPJ ou CPF do tomador.
 * Prazo: 45 dias da autorização.
 */
export interface EventoPrestacaoDesacordoCTe extends EventoCTeBase {
    tpEvento: '610110';
    detEvento: {
        /** "Prestação do Serviço em Desacordo" ou "Prestacao do Servico em Desacordo" */
        descEvento: string;
        /** Indicador de prestação do serviço em desacordo (1) */
        indDesacordoOper: string;
        xObs?: string;
    };
}

/** Cancelamento do evento Prestação em Desacordo (610111) — autor é o tomador. */
export interface EventoCancelamentoPrestacaoDesacordoCTe extends EventoCTeBase {
    tpEvento: '610111';
    detEvento: {
        descEvento: string;
        /** Protocolo do evento de desacordo a cancelar */
        nProtEvPrestDes: string;
    };
}

export interface InfEntregaCTe {
    /** Chave de acesso da NF-e entregue */
    chNFe: string;
}

/** Comprovante de Entrega (110180) — CT-e 57. */
export interface EventoComprovanteEntregaCTe extends EventoCTeBase {
    tpEvento: '110180';
    detEvento: {
        /** "Comprovante de Entrega do CTe" */
        descEvento: string;
        nProt: string;
        dhEntrega: string;
        /** Documento de identificação de quem recebeu (2-20) */
        nDoc: string;
        /** Nome de quem recebeu (2-60) */
        xNome: string;
        latitude?: number | string;
        longitude?: number | string;
        /** Hash SHA1 (Base64) de: chave de acesso + Base64 da imagem capturada da entrega */
        hashEntrega: string;
        dhHashEntrega: string;
        /** Informar apenas para CT-e de serviço Normal (até 2000 NF-e) */
        infEntrega?: InfEntregaCTe | InfEntregaCTe[];
    };
}

/** Cancelamento do Comprovante de Entrega (110181). */
export interface EventoCancelamentoComprovanteEntregaCTe extends EventoCTeBase {
    tpEvento: '110181';
    detEvento: {
        /** "Cancelamento do Comprovante de Entrega do CTe" */
        descEvento: string;
        nProt: string;
        /** Protocolo do evento de comprovante de entrega a cancelar */
        nProtCE: string;
    };
}

/** Insucesso na Entrega (110190) — CT-e 57, leiaute 4.00. */
export interface EventoInsucessoEntregaCTe extends EventoCTeBase {
    tpEvento: '110190';
    detEvento: {
        /** "Insucesso na Entrega do CT-e" */
        descEvento: string;
        nProt: string;
        dhTentativaEntrega: string;
        nTentativa?: number;
        /** 1-Recebedor não encontrado; 2-Recusa do recebedor; 3-Endereço inexistente; 4-Outros (exige xJustMotivo) */
        tpMotivo: 1 | 2 | 3 | 4;
        /** Obrigatório (25-250 caracteres) quando tpMotivo=4 */
        xJustMotivo?: string;
        latitude?: number | string;
        longitude?: number | string;
        hashTentativaEntrega: string;
        dhHashTentativaEntrega: string;
        infEntrega?: InfEntregaCTe | InfEntregaCTe[];
    };
}

/** Cancelamento do Insucesso na Entrega (110191). */
export interface EventoCancelamentoInsucessoEntregaCTe extends EventoCTeBase {
    tpEvento: '110191';
    detEvento: {
        /** "Cancelamento do Insucesso de Entrega do CT-e" */
        descEvento: string;
        nProt: string;
        /** Protocolo do evento de insucesso a cancelar */
        nProtIE: string;
    };
}

export interface PagamentoVinculadoCTe {
    /** Numerador único de cada pagamento (1-999) */
    nPag: number;
    /** Identificador da transação financeira (2-35) */
    idTransacao: string;
    /** Código do meio de pagamento (IT DFe 2026.001) */
    tpMeioPgto: string;
    /** CNPJ completo do recebedor do pagamento */
    CNPJReceb: string;
    /** CNPJ-base (8) da instituição financeira/de pagamento do recebedor */
    CNPJBasePSP: string;
}

/** Vinculação de Pagamento (110300) — NT 2026.001. */
export interface EventoVinculacaoPagamentoCTe extends EventoCTeBase {
    tpEvento: '110300';
    detEvento: {
        /** "Vinculação Pagamento" */
        descEvento: string;
        nProt: string;
        pgto: PagamentoVinculadoCTe | PagamentoVinculadoCTe[];
    };
}

/** Cancelamento da Vinculação de Pagamento (110301). */
export interface EventoCancelamentoVinculacaoPagamentoCTe extends EventoCTeBase {
    tpEvento: '110301';
    detEvento: {
        /** "Cancelamento da Vinculação do Pagamento" */
        descEvento: string;
        nProt: string;
        nProtVincPgto: string;
    };
}

export type TipoEventoCTe =
    | EventoEpecCTe
    | EventoCancelamentoCTe
    | EventoCartaDeCorrecaoCTe
    | EventoRegistroMultimodalCTe
    | EventoPrestacaoDesacordoCTe
    | EventoCancelamentoPrestacaoDesacordoCTe
    | EventoComprovanteEntregaCTe
    | EventoCancelamentoComprovanteEntregaCTe
    | EventoInsucessoEntregaCTe
    | EventoCancelamentoInsucessoEntregaCTe
    | EventoVinculacaoPagamentoCTe
    | EventoCancelamentoVinculacaoPagamentoCTe;

export interface EventoCTe {
    evento: TipoEventoCTe | TipoEventoCTe[];
}

export interface CancelamentoCTe {
    evento: EventoCancelamentoCTe | EventoCancelamentoCTe[];
}

export interface CartaDeCorrecaoCTe {
    evento: EventoCartaDeCorrecaoCTe | EventoCartaDeCorrecaoCTe[];
}

export interface EpecCTe { evento: EventoEpecCTe | EventoEpecCTe[]; }
export interface RegistroMultimodalCTe { evento: EventoRegistroMultimodalCTe | EventoRegistroMultimodalCTe[]; }
export interface PrestacaoDesacordoCTe { evento: EventoPrestacaoDesacordoCTe | EventoPrestacaoDesacordoCTe[]; }
export interface CancelamentoPrestacaoDesacordoCTe { evento: EventoCancelamentoPrestacaoDesacordoCTe | EventoCancelamentoPrestacaoDesacordoCTe[]; }
export interface ComprovanteEntregaCTe { evento: EventoComprovanteEntregaCTe | EventoComprovanteEntregaCTe[]; }
export interface CancelamentoComprovanteEntregaCTe { evento: EventoCancelamentoComprovanteEntregaCTe | EventoCancelamentoComprovanteEntregaCTe[]; }
export interface InsucessoEntregaCTe { evento: EventoInsucessoEntregaCTe | EventoInsucessoEntregaCTe[]; }
export interface CancelamentoInsucessoEntregaCTe { evento: EventoCancelamentoInsucessoEntregaCTe | EventoCancelamentoInsucessoEntregaCTe[]; }
export interface VinculacaoPagamentoCTe { evento: EventoVinculacaoPagamentoCTe | EventoVinculacaoPagamentoCTe[]; }
export interface CancelamentoVinculacaoPagamentoCTe { evento: EventoCancelamentoVinculacaoPagamentoCTe | EventoCancelamentoVinculacaoPagamentoCTe[]; }

/** Resultado do registro de um evento. */
export interface CTeEventoResultadoItem {
    chCTe?: string;
    tpEvento?: string;
    cStat?: number | string;
    xMotivo?: string;
    nProt?: string;
    response: any;
}

export interface CTeEventoResultado {
    success: boolean;
    xMotivos: Array<{ chCTe?: string; tpEvento?: string; cStat?: number | string; xMotivo?: string }>;
    response: CTeEventoResultadoItem[];
}
