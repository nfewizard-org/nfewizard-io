import Utility from '@Core/utils/Utility';
import { SaveFilesImpl } from '@Interfaces';
import Environment from '@Modules/environment/Environment.js';
import { GenericObject } from '@Types';
import { AxiosResponse } from 'axios';
import { format } from 'date-fns';

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
class SaveFiles implements SaveFilesImpl{
    utility: Utility;
    environment: Environment;
    constructor(environment: Environment, utility: Utility) {
        this.environment = environment;
        this.utility = utility;
    }

    public salvaArquivos(xmlConsulta: string, responseInJson: GenericObject | undefined, xmlRetorno: AxiosResponse<any, any>, metodo: string, xmlFormated?: string, options?: Record<string, any>): void {
        // Recupera configuração do ambiente para verificar se os arquivos gerados serão gravados em disco
        const config = this.environment.getConfig();
        let dateAndTimeInFileName = config.dfe.incluirTimestampNoNomeDosArquivos;
        const { armazenarXMLConsultaComTagSoap } = this.environment.config.dfe
        const xmlConsultaASalvar = armazenarXMLConsultaComTagSoap ? xmlFormated : xmlConsulta;

        const createFileName = (prefix: string | undefined) => {
            const dtaTime = dateAndTimeInFileName ? `-${format(new Date(), 'dd-MM-yyyy-HHmm')}` : '';

            const baseFileName = `${metodo}`;
            const prefixPart = prefix ? `-${prefix}` : '';
            const nfePart = responseInJson && responseInJson.chNFe ? `-${responseInJson.chNFe}` : '';
            const dateTimePart = dtaTime;

            return `${baseFileName}${prefixPart}${nfePart}${dateTimePart}`;
        }

        const salvarArquivo = (data: any, prefix: string | undefined, path: string | undefined, fileType: 'xml' | 'json') => {
            const fileName = createFileName(prefix);
            const method = fileType === 'xml' ? 'salvaXML' : 'salvaJSON';

            this.utility[method]({
                data: data || '',
                fileName,
                metodo: metodo,
                path,
            });
        };

        if (config.dfe.armazenarXMLConsulta) {
            salvarArquivo(xmlConsultaASalvar, 'consulta', config.dfe.pathXMLConsulta, 'xml');
        }
        if (config.dfe.armazenarXMLRetorno) {
            salvarArquivo(xmlRetorno.data, 'retorno', config.dfe.pathXMLRetorno, 'xml');
        }
        if (config.dfe.armazenarRetornoEmJSON) {
            salvarArquivo(responseInJson, undefined, config.dfe.pathRetornoEmJSON, 'json');
        }
    }
}

export default SaveFiles;