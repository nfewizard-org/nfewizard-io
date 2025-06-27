import XmlBuilder from '@Adapters/XmlBuilder';
import { logger } from '@Core/exceptions/logger';
import Utility from '@Core/utils/Utility';
import { GerarConsultaImpl } from '@Interfaces';
import Environment from '@Modules/environment/Environment.js';

class GerarConsulta implements GerarConsultaImpl {
    utility: Utility;
    environment: Environment;
    xmlBuilder: XmlBuilder;

    constructor(environment: Environment, utility: Utility, xmlBuilder: XmlBuilder) {
        this.environment = environment;
        this.utility = utility;
        this.xmlBuilder = xmlBuilder;
    }

    createSoapEnvelop(xmlConsulta: string, metodo: string, method: string, rootTag: boolean = false, tag = "") {
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
        return this.xmlBuilder.buildSoapEnvelope(xmlConsulta, method, 'soap12', rootTagObj);
    }

    async gerarConsulta(xmlConsulta: string, metodo: string, ambienteNacional = false, versao = "", mod = "NFe", rootTag: boolean = false, tag = "") {
        try {
            const config = this.environment.getConfig();
            // Valida Schema
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

            // Capturando a url do método para o namespace xmlns
            const { method, action } = this.utility.getSoapInfo(config.dfe.UF, metodo);

            const xmlFormated = this.createSoapEnvelop(xmlConsulta, metodo, method, rootTag, tag);

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

export default GerarConsulta;