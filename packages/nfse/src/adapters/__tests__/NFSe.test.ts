/*
 * This file is part of Treeunfe DFe.
 * 
 * Treeunfe DFe is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * Treeunfe DFe is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with Treeunfe DFe. If not, see <https://www.gnu.org/licenses/>.
 */

const mockLoggerError = jest.fn();
const mockLoadEnvironment = jest.fn().mockResolvedValue({ axios: {} });
const mockServiceExec = jest.fn();

jest.mock('@nfewizard/shared', () => {
  class Environment {
    config: any;

    constructor(config: any) {
      this.config = config;
    }

    loadEnvironment() {
      return mockLoadEnvironment();
    }
  }

  class Utility {
    constructor() {}
  }

  class SaveFiles {
    constructor() {}
  }

  class XmlBuilder {
    constructor() {}
  }

  class GerarConsulta {
    constructor() {}
  }

  return {
    Environment,
    Utility,
    SaveFiles,
    XmlBuilder,
    GerarConsulta,
    logger: {
      error: mockLoggerError,
      info: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      http: jest.fn(),
    },
    NFE_SchemaValidate: jest.fn(),
  };
});

jest.mock('../../operations/index.js', () => ({
  NFSeAutorizacao: jest.fn().mockImplementation((service) => ({
    Exec: jest.fn((data) => service.Exec(data)),
  })),
  NFSeConsulta: jest.fn(),
  NFSeDistribuicao: jest.fn(),
  NFSeEventos: jest.fn(),
  NFSeParametrosMunicipais: jest.fn(),
}), { virtual: true });

jest.mock('../../services/index.js', () => ({
  NFSeAutorizacaoService: jest.fn().mockImplementation(() => ({
    Exec: mockServiceExec,
  })),
  NFSeConsultaService: jest.fn(),
  NFSeDistribuicaoService: jest.fn(),
  NFSeEventosService: jest.fn(),
  NFSeParametrosMunicipaisService: jest.fn(),
}), { virtual: true });

const NFSe = require('../NFSe').default;

describe('NFSe adapter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('preserves nfseErrorDetail when Autorizacao rethrows the service error', async () => {
    const originalError = new Error('E1235: Falha no esquema XML do DF-e.');
    (originalError as any).nfseErrorDetail = {
      codigo: 'E1235',
      descricao: 'Falha no esquema XML do DF-e.',
      complemento: 'List of possible elements expected: cNBS, IBSCBS',
      statusHttp: 400,
      raw: { erros: [] },
    };
    mockServiceExec.mockRejectedValue(originalError);

    const nfse = new NFSe({
      dfe: {
        pathCertificado: 'certificado.pfx',
        senhaCertificado: '123456',
        CPFCNPJ: '00000000000000',
        UF: 'SP',
      },
      nfse: {
        ambiente: 2,
      },
      lib: {
        log: {
          exibirLogNoConsole: false,
          armazenarLogs: false,
        },
      },
    } as any);

    await expect(nfse.Autorizacao({ DPS: { infDps: {} } } as any)).rejects.toMatchObject({
      message: 'NFSE_Autorizacao: E1235: Falha no esquema XML do DF-e.',
      nfseErrorDetail: {
        codigo: 'E1235',
        complemento: 'List of possible elements expected: cNBS, IBSCBS',
        statusHttp: 400,
      },
    });

    expect(mockLoggerError).toHaveBeenCalledWith(
      '',
      originalError,
      expect.objectContaining({ context: 'NFSE_Autorizacao' }),
    );
  });

  it('maps nfse.ambiente to nfe.ambiente when building the shared Environment', () => {
    const nfse: any = new NFSe({
      dfe: {
        pathCertificado: 'certificado.pfx',
        senhaCertificado: '123456',
        CPFCNPJ: '00000000000000',
        UF: 'SP',
      },
      nfse: {
        ambiente: 2,
        versao: '1.0.0',
      },
    } as any);

    expect(nfse.environment.config.nfe).toMatchObject({
      ambiente: 2,
      versaoDF: '1.0.0',
    });
  });

  it('does not leak axios config/request/response (e.g. TLS agent/cert) into the wrapped error', async () => {
    const originalError: any = new Error('Request failed with status code 500');
    originalError.isAxiosError = true;
    originalError.config = { httpsAgent: { cert: 'FAKE_CERT', key: 'FAKE_PRIVATE_KEY' } };
    originalError.request = { agent: { cert: 'FAKE_CERT', key: 'FAKE_PRIVATE_KEY' } };
    originalError.response = { status: 500, data: {}, request: originalError.request };
    mockServiceExec.mockRejectedValue(originalError);

    const nfse = new NFSe({
      dfe: {
        pathCertificado: 'certificado.pfx',
        senhaCertificado: '123456',
        CPFCNPJ: '00000000000000',
        UF: 'SP',
      },
      nfse: {
        ambiente: 2,
      },
    } as any);

    let caught: any;
    try {
      await nfse.Autorizacao({ DPS: { infDps: {} } } as any);
    } catch (error) {
      caught = error;
    }

    expect(caught).toBeDefined();
    expect(caught.config).toBeUndefined();
    expect(caught.request).toBeUndefined();
    expect(caught.response).toBeUndefined();
    // Não deve lançar por referência circular ao ser serializado.
    expect(() => JSON.stringify(caught, Object.getOwnPropertyNames(caught))).not.toThrow();
  });
});
