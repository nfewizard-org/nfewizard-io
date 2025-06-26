import { CertificateLoadResult, CertificateLoadReturn, NFeWizardProps } from '@Types';
import fs from 'fs';
import pem from 'pem';
import https from 'https';
import forge from 'node-forge';

import { fileURLToPath } from 'url';
import path from 'path';
import { logger } from '@Core/exceptions/logger';

const baseDir = path.dirname(fileURLToPath(import.meta.url));
const dir = process.env.NODE_ENV === 'production' ? '../resources/certs' : '../../resources/certs';

class LoadCertificate {
    private config: NFeWizardProps;
    private certificate: string;
    private cert_key: string;
    constructor(config: NFeWizardProps) {
        this.config = config;
        this.certificate = '';
        this.cert_key = '';
    }

    private loadCertificateWithPEM(): Promise<CertificateLoadResult> {
        return new Promise((resolve, reject) => {
            try {

                const pfxPath = this.config.dfe.pathCertificado;
                const pfxPassword = this.config.dfe.senhaCertificado;

                const pfxFile = fs.readFileSync(pfxPath);
                const certsDir = path.resolve(baseDir, dir);
                const caCerts = fs.readdirSync(certsDir).map(filename => {
                    const tmp = `${certsDir}/${filename}`;
                    return fs.readFileSync(tmp);
                });

                pem.readPkcs12(pfxFile, { p12Password: pfxPassword }, async (error, result) => {
                    if (error) {
                        if (error.message.toLowerCase().includes('mac verify error')) {
                            return reject(new Error("Erro ao ler o certificado: Senha incorreta."));
                        } else {
                            return reject(new Error(`Erro ao ler o certificado: ${error.message}`));
                        }
                    }

                    const key = result.key;
                    this.cert_key = key;

                    const cert = result.cert;
                    this.certificate = cert;

                    const certForge = forge.pki.certificateFromPem(cert);
                    const now = new Date();
                    if (now < certForge.validity.notBefore || now > certForge.validity.notAfter) {
                        return reject(new Error("Erro ao carregar o certificado: O certificado fornecido expirou ou ainda não é válido."));
                    }

                    const agent = new https.Agent({
                        key: key,
                        cert: cert,
                        ca: caCerts,
                    });

                    resolve({
                        success: true,
                        agent,
                        message: 'Certificado Carregado com Sucesso.'
                    });
                });
            } catch (error: any) {
                logger.error('Erro ao validar certificado', error, {
                    context: 'LoadCertificate',
                    method: 'loadCertificateWithPEM',
                });
                reject(new Error(error.message));
            }
        });
    }

    private loadCertificateWithNodeForge(): Promise<CertificateLoadResult> {
        return new Promise((resolve, reject) => {
            try {
                const pfxPath = this.config.dfe.pathCertificado;
                const pfxPassword = this.config.dfe.senhaCertificado;

                // Lê o arquivo PFX
                const pfxFile = fs.readFileSync(pfxPath);

                // Decodifica o arquivo PFX (PKCS#12)
                const p12Asn1 = forge.asn1.fromDer(pfxFile.toString('binary'));
                const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, pfxPassword);

                // Extrai a chave privada e o certificado
                const keyBags = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag });

                const certBags = p12.getBags({ bagType: forge.pki.oids.certBag });

                // Verificar se o 'keyBags' contém a chave esperada
                const key = keyBags[forge.pki.oids.pkcs8ShroudedKeyBag]?.[0]?.key;
                if (!key) {
                    return reject(new Error("Erro ao carregar chave privada do certificado."));
                }
                const keyPem = forge.pki.privateKeyToPem(key);
                this.cert_key = keyPem;

                // Verificar se o 'certBags' contém o certificado esperado
                const cert = certBags[forge.pki.oids.certBag]?.[0]?.cert;
                if (!cert) {
                    return reject(new Error("Erro ao validar certificado."));
                }
                const certPem = forge.pki.certificateToPem(cert);
                this.certificate = certPem;

                // Converte o certificado para o formato Forge
                const certForge = forge.pki.certificateFromPem(forge.pki.certificateToPem(cert));

                // Valida a data de validade
                const now = new Date();
                if (now < certForge.validity.notBefore || now > certForge.validity.notAfter) {
                    return reject(new Error("Erro ao carregar o certificado: O certificado fornecido expirou ou ainda não é válido."));
                }

                // Carrega os certificados da CA
                const certsDir = path.resolve(baseDir, dir);
                const caCerts = fs.readdirSync(certsDir).map(filename => {
                    const tmp = `${certsDir}/${filename}`;
                    return fs.readFileSync(tmp);
                });

                // Configura o agente HTTPS
                const agent = new https.Agent({
                    key: keyPem,
                    cert: certPem,
                    ca: caCerts,
                });

                resolve({
                    success: true,
                    agent,
                    message: 'Certificado Carregado com Sucesso.'
                });
            } catch (error: any) {
                logger.error('Erro ao validar certificado', error, {
                    context: 'LoadCertificate',
                    method: 'loadCertificateWithNodeForge',
                });

                reject(new Error(error.message));
            }
        });
    }

    async loadCertificate(): Promise<CertificateLoadReturn> {
        logger.info('Validando certificado', {
            context: 'LoadCertificate',
        });
        if (this.config.lib?.useOpenSSL || this.config.lib?.useOpenSSL === undefined) {
            const { agent } = await this.loadCertificateWithPEM();

            return {
                certificate: this.certificate,
                cert_key: this.cert_key,
                agent
            };
        }
        const { agent } = await this.loadCertificateWithNodeForge();

        return {
            certificate: this.certificate,
            cert_key: this.cert_key,
            agent
        };
    }
}

export default LoadCertificate;