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

/**
 * @packageDocumentation
 * NFeWizard-io - Biblioteca completa para emissão de Nota Fiscal Eletrônica
 * 
 * Este pacote mantém 100% de retrocompatibilidade com versões anteriores,
 * agora organizado como monorepo modular:
 * 
 * - @nfewizard/types - Definições TypeScript
 * - @nfewizard/shared - Utilitários compartilhados
 * - @nfewizard/danfe - Geração de DANFE/DACTE
 * - @nfewizard/nfce - Operações NFCe (opcional)
 * - @nfewizard/cte - Operações CTe (opcional)
 */

// Re-export all types for backward compatibility
export * from '@nfewizard/types/shared';
export * from '@nfewizard/types/nfe';

// Re-export shared utilities
export {
  BaseNFE,
  GerarConsulta,
  SaveFiles,
  XmlBuilder,
  getSchema,
  Utility,
  XmlParser,
  ValidaCPFCNPJ,
  getCodIBGE,
  getDesTipoPag,
  AxiosHttpClient,
  Environment,
  HttpClientBuilder,
  LoadCertificate,
  ValidateEnvironment,
  logger
} from '@nfewizard/shared';

// Re-export types from shared
export type { ErrorContext, JsonArrayTransport } from '@nfewizard/shared';

// Export NFE operations and services from local files
export { NFEAutorizacao } from './nfe/operations/NFEAutorizacao/NFEAutorizacao.js';
export { NFEStatusServico } from './nfe/operations/NFEStatusServico/NFEStatusServico.js';
export { NFEConsultaProtocolo } from './nfe/operations/NFEConsultaProtocolo/NFEconsultaProtocolo.js';
export { NFERetornoAutorizacao } from './nfe/operations/NFERetornoAutorizacao/NFERetornoAutorizacao.js';
export { NFEInutilizacao } from './nfe/operations/NFEInutilizacao/NFEInutilizacao.js';
export { NFEDistribuicaoDFe } from './nfe/operations/NFEDistribuicaoDFe/NFEDistribuicaoDFe.js';
export { NFEDistribuicaoDFePorChave } from './nfe/operations/NFEDistribuicaoDFe/NFEDistribuicaoDFePorChave.js';
export { NFEDistribuicaoDFePorNSU } from './nfe/operations/NFEDistribuicaoDFe/NFEDistribuicaoDFePorNSU.js';
export { NFEDistribuicaoDFePorUltNSU } from './nfe/operations/NFEDistribuicaoDFe/NFEDistribuicaoDFePorUltNSU.js';
export { NFECancelamento } from './nfe/operations/NFERecepcaoEvento/NFECancelamento.js';
export { NFECartaDeCorrecao } from './nfe/operations/NFERecepcaoEvento/NFECartaDeCorrecao.js';
export { NFECienciaDaOperacao } from './nfe/operations/NFERecepcaoEvento/NFECienciaDaOperacao.js';
export { NFEConfirmacaoDaOperacao } from './nfe/operations/NFERecepcaoEvento/NFEConfirmacaoDaOperacao.js';
export { NFEDesconhecimentoDaOperacao } from './nfe/operations/NFERecepcaoEvento/NFEDesconhecimentoDaOperacao.js';
export { NFEOperacaoNaoRealizada } from './nfe/operations/NFERecepcaoEvento/NFEOperacaoNaoRealizada.js';
export { NFEEpec } from './nfe/operations/NFERecepcaoEvento/NFEEpec.js';

// Export main NFeWizard adapter
export { NFeWizard } from './NFeWizard.js';
export { default } from './NFeWizard.js';

// Export tax calculation functions (now from shared)
export { mountICMS, mountPIS, mountCOFINS } from '@nfewizard/shared';
