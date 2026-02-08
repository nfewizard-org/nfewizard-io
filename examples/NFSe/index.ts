import NFSeWizard, { NFSe } from '@nfewizard/nfse';

const testNFSe = async () => {
    const nfse = new NFSeWizard({
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

    const autorizacao: NFSe = {
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
                        xLgr: "Rua Exemplo",
                        nro: "123",
                        xCpl: "Sala 1",
                        xBairro: "Centro",
                        endNac: {
                            cMun: "4115200",
                            CEP: "87000000",
                            UF: "PR"
                        }
                    },
                    fone: "4400000000",
                    email: "contato@suaempresa.com.br",
                    regTrib: {
                        opSimpNac: 1, // 1 = Não Optante, 2 = MEI, 3 = ME/EPP
                        regApTribSN: 1, // Regime de apuração (Simples Nacional)
                        regEspTrib: 0 // 0 = Nenhum, 1-9 = Outros
                    }
                },
                
                // Informações do tomador
                toma: {
                    CNPJ: "11111111000111",
                    xNome: "CLIENTE EXEMPLO LTDA",
                    end: {
                        xLgr: "Avenida Exemplo",
                        nro: "1000",
                        xBairro: "Centro",
                        endNac: {
                            cMun: "4115200",
                            CEP: "87000000",
                            UF: "PR"
                        }
                    },
                    fone: "4400000001",
                    email: "cliente@exemplo.com.br"
                },
                
                // Informações do serviço
                serv: {
                    // Local da prestação (primeiro elemento obrigatório)
                    locPrest: {
                        cLocPrestacao: "4115200" // Município da prestação (IBGE)
                    },
                    // Código do serviço (segundo elemento obrigatório)
                    cServ: {
                        cTribNac: "010100", // Código nacional (6 dígitos)
                        cTribMun: "0101", // Código municipal (opcional)
                        xDescServ: "SERVICOS DE DESENVOLVIMENTO DE PROGRAMAS DE COMPUTADOR SOB ENCOMENDA"
                    }
                },
                
                // Valores do serviço
                valores: {
                    // Valor do serviço prestado (primeiro elemento obrigatório)
                    vServPrest: {
                        vServ: 1000.00 // Valor em número
                    },
                    // Descontos (opcional)
                    vDescCondIncond: {
                        vDescIncond: 0.00,
                        vDescCond: 0.00
                    },
                    // Tributação (obrigatório)
                    trib: {
                        // Tributação municipal (obrigatório)
                        tribMun: {
                            tribISSQN: 1, // 1 = Operação tributável
                            tpRetISSQN: 1, // 1 = Não retido
                            pAliq: 2.00 // Alíquota do ISS em %
                        },
                        // Totais (obrigatório)
                        totTrib: {
                            vTotTrib: 150.00
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
