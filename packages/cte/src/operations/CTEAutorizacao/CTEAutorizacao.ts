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
import { CTEAutorizacaoServiceImpl } from '@nfewizard/types/shared';

class CTEAutorizacao implements CTEAutorizacaoServiceImpl {
    cteAutorizacaoService: CTEAutorizacaoServiceImpl;
    constructor(cteAutorizacaoService: CTEAutorizacaoServiceImpl) {
        this.cteAutorizacaoService = cteAutorizacaoService;
    }

    async Exec(data?: any): Promise<any> {
        return await this.cteAutorizacaoService.Exec(data);
    }

    async ExecTransmitirContingencia(data?: any): Promise<any> {
        if (!this.cteAutorizacaoService.ExecTransmitirContingencia) {
            throw new Error('Método ExecTransmitirContingencia não implementado no serviço de autorização CT-e.');
        }
        return await this.cteAutorizacaoService.ExecTransmitirContingencia(data);
    }
}

export { CTEAutorizacao };
