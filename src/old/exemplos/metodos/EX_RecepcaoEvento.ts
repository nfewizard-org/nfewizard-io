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
import NFeWizard from '@Classes/NFeWizard';
import { Cancelamento, CartaDeCorrecao, CienciaDaOperacao, ConfirmacaoDaOperacao, DesconhecimentoDaOperacao, EPEC, EventoNFe, OperacaoNaoRealizada } from 'src/old/protocols/Controllers';
import { format } from 'date-fns-tz';


const callnfeWizard = async () => {
    const nfeWizard = new NFeWizard();

    // Inicializa a Lib
    await nfeWizard.NFE_LoadEnvironment({
        config: {
            dfe: {
                baixarXMLDistribuicao: true,
                pathXMLDistribuicao: "tmp/DistribuicaoDFe",
                armazenarXMLAutorizacao: true,
                pathXMLAutorizacao: "tmp/Autorizacao",
                armazenarXMLRetorno: true,
                pathXMLRetorno: "tmp/RequestLogs",
                armazenarXMLConsulta: true,
                pathXMLConsulta: "tmp/RequestLogs",
                armazenarXMLConsultaComTagSoap: false,
                armazenarRetornoEmJSON: true,
                pathRetornoEmJSON: "tmp/DistribuicaoDFe",

                pathCertificado: "certificado.pfx",
                senhaCertificado: "123456",
                UF: "SP",
                CPFCNPJ: "99999999999999",
            },
            nfe: {
                ambiente: 2,
                versaoDF: "4.00",
            },
        }
    });

    /**
     * Método Geral
     */
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const evento: EventoNFe = {
        idLote: 1,
        evento: [
            {
                cOrgao: 91,
                tpAmb: 2,
                CNPJ: '99999999999999',
                chNFe: '99999999999999999999999999999999999999999999',
                dhEvento: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone }),
                tpEvento: '210210',
                nSeqEvento: 1,
                verEvento: '1.00',
                detEvento: {
                    descEvento: 'Ciencia da Operacao',
                }
            },
            {
                tpAmb: 2,
                cOrgao: 91,
                CNPJ: '99999999999999',
                chNFe: '99999999999999999999999999999999999999999999',
                dhEvento: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone }),
                tpEvento: '210200',
                nSeqEvento: 1,
                verEvento: '1.00',
                detEvento: {
                    descEvento: 'Confirmacao da Operacao',
                }
            },
            {
                cOrgao: 35,
                tpAmb: 2,
                CNPJ: '99999999999999',
                chNFe: '99999999999999999999999999999999999999999999',
                dhEvento: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone }),
                tpEvento: '110110',
                nSeqEvento: 1,
                verEvento: '1.00',
                detEvento: {
                    descEvento: 'Carta de Correção',
                    xCorrecao: 'Teste de homologação',
                    xCondUso: 'A Carta de Correcao e disciplinada pelo paragrafo 1o-A do art. 7o do Convenio S/N, de 15 de dezembro de 1970 e pode ser utilizada para regularizacao de erro ocorrido na emissao de documento fiscal, desde que o erro nao esteja relacionado com: I - as variaveis que determinam o valor do imposto tais como: base de calculo, aliquota, diferenca de preco, quantidade, valor da operacao ou da prestacao; II - a correcao de dados cadastrais que implique mudanca do remetente ou do destinatario; III - a data de emissao ou de saida.',
                }
            },
            {
                tpAmb: 2,
                cOrgao: 35,
                CNPJ: '99999999999999',
                chNFe: '99999999999999999999999999999999999999999999',
                dhEvento: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone }),
                tpEvento: '110111',
                nSeqEvento: 1,
                verEvento: '1.00',
                detEvento: {
                    descEvento: 'Cancelamento',
                    nProt: '999999999999999',
                    xJust: 'Cancelamento homologacao',
                }
            },
            {
                cOrgao: 91,
                tpAmb: 2,
                CNPJ: '99999999999999',
                chNFe: '99999999999999999999999999999999999999999999',
                dhEvento: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone }),
                tpEvento: '210220',
                nSeqEvento: 1,
                verEvento: '1.00',
                detEvento: {
                    descEvento: 'Desconhecimento da Operacao',
                }
            },
            {
                cOrgao: 91,
                tpAmb: 2,
                CNPJ: '99999999999999',
                chNFe: '99999999999999999999999999999999999999999999',
                dhEvento: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone }),
                tpEvento: '210240',
                nSeqEvento: 1,
                verEvento: '1.00',
                detEvento: {
                    descEvento: 'Operacao nao Realizada',
                    xJust: 'Teste Operacao nao Realizada em homologação'
                }
            },
            {
                tpAmb: 2,
                cOrgao: 91,
                CNPJ: '99999999999999',
                chNFe: '99999999999999999999999999999999999999999999',
                dhEvento: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone }),
                tpEvento: '110140',
                nSeqEvento: 1,
                verEvento: '1.00',
                detEvento: {
                    descEvento: 'EPEC',
                    cOrgaoAutor: 35,
                    tpAutor: 1,
                    verAplic: '1.00',
                    dhEmi: '2024-07-10T09:38:55-03:00',
                    tpNF: 1,
                    IE: '999999999999',
                    dest: {
                        UF: 'SP',
                        CNPJ: '99999999999999',
                        IE: '999999999999',
                        vNF: '999.99',
                        vICMS: '999.99',
                        vST: '999.99',
                    }
                }
            }

        ]
    }
    await nfeWizard.NFE_RecepcaoEvento(evento);

    /**
     * Métodos individuais
     */

    /** Ciência da Operação */
    const cienciaDaOperacao: CienciaDaOperacao = {
        idLote: 1,
        evento: [
            {
                cOrgao: 91,
                tpAmb: 2,
                CNPJ: '99999999999999',
                chNFe: '99999999999999999999999999999999999999999999',
                dhEvento: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone }),
                tpEvento: '210210',
                nSeqEvento: 1,
                verEvento: '1.00',
                detEvento: {
                    descEvento: 'Ciencia da Operacao',
                }
            }
        ]
    }
    await nfeWizard.NFE_CienciaDaOperacao(cienciaDaOperacao);

    /** Confirmação da Operação */
    const confirmacaoDaOperacao: ConfirmacaoDaOperacao = {
        idLote: 1,
        evento: [
            {
                tpAmb: 2,
                cOrgao: 91,
                CNPJ: '99999999999999',
                chNFe: '99999999999999999999999999999999999999999999',
                dhEvento: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone }),
                tpEvento: '210200',
                nSeqEvento: 1,
                verEvento: '1.00',
                detEvento: {
                    descEvento: 'Confirmacao da Operacao',
                }
            }
        ]
    }
    await nfeWizard.NFE_ConfirmacaoDaOperacao(confirmacaoDaOperacao);

    /** Carta de Correção */
    const cartaDeCorrecao: CartaDeCorrecao = {
        idLote: 1,
        evento: [
            {
                cOrgao: 35,
                tpAmb: 2,
                CNPJ: '99999999999999',
                chNFe: '99999999999999999999999999999999999999999999',
                dhEvento: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone }),
                tpEvento: '110110',
                nSeqEvento: 1,
                verEvento: '1.00',
                detEvento: {
                    descEvento: 'Carta de Correção',
                    xCorrecao: 'Teste de homologação',
                    xCondUso: 'A Carta de Correcao e disciplinada pelo paragrafo 1o-A do art. 7o do Convenio S/N, de 15 de dezembro de 1970 e pode ser utilizada para regularizacao de erro ocorrido na emissao de documento fiscal, desde que o erro nao esteja relacionado com: I - as variaveis que determinam o valor do imposto tais como: base de calculo, aliquota, diferenca de preco, quantidade, valor da operacao ou da prestacao; II - a correcao de dados cadastrais que implique mudanca do remetente ou do destinatario; III - a data de emissao ou de saida.',
                }
            }
        ]
    }
    await nfeWizard.NFE_CartaDeCorrecao(cartaDeCorrecao);

    /** Cancelamento */
    const cancelamento: Cancelamento = {
        idLote: 1,
        evento: [
            {
                tpAmb: 2,
                cOrgao: 35,
                CNPJ: '99999999999999',
                chNFe: '99999999999999999999999999999999999999999999',
                dhEvento: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone }),
                tpEvento: '110111',
                nSeqEvento: 1,
                verEvento: '1.00',
                detEvento: {
                    descEvento: 'Cancelamento',
                    nProt: '999999999999999',
                    xJust: 'Cancelamento homologacao',
                }
            }
        ]
    }
    await nfeWizard.NFE_Cancelamento(cancelamento);

    /** Desconhecimento da Operação */
    const desconhecimentoDaOperacao: DesconhecimentoDaOperacao = {
        idLote: 1,
        evento: [
            {
                cOrgao: 91,
                tpAmb: 2,
                CNPJ: '99999999999999',
                chNFe: '99999999999999999999999999999999999999999999',
                dhEvento: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone }),
                tpEvento: '210220',
                nSeqEvento: 1,
                verEvento: '1.00',
                detEvento: {
                    descEvento: 'Desconhecimento da Operacao',
                }
            }
        ]
    }
    await nfeWizard.NFE_DesconhecimentoDaOperacao(desconhecimentoDaOperacao);

    /** Operação não Realizada */
    const operacaoNaoRealizada: OperacaoNaoRealizada = {
        idLote: 1,
        evento: [
            {
                cOrgao: 91,
                tpAmb: 2,
                CNPJ: '99999999999999',
                chNFe: '99999999999999999999999999999999999999999999',
                dhEvento: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone }),
                tpEvento: '210240',
                nSeqEvento: 1,
                verEvento: '1.00',
                detEvento: {
                    descEvento: 'Operacao nao Realizada',
                    xJust: 'Teste Operacao nao Realizada em homologação'
                }
            }
        ]
    }
    await nfeWizard.NFE_OperacaoNaoRealizada(operacaoNaoRealizada);

    /** Operação não Realizada */
    const epec: EPEC = {
        idLote: 1,
        evento: [
            {
                tpAmb: 2,
                cOrgao: 91,
                CNPJ: '99999999999999',
                chNFe: '99999999999999999999999999999999999999999999',
                dhEvento: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone }),
                tpEvento: '110140',
                nSeqEvento: 1,
                verEvento: '1.00',
                detEvento: {
                    descEvento: 'EPEC',
                    cOrgaoAutor: 35,
                    tpAutor: 1,
                    verAplic: '1.00',
                    dhEmi: '2024-07-10T09:38:55-03:00',
                    tpNF: 1,
                    IE: '999999999999',
                    dest: {
                        UF: 'SP',
                        CNPJ: '88888888888888',
                        IE: '888888888888',
                        vNF: '999.99',
                        vICMS: '999.99',
                        vST: '999.99',
                    }
                }
            }
        ]
    }
    await nfeWizard.NFE_EventoPrevioDeEmissaoEmContingencia(epec);

    /**
     * A Implementar
     * - Pedido de Prorrogação
     */

}

callnfeWizard();