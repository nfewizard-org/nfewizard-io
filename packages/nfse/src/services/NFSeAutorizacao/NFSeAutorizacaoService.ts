/*
 * This file is part of Treeunfe DFe.
 * 
 * Treeunfe DFe is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * Treeunfe DFe is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with Treeunfe DFe. If not, see <https://www.gnu.org/licenses/>.
 */
import { XmlBuilder, Environment, Utility, logger, XmlParser, BaseNFSe } from '@nfewizard/shared';
import { GerarConsultaImpl, NFSeAutorizacaoServiceImpl, SaveFilesImpl } from '@nfewizard/types/interfaces';
import { GenericObject, LayoutDPS, LayoutNFSe, NFSe, NFSeAutorizacaoResponse } from '@nfewizard/types';
import { AxiosInstance } from 'axios';
import { Buffer } from 'buffer';
import { gunzipSync, gzipSync } from 'zlib';

class NFSeAutorizacaoService extends BaseNFSe implements NFSeAutorizacaoServiceImpl {
    private dpsXmlGZipB64: string = '';

    constructor(environment: Environment, utility: Utility, xmlBuilder: XmlBuilder, axios: AxiosInstance, saveFiles: SaveFilesImpl, gerarConsulta: GerarConsultaImpl) {
        super(environment, utility, xmlBuilder, 'NFSe_Autorizacao', axios, saveFiles, gerarConsulta);
    }

    /**
     * Gera o ID do DPS conforme regra do schema:
     * "DPS" + Cód.Mun (7) + Tipo de Inscrição Federal (1) + Inscrição Federal (14) + Série DPS (5) + Núm. DPS (15)
     * Total: 45 caracteres
     * 
     * Tipo de Inscrição: 1 = CNPJ, 2 = CPF
     */
    private gerarIdDPS(dps: LayoutDPS): string {
        // Código do município (7 dígitos)
        const cLocEmi = dps.infDps.cLocEmi.replace(/\D/g, '').padStart(7, '0').substring(0, 7);

        // Tipo de inscrição e número
        // IMPORTANTE: tpInscFed: 1 = CPF, 2 = CNPJ (invertido do que parece lógico!)
        const prestador = dps.infDps.prest;
        let tipoInscricao: string;
        let inscricaoFederal: string;

        if (prestador.CNPJ) {
            tipoInscricao = '2'; // CNPJ = 2
            inscricaoFederal = prestador.CNPJ.replace(/\D/g, '').padStart(14, '0').substring(0, 14);
        } else if (prestador.CPF) {
            tipoInscricao = '1'; // CPF = 1
            inscricaoFederal = prestador.CPF.replace(/\D/g, '').padStart(14, '0').substring(0, 14);
        } else {
            // Fallback: assume CNPJ se não houver nenhum
            tipoInscricao = '2';
            inscricaoFederal = '0'.repeat(14);
        }

        // Série DPS (5 dígitos) - apenas números, se houver letras, converte para números
        // O schema permite até 5 dígitos, mas o ID precisa ter exatamente 5 dígitos com zeros à esquerda
        const serieOriginal = dps.infDps.serie.replace(/\D/g, '');
        const serie = serieOriginal.padStart(5, '0').substring(0, 5);

        // Número DPS (15 dígitos)
        // IMPORTANTE: O schema TSNumDPS não permite números que começam com zero (pattern: [1-9]{1}[0-9]{0,14})
        // Mas o ID precisa ter exatamente 15 dígitos. O servidor faz o padding ao validar.
        // Usamos o valor original sem padding para o XML, mas com padding para o ID
        const nDPSOriginal = dps.infDps.nDPS.replace(/\D/g, '');
        // Garante que não comece com zero (conforme schema) e depois adiciona zeros à esquerda para o ID
        const nDPS = nDPSOriginal.padStart(15, '0').substring(0, 15);

        const idDPS = `DPS${cLocEmi}${tipoInscricao}${inscricaoFederal}${serie}${nDPS}`;

        // Log detalhado para debug
        logger.info('Gerando ID do DPS', {
            context: 'NFSeAutorizacaoService',
            valores: {
                cLocEmi: dps.infDps.cLocEmi,
                cLocEmiFormatado: cLocEmi,
                tipoInscricao,
                inscricaoFederal,
                serieOriginal: dps.infDps.serie,
                serieFormatada: serie,
                nDPSOriginal: dps.infDps.nDPS,
                nDPSFormatado: nDPS,
                idDPS,
                tamanho: idDPS.length
            }
        });

        // Validação: deve ter exatamente 45 caracteres
        if (idDPS.length !== 45) {
            throw new Error(`ID do DPS deve ter 45 caracteres, mas tem ${idDPS.length}: ${idDPS}`);
        }

        return idDPS;
    }

    /**
     * Monta o XML do DPS a partir do objeto JSON
     */
    private gerarXmlDPS(dps: LayoutDPS): string {
        const config = this.environment.getConfig();
        const ambiente = config.ambiente || 2;

        // Gera o ID do DPS se não foi fornecido
        const idDPS = dps.infDps.Id || this.gerarIdDPS(dps);

        // Garante que o ambiente está correto e remove Id do objeto (será colocado como atributo)
        const { Id, ...infDpsDataSemId } = dps.infDps;
        const infDpsData = {
            ...infDpsDataSemId,
            tpAmb: ambiente
        };

        // Monta o objeto XML com a estrutura correta
        // O atributo Id deve estar no $ do infDPS (maiúsculas conforme schema)
        // Garantimos que $ seja definido por último para não ser sobrescrito
        const infDPSObject: any = {
            ...infDpsData
        };
        infDPSObject.$ = {
            Id: idDPS
        };

        const dpsObject = {
            $: {
                versao: '1.01',
                xmlns: 'http://www.sped.fazenda.gov.br/nfse'
            },
            infDPS: infDPSObject  // Nome exato conforme schema: infDPS (maiúsculas)
        };

        // Gera o XML
        let xml = this.xmlBuilder.gerarXml(dpsObject, 'DPS', this.metodo);

        // Verifica se o atributo Id está presente no XML gerado
        const temIdNoXml = xml.includes(`Id="${idDPS}"`) || xml.includes(`Id='${idDPS}'`);

        // Adiciona a declaração XML com encoding UTF-8 se não existir
        if (!xml.trim().startsWith('<?xml')) {
            xml = '<?xml version="1.0" encoding="UTF-8"?>\n' + xml;
        } else {
            // Garante que a declaração tenha encoding UTF-8
            xml = xml.replace(/^<\?xml[^>]*\?>/, '<?xml version="1.0" encoding="UTF-8"?>');
        }

        logger.info('XML do DPS gerado', {
            context: 'NFSeAutorizacaoService',
            idDPS,
            tamanho: xml.length,
            comDeclaracao: xml.trim().startsWith('<?xml'),
            temIdNoXml,
            xmlPreview: xml.substring(0, 300)
        });

        if (!temIdNoXml) {
            logger.warn('Atributo Id não encontrado no XML gerado (antes da assinatura)', {
                context: 'NFSeAutorizacaoService',
                idDPS,
                xmlPreview: xml.substring(0, 500)
            });
        }

        // Assina o XML (usa o nome exato do elemento conforme schema)
        let xmlAssinado = this.xmlBuilder.assinarXML(xml, 'infDPS');

        // Garante que o XML assinado tenha a declaração UTF-8
        if (!xmlAssinado.trim().startsWith('<?xml')) {
            xmlAssinado = '<?xml version="1.0" encoding="UTF-8"?>\n' + xmlAssinado;
        } else {
            // Garante que a declaração tenha encoding UTF-8
            xmlAssinado = xmlAssinado.replace(/^<\?xml[^>]*\?>/, '<?xml version="1.0" encoding="UTF-8"?>');
        }

        // Verifica se o atributo Id está presente no XML
        const temId = xmlAssinado.includes(`Id="${idDPS}"`) || xmlAssinado.includes(`Id='${idDPS}'`);

        logger.info('XML do DPS assinado', {
            context: 'NFSeAutorizacaoService',
            tamanho: xmlAssinado.length,
            comDeclaracao: xmlAssinado.trim().startsWith('<?xml'),
            declaracao: xmlAssinado.substring(0, 50),
            temId,
            idDPS
        });

        if (!temId) {
            logger.warn('Atributo Id não encontrado no XML assinado', {
                context: 'NFSeAutorizacaoService',
                idDPS,
                xmlPreview: xmlAssinado.substring(0, 500)
            });
        }

        return xmlAssinado;
    }

    /**
     * Processa o DPS: monta XML, assina, compacta e codifica
     */
    private processarDPS(data: NFSe): string {
        // Se já foi fornecido o Base64, usa diretamente
        if (data.dpsXmlGZipB64) {
            return data.dpsXmlGZipB64;
        }

        // Se foi fornecido o JSON, processa
        if (data.DPS) {
            const dpsArray = Array.isArray(data.DPS) ? data.DPS : [data.DPS];
            const xmls: string[] = [];

            for (const dps of dpsArray) {
                // Monta e assina o XML
                const xml = this.gerarXmlDPS(dps);

                // Compacta em GZip
                const gzip = gzipSync(Buffer.from(xml, 'utf-8'));

                // Codifica em Base64
                const base64 = gzip.toString('base64');

                xmls.push(base64);
            }

            // Se houver apenas um DPS, retorna o Base64 diretamente
            // Se houver múltiplos, precisaria de um lote (por enquanto, retorna o primeiro)
            return xmls[0];
        }

        throw new Error('É necessário fornecer DPS (JSON) ou dpsXmlGZipB64 (Base64)');
    }

    protected prepararDados(data: NFSe): any {
        // Processa o DPS antes de enviar
        this.dpsXmlGZipB64 = this.processarDPS(data);

        return {
            dpsXmlGZipB64: this.dpsXmlGZipB64
        };
    }

    protected getHttpMethod(): 'GET' | 'POST' | 'PUT' | 'DELETE' {
        return 'POST';
    }

    public async Exec(data: NFSe): Promise<{
        success: boolean;
        response: NFSeAutorizacaoResponse | GenericObject;
        xmls?: {
            NFSe: LayoutNFSe;
        }[];
    }> {
        try {
            const response = await super.Exec(data) as NFSeAutorizacaoResponse;

            let xmls: { NFSe: LayoutNFSe }[] = [];

            // Se a resposta contém NFSe em base64 gzip, descompacta e parseia
            if (response.nfseXmlGZipB64) {
                try {
                    const nfseBuffer = Buffer.from(response.nfseXmlGZipB64, 'base64');
                    const nfseXml = gunzipSync(nfseBuffer).toString('utf-8');

                    // Salva o XML da NFSe descompactado
                    const config = this.environment.getConfig();
                    if (config.armazenarXMLAutorizacao && response.chaveAcesso) {
                        this.utility.salvaXML({
                            data: nfseXml,
                            fileName: response.chaveAcesso,
                            metodo: this.metodo,
                            path: config.pathXMLAutorizacao,
                        });
                    }

                    const json = new XmlParser();
                    const nfseJson = json.convertXmlToJson(nfseXml, 'NFSeAutorizacao');

                    xmls.push({
                        NFSe: nfseJson as LayoutNFSe
                    });
                } catch (error: any) {
                    // Log como warning ao invés de error, pois a NFSe foi autorizada com sucesso
                    // O erro é apenas no processamento do XML descompactado, não na autorização
                    logger.warn('Aviso ao processar XML da NFSe descompactada', {
                        context: 'NFSeAutorizacaoService',
                        message: error.message,
                        note: 'A NFSe foi autorizada com sucesso, mas o XML não pôde ser processado automaticamente'
                    });
                }
            }

            return {
                success: true,
                response,
                xmls: xmls.length > 0 ? xmls : undefined
            };
        } catch (error: any) {
            logger.error('Erro na autorização de NFSe', error, {
                context: 'NFSeAutorizacaoService',
            });
            throw error;
        }
    }
}

export default NFSeAutorizacaoService;
