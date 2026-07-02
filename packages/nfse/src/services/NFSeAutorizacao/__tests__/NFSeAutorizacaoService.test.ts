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
const NFSeAutorizacaoService = require('../NFSeAutorizacaoService').default;
import { NFSe } from '@nfewizard/types/nfse';

const buildRequest = (): NFSe => ({
  DPS: {
    infDps: {
      tpAmb: 2,
      dhEmi: '2026-02-25T08:12:28-03:00',
      verAplic: '1.0.0',
      serie: '1',
      nDPS: '3407',
      dCompet: '2026-02-25',
      tpEmit: 1,
      cLocEmi: '3554102',
      prest: {
        CNPJ: '23903417000160',
        regTrib: {
          opSimpNac: 1,
          regEspTrib: 0,
        },
      },
      toma: {
        CPF: '46544154830',
        xNome: 'NOTA FISCAL EMITIDA EM AMBIENTE DE HOMOLOGACAO - SEM VALOR FISCAL',
        end: {
          endNac: {
            cMun: '3554102',
            CEP: '12040859',
          },
          xLgr: 'Rua Capitão Bernardo Sanches Pimenta',
          nro: '162',
          xBairro: 'Esplada Independência',
        },
      },
      serv: {
        locPrest: {
          cLocPrestacao: '3554102',
        },
        cServ: {
          cTribNac: '110101',
          xDescServ: 'SERVICOS DE DESENVOLVIMENTO DE PROGRAMAS DE COMPUTADOR SOB ENCOMENDA',
          cNBS: '106043000',
        },
      },
      valores: {
        vServPrest: {
          vServ: 100,
        },
        trib: {
          tribMun: {
            tribISSQN: 1,
            tpRetISSQN: 1,
          },
          totTrib: {
            vTotTrib: {
              vTotTribFed: 10,
              vTotTribEst: 5,
              vTotTribMun: 4,
            },
          },
        },
      },
    },
  },
});

const buildEnvironment = () => ({
  getConfig: () => ({
    dfe: {
      armazenarXMLConsulta: true,
      pathXMLConsulta: 'tmp/NFSe/RequestLogs',
      armazenarXMLRetorno: true,
      pathXMLRetorno: 'tmp/NFSe/Retorno',
      armazenarRetornoEmJSON: true,
      pathRetornoEmJSON: 'tmp/NFSe/RetornoJSON',
      armazenarXMLAutorizacao: false,
      pathXMLAutorizacao: 'tmp/NFSe/Autorizacao',
      incluirTimestampNoNomeDosArquivos: false,
    },
    nfe: {
      ambiente: 2,
    },
  }),
  getHttpAgent: () => ({})
});

const buildService = (axiosPost: jest.Mock) => {
  const environment = buildEnvironment() as any;
  const utility = {
    getWebServiceUrlNFSe: jest.fn().mockReturnValue('https://nfse.test/webservice'),
    salvaJSON: jest.fn(),
    salvaXML: jest.fn(),
  } as any;
  const xmlBuilder = {
    gerarXml: jest.fn().mockImplementation((xmlObject: any) => `<?xml version="1.0" encoding="UTF-8"?><DPS><infDPS Id="${xmlObject.infDPS.$.Id}"></infDPS></DPS>`),
    assinarXML: jest.fn().mockImplementation((xml: string) => xml),
  } as any;
  const saveFiles = {
    salvaArquivos: jest.fn(),
  } as any;
  const gerarConsulta = {
    gerarConsulta: jest.fn(),
  } as any;
  const axios = {
    post: axiosPost,
  } as any;
  let xmlObject: any;

  const service = new NFSeAutorizacaoService(environment, utility, xmlBuilder, axios, saveFiles, gerarConsulta);

  xmlBuilder.gerarXml.mockImplementation((currentXmlObject: any) => {
    xmlObject = currentXmlObject;
    return `<?xml version="1.0" encoding="UTF-8"?><DPS><infDPS Id="${currentXmlObject.infDPS.$.Id}"></infDPS></DPS>`;
  });

  return {
    service,
    utility,
    saveFiles,
    xmlBuilder,
    getXmlObject: () => xmlObject,
  };
};

describe('NFSeAutorizacaoService', () => {
  it('saves the signed DPS XML and the sent JSON payload', async () => {
    const axiosPost = jest.fn().mockResolvedValue({
      data: {
        chaveAcesso: 'CHAVE-TESTE',
      },
    });

    const { service, utility, saveFiles } = buildService(axiosPost);

    const response = await service.Exec(buildRequest());

    expect(response.success).toBe(true);
    expect(saveFiles.salvaArquivos).toHaveBeenCalledTimes(1);
    expect(utility.salvaXML).toHaveBeenCalledWith(expect.objectContaining({
      fileName: 'NFSe_Autorizacao-consulta',
      data: expect.stringContaining('<DPS'),
    }));
    expect(utility.salvaJSON).toHaveBeenCalledWith(expect.objectContaining({
      fileName: 'NFSe_Autorizacao-consulta-json',
      data: expect.objectContaining({
        dpsXmlGZipB64: expect.any(String),
      }),
    }));
  });

  it('stores an error marker when the transport fails without a response body', async () => {
    const axiosPost = jest.fn().mockRejectedValue(new Error('unable to get local issuer certificate'));

    const { service, utility } = buildService(axiosPost);

    await expect(service.Exec(buildRequest())).rejects.toThrow('unable to get local issuer certificate');

    const returnCall = utility.salvaJSON.mock.calls.find(([arg]: any[]) => arg.fileName === 'NFSe_Autorizacao-retorno');
    expect(returnCall?.[0].data).toEqual(expect.objectContaining({
      sucesso: false,
      metodo: 'NFSe_Autorizacao',
      mensagem: 'unable to get local issuer certificate',
    }));

    const consultaJsonCall = utility.salvaJSON.mock.calls.find(([arg]: any[]) => arg.fileName === 'NFSe_Autorizacao-consulta-json');
    expect(consultaJsonCall?.[0].data).toEqual(expect.objectContaining({
      dpsXmlGZipB64: expect.any(String),
    }));
  });

  it('normalizes DPS dates and preserves schema order for nested groups', async () => {
    const axiosPost = jest.fn().mockResolvedValue({
      data: {
        chaveAcesso: 'CHAVE-TESTE',
      },
    });

    const { service, getXmlObject } = buildService(axiosPost);
    const baseRequest = buildRequest();
    const baseInfDps = baseRequest.DPS as any;

    await service.Exec({
      DPS: {
        infDps: {
          ...baseInfDps.infDps,
          dhEmi: '2026-02-25T11:12:28.000Z',
          dCompet: '20260225',
          prest: {
            ...baseInfDps.infDps.prest,
            end: {
              endNac: {
                CEP: '12040859',
                cMun: '3554102',
              },
              xLgr: 'Rua Capitão Bernardo Sanches Pimenta',
              nro: '162',
              xBairro: 'Esplada Independência',
            },
          },
          serv: {
            locPrest: {
              cLocPrestacao: '3554102',
            },
            cServ: {
              cNBS: '106043000',
              cIntContrib: 'INT-01',
              xDescServ: 'SERVICOS DE DESENVOLVIMENTO DE PROGRAMAS DE COMPUTADOR SOB ENCOMENDA',
              cTribMun: '1234',
              cTribNac: '110101',
            },
          },
        },
      },
    });

    const xmlObject = getXmlObject();

    expect(xmlObject.infDPS.dhEmi).toBe('2026-02-25T08:12:28-03:00');
    expect(xmlObject.infDPS.dCompet).toBe('2026-02-25');
    expect(Object.keys(xmlObject.infDPS)).toEqual([
      'tpAmb',
      'dhEmi',
      'verAplic',
      'serie',
      'nDPS',
      'dCompet',
      'tpEmit',
      'cLocEmi',
      'prest',
      'toma',
      'serv',
      'valores',
      '$',
    ]);
    expect(Object.keys(xmlObject.infDPS.prest.end.endNac)).toEqual(['cMun', 'CEP']);
    expect(Object.keys(xmlObject.infDPS.serv.cServ)).toEqual([
      'cTribNac',
      'cTribMun',
      'xDescServ',
      'cNBS',
      'cIntContrib',
    ]);
  });
});