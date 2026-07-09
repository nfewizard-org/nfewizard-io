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
import { GerarConsultaImpl, NFSeAutorizacaoServiceImpl, SaveFilesImpl, GenericObject, LayoutDPS, LayoutNFSe, NFSe, NFSeAutorizacaoResponse } from '@nfewizard/types';
import { AxiosInstance } from 'axios';
import { Buffer } from 'buffer';
import { gunzipSync, gzipSync } from 'zlib';

class NFSeAutorizacaoService extends BaseNFSe implements NFSeAutorizacaoServiceImpl {
    private dpsXmlGZipB64: string = '';
    private dpsXmlAssinadoConsulta: string = '';

    private static readonly BRASILIA_OFFSET_MINUTES = 180;

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

    private formatarDataHoraBrasilia(dataHora: string): string {
        const data = new Date(dataHora);

        if (Number.isNaN(data.getTime())) {
            return dataHora;
        }

        const brasilia = new Date(data.getTime() - (NFSeAutorizacaoService.BRASILIA_OFFSET_MINUTES * 60 * 1000));
        const ano = brasilia.getUTCFullYear();
        const mes = String(brasilia.getUTCMonth() + 1).padStart(2, '0');
        const dia = String(brasilia.getUTCDate()).padStart(2, '0');
        const hora = String(brasilia.getUTCHours()).padStart(2, '0');
        const minuto = String(brasilia.getUTCMinutes()).padStart(2, '0');
        const segundo = String(brasilia.getUTCSeconds()).padStart(2, '0');

        return `${ano}-${mes}-${dia}T${hora}:${minuto}:${segundo}-03:00`;
    }

    private formatarDataCompetencia(dataCompetencia: string): string {
        if (/^\d{4}-\d{2}-\d{2}$/.test(dataCompetencia)) {
            return dataCompetencia;
        }

        if (/^\d{8}$/.test(dataCompetencia)) {
            return `${dataCompetencia.slice(0, 4)}-${dataCompetencia.slice(4, 6)}-${dataCompetencia.slice(6, 8)}`;
        }

        const data = new Date(dataCompetencia);

        if (Number.isNaN(data.getTime())) {
            return dataCompetencia;
        }

        const brasilia = new Date(data.getTime() - (NFSeAutorizacaoService.BRASILIA_OFFSET_MINUTES * 60 * 1000));
        const ano = brasilia.getUTCFullYear();
        const mes = String(brasilia.getUTCMonth() + 1).padStart(2, '0');
        const dia = String(brasilia.getUTCDate()).padStart(2, '0');

        return `${ano}-${mes}-${dia}`;
    }

    private normalizarEnderecoNacional(endNac: any): any {
        if (!endNac) {
            return endNac;
        }

        const enderecoNormalizado: any = {
            cMun: endNac.cMun,
            CEP: endNac.CEP,
        };

        if (endNac.UF) {
            enderecoNormalizado.UF = endNac.UF;
        }

        return enderecoNormalizado;
    }

    private normalizarEndereco(endereco: any): any {
        if (!endereco) {
            return endereco;
        }

        const enderecoNormalizado: any = {};

        if (endereco.endNac) {
            enderecoNormalizado.endNac = this.normalizarEnderecoNacional(endereco.endNac);
        }

        if (endereco.endExt) {
            enderecoNormalizado.endExt = endereco.endExt;
        }

        enderecoNormalizado.xLgr = endereco.xLgr;
        enderecoNormalizado.nro = endereco.nro;

        if (endereco.xCpl) {
            enderecoNormalizado.xCpl = endereco.xCpl;
        }

        enderecoNormalizado.xBairro = endereco.xBairro;

        return enderecoNormalizado;
    }

    private normalizarServico(servico: any): any {
        const servicoNormalizado: any = {
            locPrest: servico.locPrest,
            cServ: {
                cTribNac: servico.cServ.cTribNac,
            },
        };

        if (servico.cServ.cTribMun) {
            servicoNormalizado.cServ.cTribMun = servico.cServ.cTribMun;
        }

        servicoNormalizado.cServ.xDescServ = servico.cServ.xDescServ;

        if (servico.cServ.cNBS) {
            servicoNormalizado.cServ.cNBS = servico.cServ.cNBS;
        }

        if (servico.cServ.cIntContrib) {
            servicoNormalizado.cServ.cIntContrib = servico.cServ.cIntContrib;
        }

        if (servico.comExt) {
            servicoNormalizado.comExt = servico.comExt;
        }

        if (servico.obra) {
            servicoNormalizado.obra = servico.obra;
        }

        if (servico.atvEvento) {
            servicoNormalizado.atvEvento = servico.atvEvento;
        }

        if (servico.infoCompl) {
            servicoNormalizado.infoCompl = servico.infoCompl;
        }

        return servicoNormalizado;
    }

    private normalizarInfDps(infDps: any, ambiente: number): any {
        const dhEmi = this.formatarDataHoraBrasilia(infDps.dhEmi);
        const dCompet = this.formatarDataCompetencia(infDps.dCompet);

        if (dCompet > dhEmi.slice(0, 10)) {
            throw new Error(`dCompet deve ser no mesmo dia ou anterior a dhEmi no fuso de Brasília. dhEmi=${dhEmi}, dCompet=${dCompet}`);
        }

        const infDpsNormalizado: any = {
            tpAmb: ambiente,
            dhEmi,
            verAplic: infDps.verAplic,
            serie: infDps.serie,
            nDPS: infDps.nDPS,
            dCompet,
            tpEmit: infDps.tpEmit,
        };

        if (infDps.cMotivoEmisTI) {
            infDpsNormalizado.cMotivoEmisTI = infDps.cMotivoEmisTI;
        }

        if (infDps.chNFSeRej) {
            infDpsNormalizado.chNFSeRej = infDps.chNFSeRej;
        }

        infDpsNormalizado.cLocEmi = infDps.cLocEmi;

        if (infDps.subst) {
            infDpsNormalizado.subst = infDps.subst;
        }

        infDpsNormalizado.prest = {
            ...infDps.prest,
        };

        if (infDps.prest?.end) {
            infDpsNormalizado.prest.end = this.normalizarEndereco(infDps.prest.end);
        }

        if (infDps.toma) {
            infDpsNormalizado.toma = {
                ...infDps.toma,
            };

            if (infDps.toma.end) {
                infDpsNormalizado.toma.end = this.normalizarEndereco(infDps.toma.end);
            }
        }

        if (infDps.interm) {
            infDpsNormalizado.interm = {
                ...infDps.interm,
            };

            if (infDps.interm.end) {
                infDpsNormalizado.interm.end = this.normalizarEndereco(infDps.interm.end);
            }
        }

        infDpsNormalizado.serv = this.normalizarServico(infDps.serv);
        infDpsNormalizado.valores = infDps.valores;

        if (infDps.IBSCBS) {
            infDpsNormalizado.IBSCBS = infDps.IBSCBS;
        }

        return infDpsNormalizado;
    }

    /**
     * Monta o XML do DPS a partir do objeto JSON
     */
    private gerarXmlDPS(dps: LayoutDPS): string {
        const config = this.environment.getConfig();
        const ambiente = config.nfe.ambiente || 2;

        // Gera o ID do DPS se não foi fornecido
        const idDPS = dps.infDps.Id || this.gerarIdDPS(dps);

        // Monta o objeto XML com a estrutura correta e com a ordem exigida pelo schema.
        const infDPSObject: any = this.normalizarInfDps(dps.infDps, ambiente);
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
        // NOTA: `assinaturaDPS` é uma flag EXPERIMENTAL/PROVISÓRIA (issue #93 - E0714 SEFIN Nacional)
        // para testar diferentes perfis de algoritmo XMLDSig. Default mantém o comportamento legado.
        const assinaturaDPS = config.lib?.assinaturaDPS ?? 'legado';
        let xmlAssinado = this.xmlBuilder.assinarXML(xml, 'infDPS', assinaturaDPS);

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
            this.dpsXmlAssinadoConsulta = '';
            return data.dpsXmlGZipB64;
        }

        // Se foi fornecido o JSON, processa
        if (data.DPS) {
            const dpsArray = Array.isArray(data.DPS) ? data.DPS : [data.DPS];
            const xmls: string[] = [];

            for (const dps of dpsArray) {
                // Monta e assina o XML
                const xml = this.gerarXmlDPS(dps);
                this.dpsXmlAssinadoConsulta = xml;

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

    /**
     * Implementação do método abstrato da BaseNFSe (REST API)
     * Prepara os dados JSON que serão enviados ao webservice
     */
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

    private extrairResumoNFSeAutorizada(nfseXml: string): Record<string, any> {
        const capturar = (tag: string): string | undefined => {
            const match = nfseXml.match(new RegExp(`<${tag}>([^<]+)</${tag}>`));
            return match?.[1];
        };

        const cStat = capturar('cStat');
        const xMotivo = capturar('xMotivo');
        const nNFSe = capturar('nNFSe');
        const dhProc = capturar('dhProc');

        return {
            cStat,
            codigoRetorno: cStat,
            mensagemRetorno: xMotivo || (cStat === '100' ? 'Autorizado' : undefined),
            nNFSe,
            dhProc,
        };
    }

    public async Exec(data: NFSe): Promise<{
        success: boolean;
        status: number;
        response: NFSeAutorizacaoResponse | GenericObject;
        xmls?: {
            NFSe: LayoutNFSe;
        }[];
    }> {
        const config = this.environment.getConfig();
        this.dpsXmlAssinadoConsulta = '';

        try {
            const response = await super.Exec(data) as NFSeAutorizacaoResponse;

            let xmls: { NFSe: LayoutNFSe }[] = [];

            // Se a resposta contém NFSe em base64 gzip, descompacta e parseia
            if (response.nfseXmlGZipB64) {
                try {
                    const nfseBuffer = Buffer.from(response.nfseXmlGZipB64, 'base64');
                    const nfseXml = gunzipSync(nfseBuffer).toString('utf-8');
                    const resumoAutorizacao = this.extrairResumoNFSeAutorizada(nfseXml);

                    // Salva o XML da NFSe descompactado
                    if (config.dfe.armazenarXMLAutorizacao && response.chaveAcesso) {
                        this.utility.salvaXML({
                            data: nfseXml,
                            fileName: response.chaveAcesso,
                            metodo: this.metodo,
                            path: config.dfe.pathXMLAutorizacao,
                        });
                    }

                    if (config.dfe.armazenarXMLRetorno) {
                        this.utility.salvaJSON({
                            data: {
                                ...response,
                                sucesso: true,
                                statusHttp: 200,
                                ...resumoAutorizacao,
                            },
                            fileName: `${this.metodo}-retorno`,
                            metodo: this.metodo,
                            path: config.dfe.pathXMLRetorno,
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
                status: 200,
                response,
                xmls: xmls.length > 0 ? xmls : undefined
            };
        } catch (error: any) {
            if (config.dfe.armazenarXMLRetorno) {
                this.utility.salvaJSON({
                    data: {
                        sucesso: false,
                        metodo: this.metodo,
                        mensagem: error.message,
                        dataHora: new Date().toISOString(),
                    },
                    fileName: `${this.metodo}-retorno`,
                    metodo: this.metodo,
                    path: config.dfe.pathXMLRetorno,
                });
            }

            logger.error('Erro na autorização de NFSe', error, {
                context: 'NFSeAutorizacaoService',
            });
            throw error;
        } finally {
            if (config.dfe.armazenarXMLConsulta && this.dpsXmlAssinadoConsulta) {
                this.utility.salvaXML({
                    data: this.dpsXmlAssinadoConsulta,
                    fileName: `${this.metodo}-consulta`,
                    metodo: this.metodo,
                    path: config.dfe.pathXMLConsulta,
                });

                this.utility.salvaJSON({
                    data: {
                        dpsXmlGZipB64: this.dpsXmlGZipB64,
                    },
                    fileName: `${this.metodo}-consulta-json`,
                    metodo: this.metodo,
                    path: config.dfe.pathXMLConsulta,
                });
            }
        }
    }
}

export default NFSeAutorizacaoService;
