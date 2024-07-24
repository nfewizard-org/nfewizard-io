import { execSync } from 'child_process';

const copyFiles = () => {
    execSync('npx copyfiles -u 1 src/assets/** dist');
    execSync('npx copyfiles -u 1 src/certs/** dist');
    execSync('npx copyfiles -u 1 src/schemas/** dist');
};

const build = async () => {
    try {
        execSync('rm -rf dist/ && npx tsc && tsc-alias');
        copyFiles();
    } catch (error) {
        console.error('Build failed:', error);
        process.exit(1);
    }
};

build();
