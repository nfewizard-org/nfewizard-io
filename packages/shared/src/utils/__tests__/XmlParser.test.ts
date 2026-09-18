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
