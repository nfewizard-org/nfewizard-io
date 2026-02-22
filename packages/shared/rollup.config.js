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
      'axios',
      'winston',
      'winston-transport',
      'libxmljs2',
      'xml2js',
      'xml-crypto',
      'node-forge',
      'pako',
      'xsd-assembler',
      'xsd-schema-validator',
      'pem',
      'sha1',
      'ini',
      'date-fns',
      'date-fns-tz',
      'xml-js',
      'easy-soap-request',
      'soap',
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
        declaration: true,
        declarationDir: './dist',
        declarationMap: false,
        exclude: ['**/*.json'],
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
    external: [
      '@nfewizard/types',
      '@nfewizard/types/shared',
      '@nfewizard/types/nfe',
      'axios',
      'winston',
      'winston-transport',
      'libxmljs2',
      'xml2js',
      'xml-crypto',
      'node-forge',
      'pako',
      'xsd-assembler',
      'xsd-schema-validator',
      'pem',
      'sha1',
      'ini',
      'date-fns',
      'date-fns-tz',
      'xml-js',
      'easy-soap-request',
      'soap',
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
        declaration: true,
        declarationDir: './dist',
        declarationMap: false,
        exclude: ['**/*.json'],
        compilerOptions: {
          rootDir: '.'
        }
      })
    ]
  }
];
