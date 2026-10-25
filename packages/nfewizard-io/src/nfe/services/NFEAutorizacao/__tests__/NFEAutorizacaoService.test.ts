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
const NFEAutorizacaoService = require('../NFEAutorizacaoService').default;
const { NFERetornoAutorizacaoService } = require('../../NFERetornoAutorizacao/NFERetornoAutorizacaoService');
const { generateKeyPairSync, verify } = require('crypto');

describe('NFEAutorizacaoService - normalização do destinatário', () => {
    it('deve preservar idEstrangeiro quando não houver documento brasileiro', () => {
        const service = new NFEAutorizacaoService();
        const dest = {
            idEstrangeiro: 'ABC123',
            xNome: 'CLIENTE EXTERIOR',
            indIEDest: 9,
        };

        const result = service['normalizaDestinatario'](dest);

        expect(result).toMatchObject({
            idEstrangeiro: 'ABC123',
            xNome: 'CLIENTE EXTERIOR',
            indIEDest: 9,
        });
        expect(result.CNPJCPF).toBeUndefined();
        expect(result.CNPJ).toBeUndefined();
        expect(result.CPF).toBeUndefined();
    });

    it('deve preservar idEstrangeiro vazio quando informado sem CPF ou CNPJ', () => {
        const service = new NFEAutorizacaoService();
        const dest = {
            idEstrangeiro: '',
            xNome: 'CLIENTE EXTERIOR',
            indIEDest: 9,
        };

        const result = service['normalizaDestinatario'](dest);

        expect(Object.prototype.hasOwnProperty.call(result, 'idEstrangeiro')).toBe(true);
        expect(result.idEstrangeiro).toBe('');
        expect(result.CNPJCPF).toBeUndefined();
    });

    it('deve converter CNPJCPF válido para a tag de documento correspondente', () => {
        const service = new NFEAutorizacaoService();
        const dest = {
            CNPJCPF: '02916265038485',
            xNome: 'CLIENTE NACIONAL',
        };

        const result = service['normalizaDestinatario'](dest);

        expect(result).toMatchObject({
            CNPJ: '02916265038485',
            xNome: 'CLIENTE NACIONAL',
        });
        expect(result.CNPJCPF).toBeUndefined();
    });
});

describe('NFEAutorizacaoService - DV da chave de acesso com CNPJ alfanumérico', () => {
    // CNPJ de exemplo da Receita (12.ABC.345/01DE-35); os DVs esperados foram
    // conferidos com o Keys::verifyingDigit do sped-common
    const buildNFeComEmitente = (CNPJCPF: string) => ({
        infNFe: {
            Id: undefined,
            ide: {
                cUF: 35,
                mod: 55,
                serie: '1',
                nNF: '123',
                tpEmis: 1,
                cNF: '12345678',
                dhEmi: '2026-09-23T10:00:00-03:00',
            },
            emit: {
                CNPJCPF,
            },
        },
    });

    it('deve calcular o DV com o valor ASCII menos 48 quando o CNPJ tem letras', () => {
        const service = new NFEAutorizacaoService();
        expect(service['calcularModulo11']('35260912ABC34501DE3555001000000123112345678')).toBe(4);
    });

    it('deve manter o DV das chaves com CNPJ numérico', () => {
        const service = new NFEAutorizacaoService();
        expect(service['calcularModulo11']('3526091122233300018155001000000123112345678')).toBe(3);
    });

    it('deve montar a chave de acesso completa para emitente com CNPJ alfanumérico', () => {
        const service = new NFEAutorizacaoService();
        const nfe = buildNFeComEmitente('12ABC34501DE35');
        const { chaveAcesso, dv } = service['calcularDigitoVerificador'](nfe);
        expect(dv).toBe(4);
        expect(chaveAcesso).toBe('NFe35260912ABC34501DE35550010000001231123456784');
        expect(chaveAcesso.replace('NFe', '')).toMatch(/^[0-9]{6}[0-9A-Z]{12}[0-9]{26}$/);
    });
});

describe('NFEAutorizacaoService - chave de acesso com emitente pessoa física (CPF)', () => {
    // CPF fictício 111.444.777-35; a chave esperada foi conferida com o
    // Keys::build do sped-common, que completa o CPF com zeros até 14 posições
    const buildNFeComCpf = (CNPJCPF: string) => ({
        infNFe: {
            Id: undefined,
            ide: {
                cUF: 51,
                mod: 55,
                serie: '1',
                nNF: '123',
                tpEmis: 1,
                cNF: '12345678',
                dhEmi: '2026-09-24T10:00:00-04:00',
            },
            emit: {
                CNPJCPF,
            },
        },
    });

    it('deve completar o CPF do emitente com zeros à esquerda na chave de acesso', () => {
        const service = new NFEAutorizacaoService();
        const nfe = buildNFeComCpf('11144477735');
        const { chaveAcesso, dv } = service['calcularDigitoVerificador'](nfe);
        expect(dv).toBe(2);
        expect(chaveAcesso).toBe('NFe51260900011144477735550010000001231123456782');
    });

    it('deve gerar a chave com 44 posições quando o emitente é CPF', () => {
        const service = new NFEAutorizacaoService();
        const nfe = buildNFeComCpf('11144477735');
        const { chaveAcesso } = service['calcularDigitoVerificador'](nfe);
        expect(chaveAcesso.replace('NFe', '')).toMatch(/^[0-9]{44}$/);
    });
});

const CHAVE_OFFLINE = '35261012345678000195550010000000019000000017';

const buildDependencias = () => {
    const config = { dfe: { UF: 'SP' }, nfe: { ambiente: 2 } };
    return {
        environment: { config, getConfig: () => config },
        utility: { salvaConsulta: jest.fn(), salvaRetorno: jest.fn(), salvaXML: jest.fn() },
        gerarConsulta: { gerarConsulta: jest.fn().mockRejectedValue(new Error('interrompido')) },
    };
};

const buildLote = (emit: Record<string, any>, ide: Record<string, any> = { tpEmis: 1, tpImp: 1 }) => ({
    idLote: 1,
    indSinc: 1,
    NFe: { infNFe: { ide: { tpAmb: 2, ...ide }, emit: { CNPJCPF: '12345678000195', ...emit } } },
});

describe('NFEAutorizacaoService - autorização na SVRS para contribuinte exclusivo do IBS/CBS (NT 2026.007)', () => {
    it('deve direcionar para a SVRS quando o emitente não informa a IE', () => {
        const service = new NFEAutorizacaoService();
        expect(service['getModelo'](buildLote({}))).toBe('NFeSVRS');
        expect(service['getModelo'](buildLote({ IE: '' }))).toBe('NFeSVRS');
    });

    it('deve manter a UF do emitente quando a IE é informada', () => {
        const service = new NFEAutorizacaoService();
        expect(service['getModelo'](buildLote({ IE: '123456789012' }))).toBe('NFe');
    });

    it('deve enviar a autorização com o modelo NFeSVRS', async () => {
        const { environment, utility, gerarConsulta } = buildDependencias();
        const service = new NFEAutorizacaoService(environment, utility, undefined, undefined, undefined, gerarConsulta);
        service['gerarXmlNFeAutorizacao'] = jest.fn(() => '<enviNFe/>');

        await expect(service.Exec(buildLote({}))).rejects.toThrow('interrompido');
        expect(gerarConsulta.gerarConsulta).toHaveBeenCalledWith('<enviNFe/>', 'NFEAutorizacao', false, '', 'NFeSVRS');
    });

    it('deve repassar o modelo para a consulta do retorno da autorização', async () => {
        const spy = jest.spyOn(NFERetornoAutorizacaoService.prototype, 'getXmlRetorno')
            .mockImplementation(function () { return Promise.resolve({ modelo: this.modelo }); });
        const service = new NFEAutorizacaoService(undefined, { getProtNFe: () => ({ nRec: '', protNFe: [{}] }) });

        const retorno = await service['trataRetorno']('<retEnviNFe/>', 1, {}, 'NFeSVRS');

        expect(retorno).toEqual({ modelo: 'NFeSVRS' });
        spy.mockRestore();
    });

    it('deve consultar o recibo no mesmo ambiente da autorização', async () => {
        const { gerarConsulta } = buildDependencias();
        const service = new NFERetornoAutorizacaoService({ getConfig: () => ({ nfe: { ambiente: 2 } }) }, undefined, { gerarXml: () => '<consReciNFe/>' }, undefined, undefined, gerarConsulta);
        service.modelo = 'NFeSVRS';

        await expect(service.getRetornoRecibo('351000000000001', [])).rejects.toThrow('interrompido');
        expect(gerarConsulta.gerarConsulta).toHaveBeenCalledWith('<consReciNFe/>', 'NFERetAutorizacao', false, '', 'NFeSVRS');
    });
});

describe('NFEAutorizacaoService - QR Code v3 da NF-e com DANFE Simplificado Tipo 2 (NT 2026.002)', () => {
    const utility = {
        getUrlNFCe: (metodo: string) => metodo === 'URL-QRCode'
            ? 'https://www.homologacao.nfce.fazenda.sp.gov.br/qrcode'
            : 'https://www.homologacao.nfce.fazenda.sp.gov.br/consulta',
    };
    const buildNFe = (tpEmis: number, dest?: Record<string, any>) => ({
        infNFe: {
            ide: { tpEmis, tpAmb: 2, dhEmi: '2026-10-05T23:30:00-03:00' },
            dest,
            total: { ICMSTot: { vNF: '103.00' } },
        },
    });
    const { privateKey, publicKey } = generateKeyPairSync('rsa', {
        modulusLength: 2048,
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
        publicKeyEncoding: { type: 'spki', format: 'pem' },
    });
    const separarAssinatura = (qrCode: string, parametros: string) => {
        const p = qrCode.split('?p=')[1];
        expect(p.startsWith(`${parametros}|`)).toBe(true);
        return p.slice(parametros.length + 1);
    };

    it('deve gerar o QR Code online sem parâmetros de contingência', () => {
        const service = new NFEAutorizacaoService(undefined, utility);
        expect(service['gerarInfNFeSupl'](buildNFe(1), `NFe${CHAVE_OFFLINE}`)).toEqual({
            qrCode: `https://www.homologacao.nfce.fazenda.sp.gov.br/qrcode?p=${CHAVE_OFFLINE}|3|2`,
            urlChave: 'https://www.homologacao.nfce.fazenda.sp.gov.br/consulta',
        });
    });

    it('deve gerar o QR Code off-line assinado com RSA-SHA1 pelo certificado do emitente', () => {
        const service = new NFEAutorizacaoService({ getCertKey: () => privateKey }, utility);
        const { qrCode } = service['gerarInfNFeSupl'](buildNFe(9, { CPF: '11144477735' }), `NFe${CHAVE_OFFLINE}`);
        const parametros = `${CHAVE_OFFLINE}|3|2|05|103.00|2|11144477735`;

        const assinatura = separarAssinatura(qrCode, parametros);

        expect(verify('RSA-SHA1', Buffer.from(parametros), publicKey, Buffer.from(assinatura, 'base64'))).toBe(true);
    });

    it('deve informar apenas os separadores quando o destinatário não é identificado ou é estrangeiro', () => {
        const service = new NFEAutorizacaoService({ getCertKey: () => privateKey }, utility);

        const semDestinatario = service['gerarInfNFeSupl'](buildNFe(9), `NFe${CHAVE_OFFLINE}`).qrCode;
        const estrangeiro = service['gerarInfNFeSupl'](buildNFe(9, { idEstrangeiro: 'ABC123' }), `NFe${CHAVE_OFFLINE}`).qrCode;
        const comCnpj = service['gerarInfNFeSupl'](buildNFe(9, { CNPJ: '12345678000195' }), `NFe${CHAVE_OFFLINE}`).qrCode;

        separarAssinatura(semDestinatario, `${CHAVE_OFFLINE}|3|2|05|103.00||`);
        separarAssinatura(estrangeiro, `${CHAVE_OFFLINE}|3|2|05|103.00|3|`);
        separarAssinatura(comCnpj, `${CHAVE_OFFLINE}|3|2|05|103.00|1|12345678000195`);
    });
});

describe('NFEAutorizacaoService - contingência off-line da NF-e (NT 2026.002)', () => {
    it('deve rejeitar tpEmis=9 sem DANFE Simplificado Tipo 2', () => {
        const service = new NFEAutorizacaoService();
        expect(() => service['gerarXmlNFeAutorizacao'](buildLote({ IE: '123' }, { tpEmis: 9, tpImp: 1 })))
            .toThrow('tpImp=6');
    });

    it('deve gerar a NF-e off-line sem transmitir para a SEFAZ', async () => {
        const { environment, utility, gerarConsulta } = buildDependencias();
        const service = new NFEAutorizacaoService(environment, utility, undefined, undefined, undefined, gerarConsulta);
        service['gerarXmlNFeAutorizacao'] = jest.fn(() => {
            service.xmlNFe.push(`<NFe><infNFe Id="NFe${CHAVE_OFFLINE}" versao="4.00"></infNFe></NFe>`);
            return '<enviNFe/>';
        });

        const retorno = await service.Exec(buildLote({ IE: '123' }, { tpEmis: 9, tpImp: 6 }));

        expect(gerarConsulta.gerarConsulta).not.toHaveBeenCalled();
        expect(retorno.emContingencia).toBe(true);
        expect(retorno.xMotivo).toEqual([expect.objectContaining({ chNFe: CHAVE_OFFLINE, cStat: '000' })]);
        expect(retorno.xmls[0].xmlAssinado).toContain(CHAVE_OFFLINE);
    });

    it('deve transmitir a NF-e off-line pelo NFE_TransmitirContingencia', async () => {
        const { environment, utility, gerarConsulta } = buildDependencias();
        const service = new NFEAutorizacaoService(environment, utility, undefined, undefined, undefined, gerarConsulta);
        service['gerarXmlNFeAutorizacao'] = jest.fn(() => '<enviNFe/>');

        await expect(service.ExecTransmitirContingencia(buildLote({ IE: '123' }, { tpEmis: 9, tpImp: 6 }))).rejects.toThrow('interrompido');
        expect(gerarConsulta.gerarConsulta).toHaveBeenCalledWith('<enviNFe/>', 'NFEAutorizacao', false, '', 'NFe');
    });

    it('deve manter a validação de tpEmis no NFE_TransmitirContingencia', async () => {
        const service = new NFEAutorizacaoService();
        await expect(service.ExecTransmitirContingencia(buildLote({ IE: '123' }, { tpEmis: 1, tpImp: 1 }))).rejects.toThrow('tpEmis=1 inválido');
    });
});
