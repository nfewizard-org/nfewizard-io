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
import { NFSeParametrosMunicipaisServiceImpl } from '@nfewizard/types/interfaces';
import {
    NFSeAlteracaoBeneficioMunicipal,
    NFSeAlteracaoRetencoes,
    NFSeConsultaAliquota,
    NFSeConsultaBeneficio,
    NFSeConsultaConvenio,
    NFSeConsultaHistoricoAliquotas,
    NFSeConsultaRegimesEspeciais
} from '@nfewizard/types';

class NFSeParametrosMunicipais {
    private nfseParametrosMunicipaisService: NFSeParametrosMunicipaisServiceImpl;

    constructor(nfseParametrosMunicipaisService: NFSeParametrosMunicipaisServiceImpl) {
        this.nfseParametrosMunicipaisService = nfseParametrosMunicipaisService;
    }

    async ConsultarAliquota(data: NFSeConsultaAliquota) {
        return await this.nfseParametrosMunicipaisService.ConsultarAliquota(data);
    }

    async ConsultarHistoricoAliquotas(data: NFSeConsultaHistoricoAliquotas) {
        return await this.nfseParametrosMunicipaisService.ConsultarHistoricoAliquotas(data);
    }

    async ConsultarBeneficio(data: NFSeConsultaBeneficio) {
        return await this.nfseParametrosMunicipaisService.ConsultarBeneficio(data);
    }

    async ConsultarConvenio(data: NFSeConsultaConvenio) {
        return await this.nfseParametrosMunicipaisService.ConsultarConvenio(data);
    }

    async ConsultarRegimesEspeciais(data: NFSeConsultaRegimesEspeciais) {
        return await this.nfseParametrosMunicipaisService.ConsultarRegimesEspeciais(data);
    }

    async AlterarBeneficioMunicipal(data: NFSeAlteracaoBeneficioMunicipal) {
        return await this.nfseParametrosMunicipaisService.AlterarBeneficioMunicipal(data);
    }

    async AlterarRetencoes(data: NFSeAlteracaoRetencoes) {
        return await this.nfseParametrosMunicipaisService.AlterarRetencoes(data);
    }
}

export default NFSeParametrosMunicipais;
