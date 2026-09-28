// @ts-nocheck
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
import { CTeGerarDacte } from '../CTEGerarDacte';

/**
 * Monta um CT-e mínimo, só com os documentos originários do tipo NF-e.
 * As chaves têm DV conferido com o Keys::verifyingDigit do sped-common.
 */
const buildDacte = (chaves: string[]) => new CTeGerarDacte({
    data: {
        CTe: {
            infCte: {
                infCTeNorm: {
                    infDoc: {
                        infNFe: chaves.map((chave) => ({ chave })),
                    },
                },
            },
        },
    },
    chave: '',
    outputPath: '',
});

describe('CTeGerarDacte - documentos originários (NF-e)', () => {
    it('deve extrair o CNPJ alfanumérico do emitente e a série/número da chave', () => {
        const [documento] = buildDacte(['35260912ABC34501DE35550010000001231123456784']).getDocumentosOriginarios();

        expect(documento.documentoEmitente).toBe('12.ABC.345/01DE-35');
        expect(documento.serieNumero).toBe('001 / 123');
        expect(documento.chave).toBe('35260912ABC34501DE35550010000001231123456784');
    });

    it('deve manter a extração para chaves com CNPJ numérico', () => {
        const [documento] = buildDacte(['35260911222333000181550010000001231123456783']).getDocumentosOriginarios();

        expect(documento.documentoEmitente).toBe('11.222.333/0001-81');
        expect(documento.serieNumero).toBe('001 / 123');
    });

    it('deve ignorar espaços na chave informada', () => {
        const [documento] = buildDacte(['3526 0912 ABC3 4501 DE35 5500 1000 0001 2311 2345 6784']).getDocumentosOriginarios();

        expect(documento.documentoEmitente).toBe('12.ABC.345/01DE-35');
        expect(documento.serieNumero).toBe('001 / 123');
    });
});
