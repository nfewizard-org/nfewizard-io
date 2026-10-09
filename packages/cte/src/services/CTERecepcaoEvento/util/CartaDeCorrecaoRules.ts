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
import { InfCorrecaoCTe } from '@nfewizard/types/cte';

export const XCOND_USO_CCE =
    'A Carta de Correção é disciplinada pelo Art. 58-B do CONVÊNIO/SINIEF 06/89: Fica permitida a utilização de carta de correção, para regularização de erro ocorrido na emissão de documentos fiscais relativos à prestação de serviço de transporte, desde que o erro não esteja relacionado com: I - as variáveis que determinam o valor do imposto tais como: base de cálculo, alíquota, diferença de preço, quantidade, valor da prestação;II - a correção de dados cadastrais que implique mudança do emitente, tomador, remetente ou do destinatário;III - a data de emissão ou de saída.';

/**
 * Campos que o MOC (Tabelas e Informações, item 3.2.1) impede de alterar por CC-e, com
 * implementação obrigatória na SEFAZ. Campos facultativos na SEFAZ (CNPJ/CPF/IE de
 * toma4, rem e dest) não são bloqueados aqui, para não impedir correções que a SEFAZ aceita.
 */
const CAMPOS_IMPEDIDOS: Record<string, string[]> = {
    infcte: ['versao', 'id'],
    ide: ['cuf', 'cct', 'mod', 'serie', 'nct', 'tpemis', 'cdv', 'tpamb', 'dhemi', 'modal'],
    toma3: ['toma'],
    emit: ['cnpj', 'ie'],
    vprest: ['vtprest'],
    comp: ['vcomp'],
    vprescomp: ['vtprest'],
    compcomp: ['vcomp'],
    infnfe: ['chave'],
    icms00: ['cst', 'vbc', 'picms', 'vicms'],
    icms20: ['cst', 'predbc', 'vbc', 'picms', 'vicms'],
    icms45: ['cst'],
    icms60: ['cst', 'vbcstret', 'vicmsstret', 'picmsstret', 'vcred'],
    icms90: ['cst', 'predbc', 'vbc', 'picms', 'vicms', 'vcred'],
    icmsoutrauf: ['cst', 'predbcoutrauf', 'vbcoutrauf', 'picmsoutrauf', 'vicmsoutrauf'],
    icmssn: ['indsn', 'cst'],
};

export function validarCamposCartaDeCorrecao(itens: InfCorrecaoCTe[]): void {
    if (!itens.length) {
        throw new Error('A Carta de Correção exige ao menos um item em infCorrecao.');
    }
    for (const item of itens) {
        const grupo = String(item.grupoAlterado || '').toLowerCase();
        const campo = String(item.campoAlterado || '').toLowerCase();
        if (CAMPOS_IMPEDIDOS[grupo]?.includes(campo)) {
            throw new Error(
                `O campo '${item.campoAlterado}' do grupo '${item.grupoAlterado}' não pode ser alterado por Carta de Correção (Art. 58-B do Convênio SINIEF 06/89).`
            );
        }
    }
}
