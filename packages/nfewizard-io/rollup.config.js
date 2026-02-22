import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';

// Função para verificar se um módulo é externo
function isExternal(id) {
  // Pacotes do workspace
  if (id.startsWith('@nfewizard/')) return true;
  
  // Node built-ins
  if (id.startsWith('node:')) return true;
  if (['fs', 'path', 'url', 'https', 'http', 'os', 'stream', 'util', 'crypto', 'buffer', 'events'].includes(id)) return true;
  
  // Dependencies do package.json
  if (id.startsWith('axios')) return true;
  if (id.startsWith('winston')) return true;
  if (id.startsWith('xml2js')) return true;
  if (id.startsWith('xml-crypto')) return true;
  if (id.startsWith('node-forge')) return true;
  if (id.startsWith('libxmljs2')) return true;
  if (id.startsWith('pdfkit')) return true;
  if (id.startsWith('qrcode')) return true;
  if (id.startsWith('bwip-js')) return true;
  if (id.startsWith('date-fns')) return true;
  if (id.startsWith('nodemailer')) return true;
  
  return false;
}

export default [
  // CommonJS build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.cjs',
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    external: isExternal,
    plugins: [
      json(),
      resolve({
        preferBuiltins: true,
        // Apenas resolve módulos locais, não workspace packages
        resolveOnly: [/^\./, /^src\//]
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationMap: false,
        compilerOptions: {
          rootDir: '.'
        }
      })
    ]
  },
  // ES Module build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.mjs',
      format: 'esm',
      sourcemap: true
    },
    external: isExternal,
    plugins: [
      json(),
      resolve({
        preferBuiltins: true,
        // Apenas resolve módulos locais, não workspace packages
        resolveOnly: [/^\./, /^src\//]
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationMap: false,
        compilerOptions: {
          rootDir: '.'
        }
      })
    ]
  }
];
