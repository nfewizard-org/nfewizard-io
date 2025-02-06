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
import { COFINS, ICMS, PIS, dadosCOFINS, dadosICMS, dadosPIS } from 'src/core/types';

function filterFieldsByType<T extends object>(source: any, requiredFields: (keyof T)[]): Partial<T> {
    const result: Partial<T> = {};
    for (const key of requiredFields) {
        if (key in source) {
            if (source[key] !== '')
                result[key] = source[key];
        }
    }
    return result;
}

const COFINSMap: { [key: string]: keyof COFINS } = {
    '01': 'COFINSAliq',
    '02': 'COFINSAliq',
    '03': 'COFINSQtde',
    '04': 'COFINSNT',
    '05': 'COFINSNT',
    '06': 'COFINSNT',
    '07': 'COFINSNT',
    '08': 'COFINSNT',
    '09': 'COFINSNT',
    '49': 'COFINSOutr',
    '50': 'COFINSOutr',
    '51': 'COFINSOutr',
    '52': 'COFINSOutr',
    '53': 'COFINSOutr',
    '54': 'COFINSOutr',
    '55': 'COFINSOutr',
    '56': 'COFINSOutr',
    '60': 'COFINSOutr',
    '61': 'COFINSOutr',
    '62': 'COFINSOutr',
    '63': 'COFINSOutr',
    '64': 'COFINSOutr',
    '65': 'COFINSOutr',
    '66': 'COFINSOutr',
    '67': 'COFINSOutr',
    '70': 'COFINSOutr',
    '71': 'COFINSOutr',
    '72': 'COFINSOutr',
    '73': 'COFINSOutr',
    '74': 'COFINSOutr',
    '75': 'COFINSOutr',
    '98': 'COFINSOutr',
    '99': 'COFINSOutr',
};

const PISMap: { [key: string]: keyof PIS } = {
    '01': 'PISAliq',
    '02': 'PISAliq',
    '03': 'PISQtde',
    '04': 'PISNT',
    '05': 'PISNT',
    '06': 'PISNT',
    '07': 'PISNT',
    '08': 'PISNT',
    '09': 'PISNT',
    '49': 'PISOutr',
    '50': 'PISOutr',
    '51': 'PISOutr',
    '52': 'PISOutr',
    '53': 'PISOutr',
    '54': 'PISOutr',
    '55': 'PISOutr',
    '56': 'PISOutr',
    '60': 'PISOutr',
    '61': 'PISOutr',
    '62': 'PISOutr',
    '63': 'PISOutr',
    '64': 'PISOutr',
    '65': 'PISOutr',
    '66': 'PISOutr',
    '67': 'PISOutr',
    '70': 'PISOutr',
    '71': 'PISOutr',
    '72': 'PISOutr',
    '73': 'PISOutr',
    '74': 'PISOutr',
    '75': 'PISOutr',
    '98': 'PISOutr',
    '99': 'PISOutr',
};

const ICMSMap: { [key: string]: keyof ICMS } = {
    '00': 'ICMS00',
    '02': 'ICMS02',
    '10': 'ICMS10',
    '20': 'ICMS20',
    '30': 'ICMS30',
    '40': 'ICMS40',
    '41': 'ICMS40',
    '50': 'ICMS40',
    '51': 'ICMS51',
    '60': 'ICMS60',
    '70': 'ICMS70',
    '90': 'ICMS90',
    '101': 'ICMSSN101',
    '102': 'ICMSSN102',
    '103': 'ICMSSN102',
    '201': 'ICMSSN201',
    '202': 'ICMSSN202',
    '203': 'ICMSSN202',
    '500': 'ICMSSN500',
    '900': 'ICMSSN900',
};

export const mountCOFINS = (cofins: dadosCOFINS) => {
    const { CST } = cofins;
    const cst_cofins = CST;

    let cofinsKey = COFINSMap[CST]
    if (!cofinsKey) {
        console.warn(`Código de situação tributária do COFINS ${cst_cofins} não é reconhecido. Alterado para padrão 'COFINSAliq'.`);
        cofinsKey = 'COFINSAliq';
    }

    // const cofins = {
    //     CST: cst_cofins,
    //     vBC: 0, // No ERP  - nf_item.val_base_cofins   
    //     pCOFINS: 0, // No ERP - nf_item.per_cofins
    //     vCOFINS: 0, // No ERP - nf_item.val_cofins
    //     qBCProd: 0, // No ERP -- Fixo Vazio
    //     vAliqProd: 0, // No ERP -- Fixo Vazio
    // }

    const requiredFields = {
        COFINSAliq: ['CST', 'vBC', 'pCOFINS', 'vCOFINS'],
        COFINSQtde: ['CST', 'qBCProd', 'vAliqProd', 'vCOFINS'],
        COFINSNT: ['CST'],
        COFINSOutr: ['CST', 'vBC', 'pCOFINS', 'qBCProd', 'vAliqProd', 'vCOFINS'],
    };

    if (cofinsKey in requiredFields) {
        const required = requiredFields[cofinsKey as keyof typeof requiredFields];

        const cofinsProperties = filterFieldsByType(cofins, required);

        const cofinsObject: COFINS = { [cofinsKey]: cofinsProperties } as COFINS;

        return cofinsObject;
    }

    console.warn(`Chave COFINS '${cofinsKey}' não reconhecida.`);
    return {} as COFINS;
}

export const mountPIS = (pis: dadosPIS): PIS => {
    const { CST } = pis;
    const cst_pis = CST;

    let pisKey = PISMap[cst_pis]
    if (!pisKey) {
        console.warn(`Código de situação tributária do PIS ${cst_pis} não é reconhecido. Alterado para padrão 'PISAliq'.`);
        pisKey = 'PISAliq';
    }

    const requiredFields = {
        PISAliq: ['CST', 'vBC', 'pPIS', 'vPIS'],
        PISQtde: ['CST', 'qBCProd', 'vAliqProd', 'vPIS'],
        PISNT: ['CST'],
        PISOutr: ['CST', 'vBC', 'pPIS', 'qBCProd', 'vAliqProd', 'vPIS'],
    };

    if (pisKey in requiredFields) {
        const required = requiredFields[pisKey as keyof typeof requiredFields];

        const pisProperties = filterFieldsByType(pis, required);

        const pisObject: PIS = { [pisKey]: pisProperties } as PIS;

        return pisObject;
    }

    console.warn(`Chave PIS '${pisKey}' não reconhecida.`);
    return {} as PIS;
}

export const mountICMS = (icms: dadosICMS): ICMS => {
    const { CST } = icms;
    const cod_sit_trib = CST.length > 2 ? CST.substring(1, 3) : CST;

    let icmsKey = ICMSMap[cod_sit_trib];
    if (!icmsKey) {
        console.warn(`Código de situação tributária ${cod_sit_trib} não é reconhecido. Alterado para padrão 'ICMS00'.`);
        icmsKey = 'ICMS00';
    }

    const requiredFields = {
        ICMS00: ['orig', 'CST', 'modBC', 'vBC', 'pICMS', 'vICMS', 'pFCP', 'vFCP'],
        ICMS02: ['orig', 'CST', 'qBCMono', 'adRemICMS', 'vICMSMono'],
        ICMS10: ['orig', 'CST', 'modBC', 'vBC', 'pICMS', 'vICMS', 'vBCFCP', 'pFCP', 'modBCST', 'pMVAST', 'pRedBCST', 'vBCST', 'pICMSST', 'vICMSST', 'vICMSSTDeson', 'motDesICMSST'],
        ICMS15: ['orig', 'CST', 'qBCMono', 'adRemICMS', 'vICMSMono', 'qBCMonoReten', 'adRemICMSReten', 'vICMSMonoReten', 'pRedAdRem', 'motRedAdRem'],
        ICMS20: ['orig', 'CST', 'modBC', 'pRedBC', 'vBC', 'pICMS', 'vICMS', 'vBCFCP', 'pFCP', 'vICMSDeson', 'motDesICMS', 'indDeduzDeson'],
        ICMS30: ['orig', 'CST', 'modBCST', 'pMVAST', 'pRedBCST', 'vBCST', 'pICMSST', 'vICMSST', 'vBCFCPST', 'pFCPST', 'vFCPST', 'vICMSDeson', 'motDesICMS', 'indDeduzDeson'],
        ICMS40: ['orig', 'CST', 'vICMSDeson', 'motDesICMS', 'indDeduzDeson'],
        ICMS41: ['orig', 'CST', 'vICMSDeson', 'motDesICMS', 'indDeduzDeson'],
        ICMS50: ['orig', 'CST', 'vICMSDeson', 'motDesICMS', 'indDeduzDeson'],
        ICMS51: ['orig', 'CST', 'modBC', 'pRedBC', 'vBC', 'pICMS', 'vICMS', 'vICMSOp', 'pDif', 'vICMSDif'],
        ICMS53: ['orig', 'CST', 'qBCMono', 'adRemICMS', 'vICMSMonoOp', 'pDif', 'vICMSMonoDif', 'vICMSMono', 'qBCMonoDif', 'adRemICMSDif'],
        ICMS60: ['orig', 'CST', 'vBCSTRet', 'pST', 'vICMSSubstituto', 'vICMSSTRet', 'vBCFCPSTRet', 'pFCPSTRet', 'vFCPSTRet', 'pRedBCEfet', 'vBCEfet', 'pICMSEfet', 'vICMSEfet'],
        ICMS61: ['orig', 'CST', 'qBCMonoRet', 'adRemICMSRet', 'vICMSMonoRet'],
        ICMS70: ['orig', 'CST', 'modBC', 'pRedBC', 'vBC', 'pICMS', 'vICMS', 'vBCST', 'pICMSST', 'vICMSST', 'vICMSDeson', 'motDesICMS', 'indDeduzDeson', 'modBCST', 'pMVAST', 'pRedBCST'],
    
        ICMS90: ['orig', 'CST', 'modBC', 'vBC', 'pRedBC', 'pICMS', 'vICMS', 'vBCFCP', 'pFCP', 'vFCP', 'modBCST', 'pMVAST', 'pRedBCST', 'vBCST', 'pICMSST', 'vICMSST', 'vBCFCPST', 'pFCPST', 'vFCPST', 'vICMSDeson', 'motDesICMS', 'indDeduzDeson'],
        
        ICMSPart: ['orig', 'CST', 'modBC', 'vBC', 'pRedBC', 'pICMS', 'vICMS', 'modBCST', 'pMVAST', 'pRedBCST', 'vBCST', 'pICMSST', 'vICMSST', 'pBCOp', 'UFST', 'vBCFCPST', 'pFCPST', 'vFCPST'],
        ICMSST: ['orig', 'CST', 'vBCSTRet', 'pST', 'vICMSSubstituto', 'vICMSSTRet', 'vBCFCPSTRet', 'pFCPSTRet', 'vFCPSTRet', 'vBCSTDest', 'vICMSSTDest'],
        ICMSSN101: ['orig', 'CSOSN', 'pCredSN', 'vCredICMSSN'],
        ICMSSN102: ['orig', 'CSOSN'],
        ICMSSN201: ['orig', 'CSOSN', 'modBCST', 'pMVAST', 'pRedBCST', 'vBCST', 'pICMSST', 'vICMSST', 'pFCPST', 'vFCPST'],
        ICMSSN202: ['orig', 'CSOSN', 'modBCST', 'pMVAST', 'pRedBCST', 'vBCST', 'pICMSST', 'vICMSST', 'vFCPST', 'vBCFCPST', 'pFCPST'],
        ICMSSN500: ['orig', 'CSOSN', 'vBCSTRet', 'pST', 'vICMSSubstituto', 'vICMSSTRet', 'vBCFCPSTRet', 'pFCPSTRet', 'vFCPSTRet', 'pRedBCEfet', 'vBCEfet', 'pICMSEfet', 'vICMSEfet'],
        ICMSSN900: ['orig', 'CSOSN', 'modBC', 'vBC', 'pRedBC', 'pICMS', 'vICMS', 'modBCST', 'pMVAST', 'pRedBCST', 'vBCST', 'pICMSST', 'vICMSST', 'vBCFCPST', 'pFCPST', 'vFCPST', 'pCredSN', 'vCredICMSSN'],
    };

    if (icmsKey in requiredFields) {
        // Obtém os campos obrigatórios para o tipo ICMS
        const required = requiredFields[icmsKey as keyof typeof requiredFields];

        // Filtra as propriedades do item de acordo com os campos obrigatórios do tipo ICMS
        const icmsProperties = filterFieldsByType(icms, required);
        // Monta o objeto ICMS usando a chave dinâmica e as propriedades filtradas
        const icmsObject: ICMS = { [icmsKey]: icmsProperties } as ICMS;

        return icmsObject;
    }

    console.warn(`Chave ICMS '${icmsKey}' não reconhecida.`);
    return {} as ICMS;

}

