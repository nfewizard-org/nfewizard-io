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
import { DistribuicaoHandler } from '../DistribuicaoHandler.js';

describe('CTEDistribuicaoDFe - file naming', () => {
    const makeHandler = () => {
        const environment = { config: { dfe: {} } } as any;
        const utility = {} as any;
        return new DistribuicaoHandler(environment, utility, 'CTeDistribuicaoDFe');
    };

    it('should build unique names for res, proc and event using NSU', () => {
        const handler = makeHandler() as any;

        expect(handler.buildFileName('35123456789012345678901234567890123456789012', 'res', '000000000000001', '')).toBe('35123456789012345678901234567890123456789012-res-000000000000001');
        expect(handler.buildFileName('35123456789012345678901234567890123456789012', 'proc', '000000000000002', '')).toBe('35123456789012345678901234567890123456789012-proc-000000000000002');
        expect(handler.buildFileName('35123456789012345678901234567890123456789012', 'event', '000000000000003', '110110')).toBe('35123456789012345678901234567890123456789012-event-110110-000000000000003');
    });

    it('should fallback to deterministic index NSU when NSU is not available', () => {
        const handler = makeHandler() as any;

        expect(handler.getDocNsu({ $: { NSU: '' } }, 11)).toBe('idx-11');
        expect(handler.getDocNsu({}, 5)).toBe('idx-5');
    });

    it('should sanitize invalid filename characters and keep output stable', () => {
        const handler = makeHandler() as any;

        expect(handler.buildFileName('35/123', 'event', '0001', '110/110')).toBe('35_123-event-110_110-0001');
        expect(handler.buildFileName('', 'proc', '', '')).toBe('sem-chave-proc-sem-nsu');
    });
});
