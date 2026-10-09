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
import { XmlBuilder } from '@nfewizard/shared';
import { CTECancelamentoService } from '../CTECancelamentoService';
import { CTECartaDeCorrecaoService } from '../CTECartaDeCorrecaoService';

const CHAVE = '41240111222333000181570010000000011123456782';

function createService(Service = CTECancelamentoService) {
    const environment = { getConfig: () => ({ nfe: { ambiente: 2 } }) };
    const real = new XmlBuilder(environment);
    // assinatura exige certificado real; nos testes de montagem o XML segue sem assinar
    const xmlBuilder = { gerarXml: real.gerarXml.bind(real), assinarXML: (xml: string) => xml };
    return new Service(environment, undefined, xmlBuilder);
}

describe('CTERecepcaoEventoService - getID', () => {
    it('monta o Id com ID + tpEvento + chCTe + nSeqEvento de 3 dígitos (55 caracteres)', () => {
        const id = createService()['getID']('110111', CHAVE, 1);
        expect(id).toBe(`ID110111${CHAVE}001`);
        expect(id).toHaveLength(55);
    });

    it('rejeita chave inválida e nSeqEvento fora do intervalo', () => {
        const s = createService();
        expect(() => s['getID']('110111', '123', 1)).toThrow('chCTe deve ser uma string com 44 dígitos.');
        expect(() => s['getID']('110111', CHAVE, 1000)).toThrow('nSeqEvento deve ser um número inteiro entre 1 e 999.');
        expect(() => s['getID']('1101', CHAVE, 1)).toThrow('tpEvento deve ser uma string com 6 dígitos.');
    });
});

describe('CTECancelamentoService - gerarXml', () => {
    it('monta eventoCTe/infEvento com evCancCTe, UF e CNPJ derivados da chave', () => {
        const xml = createService()['gerarXml']({
            chCTe: CHAVE,
            tpEvento: '110111',
            dhEvento: '2024-01-16T10:00:00-03:00',
            detEvento: { descEvento: 'Cancelamento', nProt: '141240000000001', xJust: 'Erro de digitacao no valor' },
        });

        expect(xml).toBe(
            `<eventoCTe versao="4.00" xmlns="http://www.portalfiscal.inf.br/cte"><infEvento Id="ID110111${CHAVE}001"><cOrgao>41</cOrgao><tpAmb>2</tpAmb><CNPJ>11222333000181</CNPJ><chCTe>${CHAVE}</chCTe><dhEvento>2024-01-16T10:00:00-03:00</dhEvento><tpEvento>110111</tpEvento><nSeqEvento>1</nSeqEvento><detEvento versaoEvento="4.00"><evCancCTe><descEvento>Cancelamento</descEvento><nProt>141240000000001</nProt><xJust>Erro de digitacao no valor</xJust></evCancCTe></detEvento></infEvento></eventoCTe>`
        );
    });
});

describe('CTECartaDeCorrecaoService - gerarXml', () => {
    const base = {
        chCTe: CHAVE,
        tpEvento: '110110',
        dhEvento: '2024-01-16T10:00:00-03:00',
    };

    it('inclui infCorrecao e preenche xCondUso oficial quando omitido', () => {
        const xml = createService(CTECartaDeCorrecaoService)['gerarXml']({
            ...base,
            detEvento: {
                descEvento: 'Carta de Correção',
                infCorrecao: { grupoAlterado: 'ide', campoAlterado: 'natOp', valorAlterado: 'PRESTACAO DE SERVICO' },
            },
        });

        expect(xml).toContain('<evCCeCTe><descEvento>Carta de Correção</descEvento><infCorrecao><grupoAlterado>ide</grupoAlterado><campoAlterado>natOp</campoAlterado><valorAlterado>PRESTACAO DE SERVICO</valorAlterado></infCorrecao>');
        expect(xml).toContain('<xCondUso>A Carta de Correção é disciplinada pelo Art. 58-B');
    });

    it('bloqueia campos impedidos de correção (ex.: ide/dhEmi, ICMS00/vBC)', () => {
        const s = createService(CTECartaDeCorrecaoService);
        const evento = (grupoAlterado, campoAlterado) => ({
            ...base,
            detEvento: { descEvento: 'Carta de Correção', infCorrecao: [{ grupoAlterado, campoAlterado, valorAlterado: 'x' }] },
        });

        expect(() => s['gerarXml'](evento('ide', 'dhEmi'))).toThrow("O campo 'dhEmi' do grupo 'ide' não pode ser alterado");
        expect(() => s['gerarXml'](evento('ICMS00', 'vBC'))).toThrow("O campo 'vBC' do grupo 'ICMS00' não pode ser alterado");
    });
});

describe('CTERecepcaoEventoService - demais eventos', () => {
    const base = { chCTe: CHAVE, dhEvento: '2024-01-16T10:00:00-03:00' };

    it('monta o Registro Multimodal (110160) com evRegMultimodal', () => {
        const xml = createService()['gerarXml']({
            ...base,
            tpEvento: '110160',
            detEvento: { descEvento: 'Registro Multimodal', xRegistro: 'Documento X conforme Lei 9611', nDoc: '123' },
        });
        expect(xml).toContain('<evRegMultimodal><descEvento>Registro Multimodal</descEvento><xRegistro>Documento X conforme Lei 9611</xRegistro><nDoc>123</nDoc></evRegMultimodal>');
    });

    it('exige CNPJ/CPF do tomador nos eventos de desacordo (610110/610111)', () => {
        const s = createService();
        const evento = {
            ...base,
            tpEvento: '610110',
            detEvento: { descEvento: 'Prestacao do Servico em Desacordo', indDesacordoOper: '1' },
        };
        expect(() => s['gerarXml'](evento)).toThrow('é de autoria do tomador');

        const xml = s['gerarXml']({ ...evento, CNPJ: '99888777000161' });
        expect(xml).toContain('<CNPJ>99888777000161</CNPJ>');
        expect(xml).toContain('<evPrestDesacordo>');
    });

    it('monta Comprovante de Entrega com infEntrega repetido por NF-e', () => {
        const xml = createService()['gerarXml']({
            ...base,
            tpEvento: '110180',
            detEvento: {
                descEvento: 'Comprovante de Entrega do CTe',
                nProt: '141240000000001',
                dhEntrega: '2024-01-16T09:00:00-03:00',
                nDoc: '12345678',
                xNome: 'JOAO',
                hashEntrega: 'abc',
                dhHashEntrega: '2024-01-16T09:01:00-03:00',
                infEntrega: [{ chNFe: '1'.repeat(44) }, { chNFe: '2'.repeat(44) }],
            },
        });
        expect(xml).toContain(`<infEntrega><chNFe>${'1'.repeat(44)}</chNFe></infEntrega><infEntrega><chNFe>${'2'.repeat(44)}</chNFe></infEntrega>`);
    });

    it('exige xJustMotivo no Insucesso de Entrega quando tpMotivo=4', () => {
        const s = createService();
        const evento = {
            ...base,
            tpEvento: '110190',
            detEvento: {
                descEvento: 'Insucesso na Entrega do CT-e',
                nProt: '141240000000001',
                dhTentativaEntrega: '2024-01-16T09:00:00-03:00',
                tpMotivo: 4,
                hashTentativaEntrega: 'abc',
                dhHashTentativaEntrega: '2024-01-16T09:01:00-03:00',
            },
        };
        expect(() => s['gerarXml'](evento)).toThrow('xJustMotivo é obrigatório quando tpMotivo=4');
    });

    it('serializa nPag e idTransacao como atributos de pgto na Vinculação de Pagamento', () => {
        const xml = createService()['gerarXml']({
            ...base,
            tpEvento: '110300',
            detEvento: {
                descEvento: 'Vinculação Pagamento',
                nProt: '141240000000001',
                pgto: { nPag: 1, idTransacao: 'TX123456', tpMeioPgto: '17', CNPJReceb: '11222333000181', CNPJBasePSP: '11222333' },
            },
        });
        expect(xml).toContain('<pgto nPag="1" idTransacao="TX123456"><tpMeioPgto>17</tpMeioPgto><CNPJReceb>11222333000181</CNPJReceb><CNPJBasePSP>11222333</CNPJBasePSP></pgto>');
    });
});

describe('CTERecepcaoEventoService - EPEC e roteamento SVC', () => {
    const chaveEpec = CHAVE.substring(0, 34) + '4' + CHAVE.substring(35);
    const epec = (chCTe) => ({
        chCTe,
        tpEvento: '110113',
        dhEvento: '2024-01-16T10:00:00-03:00',
        detEvento: {
            descEvento: 'EPEC', xJust: 'Falha de comunicacao com a SEFAZ', vICMS: '10.00', vTPrest: '100.00', vCarga: '500.00',
            toma4: { toma: 3, UF: 'PR', CNPJ: '99888777000161' }, modal: '01', UFIni: 'PR', UFFim: 'SP', tpCTe: 0, dhEmi: '2024-01-16T09:00:00-03:00',
        },
    });

    it('monta evEPECCTe e exige chave com tpEmis=4', () => {
        const s = createService();
        expect(s['gerarXml'](epec(chaveEpec))).toContain('<evEPECCTe><descEvento>EPEC</descEvento><xJust>Falha de comunicacao com a SEFAZ</xJust><vICMS>10.00</vICMS>');
        expect(() => s['gerarXml'](epec(CHAVE))).toThrow('O EPEC exige chave de acesso com tpEmis=4');
    });

    it('envia EPEC e eventos de CT-e em SVC (tpEmis 7/8) à SVC; os demais ao autorizador normal', () => {
        const s = createService();
        const svc = CHAVE.substring(0, 34) + '8' + CHAVE.substring(35);
        expect(s['getModelo'](epec(chaveEpec))).toBe('CTeSVC');
        expect(s['getModelo']({ chCTe: svc, tpEvento: '110111' })).toBe('CTeSVC');
        expect(s['getModelo']({ chCTe: CHAVE, tpEvento: '110111' })).toBe('CTe');
    });
});
