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
import xml2js from 'xml2js';
import { SignedXml } from 'xml-crypto';
import { Environment } from '../environment/Environment.js';
import { logger } from '../exceptions/logger.js';

export interface NamespacesProps {
    [key: string]: string;
}
export interface BodyContentProps {
    [key: string]: any;
}
export interface SoapEnvelopeObjProps {
    [key: string]: any;
}

/**
 * Perfis de algoritmo XMLDSig disponíveis para assinatura.
 * **EXPERIMENTAL/PROVISÓRIO** - investigação da issue #93 (E0714 - SEFIN Nacional / DPS).
 */
export type AssinaturaPerfil = 'legado' | 'sha256-exc-c14n' | 'sha256-c14n' | 'sha1-exc-c14n';

const C14N = 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315';
const EXC_C14N = 'http://www.w3.org/2001/10/xml-exc-c14n#';
const ENVELOPED = 'http://www.w3.org/2000/09/xmldsig#enveloped-signature';
const SHA1_DIGEST = 'http://www.w3.org/2000/09/xmldsig#sha1';
const SHA256_DIGEST = 'http://www.w3.org/2001/04/xmlenc#sha256';
const RSA_SHA1 = 'http://www.w3.org/2000/09/xmldsig#rsa-sha1';
const RSA_SHA256 = 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256';

const ASSINATURA_PERFIS: Record<AssinaturaPerfil, {
    canonicalizationAlgorithm: string;
    digestAlgorithm: string;
    signatureAlgorithm: string;
}> = {
    'legado': {
        canonicalizationAlgorithm: C14N,
        digestAlgorithm: SHA1_DIGEST,
        signatureAlgorithm: RSA_SHA1
    },
    'sha256-exc-c14n': {
        canonicalizationAlgorithm: EXC_C14N,
        digestAlgorithm: SHA256_DIGEST,
        signatureAlgorithm: RSA_SHA256
    },
    'sha256-c14n': {
        canonicalizationAlgorithm: C14N,
        digestAlgorithm: SHA256_DIGEST,
        signatureAlgorithm: RSA_SHA256
    },
    'sha1-exc-c14n': {
        canonicalizationAlgorithm: EXC_C14N,
        digestAlgorithm: SHA1_DIGEST,
        signatureAlgorithm: RSA_SHA1
    }
};

class XmlBuilder {
    environment: Environment;
    constructor(environment: Environment) {
        this.environment = environment;
    }

    /**
     * Método para assinar o XML
     * @param {AssinaturaPerfil} perfil - **EXPERIMENTAL/PROVISÓRIO** (issue #93). Quando omitido,
     * mantém o perfil legado (c14n-1.0 / SHA-1 / rsa-sha1) usado por NFe/NFCe/CTe.
     */
    assinarXML(xml: string, tagAssinar: string, perfil: AssinaturaPerfil = 'legado') {
        const { canonicalizationAlgorithm, digestAlgorithm, signatureAlgorithm } = ASSINATURA_PERFIS[perfil];

        const transforms = [
            ENVELOPED,
            canonicalizationAlgorithm
        ];

        logger.info('Assinando XML', {
            context: 'XmlBuilder',
            tagAssinar,
            perfil,
            canonicalizationAlgorithm,
            digestAlgorithm,
            signatureAlgorithm
        });

        const signedXmlObj = new SignedXml({
            publicCert: this.environment.getCert(),
            privateKey: this.environment.getCertKey(),
            canonicalizationAlgorithm,
            implicitTransforms: [canonicalizationAlgorithm]
        });

        signedXmlObj.addReference({ xpath: `//*[local-name(.)='${tagAssinar}']`, digestAlgorithm, transforms });
        signedXmlObj.signatureAlgorithm = signatureAlgorithm;
        // Assinar o XML
        signedXmlObj.computeSignature(xml);

        // Obter o XML assinado
        return signedXmlObj.getSignedXml();
    }

    /**
     * Método que converte Objeto em XML
     */
    serializeXml<T>(obj: T, rootTag: string, metodo?: string) {
        logger.info('Gerando XML', {
            context: 'XmlBuilder',
            metodo,
            rootTag,
        });
        let builder = new xml2js.Builder({
            rootName: rootTag,
            headless: true,
            renderOpts: {
                pretty: false
            },
            // cdata: true
        });
        return builder.buildObject(obj);
    }

    /**
     * Método genérico para geração do XML
     */
    gerarXml<T>(xmlObject: T, rootTag: string, metodo?: string) {
        return this.serializeXml(xmlObject, rootTag, metodo);
    }

    /**
     *  Método utilizado para cirar um envelop SOAP - Formato de mensagem para serviço SOAP (como o da SEFAZ)
     */
    buildSoapEnvelope(xml: string, soapMethod: string, soapVersion: string = "soap12", rootTagObj: any = null, dadosMsgTag: string = "nfeDadosMsg") {
        const soapNamespaces: NamespacesProps = {
            'soap12': 'http://www.w3.org/2003/05/soap-envelope', // SOAP 1.2
            'soap': 'http://schemas.xmlsoap.org/soap/envelope/' // SOAP 1.1
        };
        const soapNamespace = soapNamespaces[soapVersion] || soapNamespaces['soap12'];

        // Estrutura básica do envelope SOAP
        let soapEnvelopeObj: SoapEnvelopeObjProps = {
            '$': {
                [`xmlns:${soapVersion}`]: soapNamespace,
                'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema'
            },
            [`${soapVersion}:Body`]: {}
        };

        // Condicionando a inclusão de 'rootTagObj'
        if (rootTagObj && rootTagObj.tag) {
            let bodyContent: BodyContentProps = {
                [dadosMsgTag]: {
                    '$': {
                        'xmlns': soapMethod
                    },
                    _: '[XML]'
                }
            };

            if (rootTagObj.namespace) {
                bodyContent['$'] = { 'xmlns': rootTagObj.namespace };
            }

            soapEnvelopeObj[`${soapVersion}:Body`][rootTagObj.tag] = bodyContent;
        } else {
            soapEnvelopeObj[`${soapVersion}:Body`] = {
                [dadosMsgTag]: {
                    '$': {
                        'xmlns': soapMethod
                    },
                    _: '[XML]'
                }
            };
        }

        // Serializar o objeto do envelope SOAP para XML
        let soapEnvXml = this.serializeXml(soapEnvelopeObj, `${soapVersion}:Envelope`);
        return soapEnvXml.replace('[XML]', xml);
    }

}

export { XmlBuilder };