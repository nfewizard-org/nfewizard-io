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
import path from 'path';
import { fileURLToPath } from 'url';


const baseDir = path.dirname(fileURLToPath(import.meta.url))
const dir = process.env.NODE_ENV === 'production' ? '../resources/schemas' : '../resources/schemas/';

/**
 * Efetua a leitura do Schema
 */

interface SchemaProps {
  [key: string]: string;
}

export const getSchema = (metodo: string) => {
  const pathSchemas = path.resolve(baseDir, dir);

  const schema: SchemaProps = {
    NFEStatusServico: `${pathSchemas}/consStatServ_v4.00.xsd`,
    NFEConsultaProtocolo: `${pathSchemas}/consSitNFe_v4.00.xsd`,
    RecepcaoEvento: `${pathSchemas}/envEvento_v1.00.xsd`,
    NFeDistribuicaoDFe: `${pathSchemas}/distDFeInt_v1.01.xsd`,
    NFEAutorizacao: `${pathSchemas}/enviNFe_v4.00.xsd`,
    NFEInutilizacao: `${pathSchemas}/inutNFe_v4.00.xsd`,
    NFERetornoAutorizacao: `${pathSchemas}/consReciNFe_v4.00.xsd`,
  }

  try {
    return {
      basePath: pathSchemas,
      schemaPath: schema[metodo]
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
}