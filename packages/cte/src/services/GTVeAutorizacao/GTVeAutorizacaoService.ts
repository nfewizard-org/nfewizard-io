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
import { GTVe, LayoutGTVe } from '@nfewizard/types/cte';
import { CTeAutorizacaoResultado } from '@nfewizard/types/cte';
import { CTEAutorizacaoService } from '../CTEAutorizacao/CTEAutorizacaoService.js';

/**
 * Autorização da Guia de Transporte de Valores eletrônica (modelo 64, `CTeRecepcaoGTVeV4`).
 * Reaproveita montagem da chave de acesso, assinatura, compactação GZip/Base64 e transmissão
 * síncrona (um documento por chamada) do {@link CTEAutorizacaoService}; muda a tag raiz, o
 * modelo padrão, o serviço SOAP e os participantes validados.
 */
export class GTVeAutorizacaoService extends CTEAutorizacaoService {
    protected rootTag = 'GTVe';
    protected modeloPadrao: number | string = 64;

    constructor(environment: Environment, utility: Utility, xmlBuilder: XmlBuilder, axios: AxiosInstance, saveFiles: SaveFilesImpl, gerarConsulta: GerarConsultaImpl) {
        super(environment, utility, xmlBuilder, axios, saveFiles, gerarConsulta, 'CTeGTVeAutorizacao');
    }

    protected normalizarParticipantes(infCte: any): void {
        if (infCte.rem) infCte.rem = this.normalizaParticipante(infCte.rem, 'remetente');
        if (infCte.dest) infCte.dest = this.normalizaParticipante(infCte.dest, 'destinatário');
    }


    protected aplicarTextoHomologacao(infCte: any): void {
        for (const participante of [infCte.rem, infCte.dest]) {
            if (participante) participante.xNome = CTEAutorizacaoService.TEXTO_HOMOLOGACAO;
        }
    }

    async Exec(data: GTVe): Promise<CTeAutorizacaoResultado<LayoutGTVe>> {
        const documentos = Array.isArray(data.GTVe) ? data.GTVe : [data.GTVe];
        return this.autorizar<LayoutGTVe>(documentos);
    }
}

export default GTVeAutorizacaoService;
