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
import { NFSeEventosServiceImpl } from '@nfewizard/types/interfaces';
import { NFSeEventoConsulta, NFSeEventoRequest } from '@nfewizard/types';

class NFSeEventos {
    private nfseEventosService: NFSeEventosServiceImpl;

    constructor(nfseEventosService: NFSeEventosServiceImpl) {
        this.nfseEventosService = nfseEventosService;
    }

    async RegistrarEvento(data: NFSeEventoRequest) {
        return await this.nfseEventosService.RegistrarEvento(data);
    }

    async ConsultarEvento(data: NFSeEventoConsulta) {
        return await this.nfseEventosService.ConsultarEvento(data);
    }
}

export default NFSeEventos;
