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
 * Posicionamento dos campos da NT 2026.005 (Simples Nacional na Reforma Tributária).
 *
 * O xml2js serializa as chaves na ordem em que estão no objeto. Quem monta o JSON na
 * ordem do leiaute não é afetado, mas quem acrescenta os campos novos no fim de um
 * objeto existente gera um XML que o schema rejeita. Por isso a lib move apenas esses
 * campos para a posição do leiaute (leiauteNFe_v4.00.xsd do Pacote de Liberação 010h),
 * sem mexer no restante do objeto.
 */

type Objeto = Record<string, any>;

/** Elementos que vêm depois de cada campo novo, na ordem do leiaute. */
const DEPOIS_DE_TP_REGIME_IBSCBS = ['ISUFEmit'];
const DEPOIS_DE_CATIVSN = [
    'DI', 'detExport', 'xPed', 'nItemPed', 'nFCI', 'rastro', 'infProdNFF', 'infProdEmb',
    'veicProd', 'med', 'arma', 'comb', 'nRECOPI',
];
const DEPOIS_DE_GTRIBSN_ITEM = ['gEstornoCred', 'gCredPresOper', 'gCredPresIBSZFM'];

const ehObjeto = (valor: unknown): valor is Objeto =>
    typeof valor === 'object' && valor !== null && !Array.isArray(valor);

/** Regrava as chaves de `obj`, no próprio objeto, na ordem de `chaves`. */
const regravarNaOrdem = (obj: Objeto, chaves: string[]): void => {
    const valores = chaves.map(chave => obj[chave]);
    chaves.forEach(chave => delete obj[chave]);
    chaves.forEach((chave, i) => { obj[chave] = valores[i]; });
};

/**
 * Move `campo` para antes do primeiro elemento de `sucessores` presente no objeto,
 * ou para o fim quando nenhum deles estiver presente.
 */
const posicionarAntesDe = (obj: unknown, campo: string, sucessores: readonly string[]): void => {
    if (!ehObjeto(obj) || !Object.prototype.hasOwnProperty.call(obj, campo)) return;

    const chaves = Object.keys(obj).filter(chave => chave !== campo);
    const posicao = chaves.findIndex(chave => sucessores.includes(chave));
    chaves.splice(posicao === -1 ? chaves.length : posicao, 0, campo);
    regravarNaOrdem(obj, chaves);
};

/** Ordena os filhos de um grupo novo; chaves fora de `ordem` ficam no fim, na ordem original. */
const ordenarFilhos = (obj: unknown, ordem: readonly string[]): void => {
    if (!ehObjeto(obj)) return;

    const chaves = Object.keys(obj);
    const conhecidas = ordem.filter(chave => chaves.includes(chave));
    const demais = chaves.filter(chave => !ordem.includes(chave));
    regravarNaOrdem(obj, [...conhecidas, ...demais]);
};

/**
 * Coloca na posição do leiaute os campos da NT 2026.005 de uma `infNFe` (modelos 55 e 65):
 * - `emit.tpRegimeIBSCBS` (C21a): logo depois do CRT;
 * - `det[].prod.cAtivSN` (I17d): depois de indTot/indBemMovelUsado e antes de DI;
 * - `det[].imposto.IBSCBS.gTribSN` (UB115a): depois do gIBSCBS e antes do gEstornoCred;
 * - `total.IBSCBSTot.gTribSN` (W59h): último filho do IBSCBSTot.
 *
 * Também ordena os filhos dos grupos `gTribSN`. Altera o objeto recebido; objetos sem
 * esses campos ficam como estão.
 */
export const ordenarCamposSimplesNacional = (infNFe: unknown): void => {
    if (!ehObjeto(infNFe)) return;

    posicionarAntesDe(infNFe.emit, 'tpRegimeIBSCBS', DEPOIS_DE_TP_REGIME_IBSCBS);

    const itens: unknown[] = Array.isArray(infNFe.det) ? infNFe.det : [infNFe.det];
    for (const det of itens) {
        if (!ehObjeto(det)) continue;

        posicionarAntesDe(det.prod, 'cAtivSN', DEPOIS_DE_CATIVSN);

        const ibscbs = ehObjeto(det.imposto) ? det.imposto.IBSCBS : undefined;
        posicionarAntesDe(ibscbs, 'gTribSN', DEPOIS_DE_GTRIBSN_ITEM);

        const gTribSN = ehObjeto(ibscbs) ? ibscbs.gTribSN : undefined;
        ordenarFilhos(gTribSN, ['gIBSSN', 'gCBSSN']);
        if (ehObjeto(gTribSN)) {
            ordenarFilhos(gTribSN.gIBSSN, ['pIBSSN', 'vIBSSN']);
            ordenarFilhos(gTribSN.gCBSSN, ['pCBSSN', 'vCBSSN']);
        }
    }

    const ibscbsTot = ehObjeto(infNFe.total) ? infNFe.total.IBSCBSTot : undefined;
    posicionarAntesDe(ibscbsTot, 'gTribSN', []);
    if (ehObjeto(ibscbsTot)) {
        ordenarFilhos(ibscbsTot.gTribSN, ['vIBSSN', 'vCBSSN']);
    }
};
