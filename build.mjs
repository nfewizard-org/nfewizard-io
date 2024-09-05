import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// Função para verificar se um caminho é um diretório contendo um index.js
const hasIndexFile = (dir) => {
    const indexFilePath = path.join(dir, 'index.js');
    return fs.existsSync(indexFilePath);
};

// Função para adicionar a extensão .js aos imports e asserções de tipo para imports JSON
const addJsExtensions = (dir) => {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            addJsExtensions(filePath);
        } else if (filePath.endsWith('.js')) {
            let content = fs.readFileSync(filePath, 'utf8');
            content = content.replace(/(from\s+['"])([^'"]+)(['"])/g, (match, p1, p2, p3) => {
                if (p2.startsWith('.')) {
                    const importPath = path.join(path.dirname(filePath), p2);
                    const resolvedPath = path.resolve(importPath);
                    const importExt = path.extname(importPath);
                    if (importExt === '.json') {
                        return `${p1}${p2}${p3} assert { type: "json" }`;
                    } else if (!importExt) {
                        if (fs.existsSync(importPath + '.js')) {
                            return `${p1}${p2}.js${p3}`;
                        } else if (hasIndexFile(resolvedPath)) {
                            return `${p1}${p2}/index.js${p3}`;
                        } else {
                            return `${p1}${p2}.js${p3}`;
                        }
                    }
                }
                return match;
            });
            fs.writeFileSync(filePath, content, 'utf8');
        }
    });
};

// Função para copiar arquivos específicos das pastas de origem para a pasta de destino
const copyFiles = () => {
    // Copia todos os arquivos na pasta 'src/assets' para a pasta 'dist'
    execSync('npx copyfiles -u 1 src/assets/** dist');
    // Copia todos os arquivos na pasta 'src/certs' para a pasta 'dist'
    execSync('npx copyfiles -u 1 src/certs/** dist');
    // Copia todos os arquivos na pasta 'src/schemas' para a pasta 'dist'
    execSync('npx copyfiles -u 1 src/schemas/** dist');
};

// Função assíncrona para compilar o projeto e copiar arquivos necessários
const build = async () => {
    try {
        // Exclui diretório de saída, compila o projeto TypeScript e ajusta os aliases
        execSync('rm -rf dist/ && npx tsc && npx tsc-alias');
        // Adiciona as extensões .js aos imports e asserções de tipo para imports JSON
        addJsExtensions('dist');
        // Chama a função para copiar os arquivos
        copyFiles();
    } catch (error) {
        // Em caso de erro na compilação ou na cópia dos arquivos, exibe a mensagem de erro
        console.error('Build failed:', error);
        // Encerra o processo com código de erro 1
        process.exit(1);
    }
};

// Chama a função build para iniciar o processo de build
build();
