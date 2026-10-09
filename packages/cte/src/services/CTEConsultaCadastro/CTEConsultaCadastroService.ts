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
import { Environment, XmlBuilder, Utility, BaseNFE, logger } from '@nfewizard/shared';
import { AxiosInstance } from 'axios';
import { SaveFilesImpl, GerarConsultaImpl, CTEConsultaCadastroServiceImpl } from '@nfewizard/types/shared';
import { ConsultaCadastroData } from '@nfewizard/types/nfe';

/**
 * O CT-e não possui serviço próprio de Consulta Cadastro: o MOC remete ao `NFeConsultaCadastro`
 * (webservice `CadConsultaCadastro4`, schema consCad 2.00). Por isso este service usa o mesmo
 * método, URLs e schema já configurados para a NF-e em `@nfewizard/shared`.
 */
const METHOD_NAME = 'NfeConsultaCadastro';

export class CTEConsultaCadastroService extends BaseNFE implements CTEConsultaCadastroServiceImpl {
    constructor(environment: Environment, utility: Utility, xmlBuilder: XmlBuilder, axios: AxiosInstance, saveFiles: SaveFilesImpl, gerarConsulta: GerarConsultaImpl) {
        super(environment, utility, xmlBuilder, METHOD_NAME, axios, saveFiles, gerarConsulta);
    }

    protected gerarXml(data: ConsultaCadastroData): string {
        logger.info('Montando estrutura do XML em JSON', {
            context: 'CTEConsultaCadastroService',
        });

        const { dfe: { UF } } = this.environment.getConfig();

        const argumentos = ['cnpj', 'cpf', 'ie'].filter((chave) => Boolean((data as any)?.[chave]));
        if (argumentos.length !== 1) {
            throw new Error("Informe exatamente um dos campos 'cnpj', 'cpf' ou 'ie' para a Consulta Cadastro.");
        }

        const infCons: Record<string, string> = {
            xServ: 'CONS-CAD',
            UF: data.uf || UF,
        };
        if (data.ie) infCons.IE = data.ie;
        if (data.cnpj) infCons.CNPJ = data.cnpj;
        if (data.cpf) infCons.CPF = data.cpf;

        const xmlObject = {
            $: {
                versao: '2.00',
                xmlns: 'http://www.portalfiscal.inf.br/nfe'
            },
            infCons,
        };

        return this.xmlBuilder.gerarXml(xmlObject, 'ConsCad', this.metodo);
    }
}

export default CTEConsultaCadastroService;
