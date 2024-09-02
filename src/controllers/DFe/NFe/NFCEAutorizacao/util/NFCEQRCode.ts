import { createHash } from 'crypto';

// Função para gerar o hash SHA-1 em formato hexadecimal
function generateSHA1Hash(input: string): string {
    return createHash('sha1').update(input).digest('hex');
}

// Função para gerar a URL do QR Code para emissão ONLINE
export function generateQRCodeURLOnline(
    chaveAcesso: string,
    versaoQRCode: string,
    tipoAmbiente: number,
    identificadorCSC: number,
    csc: string
): string {
    // Passo 1: Concatenar parâmetros
    chaveAcesso = chaveAcesso.replace('NFe', '');
    const baseString = `${chaveAcesso}|${versaoQRCode}|${tipoAmbiente}|${identificadorCSC}`;

    // Passo 2: Adicionar o CSC
    const stringToHash = `${baseString}${csc}`; // Sem o separador pipe antes do CSC
    
    // Passo 3: Gerar o hash
    const codigoHash = generateSHA1Hash(stringToHash);
    
    // Montar a URL final
    return `https://www.homologacao.nfce.fazenda.sp.gov.br/qrcode?p=${baseString}|${codigoHash}`;
}

// Função para gerar a URL do QR Code para emissão OFFLINE
export function generateQRCodeURLOffline(
    chaveAcesso: string,
    versaoQRCode: string,
    tipoAmbiente: number,
    diaDataEmissao: string,
    valorTotalNfce: string,
    digVal: string,
    identificadorCSC: number,
    csc: string
): string {
    // Passo 1: Converter DigestValue para HEXA (já deve estar em formato hexadecimal)
    const digestValueHex = digVal; // Supondo que digVal já esteja em formato hexadecimal

    // Passo 2: Concatenar parâmetros
    const baseString = `${chaveAcesso}|${versaoQRCode}|${tipoAmbiente}|${diaDataEmissao}|${valorTotalNfce}|${digestValueHex}|${identificadorCSC}`;
    
    // Passo 3: Adicionar o CSC
    const stringToHash = `${baseString}|${csc}`;
    
    // Passo 4: Gerar o hash
    const codigoHash = generateSHA1Hash(stringToHash);
    
    // Montar URL
    return `https://www.homologacao.nfce.fazenda.sp.gov.br/qrcode?p=${baseString}|${codigoHash}`;
}

// Exemplo de uso
// const chaveAcesso = '35240808819185000172650011452380619650831611';
// const versaoQRCode = '2';
// const tipoAmbiente = '2';
// const identificadorCSC = '1'; // Exemplo, deve ser ajustado conforme a configuração
// const csc = 'csc_example';
// const diaDataEmissao = '08';
// const valorTotalNfce = '12345.67'; // Valor total em formato correto
// const digVal = 'e99a18c428cb38d5f260853678922e03abd273a6'; // Exemplo, deve ser o DigestValue real

// // Gerar URLs
// const urlOnline = generateQRCodeURLOnline(chaveAcesso, versaoQRCode, tipoAmbiente, identificadorCSC, csc);
// const urlOffline = generateQRCodeURLOffline(chaveAcesso, versaoQRCode, tipoAmbiente, diaDataEmissao, valorTotalNfce, digVal, identificadorCSC, csc);

// console.log('URL ONLINE:', urlOnline);
// console.log('URL OFFLINE:', urlOffline);