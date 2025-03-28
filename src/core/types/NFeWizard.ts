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
export type NFeWizardProps = {
    /**
    * @param {obj} dfe - Configurações relacionadas aos processos de DFe
    */
    dfe: {
        /**
         * @param {boolean} baixarXMLDistribuicao - Define se os XMLs retornados pelo método NFeDistribuicaoDFe serão salvos
         */
        baixarXMLDistribuicao?: boolean;
        /**
         * @param {string} pathXMLDistribuicao - Define onde os XMLs retornados pelo método NFeDistribuicaoDFe serão salvos
         */
        pathXMLDistribuicao?: string;
        /**
         * @param {boolean} armazenarXMLAutorizacao - Define se o XML gerado na emissão de NFe deve ser salvo
         */
        armazenarXMLAutorizacao?: boolean;
        /**
         * @param {string} pathXMLAutorizacao - Define onde o XML gerado na emissão de NFe sera salvo
         */
        pathXMLAutorizacao?: string;
        /**
         * @param {boolean} armazenarXMLConsulta - Define se os XMLs de consulta (gerados pela lib) e Retorno (retornados pela SEFAZ) serão salvos
         */
        armazenarXMLConsulta?: boolean;
        /**
         * @param {string} pathXMLConsulta - Define onde os XMLs de consulta (gerados pela lib) e os XML de retorno (retornados pela SEFAZ) serão salvos
         */
        pathXMLConsulta?: string;
        /**
         * @param {boolean} armazenarXMLConsultaComTagSoap - Define se os XMLs de consulta (gerados pela lib) devem ser armazenados com a tag soap
         */
        armazenarXMLConsultaComTagSoap?: boolean;
        /**
         * @param {boolean} armazenarXMLRetorno - Define se os XMLs de consulta (gerados pela lib) e Retorno (retornados pela SEFAZ) serão salvos
         */
        armazenarXMLRetorno?: boolean;
        /**
         * @param {string} pathXMLRetorno - Define onde os XMLs de consulta (gerados pela lib) e os XML de retorno (retornados pela SEFAZ) serão salvos
         */
        pathXMLRetorno?: string;
        /**
         * @param {boolean} armazenarRetornoEmJSON - Define se o retorno da SEFAZ deverá ser salvo em json
         */
        armazenarRetornoEmJSON?: boolean;
        /**
         * @param {string} pathRetornoEmJSON - Define onde o arquivo JSON gerado a partir do retorno da SEFAZ será salvo
         */
        pathRetornoEmJSON?: string;
        /**
         * @param {boolean} incluirTimestampNoNomeDosArquivos - Define se deverão ser incluidos data e hora no fim do nome dos arquivos
         * (Aplicados apenas nos arquivos do XMLRetorno e XMLConsulta)
         */
        incluirTimestampNoNomeDosArquivos?: boolean;
        /**
         * @param {boolean} exibirMarcaDaguaDanfe - Define se a marca d'água de ver ser exibida ou não na DANFE
         */
        exibirMarcaDaguaDanfe?: boolean;
        /**
         * @param {string} pathCertificado - Define de onde o certificado digital será importado
         */
        pathCertificado: string;
        /**
         * @param {string} senhaCertificado - Senha do certificado digital
         */
        senhaCertificado: string;
        /**
         * @param {string} UF - UF da pessoa vinculada ao certificado digital
         */
        UF: string;
        /**
         * @param {string} CPFCNPJ - CPF/CNPJ da pessoa vinculada ao certificado digital
         */
        CPFCNPJ: string;
    };
    /**
    * @param {obj} nfe - Configurações relacionadas aos processos de NFe e NFCe
    */
    nfe: {
        /**
         * @param {number} ambiente - Define o ambiente que receberá os XML da NF-e:
         * 1 = Produção
         * 2 = Homologação
         */
        ambiente: number;
        /**
         * @param {string} versaoDF - Versão (testado apenas com 4.00)
         */
        versaoDF: string;
        /**
         * @param {string} tokenCSC - Código de Segurança do Contribuinte (Utilizado para NFCe)
         */
        tokenCSC?: string;
        /**
         * @param {number} idCSC - Identificador do Código de Segurança do Contribuinte (Utilizado para NFCe)
         */
        idCSC?: number;
    };
    /**
    * @param email -Preencher para casos onde for necessário utilizar envio de e-mail;
    */
    email?: {
        /**
         * @param {string} host - Host SMTP do seu provedor de e-mail
         */
        host: string;
        /**
         * @param {number} port - Porta do servidor SMTP
         */
        port: number;
        /**
         * @param {boolean} secure - true para SSL, false para outros
         */
        secure: boolean;
        /**
         * @param auth - Dados para autenticação no servidor SMTP
         */
        auth: {
            /**
             * @param {string} user - Seu e-mail para autenticação no servidor SMTP
             */
            user: string;
            /**
             * @param {string} pass -  Sua senha para autenticação no servidor SMTP
             */
            pass: string;
        };
        /**
         * @param emailParams -  Dados para enviao do e-mail
         */
        emailParams: {
            /**
             * @param {string} from -  Remetente padrão
             */
            from: string;
            /**
             * @param {string} to -  Destinatário padrão
             */
            to: string;
        };
    };
    /**
    * @param {obj} lib - Permite customização de alguns parametros de execução da lib
    */
    lib?: {
        /**
        * @param {obj} connection -  Define opções de conexão aos webservices da SEFAZ
        */
        connection?: {
            /**
            * @param {obj} timeout -  Define o tempo de espera por um retorno da SEFAZ
            */
            timeout?: number;
        },
        /**
        * @param {obj} log -  Define opções de log
        */
        log?: {
            exibirLogNoConsole?: boolean;
            armazenarLogs?: boolean;
            // pathLogs?: string;
        },
        /**
        * @param {boolean} useOpenSSL -  Define se a lib deve utilizar métodos que fazem uso do OpenSSL ou não
        */
        useOpenSSL?: boolean;
        /**
        * @param {validateSchemaJavaBased | validateSchemaJsBased} useForSchemaValidation - Define se a lib deve utilizar um método de validação de schema
        * baseado em JAVA ou em JS puro.
        * Útil para utilização em ambientes sem JAVA (Ex: Lambda)
        */
        useForSchemaValidation?: 'validateSchemaJavaBased' | 'validateSchemaJsBased';
    };
};