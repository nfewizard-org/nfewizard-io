// @ts-nocheck
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
import { generateKeyPairSync, createVerify } from 'crypto';
import { gerarQrCodeCTe } from '../CTeQrCode';
import { tpEmisDaChave, chaveEmSvc } from '../CTeContingencia';

const CHAVE = '41240111222333000181570010000000011123456782';

describe('gerarQrCodeCTe', () => {
    it('monta URL com chCTe e tpAmb na emissão normal', () => {
        expect(gerarQrCodeCTe({ url: 'https://dfe-portal.svrs.rs.gov.br/cte/qrCode', chCTe: CHAVE, tpAmb: 1 }))
            .toBe(`https://dfe-portal.svrs.rs.gov.br/cte/qrCode?chCTe=${CHAVE}&tpAmb=1`);
    });

    it('acrescenta sign (RSA-SHA1 Base64 da chave) quando há chave privada', () => {
        const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
        const pem = privateKey.export({ type: 'pkcs8', format: 'pem' }) as string;

        const qr = gerarQrCodeCTe({ url: 'https://x/qrcode', chCTe: CHAVE, tpAmb: 2, privateKey: pem });
        const sign = qr.split('&sign=')[1];

        expect(qr.startsWith(`https://x/qrcode?chCTe=${CHAVE}&tpAmb=2&sign=`)).toBe(true);
        expect(createVerify('RSA-SHA1').update(CHAVE).verify(publicKey, sign, 'base64')).toBe(true);
    });
});

describe('CTeContingencia', () => {
    it('lê o tpEmis da chave e identifica SVC', () => {
        expect(tpEmisDaChave(CHAVE)).toBe(1);
        const svc = CHAVE.substring(0, 34) + '8' + CHAVE.substring(35);
        expect(tpEmisDaChave(svc)).toBe(8);
        expect(chaveEmSvc(svc)).toBe(true);
        expect(chaveEmSvc(CHAVE)).toBe(false);
    });
});
