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
  
export const getDesTipoPag = (tPag: string) => {
    const sefazPagamento: { [key: string]: string } = {
        '01': 'Dinheiro',
        '02': 'Cheque',
        '03': 'Cartão de Crédito',
        '04': 'Cartão de Débito',
        '05': 'Cartão da Loja (Private Label), Crediário Digital, Outros Crediários',
        '10': 'Vale Alimentação',
        '11': 'Vale Refeição',
        '12': 'Vale Presente',
        '13': 'Vale Combustível',
        '14': 'Duplicata Mercantil',
        '15': 'Boleto Bancário',
        '16': 'Depósito Bancário',
        '17': 'Pagamento Instantâneo (PIX) - Dinâmico',
        '18': 'Transferência bancária, Carteira Digital',
        '19': 'Programa de fidelidade, Cashback, Crédito Virtual',
        '20': 'Pagamento Instantâneo (PIX) - Estático',
        '21': 'Crédito em Loja',
        '22': 'Pagamento Eletrônico não Informado - falha de hardware do sistema emissor',
        '90': 'Sem Pagamento',
        '99': 'Outros'
      };
    
      return sefazPagamento[tPag] || 'Outros';
  }