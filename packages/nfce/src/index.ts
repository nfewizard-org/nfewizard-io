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

// Main NFCe Wizard class (default export for easy usage)
export { NFCEWizard } from './NFCEWizard.js';
export { NFCEWizard as default } from './NFCEWizard.js';

// NFCe Operations
export { NFCEAutorizacao } from './operations/NFCEAutorizacao/NFCEAutorizacao.js';
export { NFCERetornoAutorizacao } from './operations/NFCERetornoAutorizacao/NFCERetornoAutorizacao.js';
export { NFCECancelamento } from './operations/NFCERecepcaoEvento/NFCECancelamento.js';

// NFCe Services
export { NFCEAutorizacaoService } from './services/NFCEAutorizacao/NFCEAutorizacaoService.js';
export { NFCERetornoAutorizacaoService } from './services/NFCERetornoAutorizacao/NFCERetornoAutorizacaoService.js';
export { NFCECancelamentoService } from './services/NFCERecepcaoEvento/NFCECancelamentoService.js';
export { NFCERecepcaoEventoService } from './services/NFCERecepcaoEvento/NFCERecepcaoEventoService.js';

// NFCe Utilities
export { generateQRCodeURLOnline, generateQRCodeURLOffline } from './services/NFCEAutorizacao/util/NFCEQRCode.js';

// Re-export types for convenience (user doesn't need to install @nfewizard/types separately)
export type * from '@nfewizard/types/nfce';
export type * from '@nfewizard/types/nfe';
export type * from '@nfewizard/types/shared';
