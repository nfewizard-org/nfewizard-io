/*
 * This file is part of Treeunfe DFe.
 * 
 * Treeunfe DFe is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * Treeunfe DFe is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with Treeunfe DFe. If not, see <https://www.gnu.org/licenses/>.
 */
import { Environment, GerarConsulta, logger, NFE_SchemaValidate, SaveFiles, SchemaValidateMethod, Utility, XmlBuilder } from '@nfewizard/shared';
import {
  DpsConsultaPorId,
  NFSeAlteracaoBeneficioMunicipal,
  NFSeAlteracaoRetencoes,
  NFSeConfig,
  NFSeConsultaAliquota,
  NFSeConsultaBeneficio,
  NFSeConsultaConvenio,
  NFSeConsultaHistoricoAliquotas,
  NFSeConsultaPorChave,
  NFSeConsultaRegimesEspeciais,
  NFSeDistribuicaoPorNSU,
  NFSeEventoConsulta,
  NFSeEventoRequest,
  NFSeEventosPorChave,
  NFSe as NFSeType,
} from '@nfewizard/types';
import type { AxiosInstance } from 'axios';
import {
  NFSeAutorizacao,
  NFSeConsulta,
  NFSeDistribuicao,
  NFSeEventos,
  NFSeParametrosMunicipais,
} from '../operations';
import {
  NFSeAutorizacaoService,
  NFSeConsultaService,
  NFSeDistribuicaoService,
  NFSeEventosService,
  NFSeParametrosMunicipaisService,
} from '../services';

export default class NFSe {
  private environment: Environment;
  private axios!: AxiosInstance;
  private utility!: Utility;
  private xmlBuilder!: XmlBuilder;
  private saveFiles!: SaveFiles;
  private gerarConsulta!: GerarConsulta;
  private loadEnvironmentPromise: Promise<void>;

  constructor(config: NFSeConfig) {
    // Valida se a configuração obrigatória foi fornecida
    if (!config.nfe?.ambiente) {
      throw new Error('Configuração NFSe incompleta. Por favor, forneça "nfe.ambiente".');
    }

    // Cria o environment próprio - passa a config diretamente
    const environment = new Environment(config);
    this.environment = environment;

    // Carrega o environment automaticamente
    this.loadEnvironmentPromise = (async () => {
      try {
        const { axios: axiosInstance } = await environment.loadEnvironment();
        this.axios = axiosInstance;
        this.utility = new Utility(environment);
        this.saveFiles = new SaveFiles(environment, this.utility);
        this.xmlBuilder = new XmlBuilder(environment);
        this.gerarConsulta = new GerarConsulta(environment, this.utility, this.xmlBuilder);
      } catch (error) {
        logger.error(``, error, { context: 'NFSE_LoadEnvironment' });
        throw new Error(`Erro ao inicializar a lib NFSe: ${error}`);
      }
    })();
  }

  /**
   * Autorização de NFSe
   */
  async Autorizacao(data: NFSeType) {
    await this.loadEnvironmentPromise;
    try {
      const service = new NFSeAutorizacaoService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta);
      const operation = new NFSeAutorizacao(service);
      const response = await operation.Exec(data);
      console.log('Retorno NFSE_Autorizacao');
      console.log(`   Chave de Acesso: ${response.response.chaveAcesso || 'N/A'}`);
      console.log('===================================');
      return response;
    } catch (error: any) {
      logger.error(``, error, { context: 'NFSE_Autorizacao' });
      throw new Error(`NFSE_Autorizacao: ${error.message}`);
    }
  }

  /**
   * Consulta NFSe por chave de acesso
   */
  async Consulta(data: NFSeConsultaPorChave) {
    await this.loadEnvironmentPromise;
    try {
      const service = new NFSeConsultaService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta);
      const operation = new NFSeConsulta(service);
      const response = await operation.Exec(data);
      console.log('Retorno NFSE_Consulta');
      console.log(`   Chave de Acesso: ${response.chaveAcesso || 'N/A'}`);
      console.log('===================================');
      return response;
    } catch (error: any) {
      logger.error(``, error, { context: 'NFSE_Consulta' });
      throw new Error(`NFSE_Consulta: ${error.message}`);
    }
  }

  /**
   * Consulta DPS por ID
   */
  async ConsultaDPS(data: DpsConsultaPorId) {
    await this.loadEnvironmentPromise;
    try {
      const service = new NFSeConsultaService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta);
      const operation = new NFSeConsulta(service);
      const response = await operation.ConsultaDPS(data);
      console.log('Retorno NFSE_ConsultaDPS');
      console.log(`   Chave de Acesso: ${response.chaveAcesso || 'N/A'}`);
      console.log('===================================');
      return response;
    } catch (error: any) {
      logger.error(``, error, { context: 'NFSE_ConsultaDPS' });
      throw new Error(`NFSE_ConsultaDPS: ${error.message}`);
    }
  }

  /**
   * Registro de Eventos
   */
  async RegistrarEvento(data: NFSeEventoRequest) {
    await this.loadEnvironmentPromise;
    try {
      const service = new NFSeEventosService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta);
      const operation = new NFSeEventos(service);
      const response = await operation.RegistrarEvento(data);
      console.log('Retorno NFSE_RegistrarEvento');
      console.log(`   Processado com sucesso`);
      console.log('===================================');
      return response;
    } catch (error: any) {
      logger.error(``, error, { context: 'NFSE_RegistrarEvento' });
      throw new Error(`NFSE_RegistrarEvento: ${error.message}`);
    }
  }

  /**
   * Consulta de Eventos
   */
  async ConsultarEvento(data: NFSeEventoConsulta) {
    await this.loadEnvironmentPromise;
    try {
      const service = new NFSeEventosService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta);
      const operation = new NFSeEventos(service);
      const response = await operation.ConsultarEvento(data);
      console.log('Retorno NFSE_ConsultarEvento');
      console.log(`   Processado com sucesso`);
      console.log('===================================');
      return response;
    } catch (error: any) {
      logger.error(``, error, { context: 'NFSE_ConsultarEvento' });
      throw new Error(`NFSE_ConsultarEvento: ${error.message}`);
    }
  }

  /**
   * Distribuição por NSU
   */
  async DistribuicaoPorNSU(data: NFSeDistribuicaoPorNSU) {
    await this.loadEnvironmentPromise;
    try {
      const service = new NFSeDistribuicaoService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta);
      const operation = new NFSeDistribuicao(service);
      const response = await operation.DistribuicaoPorNSU(data);
      console.log('Retorno NFSE_DistribuicaoPorNSU');
      console.log(`   Status: ${response.StatusProcessamento || 'N/A'}`);
      console.log('===================================');
      return response;
    } catch (error: any) {
      logger.error(``, error, { context: 'NFSE_DistribuicaoPorNSU' });
      throw new Error(`NFSE_DistribuicaoPorNSU: ${error.message}`);
    }
  }

  /**
   * Eventos por chave de acesso
   */
  async EventosPorChave(data: NFSeEventosPorChave) {
    await this.loadEnvironmentPromise;
    try {
      const service = new NFSeDistribuicaoService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta);
      const operation = new NFSeDistribuicao(service);
      const response = await operation.EventosPorChave(data);
      console.log('Retorno NFSE_EventosPorChave');
      console.log(`   Status: ${response.StatusProcessamento || 'N/A'}`);
      console.log('===================================');
      return response;
    } catch (error: any) {
      logger.error(``, error, { context: 'NFSE_EventosPorChave' });
      throw new Error(`NFSE_EventosPorChave: ${error.message}`);
    }
  }

  /**
   * Consulta Alíquota
   */
  async ConsultarAliquota(data: NFSeConsultaAliquota) {
    await this.loadEnvironmentPromise;
    try {
      const service = new NFSeParametrosMunicipaisService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta);
      const operation = new NFSeParametrosMunicipais(service);
      const response = await operation.ConsultarAliquota(data);
      console.log('Retorno NFSE_ConsultarAliquota');
      console.log(`   Mensagem: ${response.mensagem || 'N/A'}`);
      console.log('===================================');
      return response;
    } catch (error: any) {
      logger.error(``, error, { context: 'NFSE_ConsultarAliquota' });
      throw new Error(`NFSE_ConsultarAliquota: ${error.message}`);
    }
  }

  /**
   * Consulta Histórico de Alíquotas
   */
  async ConsultarHistoricoAliquotas(data: NFSeConsultaHistoricoAliquotas) {
    await this.loadEnvironmentPromise;
    try {
      const service = new NFSeParametrosMunicipaisService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta);
      const operation = new NFSeParametrosMunicipais(service);
      const response = await operation.ConsultarHistoricoAliquotas(data);
      console.log('Retorno NFSE_ConsultarHistoricoAliquotas');
      console.log(`   Mensagem: ${response.mensagem || 'N/A'}`);
      console.log('===================================');
      return response;
    } catch (error: any) {
      logger.error(``, error, { context: 'NFSE_ConsultarHistoricoAliquotas' });
      throw new Error(`NFSE_ConsultarHistoricoAliquotas: ${error.message}`);
    }
  }

  /**
   * Consulta Benefício Municipal
   */
  async ConsultarBeneficio(data: NFSeConsultaBeneficio) {
    await this.loadEnvironmentPromise;
    try {
      const service = new NFSeParametrosMunicipaisService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta);
      const operation = new NFSeParametrosMunicipais(service);
      const response = await operation.ConsultarBeneficio(data);
      console.log('Retorno NFSE_ConsultarBeneficio');
      console.log(`   Mensagem: ${response.mensagem || 'N/A'}`);
      console.log('===================================');
      return response;
    } catch (error: any) {
      logger.error(``, error, { context: 'NFSE_ConsultarBeneficio' });
      throw new Error(`NFSE_ConsultarBeneficio: ${error.message}`);
    }
  }

  /**
   * Consulta Convênio Municipal
   */
  async ConsultarConvenio(data: NFSeConsultaConvenio) {
    await this.loadEnvironmentPromise;
    try {
      const service = new NFSeParametrosMunicipaisService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta);
      const operation = new NFSeParametrosMunicipais(service);
      const response = await operation.ConsultarConvenio(data);
      console.log('Retorno NFSE_ConsultarConvenio');
      console.log(`   Mensagem: ${response.mensagem || 'N/A'}`);
      console.log('===================================');
      return response;
    } catch (error: any) {
      logger.error(``, error, { context: 'NFSE_ConsultarConvenio' });
      throw new Error(`NFSE_ConsultarConvenio: ${error.message}`);
    }
  }

  /**
   * Consulta Regimes Especiais
   */
  async ConsultarRegimesEspeciais(data: NFSeConsultaRegimesEspeciais) {
    await this.loadEnvironmentPromise;
    try {
      const service = new NFSeParametrosMunicipaisService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta);
      const operation = new NFSeParametrosMunicipais(service);
      const response = await operation.ConsultarRegimesEspeciais(data);
      console.log('Retorno NFSE_ConsultarRegimesEspeciais');
      console.log(`   Mensagem: ${response.mensagem || 'N/A'}`);
      console.log('===================================');
      return response;
    } catch (error: any) {
      logger.error(``, error, { context: 'NFSE_ConsultarRegimesEspeciais' });
      throw new Error(`NFSE_ConsultarRegimesEspeciais: ${error.message}`);
    }
  }

  /**
   * Alterar Benefício Municipal
   */
  async AlterarBeneficioMunicipal(data: NFSeAlteracaoBeneficioMunicipal) {
    await this.loadEnvironmentPromise;
    try {
      const service = new NFSeParametrosMunicipaisService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta);
      const operation = new NFSeParametrosMunicipais(service);
      const response = await operation.AlterarBeneficioMunicipal(data);
      console.log('Retorno NFSE_AlterarBeneficioMunicipal');
      console.log(`   Sucesso: ${response.sucesso}`);
      console.log(`   Mensagem: ${response.mensagem || 'N/A'}`);
      console.log('===================================');
      return response;
    } catch (error: any) {
      logger.error(``, error, { context: 'NFSE_AlterarBeneficioMunicipal' });
      throw new Error(`NFSE_AlterarBeneficioMunicipal: ${error.message}`);
    }
  }

  /**
   * Alterar Retenções
   */
  async AlterarRetencoes(data: NFSeAlteracaoRetencoes) {
    await this.loadEnvironmentPromise;
    try {
      const service = new NFSeParametrosMunicipaisService(this.environment, this.utility, this.xmlBuilder, this.axios, this.saveFiles, this.gerarConsulta);
      const operation = new NFSeParametrosMunicipais(service);
      const response = await operation.AlterarRetencoes(data);
      console.log('Retorno NFSE_AlterarRetencoes');
      console.log(`   Sucesso: ${response.sucesso}`);
      console.log(`   Mensagem: ${response.mensagem || 'N/A'}`);
      console.log('===================================');
      return response;
    } catch (error: any) {
      logger.error(``, error, { context: 'NFSE_AlterarRetencoes' });
      throw new Error(`NFSE_AlterarRetencoes: ${error.message}`);
    }
  }

  /**
   * Valida um XML contra o schema XSD do método fiscal informado.
   * O `environment` é injetado automaticamente a partir da configuração da lib.
   *
   * @param xml      - String XML a ser validada.
   * @param metodo   - Nome do método/operação fiscal (ex.: `'NFSeAutorizacao'`).
   * @param validator - Força um validador específico. Se omitido, usa
   *                    `lib.useForSchemaValidation` do config; caso não definido,
   *                    usa `'validateSchemaJsBased'` como padrão.
   */
  async NFSe_SchemaValidate(xml: string, metodo: SchemaValidateMethod, validator?: 'validateSchemaJsBased' | 'validateSchemaJavaBased') {
    await this.loadEnvironmentPromise;
    try {
      const response = await NFE_SchemaValidate(xml, metodo, { validator, environment: this.environment });

      console.log(response.report);
      console.table(response.tableRows);

      return response;
    } catch (error: any) {
      if (error && typeof error === 'object' && 'errors' in error && 'report' in error) {
        console.log(error.report);
        console.table(error.tableRows);
        logger.error('', { message: error.message, errors: error.errors }, { context: 'NFSe_SchemaValidate' });
        const err = new Error(`NFSe_SchemaValidate: ${error.message}`);
        (err as any).errors = error.errors;
        (err as any).report = error.report;
        (err as any).tableRows = error.tableRows;
        throw err;
      }
      logger.error('', error, { context: 'NFSe_SchemaValidate' });
      throw new Error(`NFSe_SchemaValidate: ${error?.message ?? error}`);
    }
  }
}
