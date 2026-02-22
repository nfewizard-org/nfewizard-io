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
import { Environment } from '@nfewizard/shared';
import { Utility } from '@nfewizard/shared';
import { XmlBuilder } from '@nfewizard/shared';
import { AxiosInstance } from 'axios';
import NFERecepcaoEventoService from './NFERecepcaoEventoService.js';
import { SaveFilesImpl, GerarConsultaImpl } from '@nfewizard/types/shared';

export class NFEOperacaoNaoRealizadaService extends NFERecepcaoEventoService {
    constructor(environment: Environment, utility: Utility, xmlBuilder: XmlBuilder, axios: AxiosInstance, saveFiles: SaveFilesImpl, gerarConsulta: GerarConsultaImpl) {
        super(environment, utility, xmlBuilder, axios, saveFiles, gerarConsulta);
    }
}

export default NFEOperacaoNaoRealizadaService;