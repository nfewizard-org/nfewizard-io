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
import fs from 'fs';
import pem from 'pem';
import https from 'https';
import forge from 'node-forge';

import { NFeWizardProps } from '@Protocols'
import axios from 'axios';

import { fileURLToPath } from 'url';
import path from 'path';

// Obtém o diretório atual do arquivo

const baseDir = path.dirname(fileURLToPath(import.meta.url));
const dir = process.env.NODE_ENV === 'production' ? 'certs' : '../certs';
class Environment {
    config: NFeWizardProps;
    certificate: string;
    cert_key: string;
    agent: https.Agent;
    public isLoaded: boolean;
    constructor(config: NFeWizardProps) {
        this.config = config;
        this.certificate = '';
        this.cert_key = '';
        this.agent = {} as https.Agent;
        this.isLoaded = false;
    }

    getIsLoaded() {
        return this.isLoaded;
    }

    getConfig() {
        return this.config;
    }

    getCertKey() {
        return this.cert_key;
    }

    getCert() {
        return this.certificate;
    }

    getHttpAgent() {
        return this.agent;
    }

    private checkRequiredSettings() {
        try {
            const requiredConfigFields: { [K in keyof NFeWizardProps]: string[] } = {
                dfe: ['pathCertificado', 'senhaCertificado'],
                nfe: ['ambiente']
            };
    
            let missingConfigurations: any = {
                dfe: [],
                nfe: []
            };
    
            let errors: string[] = [];
            let tableData: any[] = [];
    
            (Object.keys(requiredConfigFields) as (keyof NFeWizardProps)[]).forEach((categoryKey) => {
                const category = this.config[categoryKey as keyof typeof this.config];
    
                // Verifica se a chave principal existe
                if (!category) {
                    errors.push(`Chave principal faltando: '${categoryKey}'.`);
                    tableData.push({ Categoria: categoryKey, Faltando: `Chave principal faltando` });
                } else {
                    const fields = requiredConfigFields[categoryKey];
                    if (fields) {
                        fields.forEach((fieldKey) => {
                            // Garante que missingConfigurations[categoryKey] é um array
                            if (!missingConfigurations[categoryKey]) {
                                missingConfigurations[categoryKey] = [];
                            }
    
                            // Verifica se o campo está presente
                            if (category[fieldKey as keyof typeof category] === undefined) {
                                // Garante que a propriedade está definida
                                if (!missingConfigurations[categoryKey]) {
                                    missingConfigurations[categoryKey] = [];
                                }
                                missingConfigurations[categoryKey].push(fieldKey);
                            }
                        });
    
                        // Garante que missingConfigurations[categoryKey] é um array
                        const missingConfig = missingConfigurations[categoryKey];
                        if (missingConfig && missingConfig.length > 0) {
                            errors.push(`Configurações faltando em '${categoryKey}': [${missingConfig.join(', ')}].`);
                            tableData.push({ Categoria: categoryKey, Faltando: missingConfig.join(', ') });
                        }
                    }
                }
            });
    
            if (errors.length > 0) {
                console.log("Configurações necessárias faltando:");
                console.table(tableData);
                throw new Error(`Erro ao validar configurações: ${errors.join(' ')}`);
            }
    
            return {
                missingConfigurations,
                message: 'Todas as configurações necessárias estão presentes.',
                success: true,
            };
        } catch (error: any) {
            throw new Error(`Erro ao validar configurações: ${error.message}`);
        }
    }
    
    private loadCertificate() {
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

                    this.agent = new https.Agent({
                        key: key,
                        cert: cert,
                        ca: caCerts,
                    });

                    resolve({
                        success: true,
                        message: 'Certificado Carregado com Sucesso.'
                    });
                });
            } catch (error: any) {
                reject(new Error(error.message));
            }
        });
    }

    private configAxios() {
        try {
            const axiosConfig = {
                headers: {
                    'Content-Type': 'text/xml; charset=utf-8',
                },
                httpsAgent: this.agent,
                timeout: this.config.lib?.connection?.timeout || 60000, // Timeout padrão de 60 segundos se não for configurado
            };

            return axios.create(axiosConfig);
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async loadEnvironment() {
        this.checkRequiredSettings();
        await this.loadCertificate();
        const axios = this.configAxios();
        this.isLoaded = true;
        return { axios }
    }

}

export default Environment;