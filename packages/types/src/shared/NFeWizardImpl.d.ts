import { GenericObject } from './Utils.js';
import { Cancelamento, CartaDeCorrecao, CienciaDaOperacao, ConfirmacaoDaOperacao, ConsultaNFe, DesconhecimentoDaOperacao, DFePorChaveNFe, DFePorNSU, DFePorUltimoNSU, EPEC, EventoNFe, LayoutNFe, NFe, NFeWizardProps, OperacaoNaoRealizada, ProtNFe } from '../nfe/index.js';
export interface NFeWizardImpl {
    NFE_LoadEnvironment({ config }: {
        config: NFeWizardProps;
    }): Promise<void>;
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
    NFE_Autorizacao(data: NFe): Promise<{
        NFe: LayoutNFe;
        protNFe: ProtNFe;
    }[]>;
    NFe: LayoutNFe;
    protNFe: ProtNFe;
}
//# sourceMappingURL=NFeWizardImpl.d.ts.map