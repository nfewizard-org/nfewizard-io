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
import { format } from 'date-fns';
import { Environment, Utility, XmlBuilder, logger } from '@nfewizard/shared';
import { GerarConsultaImpl, SaveFilesImpl, CTERecepcaoEventoServiceImpl } from '@nfewizard/types/shared';
import { EventoCTe, TipoEventoCTe, CTeEventoResultado } from '@nfewizard/types/cte';
import { CTEBaseService, CTE_VERSAO } from '../util/CTEBaseService.js';
import { TP_EMIS, chaveEmSvc, tpEmisDaChave } from '../util/CTeContingencia.js';
import { validarCamposCartaDeCorrecao, XCOND_USO_CCE } from './util/CartaDeCorrecaoRules.js';

const METHOD_NAME = 'CTeRecepcaoEvento';

/** Tag raiz do grupo específico (`detEvento/<tag>`) por tipo de evento. */
const TAG_EVENTO: Record<string, string> = {
    '110113': 'evEPECCTe',
    '110111': 'evCancCTe',
    '110110': 'evCCeCTe',
    '110160': 'evRegMultimodal',
    '610110': 'evPrestDesacordo',
    '610111': 'evCancPrestDesacordo',
    '110180': 'evCECTe',
    '110181': 'evCancCECTe',
    '110190': 'evIECTe',
    '110191': 'evCancIECTe',
    '110300': 'evVincPgto',
    '110301': 'evCancVincPgto',
};

/** Eventos cujo autor é o tomador do serviço: o autor não pode ser inferido da chave de acesso. */
const EVENTOS_DO_TOMADOR = ['610110', '610111'];

const NOME_EVENTO: Record<string, string> = {
    '110113': 'EPEC',
    '110111': 'Cancelamento',
    '110110': 'Carta de Correção',
    '110160': 'Registro Multimodal',
    '610110': 'Prestação do Serviço em Desacordo',
    '610111': 'Cancelamento da Prestação do Serviço em Desacordo',
    '110180': 'Comprovante de Entrega',
    '110181': 'Cancelamento do Comprovante de Entrega',
    '110190': 'Insucesso na Entrega',
    '110191': 'Cancelamento do Insucesso na Entrega',
    '110300': 'Vinculação de Pagamento',
    '110301': 'Cancelamento da Vinculação de Pagamento',
};

/**
 * Motor genérico de registro de eventos do CT-e (`CTeRecepcaoEventoV4`).
 * Cada evento concreto (Cancelamento, CC-e, ...) é uma subclasse sem lógica própria;
 * a diferenciação ocorre pelo `tpEvento` do payload.
 *
 * Diferente da NF-e, o serviço recebe `eventoCTe` diretamente (um evento por chamada),
 * sem `envEvento`/`idLote`.
 */
export class CTERecepcaoEventoService extends CTEBaseService implements CTERecepcaoEventoServiceImpl {
    constructor(environment: Environment, utility: Utility, xmlBuilder: XmlBuilder, axios: AxiosInstance, saveFiles: SaveFilesImpl, gerarConsulta: GerarConsultaImpl) {
        super(environment, utility, xmlBuilder, METHOD_NAME, axios, saveFiles, gerarConsulta);
    }

    /**
     * EPEC e eventos de CT-e autorizado em SVC (tpEmis 7/8 na chave) são recebidos pela
     * Sefaz Virtual de Contingência, não pelo autorizador normal da UF.
     */
    protected getModelo(evento?: TipoEventoCTe): string {
        return evento && (evento.tpEvento === '110113' || chaveEmSvc(evento.chCTe)) ? 'CTeSVC' : 'CTe';
    }

    /** Id do evento: "ID" + tpEvento + chCTe + nSeqEvento (3 dígitos) = 55 caracteres. */
    protected getID(tpEvento: string, chCTe: string, nSeqEvento: number): string {
        if (typeof tpEvento !== 'string' || !/^\d{6}$/.test(tpEvento)) {
            throw new Error('tpEvento deve ser uma string com 6 dígitos.');
        }
        if (typeof chCTe !== 'string' || !/^\d{44}$/.test(chCTe)) {
            throw new Error('chCTe deve ser uma string com 44 dígitos.');
        }
        if (!Number.isInteger(nSeqEvento) || nSeqEvento < 1 || nSeqEvento > 999) {
            throw new Error('nSeqEvento deve ser um número inteiro entre 1 e 999.');
        }
        return `ID${tpEvento}${chCTe}${String(nSeqEvento).padStart(3, '0')}`;
    }

    private montarDetEvento(evento: TipoEventoCTe) {
        const tag = TAG_EVENTO[evento.tpEvento];
        if (!tag) {
            throw new Error(`tpEvento ${evento.tpEvento} não suportado por este serviço.`);
        }

        if (evento.tpEvento === '110110') {
            const { infCorrecao, xCondUso, ...resto } = evento.detEvento;
            const itens = Array.isArray(infCorrecao) ? infCorrecao : [infCorrecao];
            validarCamposCartaDeCorrecao(itens);
            return { [tag]: { ...resto, infCorrecao: itens, xCondUso: xCondUso || XCOND_USO_CCE } };
        }

        if (evento.tpEvento === '110113' && tpEmisDaChave(evento.chCTe) !== TP_EMIS.EPEC) {
            throw new Error('O EPEC exige chave de acesso com tpEmis=4 (EPEC).');
        }

        if (evento.tpEvento === '110190') {
            const { tpMotivo, xJustMotivo } = evento.detEvento;
            if (Number(tpMotivo) === 4 && !xJustMotivo) {
                throw new Error('xJustMotivo é obrigatório quando tpMotivo=4 (Outros).');
            }
        }

        if (evento.tpEvento === '110300') {
            const { pgto, ...resto } = evento.detEvento;
            const pagamentos = (Array.isArray(pgto) ? pgto : [pgto]).map(({ nPag, idTransacao, ...dados }) => ({
                $: { nPag, idTransacao },
                ...dados,
            }));
            return { [tag]: { ...resto, pgto: pagamentos } };
        }

        return { [tag]: { ...evento.detEvento } };
    }

    protected gerarXml(evento: TipoEventoCTe): string {
        logger.info('Montando estrutura do XML em JSON', {
            context: 'CTERecepcaoEventoService',
        });

        const { nfe: { ambiente } } = this.environment.getConfig();
        const { chCTe, tpEvento, CNPJ, CPF, cOrgao, dhEvento, versaoEvento } = evento;
        const nSeqEvento = evento.nSeqEvento ?? 1;

        if (EVENTOS_DO_TOMADOR.includes(tpEvento) && !CNPJ && !CPF) {
            throw new Error(`O evento ${tpEvento} é de autoria do tomador: informe CNPJ ou CPF do tomador.`);
        }

        const idEvento = this.getID(tpEvento, chCTe, nSeqEvento);
        const autor = CNPJ || CPF ? (CNPJ ? { CNPJ } : { CPF }) : { CNPJ: chCTe.substring(6, 20) };

        const eventoObject = {
            $: {
                versao: CTE_VERSAO,
                xmlns: 'http://www.portalfiscal.inf.br/cte',
            },
            infEvento: {
                $: { Id: idEvento },
                cOrgao: cOrgao ?? Number(chCTe.substring(0, 2)),
                tpAmb: ambiente,
                ...autor,
                chCTe,
                dhEvento: dhEvento || format(new Date(), "yyyy-MM-dd'T'HH:mm:ssxxx"),
                tpEvento,
                nSeqEvento,
                detEvento: {
                    $: { versaoEvento: versaoEvento || CTE_VERSAO },
                    ...this.montarDetEvento(evento),
                },
            },
        };

        const eventoXML = this.xmlBuilder.gerarXml(eventoObject, 'eventoCTe', this.metodo);
        return this.xmlBuilder.assinarXML(eventoXML, 'infEvento');
    }

    async Exec(data: EventoCTe): Promise<CTeEventoResultado> {
        const eventos = Array.isArray(data.evento) ? data.evento : [data.evento];

        const response: CTeEventoResultado['response'] = [];
        for (const evento of eventos) {
            const retorno = await super.Exec(evento);
            const inf = retorno?.infEvento ?? {};
            response.push({
                chCTe: inf.chCTe || evento.chCTe,
                tpEvento: inf.tpEvento || evento.tpEvento,
                cStat: inf.cStat,
                xMotivo: inf.xMotivo,
                nProt: inf.nProt,
                response: retorno,
            });
        }

        const xMotivos = response.map(({ chCTe, tpEvento, cStat, xMotivo }) => ({
            chCTe,
            tpEvento: NOME_EVENTO[String(tpEvento)] ?? tpEvento,
            cStat,
            xMotivo,
        }));
        const success = response.every(r => ['135', '136', '134'].includes(String(r.cStat)));

        return { success, xMotivos, response };
    }
}

export default CTERecepcaoEventoService;
