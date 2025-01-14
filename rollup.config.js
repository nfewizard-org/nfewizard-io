/**
    * @description      : 
    * @author           : Marco Lima 
    * @group            : 
    * @created          :  
    * 
    * MODIFICATION LOG
    * - Version         : 0.2.6
    * - Date            : 14/11/2024
    * - Author          : Cassio Seffrin
    * - Modification    : 
**/
import alias from '@rollup/plugin-alias';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import copy from 'rollup-plugin-copy';
import path from 'path';
export default {
    input: 'src/index.ts',
    output: [
        // {
        //     dir: 'dist/esm',
        //     format: 'esm',
        //     sourcemap: true,
        //     compact: true,
        // },
            {
                dir: 'dist/cjs',
                format: 'cjs',
                sourcemap: true,
                compact: true,
            },
    ],
    external: ['fs', 'path', 'https', 'url', 'crypto', 'bwip-js', 'xsd-schema-validator', 'pdfkit', 'pem', 'libxmljs'],
    plugins: [
        alias({
            entries: [
                { find: '@Adapters', replacement: path.resolve(__dirname, 'src/adapters') },
                { find: '@Modules', replacement: path.resolve(__dirname, 'src/modules') },
                { find: '@Interfaces', replacement: path.resolve(__dirname, 'src/core/interfaces') },
                { find: '@Interfaces/*', replacement: path.resolve(__dirname, 'src/core/interfaces/*') },
                { find: '@Types', replacement: path.resolve(__dirname, 'src/core/types') },
                { find: '@Types/*', replacement: path.resolve(__dirname, 'src/core/types/*') },
                { find: '@Core', replacement: path.resolve(__dirname, 'src/core') },
                { find: '@Core/*', replacement: path.resolve(__dirname, 'src/core/*') },
                { find: '@Utils/*', replacement: path.resolve(__dirname, 'src/core/utils/*') },
            ],
        }),
        json(),
        nodeResolve(),
        commonjs(),
        typescript({
            tsconfig: "tsconfig.json",
            sourceMap: true,
        }),
        replace({
            'process.env.NODE_ENV': JSON.stringify('production'),
            preventAssignment: true,
        }),
        copy({
            targets: [
                // ESM
                // { src: 'src/assets/*', dest: 'dist/esm/assets' },
                // { src: 'src/certs/*', dest: 'dist/esm/certs' },
                // { src: 'src/schemas/*', dest: 'dist/esm/schemas' },
                // CJS
                { src: 'src/resources/*', dest: 'dist/cjs/resources' },
                // { src: 'src/certs/*', dest: 'dist/cjs/certs' },
                // { src: 'src/schemas/*', dest: 'dist/cjs/schemas' },
            ],
        }),
        terser({
            keep_fnames: true,
            mangle: false,
        }),
    ],
};
