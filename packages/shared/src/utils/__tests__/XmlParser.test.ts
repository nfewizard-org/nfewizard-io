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

import { XmlParser } from '../XmlParser';

describe('XmlParser.convertXmlEnvioNFeToJson', () => {
  const buildXml = (chave: string, CNPJ: string) =>
    `<NFe xmlns="http://www.portalfiscal.inf.br/nfe"><infNFe versao="4.00" Id="NFe${chave}"><ide/><emit><CNPJ>${CNPJ}</CNPJ></emit></infNFe></NFe>`;

  it('removes the NFe prefix from the Id of a numeric access key', () => {
    const chave = '35261012345678000195550010000000011123456781';

    const json = new XmlParser().convertXmlEnvioNFeToJson(buildXml(chave, '12345678000195'));

    expect(json.NFe.infNFe.Id).toBe(chave);
  });

  it('removes the NFe prefix from the Id of an access key with an alphanumeric CNPJ', () => {
    const chave = '35261012ABC34501DE35550010000000011123456781';

    const json = new XmlParser().convertXmlEnvioNFeToJson(buildXml(chave, '12ABC34501DE35'));

    expect(json.NFe.infNFe.Id).toBe(chave);
  });
});

describe('XmlParser.convertXmlNFSeToJson', () => {
  it('extracts data and chave when infNFSe has a valid Id', () => {
    const xml = `
      <NFSe>
        <infNFSe Id="NFS35000000000000000000000000000000000000000001">
          <nNFSe>1</nNFSe>
        </infNFSe>
      </NFSe>
    `;

    const { data, chave } = new XmlParser().convertXmlNFSeToJson(xml);

    expect(chave).toBe('35000000000000000000000000000000000000000001');
    expect((data as any).infNFSe.nNFSe).toBe('1');
  });

  it('throws when infNFSe has no Id attribute (access key), instead of silently returning an empty chave', () => {
    const xml = `
      <NFSe>
        <infNFSe>
          <nNFSe>1</nNFSe>
        </infNFSe>
      </NFSe>
    `;

    expect(() => new XmlParser().convertXmlNFSeToJson(xml)).toThrow(/Id.*chave de acesso/);
  });

  it('throws when infNFSe is an array (batch/multi-NFSe payload), instead of silently proceeding', () => {
    const xml = `
      <NFSe>
        <infNFSe Id="NFS35000000000000000000000000000000000000000001">
          <nNFSe>1</nNFSe>
        </infNFSe>
        <infNFSe Id="NFS35000000000000000000000000000000000000000002">
          <nNFSe>2</nNFSe>
        </infNFSe>
      </NFSe>
    `;

    expect(() => new XmlParser().convertXmlNFSeToJson(xml)).toThrow(/NFSe.*infNFSe/);
  });

  it('throws when NFSe/infNFSe cannot be located at all', () => {
    const xml = '<Outro><algo>1</algo></Outro>';

    expect(() => new XmlParser().convertXmlNFSeToJson(xml)).toThrow(/NFSe.*infNFSe/);
  });
});

describe('XmlParser.convertXmlToJson', () => {
  it('keeps interleaved repeated elements (cMsg/xMsg of protNFe) in their own arrays', () => {
    const xml = '<protNFe versao="4.00"><infProt><cStat>120</cStat><xMotivo>Autorizado o uso da NF-e, com alerta</xMotivo><cMsg>172</cMsg><xMsg>Alerta 1</xMsg><cMsg>173</cMsg><xMsg>Alerta 2</xMsg><cMsg>174</cMsg><xMsg>Alerta 3</xMsg></infProt></protNFe>';

    const json = new XmlParser().convertXmlToJson(xml, 'NFERetAutorizacao');

    expect(json.infProt.cStat).toBe('120');
    expect(json.infProt.cMsg).toEqual(['172', '173', '174']);
    expect(json.infProt.xMsg).toEqual(['Alerta 1', 'Alerta 2', 'Alerta 3']);
  });

  it('keeps consecutive repeated elements in a single array', () => {
    const xml = '<retEnviNFe><cStat>104</cStat><protNFe><infProt><chNFe>1</chNFe></infProt></protNFe><protNFe><infProt><chNFe>2</chNFe></infProt></protNFe></retEnviNFe>';

    const json = new XmlParser().convertXmlToJson(xml, 'NFEAutorizacao');

    expect(json.cStat).toBe('104');
    expect(json.protNFe.map((p: any) => p.infProt.chNFe)).toEqual(['1', '2']);
  });
});
