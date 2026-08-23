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

import { gzipSync } from 'zlib';
import { AxiosInstance, AxiosResponse } from 'axios';
import { BaseNFE, Environment, Utility, XmlBuilder, XmlParser, logger } from '@nfewizard/shared';
import { GenericObject, GerarConsultaImpl, SaveFilesImpl } from '@nfewizard/types/shared';
import { DCEAutorizacaoPayload, DCEAutorizacaoResponse, DCEAutorizacaoServiceImpl } from '@nfewizard/types/dce';

class DCEAutorizacaoService extends BaseNFE implements DCEAutorizacaoServiceImpl {
    constructor(
        environment: Environment,
        utility: Utility,
        xmlBuilder: XmlBuilder,
        axios: AxiosInstance,
        saveFiles: SaveFilesImpl,
        gerarConsulta: GerarConsultaImpl
    ) {
        super(environment, utility, xmlBuilder, 'DCEAutorizacao', axios, saveFiles, gerarConsulta);
        this.modelo = 'DCE';
    }

    private getVersao(data?: DCEAutorizacaoPayload): string {
        if (data?.versao && data.versao.trim() !== '') {
            return data.versao;
        }

        return '1.00';
    }

    private getDceObject(data?: DCEAutorizacaoPayload): Record<string, unknown> {
        if (data?.dce && typeof data.dce === 'object') {
            return data.dce;
        }

        if (data?.DCe && typeof data.DCe === 'object') {
            return data.DCe;
        }

        throw new Error('DCEAutorizacao: payload invalido. Informe xml ou objeto DCe.');
    }

    protected gerarXml(data?: DCEAutorizacaoPayload): string {
        if (data?.xml && data.xml.trim() !== '') {
            return data.xml;
        }

        const dceObj = this.getDceObject(data);
        const xmlSemAssinatura = this.xmlBuilder.gerarXml(dceObj, 'DCe', this.metodo);

        if (xmlSemAssinatura.includes('<Signature')) {
            return xmlSemAssinatura;
        }

        return this.xmlBuilder.assinarXML(xmlSemAssinatura, 'infDCe');
    }

    async Exec(data?: DCEAutorizacaoPayload): Promise<DCEAutorizacaoResponse> {
        let xmlConsulta = '';
        let xmlConsultaSoap = '';
        let responseInJson: GenericObject | undefined;
        let xmlRetorno: AxiosResponse<any, any> = {} as AxiosResponse<any, any>;

        try {
            const versao = this.getVersao(data);
            const contentType = this.setContentType();

            xmlConsulta = this.gerarXml(data);

            const { xmlFormated, agent, webServiceUrl, action } = await this.gerarConsulta.gerarConsulta(
                xmlConsulta,
                this.metodo,
                true,
                versao,
                this.modelo,
                true,
                'dceAutorizacao',
                'dceDadosMsg'
            );

            xmlConsultaSoap = xmlFormated;
            xmlRetorno = await this.callWebService(xmlFormated, webServiceUrl, contentType, action, agent);

            const json = new XmlParser();
            responseInJson = json.convertXmlToJson(xmlRetorno.data, this.metodo);
            const xMotivo = this.utility.findInObj(responseInJson, 'xMotivo');

            return {
                success: true,
                xMotivo,
                response: responseInJson
            };
        } catch (error: any) {
            logger.error('', error, { context: this.metodo });
            throw new Error(`DCE_Autorizacao: ${error.message}`);
        } finally {
            this.saveFiles.salvaArquivos(xmlConsulta, responseInJson, xmlRetorno, this.metodo, xmlConsultaSoap);
        }
    }

    async ExecZip(data?: DCEAutorizacaoPayload): Promise<DCEAutorizacaoResponse> {
        let xmlConsulta = '';
        let xmlConsultaSoap = '';
        let responseInJson: GenericObject | undefined;
        let xmlRetorno: AxiosResponse<any, any> = {} as AxiosResponse<any, any>;

        try {
            const versao = this.getVersao(data);
            const contentType = this.setContentType();

            const xml = this.gerarXml(data);
            xmlConsulta = gzipSync(Buffer.from(xml, 'utf-8')).toString('base64');

            const { xmlFormated, agent, webServiceUrl, action } = await this.gerarConsulta.gerarConsulta(
                xmlConsulta,
                'DCEAutorizacaoZip',
                true,
                versao,
                this.modelo,
                true,
                'DCeAutorizacaoZip',
                'dceDadosMsgZip'
            );

            xmlConsultaSoap = xmlFormated;
            xmlRetorno = await this.callWebService(xmlFormated, webServiceUrl, contentType, action, agent);

            const json = new XmlParser();
            responseInJson = json.convertXmlToJson(xmlRetorno.data, 'DCEAutorizacaoZip');
            const cStat = this.utility.findInObj(responseInJson, 'cStat');
            const xMotivo = this.utility.findInObj(responseInJson, 'xMotivo');

            if (String(cStat) === '416') {
                throw new Error(`Falha na descompactacao da area de dados: ${xMotivo || 'cStat 416'}`);
            }

            return {
                success: true,
                xMotivo,
                response: responseInJson
            };
        } catch (error: any) {
            logger.error('', error, { context: 'DCEAutorizacaoZip' });
            throw new Error(`DCE_AutorizacaoZip: ${error.message}`);
        } finally {
            this.saveFiles.salvaArquivos(xmlConsulta, responseInJson, xmlRetorno, 'DCEAutorizacaoZip', xmlConsultaSoap);
        }
    }
}

export { DCEAutorizacaoService };
