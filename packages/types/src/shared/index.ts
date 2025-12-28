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

export * from './Utils.js';
export * from './LoadCertificate.js';

// Export NFeWizardImpl interface
export type { NFeWizardImpl } from './NFeWizardImpl.js';

// Service implementation interfaces (stubs for now)
export interface SaveFilesImpl { salvaArquivos(...args: any[]): void; }
export interface GerarConsultaImpl { gerarConsulta(...args: any[]): Promise<any>; }
export interface HttpClient { get(...args: any[]): Promise<any>; post(...args: any[]): Promise<any>; }
export interface HttpClientConfig { [key: string]: any; }
export interface NFeWizardServiceImpl { [key: string]: any; }
export interface NFEAutorizacaoServiceImpl { Exec(...args: any[]): Promise<any>; }
export interface NFEconsultaProtocoloServiceImpl { Exec(...args: any[]): Promise<any>; }
export interface NFEDistribuicaoDFeServiceImpl { Exec(...args: any[]): Promise<any>; }
export interface NFEInutilizacaoServiceImpl { Exec(...args: any[]): Promise<any>; }
export interface NFERecepcaoEventoServiceImpl { Exec(...args: any[]): Promise<any>; }
export interface NFERetornoAutorizacaoServiceImpl { Exec(...args: any[]): Promise<any>; }
export interface NFEStatusServicoServiceImpl { Exec(...args: any[]): Promise<any>; }
export interface NFCEAutorizacaoServiceImpl { Exec(...args: any[]): Promise<any>; }
export interface NFCERetornoAutorizacaoServiceImpl { getXmlRetorno(...args: any[]): Promise<any>; }
export interface CTEDistribuicaoDFeServiceImpl { Exec(...args: any[]): Promise<any>; }
