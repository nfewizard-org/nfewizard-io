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
import { CTe as CTeAutorizacaoData } from '@nfewizard/types/cte';

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

    /**
     * Obtém a instância do Environment (para acesso avançado)
     */
    getEnvironment(): Environment {
        return this.environment;
    }
}
