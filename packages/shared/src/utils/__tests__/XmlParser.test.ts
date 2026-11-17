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

  it('exposes the detEvento of event 412140 (Tributação do Simples Nacional, NT 2026.005) returned by NFEConsultaProtocolo', () => {
    const chave = '41261112345678000195550010000034031833418270';
    const xml = '<retConsSitNFe versao="4.00" xmlns="http://www.portalfiscal.inf.br/nfe"><tpAmb>2</tpAmb><verAplic>SVRS202611</verAplic><cStat>100</cStat>'
      + `<xMotivo>Autorizado o uso da NF-e</xMotivo><cUF>41</cUF><dhRecbto>2026-12-01T10:00:02-03:00</dhRecbto><chNFe>${chave}</chNFe>`
      + `<procEventoNFe versao="1.00"><evento versao="1.00"><infEvento Id="ID412140${chave}01"><cOrgao>91</cOrgao><tpAmb>2</tpAmb>`
      + `<CNPJ>12345678000195</CNPJ><chNFe>${chave}</chNFe><dhEvento>2026-12-01T10:00:00-03:00</dhEvento><tpEvento>412140</tpEvento>`
      + '<nSeqEvento>1</nSeqEvento><verEvento>1.00</verEvento><detEvento versao="1.00"><descEvento>Tributação do Simples Nacional</descEvento>'
      + '<cOrgaoAutor>41</cOrgaoAutor><tpAutor>5</tpAutor><verAplic>SVRS202611</verAplic><gTribItemSN nItem="1"><vRBSNitem>100.00</vRBSNitem>'
      + '<tpRBSN>1</tpRBSN><pIBSSN>2.0000</pIBSSN><vIBSSN>2.00</vIBSSN><pCBSSN>5.0000</pCBSSN><vCBSSN>5.00</vCBSSN></gTribItemSN>'
      + '<gTotalSN><vRBSNtot>100.00</vRBSNtot><vIBSSNtot>2.00</vIBSSNtot><vCBSSNtot>5.00</vCBSSNtot></gTotalSN></detEvento></infEvento></evento>'
      + '<retEvento versao="1.00"><infEvento><tpAmb>2</tpAmb><verAplic>SVRS202611</verAplic><cOrgao>91</cOrgao><cStat>135</cStat>'
      + `<xMotivo>Evento registrado e vinculado a NF-e</xMotivo><chNFe>${chave}</chNFe><tpEvento>412140</tpEvento>`
      + '<nSeqEvento>1</nSeqEvento><dhRegEvento>2026-12-01T10:00:01-03:00</dhRegEvento><nProt>141260000000001</nProt></infEvento></retEvento>'
      + '</procEventoNFe></retConsSitNFe>';

    const json = new XmlParser().convertXmlToJson(xml, 'NFEConsultaProtocolo');

    expect(json.procEventoNFe.evento.infEvento.tpEvento).toBe('412140');
    expect(json.procEventoNFe.evento.infEvento.detEvento).toEqual({
      descEvento: 'Tributação do Simples Nacional',
      cOrgaoAutor: '41',
      tpAutor: '5',
      verAplic: 'SVRS202611',
      gTribItemSN: { vRBSNitem: '100.00', tpRBSN: '1', pIBSSN: '2.0000', vIBSSN: '2.00', pCBSSN: '5.0000', vCBSSN: '5.00' },
      gTotalSN: { vRBSNtot: '100.00', vIBSSNtot: '2.00', vCBSSNtot: '5.00' },
    });
  });
});
