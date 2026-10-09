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

import { NFeWizardProps } from '@nfewizard/types/shared';
import { ConsultaCTe, DFePorNSUCTe, DFePorUltimoNSUCTe } from '@nfewizard/types/cte';
import { Environment, Utility, XmlBuilder, GerarConsulta, SaveFiles, logger } from '@nfewizard/shared';
import { AxiosInstance } from 'axios';
import { CTEDistribuicaoDFeService } from './services/CTEDistribuicaoDFe/CTEDistribuicaoDFeService.js';
import { CTEDistribuicaoDFe } from './operations/CTEDistribuicaoDFe/CTEDistribuicaoDFe.js';
import { CTEDistribuicaoDFePorNSU } from './operations/CTEDistribuicaoDFe/CTEDistribuicaoDFePorNSU.js';
import { CTEDistribuicaoDFePorUltNSU } from './operations/CTEDistribuicaoDFe/CTEDistribuicaoDFePorUltNSU.js';
import { CTEStatusServicoService } from './services/CTEStatusServico/CTEStatusServicoService.js';
import { CTEStatusServico } from './operations/CTEStatusServico/CTEStatusServico.js';
import { CTEConsultaProtocoloService } from './services/CTEConsultaProtocolo/CTEConsultaProtocoloService.js';
import { CTEConsultaProtocolo } from './operations/CTEConsultaProtocolo/CTEConsultaProtocolo.js';
import { CTEAutorizacaoService } from './services/CTEAutorizacao/CTEAutorizacaoService.js';
import { CTEAutorizacao } from './operations/CTEAutorizacao/CTEAutorizacao.js';
import { CTe as CTeAutorizacaoData, CancelamentoCTe, CartaDeCorrecaoCTe, EpecCTe, CTeOS, GTVe, CTeSimp, RegistroMultimodalCTe, PrestacaoDesacordoCTe, CancelamentoPrestacaoDesacordoCTe, ComprovanteEntregaCTe, CancelamentoComprovanteEntregaCTe, InsucessoEntregaCTe, CancelamentoInsucessoEntregaCTe, VinculacaoPagamentoCTe, CancelamentoVinculacaoPagamentoCTe } from '@nfewizard/types/cte';
import { CTECancelamentoService } from './services/CTERecepcaoEvento/CTECancelamentoService.js';
import { CTECancelamento } from './operations/CTERecepcaoEvento/CTECancelamento.js';
import { CTECartaDeCorrecaoService } from './services/CTERecepcaoEvento/CTECartaDeCorrecaoService.js';
import { CTECartaDeCorrecao } from './operations/CTERecepcaoEvento/CTECartaDeCorrecao.js';
import { CTEEpecService } from './services/CTERecepcaoEvento/CTEEpecService.js';
import { CTEEpec } from './operations/CTERecepcaoEvento/CTEEpec.js';
import { CTEAutorizacaoOSService } from './services/CTEAutorizacaoOS/CTEAutorizacaoOSService.js';
import { CTEAutorizacaoOS } from './operations/CTEAutorizacaoOS/CTEAutorizacaoOS.js';
import { GTVeAutorizacaoService } from './services/GTVeAutorizacao/GTVeAutorizacaoService.js';
import { GTVeAutorizacao } from './operations/GTVeAutorizacao/GTVeAutorizacao.js';
import { CTESimplificadoAutorizacaoService } from './services/CTESimplificadoAutorizacao/CTESimplificadoAutorizacaoService.js';
import { CTESimplificadoAutorizacao } from './operations/CTESimplificadoAutorizacao/CTESimplificadoAutorizacao.js';
import { CTEConsultaCadastroService } from './services/CTEConsultaCadastro/CTEConsultaCadastroService.js';
import { CTEConsultaCadastro } from './operations/CTEConsultaCadastro/CTEConsultaCadastro.js';
import { ConsultaCadastroData } from '@nfewizard/types/nfe';
import { CTERegistroMultimodalService } from './services/CTERecepcaoEvento/CTERegistroMultimodalService.js';
import { CTERegistroMultimodal } from './operations/CTERecepcaoEvento/CTERegistroMultimodal.js';
import { CTEPrestacaoDesacordoService } from './services/CTERecepcaoEvento/CTEPrestacaoDesacordoService.js';
import { CTEPrestacaoDesacordo } from './operations/CTERecepcaoEvento/CTEPrestacaoDesacordo.js';
import { CTECancelamentoPrestacaoDesacordoService } from './services/CTERecepcaoEvento/CTECancelamentoPrestacaoDesacordoService.js';
import { CTECancelamentoPrestacaoDesacordo } from './operations/CTERecepcaoEvento/CTECancelamentoPrestacaoDesacordo.js';
import { CTEComprovanteEntregaService } from './services/CTERecepcaoEvento/CTEComprovanteEntregaService.js';
import { CTEComprovanteEntrega } from './operations/CTERecepcaoEvento/CTEComprovanteEntrega.js';
import { CTECancelamentoComprovanteEntregaService } from './services/CTERecepcaoEvento/CTECancelamentoComprovanteEntregaService.js';
import { CTECancelamentoComprovanteEntrega } from './operations/CTERecepcaoEvento/CTECancelamentoComprovanteEntrega.js';
import { CTEInsucessoEntregaService } from './services/CTERecepcaoEvento/CTEInsucessoEntregaService.js';
import { CTEInsucessoEntrega } from './operations/CTERecepcaoEvento/CTEInsucessoEntrega.js';
import { CTECancelamentoInsucessoEntregaService } from './services/CTERecepcaoEvento/CTECancelamentoInsucessoEntregaService.js';
import { CTECancelamentoInsucessoEntrega } from './operations/CTERecepcaoEvento/CTECancelamentoInsucessoEntrega.js';
import { CTEVinculacaoPagamentoService } from './services/CTERecepcaoEvento/CTEVinculacaoPagamentoService.js';
import { CTEVinculacaoPagamento } from './operations/CTERecepcaoEvento/CTEVinculacaoPagamento.js';
import { CTECancelamentoVinculacaoPagamentoService } from './services/CTERecepcaoEvento/CTECancelamentoVinculacaoPagamentoService.js';
import { CTECancelamentoVinculacaoPagamento } from './operations/CTERecepcaoEvento/CTECancelamentoVinculacaoPagamento.js';

/**
 * Classe principal para operações CTe
 * Fornece interface simplificada para distribuição de CTe
 * Segue o mesmo padrão de NFeWizard do pacote principal
 */
export class CTEWizard {
    private config: NFeWizardProps = {} as NFeWizardProps;
    private environment: Environment = {} as Environment;
    private utility: Utility = {} as Utility;
    private xmlBuilder: XmlBuilder = {} as XmlBuilder;
    private axios: AxiosInstance = {} as AxiosInstance;
    private saveFiles: SaveFiles = {} as SaveFiles;
    private gerarConsulta: GerarConsulta = {} as GerarConsulta;

    constructor() {
        // Construtor vazio - environment será carregado via NFE_LoadEnvironment
    }

    /**
     * Carrega as configurações do ambiente CTe
     * @param config - Configurações do NFeWizard (mesmo formato do pacote principal)
     */
    async NFE_LoadEnvironment({ config }: { config: NFeWizardProps }) {
        try {
            this.config = config;
            // Carrega Ambiente (mesmo padrão do NFeWizard)
            this.environment = new Environment(this.config);
            const { axios } = await this.environment.loadEnvironment();
            this.axios = axios;

            // Inicia método de Utilitários
            this.utility = new Utility(this.environment);
            this.saveFiles = new SaveFiles(this.environment, this.utility);

            // Inicia método de geração de XML
            this.xmlBuilder = new XmlBuilder(this.environment);
            this.gerarConsulta = new GerarConsulta(this.environment, this.utility, this.xmlBuilder);

        } catch (error) {
            logger.error(``, error, { context: 'NFE_LoadEnvironment' });
            throw new Error(`Erro ao inicializar a lib: ${error}`);
        }
    }

    /**
     * Consulta distribuição de CTe
     * @param data - Dados da consulta
     * @returns Resultado da distribuição
     */
    async CTE_DistribuicaoDFe(data: ConsultaCTe): Promise<any> {
        try {
            const cteDistribuicaoDFeService = new CTEDistribuicaoDFeService(
                this.environment, 
                this.utility, 
                this.xmlBuilder, 
                this.axios, 
                this.saveFiles, 
                this.gerarConsulta
            );
            const cteDistribuicaoDFe = new CTEDistribuicaoDFe(cteDistribuicaoDFeService);
            const response = await cteDistribuicaoDFe.Exec(data);
            
            // Exibe resultado no console
            if (response?.data?.retDistDFeInt) {
                console.table([{
                    Status: response.data.retDistDFeInt.cStat,
                    Motivo: response.data.retDistDFeInt.xMotivo,
                    UltNSU: response.data.retDistDFeInt.ultNSU || '-',
                    MaxNSU: response.data.retDistDFeInt.maxNSU || '-',
                    Arquivos: response.filesList?.length || 0
                }]);
            }
            
            return response;
        } catch (error) {
            logger.error(``, error, { context: 'CTE_DistribuicaoDFe' });
            throw error;
        }
    }

    /**
     * Consulta distribuição de CTe por NSU
     * @param data - Dados da consulta com NSU específico
     * @returns Resultado da distribuição
     */
    async CTE_DistribuicaoDFePorNSU(data: DFePorNSUCTe): Promise<any> {
        try {
            const cteDistribuicaoDFePorNSU = new CTEDistribuicaoDFePorNSU(
                this.environment, 
                this.utility, 
                this.xmlBuilder, 
                this.axios, 
                this.saveFiles, 
                this.gerarConsulta
            );
            const response = await cteDistribuicaoDFePorNSU.Exec(data);
            
            // Exibe resultado no console
            if (response?.data?.retDistDFeInt) {
                console.table([{
                    Status: response.data.retDistDFeInt.cStat,
                    Motivo: response.data.retDistDFeInt.xMotivo,
                    NSU: data.consNSU?.NSU || '-',
                    Arquivos: response.filesList?.length || 0
                }]);
            }
            
            return response;
        } catch (error) {
            logger.error(``, error, { context: 'CTE_DistribuicaoDFePorNSU' });
            throw error;
        }
    }

    /**
     * Consulta distribuição de CTe por último NSU
     * @param data - Dados da consulta com último NSU
     * @returns Resultado da distribuição
     */
    async CTE_DistribuicaoDFePorUltNSU(data: DFePorUltimoNSUCTe): Promise<any> {
        try {
            const cteDistribuicaoDFePorUltNSU = new CTEDistribuicaoDFePorUltNSU(
                this.environment, 
                this.utility, 
                this.xmlBuilder, 
                this.axios, 
                this.saveFiles, 
                this.gerarConsulta
            );
            const response = await cteDistribuicaoDFePorUltNSU.Exec(data);
            
            // Exibe resultado no console
            if (response?.data?.retDistDFeInt) {
                console.table([{
                    Status: response.data.retDistDFeInt.cStat,
                    Motivo: response.data.retDistDFeInt.xMotivo,
                    UltNSU: response.data.retDistDFeInt.ultNSU || '-',
                    MaxNSU: response.data.retDistDFeInt.maxNSU || '-',
                    Arquivos: response.filesList?.length || 0
                }]);
            }
            
            return response;
        } catch (error) {
            logger.error(``, error, { context: 'CTE_DistribuicaoDFePorUltNSU' });
            throw error;
        }
    }

    /**
     * Consulta o status do serviço de autorização do CT-e (disponibilidade da SEFAZ/UF do emitente)
     * @returns Resultado da consulta (cStat 107=em operação, 108/109=paralisado)
     */
    async CTE_ConsultaStatusServico(): Promise<any> {
        try {
            const cteStatusServicoService = new CTEStatusServicoService(
                this.environment,
                this.utility,
                this.xmlBuilder,
                this.axios,
                this.saveFiles,
                this.gerarConsulta
            );
            const cteStatusServico = new CTEStatusServico(cteStatusServicoService);
            const response = await cteStatusServico.Exec();

            if (response?.retConsStatServCTe) {
                console.table([{
                    Status: response.retConsStatServCTe.cStat,
                    Motivo: response.retConsStatServCTe.xMotivo,
                    TempoMedio: response.retConsStatServCTe.tMed || '-',
                }]);
            }

            return response;
        } catch (error) {
            logger.error(``, error, { context: 'CTE_ConsultaStatusServico' });
            throw error;
        }
    }

    /**
     * Consulta a situação/protocolo de um CT-e já transmitido
     * @param chCTe - Chave de acesso do CT-e (44 dígitos)
     * @returns Resultado da consulta (cStat 100=autorizado, 101=cancelamento homologado, 217=não consta na base)
     */
    async CTE_ConsultaProtocolo(chCTe: string): Promise<any> {
        try {
            const cteConsultaProtocoloService = new CTEConsultaProtocoloService(
                this.environment,
                this.utility,
                this.xmlBuilder,
                this.axios,
                this.saveFiles,
                this.gerarConsulta
            );
            const cteConsultaProtocolo = new CTEConsultaProtocolo(cteConsultaProtocoloService);
            const response = await cteConsultaProtocolo.Exec(chCTe);

            if (response?.retConsSitCTe) {
                console.table([{
                    Status: response.retConsSitCTe.cStat,
                    Motivo: response.retConsSitCTe.xMotivo,
                }]);
            }

            return response;
        } catch (error) {
            logger.error(``, error, { context: 'CTE_ConsultaProtocolo' });
            throw error;
        }
    }

    /**
     * Autoriza um ou mais CT-e de Transporte de Carga (modelo 57) junto à SEFAZ da UF do emitente.
     * Aceita o payload em JSON (`{ CTe: LayoutCTe | LayoutCTe[] }`) ou um XML já montado
     * (`cteProc`/`CTe` solo). Cada CT-e é transmitido em uma chamada síncrona separada.
     * @param data - Dados do(s) CT-e a autorizar, ou XML string
     * @returns Resultado da autorização (success, xMotivo por CT-e, xmls com CTe/protCTe/xmlAssinado)
     */
    async CTE_Autorizacao(data: CTeAutorizacaoData | string): Promise<any> {
        try {
            const cteAutorizacaoService = new CTEAutorizacaoService(
                this.environment,
                this.utility,
                this.xmlBuilder,
                this.axios,
                this.saveFiles,
                this.gerarConsulta
            );
            const cteAutorizacao = new CTEAutorizacao(cteAutorizacaoService);
            const response = await cteAutorizacao.Exec(data);

            if (response?.xMotivo?.length) {
                console.table(response.xMotivo.map((item: any) => ({
                    Chave: item.chCTe || '-',
                    Status: item.cStat,
                    Motivo: item.xMotivo,
                })));
            }

            return response;
        } catch (error) {
            logger.error(``, error, { context: 'CTE_Autorizacao' });
            throw error;
        }
    }

    private logEventoResultado(response: any) {
        if (response?.xMotivos?.length) {
            console.table(response.xMotivos.map((item: any) => ({
                Chave: item.chCTe || '-',
                Evento: item.tpEvento,
                Status: item.cStat,
                Motivo: item.xMotivo,
            })));
        }
    }

    /**
     * Cancela um CT-e (evento 110111). Prazo: 168h após a autorização (CT-e 57/67) ou 45 dias (GTV-e),
     * salvo liberação do Fisco.
     */
    async CTE_Cancelamento(data: CancelamentoCTe): Promise<any> {
        try {
            const service = new CTECancelamentoService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta);
            const response = await new CTECancelamento(service).Exec(data);
            this.logEventoResultado(response);
            return response;
        } catch (error) {
            logger.error(``, error, { context: 'CTE_Cancelamento' });
            throw error;
        }
    }

    /**
     * Registra uma Carta de Correção Eletrônica (evento 110110) para CT-e 57/67.
     * Campos que alteram valores, cadastro de partes ou datas são bloqueados antes do envio.
     */
    async CTE_CartaDeCorrecao(data: CartaDeCorrecaoCTe): Promise<any> {
        try {
            const service = new CTECartaDeCorrecaoService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta);
            const response = await new CTECartaDeCorrecao(service).Exec(data);
            this.logEventoResultado(response);
            return response;
        } catch (error) {
            logger.error(``, error, { context: 'CTE_CartaDeCorrecao' });
            throw error;
        }
    }

    private async executarEvento(contexto: string, operation: { Exec(data?: any): Promise<any> }, data: any): Promise<any> {
        try {
            const response = await operation.Exec(data);
            this.logEventoResultado(response);
            return response;
        } catch (error) {
            logger.error(``, error, { context: contexto });
            throw error;
        }
    }

    /** Registra informações do multimodal (110160) em CT-e multimodal autorizado. */
    async CTE_RegistroMultimodal(data: RegistroMultimodalCTe): Promise<any> {
        return this.executarEvento('CTE_RegistroMultimodal', new CTERegistroMultimodal(new CTERegistroMultimodalService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta)), data);
    }

    /** Prestação do Serviço em Desacordo (610110). Autor é o tomador: informe CNPJ/CPF do tomador. Prazo: 45 dias da autorização. */
    async CTE_PrestacaoDesacordo(data: PrestacaoDesacordoCTe): Promise<any> {
        return this.executarEvento('CTE_PrestacaoDesacordo', new CTEPrestacaoDesacordo(new CTEPrestacaoDesacordoService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta)), data);
    }

    /** Cancela o evento de Prestação do Serviço em Desacordo (610111). Autor é o tomador. */
    async CTE_CancelamentoPrestacaoDesacordo(data: CancelamentoPrestacaoDesacordoCTe): Promise<any> {
        return this.executarEvento('CTE_CancelamentoPrestacaoDesacordo', new CTECancelamentoPrestacaoDesacordo(new CTECancelamentoPrestacaoDesacordoService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta)), data);
    }

    /** Comprovante de Entrega (110180) — somente CT-e 57. */
    async CTE_ComprovanteEntrega(data: ComprovanteEntregaCTe): Promise<any> {
        return this.executarEvento('CTE_ComprovanteEntrega', new CTEComprovanteEntrega(new CTEComprovanteEntregaService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta)), data);
    }

    /** Cancela um Comprovante de Entrega (110181). */
    async CTE_CancelamentoComprovanteEntrega(data: CancelamentoComprovanteEntregaCTe): Promise<any> {
        return this.executarEvento('CTE_CancelamentoComprovanteEntrega', new CTECancelamentoComprovanteEntrega(new CTECancelamentoComprovanteEntregaService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta)), data);
    }

    /** Insucesso na Entrega (110190) — somente CT-e 57, leiaute 4.00. */
    async CTE_InsucessoEntrega(data: InsucessoEntregaCTe): Promise<any> {
        return this.executarEvento('CTE_InsucessoEntrega', new CTEInsucessoEntrega(new CTEInsucessoEntregaService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta)), data);
    }

    /** Cancela um Insucesso na Entrega (110191). */
    async CTE_CancelamentoInsucessoEntrega(data: CancelamentoInsucessoEntregaCTe): Promise<any> {
        return this.executarEvento('CTE_CancelamentoInsucessoEntrega', new CTECancelamentoInsucessoEntrega(new CTECancelamentoInsucessoEntregaService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta)), data);
    }

    /** Vincula transação de pagamento ao CT-e (110300, NT 2026.001). */
    async CTE_VinculacaoPagamento(data: VinculacaoPagamentoCTe): Promise<any> {
        return this.executarEvento('CTE_VinculacaoPagamento', new CTEVinculacaoPagamento(new CTEVinculacaoPagamentoService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta)), data);
    }

    /** Cancela uma Vinculação de Pagamento (110301). */
    async CTE_CancelamentoVinculacaoPagamento(data: CancelamentoVinculacaoPagamentoCTe): Promise<any> {
        return this.executarEvento('CTE_CancelamentoVinculacaoPagamento', new CTECancelamentoVinculacaoPagamento(new CTECancelamentoVinculacaoPagamentoService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta)), data);
    }

    /**
     * Registra o EPEC (110113) — Evento Prévio de Emissão em Contingência, somente CT-e 57.
     * Enviado à SVC da UF do emitente. A chave informada deve ter tpEmis=4; depois, transmita o CT-e
     * ao autorizador normal em até 7 dias com `CTE_TransmitirContingencia`.
     */
    async CTE_Epec(data: EpecCTe): Promise<any> {
        return this.executarEvento('CTE_Epec', new CTEEpec(new CTEEpecService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta)), data);
    }

    /**
     * Transmite ao autorizador normal CT-e emitidos em contingência EPEC (tpEmis=4) ou FS-DA (tpEmis=5)
     * depois que o serviço voltou. CT-e em SVC (tpEmis 7/8) são autorizados direto na SVC por `CTE_Autorizacao`.
     */
    async CTE_TransmitirContingencia(data: CTeAutorizacaoData | string): Promise<any> {
        try {
            const service = new CTEAutorizacaoService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta);
            return await new CTEAutorizacao(service).ExecTransmitirContingencia(data);
        } catch (error) {
            logger.error(``, error, { context: 'CTE_TransmitirContingencia' });
            throw error;
        }
    }

    /** Autoriza CT-e Outros Serviços (modelo 67). Um documento por chamada; arrays são transmitidos em sequência. */
    async CTE_AutorizacaoOS(data: CTeOS): Promise<any> {
        return this.executarAutorizacao('CTE_AutorizacaoOS', new CTEAutorizacaoOS(new CTEAutorizacaoOSService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta)), data);
    }

    /** Autoriza Guia de Transporte de Valores eletrônica (GTV-e, modelo 64). */
    async CTE_GTVeAutorizacao(data: GTVe): Promise<any> {
        return this.executarAutorizacao('CTE_GTVeAutorizacao', new GTVeAutorizacao(new GTVeAutorizacaoService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta)), data);
    }

    /** Autoriza CT-e Simplificado (NT 2024.002): um único tomador e múltiplos remetentes/destinatários. */
    async CTE_SimplificadoAutorizacao(data: CTeSimp): Promise<any> {
        return this.executarAutorizacao('CTE_SimplificadoAutorizacao', new CTESimplificadoAutorizacao(new CTESimplificadoAutorizacaoService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta)), data);
    }

    /**
     * Consulta cadastro de contribuintes do ICMS. O CT-e usa o mesmo serviço da NF-e (`NfeConsultaCadastro`).
     * Esse serviço tem disponibilidade menor que os demais: use como alternativa, fora do fluxo de emissão.
     */
    async CTE_ConsultaCadastro(data: ConsultaCadastroData): Promise<any> {
        try {
            const service = new CTEConsultaCadastroService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta);
            return await new CTEConsultaCadastro(service).Exec(data);
        } catch (error) {
            logger.error(``, error, { context: 'CTE_ConsultaCadastro' });
            throw error;
        }
    }

    private async executarAutorizacao(contexto: string, operation: { Exec(data?: any): Promise<any> }, data: any): Promise<any> {
        try {
            const response = await operation.Exec(data);
            if (response?.xMotivo?.length) {
                console.table(response.xMotivo.map((item: any) => ({ Chave: item.chCTe || '-', Status: item.cStat, Motivo: item.xMotivo })));
            }
            return response;
        } catch (error) {
            logger.error(``, error, { context: contexto });
            throw error;
        }
    }

    /**
     * Obtém a instância do Environment (para acesso avançado)
     */
    getEnvironment(): Environment {
        return this.environment;
    }
}
