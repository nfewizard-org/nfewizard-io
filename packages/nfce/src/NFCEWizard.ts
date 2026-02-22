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
import { Cancelamento } from '@nfewizard/types/nfe';
import { Environment, Utility, XmlBuilder, GerarConsulta, SaveFiles, logger } from '@nfewizard/shared';
import { AxiosInstance } from 'axios';
import { NFCEAutorizacaoService } from './services/NFCEAutorizacao/NFCEAutorizacaoService.js';
import { NFCECancelamentoService } from './services/NFCERecepcaoEvento/NFCECancelamentoService.js';
import { NFCEAutorizacao } from './operations/NFCEAutorizacao/NFCEAutorizacao.js';
import { NFCECancelamento } from './operations/NFCERecepcaoEvento/NFCECancelamento.js';

/**
 * Classe principal para operações NFCe
 * Fornece interface simplificada para autorização e consulta de NFCe
 * Segue o mesmo padrão de NFeWizard do pacote principal
 */
export class NFCEWizard {
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
     * Carrega as configurações do ambiente NFCe
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
     * Autoriza uma NFCe
     * @param nfce - Dados da NFCe (opcional, pode ser passado na inicialização)
     * @returns Resultado da autorização
     */
    async NFCE_Autorizacao(nfce?: any): Promise<any> {
        try {
            const nfceAutorizacaoService = new NFCEAutorizacaoService(
                this.environment, 
                this.utility, 
                this.xmlBuilder, 
                this.axios, 
                this.saveFiles, 
                this.gerarConsulta
            );
            const nfceAutorizacao = new NFCEAutorizacao(nfceAutorizacaoService);
            const response = await nfceAutorizacao.Exec(nfce);

            console.log('Retorno NFCE_Autorizacao');
            console.table(response.xMotivo);
            console.log('===================================');

            return response.xmls
        } catch (error: any) {
            logger.error(``, error, { context: 'NFCE_Autorizacao' });
            throw new Error(`NFCE_Autorizacao: ${error.message}`)
        }
    }

    /**
     * Consulta o retorno da autorização de uma NFCe
     * @param recibo - Número do recibo da autorização
     * @returns Resultado da consulta
     */
    // async NFCE_RetornoAutorizacao(recibo?: string): Promise<any> {
    //     try {
    //         const nfceRetornoAutorizacaoService = new NFCERetornoAutorizacaoService(
    //             this.environment, 
    //             this.utility, 
    //             this.xmlBuilder, 
    //             this.axios, 
    //             this.saveFiles, 
    //             this.gerarConsulta
    //         );
    //         const nfceRetornoAutorizacao = new NFCERetornoAutorizacao(nfceRetornoAutorizacaoService);
    //         return await nfceRetornoAutorizacao.Exec(recibo);
    //     } catch (error) {
    //         logger.error(``, error, { context: 'NFCE_RetornoAutorizacao' });
    //         throw error;
    //     }
    // }

    /**
     * Cancelamento de NFCe
     * @param evento - Dados do evento de cancelamento
     * @returns Resultado do cancelamento
     */
    async NFCE_Cancelamento(evento: Cancelamento): Promise<any> {
        try {
            // Adiciona automaticamente o modelo 65 para NFCe
            const eventoComModelo = {
                ...evento,
                modelo: '65'
            };

            const nfceCancelamentoService = new NFCECancelamentoService(
                this.environment, 
                this.utility, 
                this.xmlBuilder, 
                this.axios, 
                this.saveFiles, 
                this.gerarConsulta
            );
            const nfceCancelamento = new NFCECancelamento(nfceCancelamentoService);
            const response = await nfceCancelamento.Exec(eventoComModelo);

            console.log('Retorno NFCE_Cancelamento');
            console.table(response.xMotivos);
            console.log('===================================');

            return response;
        } catch (error: any) {
            logger.error(``, error, { context: 'NFCE_Cancelamento' });
            throw new Error(`NFCE_Cancelamento: ${error.message}`);
        }
    }

    /**
     * Obtém a instância do Environment (para acesso avançado)
     */
    getEnvironment(): Environment {
        return this.environment;
    }
}
