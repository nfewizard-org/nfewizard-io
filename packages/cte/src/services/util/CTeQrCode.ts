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
import { createSign } from 'crypto';

export interface QrCodeCTeProps {
    /** Endereço de consulta do autorizador (`CTeQrCode_4.00` em CTeServicosUrl.json) */
    url: string;
    chCTe: string;
    tpAmb: number | string;
    /** Chave privada do certificado que assina o CT-e. Se informada, acrescenta `sign` (obrigatório em contingência FS-DA/EPEC). */
    privateKey?: string | Buffer;
}

/**
 * Monta o texto do QR Code do CT-e (`infCTeSupl/qrCodCTe`):
 * `<url>?chCTe=<chave>&tpAmb=<1|2>[&sign=<RSA-SHA1 Base64 da chave>]`.
 */
export function gerarQrCodeCTe({ url, chCTe, tpAmb, privateKey }: QrCodeCTeProps): string {
    const base = `${url}?chCTe=${chCTe}&tpAmb=${tpAmb}`;
    if (!privateKey) return base;

    const sign = createSign('RSA-SHA1').update(chCTe).sign(privateKey, 'base64');
    return `${base}&sign=${sign}`;
}
