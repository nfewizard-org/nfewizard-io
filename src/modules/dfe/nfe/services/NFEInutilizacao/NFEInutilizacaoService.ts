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
import Environment from '@Modules/environment/Environment.js';
import Utility from '@Utils/Utility.js';
import XmlBuilder from '@Adapters/XmlBuilder.js';
import { InutilizacaoData } from '@Types';
import BaseNFE from '@Modules/dfe/base/BaseNFe.js';
import { AxiosInstance } from 'axios';
import { GerarConsultaImpl, NFEInutilizacaoServiceImpl, SaveFilesImpl } from '@Interfaces';
import { logger } from '@Core/exceptions/logger';

class NFEInutilizacaoService extends BaseNFE implements NFEInutilizacaoServiceImpl {
    constructor(environment: Environment, utility: Utility, xmlBuilder: XmlBuilder, axios: AxiosInstance, saveFiles: SaveFilesImpl, gerarConsulta: GerarConsultaImpl) {
        super(environment, utility, xmlBuilder, 'NFEInutilizacao', axios, saveFiles, gerarConsulta);
    }

    protected gerarXml(chave: InutilizacaoData): string {
        return this.gerarXmlNFeInutilizacao(chave);
    }

    /**
     * Método para criação do ID de Inutilização
     */
    private criarId(codigoUF: number, ano: string, cnpj: string, modelo: string, serie: string, numeroInicial: string, numeroFinal: string) {
        const id = `ID${codigoUF}${ano}${cnpj}${modelo}${serie}${numeroInicial}${numeroFinal}`;

        return id;
    }

    /**
     * Método utilitário para criação do XML a partir de um Objeto
     */
    gerarXmlNFeInutilizacao(data: InutilizacaoData) {
        logger.info('Montando estrutuda do XML em JSON', {
            context: 'NFEInutilizacaoService',
        });
        const { nfe: { ambiente } } = this.environment.getConfig();

        const {
            cUF,
            ano,
            CNPJ,
            mod,
            serie,
            nNFIni,
            nNFFin,
            xJust
        } = data;

        const anoFormatado = ano.toString().slice(-2);
        const serieFormatada = serie.padStart(3, '0')
        const numNFIniFormatado = nNFIni.padStart(9, '0')
        const numNFFinFormatado = nNFFin.padStart(9, '0')

        const id = this.criarId(cUF, anoFormatado, CNPJ, mod, serieFormatada, numNFIniFormatado, numNFFinFormatado);
        const xServ = 'INUTILIZAR';

        if ([55, 65].indexOf(Number(mod)) === -1) {
            throw new Error(`Modelo do documento para inutilização deve ser 55 ou 65. Modelo informado: ${mod}`);
        }

        const xmlObject = {
            $: {
                versao: "4.00",
                xmlns: 'http://www.portalfiscal.inf.br/nfe'
            },
            infInut: {
                $: {
                    Id: `${id}`,
                },
                tpAmb: ambiente,
                xServ,
                cUF,
                ano,
                CNPJ,
                mod,
                serie,
                nNFIni,
                nNFFin,
                xJust,
            }
        }

        // Gerar XML
        const xml = this.xmlBuilder.gerarXml(xmlObject, 'inutNFe', this.metodo)

        // Assinar XML
        return this.xmlBuilder.assinarXML(xml, 'infInut');
    }

}

export default NFEInutilizacaoService;