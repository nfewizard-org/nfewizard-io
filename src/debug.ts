import { NFe } from '@Types/NFEAutorizacao.js';
import NFeWizard from './adapters/NFeWizard.js';
import path from 'path';
import { ConsultaNFe, DFePorChaveNFe, DFePorNSU, DFePorUltimoNSU } from '@Types/NFEDistribuicaoDFe.js';
import { CienciaDaOperacao, EventoNFe } from '@Types/NFERecepcaoEvento.js';
import { format } from 'date-fns';
import { InutilizacaoData } from '@Types/NFEInutilizacao.js';

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const callNFEjs = async () => {
    /**
     * PARA DOCUMENTAÇÃO COMPLETA, ACESSE: https://nfewizard-org.github.io/
     */
    const nfeWizard = new NFeWizard();

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
                armazenarRetornoEmJSON: false,
                pathRetornoEmJSON: "tmp/DistribuicaoDFe",

                pathCertificado: "certificado.pfx",
                senhaCertificado: "1234",
                UF: "SP",
                CPFCNPJ: "99999999999999",
            },
            nfe: {
                ambiente: 2,
                versaoDF: "4.00",
                idCSC: 1,
                tokenCSC: '99999999-9999-9999-9999-999999999999'
            },
            email: {
                host: 'mail.provider.com.br', // Substitua pelo host SMTP do seu provedor de e-mail
                port: 465, // 587 para TLS ou 465 para SSL
                secure: true, // true para 465, false para outros
                auth: {
                    user: 'nfe.example@email.com.br', // Seu e-mail
                    pass: '123456' // Senha fortíssima do e-mail
                },
                emailParams: {
                    from: 'Company <noreply.company@email.com>', // Remetente padrão
                    to: 'customer.name@email.com.br', // Destinatário padrão
                }
            },
            lib: {
                connection: {
                    timeout: 30000,
                },
                log: {
                    exibirLogNoConsole: true,
                    armazenarLogs: true,
                    pathLogs: 'tmp/Logs'
                },
                useOpenSSL: false,
                useForSchemaValidation: 'validateSchemaJsBased',
            }
        }
    });

    /**
     * Consulta Status do Serviço
     */
    // await nfeWizard.NFE_ConsultaStatusServico();


    /**
     * Consulta Protocolo
     */
    // await nfeWizard.NFE_ConsultaProtocolo('99999999999999999999999999999999999999999999');


    /**
     * Distribuição DFe
     */
    // const distribuicao: ConsultaNFe = {
    //     cUFAutor: 35,
    //     CNPJ: '99999999999999',
    //     // Apenas um dos objetos abaixo deve ser informado
    //     distNSU: {
    //         ultNSU: '000000000000000',
    //     },
    //     consNSU: {
    //         NSU: '000000000000000',
    //     },
    //     consChNFe: {
    //         chNFe: '99999999999999999999999999999999999999999999',
    //     }
    // }
    // await nfeWizard.NFE_DistribuicaoDFe(distribuicao);


    /**
     * Distribuição DFe por Último NSU
     */
    // const ultimoNSU: DFePorUltimoNSU = {
    //     cUFAutor: 35,
    //     CNPJ: '99999999999999',
    //     distNSU: {
    //         ultNSU: '000000000000001'
    //     },
    // }
    // await nfeWizard.NFE_DistribuicaoDFePorUltNSU(ultimoNSU);


    /**
     * Distribuição DFe por NSU
     */
    // const nsu: DFePorNSU = {
    //     cUFAutor: 35,
    //     CNPJ: '99999999999999',
    //     consNSU: {
    //         NSU: '000000000000000'
    //     },
    // }
    // await nfeWizard.NFE_DistribuicaoDFePorNSU(nsu);


    /**
     * Distribuição DFe por Chave de Acesso
     */
    // const chave: DFePorChaveNFe = {
    //     cUFAutor: 35,
    //     CNPJ: '99999999999999',
    //     consChNFe: {
    //         chNFe: '99999999999999999999999999999999999999999999'
    //     },
    // }
    // await nfeWizard.NFE_DistribuicaoDFePorChave(chave);


    /**
     * Inutilização
     */
    // const inutilizacao: InutilizacaoData = {
    //     cUF: 35,
    //     CNPJ: '99999999999999',
    //     ano: '24',
    //     mod: '55',
    //     serie: '1',
    //     nNFIni: '112',
    //     nNFFin: '112',
    //     xJust: 'Teste de homologação',
    // }
    // await nfeWizard.NFE_Inutilizacao(inutilizacao)


    /**
     * Recepção de Eventos
     */
    // const evento: EventoNFe = {
    //     idLote: 1,
    //     evento: [
    //         // O método aceita até 20 eventos por lote
    //         {
    //             cOrgao: 91,
    //             tpAmb: 2,
    //             CNPJ: '99999999999999',
    //             chNFe: '99999999999999999999999999999999999999999999',
    //             dhEvento: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX"),
    //             tpEvento: '210210',
    //             nSeqEvento: 1,
    //             verEvento: '1.00',
    //             detEvento: {
    //                 descEvento: 'Ciencia da Operacao',
    //             }
    //         },
    //         {
    //             tpAmb: 2,
    //             cOrgao: 91,
    //             CNPJ: '99999999999999',
    //             chNFe: '99999999999999999999999999999999999999999999',
    //             dhEvento: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX"),
    //             tpEvento: '210200',
    //             nSeqEvento: 1,
    //             verEvento: '1.00',
    //             detEvento: {
    //                 descEvento: 'Confirmacao da Operacao',
    //             }
    //         },
    //         {
    //             cOrgao: 35,
    //             tpAmb: 2,
    //             CNPJ: '99999999999999',
    //             chNFe: '99999999999999999999999999999999999999999999',
    //             dhEvento: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX"),
    //             tpEvento: '110110',
    //             nSeqEvento: 1,
    //             verEvento: '1.00',
    //             detEvento: {
    //                 descEvento: 'Carta de Correção',
    //                 xCorrecao: 'Teste de homologação',
    //                 xCondUso: 'A Carta de Correcao e disciplinada pelo paragrafo 1o-A do art. 7o do Convenio S/N, de 15 de dezembro de 1970 e pode ser utilizada para regularizacao de erro ocorrido na emissao de documento fiscal, desde que o erro nao esteja relacionado com: I - as variaveis que determinam o valor do imposto tais como: base de calculo, aliquota, diferenca de preco, quantidade, valor da operacao ou da prestacao; II - a correcao de dados cadastrais que implique mudanca do remetente ou do destinatario; III - a data de emissao ou de saida.',
    //             }
    //         },
    //         {
    //             tpAmb: 2,
    //             cOrgao: 35,
    //             CNPJ: '99999999999999',
    //             chNFe: '99999999999999999999999999999999999999999999',
    //             dhEvento: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX"),
    //             tpEvento: '110111',
    //             nSeqEvento: 1,
    //             verEvento: '1.00',
    //             detEvento: {
    //                 descEvento: 'Cancelamento',
    //                 nProt: '999999999999999',
    //                 xJust: 'Cancelamento homologacao',
    //             }
    //         },
    //         {
    //             cOrgao: 91,
    //             tpAmb: 2,
    //             CNPJ: '99999999999999',
    //             chNFe: '99999999999999999999999999999999999999999999',
    //             dhEvento: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX"),
    //             tpEvento: '210220',
    //             nSeqEvento: 1,
    //             verEvento: '1.00',
    //             detEvento: {
    //                 descEvento: 'Desconhecimento da Operacao',
    //             }
    //         },
    //         {
    //             cOrgao: 91,
    //             tpAmb: 2,
    //             CNPJ: '99999999999999',
    //             chNFe: '99999999999999999999999999999999999999999999',
    //             dhEvento: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX"),
    //             tpEvento: '210240',
    //             nSeqEvento: 1,
    //             verEvento: '1.00',
    //             detEvento: {
    //                 descEvento: 'Operacao nao Realizada',
    //                 xJust: 'Teste Operacao nao Realizada em homologação'
    //             }
    //         },
    //         {
    //             tpAmb: 2,
    //             cOrgao: 91,
    //             CNPJ: '99999999999999',
    //             chNFe: '99999999999999999999999999999999999999999999',
    //             dhEvento: format(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX"),
    //             tpEvento: '110140',
    //             nSeqEvento: 1,
    //             verEvento: '1.00',
    //             detEvento: {
    //                 descEvento: 'EPEC',
    //                 cOrgaoAutor: 35,
    //                 tpAutor: 1,
    //                 verAplic: '1.00',
    //                 dhEmi: '2024-07-10T09:38:55-03:00',
    //                 tpNF: 1,
    //                 IE: '999999999999',
    //                 dest: {
    //                     UF: 'SP',
    //                     CNPJ: '99999999999999',
    //                     IE: '999999999999',
    //                     vNF: '999.99',
    //                     vICMS: '999.99',
    //                     vST: '999.99',
    //                 }
    //             }
    //         }

    //     ]
    // }
    // await nfeWizard.NFE_RecepcaoEvento(evento);

    /**
     * Autorização de NFe
     */
    // const autorizacao: NFe = {
    //     indSinc: 0,
    //     idLote: 1,
    //     NFe: [
    //         {
    //             infNFe: {
    //                 ide: {
    //                     cUF: 35,
    //                     cNF: '99999999',
    //                     natOp: "VENDA DE MERCADORIA",
    //                     mod: 55,
    //                     serie: '1',
    //                     nNF: 999999999,
    //                     dhEmi: "2024-07-08T00:00:00-03:00",
    //                     tpNF: 1,
    //                     idDest: 1,
    //                     cMunFG: 9999999,
    //                     tpImp: 1,
    //                     tpEmis: 1,
    //                     cDV: 0,
    //                     tpAmb: 2,
    //                     finNFe: 1,
    //                     indFinal: 1,
    //                     indPres: 9,
    //                     indIntermed: 0,
    //                     procEmi: 0,
    //                 },
    //                 emit: {
    //                     CNPJCPF: '99999999999999',
    //                     xNome: "NOME EMITENTE",
    //                     xFant: "NOME FANT EMITENTE",
    //                     enderEmit: {
    //                         xLgr: "RUA X",
    //                         nro: '12x',
    //                         xBairro: "BAIRRO",
    //                         cMun: 9999999,
    //                         xMun: "MUNICIPIO",
    //                         UF: "SP",
    //                         CEP: '99999999',
    //                         cPais: 9999,
    //                         xPais: "BRASIL",
    //                         fone: "99999999999",
    //                     },
    //                     IE: "999999999999",
    //                     CRT: 3
    //                 },
    //                 dest: {
    //                     CNPJCPF: '99999999999999',
    //                     xNome: "NF-E EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL",
    //                     enderDest: {
    //                         xLgr: "RUA Y",
    //                         nro: "9999",
    //                         xBairro: "BAIRRO",
    //                         cMun: 9999999,
    //                         xMun: "MUNICIPIO",
    //                         UF: "SP",
    //                         CEP: '99999999',
    //                         cPais: 9999,
    //                         xPais: "BRASIL",
    //                         fone: "99999999999"
    //                     },
    //                     indIEDest: 1,
    //                     IE: "999999999999"
    //                 },
    //                 det: [
    //                     {
    //                         prod: {
    //                             cProd: "99999999",
    //                             cEAN: "9999999999999",
    //                             xProd: "QUEIJO MUSSARELA ",
    //                             NCM: "99999999",
    //                             EXTIPI: "00",
    //                             CFOP: 5102,
    //                             uCom: "KG",
    //                             qCom: 24.93,
    //                             vUnCom: "33.9",
    //                             vProd: "845.13",
    //                             cEANTrib: "9999999999999",
    //                             uTrib: "KG",
    //                             qTrib: 24.93,
    //                             vUnTrib: "33.9",
    //                             indTot: 1,
    //                         },
    //                         imposto: {
    //                             ICMS: {
    //                                 ICMS00: {
    //                                     orig: 0,
    //                                     CST: "00",
    //                                     modBC: 3,
    //                                     vBC: "845.13",
    //                                     pICMS: "12.00",
    //                                     vICMS: "101.42"
    //                                 }
    //                             },
    //                             PIS: {
    //                                 PISNT: {
    //                                     CST: "06",
    //                                 }
    //                             },
    //                             COFINS: {
    //                                 COFINSNT: {
    //                                     CST: "06",
    //                                 }
    //                             }
    //                         },
    //                     },
    //                 ],
    //                 total: {
    //                     ICMSTot: {
    //                         vBC: "845.13",
    //                         vICMS: "101.42",
    //                         vICMSDeson: "0.00",
    //                         vFCP: "0.00",
    //                         vBCST: "0.00",
    //                         vST: "0.00",
    //                         vFCPST: "0.00",
    //                         vFCPSTRet: "0.00",
    //                         vProd: "845.13",
    //                         vFrete: "0.00",
    //                         vSeg: "0.00",
    //                         vDesc: "0.00",
    //                         vII: "0.00",
    //                         vIPI: "0.00",
    //                         vIPIDevol: "0.00",
    //                         vPIS: "0.00",
    //                         vCOFINS: "0.00",
    //                         vOutro: "0.00",
    //                         vNF: "845.13",
    //                     }
    //                 },
    //                 transp: {
    //                     modFrete: 0,
    //                     vol: [
    //                         {
    //                             qVol: 1,
    //                             esp: "CAIXA(S)",
    //                             marca: "MARCA",
    //                             pesoL: "24.930",
    //                             pesoB: "24.930"
    //                         }
    //                     ]
    //                 },
    //                 pag: {
    //                     detPag: [
    //                         {
    //                             indPag: 1,
    //                             tPag: 99,
    //                             xPag: "Outros",
    //                             vPag: "845.13"
    //                         }
    //                     ]
    //                 },
    //             },
    //         },
    //     ],
    // };
    // await nfeWizard.NFE_Autorizacao(autorizacao);

    /**
     * Autorização de NFCe
     */
    // const autorizacaoNFCe: NFe = {
    //     indSinc: 1,
    //     idLote: 1,
    //     NFe: [
    //         {
    //             infNFe: {
    //                 ide: {
    //                     cUF: 35,
    //                     cNF: '99999999',
    //                     natOp: "VENDA DE MERCADORIA",
    //                     mod: 65,
    //                     serie: '1',
    //                     nNF: 999999999,
    //                     dhEmi: "2024-09-02T12:28:02-03:00",
    //                     tpNF: 1,
    //                     idDest: 1,
    //                     cMunFG: 9999999,
    //                     tpImp: 4,
    //                     tpEmis: 1,
    //                     cDV: 0,
    //                     tpAmb: 2,
    //                     finNFe: 1,
    //                     indFinal: 1,
    //                     indPres: 1,
    //                     indIntermed: 0,
    //                     procEmi: 0,
    //                     verProc: '0.1.0',
    //                     // Utilize os campos abaixo em caso de contingência
    //                     // dhCont: '2024-09-01T13:54:03-03:00',
    //                     // xJust: 'Testes de emissão NFCe'
    //                 },
    //                 emit: {
    //                     CNPJCPF: '99999999999999',
    //                     xNome: "NOME EMITENTE",
    //                     xFant: "NOME FANT EMITENTE",
    //                     enderEmit: {
    //                         xLgr: "RUA X",
    //                         nro: '12x',
    //                         xBairro: "BAIRRO",
    //                         cMun: 9999999,
    //                         xMun: "MUNICIPIO",
    //                         UF: "SP",
    //                         CEP: '99999999',
    //                         cPais: 9999,
    //                         xPais: "BRASIL",
    //                         fone: "99999999999",
    //                     },
    //                     IE: "999999999999",
    //                     CRT: 3
    //                 },
    //                 dest: {
    //                     CNPJCPF: '99999999999999',
    //                     xNome: "NF-E EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL",
    //                     enderDest: {
    //                         xLgr: "RUA Y",
    //                         nro: "9999",
    //                         xBairro: "BAIRRO",
    //                         cMun: 9999999,
    //                         xMun: "MUNICIPIO",
    //                         UF: "SP",
    //                         CEP: '99999999',
    //                         cPais: 9999,
    //                         xPais: "BRASIL",
    //                         fone: "99999999999"
    //                     },
    //                     indIEDest: 1,
    //                 },
    //                 det: [
    //                     {
    //                         prod: {
    //                             cProd: "99999999",
    //                             cEAN: "9999999999999",
    //                             xProd: "NOTA FISCAL EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL",
    //                             NCM: "99999999",
    //                             EXTIPI: "00",
    //                             CFOP: 5102,
    //                             uCom: "UN",
    //                             qCom: 1,
    //                             vUnCom: "845.13",
    //                             vProd: "845.13",
    //                             cEANTrib: "9999999999999",
    //                             uTrib: "UN",
    //                             qTrib: 1,
    //                             vUnTrib: "845.13",
    //                             indTot: 1,
    //                         },
    //                         imposto: {
    //                             ICMS: {
    //                                 ICMS00: {
    //                                     orig: 0,
    //                                     CST: "00",
    //                                     modBC: 3,
    //                                     vBC: "845.13",
    //                                     pICMS: "12.00",
    //                                     vICMS: "101.42"
    //                                 }
    //                             },
    //                             PIS: {
    //                                 PISNT: {
    //                                     CST: "06",
    //                                 }
    //                             },
    //                             COFINS: {
    //                                 COFINSNT: {
    //                                     CST: "06",
    //                                 }
    //                             }
    //                         },
    //                     },
    //                 ],
    //                 total: {
    //                     ICMSTot: {
    //                         vBC: "845.13",
    //                         vICMS: "101.42",
    //                         vICMSDeson: "0.00",
    //                         vFCP: "0.00",
    //                         vBCST: "0.00",
    //                         vST: "0.00",
    //                         vFCPST: "0.00",
    //                         vFCPSTRet: "0.00",
    //                         vProd: "845.13",
    //                         vFrete: "0.00",
    //                         vSeg: "0.00",
    //                         vDesc: "0.00",
    //                         vII: "0.00",
    //                         vIPI: "0.00",
    //                         vIPIDevol: "0.00",
    //                         vPIS: "0.00",
    //                         vCOFINS: "0.00",
    //                         vOutro: "0.00",
    //                         vNF: "845.13",
    //                     }
    //                 },
    //                 transp: {
    //                     modFrete: 9,
    //                 },
    //                 pag: {
    //                     detPag: [
    //                         {
    //                             indPag: 1,
    //                             tPag: 99,
    //                             xPag: "Outros",
    //                             vPag: "845.13"
    //                         }
    //                     ]
    //                 },
    //             },
    //         },
    //     ],
    // };
    // await nfeWizard.NFCE_Autorizacao(autorizacaoNFCe);

}

callNFEjs();