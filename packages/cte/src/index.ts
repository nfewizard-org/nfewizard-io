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

// Main CTe Wizard class (default export for easy usage)
export { CTEWizard } from './CTEWizard.js';
export { CTEWizard as default } from './CTEWizard.js';

// CTe Operations
export { CTEDistribuicaoDFe } from './operations/CTEDistribuicaoDFe/CTEDistribuicaoDFe.js';
export { CTEDistribuicaoDFePorNSU } from './operations/CTEDistribuicaoDFe/CTEDistribuicaoDFePorNSU.js';
export { CTEDistribuicaoDFePorUltNSU } from './operations/CTEDistribuicaoDFe/CTEDistribuicaoDFePorUltNSU.js';

// CTe Services
export { CTEDistribuicaoDFeService } from './services/CTEDistribuicaoDFe/CTEDistribuicaoDFeService.js';
export { CTEDistribuicaoDFePorNSUService } from './services/CTEDistribuicaoDFe/CTEDistribuicaoDFePorNSU.js';
export { CTEDistribuicaoDFePorUltNSUService } from './services/CTEDistribuicaoDFe/CTEDistribuicaoDFePorUltNSU.js';

// CTe Utilities
export { DistribuicaoHandler } from './services/CTEDistribuicaoDFe/util/DistribuicaoHandler.js';

// Re-export types for convenience (user doesn't need to install @nfewizard/types separately)
export type * from '@nfewizard/types/cte';
export type * from '@nfewizard/types/shared';
