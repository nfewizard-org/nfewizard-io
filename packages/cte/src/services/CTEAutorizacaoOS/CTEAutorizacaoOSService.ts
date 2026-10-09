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
import { AxiosInstance } from 'axios';
import { Environment, Utility, XmlBuilder } from '@nfewizard/shared';
import { GerarConsultaImpl, SaveFilesImpl } from '@nfewizard/types/shared';
import { CTeOS, LayoutCTeOS } from '@nfewizard/types/cte';
import { CTeAutorizacaoResultado } from '@nfewizard/types/cte';
import { CTEAutorizacaoService } from '../CTEAutorizacao/CTEAutorizacaoService.js';

/**
 * Autorização do CT-e Outros Serviços (modelo 67, `CTeRecepcaoOSV4`).
 * Reaproveita montagem da chave de acesso, assinatura, compactação GZip/Base64 e transmissão
 * síncrona (um documento por chamada) do {@link CTEAutorizacaoService}; muda a tag raiz, o
 * modelo padrão, o serviço SOAP e os participantes validados.
 */
export class CTEAutorizacaoOSService extends CTEAutorizacaoService {
    protected rootTag = 'CTeOS';
    protected modeloPadrao: number | string = 67;

    constructor(environment: Environment, utility: Utility, xmlBuilder: XmlBuilder, axios: AxiosInstance, saveFiles: SaveFilesImpl, gerarConsulta: GerarConsultaImpl) {
        super(environment, utility, xmlBuilder, axios, saveFiles, gerarConsulta, 'CTeAutorizacaoOS');
    }

    protected normalizarParticipantes(infCte: any): void {
        infCte.toma = this.normalizaParticipante(infCte.toma, 'tomador');
    }


    protected aplicarTextoHomologacao(infCte: any): void {
        if (infCte.toma) infCte.toma.xNome = CTEAutorizacaoService.TEXTO_HOMOLOGACAO;
    }

    async Exec(data: CTeOS): Promise<CTeAutorizacaoResultado<LayoutCTeOS>> {
        const documentos = Array.isArray(data.CTe) ? data.CTe : [data.CTe];
        return this.autorizar<LayoutCTeOS>(documentos);
    }
}

export default CTEAutorizacaoOSService;
