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
import { NFSeDistribuicaoServiceImpl } from '@nfewizard/types/interfaces';
import { NFSeDistribuicaoPorNSU, NFSeEventosPorChave } from '@nfewizard/types';

class NFSeDistribuicao {
    private nfseDistribuicaoService: NFSeDistribuicaoServiceImpl;

    constructor(nfseDistribuicaoService: NFSeDistribuicaoServiceImpl) {
        this.nfseDistribuicaoService = nfseDistribuicaoService;
    }

    async DistribuicaoPorNSU(data: NFSeDistribuicaoPorNSU) {
        return await this.nfseDistribuicaoService.DistribuicaoPorNSU(data);
    }

    async EventosPorChave(data: NFSeEventosPorChave) {
        return await this.nfseDistribuicaoService.EventosPorChave(data);
    }
}

export default NFSeDistribuicao;
