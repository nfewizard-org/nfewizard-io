import { execSync } from 'child_process';

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
        execSync('rm -rf dist/ && npx tsc && tsc-alias');
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
