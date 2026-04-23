#!/bin/bash

# Script para publicar pacotes específicos do NFeWizard no npm
# Uso: ./scripts/publish-packages.sh

set -e

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Pacotes a serem publicados (em ordem de dependência)
PACKAGES_TO_PUBLISH=("types" "shared" "danfe" "nfce" "nfse")

echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}   📦 Publicação de Pacotes NFeWizard${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
echo ""

# Bump de versão (opcional)
echo -e "${YELLOW}🔖 Deseja fazer bump de versão antes de publicar? (y/n)${NC}"
read -rp "  Opção: " DO_BUMP
if [[ "$DO_BUMP" =~ ^[Yy]$ ]]; then
    source "$(dirname "$0")/bump-version.sh"
    bump_all_interactive
    echo ""
fi

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

# Build de todos os pacotes
echo -e "${BLUE}🔨 Fazendo build dos pacotes...${NC}"
pnpm turbo run build --filter=@nfewizard/types --filter=@nfewizard/shared --filter=@nfewizard/danfe --filter=@nfewizard/nfce --filter=@nfewizard/nfse
echo -e "${GREEN}✅ Build concluído${NC}"
echo ""

# Publicar cada pacote
for PACKAGE in "${PACKAGES_TO_PUBLISH[@]}"; do
    PACKAGE_DIR="packages/$PACKAGE"
    
    echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}📤 Publicando: @nfewizard/${PACKAGE}${NC}"
    echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
    
    cd "$PACKAGE_DIR"
    
    # Mostrar informações do pacote
    PACKAGE_VERSION=$(node -p "require('./package.json').version")
    echo -e "Versão: ${YELLOW}${PACKAGE_VERSION}${NC}"
    
    # Perguntar confirmação
    read -p "$(echo -e ${YELLOW}Confirma publicação de @nfewizard/${PACKAGE}@${PACKAGE_VERSION}? \(y/n\)${NC} )" -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Publicar
        if pnpm publish --no-git-checks; then
            echo -e "${GREEN}✅ @nfewizard/${PACKAGE}@${PACKAGE_VERSION} publicado com sucesso!${NC}"
        else
            echo -e "${RED}❌ Erro ao publicar @nfewizard/${PACKAGE}${NC}"
            cd ../..
            exit 1
        fi
    else
        echo -e "${YELLOW}⏭️  Pulando @nfewizard/${PACKAGE}${NC}"
    fi
    
    cd ../..
    echo ""
done

echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}   ✨ Publicação concluída!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}Verificar pacotes publicados:${NC}"
for PACKAGE in "${PACKAGES_TO_PUBLISH[@]}"; do
    echo -e "  npm view @nfewizard/${PACKAGE}"
done
