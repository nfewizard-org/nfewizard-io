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

import { NFeWizardProps } from '../shared/NFeWizardProps.js';

/**
 * Configuração para NFSeWizard.
 * Herda toda a estrutura de NFeWizardProps (dfe, email, lib), exceto o bloco
 * de parametrização do documento fiscal: aqui a chave é "nfse" (em vez de
 * "nfe", usada por NFe/NFCe), pois é o nome mais adequado ao contexto deste pacote.
 */
export type NFSeConfig = Omit<NFeWizardProps, 'nfe'> & {
    /**
     * @param {obj} nfse - Configurações relacionadas ao processo de NFSe
     */
    nfse: {
        /**
         * @param {number} ambiente - Define o ambiente que receberá o DPS:
         * 1 = Produção
         * 2 = Homologação
         */
        ambiente: number;
        /**
         * @param {string} versao - Versão do aplicativo emissor (verAplic)
         */
        versao?: string;
    };
};
