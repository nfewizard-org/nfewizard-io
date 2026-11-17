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

/**
 * Vinculação com a transação de pagamento do DF-e (NT 2026.006 - split payment), NF-e e NFC-e.
 *
 * No leiaute, nPag e idTransacao são atributos do gPgto. Os tipos da lib e o JSON gerado a partir
 * de um XML em string trazem esses atributos como campos comuns; aqui eles passam para `$`, que o
 * xml2js grava como atributo. O xml2js também segue a ordem das chaves do objeto, por isso os
 * filhos do gPgto e o próprio gPgtoVinc vão para a posição do leiaute.
 */

type Objeto = Record<string, any>;

/** Grupos da infNFe que vêm depois do gPgtoVinc (YC), na ordem do leiaute. */
const DEPOIS_DE_GPGTOVINC = ['infAdic', 'exporta', 'compra', 'cana', 'infRespTec', 'infSolicNFF', 'agropecuario', 'infPAA'];

/** Filhos do gPgto, na ordem do leiaute (grupo YC da nota e evento 110300). */
const FILHOS_GPGTO = ['tpMeioPgto', 'CNPJReceb', 'CNPJBasePSP'];

/** Elementos do detEvento da Vinculação Pagamento (110300), na ordem do schema e110300_v1.00.xsd. */
const FILHOS_DET_EVENTO_110300 = ['descEvento', 'cOrgaoAutor', 'tpAutor', 'verAplic', 'nProt', 'gPgto'];

const ehObjeto = (valor: unknown): valor is Objeto =>
    typeof valor === 'object' && valor !== null && !Array.isArray(valor);

/** Cópia de `obj` com as chaves de `ordem` primeiro; as demais ficam no fim, na ordem original. */
const copiarNaOrdem = (obj: Objeto, ordem: readonly string[]): Objeto => {
    const chaves = Object.keys(obj);
    const conhecidas = ordem.filter(chave => chaves.includes(chave));
    const demais = chaves.filter(chave => !ordem.includes(chave));
    return Object.fromEntries([...conhecidas, ...demais].map(chave => [chave, obj[chave]]));
};

/** Cópia do gPgto com `atributos` em `$` e os filhos na ordem do leiaute. */
const montarGPgto = (gPgto: unknown, atributos: readonly string[]): unknown => {
    if (!ehObjeto(gPgto)) return gPgto;

    const { $, ...campos } = gPgto;
    const atributosXml: Objeto = ehObjeto($) ? { ...$ } : {};
    for (const atributo of atributos) {
        if (campos[atributo] === undefined) continue;
        atributosXml[atributo] = campos[atributo];
        delete campos[atributo];
    }

    const filhos = copiarNaOrdem(campos, FILHOS_GPGTO);
    return Object.keys(atributosXml).length > 0 ? { $: atributosXml, ...filhos } : filhos;
};

const montarListaGPgto = (gPgto: unknown, atributos: readonly string[]): unknown =>
    Array.isArray(gPgto) ? gPgto.map(item => montarGPgto(item, atributos)) : montarGPgto(gPgto, atributos);

/**
 * Prepara o grupo `gPgtoVinc` (YC) de uma `infNFe` (modelos 55 e 65): `nPag` e `idTransacao` viram
 * atributos de cada `gPgto`, os filhos seguem a ordem do leiaute e o grupo fica depois do
 * `infIntermed` e antes do `infAdic`. Altera o objeto recebido; sem `gPgtoVinc`, nada muda.
 */
export const formatarGrupoPgtoVinc = (infNFe: unknown): void => {
    if (!ehObjeto(infNFe) || !ehObjeto(infNFe.gPgtoVinc)) return;

    const { gPgto, ...demais } = infNFe.gPgtoVinc;
    const grupo = { gPgto: montarListaGPgto(gPgto, ['nPag', 'idTransacao']), ...demais };

    const chaves = Object.keys(infNFe).filter(chave => chave !== 'gPgtoVinc');
    const posicao = chaves.findIndex(chave => DEPOIS_DE_GPGTOVINC.includes(chave));
    const posteriores = posicao === -1 ? [] : chaves.slice(posicao);
    const valores = posteriores.map(chave => infNFe[chave]);

    delete infNFe.gPgtoVinc;
    posteriores.forEach(chave => delete infNFe[chave]);
    infNFe.gPgtoVinc = grupo;
    posteriores.forEach((chave, i) => { infNFe[chave] = valores[i]; });
};

/**
 * Devolve uma cópia do `detEvento` da Vinculação Pagamento (110300) pronta para o xml2js:
 * `idTransacao` vira atributo do `gPgto` e os elementos seguem a ordem do schema e110300.
 * Não altera o objeto recebido.
 */
export const formatarDetEventoVinculacaoPagamento = <T>(detEvento: T): T => {
    if (!ehObjeto(detEvento) || !('gPgto' in detEvento)) return detEvento;

    const copia = { ...detEvento, gPgto: montarListaGPgto(detEvento.gPgto, ['idTransacao']) };
    return copiarNaOrdem(copia, FILHOS_DET_EVENTO_110300) as T;
};
