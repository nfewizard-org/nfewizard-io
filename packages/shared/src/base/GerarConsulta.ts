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

import { XmlBuilder } from '../adapters/XmlBuilder.js';
import { logger } from '../exceptions/logger.js';
import { Utility } from '../utils/Utility.js';
import { GerarConsultaImpl } from '@nfewizard/types/shared';
import { Environment } from '../environment/Environment.js';

class GerarConsulta implements GerarConsultaImpl {
    utility: Utility;
    environment: Environment;
    xmlBuilder: XmlBuilder;

    constructor(environment: Environment, utility: Utility, xmlBuilder: XmlBuilder) {
        this.environment = environment;
        this.utility = utility;
        this.xmlBuilder = xmlBuilder;
    }

    createSoapEnvelop(xmlConsulta: string, metodo: string, method: string, rootTag: boolean = false, tag = "", dadosMsgTag: string = "nfeDadosMsg") {
        logger.info(`Adicionando SOAP ao XML`, {
            context: 'GerarConsulta',
        });
        // Criando envelop SOAP (estrutura para e envio do XML)
        let rootTagObj = null;
        if (rootTag) {
            rootTagObj = {
                tag,
                namespace: method,
            };
        }
        return this.xmlBuilder.buildSoapEnvelope(xmlConsulta, method, 'soap12', rootTagObj, dadosMsgTag);
    }

    async gerarConsulta(xmlConsulta: string, metodo: string, ambienteNacional = false, versao = "", mod = "NFe", rootTag: boolean = false, tag = "", dadosMsgTag: string = "nfeDadosMsg") {
        try {
            const config = this.environment.getConfig();
            
            // Capturando o schema path
            const { schemaPath } = this.utility.getSchema(metodo);
            
            // Valida Schema apenas se o schema path estiver definido
            if (schemaPath) {
                if (config.lib?.useForSchemaValidation !== 'validateSchemaJsBased') {
                    logger.info(`Validando XML com xsd-schema-validator`, {
                        context: 'GerarConsulta',
                        obs: 'Validação necessita do JAVA instaldo no ambiente',
                    });
                    await this.utility.validateSchemaJavaBased(xmlConsulta, metodo);
                } else {
                    logger.info(`Validando XML com xsd-assembler`, {
                        context: 'GerarConsulta',
                        obs: 'Validação com nodejs',
                    });
                    await this.utility.validateSchemaJsBased(xmlConsulta, metodo);
                }
            } else {
                logger.info(`Pulando validação de schema`, {
                    context: 'GerarConsulta',
                    metodo,
                    obs: 'Schema XSD não disponível para este método',
                });
            }

            // Capturando a url do método para o namespace xmlns
            const { method, action } = this.utility.getSoapInfo(config.dfe.UF, metodo);

            const xmlFormated = this.createSoapEnvelop(xmlConsulta, metodo, method, rootTag, tag, dadosMsgTag);

            // Retorna o Http.Agent contendo os certificados das Autoridades Certificadoras
            const agent = this.environment.getHttpAgent();

            // Retorna a url do webservice NFEStatusServico
            const webServiceUrl = this.utility.getWebServiceUrl(metodo, ambienteNacional, versao, mod);

            return {
                xmlFormated,
                agent,
                webServiceUrl,
                action
            }

        } catch (error: any) {
            logger.error(`Erro ao gerar dados de consulta para o webservice`, error, { context: 'GerarConsulta', method: 'gerarConsulta', service: metodo });
            throw new Error(error.message)
        }
    }
}

export { GerarConsulta };
