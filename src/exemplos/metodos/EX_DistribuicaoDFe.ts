/*
 * This file is part of NFeWizard.
 * 
 * NFeWizard is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * NFeWizard is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with NFeWizard. If not, see <https://www.gnu.org/licenses/>.
 */
import NFeWizard from '@Classes/NFeWizard';
import { ConsultaNFe, DFePorChaveNFe, DFePorNSU, DFePorUltimoNSU } from '@Protocols/Controllers';


const callnfeWizard = async () => {
    const nfeWizard = new NFeWizard();

    // Inicializa a Lib
    await nfeWizard.NFE_LoadEnvironment({
        config: {
            dfe: {
                baixarXMLDistribuicao: true,
                pathXMLDistribuicao: "tmp/DistribuicaoDFe",
                armazenarXMLAutorizacao: true,
                pathXMLAutorizacao: "tmp/Autorizacao",
                armazenarXMLRetorno: true,
                pathXMLRetorno: "tmp/RequestLogs",
                armazenarXMLConsulta: true,
                pathXMLConsulta: "tmp/RequestLogs",
                armazenarXMLConsultaComTagSoap: false,
                armazenarRetornoEmJSON: true,
                pathRetornoEmJSON: "tmp/DistribuicaoDFe",

                pathCertificado: "certificado.pfx",
                senhaCertificado: "123456",
                UF: "SP",
                CPFCNPJ: "99999999999999",
            },
            nfe: {
                ambiente: 2,
                versaoDF: "4.00",
            },
        }
    });

    /**
     * Método Geral
     */
    const ultimoNSU: ConsultaNFe = {
        cUFAutor: 35,
        CNPJ: '99999999999999',
        distNSU: {
            ultNSU: '000000000000001'
        },
    }
    await nfeWizard.NFE_DistribuicaoDFe(ultimoNSU);

    const nsu: ConsultaNFe = {
        cUFAutor: 35,
        CNPJ: '99999999999999',
        consNSU: {
            NSU: '000000000001186'
        },
    }
    await nfeWizard.NFE_DistribuicaoDFe(nsu);

    const chaveNFe: ConsultaNFe = {
        cUFAutor: 35,
        CNPJ: '99999999999999',
        consChNFe: {
            chNFe: '99999999999999999999999999999999999999999999'
        },
    }
    await nfeWizard.NFE_DistribuicaoDFe(chaveNFe);

    /**
     * Métodos individuais
     */

    /** DFe Por Ultimo NSU */
    const ultimoNSU_2: DFePorUltimoNSU = {
        cUFAutor: 35,
        CNPJ: '99999999999999',
        distNSU: {
            ultNSU: '000000000000001'
        },
    }
    await nfeWizard.NFE_DistribuicaoDFePorUltNSU(ultimoNSU_2);

    /** DFe Por NSU */
    const nsu_2: DFePorNSU = {
        cUFAutor: 35,
        CNPJ: '99999999999999',
        consNSU: {
            NSU: '000000000001186'
        },
    }
    await nfeWizard.NFE_DistribuicaoDFePorNSU(nsu_2);

    /** DFe Por Chave */
    const chaveNFe_2: DFePorChaveNFe = {
        cUFAutor: 35,
        CNPJ: '99999999999999',
        consChNFe: {
            chNFe: '99999999999999999999999999999999999999999999'
        },
    }
    await nfeWizard.NFE_DistribuicaoDFePorChave(chaveNFe_2);

}

callnfeWizard();