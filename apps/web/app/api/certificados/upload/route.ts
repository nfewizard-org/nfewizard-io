import { NextRequest, NextResponse } from 'next/server';
import { createCertificate } from '@/lib/db/queries';
import path from 'path';
import fs from 'fs';
import { v4 as uuid } from 'uuid';
import forge from 'node-forge';

const CERTS_DIR = path.join(process.cwd(), '.data', 'certs');
if (!fs.existsSync(CERTS_DIR)) fs.mkdirSync(CERTS_DIR, { recursive: true });

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const companyId = formData.get('companyId') as string;
    const senha = formData.get('senha') as string;
    const file = formData.get('file') as File;

    if (!companyId || !senha || !file) {
      return NextResponse.json({ error: 'Faltam dados obrigatórios' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Extract dates using node-forge
    const p12Der = forge.util.createBuffer(buffer.toString('binary'));
    const p12Asn1 = forge.asn1.fromDer(p12Der);
    
    let p12;
    try {
        p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, senha);
    } catch (e) {
        return NextResponse.json({ error: 'Senha incorreta ou arquivo PFX inválido' }, { status: 400 });
    }
    
    // Find the certificate
    let certValidAt = null;
    let certExpiredAt = null;
    if (p12.safeContents) {
      for (const safeContents of p12.safeContents) {
          for (const safeBag of safeContents.safeBags) {
              if (safeBag.type === forge.pki.oids.certBag) {
                  const cert = safeBag.cert;
                  if (cert) {
                      certValidAt = cert.validity.notBefore;
                      certExpiredAt = cert.validity.notAfter;
                      break;
                  }
              }
          }
          if (certExpiredAt) break;
      }
    }

    if (!certExpiredAt) {
        return NextResponse.json({ error: 'Não foi possível ler as datas do certificado' }, { status: 400 });
    }

    // Determine status
    const status = certExpiredAt.getTime() > Date.now() ? 'valid' : 'expired';
    const validade = certExpiredAt.toISOString();

    const fileName = file.name;
    const saveName = `${companyId}_${uuid()}.pfx`;
    const savePath = path.join(CERTS_DIR, saveName);

    fs.writeFileSync(savePath, buffer);

    // Encrypt password slightly (for MVP, base64 to avoid plain text)
    const secretRef = Buffer.from(senha).toString('base64');

    const cert = createCertificate({
      companyId,
      fileName,
      validade,
      status,
      secretRef, 
    });

    return NextResponse.json(cert, { status: 201 });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'Erro ao validar ou salvar o certificado: ' + error.message }, { status: 500 });
  }
}
