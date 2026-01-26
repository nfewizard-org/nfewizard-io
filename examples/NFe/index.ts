import NFeWizard, { NFe } from 'nfewizard-io';

const testNFe = async () => {
    const nfe = new NFeWizard();

    await nfe.NFE_LoadEnvironment({
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

                pathCertificado: "../certificate/certificate.pfx",
                senhaCertificado: "SUA_SENHA_CERTIFICADO",
                UF: "PR",
                CPFCNPJ: "00000000000000",
            },
            nfe: {
                ambiente: 2,
                versaoDF: "4.00",
                idCSC: 1,
                tokenCSC: '',
                CSRT: 'AAAABBBBCCCCDDDDEEEEFFFFGGGGHHHH1234' // Código de Segurança do Responsável Técnico
            },
            email: {
                host: 'smtp.exemplo.com.br', // Substitua pelo host SMTP do seu provedor de e-mail
                port: 465, // 587 para TLS ou 465 para SSL
                secure: true, // true para 465, false para outros
                auth: {
                    user: 'seu-email@exemplo.com.br', // Seu e-mail
                    pass: 'SUA_SENHA_EMAIL' // Sua senha
                },
                emailParams: {
                    from: 'Sua Empresa <noreply@exemplo.com.br>', // Remetente padrão
                    to: 'destinatario@exemplo.com.br', // Destinatário padrão
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

    const autorizacao3: NFe = {
        indSinc: 1,
        idLote: 1,
        NFe: [
            {
                infNFe: {
                    ide: {
                        cUF: 41,
                        cNF: '83341827',
                        natOp: "Venda",
                        mod: 55,
                        serie: '1',
                        nNF: '3403',
                        dhEmi: "2026-01-25T21:33:28-03:00",
                        dhSaiEnt: "2026-01-25T21:33:28-03:00",
                        tpNF: 1,
                        idDest: 1,
                        cMunFG: 4115200,
                        tpImp: 1,
                        tpEmis: 1,
                        cDV: 4,
                        tpAmb: 2,
                        finNFe: 1,
                        indFinal: 0,
                        indPres: 1,
                        indIntermed: 0,
                        procEmi: 0,
                        verProc: "freenfe-web"
                    },
                    emit: {
                        CNPJCPF: '00000000000000',
                        xNome: "RAZAO SOCIAL DA SUA EMPRESA LTDA",
                        xFant: "NOME FANTASIA DA SUA EMPRESA",
                        enderEmit: {
                            xLgr: "Rua Exemplo",
                            nro: "123",
                            xCpl: "Sala 1",
                            xBairro: "Centro",
                            cMun: 4115200,
                            xMun: "Maringa",
                            UF: "PR",
                            CEP: '87000000',
                            cPais: 1058,
                            xPais: "BRASIL",
                            fone: "4400000000"
                        },
                        IE: "0000000000",
                        CRT: 3
                    },
                    dest: {
                        CNPJCPF: '11111111000111',
                        xNome: "NF-E EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL",
                        enderDest: {
                            xLgr: "Avenida Exemplo",
                            nro: '1000',
                            xCpl: "Sala 100",
                            xBairro: "Centro",
                            cMun: 4115200,
                            xMun: "Maringa",
                            UF: "PR",
                            CEP: '87000000',
                            cPais: 1058,
                            xPais: "Brasil",
                            fone: "4400000000"
                        },
                        indIEDest: 1,
                        IE: "0000000001"
                    },
                    det: [
                        {
                            prod: {
                                cProd: "1",
                                cEAN: "SEM GTIN",
                                xProd: "Teste",
                                NCM: "00000000",
                                CFOP: 5102,
                                uCom: "UNID",
                                qCom: 1.0000,
                                vUnCom: "100.0000000000",
                                vProd: "100.00",
                                cEANTrib: "SEM GTIN",
                                uTrib: "UN",
                                qTrib: 1.0000,
                                vUnTrib: "100.0000000000",
                                indTot: 1
                            },
                            imposto: {
                                vTotTrib: "0.00",
                                ICMS: {
                                    ICMS00: {
                                        orig: 0,
                                        CST: "00",
                                        modBC: 0,
                                        vBC: "103.00",
                                        pICMS: "19.0000",
                                        vICMS: "19.57"
                                    }
                                },
                                IPI: {
                                    cEnq: "999",
                                    IPITrib: {
                                        CST: "50",
                                        vBC: "100.00",
                                        pIPI: "3.0000",
                                        vIPI: "3.00"
                                    }
                                },
                                PIS: {
                                    PISNT: {
                                        CST: "07"
                                    }
                                },
                                COFINS: {
                                    COFINSNT: {
                                        CST: "07"
                                    }
                                },
                                IBSCBS: {
                                    CST: "000",
                                    cClassTrib: "000001",
                                    gIBSCBS: {
                                        vBC: "100.00",
                                        gIBSUF: {
                                            pIBSUF: "0.10",
                                            vIBSUF: "0.10"
                                        },
                                        gIBSMun: {
                                            pIBSMun: "0.00",
                                            vIBSMun: "0.00"
                                        },
                                        vIBS: "0.10",
                                        gCBS: {
                                            pCBS: "0.90",
                                            vCBS: "0.90"
                                        }
                                    }
                                }
                            }
                        }
                    ],
                    total: {
                        ICMSTot: {
                            vBC: "103.00",
                            vICMS: "19.57",
                            vICMSDeson: "0.00",
                            vFCP: "0.00",
                            vBCST: "0.00",
                            vST: "0.00",
                            vFCPST: "0.00",
                            vFCPSTRet: "0.00",
                            vProd: "100.00",
                            vFrete: "0.00",
                            vSeg: "0.00",
                            vDesc: "0.00",
                            vII: "0.00",
                            vIPI: "3.00",
                            vIPIDevol: "0.00",
                            vPIS: "0.00",
                            vCOFINS: "0.00",
                            vOutro: "0.00",
                            vNF: "103.00"
                        },
                        IBSCBSTot: {
                            vBCIBSCBS: "100.00",
                            gIBS: {
                                gIBSUF: {
                                    vDif: "0.00",
                                    vDevTrib: "0.00",
                                    vIBSUF: "0.10"
                                },
                                gIBSMun: {
                                    vDif: "0.00",
                                    vDevTrib: "0.00",
                                    vIBSMun: "0.00"
                                },
                                vIBS: "0.10",
                                vCredPres: "0.00",
                                vCredPresCondSus: "0.00"
                            },
                            gCBS: {
                                vDif: "0.00",
                                vDevTrib: "0.00",
                                vCBS: "0.90",
                                vCredPres: "0.00",
                                vCredPresCondSus: "0.00"
                            }
                        }
                    },
                    transp: {
                        modFrete: 9
                    },
                    pag: {
                        detPag: {
                            indPag: 0,
                            tPag: "90",
                            vPag: "0.00"
                        }
                    },
                    infRespTec: {
                        CNPJ: "00000000000000",
                        xContato: "Nome do Responsavel Tecnico",
                        email: "suporte@suaempresa.com.br",
                        fone: "0000000000",
                        idCSRT: "01"
                        // hashCSRT será gerado automaticamente com base no CSRT configurado
                    }
                }
            }
        ]
    };

    const retornoNFe = await nfe.NFE_Autorizacao(autorizacao3)
}

await testNFe();