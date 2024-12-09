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
import Environment from '@Modules/environment/Environment.js';

export interface NamespacesProps {
    [key: string]: string;
}
export interface BodyContentProps {
    [key: string]: any;
}
export interface SoapEnvelopeObjProps {
    [key: string]: any;
}

class XmlBuilder {
    environment: Environment;
    constructor(environment: Environment) {
        this.environment = environment;
    }

    /**
     * Método para assinar o XML
     */
    assinarXML(xml: string, tagAssinar: string) {
        const transforms = [
            'http://www.w3.org/2000/09/xmldsig#enveloped-signature',
            'http://www.w3.org/TR/2001/REC-xml-c14n-20010315'
        ];

        const signedXmlObj = new SignedXml({
            publicCert: this.environment.getCert(),
            privateKey: this.environment.getCertKey(),
            canonicalizationAlgorithm: "http://www.w3.org/TR/2001/REC-xml-c14n-20010315",
            implicitTransforms: ['http://www.w3.org/TR/2001/REC-xml-c14n-20010315']
        });

        signedXmlObj.addReference({ xpath: `//*[local-name(.)='${tagAssinar}']`, digestAlgorithm: 'http://www.w3.org/2000/09/xmldsig#sha1', transforms });
        signedXmlObj.signatureAlgorithm = 'http://www.w3.org/2000/09/xmldsig#rsa-sha1';
        // Assinar o XML
        signedXmlObj.computeSignature(xml);

        // Obter o XML assinado
        return signedXmlObj.getSignedXml();
    }

    /**
     * Método que converte Objeto em XML
     */
    serializeXml<T>(obj: T, rootTag: string) {
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
    gerarXml<T>(xmlObject: T, rootTag: string) {
        return this.serializeXml(xmlObject, rootTag);
    }

    /**
     *  Método utilizado para cirar um envelop SOAP - Formato de mensagem para serviço SOAP (como o da SEFAZ)
     */
    buildSoapEnvelope(xml: string, soapMethod: string, soapVersion: string = "soap12", rootTagObj: any = null) {
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
                'nfeDadosMsg': {
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
                'nfeDadosMsg': {
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

export default XmlBuilder;