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
import { XmlBuilder, Environment, Utility, logger, BaseNFSe } from '@nfewizard/shared';
import { GerarConsultaImpl, NFSeDistribuicaoServiceImpl, SaveFilesImpl } from '@nfewizard/types/interfaces';
import { NFSeDistribuicaoPorNSU, NFSeDistribuicaoResponse, NFSeEventosPorChave } from '@nfewizard/types';
import { AxiosInstance } from 'axios';
import { gunzipSync } from 'zlib';

class NFSeDistribuicaoService extends BaseNFSe implements NFSeDistribuicaoServiceImpl {
    constructor(environment: Environment, utility: Utility, xmlBuilder: XmlBuilder, axios: AxiosInstance, saveFiles: SaveFilesImpl, gerarConsulta: GerarConsultaImpl) {
        super(environment, utility, xmlBuilder, 'NFSe_Distribuicao', axios, saveFiles, gerarConsulta);
    }

    protected prepararDados(_data?: any): any {
        return null; // GET request
    }

    protected getHttpMethod(): 'GET' | 'POST' | 'PUT' | 'DELETE' {
        return 'GET';
    }

    protected getUrlPath(data?: any): string {
        if (data && 'chaveAcesso' in data) {
            return `/${(data as NFSeEventosPorChave).chaveAcesso}/Eventos`;
        }
        if (data && 'nsu' in data) {
            return `/${(data as NFSeDistribuicaoPorNSU).nsu}`;
        }
        return '';
    }

    protected getQueryParams(data?: any): Record<string, any> {
        if (data && 'nsu' in data) {
            const nsuData = data as NFSeDistribuicaoPorNSU;
            const params: Record<string, any> = {};
            if (nsuData.cnpjConsulta) {
                params.cnpjConsulta = nsuData.cnpjConsulta;
            }
            if (nsuData.lote !== undefined) {
                params.lote = nsuData.lote;
            }
            return params;
        }
        return {};
    }

    protected getWebServiceUrl(): string {
        if (this.metodo === 'NFSe_EventosPorChave') {
            return this.utility.getWebServiceUrlNFSe('NFSe_EventosPorChave');
        }
        return this.utility.getWebServiceUrlNFSe('NFSe_Distribuicao');
    }

    async DistribuicaoPorNSU(data: NFSeDistribuicaoPorNSU): Promise<NFSeDistribuicaoResponse> {
        const response = await super.Exec(data) as NFSeDistribuicaoResponse;

        // Se a resposta contém documentos, processa e salva cada um
        if (response.LoteDFe && Array.isArray(response.LoteDFe) && response.LoteDFe.length > 0) {
            const config = this.environment.getConfig();

            // Processa cada documento retornado
            for (const documento of response.LoteDFe) {
                if (documento.ArquivoXml && documento.ChaveAcesso) {
                    try {
                        // O ArquivoXml pode estar em dois formatos:
                        // 1. Base64 simples → GZip direto
                        // 2. Base64 duplo → Base64 → GZip
                        let documentoXml: string;

                        try {
                            // Tenta primeiro: Base64 simples → GZip direto
                            const documentoBuffer = Buffer.from(documento.ArquivoXml, 'base64');
                            documentoXml = gunzipSync(documentoBuffer).toString('utf-8');
                        } catch (gzipError) {
                            // Se falhar, tenta: Base64 duplo → Base64 → GZip
                            const primeiraDecodificacao = Buffer.from(documento.ArquivoXml, 'base64').toString('utf-8');
                            const documentoBuffer = Buffer.from(primeiraDecodificacao, 'base64');
                            documentoXml = gunzipSync(documentoBuffer).toString('utf-8');
                        }

                        // Salva o XML do documento (apenas se estiver configurado)
                        // Documentos autorizados devem ser salvos em Autorizacao/NFSe/
                        if (config.armazenarXMLAutorizacao && config.pathXMLAutorizacao) {
                            let fileName: string;
                            let pathCompleto: string;

                            if (documento.TipoDocumento === 'EVENTO' && documento.TipoEvento) {
                                // Evento: salva em subpasta do tipo de evento
                                const tipoEventoMap: Record<string, number> = {
                                    'CANCELAMENTO': 101101,
                                    'CANCELAMENTO_POR_SUBSTITUICAO': 105102,
                                    'SOLICITACAO_CANCELAMENTO_ANALISE_FISCAL': 101103,
                                    'CANCELAMENTO_DEFERIDO_ANALISE_FISCAL': 105104,
                                    'CANCELAMENTO_INDEFERIDO_ANALISE_FISCAL': 105105,
                                    'CONFIRMACAO_PRESTADOR': 202201,
                                    'REJEICAO_PRESTADOR': 202205,
                                    'CONFIRMACAO_TOMADOR': 203202,
                                    'REJEICAO_TOMADOR': 203206,
                                };

                                let tipoEvento: number;
                                if (typeof documento.TipoEvento === 'string') {
                                    tipoEvento = tipoEventoMap[documento.TipoEvento] || parseInt(documento.TipoEvento, 10) || 101101;
                                } else {
                                    tipoEvento = documento.TipoEvento as number;
                                }

                                const nsu = documento.NSU || 0;
                                fileName = `${documento.ChaveAcesso}_evento_${tipoEvento}_${nsu}`;
                                pathCompleto = `${config.pathXMLAutorizacao}/${tipoEvento}`;
                            } else if (documento.TipoDocumento === 'NFSE') {
                                // NFSe: salva na pasta raiz
                                fileName = documento.ChaveAcesso;
                                pathCompleto = config.pathXMLAutorizacao;
                            } else {
                                // Outro tipo de documento: salva na pasta raiz com prefixo
                                const nsu = documento.NSU || 0;
                                fileName = `${documento.ChaveAcesso}_${documento.TipoDocumento}_${nsu}`;
                                pathCompleto = config.pathXMLAutorizacao;
                            }

                            logger.info('Tentando salvar XML do documento de DistribuicaoPorNSU', {
                                context: 'NFSeDistribuicaoService',
                                fileName: fileName,
                                path: pathCompleto,
                                tipoDocumento: documento.TipoDocumento,
                                tipoEvento: documento.TipoEvento,
                                nsu: documento.NSU
                            });

                            this.utility.salvaXML({
                                data: documentoXml,
                                fileName: fileName,
                                metodo: this.metodo,
                                path: pathCompleto,
                            });

                            logger.info('XML do documento de DistribuicaoPorNSU salvo com sucesso', {
                                context: 'NFSeDistribuicaoService',
                                fileName: fileName,
                                path: pathCompleto,
                                tipoDocumento: documento.TipoDocumento
                            });
                        }
                    } catch (error: any) {
                        logger.error('Erro ao processar XML do documento de DistribuicaoPorNSU', {
                            context: 'NFSeDistribuicaoService',
                            message: error.message,
                            stack: error.stack,
                            documento: documento
                        });
                    }
                }
            }
        }

        return response;
    }

    async EventosPorChave(data: NFSeEventosPorChave): Promise<NFSeDistribuicaoResponse> {
        this.metodo = 'NFSe_EventosPorChave';
        const response = await super.Exec(data) as NFSeDistribuicaoResponse;

        // Se a resposta contém eventos, processa e salva cada um
        if (response.LoteDFe && Array.isArray(response.LoteDFe) && response.LoteDFe.length > 0) {
            const config = this.environment.getConfig();

            // Processa cada evento retornado
            for (const evento of response.LoteDFe) {
                // Apenas processa eventos (TipoDocumento = 'EVENTO' e TipoEvento presente)
                if (evento.TipoDocumento === 'EVENTO' && evento.TipoEvento) {
                    if (evento.ArquivoXml) {
                        try {
                            // O ArquivoXml pode estar em dois formatos:
                            // 1. Base64 simples → GZip direto (EventosPorChave)
                            // 2. Base64 duplo → Base64 → GZip (ConsultarEvento)
                            let eventoXml: string;

                            try {
                                // Tenta primeiro: Base64 simples → GZip direto
                                const eventoBuffer = Buffer.from(evento.ArquivoXml, 'base64');
                                eventoXml = gunzipSync(eventoBuffer).toString('utf-8');
                            } catch (gzipError) {
                                // Se falhar, tenta: Base64 duplo → Base64 → GZip
                                const primeiraDecodificacao = Buffer.from(evento.ArquivoXml, 'base64').toString('utf-8');
                                const eventoBuffer = Buffer.from(primeiraDecodificacao, 'base64');
                                eventoXml = gunzipSync(eventoBuffer).toString('utf-8');
                            }

                            // Mapeia o TipoEvento de string para número
                            // O TipoEvento vem como string (ex: "CANCELAMENTO") e precisa ser convertido para número (ex: 101101)
                            const tipoEventoMap: Record<string, number> = {
                                'CANCELAMENTO': 101101,
                                'CANCELAMENTO_POR_SUBSTITUICAO': 105102,
                                'SOLICITACAO_CANCELAMENTO_ANALISE_FISCAL': 101103,
                                'CANCELAMENTO_DEFERIDO_ANALISE_FISCAL': 105104,
                                'CANCELAMENTO_INDEFERIDO_ANALISE_FISCAL': 105105,
                                'CONFIRMACAO_PRESTADOR': 202201,
                                'REJEICAO_PRESTADOR': 202205,
                                'CONFIRMACAO_TOMADOR': 203202,
                                'REJEICAO_TOMADOR': 203206,
                            };

                            // Tenta converter string para número, ou usa o mapeamento
                            let tipoEvento: number;
                            if (typeof evento.TipoEvento === 'string') {
                                tipoEvento = tipoEventoMap[evento.TipoEvento] || parseInt(evento.TipoEvento, 10) || 101101;
                            } else {
                                tipoEvento = evento.TipoEvento as number;
                            }

                            // Salva o XML do evento (apenas se estiver configurado)
                            // Eventos de NFSe autorizada devem ser salvos em Autorizacao/NFSe/{tipoEvento}/
                            if (config.armazenarXMLAutorizacao && config.pathXMLAutorizacao && evento.ChaveAcesso) {
                                const nsu = evento.NSU || 0;
                                const fileName = `${evento.ChaveAcesso}_evento_${tipoEvento}_${nsu}`;

                                // Cria o path com a subpasta do tipo de evento em Autorizacao/NFSe
                                const pathComTipoEvento = `${config.pathXMLAutorizacao}/${tipoEvento}`;

                                logger.info('Tentando salvar XML do evento de EventosPorChave', {
                                    context: 'NFSeDistribuicaoService',
                                    fileName: fileName,
                                    path: pathComTipoEvento,
                                    tipoEvento: tipoEvento,
                                    tipoEventoOriginal: evento.TipoEvento,
                                    nsu: nsu
                                });

                                this.utility.salvaXML({
                                    data: eventoXml,
                                    fileName: fileName,
                                    metodo: this.metodo,
                                    path: pathComTipoEvento,
                                });

                                logger.info('XML do evento de EventosPorChave salvo com sucesso', {
                                    context: 'NFSeDistribuicaoService',
                                    fileName: fileName,
                                    path: pathComTipoEvento,
                                    tipoEvento: tipoEvento
                                });
                            }
                        } catch (error: any) {
                            logger.error('Erro ao processar XML do evento de EventosPorChave', {
                                context: 'NFSeDistribuicaoService',
                                message: error.message,
                                stack: error.stack,
                                evento: evento
                            });
                        }
                    }
                }
            }
        }

        return response;
    }
}

export default NFSeDistribuicaoService;
