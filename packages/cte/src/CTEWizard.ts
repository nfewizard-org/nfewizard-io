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
     * Obtém a instância do Environment (para acesso avançado)
     */
    getEnvironment(): Environment {
        return this.environment;
    }
}
