#!/bin/bash
set -e

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 NFeWizard-io - Instalação Local${NC}"
echo ""

# Verificar se um diretório de destino foi fornecido
if [ -z "$1" ]; then
    echo -e "${RED}❌ Erro: Você deve fornecer o caminho do projeto de destino${NC}"
    echo ""
    echo "Uso:"
    echo "  ./local-install.sh /caminho/para/seu/projeto"
    echo ""
    echo "Exemplo:"
    echo "  ./local-install.sh ~/Documents/projetos/NFeWizard/Testes/NFeWizard"
    exit 1
fi

TARGET_DIR="$1"

# Verificar se o diretório existe
if [ ! -d "$TARGET_DIR" ]; then
    echo -e "${RED}❌ Erro: Diretório '$TARGET_DIR' não existe${NC}"
    exit 1
fi

# Verificar se tem package.json
if [ ! -f "$TARGET_DIR/package.json" ]; then
    echo -e "${RED}❌ Erro: '$TARGET_DIR' não é um projeto Node.js (sem package.json)${NC}"
    exit 1
fi

MONOREPO_DIR="$(pwd)"

echo -e "${YELLOW}📁 Projeto destino: $TARGET_DIR${NC}"
echo -e "${YELLOW}📁 Monorepo: $MONOREPO_DIR${NC}"
echo ""

# Passo 1: Instalar dependências externas no projeto de destino
echo -e "${BLUE}📦 Passo 1: Instalando dependências externas no projeto de destino...${NC}"
cd "$TARGET_DIR"

# Garantir que .npmrc permite build scripts
echo "enable-pre-post-scripts=true" > .npmrc
echo "unsafe-perm=true" >> .npmrc

# Lista completa de dependências necessárias (incluindo libxmljs2 que precisa ser compilado)
DEPS="date-fns axios xml2js nodemailer node-fetch pdfkit qrcode bwip-js pako xml-crypto node-forge libxmljs2 xsd-schema-validator easy-soap-request soap pem winston xml-js sha1 winston-transport xsd-assembler"

# Verificar se já estão instaladas
MISSING_DEPS=""
for dep in $DEPS; do
    if [ ! -d "node_modules/$dep" ]; then
        MISSING_DEPS="$MISSING_DEPS $dep"
    fi
done

if [ -n "$MISSING_DEPS" ]; then
    echo -e "${YELLOW}  Instalando:${MISSING_DEPS}${NC}"
    pnpm add $MISSING_DEPS
    
    # Forçar rebuild de módulos nativos
    echo -e "${YELLOW}  Compilando módulos nativos (libxmljs2, xsd-schema-validator)...${NC}"
    cd node_modules/.pnpm/libxmljs2@*/node_modules/libxmljs2 2>/dev/null && npm run install 2>&1 | grep -v "npm warn" || true
    cd "$TARGET_DIR"
    cd node_modules/.pnpm/xsd-schema-validator@*/node_modules/xsd-schema-validator 2>/dev/null && npm run build 2>&1 | grep -v "npm warn" || true
    cd "$TARGET_DIR"
    
    echo -e "${GREEN}  ✅ Dependências instaladas${NC}"
else
    echo -e "${GREEN}  ✅ Todas as dependências já instaladas${NC}"
fi
echo ""

# Voltar para o monorepo
cd "$MONOREPO_DIR"

# Passo 2: Build de todos os pacotes
echo -e "${BLUE}🔨 Passo 2: Building todos os pacotes...${NC}"
pnpm build
echo -e "${GREEN}✅ Build completo${NC}"
echo ""

# Passo 3: Criar diretório temporário para os pacotes
echo -e "${BLUE}📦 Passo 3: Preparando pacotes...${NC}"
TEMP_DIR="$MONOREPO_DIR/.local-packages"
rm -rf "$TEMP_DIR"
mkdir -p "$TEMP_DIR"

# Copiar cada pacote com sua estrutura completa
for pkg in types shared danfe nfce cte nfewizard-io; do
    if [ "$pkg" = "nfewizard-io" ]; then
        PKG_NAME="nfewizard-io"
        PKG_DIR="$MONOREPO_DIR/packages/nfewizard-io"
        DEST_DIR="$TEMP_DIR/nfewizard-io"
    else
        PKG_NAME="@nfewizard/$pkg"
        PKG_DIR="$MONOREPO_DIR/packages/$pkg"
        DEST_DIR="$TEMP_DIR/@nfewizard/$pkg"
    fi
    
    echo -e "  Copiando $PKG_NAME..."
    mkdir -p "$DEST_DIR"
    
    # Copiar package.json e dist/
    cp "$PKG_DIR/package.json" "$DEST_DIR/"
    cp -r "$PKG_DIR/dist" "$DEST_DIR/"
    
    # Copiar resources se existir (para shared package)
    [ -d "$PKG_DIR/resources" ] && cp -r "$PKG_DIR/resources" "$DEST_DIR/" || true
    
    # Copiar README se existir
    [ -f "$PKG_DIR/README.md" ] && cp "$PKG_DIR/README.md" "$DEST_DIR/" || true
done

echo -e "${GREEN}✅ Pacotes preparados${NC}"
echo ""

# Passo 4: Instalar no projeto de destino (sobrescrever o que pnpm criou)
echo -e "${BLUE}🚀 Passo 4: Instalando pacotes locais...${NC}"
cd "$TARGET_DIR"

# Remover instalações antigas e links do pnpm
rm -rf node_modules/@nfewizard node_modules/nfewizard-io
rm -rf node_modules/.ignored/@nfewizard 2>/dev/null
rm -rf node_modules/.ignored/nfewizard-io 2>/dev/null

# Criar diretórios
mkdir -p node_modules/@nfewizard

# Copiar pacotes
echo -e "  Instalando @nfewizard/types..."
cp -r "$TEMP_DIR/@nfewizard/types" node_modules/@nfewizard/

echo -e "  Instalando @nfewizard/shared..."
cp -r "$TEMP_DIR/@nfewizard/shared" node_modules/@nfewizard/

echo -e "  Instalando @nfewizard/danfe..."
cp -r "$TEMP_DIR/@nfewizard/danfe" node_modules/@nfewizard/

echo -e "  Instalando @nfewizard/nfce..."
cp -r "$TEMP_DIR/@nfewizard/nfce" node_modules/@nfewizard/

echo -e "  Instalando @nfewizard/cte..."
cp -r "$TEMP_DIR/@nfewizard/cte" node_modules/@nfewizard/

echo -e "  Instalando nfewizard-io..."
cp -r "$TEMP_DIR/nfewizard-io" node_modules/

echo -e "${GREEN}✅ Pacotes locais instalados${NC}"

# Limpar temporários
echo ""
echo -e "${BLUE}🧹 Limpando arquivos temporários...${NC}"
rm -rf "$TEMP_DIR"

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Instalação local concluída com sucesso!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}📝 Pacotes instalados:${NC}"
echo -e "  • @nfewizard/types@1.0.0"
echo -e "  • @nfewizard/shared@1.0.0"
echo -e "  • @nfewizard/danfe@1.0.0"
echo -e "  • @nfewizard/nfce@1.0.0"
echo -e "  • @nfewizard/cte@1.0.0"
echo -e "  • nfewizard-io@1.0.0"
echo ""
echo -e "${BLUE}🧪 Agora você pode testar:${NC}"
echo -e "  cd $TARGET_DIR"
echo -e "  node seu-arquivo-de-teste.js"
echo ""
