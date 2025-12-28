#!/bin/bash

# Script para publicar um único pacote do NFeWizard no npm
# Uso: ./scripts/publish-single.sh <package-name>
# Exemplo: ./scripts/publish-single.sh types

set -e

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se o nome do pacote foi fornecido
if [ -z "$1" ]; then
    echo -e "${RED}❌ Erro: Nome do pacote não fornecido${NC}"
    echo -e "${YELLOW}Uso: ./scripts/publish-single.sh <package-name>${NC}"
    echo ""
    echo -e "Pacotes disponíveis:"
    echo -e "  ${BLUE}types${NC}       - Tipos TypeScript"
    echo -e "  ${BLUE}shared${NC}      - Utilitários compartilhados"
    echo -e "  ${BLUE}danfe${NC}       - Geração de DANFE/DACTE"
    echo -e "  ${BLUE}nfce${NC}        - Biblioteca NFCe"
    echo -e "  ${BLUE}cte${NC}         - Biblioteca CTe (não publicar ainda)"
    echo -e "  ${BLUE}nfewizard-io${NC} - Biblioteca NFe (não publicar ainda)"
    echo ""
    echo -e "Exemplo: ${YELLOW}./scripts/publish-single.sh types${NC}"
    exit 1
fi

PACKAGE_NAME=$1
PACKAGE_DIR="packages/$PACKAGE_NAME"

# Verificar se o diretório do pacote existe
if [ ! -d "$PACKAGE_DIR" ]; then
    echo -e "${RED}❌ Erro: Pacote '$PACKAGE_NAME' não encontrado${NC}"
    echo -e "Diretório esperado: $PACKAGE_DIR"
    exit 1
fi

# Verificar se o package.json existe
if [ ! -f "$PACKAGE_DIR/package.json" ]; then
    echo -e "${RED}❌ Erro: package.json não encontrado em $PACKAGE_DIR${NC}"
    exit 1
fi

echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   📦 Publicação de Pacote Individual${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo ""

# Verificar se está logado no npm
echo -e "${YELLOW}🔐 Verificando autenticação npm...${NC}"
if ! npm whoami &> /dev/null; then
    echo -e "${RED}❌ Você não está logado no npm!${NC}"
    echo -e "${YELLOW}Execute: npm login${NC}"
    exit 1
fi

NPM_USER=$(npm whoami)
echo -e "${GREEN}✅ Logado como: ${NPM_USER}${NC}"
echo ""

# Obter informações do pacote
cd "$PACKAGE_DIR"
FULL_PACKAGE_NAME=$(node -p "require('./package.json').name")
PACKAGE_VERSION=$(node -p "require('./package.json').version")
PACKAGE_DESCRIPTION=$(node -p "require('./package.json').description")

echo -e "${BLUE}Pacote:${NC} ${YELLOW}${FULL_PACKAGE_NAME}${NC}"
echo -e "${BLUE}Versão:${NC} ${YELLOW}${PACKAGE_VERSION}${NC}"
echo -e "${BLUE}Descrição:${NC} ${PACKAGE_DESCRIPTION}"
echo ""

# Voltar para raiz
cd ../..

# Build do pacote
echo -e "${BLUE}🔨 Fazendo build do pacote...${NC}"
if pnpm turbo run build --filter="${FULL_PACKAGE_NAME}"; then
    echo -e "${GREEN}✅ Build concluído${NC}"
else
    echo -e "${RED}❌ Erro no build${NC}"
    exit 1
fi
echo ""

# Verificar se há arquivos no dist
if [ ! -d "$PACKAGE_DIR/dist" ]; then
    echo -e "${RED}❌ Erro: Diretório dist/ não encontrado após build${NC}"
    exit 1
fi

# Mostrar arquivos que serão publicados
echo -e "${BLUE}📁 Arquivos que serão publicados:${NC}"
cd "$PACKAGE_DIR"
npm pack --dry-run 2>&1 | grep -E "^\s*[0-9]" || echo "  (executando dry-run...)"
cd ../..
echo ""

# Perguntar confirmação
echo -e "${YELLOW}════════════════════════════════════════════════════════${NC}"
read -p "$(echo -e ${YELLOW}Confirma publicação de ${FULL_PACKAGE_NAME}@${PACKAGE_VERSION}? \(y/n\)${NC} )" -n 1 -r
echo ""
echo -e "${YELLOW}════════════════════════════════════════════════════════${NC}"

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}⏭️  Publicação cancelada${NC}"
    exit 0
fi

# Publicar
cd "$PACKAGE_DIR"
echo ""
echo -e "${BLUE}📤 Publicando ${FULL_PACKAGE_NAME}...${NC}"
if pnpm publish --no-git-checks; then
    echo ""
    echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}   ✅ ${FULL_PACKAGE_NAME}@${PACKAGE_VERSION} publicado com sucesso!${NC}"
    echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${BLUE}Verificar pacote:${NC}"
    echo -e "  npm view ${FULL_PACKAGE_NAME}"
    echo ""
    echo -e "${BLUE}Instalar em outro projeto:${NC}"
    echo -e "  npm install ${FULL_PACKAGE_NAME}"
    echo -e "  # ou"
    echo -e "  pnpm add ${FULL_PACKAGE_NAME}"
else
    echo ""
    echo -e "${RED}════════════════════════════════════════════════════════${NC}"
    echo -e "${RED}   ❌ Erro ao publicar ${FULL_PACKAGE_NAME}${NC}"
    echo -e "${RED}════════════════════════════════════════════════════════${NC}"
    exit 1
fi
