import XmlBuilder from '@Adapters/XmlBuilder';
import Utility from '@Core/utils/Utility';
import { NFeWizardServiceImpl } from '@Interfaces';
import GerarConsulta from '@Modules/dfe/base/GerarConsulta';
import SaveFiles from '@Modules/dfe/base/SaveFiles';
import Environment from '@Modules/environment/Environment';
import { AxiosInstance } from 'axios';
import NFEStatusServicoService from '@Modules/dfe/nfe/services/NFEStatusServico/NFEStatusServicoService';
import NFEConsultaProtocolo from '../../operations/NFEConsultaProtocolo/NFEconsultaProtocolo';
import NFEEpec from '../../operations/NFERecepcaoEvento/NFEEpec';
import NFECancelamento from '../../operations/NFERecepcaoEvento/NFECancelamento';
import NFECienciaDaOperacao from '../../operations/NFERecepcaoEvento/NFECienciaDaOperacao';
import NFEConfirmacaoDaOperacao from '../../operations/NFERecepcaoEvento/NFEConfirmacaoDaOperacao';
import NFEOperacaoNaoRealizada from '../../operations/NFERecepcaoEvento/NFEOperacaoNaoRealizada';
import MailController from '@Adapters/MailAdapter';
import NFCEGerarDanfe from '@Modules/dfe/danfe/NFCEGerarDanfe/NFCEGerarDanfe';
import NFEGerarDanfe from '@Modules/dfe/danfe/NFEGerarDanfe/NFEGerarDanfe';
import NFCEAutorizacao from '@Modules/dfe/nfce/operations/NFCEAutorizacao/NFCEAutorizacao';
import NFEDistribuicaoDFe from '../../operations/NFEDistribuicaoDFe/NFEDistribuicaoDFe';
import NFEDistribuicaoDFePorChave from '../../operations/NFEDistribuicaoDFe/NFEDistribuicaoDFePorChave';
import NFEDistribuicaoDFePorNSU from '../../operations/NFEDistribuicaoDFe/NFEDistribuicaoDFePorNSU';
import NFEDistribuicaoDFePorUltNSU from '../../operations/NFEDistribuicaoDFe/NFEDistribuicaoDFePorUltNSU';
import NFEInutilizacao from '../../operations/NFEInutilizacao/NFEInutilizacao';
import NFECartaDeCorrecao from '../../operations/NFERecepcaoEvento/NFECartaDeCorrecao';
import NFEDesconhecimentoDaOperacao from '../../operations/NFERecepcaoEvento/NFEDesconhecimentoDaOperacao';
import NFEAutorizacaoService from '../NFEAutorizacao/NFEAutorizacaoService';
import {
    Cancelamento,
    CartaDeCorrecao,
    CienciaDaOperacao,
    ConfirmacaoDaOperacao,
    ConsultaNFe,
    DesconhecimentoDaOperacao,
    DFePorChaveNFe,
    DFePorNSU,
    DFePorUltimoNSU,
    EmailParams,
    EPEC,
    EventoNFe,
    InutilizacaoData,
    NFe,
    NFEGerarDanfeProps,
    NFeWizardProps,
    OperacaoNaoRealizada
} from '@Types';
import NFEconsultaProtocoloService from '../NFEConsultaProtocolo/NFEconsultaProtocoloService';
import NFEStatusServico from '../../operations/NFEStatusServico/NFEStatusServico';
import NFERecepcaoEvento from '../../operations/NFERecepcaoEvento/NFERecepcaoEvento';
import NFERecepcaoEventoService from '../NFERecepcaoEvento/NFERecepcaoEventoService';
import NFECancelamentoService from '../NFERecepcaoEvento/NFECancelamentoService';
import NFECartaDeCorrecaoService from '../NFERecepcaoEvento/NFECartaDeCorrecaoService';
import NFECienciaDaOperacaoService from '../NFERecepcaoEvento/NFECienciaDaOperacaoService';
import NFEDesconhecimentoDaOperacaoService from '../NFERecepcaoEvento/NFEDesconhecimentoDaOperacaoService';
import NFEEpecService from '../NFERecepcaoEvento/NFEEpecService';
import NFEOperacaoNaoRealizadaService from '../NFERecepcaoEvento/NFEOperacaoNaoRealizadaService';
import NFEAutorizacao from '../../operations/NFEAutorizacao/NFEAutorizacao';
import NFEDistribuicaoDFeService from '../NFEDistribuicaoDFe/NFEDistribuicaoDFeService';
import NFEDistribuicaoDFePorUltNSUService from '../NFEDistribuicaoDFe/NFEDistribuicaoDFePorUltNSU';
import NFEDistribuicaoDFePorNSUService from '../NFEDistribuicaoDFe/NFEDistribuicaoDFePorNSU';
import NFEDistribuicaoDFePorChaveService from '../NFEDistribuicaoDFe/NFEDistribuicaoDFePorChave';
import NFEInutilizacaoService from '../NFEInutilizacao/NFEInutilizacaoService';
import NFCEAutorizacaoService from '@Modules/dfe/nfce/services/NFCEAutorizacao/NFCEAutorizacaoService';
import { logger } from '@Core/exceptions/logger';

class NFeWizardService implements NFeWizardServiceImpl {
    private config: NFeWizardProps = {} as NFeWizardProps;
    private environment: Environment = {} as Environment;
    private utility: Utility = {} as Utility;
    private xmlBuilder: XmlBuilder = {} as XmlBuilder;
    private axios: AxiosInstance = {} as AxiosInstance;
    private saveFiles: SaveFiles = {} as SaveFiles;
    private gerarConsulta: GerarConsulta = {} as GerarConsulta;

    constructor() {
        if (new.target) {
            return new Proxy(this, {
                get(target: NFeWizardService, prop: string | symbol, receiver: any): any {
                    const origMethod: any = target[prop as keyof typeof target];
                    if (typeof origMethod === 'function') {
                        return async function (...args: any[]): Promise<any> {
                            if (prop === 'NFE_LoadEnvironment') {
                                return origMethod.apply(target, args);
                            }
                            // Lógica de validação antes de cada método
                            await target.validateEnvironment(prop as string);
                            // Chama o método original
                            return origMethod.apply(target, args);
                        };
                    }
                    return Reflect.get(target, prop, receiver);
                }
            });
        }
    }

    async NFE_LoadEnvironment({ config }: { config: NFeWizardProps }) {
        try {
            this.config = config;
            // Carrega Ambiente
            this.environment = new Environment(this.config);
            const { axios } = await this.environment.loadEnvironment();
            this.axios = axios;

            // Inicia método de Utilitários
            this.utility = new Utility(this.environment)
            this.saveFiles = new SaveFiles(this.environment, this.utility);

            // Inicia método de geração de XML
            this.xmlBuilder = new XmlBuilder(this.environment)
            this.gerarConsulta = new GerarConsulta(this.environment, this.utility, this.xmlBuilder);

            // console.log('===================================');
            // console.log('Biblioteca Inicializada com Sucesso');
            // console.log('===================================');

        } catch (error) {
            logger.error(``, error, { context: 'NFE_LoadEnvironment', });
            throw new Error(`Erro ao inicializar a lib: ${error}`)
        }
    }

    /**
     * Status Serviço
     */
    async NFE_ConsultaStatusServico() {
        try {
            const nfeStatusServicoService = new NFEStatusServicoService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta);
            const nfeStatusServico = new NFEStatusServico(nfeStatusServicoService);

            const response = await nfeStatusServico.Exec();

            console.log('Retorno NFE_ConsultaStatusServico');
            console.log(`   ${response.xMotivo}`);
            console.log('===================================');

            return response
        } catch (error: any) {
            logger.error(``, error, { context: 'NFE_ConsultaStatusServico', });
            throw new Error(`NFE_ConsultaStatusServico: ${error.message}`)
        }
    }

    /**
     * Consulta Protocolo
     */
    async NFE_ConsultaProtocolo(chave: string) {
        try {
            const nfeConsultaProtocoloService = new NFEconsultaProtocoloService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta);
            const nfeConsultaProtocolo = new NFEConsultaProtocolo(nfeConsultaProtocoloService);

            const response = await nfeConsultaProtocolo.Exec(chave);

            console.log('Retorno NFE_ConsultaProtocolo');
            console.log(`   ${response.xMotivo}`);
            console.log('===================================');

            return response
        } catch (error: any) {
            logger.error(``, error, { context: 'NFE_ConsultaProtocolo', });
            throw new Error(`NFE_ConsultaProtocolo: ${error.message}`)
        }
    }

    /**
     * Recepção de Eventos
     */
    async NFE_RecepcaoEvento(evento: EventoNFe) {
        try {
            const nfeRecepcaoEventoService = new NFERecepcaoEventoService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta);
            const nfeRecepcaoEvento = new NFERecepcaoEvento(nfeRecepcaoEventoService);
            const response = await nfeRecepcaoEvento.Exec(evento);

            console.log('Retorno NFE_RecepcaoEvento');
            console.table(response.xMotivos);
            console.log('===================================');

            return response.response
        } catch (error: any) {
            logger.error(``, error, { context: 'NFE_RecepcaoEvento', });
            throw new Error(`NFE_RecepcaoEvento: ${error.message}`)
        }
    }
    async NFE_EventoPrevioDeEmissaoEmContingencia(evento: EPEC) {
        try {
            const nfeEpecService = new NFEEpecService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta);
            const nfeEpec = new NFEEpec(nfeEpecService);
            const response = await nfeEpec.Exec(evento);

            console.log('Retorno NFEEpec');
            console.table(response.xMotivos);
            console.log('===================================');

            return response.response
        } catch (error: any) {
            logger.error(``, error, { context: 'NFE_EventoPrevioDeEmissaoEmContingencia', });
            throw new Error(`NFEEpec: ${error.message}`)
        }
    }
    async NFE_Cancelamento(evento: Cancelamento) {
        try {
            const nfeCancelamentoService = new NFECancelamentoService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta);
            const nfeCancelamento = new NFECancelamento(nfeCancelamentoService);
            const response = await nfeCancelamento.Exec(evento);

            console.log('Retorno NFE_Cancelamento');
            console.table(response.xMotivos);
            console.log('===================================');

            return response.response
        } catch (error: any) {
            logger.error(``, error, { context: 'NFE_Cancelamento', });
            throw new Error(`NFE_Cancelamento: ${error.message}`)
        }
    }
    async NFE_CienciaDaOperacao(evento: CienciaDaOperacao) {
        try {
            const nfeCienciaDaOperacaoService = new NFECienciaDaOperacaoService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta);
            const nfeCienciaDaOperacao = new NFECienciaDaOperacao(nfeCienciaDaOperacaoService);
            const response = await nfeCienciaDaOperacao.Exec(evento);

            console.log('Retorno NFE_CienciaDaOperacao');
            console.table(response.xMotivos);
            console.log('===================================');

            return response.response
        } catch (error: any) {
            logger.error(``, error, { context: 'NFE_CienciaDaOperacao', });
            throw new Error(`NFE_CienciaDaOperacao: ${error.message}`)
        }
    }
    async NFE_ConfirmacaoDaOperacao(evento: ConfirmacaoDaOperacao) {
        try {
            const nfeConfirmacaoDaOperacaoService = new NFECienciaDaOperacaoService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta);
            const nfeConfirmacaoDaOperacao = new NFEConfirmacaoDaOperacao(nfeConfirmacaoDaOperacaoService);
            const response = await nfeConfirmacaoDaOperacao.Exec(evento);

            console.log('Retorno NFE_ConfirmacaoDaOperacao');
            console.table(response.xMotivos);
            console.log('===================================');

            return response.response
        } catch (error: any) {
            logger.error(``, error, { context: 'NFE_ConfirmacaoDaOperacao', });
            throw new Error(`NFE_ConfirmacaoDaOperacao: ${error.message}`)
        }
    }
    async NFE_OperacaoNaoRealizada(evento: OperacaoNaoRealizada) {
        try {
            const nfeOperacaoNaoRealizadaService = new NFEOperacaoNaoRealizadaService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta);
            const nfeOperacaoNaoRealizada = new NFEOperacaoNaoRealizada(nfeOperacaoNaoRealizadaService);
            const response = await nfeOperacaoNaoRealizada.Exec(evento);

            console.log('Retorno NFE_OperacaoNaoRealizada');
            console.table(response.xMotivos);
            console.log('===================================');

            return response.response
        } catch (error: any) {
            logger.error(``, error, { context: 'NFE_OperacaoNaoRealizada', });
            throw new Error(`NFE_OperacaoNaoRealizada: ${error.message}`)
        }
    }
    async NFE_CartaDeCorrecao(evento: CartaDeCorrecao) {
        try {
            const nfeCartaDeCorrecaoService = new NFECartaDeCorrecaoService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta);
            const nfeCartaDeCorrecao = new NFECartaDeCorrecao(nfeCartaDeCorrecaoService);
            const response = await nfeCartaDeCorrecao.Exec(evento);

            console.log('Retorno NFE_CartaDeCorrecao');
            console.table(response.xMotivos);
            console.log('===================================');

            return response.response
        } catch (error: any) {
            logger.error(``, error, { context: 'NFE_CartaDeCorrecao', });
            throw new Error(`NFE_CartaDeCorrecao: ${error.message}`)
        }
    }
    async NFE_DesconhecimentoDaOperacao(evento: DesconhecimentoDaOperacao) {
        try {
            const nfeDesconhecimentoDaOperacaoService = new NFEDesconhecimentoDaOperacaoService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta);
            const nfeDesconhecimentoDaOperacao = new NFEDesconhecimentoDaOperacao(nfeDesconhecimentoDaOperacaoService);
            const response = await nfeDesconhecimentoDaOperacao.Exec(evento);

            console.log('Retorno NFE_DesconhecimentoDaOperacao');
            console.table(response.xMotivos);
            console.log('===================================');

            return response.response
        } catch (error: any) {
            logger.error(``, error, { context: 'NFE_DesconhecimentoDaOperacao', });
            throw new Error(`NFE_DesconhecimentoDaOperacao: ${error.message}`)
        }
    }

    /**
     * Distribuição DFe
     */
    async NFE_DistribuicaoDFe(data: ConsultaNFe) {
        try {
            const distribuicaoDFeService = new NFEDistribuicaoDFeService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta);
            const distribuicaoDFe = new NFEDistribuicaoDFe(distribuicaoDFeService);
            const response = await distribuicaoDFe.Exec(data);

            console.log('Retorno NFE_DistribuicaoDFe');
            console.log(`   ${response.xMotivo}`);
            console.log('===================================');

            return response.data
        } catch (error: any) {
            logger.error(``, error, { context: 'NFE_DistribuicaoDFe', });
            throw new Error(`NFE_DistribuicaoDFe: ${error.message}`)
        }
    }
    async NFE_DistribuicaoDFePorUltNSU(data: DFePorUltimoNSU) {
        try {
            const distribuicaoDFeService = new NFEDistribuicaoDFePorUltNSUService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta);
            const distribuicaoDFe = new NFEDistribuicaoDFePorUltNSU(distribuicaoDFeService);
            const response = await distribuicaoDFe.Exec(data);

            console.log('Retorno NFE_DistribuicaoDFePorUltNSU');
            console.log(`   ${response.xMotivo}`);
            console.log('===================================');

            return response.data
        } catch (error: any) {
            logger.error(``, error, { context: 'NFE_DistribuicaoDFePorUltNSU', });
            throw new Error(`NFE_DistribuicaoDFePorUltNSU: ${error.message}`)
        }
    }
    async NFE_DistribuicaoDFePorNSU(data: DFePorNSU) {
        try {
            const distribuicaoDFeService = new NFEDistribuicaoDFePorNSUService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta);
            const distribuicaoDFe = new NFEDistribuicaoDFePorNSU(distribuicaoDFeService);
            const response = await distribuicaoDFe.Exec(data);

            console.log('Retorno NFE_DistribuicaoDFePorNSU');
            console.log(`   ${response.xMotivo}`);
            console.log('===================================');

            return response.data
        } catch (error: any) {
            logger.error(``, error, { context: 'NFE_DistribuicaoDFePorNSU', });
            throw new Error(`NFE_DistribuicaoDFePorNSU: ${error.message}`)
        }
    }
    async NFE_DistribuicaoDFePorChave(data: DFePorChaveNFe) {
        try {
            const distribuicaoDFeService = new NFEDistribuicaoDFePorChaveService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta);
            const distribuicaoDFe = new NFEDistribuicaoDFePorChave(distribuicaoDFeService);
            const response = await distribuicaoDFe.Exec(data);

            console.log('Retorno NFE_DistribuicaoDFePorChave');
            console.log(`   ${response.xMotivo}`);
            console.log('===================================');

            return response.data
        } catch (error: any) {
            logger.error(``, error, { context: 'NFE_DistribuicaoDFePorChave', });
            throw new Error(`NFE_DistribuicaoDFePorChave: ${error.message}`)
        }
    }

    /**
     * Autorização
     */
    async NFE_Autorizacao(data: NFe) {
        try {
            const autorizacaoService = new NFEAutorizacaoService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta);
            const autorizacao = new NFEAutorizacao(autorizacaoService);
            const response = await autorizacao.Exec(data);

            console.log('Retorno NFE_Autorizacao');
            console.table(response.xMotivo);
            console.log('===================================');

            return response.xmls
        } catch (error: any) {
            logger.error(``, error, { context: 'NFE_Autorizacao', });
            throw new Error(`NFE_Autorizacao: ${error.message}`)
        }
    }
    async NFCE_Autorizacao(data: NFe) {
        try {
            const autorizacaoService = new NFCEAutorizacaoService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta);
            const autorizacao = new NFCEAutorizacao(autorizacaoService);
            const response = await autorizacao.Exec(data);

            console.log('Retorno NFCE_Autorizacao');
            console.table(response.xMotivo);
            console.log('===================================');

            return response.xmls
        } catch (error: any) {
            logger.error(``, error, { context: 'NFCE_Autorizacao', });
            throw new Error(`NFCE_Autorizacao: ${error.message}`)
        }
    }

    /**
     * Inutilização
     */
    async NFE_Inutilizacao(data: InutilizacaoData) {
        try {
            const inutilizacaoService = new NFEInutilizacaoService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta);
            const inutilizacao = new NFEInutilizacao(inutilizacaoService);
            const response = await inutilizacao.Exec(data);

            console.log('Retorno NFE_Inutilizacao');
            console.log(`   ${response.xMotivo}`);
            console.log('===================================');

            return response
        } catch (error: any) {
            logger.error(``, error, { context: 'NFE_Inutilizacao', });
            throw new Error(`NFE_Inutilizacao: ${error.message}`)
        }
    }


    /**
     * DANFE
     */
    async NFE_GerarDanfe(data: NFEGerarDanfeProps) {
        try {
            const { dfe: { exibirMarcaDaguaDanfe } } = this.environment.getConfig();
            const distribuicaoDFe = new NFEGerarDanfe(data);
            const response = await distribuicaoDFe.generatePDF(exibirMarcaDaguaDanfe);

            console.log('Retorno NFE_GerarDanfe');
            console.log(response.message);
            console.log('===================================');

            return response
        } catch (error: any) {
            logger.error(``, error, { context: 'NFE_GerarDanfe', });
            throw new Error(`NFE_GerarDanfe: ${error.message}`)
        }
    }
    async NFCE_GerarDanfe(data: NFEGerarDanfeProps) {
        try {
            const { dfe: { exibirMarcaDaguaDanfe } } = this.environment.getConfig();
            const distribuicaoDFe = new NFCEGerarDanfe(data);
            const response = await distribuicaoDFe.generatePDF(exibirMarcaDaguaDanfe);

            console.log('Retorno NFCE_GerarDanfe');
            console.log(response.message);
            console.log('===================================');

            return response
        } catch (error: any) {
            logger.error(``, error, { context: 'NFCE_GerarDanfe', });
            throw new Error(`NFCE_GerarDanfe: ${error.message}`)
        }
    }

    /**
     * Método para envio de e-mail
     * @param {EmailParams} mailParams - Mensagem de texto (aceita html)
     */
    NFE_EnviaEmail(mailParams: EmailParams) {
        try {
            const mailController = new MailController(this.environment);
            const response = mailController.sendEmail(mailParams);

            console.log('Retorno NFE_EnviaEmail');
            console.log('E-mail enviado com sucesso.');
            console.log('===================================');

            return response
        } catch (error: any) {
            logger.error(``, error, { context: 'NFE_EnviaEmail', });
            throw new Error(`NFE_EnviaEmail: ${error.message}`)
        }
    }

    /**
     * Validação de ambiente
     */
    private async validateEnvironment(prop: string): Promise<void> {
        if (!this.environment.isLoaded) {
            throw new Error(`Ambiente não carregado. Por favor, carregue o ambiente utilizando o método "NFE_LoadEnvironment({ sua_configuracao })" antes de chamar o método ${prop}.`);
        }
    }
}

export default NFeWizardService;