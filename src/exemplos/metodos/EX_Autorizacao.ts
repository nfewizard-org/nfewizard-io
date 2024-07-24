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
import NFeWizard-io from '@Classes/NFeWizard-io';
import { NFe } from '@Protocols/Controllers';

const callNFeWizard = async () => {
    const nfeWizard = new NFeWizard-io();

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

    const autorizacao: NFe = {
        indSinc: 0,
        idLote: 1,
        NFe: [
            {
                infNFe: {
                    ide: {
                        cUF: 35,
                        cNF: '99999999',
                        natOp: "VENDA DE MERCADORIA",
                        mod: 55,
                        serie: '1',
                        nNF: 999999999,
                        dhEmi: "2024-07-08T00:00:00-03:00",
                        tpNF: 1,
                        idDest: 1,
                        cMunFG: 9999999,
                        tpImp: 1,
                        tpEmis: 1,
                        cDV: 0,
                        tpAmb: 2,
                        finNFe: 1,
                        indFinal: 1,
                        indPres: 9,
                        indIntermed: 0,
                        procEmi: 0,
                    },
                    emit: {
                        CNPJCPF: '99999999999999',
                        xNome: "NOME EMITENTE",
                        xFant: "NOME FANT EMITENTE",
                        enderEmit: {
                            xLgr: "RUA X",
                            nro: '12x',
                            xBairro: "BAIRRO",
                            cMun: 9999999,
                            xMun: "MUNICIPIO",
                            UF: "SP",
                            CEP: '99999999',
                            cPais: 9999,
                            xPais: "BRASIL",
                            fone: "99999999999",
                        },
                        IE: "999999999999",
                        CRT: 3
                    },
                    dest: {
                        CNPJCPF: '99999999999999',
                        xNome: "NF-E EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL",
                        enderDest: {
                            xLgr: "RUA Y",
                            nro: "9999",
                            xBairro: "BAIRRO",
                            cMun: 9999999,
                            xMun: "MUNICIPIO",
                            UF: "SP",
                            CEP: '99999999',
                            cPais: 9999,
                            xPais: "BRASIL",
                            fone: "99999999999"
                        },
                        indIEDest: 1,
                        IE: "999999999999"
                    },
                    det: [
                        {
                            prod: {
                                cProd: "99999999",
                                cEAN: "9999999999999",
                                xProd: "QUEIJO MUSSARELA ",
                                NCM: "99999999",
                                EXTIPI: "00",
                                CFOP: 5102,
                                uCom: "KG",
                                qCom: 24.93,
                                vUnCom: "33.9",
                                vProd: "845.13",
                                cEANTrib: "9999999999999",
                                uTrib: "KG",
                                qTrib: 24.93,
                                vUnTrib: "33.9",
                                indTot: 1,
                            },
                            imposto: {
                                ICMS: {
                                    ICMS00: {
                                        orig: 0,
                                        CST: "00",
                                        modBC: 3,
                                        vBC: "845.13",
                                        pICMS: "12.00",
                                        vICMS: "101.42"
                                    }
                                },
                                PIS: {
                                    PISNT: {
                                        CST: "06",
                                    }
                                },
                                COFINS: {
                                    COFINSNT: {
                                        CST: "06",
                                    }
                                }
                            },
                        },
                    ],
                    total: {
                        ICMSTot: {
                            vBC: "845.13",
                            vICMS: "101.42",
                            vICMSDeson: "0.00",
                            vFCP: "0.00",
                            vBCST: "0.00",
                            vST: "0.00",
                            vFCPST: "0.00",
                            vFCPSTRet: "0.00",
                            vProd: "845.13",
                            vFrete: "0.00",
                            vSeg: "0.00",
                            vDesc: "0.00",
                            vII: "0.00",
                            vIPI: "0.00",
                            vIPIDevol: "0.00",
                            vPIS: "0.00",
                            vCOFINS: "0.00",
                            vOutro: "0.00",
                            vNF: "845.13",
                        }
                    },
                    transp: {
                        modFrete: 0,
                        vol: [
                            {
                                qVol: 1,
                                esp: "CAIXA(S)",
                                marca: "MARCA",
                                pesoL: "24.930",
                                pesoB: "24.930"
                            }
                        ]
                    },
                    pag: {
                        detPag: [
                            {
                                indPag: 1,
                                tPag: 99,
                                xPag: "Outros",
                                vPag: "845.13"
                            }
                        ]
                    },
                },
            },
        ],
    };
    
    await nfeWizard.NFE_Autorizacao(autorizacao)
}

callNFeWizard();