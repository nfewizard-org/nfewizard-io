import alias from '@rollup/plugin-alias';
import typescript from 'rollup-plugin-typescript2';
// import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';
import replace from '@rollup/plugin-replace';
import copy from 'rollup-plugin-copy';

import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
    input: 'src/index.ts',
    output: {
        dir: 'dist',
        format: 'esm',
        sourcemap: true,
    },
    external: ['fs', 'path', 'https', 'url', 'crypto', 'bwip-js', 'xsd-schema-validator'],
    plugins: [
        alias({
            entries: [
                { find: '@Classes', replacement: path.resolve(__dirname, 'src/classes') },
                { find: '@Controllers', replacement: path.resolve(__dirname, 'src/controllers') },
                { find: '@Protocols', replacement: path.resolve(__dirname, 'src/protocols') },
                { find: '@Protocols', replacement: path.resolve(__dirname, 'src/protocols/index') },
                { find: '@Utils', replacement: path.resolve(__dirname, 'src/utils') },
            ],
        }),
        json(),
        nodeResolve(),
        commonjs(),
        typescript(),
        dynamicImportVars({
            __dirname: 'dirname',
        }),
        replace({
            preventAssignment: true,
            values: {
                __dirname: JSON.stringify(path.resolve(__dirname, './src')),
            },
        }),
        // terser(),
        copy({
            targets: [
                { src: 'src/assets/*', dest: 'dist/assets' },
                { src: 'src/certs/*', dest: 'dist/certs' },
                { src: 'src/schemas/*', dest: 'dist/schemas' },
            ],
        }),
    ],
};
