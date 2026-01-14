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
import { XmlBuilder, Environment, Utility, BaseNFSe } from '@nfewizard/shared';
import { GerarConsultaImpl, NFSeParametrosMunicipaisServiceImpl, SaveFilesImpl } from '@nfewizard/types/interfaces';
import {
    NFSeAlteracaoBeneficioMunicipal,
    NFSeAlteracaoResponse,
    NFSeAlteracaoRetencoes,
    NFSeConsultaAliquota,
    NFSeConsultaAliquotaResponse,
    NFSeConsultaBeneficio,
    NFSeConsultaBeneficioResponse,
    NFSeConsultaConvenio,
    NFSeConsultaConvenioResponse,
    NFSeConsultaHistoricoAliquotas,
    NFSeConsultaRegimesEspeciais,
    NFSeConsultaRegimesEspeciaisResponse
} from '@nfewizard/types';
import { AxiosInstance } from 'axios';

class NFSeParametrosMunicipaisService extends BaseNFSe implements NFSeParametrosMunicipaisServiceImpl {
    constructor(environment: Environment, utility: Utility, xmlBuilder: XmlBuilder, axios: AxiosInstance, saveFiles: SaveFilesImpl, gerarConsulta: GerarConsultaImpl) {
        super(environment, utility, xmlBuilder, 'NFSe_ParametrosMunicipais', axios, saveFiles, gerarConsulta);
    }

    protected prepararDados(data?: any): any {
        // Para GET requests, não precisa preparar dados
        if (this.getHttpMethod() === 'GET') {
            return null;
        }

        // Para POST requests (alterações), retorna o body JSON
        if (data && 'paramXmlGZipB64' in data) {
            return {
                tipoAmbiente: data.tipoAmbiente,
                paramXmlGZipB64: data.paramXmlGZipB64
            };
        }

        return null;
    }

    protected getHttpMethod(): 'GET' | 'POST' | 'PUT' | 'DELETE' {
        // Alterações são POST, consultas são GET
        if (this.metodo.includes('Alterar')) {
            return 'POST';
        }
        return 'GET';
    }

    protected getUrlPath(data?: any): string {
        if (!data) return '';

        // Alteração de benefício municipal: /{codigoMunicipio}/beneficiomunicipal/{idManut}
        if (this.metodo.includes('AlterarBeneficio')) {
            return `/${data.codigoMunicipio}/beneficiomunicipal/${data.idManut}`;
        }

        // Alteração de retenções: /{codigoMunicipio}/retencoes/{idManut}
        if (this.metodo.includes('AlterarRetencoes')) {
            return `/${data.codigoMunicipio}/retencoes/${data.idManut}`;
        }

        // Consulta de alíquota: /{codigoMunicipio}/{codigoServico}/{competencia}/aliquota
        if (this.metodo.includes('ConsultarAliquota') && 'codigoServico' in data && 'competencia' in data) {
            const competencia = encodeURIComponent(data.competencia);
            return `/${data.codigoMunicipio}/${data.codigoServico}/${competencia}/aliquota`;
        }

        // Consulta de histórico de alíquotas: /{codigoMunicipio}/{codigoServico}/historicoaliquotas
        if (this.metodo.includes('ConsultarHistoricoAliquotas')) {
            return `/${data.codigoMunicipio}/${data.codigoServico}/historicoaliquotas`;
        }

        // Consulta de benefício: /{codigoMunicipio}/{numeroBeneficio}/{competencia}/beneficio
        if (this.metodo.includes('ConsultarBeneficio')) {
            const competencia = encodeURIComponent(data.competencia);
            return `/${data.codigoMunicipio}/${data.numeroBeneficio}/${competencia}/beneficio`;
        }

        // Consulta de convênio: /{codigoMunicipio}/convenio
        if (this.metodo.includes('ConsultarConvenio')) {
            return `/${data.codigoMunicipio}/convenio`;
        }

        // Consulta de regimes especiais: /{codigoMunicipio}/{codigoServico}/{competencia}/regimes_especiais
        if (this.metodo.includes('ConsultarRegimesEspeciais')) {
            const competencia = encodeURIComponent(data.competencia);
            return `/${data.codigoMunicipio}/${data.codigoServico}/${competencia}/regimes_especiais`;
        }

        return '';
    }

    protected getWebServiceUrl(): string {
        return this.utility.getWebServiceUrlNFSe('NFSe_ParametrosMunicipais');
    }

    async ConsultarAliquota(data: NFSeConsultaAliquota): Promise<NFSeConsultaAliquotaResponse> {
        this.metodo = 'NFSe_ConsultarAliquota';
        return await super.Exec(data) as NFSeConsultaAliquotaResponse;
    }

    async ConsultarHistoricoAliquotas(data: NFSeConsultaHistoricoAliquotas): Promise<NFSeConsultaAliquotaResponse> {
        this.metodo = 'NFSe_ConsultarHistoricoAliquotas';
        return await super.Exec(data) as NFSeConsultaAliquotaResponse;
    }

    async ConsultarBeneficio(data: NFSeConsultaBeneficio): Promise<NFSeConsultaBeneficioResponse> {
        this.metodo = 'NFSe_ConsultarBeneficio';
        return await super.Exec(data) as NFSeConsultaBeneficioResponse;
    }

    async ConsultarConvenio(data: NFSeConsultaConvenio): Promise<NFSeConsultaConvenioResponse> {
        this.metodo = 'NFSe_ConsultarConvenio';
        return await super.Exec(data) as NFSeConsultaConvenioResponse;
    }

    async ConsultarRegimesEspeciais(data: NFSeConsultaRegimesEspeciais): Promise<NFSeConsultaRegimesEspeciaisResponse> {
        this.metodo = 'NFSe_ConsultarRegimesEspeciais';
        return await super.Exec(data) as NFSeConsultaRegimesEspeciaisResponse;
    }

    async AlterarBeneficioMunicipal(data: NFSeAlteracaoBeneficioMunicipal): Promise<NFSeAlteracaoResponse> {
        this.metodo = 'NFSe_AlterarBeneficioMunicipal';
        const response = await super.Exec(data);
        return {
            sucesso: true,
            mensagem: response.mensagem
        };
    }

    async AlterarRetencoes(data: NFSeAlteracaoRetencoes): Promise<NFSeAlteracaoResponse> {
        this.metodo = 'NFSe_AlterarRetencoes';
        const response = await super.Exec(data);
        return {
            sucesso: true,
            mensagem: response.mensagem
        };
    }
}

export default NFSeParametrosMunicipaisService;
