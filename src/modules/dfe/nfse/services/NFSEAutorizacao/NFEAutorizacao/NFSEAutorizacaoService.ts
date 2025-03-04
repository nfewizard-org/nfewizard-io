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
// import XmlParser from './XmlParser';
import xml2js from 'xml2js';
import libxmljs from 'libxmljs';
import xsdAssembler from 'xsd-assembler';
import fs from 'fs';
import xsdValidator from 'xsd-schema-validator';

class NFSEAutorizacaoService {

    constructor() {
    }
    formatErrorMessage(message: string) {
        // Esta função extrai e formata a mensagem de erro
        const regex = /\[error\]\s(.+?)\:\s(.+?)\s\((\d+):(\d+)\)/;
        const match = message.match(regex);
        if (match) {
            const [_, errorCode, errorDescription, line, column] = match;
            return `Erro na Validação do XML: ${errorCode} na linha ${line}, coluna ${column}. Descrição: ${errorDescription}`;
        } else {
            return `Erro Não Identificado na Validação do XML: ${message}`; // Retorna a mensagem original se ela não corresponder ao formato esperado
        }
    }

    validateSchemaJsBased(xml: any) {
        return new Promise(async (resolve, reject) => {
            try {
                // const { basePath, schemaPath } = getSchema(metodo);
                const basePath = './src/resources/schemas/nfse/ABRASF';
                const schemaPath = './src/resources/schemas/nfse/ABRASF/nfse.xsd';

                console.log(fs.existsSync(basePath))
                console.log(fs.existsSync(schemaPath))

                const completeXSD = await xsdAssembler.assemble(schemaPath);

                fs.writeFileSync(`${basePath}/teste.xsd`, completeXSD)

                const xmlDoc = libxmljs.parseXml(xml);
                const xsdDoc = libxmljs.parseXml(completeXSD, { baseUrl: `${basePath}/` });

                const isValid = xmlDoc.validate(xsdDoc);

                if (isValid) {
                    resolve({
                        success: true,
                        message: 'XML válido.',
                    });
                } else {
                    reject({
                        success: false,
                        message: this.formatErrorMessage(xmlDoc.validationErrors[0].message),
                    });
                }
            } catch (error: any) {
                reject({
                    success: false,
                    message: this.formatErrorMessage(error.message),
                });
            }
        });
    }

    validateSchemaJavaBased(xml: any) {
        return new Promise(async (resolve, reject) => {
            try {
                const schemaPath = './src/resources/schemas/nfse/ABRASF/nfse.xsd';

                xsdValidator.validateXML(xml, schemaPath, (err, validationResult) => {
                    if (err) {
                        reject({
                            success: false,
                            message: this.formatErrorMessage(err.message),
                        });
                    } else if (!validationResult.valid) {
                        reject({
                            success: false,
                            message: this.formatErrorMessage(validationResult.messages[0]),
                        });
                    } else {
                        resolve({
                            success: true,
                            message: 'XML válido.',
                        });
                    }
                });
            } catch (error: any) {
                reject({
                    success: false,
                    message: this.formatErrorMessage(error.message),
                });
            }
        });
    }

    public async Exec(): Promise<void> {

        // const xml = `<?xml version="1.0" encoding="UTF-8"?> <GerarNfseEnvio xmlns="http://www.abrasf.org.br/nfse.xsd"> <Rps> <InfDeclaracaoPrestacaoServico> <Rps> <IdentificacaoRps> <Numero>1</Numero> <Serie>1</Serie> <Tipo>1</Tipo> </IdentificacaoRps> <DataEmissao>2022-09-06</DataEmissao> <Status>1</Status> </Rps> <Competencia>2022-09-06</Competencia> <Servico> <Valores> <ValorServicos>4.20</ValorServicos> <ValorDeducoes>0</ValorDeducoes> <ValorPis>0</ValorPis> <ValorCofins>0</ValorCofins> <ValorInss>0</ValorInss> <ValorIr>0</ValorIr> <ValorCsll>0</ValorCsll> <OutrasRetencoes>0</OutrasRetencoes> <ValTotTributos>0</ValTotTributos> <ValorIss>0</ValorIss> <Aliquota>2.7</Aliquota> <DescontoIncondicionado>0</DescontoIncondicionado> <DescontoCondicionado>0</DescontoCondicionado> </Valores> <IssRetido>1</IssRetido> <ResponsavelRetencao>1</ResponsavelRetencao> <ItemListaServico>01.01</ItemListaServico> <CodigoCnae>1234567</CodigoCnae> <Discriminacao>sdasdadasda ajksdb asjkdbab skdba ksdb </Discriminacao> <CodigoMunicipio>2925808</CodigoMunicipio> <CodigoPais>2373</CodigoPais> <ExigibilidadeISS>1</ExigibilidadeISS> <MunicipioIncidencia>2925808</MunicipioIncidencia> </Servico> <Prestador> <CpfCnpj> <Cnpj>11006293000130</Cnpj> </CpfCnpj> <InscricaoMunicipal>99999</InscricaoMunicipal> </Prestador> <TomadorServico> <IdentificacaoTomador> <CpfCnpj> <Cnpj>22641884000104</Cnpj> </CpfCnpj> </IdentificacaoTomador> <RazaoSocial>TESTE 0004</RazaoSocial> <Endereco> <Endereco>SÃO GONÇALO DO RIO BAIXO</Endereco> <Numero>50</Numero> <Complemento>Casa</Complemento> <Bairro>PARQUE TIETÊ</Bairro> <CodigoMunicipio>3554508</CodigoMunicipio> <Uf>SP</Uf> <Cep>02870080</Cep> </Endereco> <Contato> <Telefone>75 9 9999-9999</Telefone> <Email>tomador@teste.com</Email> </Contato> </TomadorServico> <RegimeEspecialTributacao>1</RegimeEspecialTributacao> <OptanteSimplesNacional>1</OptanteSimplesNacional> <IncentivoFiscal>1</IncentivoFiscal> <InformacoesComplementares>Informação Complementar Solicitada</InformacoesComplementares> </InfDeclaracaoPrestacaoServico> <Signature xmlns="http://www.w3.org/2000/09/xmldsig#"><SignedInfo><CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/><SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"/><Reference URI=""><Transforms><Transform Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/><Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/></Transforms><DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/><DigestValue>QhNWMDfVKpNhApNEJt+uOrL/0vE=</DigestValue></Reference></SignedInfo><SignatureValue>YhDWAWYrr886arLA0fgyJn/IH5hgd1Ne/av35YdcLemoPUOO07bfxhB4l+DvGO7fha9Hq2vORvC935Gw0s9Xw4bkwE7S6+zO3CHGfiHFeqsnrXTpunXxYiz8TKyI6Edb/OW+2b9tMWh7u9cw7dBDho9qC8k3pujw3rRc/HXtFBK9S6/OZi0xfFNCA1GenVyGhtNZgS5JC0SnJ0bSWFZ/f9IuQcKOL1VVY6pAMLAnvIUdrChazC2vfvEG5Zril5bi6b701fk+3GZAPBp46+lrtV4YOLzcHxADyNPX9KFPTlrXAZ7OWYj6F31PokPdsBxc4qbI1s/35ywAQjJgHgDHhw==</SignatureValue><KeyInfo><X509Data><X509Certificate>MIIHVTCCBT2gAwIBAgIINRQhERJGLoYwDQYJKoZIhvcNAQELBQAwWTELMAkGA1UEBhMCQlIxEzARBgNVBAoTCklDUC1CcmFzaWwxFTATBgNVBAsTDEFDIFNPTFVUSSB2NTEeMBwGA1UEAxMVQUMgU09MVVRJIE11bHRpcGxhIHY1MB4XDTIxMTExMjE1MTUwMFoXDTIyMTExMjE1MTUwMFowge0xCzAJBgNVBAYTAkJSMRMwEQYDVQQKEwpJQ1AtQnJhc2lsMQswCQYDVQQIEwJCQTEVMBMGA1UEBxMMU2FvIERvbWluZ29zMR4wHAYDVQQLExVBQyBTT0xVVEkgTXVsdGlwbGEgdjUxFzAVBgNVBAsTDjI5MzEwNjI2MDAwMTg2MRMwEQYDVQQLEwpQcmVzZW5jaWFsMRowGAYDVQQLExFDZXJ0aWZpY2FkbyBQSiBBMTE7MDkGA1UEAxMyVkFHTkVSIERPUyBTQU5UT1MgSkVTVVMgODU4NjYxODc1NjY6NDQxNDU3NTcwMDAxNDkwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCGNoEBzV70zmsH7TtDpt+xREe9V4N7K8CaqwwTPTXBoJL04UOMbR/ZXw7726+Rip7bl5KZKVnvmJVxOw49hzZ8AkwX724ou3Q/F3dYNdd2/yLX3NUCYgTlXJWUfOidNxskTGXSV6F9rMMJ4JA4dG+7fETDyVg/c51/BkC9mv7tWhJaUD31OGtkorNgO2bH02X/mMc+/F9TZAoaRkqWCNaEZrOCztMTev0/X/h83NadlMu41eIKB0KS4RGOIaRyv1JU83zv8mfEd/K6L4NQX9oBjp8mRehLaUpjVHZ0zLZKT63iyM0Qkd5cLYfvRp+a/YuhRp/Nq8m0Anw6k/mUfHGLAgMBAAGjggKKMIIChjAJBgNVHRMEAjAAMB8GA1UdIwQYMBaAFMVS7SWACd+cgsifR8bdtF8x3bmxMFQGCCsGAQUFBwEBBEgwRjBEBggrBgEFBQcwAoY4aHR0cDovL2NjZC5hY3NvbHV0aS5jb20uYnIvbGNyL2FjLXNvbHV0aS1tdWx0aXBsYS12NS5wN2IwgcUGA1UdEQSBvTCBuoEhYXV4aWxpYXIuY2FtaWxvY29udGFkb3JAZ21haWwuY29toCIGBWBMAQMCoBkTF1ZBR05FUiBET1MgU0FOVE9TIEpFU1VToBkGBWBMAQMDoBATDjQ0MTQ1NzU3MDAwMTQ5oD0GBWBMAQMEoDQTMjI1MDYxOTk2ODU4NjYxODc1NjYwMDAwMDAwMDAwMDAwMDAwMjA0MDg2NzI4N1NTUEJBoBcGBWBMAQMHoA4TDDAwMDAwMDAwMDAwMDBdBgNVHSAEVjBUMFIGBmBMAQIBJjBIMEYGCCsGAQUFBwIBFjpodHRwOi8vY2NkLmFjc29sdXRpLmNvbS5ici9kb2NzL2RwYy1hYy1zb2x1dGktbXVsdGlwbGEucGRmMB0GA1UdJQQWMBQGCCsGAQUFBwMCBggrBgEFBQcDBDCBjAYDVR0fBIGEMIGBMD6gPKA6hjhodHRwOi8vY2NkLmFjc29sdXRpLmNvbS5ici9sY3IvYWMtc29sdXRpLW11bHRpcGxhLXY1LmNybDA/oD2gO4Y5aHR0cDovL2NjZDIuYWNzb2x1dGkuY29tLmJyL2xjci9hYy1zb2x1dGktbXVsdGlwbGEtdjUuY3JsMB0GA1UdDgQWBBTKmSua8PhDXjEdjznwTAnYpE0AijAOBgNVHQ8BAf8EBAMCBeAwDQYJKoZIhvcNAQELBQADggIBAK2Y2obSr7jtBR/dWmr0JgQJVnq8y6A7yZPc8yKrE5FBz7pU23t5AabGNMPWG29Bf5oDnuKEd42ua+6z2JU+OEKwtRHHG/ixFGnMyXkwA/WL5x6EeFhMDna3XurQaGNvOlkW7TAnw73iI53ARfWRMLfaAP8rJDq97DB48XkVxv4QIZeMh6Jg/vS5/1V9re1gnsVJgpz86lWmYVL5IanALq6T1mAxoEX8Qmd5ImnlK69Y7dhW3GlIyhcxxkIEwCZoJxi8ektLJL9AMhr9WH/5lYd1qoBYRuTYFqhTzQy4e5hvs+hXj5VYN1K3ym5w9EWrvjlv01bLTLbPnYI0NqRBXpmUJRpEDg0VW5HnkhQ81c7eppuqgGVbKws2GlP1IjxyMxlcb3S4Vij5+CLHWA5JaXZNz+6N5AYq9NBok281ZVsQiGGp1SbN9cvDJ4QdRZ+idWcGyGkvUEzsXfZ1Y+v9Et/yArobMijVxA1BrDq1TBJipQpiJYWCqJZuVZRgL5ikQxDWrJF18TpbkEYtE0cy7z5+2BBvqoC5reqdRXBo/Zkux7yDnaPnTGehmpfMx8g6ZG1VDiZHCbCDeIT+XIeGIT68NJVrvZPS6iBijskvaYtqIQtJ+rKKGcOq8tR9JOp7inA+X3tCRIw/WUtQO5uDaUs2MK4q8BypJwA77l1A1wd/</X509Certificate></X509Data></KeyInfo></Signature></Rps> </GerarNfseEnvio>`

        const nfseXML = fs.readFileSync('./src/resources/schemas/nfse/ABRASF/xmls-exemplo/GerarNfse.xml');

        // await this.validateSchemaJsBased(xml);
        await this.validateSchemaJavaBased(nfseXML);

        console.log('NFS-s validada com sucesso')

        // carregar schema
    } catch(error: any) {
        throw new Error(error.message)

    }
}

export default NFSEAutorizacaoService;