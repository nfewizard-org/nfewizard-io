import { CTEWizard, CTe } from '@nfewizard/cte';
// DACTE (PDF) é opcional: instale também @nfewizard/danfe
// import { CTE_GerarDacte } from '@nfewizard/danfe';

/**
 * Exemplo de uso do pacote CT-e: status do serviço, autorização (modelo 57, modal rodoviário),
 * consulta de protocolo, Carta de Correção, Cancelamento e Distribuição DFe.
 *
 * Por padrão só roda status + autorização + consulta (seguros em homologação). Descomente as
 * demais chamadas conforme necessário. Substitua os dados fictícios (CNPJ, IE, chaves, protocolos).
 */
const testCTe = async () => {
    const cte = new CTEWizard();

    await cte.NFE_LoadEnvironment({
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
                // O CT-e usa o mesmo bloco `nfe` de configuração (ambiente: 1 produção, 2 homologação)
                ambiente: 2,
                versaoDF: "4.00",
                idCSC: 1,
                tokenCSC: '',
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

    // 1) Status do serviço (cStat 107 = em operação)
    await cte.CTE_ConsultaStatusServico();

    // 2) Autorização do CT-e modelo 57, modal rodoviário.
    // A lib calcula a chave de acesso (cDV), gera o cCT se omitido, assina o infCte,
    // monta o QR Code (infCTeSupl) e transmite compactado. Um CT-e por chamada.
    const autorizacao: CTe = {
        CTe: {
            infCte: {
                ide: {
                    cUF: 41,
                    cCT: '12345678',
                    CFOP: 6353,
                    natOp: 'PRESTACAO DE SERVICO DE TRANSPORTE A ESTABELECIMENTO COMERCIAL',
                    mod: 57,
                    serie: 1,
                    nCT: 1,
                    dhEmi: '2026-01-25T21:33:28-03:00',
                    tpImp: 1,
                    tpEmis: 1,
                    tpAmb: 2,
                    tpCTe: 0,
                    procEmi: 0,
                    verProc: 'exemplo-1.0',
                    cMunEnv: 4115200,
                    xMunEnv: 'Maringa',
                    UFEnv: 'PR',
                    modal: '01',
                    tpServ: 0,
                    cMunIni: 4115200,
                    xMunIni: 'Maringa',
                    UFIni: 'PR',
                    cMunFim: 3550308,
                    xMunFim: 'Sao Paulo',
                    UFFim: 'SP',
                    retira: 1,
                    indIEToma: 1,
                    toma3: { toma: 3 }, // 0-Remetente; 1-Expedidor; 2-Recebedor; 3-Destinatário
                },
                emit: {
                    CNPJCPF: '00000000000000',
                    IE: '0000000000',
                    xNome: 'RAZAO SOCIAL DA SUA TRANSPORTADORA LTDA',
                    xFant: 'SUA TRANSPORTADORA',
                    enderEmit: {
                        xLgr: 'Rua Exemplo', nro: '123', xBairro: 'Centro', cMun: 4115200, xMun: 'Maringa', CEP: '87000000', UF: 'PR',
                    },
                    CRT: 3,
                },
                rem: {
                    CNPJCPF: '11111111000111',
                    IE: '0000000001',
                    xNome: 'REMETENTE LTDA',
                    enderReme: {
                        xLgr: 'Avenida Remetente', nro: '10', xBairro: 'Centro', cMun: 4115200, xMun: 'Maringa', CEP: '87000000', UF: 'PR', cPais: 1058, xPais: 'BRASIL',
                    },
                },
                dest: {
                    CNPJCPF: '22222222000122',
                    IE: '0000000002',
                    xNome: 'DESTINATARIO LTDA',
                    enderDest: {
                        xLgr: 'Rua Destino', nro: '20', xBairro: 'Centro', cMun: 3550308, xMun: 'Sao Paulo', CEP: '01000000', UF: 'SP', cPais: 1058, xPais: 'BRASIL',
                    },
                },
                vPrest: {
                    vTPrest: '1000.00',
                    vRec: '1000.00',
                    Comp: [{ xNome: 'FRETE VALOR', vComp: '1000.00' }],
                },
                imp: {
                    ICMS: { ICMS00: { CST: '00', vBC: '1000.00', pICMS: '12.00', vICMS: '120.00' } },
                },
                infCTeNorm: {
                    infCarga: {
                        vCarga: '50000.00',
                        proPred: 'PRODUTOS DIVERSOS',
                        infQ: [{ cUnid: '01', tpMed: 'PESO BRUTO', qCarga: '1000.0000' }],
                    },
                    infDoc: {
                        infNFe: [{ chave: '41260100000000000000550010000000011000000011' }],
                    },
                    infModal: {
                        versaoModal: '4.00',
                        rodo: { RNTRC: '12345678' },
                    },
                },
            },
        },
    };

    const retorno = await cte.CTE_Autorizacao(autorizacao);
    const chCTe = retorno.xmls[0]?.protCTe?.infProt?.chCTe;
    const nProt = retorno.xmls[0]?.protCTe?.infProt?.nProt;

    // 3) Consulta de protocolo/situação
    if (chCTe) {
        await cte.CTE_ConsultaProtocolo(chCTe);
    }

    // 4) Carta de Correção (não pode alterar valores, partes ou datas — a lib bloqueia esses campos)
    // await cte.CTE_CartaDeCorrecao({
    //     evento: {
    //         chCTe, tpEvento: '110110',
    //         detEvento: {
    //             descEvento: 'Carta de Correção',
    //             infCorrecao: { grupoAlterado: 'compl', campoAlterado: 'xObs', valorAlterado: 'OBSERVACAO CORRIGIDA' },
    //         },
    //     },
    // });

    // 5) Cancelamento (prazo de 168h após a autorização)
    // await cte.CTE_Cancelamento({
    //     evento: {
    //         chCTe, tpEvento: '110111',
    //         detEvento: { descEvento: 'Cancelamento', nProt, xJust: 'Cancelamento por erro de digitacao no valor da prestacao' },
    //     },
    // });

    // 6) Distribuição DFe (documentos de interesse do CNPJ do certificado)
    // await cte.CTE_DistribuicaoDFePorUltNSU({ distNSU: { ultNSU: '000000000000000' }, CNPJ: '00000000000000', cUFAutor: 41 });

    // 7) DACTE (PDF) a partir do XML autorizado
    // await CTE_GerarDacte({ data: retorno.xmls[0].xmlAssinado, outputPath: 'tmp/dacte.pdf' });
    void nProt;
};

await testCTe();
