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

import { Utility } from '@nfewizard/shared';
import { createSign } from 'crypto';

export function generateQRCodeURLOnline(
    chaveAcesso: string,
    tipoAmbiente: number,
    utility: Utility
): string {
    const urlQRCode = utility.getUrlNFCe('URL-QRCode', false, '');

    return `${urlQRCode}?p=${chaveAcesso.replace('NFe', '')}|3|${tipoAmbiente}`;
}

export function generateQRCodeURLOffline(
    chaveAcesso: string,
    tipoAmbiente: number,
    diaDataEmissao: string,
    valorTotalNFe: string,
    tpIdDest: string,
    idDest: string,
    privateKey: string,
    utility: Utility
): string {
    const urlQRCode = utility.getUrlNFCe('URL-QRCode', false, '');

    const parametros = `${chaveAcesso.replace('NFe', '')}|3|${tipoAmbiente}|${diaDataEmissao}|${valorTotalNFe}|${tpIdDest}|${idDest}`;

    const assinatura = createSign('RSA-SHA1').update(parametros).sign(privateKey, 'base64');

    return `${urlQRCode}?p=${parametros}|${assinatura}`;
}
