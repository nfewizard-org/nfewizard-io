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

export type GenericObject = Record<string, any>;

export interface SoapMethod {
    [key: string]: {
        method: string;
        action: string;
    };
}


export interface ServicesUrl {
    [key: string]: {
        [key: string]: string
    };
}

export interface NFeServicosUrlType {
    [estado: string]: {
        [servico: string]: string;
    };
}

export interface SaveXMLProps {
    data: any;
    fileName: string;
    metodo: string;
    path: string | undefined;
}
export interface SaveJSONProps {
    data: any;
    fileName: string;
    metodo: string;
    path: string | undefined;
}