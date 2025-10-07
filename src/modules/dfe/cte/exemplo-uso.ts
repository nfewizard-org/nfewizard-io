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

/**
 * Exemplo de uso do serviço CTEDistribuicaoDFe
 * 
 * Este arquivo demonstra como utilizar o serviço de distribuição de CTe
 * nas diferentes modalidades disponíveis.
 * 
 * NOTA: Este é um arquivo de exemplo. Ajuste as configurações conforme sua implementação.
 */

// @ts-nocheck - Arquivo de exemplo, não incluído no build

import Environment from '@Modules/environment/Environment.js';
import Utility from '@Utils/Utility.js';
import XmlBuilder from '@Adapters/XmlBuilder.js';
import axios from 'axios';
import { SaveFilesImpl, GerarConsultaImpl } from '@Interfaces';
import CTEDistribuicaoDFe from './operations/CTEDistribuicaoDFe/CTEDistribuicaoDFe.js';
import CTEDistribuicaoDFePorNSU from './operations/CTEDistribuicaoDFe/CTEDistribuicaoDFePorNSU.js';
import CTEDistribuicaoDFePorUltNSU from './operations/CTEDistribuicaoDFe/CTEDistribuicaoDFePorUltNSU.js';

// Exemplo de configuração (ajustar conforme necessário)
const config = {
    dfe: {
        UF: 'SP',
        ambiente: 2, // 1=Produção, 2=Homologação
        pathXMLDistribuicao: './tmp/DistribuicaoDFe',
        baixarXMLDistribuicao: true,
        armazenarRetornoEmJSON: true,
    },
    nfe: {
        ambiente: 2,
    }
};

/**
 * Exemplo 1: Consulta por último NSU
 * 
 * Este método consulta todos os documentos disponíveis a partir do último NSU conhecido.
 * É útil para sincronização incremental de documentos.
 */
async function exemploPorUltNSU() {
    const environment = new Environment(config);
    const utility = new Utility(environment);
    const xmlBuilder = new XmlBuilder();
    
    // Instancias dos serviços necessários (ajustar conforme implementação)
    const saveFiles: SaveFilesImpl = {} as SaveFilesImpl;
    const gerarConsulta: GerarConsultaImpl = {} as GerarConsultaImpl;
    
    const service = new CTEDistribuicaoDFePorUltNSU(
        environment,
        utility,
        xmlBuilder,
        axios,
        saveFiles,
        gerarConsulta
    );
    
    const cteDistribuicao = new CTEDistribuicaoDFe(service);
    
    try {
        const resultado = await cteDistribuicao.Exec({
            cUFAutor: '35', // UF do autor (35 = São Paulo)
            CNPJ: '12345678901234', // CNPJ do interessado
            distNSU: {
                ultNSU: '000000000000000' // Último NSU conhecido (zeros para primeiro acesso)
            }
        });
        
        console.log('Resultado da consulta por último NSU:');
        console.log('Mensagem:', resultado.xMotivo);
        console.log('Arquivos processados:', resultado.filesList);
        console.log('Dados:', resultado.data);
    } catch (error) {
        console.error('Erro ao consultar por último NSU:', error);
    }
}

/**
 * Exemplo 2: Consulta por NSU específico
 * 
 * Este método consulta um documento através de seu NSU específico.
 * Útil para recuperar documentos individuais quando você tem o NSU.
 * 
 * NOTA: O CTe NÃO possui consulta por chave de acesso na distribuição DFe,
 * apenas por NSU, conforme norma técnica.
 */
async function exemploPorNSU() {
    const environment = new Environment(config);
    const utility = new Utility(environment);
    const xmlBuilder = new XmlBuilder();
    
    const saveFiles: SaveFilesImpl = {} as SaveFilesImpl;
    const gerarConsulta: GerarConsultaImpl = {} as GerarConsultaImpl;
    
    const service = new CTEDistribuicaoDFePorNSU(
        environment,
        utility,
        xmlBuilder,
        axios,
        saveFiles,
        gerarConsulta
    );
    
    const cteDistribuicao = new CTEDistribuicaoDFe(service);
    
    try {
        const resultado = await cteDistribuicaoDFe.Exec({
            cUFAutor: '35',
            CNPJ: '12345678901234',
            consNSU: {
                NSU: '000000000000123' // NSU específico
            }
        });
        
        console.log('Resultado da consulta por NSU:');
        console.log('Mensagem:', resultado.xMotivo);
        console.log('Arquivos processados:', resultado.filesList);
        console.log('Dados:', resultado.data);
    } catch (error) {
        console.error('Erro ao consultar por NSU:', error);
    }
}

/**
 * Códigos de retorno comuns
 * 
 * 137 - Nenhum documento localizado
 * 138 - Documento localizado
 * 656 - Consulta a ser processada
 */

// Descomentar para testar
// exemploPorUltNSU();
// exemploPorNSU();

export {
    exemploPorUltNSU,
    exemploPorNSU
};

/**
 * Exemplo 3: Consulta por NSU específico
 * 
 * Este método consulta um documento através de seu NSU específico.
 * Útil para recuperar documentos individuais quando você tem o NSU.
 */
async function exemploPorNSU() {
    const environment = new Environment(config);
    const utility = new Utility(environment);
    const xmlBuilder = new XmlBuilder();
    
    const saveFiles: SaveFilesImpl = {} as SaveFilesImpl;
    const gerarConsulta: GerarConsultaImpl = {} as GerarConsultaImpl;
    
    const service = new CTEDistribuicaoDFePorNSU(
        environment,
        utility,
        xmlBuilder,
        axios,
        saveFiles,
        gerarConsulta
    );
    
    const cteDistribuicao = new CTEDistribuicaoDFe(service);
    
    try {
        const resultado = await cteDistribuicao.Exec({
            cUFAutor: '35',
            CNPJ: '12345678901234',
            consNSU: {
                NSU: '000000000000123' // NSU específico
            }
        });
        
        console.log('Resultado da consulta por NSU:');
        console.log('Mensagem:', resultado.xMotivo);
        console.log('Arquivos processados:', resultado.filesList);
        console.log('Dados:', resultado.data);
    } catch (error) {
        console.error('Erro ao consultar por NSU:', error);
    }
}

/**
 * Códigos de retorno comuns
 * 
 * 137 - Nenhum documento localizado
 * 138 - Documento localizado
 * 656 - Consulta a ser processada
 */

// Descomentar para testar
// exemploPorUltNSU();
// exemploPorChave();
// exemploPorNSU();

export {
    exemploPorUltNSU,
    exemploPorChave,
    exemploPorNSU
};
