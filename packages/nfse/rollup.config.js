import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';

export default [
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
      '@nfewizard/shared',
      'axios',
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
        preferBuiltins: true,
        extensions: ['.ts', '.js', '.json']
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
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.mjs',
      format: 'esm',
      sourcemap: true
    },
    external: [
      '@nfewizard/types',
      '@nfewizard/shared',
      'axios',
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
        preferBuiltins: true,
        extensions: ['.ts', '.js', '.json']
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
