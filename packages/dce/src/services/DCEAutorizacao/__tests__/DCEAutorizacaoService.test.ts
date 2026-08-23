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

const { DCEAutorizacaoService } = require('../DCEAutorizacaoService');
const { XmlParser } = require('@nfewizard/shared');

const findInObj = (obj: unknown, key: string): unknown => {
    if (!obj || typeof obj !== 'object') {
        return '';
    }

    if (Object.prototype.hasOwnProperty.call(obj, key)) {
        return (obj as Record<string, unknown>)[key];
    }

    for (const value of Object.values(obj as Record<string, unknown>)) {
        const found = findInObj(value, key);
        if (found !== '') {
            return found;
        }
    }

    return '';
};

const buildService = () => {
    const environment = {
        config: {
            dfe: { UF: 'SP' },
        },
    };

    const utility = {
        findInObj: jest.fn((obj, key) => findInObj(obj, key)),
    };

    const xmlBuilder = {
        gerarXml: jest.fn().mockReturnValue('<DCe><infDCe Id="DCe123" /></DCe>'),
        assinarXML: jest.fn().mockImplementation((xml) => `${xml}<Signature />`),
    };

    const saveFiles = {
        salvaArquivos: jest.fn(),
    };

    const gerarConsulta = {
        gerarConsulta: jest.fn().mockResolvedValue({
            xmlFormated: '<soap:Envelope>payload</soap:Envelope>',
            agent: {},
            webServiceUrl: 'https://dce.test/autorizacao',
            action: 'http://www.portalfiscal.inf.br/dce/wsdl/DCeAutorizacao/dceAutorizacao',
        }),
    };

    const axios = {
        post: jest.fn(),
    };

    const service = new DCEAutorizacaoService(environment, utility, xmlBuilder, axios, saveFiles, gerarConsulta);

    return {
        service,
        utility,
        xmlBuilder,
        saveFiles,
        gerarConsulta,
        axios,
    };
};

describe('DCEAutorizacaoService', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('deve gerar resposta padronizada na autorizacao normal', async () => {
        const { service, axios, saveFiles, gerarConsulta } = buildService();

        axios.post.mockResolvedValue({
            data: '<retDCe><xMotivo>Autorizado o uso da DCe</xMotivo></retDCe>',
        });

        jest.spyOn(XmlParser.prototype, 'convertXmlToJson').mockReturnValue({
            retDCe: {
                cStat: '100',
                xMotivo: 'Autorizado o uso da DCe',
            },
        });

        const response = await service.Exec({ xml: '<DCe><infDCe Id="DCe123" /></DCe>' });

        expect(response.success).toBe(true);
        expect(response.xMotivo).toBe('Autorizado o uso da DCe');
        expect(response.response).toEqual(expect.objectContaining({
            retDCe: expect.objectContaining({
                xMotivo: 'Autorizado o uso da DCe',
            }),
        }));
        expect(gerarConsulta.gerarConsulta).toHaveBeenCalledWith(
            '<DCe><infDCe Id="DCe123" /></DCe>',
            'DCEAutorizacao',
            true,
            '1.00',
            'DCE',
            true,
            'dceAutorizacao',
            'dceDadosMsg'
        );
        expect(saveFiles.salvaArquivos).toHaveBeenCalledTimes(1);
    });

    it('deve rejeitar cStat 416 na autorizacao compactada', async () => {
        const { service, axios } = buildService();

        axios.post.mockResolvedValue({
            data: '<retDCe><cStat>416</cStat><xMotivo>Falha na descompactacao</xMotivo></retDCe>',
        });

        jest.spyOn(XmlParser.prototype, 'convertXmlToJson').mockReturnValue({
            retDCe: {
                cStat: '416',
                xMotivo: 'Falha na descompactacao',
            },
        });

        await expect(service.ExecZip({ xml: '<DCe><infDCe Id="DCe123" /></DCe>' })).rejects.toThrow(
            'DCE_AutorizacaoZip: Falha na descompactacao da area de dados: Falha na descompactacao'
        );
    });
});