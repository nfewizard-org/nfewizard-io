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
import { NFSeConsultaServiceImpl } from '@nfewizard/types/interfaces';
import { DpsConsultaPorId, NFSeConsultaPorChave } from '@nfewizard/types';

class NFSeConsulta {
    private nfseConsultaService: NFSeConsultaServiceImpl;

    constructor(nfseConsultaService: NFSeConsultaServiceImpl) {
        this.nfseConsultaService = nfseConsultaService;
    }

    async Exec(data: NFSeConsultaPorChave) {
        return await this.nfseConsultaService.Exec(data);
    }

    async ConsultaDPS(data: DpsConsultaPorId) {
        return await this.nfseConsultaService.ConsultaDPS(data);
    }
}

export default NFSeConsulta;
