import NFSeWizard, { NFSe } from '@nfewizard/nfse';

const testNFSe = async () => {
    const nfse = new NFSeWizard({
        dfe: {
            pathCertificado: "../certificate/certificate.pfx",
            senhaCertificado: "SUA_SENHA_CERTIFICADO",
            CPFCNPJ: "00000000000000",
            UF: "PR",
            armazenarXMLAutorizacao: true,
            pathXMLAutorizacao: "tmp/NFSe/Autorizacao",
            armazenarXMLRetorno: true,
            pathXMLRetorno: "tmp/NFSe/Retorno",
        },
        nfe: {
            ambiente: 2, // 1 = Produção, 2 = Homologação
            versaoDF: "1.0.0",
        },
        lib: {
            useForSchemaValidation: 'validateSchemaJsBased', // Usar validação JavaScript para NFSe
            log: {
                pathLogs: "tmp/NFSe/Logs",
                armazenarLogs: true,
                exibirLogNoConsole: true,
            }
        }
    });

    const autorizacao: NFSe = {
        DPS: {
            infDps: {
                tpAmb: 2, // 1 = Produção, 2 = Homologação
                dhEmi: "2026-01-25T22:00:00-03:00",
                verAplic: "1.0.0",
                serie: "1",
                nDPS: "1",
                dCompet: "2026-01-25", // Data de competência (YYYY-MM-DD)
                tpEmit: 1, // 1 = Prestador, 2 = Tomador, 3 = Intermediário
                cLocEmi: "4115200", // Código do município (IBGE)
                
                // Informações do prestador
                // Quando tpEmit=1 (prestador), não deve informar IM, xNome, end, fone, email
                prest: {
                    CNPJ: "00000000000000",
                    regTrib: {
                        opSimpNac: 1, // 1 = Não Optante pelo Simples Nacional
                        regEspTrib: 0 // 0 = Nenhum, 1-9 = Outros
                    }
                },
                
                // Informações do tomador
                toma: {
                    CPF: "11144477735", // CPF válido de teste para homologação
                    xNome: "NOTA FISCAL EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL",
                    end: {
                        endNac: {
                            cMun: "4115200",
                            CEP: "87000000"
                        },
                        xLgr: "Rua Exemplo",
                        nro: "123",
                        xBairro: "Centro"
                    }
                },
                
                // Informações do serviço
                serv: {
                    // Local da prestação (primeiro elemento obrigatório)
                    locPrest: {
                        cLocPrestacao: "4115200" // Município da prestação (IBGE)
                    },
                    // Código do serviço (segundo elemento obrigatório)
                    cServ: {
                        cTribNac: "110101", // Código nacional (Estacionamento de veículos - exemplo válido)
                        xDescServ: "SERVICOS DE DESENVOLVIMENTO DE PROGRAMAS DE COMPUTADOR SOB ENCOMENDA",
                        cNBS: "106043000" // Código NBS (Nomenclatura Brasileira de Serviços)
                    }
                },
                
                // Valores do serviço
                valores: {
                    // Valor do serviço prestado (primeiro elemento obrigatório)
                    vServPrest: {
                        vServ: 100.00 // Valor em número
                    },
                    // Tributação (obrigatório)
                    trib: {
                        // Tributação municipal (obrigatório)
                        tribMun: {
                            tribISSQN: 1, // 1 = Operação tributável
                            tpRetISSQN: 1 // 1 = Não retido (não informar pAliq para não optantes do Simples)
                        },
                        // Totais (obrigatório)
                        totTrib: {
                            vTotTrib: {
                                vTotTribFed: 10.00, // Tributos federais
                                vTotTribEst: 5.00,  // Tributos estaduais
                                vTotTribMun: 4.00   // Tributos municipais
                            }
                        }
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
