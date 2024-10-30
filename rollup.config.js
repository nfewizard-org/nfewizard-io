import alias from '@rollup/plugin-alias';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';
// import nodeResolve from '@rollup/plugin-node-resolve';
// import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import copy from 'rollup-plugin-copy';

import path from 'path';

export default {
    input: 'src/index.ts',
    output: [
        {
            dir: 'dist/esm',
            format: 'esm',
            sourcemap: true,
            compact: true,
        },
        // {
        //     dir: 'dist/cjs',
        //     format: 'cjs',
        //     sourcemap: true,
        //     compact: true,
        // },
    ],
    external: ['fs', 'path', 'https', 'url', 'crypto', 'bwip-js', 'xsd-schema-validator', 'pdfkit', 'pem'],
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
        // nodeResolve(),
        // commonjs(),
        typescript(),
        replace({
            'process.env.NODE_ENV': JSON.stringify('production'), // Substitui NODE_ENV por 'production'
            preventAssignment: true,
        }),
        copy({
            targets: [
                // ESM
                { src: 'src/assets/*', dest: 'dist/esm/assets' },
                { src: 'src/certs/*', dest: 'dist/esm/certs' },
                { src: 'src/schemas/*', dest: 'dist/esm/schemas' },
                // CJS
                { src: 'src/assets/*', dest: 'dist/cjs/assets' },
                { src: 'src/certs/*', dest: 'dist/cjs/certs' },
                { src: 'src/schemas/*', dest: 'dist/cjs/schemas' },
            ],
        }),
        terser(),
    ],
};
