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

import NFERecepcaoEvento from '../controllers/DFe/NFe/NFERecepcaoEvento/NFERecepcaoEvento';
import NFEStatusServico from '../controllers/DFe/NFe/NFEStatusServico/NFEStatusServico';
import NFEDistribuicaoDFe from '../controllers/DFe/NFe/NFEDistribuicaoDFe/NFEDistribuicaoDFe';
import NFEConsultaProtocolo from '../controllers/DFe/NFe/NFEConsultaProtocolo/NFEconsultaProtocolo';
import Utility from '../utils/Utility';
import Environment from './Environment';
import XmlBuilder from './XmlBuilder';
import NFEAutorizacao from '../controllers/DFe/NFe/NFEAutorizacao/NFEAutorizacao';
import NFEInutilizacao from '../controllers/DFe/NFe/NFEInutilizacao/NFEInutilizacao';

import {
    NFeWizardProps,
    EventoNFe,
    ConsultaNFe,
    NFe,
    InutilizacaoData,
    NFEGerarDanfeProps,
    DFePorChaveNFe,
    DFePorUltimoNSU,
    DFePorNSU,
    Cancelamento,
    CienciaDaOperacao,
    ConfirmacaoDaOperacao,
    OperacaoNaoRealizada,
    CartaDeCorrecao,
    DesconhecimentoDaOperacao,
    EPEC,
    EmailParams,
} from '@Protocols';
import NFEGerarDanfe from '@Controllers/Danfe/NFEGerarDanfe';
import NFEDistribuicaoDFePorUltNSU from '@Controllers/DFe/NFe/NFEDistribuicaoDFe/NFEDistribuicaoDFePorUltNSU';
import NFEDistribuicaoDFePorNSU from '@Controllers/DFe/NFe/NFEDistribuicaoDFe/NFEDistribuicaoDFePorNSU';
import NFEDistribuicaoDFePorChave from '@Controllers/DFe/NFe/NFEDistribuicaoDFe/NFEDistribuicaoDFePorChave';
import NFECancelamento from '@Controllers/DFe/NFe/NFERecepcaoEvento/NFECancelamento';
import NFECienciaDaOperacao from '@Controllers/DFe/NFe/NFERecepcaoEvento/NFECienciaDaOperacao';
import NFEConfirmacaoDaOperacao from '@Controllers/DFe/NFe/NFERecepcaoEvento/NFEConfirmacaoDaOperacao';
import NFEOperacaoNaoRealizada from '@Controllers/DFe/NFe/NFERecepcaoEvento/NFEOperacaoNaoRealizada';
import NFECartaDeCorrecao from '@Controllers/DFe/NFe/NFERecepcaoEvento/NFECartaDeCorrecao';
import NFEDesconhecimentoDaOperacao from '@Controllers/DFe/NFe/NFERecepcaoEvento/NFEDesconhecimentoDaOperacao';
import NFEEpec from '@Controllers/DFe/NFe/NFERecepcaoEvento/NFEEpec';
import { AxiosInstance } from 'axios';
import MailController from '@Controllers/Email/MailController';

class NFeWizard {
    private config: NFeWizardProps;
    private certificate = null;
    private cert_key = null;
    private environment: Environment;
    private utility: Utility;
    private xmlBuilder: XmlBuilder;
    private axios: AxiosInstance;
    constructor() {
        this.config = {} as NFeWizardProps;
        this.certificate = null;
        this.cert_key = null;
        this.environment = {} as Environment;
        this.utility = {} as Utility;
        this.xmlBuilder = {} as XmlBuilder;
        this.axios = {} as AxiosInstance;

        if (new.target) {
            return new Proxy(this, {
                get(target: NFeWizard, prop: string | symbol, receiver: any): any {
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

            // Inicia método de geração de XML
            this.xmlBuilder = new XmlBuilder(this.environment)

            console.log('===================================');
            console.log('Biblioteca Inicializada com Sucesso');
            console.log('===================================');

        } catch (error) {
            console.log(error)
            throw new Error(`Erro ao inicializar a lib: ${error}`)
        }
    }

    /**
     * Status Serviço
     */
    async NFE_ConsultaStatusServico() {
        try {
            const nfeStatusServico = new NFEStatusServico(this.environment, this.utility, this.xmlBuilder, this.axios);
            const response = await nfeStatusServico.Exec();

            console.log('Retorno NFE_ConsultaStatusServico');
            console.log(`   ${response.xMotivo}`);
            console.log('===================================');

            return response
        } catch (error: any) {
            throw new Error(`NFE_ConsultaStatusServico: ${error.message}`)
        }
    }

    /**
     * Consulta Protocolo
     */
    async NFE_ConsultaProtocolo(chave: string) {
        try {
            const nfeConsultaProtocolo = new NFEConsultaProtocolo(this.environment, this.utility, this.xmlBuilder, this.axios);
            const response = await nfeConsultaProtocolo.Exec(chave);

            console.log('Retorno NFE_ConsultaProtocolo');
            console.log(`   ${response.xMotivo}`);
            console.log('===================================');

            return response
        } catch (error: any) {
            throw new Error(`NFE_ConsultaProtocolo: ${error.message}`)
        }
    }

    /**
     * Recepção de Eventos
     */
    async NFE_RecepcaoEvento(evento: EventoNFe) {
        try {
            const nfeRecepcaoEvento = new NFERecepcaoEvento(this.environment, this.utility, this.xmlBuilder, this.axios);
            const response = await nfeRecepcaoEvento.Exec(evento);

            console.log('Retorno NFE_RecepcaoEvento');
            console.table(response.xMotivos);
            console.log('===================================');

            return response.response
        } catch (error: any) {
            throw new Error(`NFE_RecepcaoEvento: ${error.message}`)
        }
    }
    async NFE_EventoPrevioDeEmissaoEmContingencia(evento: EPEC) {
        try {
            const nfeEpec = new NFEEpec(this.environment, this.utility, this.xmlBuilder, this.axios);
            const response = await nfeEpec.Exec(evento);

            console.log('Retorno NFEEpec');
            console.table(response.xMotivos);
            console.log('===================================');

            return response.response
        } catch (error: any) {
            throw new Error(`NFEEpec: ${error.message}`)
        }
    }
    async NFE_Cancelamento(evento: Cancelamento) {
        try {
            const nfeCancelamento = new NFECancelamento(this.environment, this.utility, this.xmlBuilder, this.axios);
            const response = await nfeCancelamento.Exec(evento);

            console.log('Retorno NFE_Cancelamento');
            console.table(response.xMotivos);
            console.log('===================================');

            return response.response
        } catch (error: any) {
            throw new Error(`NFE_Cancelamento: ${error.message}`)
        }
    }
    async NFE_CienciaDaOperacao(evento: CienciaDaOperacao) {
        try {
            const nfeCienciaDaOperacao = new NFECienciaDaOperacao(this.environment, this.utility, this.xmlBuilder, this.axios);
            const response = await nfeCienciaDaOperacao.Exec(evento);

            console.log('Retorno NFE_CienciaDaOperacao');
            console.table(response.xMotivos);
            console.log('===================================');

            return response.response
        } catch (error: any) {
            throw new Error(`NFE_CienciaDaOperacao: ${error.message}`)
        }
    }
    async NFE_ConfirmacaoDaOperacao(evento: ConfirmacaoDaOperacao) {
        try {
            const nfeConfirmacaoDaOperacao = new NFEConfirmacaoDaOperacao(this.environment, this.utility, this.xmlBuilder, this.axios);
            const response = await nfeConfirmacaoDaOperacao.Exec(evento);

            console.log('Retorno NFE_ConfirmacaoDaOperacao');
            console.table(response.xMotivos);
            console.log('===================================');

            return response.response
        } catch (error: any) {
            throw new Error(`NFE_ConfirmacaoDaOperacao: ${error.message}`)
        }
    }
    async NFE_OperacaoNaoRealizada(evento: OperacaoNaoRealizada) {
        try {
            const nfeOperacaoNaoRealizada = new NFEOperacaoNaoRealizada(this.environment, this.utility, this.xmlBuilder, this.axios);
            const response = await nfeOperacaoNaoRealizada.Exec(evento);

            console.log('Retorno NFE_OperacaoNaoRealizada');
            console.table(response.xMotivos);
            console.log('===================================');

            return response.response
        } catch (error: any) {
            throw new Error(`NFE_OperacaoNaoRealizada: ${error.message}`)
        }
    }
    async NFE_CartaDeCorrecao(evento: CartaDeCorrecao) {
        try {
            const nfeCartaDeCorrecao = new NFECartaDeCorrecao(this.environment, this.utility, this.xmlBuilder, this.axios);
            const response = await nfeCartaDeCorrecao.Exec(evento);

            console.log('Retorno NFE_CartaDeCorrecao');
            console.table(response.xMotivos);
            console.log('===================================');

            return response.response
        } catch (error: any) {
            throw new Error(`NFE_CartaDeCorrecao: ${error.message}`)
        }
    }
    async NFE_DesconhecimentoDaOperacao(evento: DesconhecimentoDaOperacao) {
        try {
            const nfeDesconhecimentoDaOperacao = new NFEDesconhecimentoDaOperacao(this.environment, this.utility, this.xmlBuilder, this.axios);
            const response = await nfeDesconhecimentoDaOperacao.Exec(evento);

            console.log('Retorno NFE_DesconhecimentoDaOperacao');
            console.table(response.xMotivos);
            console.log('===================================');

            return response.response
        } catch (error: any) {
            throw new Error(`NFE_DesconhecimentoDaOperacao: ${error.message}`)
        }
    }

    /**
     * Distribuição DFe
     */
    async NFE_DistribuicaoDFe(data: ConsultaNFe) {
        try {
            const distribuicaoDFe = new NFEDistribuicaoDFe(this.environment, this.utility, this.xmlBuilder, this.axios);
            const response = await distribuicaoDFe.Exec(data);

            console.log('Retorno NFE_DistribuicaoDFe');
            console.log(`   ${response.xMotivo}`);
            console.log('===================================');

            return response.data
        } catch (error: any) {
            throw new Error(`NFE_DistribuicaoDFe: ${error.message}`)
        }
    }
    async NFE_DistribuicaoDFePorUltNSU(data: DFePorUltimoNSU) {
        try {
            const distribuicaoDFe = new NFEDistribuicaoDFePorUltNSU(this.environment, this.utility, this.xmlBuilder, this.axios);
            const response = await distribuicaoDFe.Exec(data);

            console.log('Retorno NFE_DistribuicaoDFePorUltNSU');
            console.log(`   ${response.xMotivo}`);
            console.log('===================================');

            return response.data
        } catch (error: any) {
            throw new Error(`NFE_DistribuicaoDFePorUltNSU: ${error.message}`)
        }
    }
    async NFE_DistribuicaoDFePorNSU(data: DFePorNSU) {
        try {
            const distribuicaoDFe = new NFEDistribuicaoDFePorNSU(this.environment, this.utility, this.xmlBuilder, this.axios);
            const response = await distribuicaoDFe.Exec(data);

            console.log('Retorno NFE_DistribuicaoDFePorNSU');
            console.log(`   ${response.xMotivo}`);
            console.log('===================================');

            return response.data
        } catch (error: any) {
            throw new Error(`NFE_DistribuicaoDFePorNSU: ${error.message}`)
        }
    }
    async NFE_DistribuicaoDFePorChave(data: DFePorChaveNFe) {
        try {
            const distribuicaoDFe = new NFEDistribuicaoDFePorChave(this.environment, this.utility, this.xmlBuilder, this.axios);
            const response = await distribuicaoDFe.Exec(data);

            console.log('Retorno NFE_DistribuicaoDFePorChave');
            console.log(`   ${response.xMotivo}`);
            console.log('===================================');

            return response.data
        } catch (error: any) {
            throw new Error(`NFE_DistribuicaoDFePorChave: ${error.message}`)
        }
    }

    /**
     * Autorização
     */
    async NFE_Autorizacao(data: NFe) {
        try {
            const distribuicaoDFe = new NFEAutorizacao(this.environment, this.utility, this.xmlBuilder, this.axios);
            const response = await distribuicaoDFe.Exec(data);

            console.log('Retorno NFE_Autorizacao');
            console.table(response.xMotivo);
            console.log('===================================');

            return response.xmls
        } catch (error: any) {
            throw new Error(`NFE_Autorizacao: ${error.message}`)
        }
    }

    /**
     * Inutilização
     */
    async NFE_Inutilizacao(data: InutilizacaoData) {
        try {
            const distribuicaoDFe = new NFEInutilizacao(this.environment, this.utility, this.xmlBuilder, this.axios);
            const response = await distribuicaoDFe.Exec(data);

            console.log('Retorno NFE_Inutilizacao');
            console.log(`   ${response.xMotivo}`);
            console.log('===================================');

            return response
        } catch (error: any) {
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
            throw new Error(`NFE_GerarDanfe: ${error.message}`)
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

export default NFeWizard;