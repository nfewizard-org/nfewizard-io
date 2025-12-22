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
      '@nfewizard/types/nfe',
      '@nfewizard/types/nfce',
      '@nfewizard/shared',
      'bwip-js',
      'pdfkit',
      'qrcode',
      'date-fns',
      'date-fns/locale',
      'fs',
      'path',
      'url'
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
      '@nfewizard/types/nfe',
      '@nfewizard/types/nfce',
      '@nfewizard/shared',
      'bwip-js',
      'pdfkit',
      'qrcode',
      'date-fns',
      'date-fns/locale',
      'fs',
      'path',
      'url'
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
