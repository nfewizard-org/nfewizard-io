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
import { GerarConsultaImpl, NFSeEventosServiceImpl, SaveFilesImpl } from '@nfewizard/types/interfaces';
import { LayoutPedRegEvento, NFSeEventoConsulta, NFSeEventoRequest, NFSeEventoResponse, TipoEventoNFSe } from '@nfewizard/types';
import { AxiosInstance } from 'axios';
import { gunzipSync, gzipSync } from 'zlib';

class NFSeEventosService extends BaseNFSe implements NFSeEventosServiceImpl {
    private pedidoRegistroEventoXmlGZipB64: string = '';

    constructor(environment: Environment, utility: Utility, xmlBuilder: XmlBuilder, axios: AxiosInstance, saveFiles: SaveFilesImpl, gerarConsulta: GerarConsultaImpl) {
        super(environment, utility, xmlBuilder, 'NFSe_Eventos', axios, saveFiles, gerarConsulta);
    }

    /**
     * Gera o ID do pedido de registro de evento
     * Formato: "PRE" + Chave de Acesso NFS-e + Tipo do evento + Número do Pedido de Registro do Evento (nPedRegEvento)
     * Padrão esperado: PRE[0-9]{56} = 59 caracteres total (PRE + 56 dígitos)
     * Como temos: chave (50) + tipo (6) + nPed (3) = 59 dígitos, mas o padrão espera 56
     * A chave de acesso deve ser truncada para 47 dígitos: 47 + 6 + 3 = 56 dígitos
     */
    private gerarIdPedRegEvento(chaveAcesso: string, tipoEvento: TipoEventoNFSe, nPedRegEvento: number): string {
        // Remove todos os caracteres não numéricos da chave de acesso
        const chaveLimpa = chaveAcesso.replace(/\D/g, '');
        // O padrão espera PRE + 56 dígitos = 59 caracteres total
        // Como temos tipo (6) + nPed (3) = 9 dígitos fixos, a chave deve ter 47 dígitos
        // Trunca a chave para 47 dígitos (pega os primeiros 47)
        const chave47 = chaveLimpa.substring(0, 47).padStart(47, '0');
        // Tipo do evento com 6 dígitos
        const tipoEventoStr = tipoEvento.toString().padStart(6, '0');
        // Número do pedido com 3 dígitos
        const nPedRegEventoStr = nPedRegEvento.toString().padStart(3, '0');
        const id = `PRE${chave47}${tipoEventoStr}${nPedRegEventoStr}`;

        // Validação: deve ter exatamente 59 caracteres (PRE + 56 dígitos)
        if (id.length !== 59) {
            logger.warn(`ID do pedido de registro de evento tem tamanho incorreto: ${id.length} (esperado: 59)`, { context: 'gerarIdPedRegEvento', id });
        }

        return id;
    }

    /**
     * Gera o XML do pedido de registro de evento
     */
    private gerarXmlPedRegEvento(pedRegEvento: LayoutPedRegEvento, chaveAcesso: string, tipoEvento: TipoEventoNFSe, nPedRegEvento: number): string {
        // Gera o ID do pedido
        const idPedReg = this.gerarIdPedRegEvento(chaveAcesso, tipoEvento, nPedRegEvento);

        // Monta o objeto XML
        // IMPORTANTE: A ordem dos elementos deve seguir o schema:
        // tpAmb, verAplic, dhEvento, (CNPJAutor ou CPFAutor), chNFSe, (evento específico)
        // Construímos o objeto na ordem correta para garantir que o xml2js respeite a sequência
        const infPedRegObj: any = {
            $: {
                Id: idPedReg
            },
            tpAmb: pedRegEvento.infPedReg.tpAmb,
            verAplic: pedRegEvento.infPedReg.verAplic,
            dhEvento: pedRegEvento.infPedReg.dhEvento
        };

        // Adiciona CNPJ ou CPF do autor (deve vir ANTES de chNFSe)
        if (pedRegEvento.infPedReg.CNPJAutor) {
            infPedRegObj.CNPJAutor = pedRegEvento.infPedReg.CNPJAutor;
        } else if (pedRegEvento.infPedReg.CPFAutor) {
            infPedRegObj.CPFAutor = pedRegEvento.infPedReg.CPFAutor;
        }

        // Adiciona chNFSe (deve vir DEPOIS de CNPJAutor/CPFAutor)
        infPedRegObj.chNFSe = pedRegEvento.infPedReg.chNFSe;

        // Adiciona o evento específico (e101101 para cancelamento)
        if (pedRegEvento.infPedReg.e101101) {
            infPedRegObj.e101101 = {
                xDesc: pedRegEvento.infPedReg.e101101.xDesc,
                cMotivo: pedRegEvento.infPedReg.e101101.cMotivo,
                xMotivo: pedRegEvento.infPedReg.e101101.xMotivo
            };
        } else if (pedRegEvento.infPedReg.e105102) {
            infPedRegObj.e105102 = {
                xDesc: pedRegEvento.infPedReg.e105102.xDesc,
                chNFSeSubst: pedRegEvento.infPedReg.e105102.chNFSeSubst
            };
        }

        // O xml2js.Builder cria o elemento raiz automaticamente a partir do rootTag
        // Então passamos apenas o conteúdo interno com os atributos
        const pedRegEventoObject: any = {
            $: {
                versao: '1.01',
                xmlns: 'http://www.sped.fazenda.gov.br/nfse'
            },
            infPedReg: infPedRegObj
        };

        // Gera o XML (o rootTag 'pedRegEvento' será usado como elemento raiz)
        let xml = this.xmlBuilder.gerarXml(pedRegEventoObject, 'pedRegEvento', this.metodo);

        // Adiciona a declaração XML com encoding UTF-8 se não existir
        if (!xml.trim().startsWith('<?xml')) {
            xml = '<?xml version="1.0" encoding="UTF-8"?>\n' + xml;
        } else {
            xml = xml.replace(/^<\?xml[^>]*\?>/, '<?xml version="1.0" encoding="UTF-8"?>');
        }

        // Assina o XML
        let xmlAssinado = this.xmlBuilder.assinarXML(xml, 'infPedReg');

        // Garante que o XML assinado tenha a declaração UTF-8
        if (!xmlAssinado.trim().startsWith('<?xml')) {
            xmlAssinado = '<?xml version="1.0" encoding="UTF-8"?>\n' + xmlAssinado;
        } else {
            xmlAssinado = xmlAssinado.replace(/^<\?xml[^>]*\?>/, '<?xml version="1.0" encoding="UTF-8"?>');
        }

        return xmlAssinado;
    }

    /**
     * Processa o pedido de registro de evento: monta XML, assina, compacta e codifica
     */
    private processarPedRegEvento(data: NFSeEventoRequest, tipoEvento: TipoEventoNFSe, nPedRegEvento: number = 1): string {
        // Se já foi fornecido o Base64, usa diretamente
        if (data.pedidoRegistroEventoXmlGZipB64) {
            return data.pedidoRegistroEventoXmlGZipB64;
        }

        // Se foi fornecido o JSON, processa
        if (data.pedRegEvento) {
            const xml = this.gerarXmlPedRegEvento(data.pedRegEvento, data.chaveAcesso, tipoEvento, nPedRegEvento);

            // Compacta em GZip
            const xmlGzip = gzipSync(Buffer.from(xml, 'utf-8'));

            // Codifica em Base64
            const xmlGzipB64 = xmlGzip.toString('base64');

            return xmlGzipB64;
        }

        throw new Error('É necessário fornecer pedRegEvento (JSON) ou pedidoRegistroEventoXmlGZipB64 (Base64)');
    }

    protected prepararDados(data?: any): any {
        // Para consulta (GET), não precisa preparar dados
        if (this.metodo.includes('Consultar') || this.getHttpMethod() === 'GET') {
            return null;
        }

        // Para registro de evento (POST), processa os dados
        const eventoData = data as NFSeEventoRequest;

        // Determina o tipo de evento baseado no pedRegEvento
        let tipoEvento: TipoEventoNFSe = TipoEventoNFSe.CANCELAMENTO; // Default
        if (eventoData.pedRegEvento) {
            if (eventoData.pedRegEvento.infPedReg.e101101) {
                tipoEvento = TipoEventoNFSe.CANCELAMENTO;
            } else if (eventoData.pedRegEvento.infPedReg.e105102) {
                tipoEvento = TipoEventoNFSe.CANCELAMENTO_POR_SUBSTITUICAO;
            }
        }

        // Processa o pedido de registro de evento antes de enviar
        this.pedidoRegistroEventoXmlGZipB64 = this.processarPedRegEvento(eventoData, tipoEvento);

        return {
            pedidoRegistroEventoXmlGZipB64: this.pedidoRegistroEventoXmlGZipB64
        };
    }

    /**
     * Método para obter a URL base do webservice
     * Consulta de evento usa a mesma URL base que registro de evento
     */
    protected getWebServiceUrl(): string {
        // Consulta de evento usa a mesma URL base que registro de evento
        const metodoUrl = this.metodo.includes('Consultar') ? 'NFSe_Eventos' : this.metodo;
        return this.utility.getWebServiceUrlNFSe(metodoUrl);
    }

    protected getHttpMethod(): 'GET' | 'POST' | 'PUT' | 'DELETE' {
        if (this.metodo.includes('Consultar')) {
            return 'GET';
        }
        return 'POST';
    }

    protected getUrlPath(data?: any): string {
        if (data && 'tipoEvento' in data && 'numSeqEvento' in data) {
            const eventoData = data as NFSeEventoConsulta;
            return `/${eventoData.chaveAcesso}/eventos/${eventoData.tipoEvento}/${eventoData.numSeqEvento}`;
        }
        if (data && 'chaveAcesso' in data) {
            return `/${(data as NFSeEventoRequest).chaveAcesso}/eventos`;
        }
        return '';
    }

    async RegistrarEvento(data: NFSeEventoRequest): Promise<NFSeEventoResponse> {
        const response = await super.Exec(data) as NFSeEventoResponse;

        // Se a resposta contém evento em base64 gzip, descompacta e salva
        if (response.eventoXmlGZipB64) {
            try {
                const eventoBuffer = Buffer.from(response.eventoXmlGZipB64, 'base64');
                const eventoXml = gunzipSync(eventoBuffer).toString('utf-8');

                // Determina o tipo de evento baseado no pedRegEvento
                let tipoEvento: TipoEventoNFSe = TipoEventoNFSe.CANCELAMENTO; // Default
                if (data.pedRegEvento) {
                    if (data.pedRegEvento.infPedReg.e101101) {
                        tipoEvento = TipoEventoNFSe.CANCELAMENTO;
                    } else if (data.pedRegEvento.infPedReg.e105102) {
                        tipoEvento = TipoEventoNFSe.CANCELAMENTO_POR_SUBSTITUICAO;
                    } else if (data.pedRegEvento.infPedReg.e101103) {
                        tipoEvento = TipoEventoNFSe.SOLICITACAO_CANCELAMENTO_ANALISE_FISCAL;
                    } else if (data.pedRegEvento.infPedReg.e105104) {
                        tipoEvento = TipoEventoNFSe.CANCELAMENTO_DEFERIDO_ANALISE_FISCAL;
                    } else if (data.pedRegEvento.infPedReg.e105105) {
                        tipoEvento = TipoEventoNFSe.CANCELAMENTO_INDEFERIDO_ANALISE_FISCAL;
                    } else if (data.pedRegEvento.infPedReg.e202201) {
                        tipoEvento = TipoEventoNFSe.CONFIRMACAO_PRESTADOR;
                    } else if (data.pedRegEvento.infPedReg.e202205) {
                        tipoEvento = TipoEventoNFSe.REJEICAO_PRESTADOR;
                    } else if (data.pedRegEvento.infPedReg.e203202) {
                        tipoEvento = TipoEventoNFSe.CONFIRMACAO_TOMADOR;
                    } else if (data.pedRegEvento.infPedReg.e203206) {
                        tipoEvento = TipoEventoNFSe.REJEICAO_TOMADOR;
                    }
                }

                // Salva o XML do evento descompactado
                const config = this.environment.getConfig();
                if (config.armazenarXMLAutorizacao && data.chaveAcesso) {
                    const fileName = `${data.chaveAcesso}_evento_${tipoEvento}_${Date.now()}`;

                    // Cria o path com a subpasta do tipo de evento
                    const pathComTipoEvento = `${config.pathXMLAutorizacao}/${tipoEvento}`;

                    this.utility.salvaXML({
                        data: eventoXml,
                        fileName: fileName,
                        metodo: this.metodo,
                        path: pathComTipoEvento,
                    });

                    logger.info('XML do evento salvo com sucesso', {
                        context: 'NFSeEventosService',
                        fileName: fileName,
                        path: pathComTipoEvento,
                        tipoEvento: tipoEvento
                    });
                }
            } catch (error: any) {
                logger.warn('Aviso ao processar XML do evento descompactado', {
                    context: 'NFSeEventosService',
                    message: error.message,
                    note: 'O evento foi registrado com sucesso, mas o XML não pôde ser salvo automaticamente'
                });
            }
        }

        return response;
    }

    async ConsultarEvento(data: NFSeEventoConsulta): Promise<NFSeEventoResponse> {
        // Salva o método original
        const metodoOriginal = this.metodo;
        // Muda temporariamente para consulta
        this.metodo = 'NFSe_ConsultarEvento';
        const response = await super.Exec(data) as NFSeEventoResponse;

        // A consulta retorna um array de eventos com arquivoXml (Base64)
        if (response.eventos && Array.isArray(response.eventos) && response.eventos.length > 0) {
            const config = this.environment.getConfig();

            // Processa cada evento retornado
            for (const evento of response.eventos) {
                if (evento.arquivoXml) {
                    try {
                        // O arquivoXml está em Base64 duplo (Base64 dentro de Base64)
                        // Primeira decodificação: Base64 → string que contém outro Base64
                        const primeiraDecodificacao = Buffer.from(evento.arquivoXml, 'base64').toString('utf-8');

                        // Segunda decodificação: Base64 → buffer GZip
                        const eventoBuffer = Buffer.from(primeiraDecodificacao, 'base64');

                        // Descompacta o GZip para obter o XML
                        const eventoXml = gunzipSync(eventoBuffer).toString('utf-8');

                        // Salva o XML do evento consultado (apenas se estiver configurado)
                        // Eventos de NFSe autorizada devem ser salvos em Autorizacao/NFSe/{tipoEvento}/
                        logger.info('Verificando configuração para salvar XML do evento consultado', {
                            context: 'NFSeEventosService',
                            armazenarXMLAutorizacao: config.armazenarXMLAutorizacao,
                            pathXMLAutorizacao: config.pathXMLAutorizacao,
                            chaveAcesso: evento.chaveAcesso,
                            eventoXmlLength: eventoXml.length
                        });

                        if (config.armazenarXMLAutorizacao && config.pathXMLAutorizacao && evento.chaveAcesso) {
                            const fileName = `${evento.chaveAcesso}_evento_${evento.tipoEvento}_${evento.numeroPedidoRegistroEvento}`;

                            // Cria o path com a subpasta do tipo de evento em Autorizacao/NFSe
                            const pathComTipoEvento = `${config.pathXMLAutorizacao}/${evento.tipoEvento}`;

                            logger.info('Tentando salvar XML do evento consultado', {
                                context: 'NFSeEventosService',
                                fileName: fileName,
                                path: pathComTipoEvento,
                                tipoEvento: evento.tipoEvento,
                                metodo: this.metodo
                            });

                            this.utility.salvaXML({
                                data: eventoXml,
                                fileName: fileName,
                                metodo: this.metodo,
                                path: pathComTipoEvento,
                            });

                            logger.info('XML do evento consultado salvo com sucesso', {
                                context: 'NFSeEventosService',
                                fileName: fileName,
                                path: pathComTipoEvento,
                                tipoEvento: evento.tipoEvento
                            });
                        } else {
                            logger.warn('XML do evento consultado não foi salvo - configuração não permite', {
                                context: 'NFSeEventosService',
                                armazenarXMLAutorizacao: config.armazenarXMLAutorizacao,
                                pathXMLAutorizacao: config.pathXMLAutorizacao,
                                chaveAcesso: evento.chaveAcesso
                            });
                        }
                    } catch (error: any) {
                        logger.error('Erro ao processar XML do evento consultado', {
                            context: 'NFSeEventosService',
                            message: error.message,
                            stack: error.stack,
                            evento: evento
                        });
                    }
                }
            }
        } else if (response.eventoXmlGZipB64) {
            // Fallback: se tiver eventoXmlGZipB64 (formato de registro)
            try {
                const eventoBuffer = Buffer.from(response.eventoXmlGZipB64, 'base64');
                const eventoXml = gunzipSync(eventoBuffer).toString('utf-8');

                const config = this.environment.getConfig();
                // Eventos de NFSe autorizada devem ser salvos em Autorizacao/NFSe/{tipoEvento}/
                if (config.armazenarXMLAutorizacao && config.pathXMLAutorizacao && data.chaveAcesso) {
                    const fileName = `${data.chaveAcesso}_evento_${data.tipoEvento}_${data.numSeqEvento}`;

                    // Cria o path com a subpasta do tipo de evento em Autorizacao/NFSe
                    const pathComTipoEvento = `${config.pathXMLAutorizacao}/${data.tipoEvento}`;

                    this.utility.salvaXML({
                        data: eventoXml,
                        fileName: fileName,
                        metodo: this.metodo,
                        path: pathComTipoEvento,
                    });

                    logger.info('XML do evento consultado salvo com sucesso', {
                        context: 'NFSeEventosService',
                        fileName: fileName,
                        path: pathComTipoEvento,
                        tipoEvento: data.tipoEvento
                    });
                }
            } catch (error: any) {
                logger.error('Erro ao processar XML do evento consultado', {
                    context: 'NFSeEventosService',
                    message: error.message,
                    stack: error.stack
                });
            }
        } else {
            logger.warn('Resposta da consulta não contém eventos ou eventoXmlGZipB64', {
                context: 'NFSeEventosService',
                response: response
            });
        }

        // Restaura o método original após salvar
        this.metodo = metodoOriginal;

        return response;
    }
}

export default NFSeEventosService;
