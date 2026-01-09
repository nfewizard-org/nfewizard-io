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

import { GenericObject } from './Utils.js';
import { NFeWizardProps } from './NFeWizardProps.js';
import {
    Cancelamento,
    CartaDeCorrecao,
    CienciaDaOperacao,
    ConfirmacaoDaOperacao,
    ConsultaNFe,
    DesconhecimentoDaOperacao,
    DFePorChaveNFe,
    DFePorNSU,
    DFePorUltimoNSU,
    EPEC,
    EventoNFe,
    InutilizacaoData,
    LayoutNFe,
    NFe,
    OperacaoNaoRealizada,
    ProtNFe,
    EmailParams
} from '../nfe/index.js';

export interface NFeWizardImpl {
    NFE_LoadEnvironment({ config }: { config: NFeWizardProps }): Promise<void>;
    NFE_ConsultaStatusServico(): Promise<any>;
    NFE_ConsultaProtocolo(chave: string): Promise<any>;
    NFE_RecepcaoEvento(evento: EventoNFe): Promise<GenericObject[]>;
    NFE_EventoPrevioDeEmissaoEmContingencia(evento: EPEC): Promise<GenericObject[]>;
    NFE_Cancelamento(evento: Cancelamento): Promise<GenericObject[]>;
    NFE_CienciaDaOperacao(evento: CienciaDaOperacao): Promise<GenericObject[]>;
    NFE_ConfirmacaoDaOperacao(evento: ConfirmacaoDaOperacao): Promise<GenericObject[]>;
    NFE_OperacaoNaoRealizada(evento: OperacaoNaoRealizada): Promise<GenericObject[]>;
    NFE_CartaDeCorrecao(evento: CartaDeCorrecao): Promise<GenericObject[]>;
    NFE_DesconhecimentoDaOperacao(evento: DesconhecimentoDaOperacao): Promise<GenericObject[]>;
    NFE_DistribuicaoDFe(data: ConsultaNFe): Promise<GenericObject>;
    NFE_DistribuicaoDFePorUltNSU(data: DFePorUltimoNSU): Promise<GenericObject>;
    NFE_DistribuicaoDFePorNSU(data: DFePorNSU): Promise<GenericObject>;
    NFE_DistribuicaoDFePorChave(data: DFePorChaveNFe): Promise<GenericObject>;
    NFE_Autorizacao(data: NFe): Promise<{ NFe: LayoutNFe, protNFe: ProtNFe }[]>;
    NFE_Inutilizacao(data: InutilizacaoData): Promise<any>;
    NFE_EnviaEmail(mailParams: EmailParams): any;
}
