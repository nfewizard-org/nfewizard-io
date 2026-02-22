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

interface ObjProps {
  [key: string]: number;
}

export const getCodIBGE = (UF: string) => {
    const UFs: ObjProps = {
        RO: 11,
        AC: 12,
        AM: 13,
        RR: 14,
        PA: 15,
        AP: 16,
        TO: 17,
        MA: 21,
        PI: 22,
        CE: 23,
        RN: 24,
        PB: 25,
        PE: 26,
        AL: 27,
        SE: 28,
        BA: 29,
        MG: 31,
        ES: 32,
        RJ: 33,
        SP: 35,
        PR: 41,
        SC: 42,
        RS: 43,
        MS: 50,
        MT: 51,
        GO: 52,
        DF: 53,
        AN: 91,
      }
    
    return UFs[UF];
}