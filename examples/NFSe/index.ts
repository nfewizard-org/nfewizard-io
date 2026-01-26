import NFSe, { NFSe as NFSeType } from '@nfewizard/nfse';

const testNFSe = async () => {
    const nfse = new NFSe({
        ambiente: 2, // 1 = Produção, 2 = Homologação
        pathCertificado: "../certificate/certificate.pfx",
        senhaCertificado: "SUA_SENHA_CERTIFICADO",
        CPFCNPJ: "00000000000000",
        UF: "PR",
        codigoMunicipio: "4115200", // Maringá/PR
        pathXMLAutorizacao: "tmp/NFSe/Autorizacao",
        armazenarXMLAutorizacao: true,
        pathXMLRetorno: "tmp/NFSe/Retorno",
        armazenarXMLRetorno: true,
        pathLogs: "tmp/NFSe/Logs",
        armazenarLogs: true,
        exibirLogNoConsole: true,
    });

    const autorizacao: NFSeType = {
        DPS: {
            infDps: {
                tpAmb: 2, // 1 = Produção, 2 = Homologação
                dhEmi: "2026-01-25T22:00:00-03:00",
                verAplic: "1.0.0",
                serie: "1",
                nDPS: "1",
                dCompet: "20260125", // AAAAMMDD
                tpEmit: 1, // 1 = Prestador, 2 = Tomador, 3 = Intermediário
                cLocEmi: "4115200", // Código do município (IBGE)
                
                // Informações do prestador
                prest: {
                    CNPJ: "00000000000000",
                    IM: "0000000", // Inscrição Municipal
                    xNome: "RAZAO SOCIAL DA SUA EMPRESA LTDA",
                    end: {
                        endNac: {
                            cMun: "4115200",
                            CEP: "87000000",
                            xLgr: "Rua Exemplo",
                            nro: "123",
                            xCpl: "Sala 1",
                            xBairro: "Centro"
                        }
                    },
                    fone: "4400000000",
                    email: "contato@suaempresa.com.br",
                    regTrib: {
                        opSimpNac: 1, // 1 = Sim, 2 = Não
                        regApTribSN: 1, // Regime de apuração (Simples Nacional)
                        tpTribSN: "01" // Tipo de tributação
                    }
                },
                
                // Informações do tomador
                toma: {
                    CNPJ: "11111111000111",
                    xNome: "CLIENTE EXEMPLO LTDA",
                    end: {
                        endNac: {
                            cMun: "4115200",
                            CEP: "87000000",
                            xLgr: "Avenida Exemplo",
                            nro: "1000",
                            xBairro: "Centro"
                        }
                    },
                    fone: "4400000001",
                    email: "cliente@exemplo.com.br"
                },
                
                // Informações do serviço
                serv: {
                    cServ: {
                        cTribNac: "01.01", // Código do serviço (tabela nacional)
                        cTribMun: "0101", // Código do serviço no município
                        cCNAE: "6201500" // CNAE
                    },
                    xServ: "SERVICOS DE DESENVOLVIMENTO DE PROGRAMAS DE COMPUTADOR SOB ENCOMENDA",
                    cExigSusp: 0, // Exigibilidade: 0 = Normal
                    cLocIncid: "4115200", // Local da incidência
                    cLocPrestacao: "4115200" // Local da prestação
                },
                
                // Valores do serviço
                valores: {
                    vServPrest: "1000.00", // Valor do serviço
                    vDescIncond: "0.00", // Desconto incondicional
                    vDescCond: "0.00", // Desconto condicional
                    vDedRed: "0.00", // Deduções/Reduções
                    vTotTrib: "150.00", // Total de tributos
                    vLiq: "1000.00", // Valor líquido
                    
                    // Tributos federais
                    tribFed: {
                        // PIS
                        pis: {
                            vBCPIS: "1000.00",
                            pPIS: "0.65",
                            vPIS: "6.50"
                        },
                        // COFINS
                        cofins: {
                            vBCCOFINS: "1000.00",
                            pCOFINS: "3.00",
                            vCOFINS: "30.00"
                        },
                        // INSS
                        inss: {
                            vBCINSS: "1000.00",
                            pINSS: "11.00",
                            vINSS: "110.00"
                        },
                        // IR
                        ir: {
                            vBCIR: "1000.00",
                            pIR: "1.50",
                            vIR: "15.00"
                        },
                        // CSLL
                        csll: {
                            vBCCSLL: "1000.00",
                            pCSLL: "1.00",
                            vCSLL: "10.00"
                        }
                    },
                    
                    // ISS
                    trib: {
                        vBCISS: "1000.00",
                        pISS: "2.00",
                        vISS: "20.00",
                        indISS: 1, // 1 = Exigível, 2 = Não incidência, etc.
                        cMunIncid: "4115200" // Município de incidência do ISS
                    }
                }
            }
        }
    };

    try {
        const retornoNFSe = await nfse.Autorizacao(autorizacao);
        console.log('\n=== RETORNO DA AUTORIZAÇÃO NFSe ===');
        console.log('Chave de Acesso:', retornoNFSe.response.chaveAcesso);
        console.log('Status:', retornoNFSe.status);
        console.log('=====================================\n');
        
        return retornoNFSe;
    } catch (error: any) {
        console.error('\n=== ERRO NA AUTORIZAÇÃO NFSe ===');
        console.error('Mensagem:', error.message);
        console.error('================================\n');
        throw error;
    }
}

await testNFSe();
