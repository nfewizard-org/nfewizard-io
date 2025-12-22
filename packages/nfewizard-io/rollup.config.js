import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';

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
    external: [
      '@nfewizard/types',
      '@nfewizard/types/shared',
      '@nfewizard/types/nfe',
      '@nfewizard/types/nfce',
      '@nfewizard/types/cte',
      '@nfewizard/shared',
      '@nfewizard/danfe',
      'axios',
      'winston',
      'xml2js',
      'xml-crypto',
      'node-forge',
      'libxmljs2',
      'pdfkit',
      'qrcode',
      'bwip-js',
      'date-fns',
      'nodemailer',
      'fs',
      'path',
      'url',
      'https',
      'http',
      'os'
    ],
    plugins: [
      json(),
      resolve({
        preferBuiltins: true
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationMap: false
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
    external: [
      '@nfewizard/types',
      '@nfewizard/types/shared',
      '@nfewizard/types/nfe',
      '@nfewizard/types/nfce',
      '@nfewizard/types/cte',
      '@nfewizard/shared',
      '@nfewizard/danfe',
      'axios',
      'winston',
      'xml2js',
      'xml-crypto',
      'node-forge',
      'libxmljs2',
      'pdfkit',
      'qrcode',
      'bwip-js',
      'date-fns',
      'nodemailer',
      'fs',
      'path',
      'url',
      'https',
      'http',
      'os'
    ],
    plugins: [
      json(),
      resolve({
        preferBuiltins: true
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationMap: false
      })
    ]
  }
];
