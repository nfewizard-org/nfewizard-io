import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';

function isExternal(id) {
  if (id.startsWith('@nfewizard/')) return true;
  if (id.startsWith('node:')) return true;
  if (['fs', 'path', 'url', 'https', 'http', 'os', 'stream', 'util', 'crypto', 'buffer', 'events', 'zlib'].includes(id)) return true;
  if (id.startsWith('axios')) return true;
  return false;
}

export default [
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
        resolveOnly: [/^\./, /^src\//]
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationMap: false,
        compilerOptions: {
          rootDir: '.',
          module: 'NodeNext',
          moduleResolution: 'NodeNext'
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
    external: isExternal,
    plugins: [
      json(),
      resolve({
        preferBuiltins: true,
        resolveOnly: [/^\./, /^src\//]
      }),
      commonjs(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationMap: false,
        compilerOptions: {
          rootDir: '.',
          module: 'NodeNext',
          moduleResolution: 'NodeNext'
        }
      })
    ]
  }
];
