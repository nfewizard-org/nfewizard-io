#!/bin/bash
set -e

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 NFeWizard-io - Instalação Local de Pacote Único${NC}"
echo ""

# Verificar argumentos
if [ -z "$1" ] || [ -z "$2" ]; then
    echo -e "${RED}❌ Erro: Você deve fornecer o pacote e o diretório de destino${NC}"
    echo ""
    echo "Uso:"
    echo "  ./local-install-single.sh <pacote> <diretório-destino>"
    echo ""
    echo "Pacotes disponíveis:"
    echo "  - nfewizard-io    (Pacote principal NFe)"
    echo "  - @nfewizard/nfce (Pacote NFCe)"
    echo "  - @nfewizard/cte  (Pacote CTe)"
    echo "  - @nfewizard/danfe (Gerador de DANFE - opcional)"
    echo ""
    echo "Exemplos:"
    echo "  ./local-install-single.sh nfewizard-io ~/Documents/projetos/NFeWizard/Testes/NFeWizard"
    echo "  ./local-install-single.sh @nfewizard/nfce ~/meu-projeto"
    exit 1
fi

PACKAGE="$1"
TARGET_DIR="$2"

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

MONOREPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo -e "${YELLOW}📦 Pacote solicitado: $PACKAGE${NC}"
echo -e "${YELLOW}📁 Projeto destino: $TARGET_DIR${NC}"
echo -e "${YELLOW}📁 Monorepo: $MONOREPO_DIR${NC}"
echo ""

# Mapear pacote para diretório
case "$PACKAGE" in
    "nfewizard-io")
        MAIN_PKG="nfewizard-io"
        MAIN_DIR="nfewizard-io"
        DEPS=("types" "shared")
        ;;
    "@nfewizard/nfce")
        MAIN_PKG="@nfewizard/nfce"
        MAIN_DIR="nfce"
        DEPS=("types" "shared")
        ;;
    "@nfewizard/cte")
        MAIN_PKG="@nfewizard/cte"
        MAIN_DIR="cte"
        DEPS=("types" "shared")
        ;;
    "@nfewizard/danfe")
        MAIN_PKG="@nfewizard/danfe"
        MAIN_DIR="danfe"
        DEPS=("types" "shared")
        ;;
    *)
        echo -e "${RED}❌ Erro: Pacote '$PACKAGE' não reconhecido${NC}"
        echo "Pacotes válidos: nfewizard-io, @nfewizard/nfce, @nfewizard/cte, @nfewizard/danfe"
        exit 1
        ;;
esac

echo -e "${BLUE}📋 Dependências do $PACKAGE:${NC}"
for dep in "${DEPS[@]}"; do
    echo -e "  • @nfewizard/$dep"
done
echo ""

# Passo 1: Instalar dependências externas no projeto de destino
echo -e "${BLUE}📦 Passo 1: Instalando dependências externas...${NC}"
cd "$TARGET_DIR"

# Garantir que .npmrc permite build scripts
echo "enable-pre-post-scripts=true" > .npmrc
echo "unsafe-perm=true" >> .npmrc

# Lista de dependências baseada no pacote principal
case "$MAIN_PKG" in
    "nfewizard-io")
        EXT_DEPS="date-fns axios xml2js nodemailer node-fetch pdfkit qrcode bwip-js pako xml-crypto node-forge libxmljs2 xsd-schema-validator easy-soap-request soap pem winston xml-js sha1 winston-transport xsd-assembler"
        ;;
    "@nfewizard/nfce")
        EXT_DEPS="date-fns axios xml2js node-fetch pako xml-crypto node-forge libxmljs2 xsd-schema-validator easy-soap-request soap pem winston xml-js sha1 winston-transport xsd-assembler"
        ;;
    "@nfewizard/cte")
        EXT_DEPS="date-fns axios xml2js node-fetch pako xml-crypto node-forge libxmljs2 xsd-schema-validator easy-soap-request soap pem winston xml-js sha1 winston-transport xsd-assembler"
        ;;
    "@nfewizard/danfe")
        EXT_DEPS="pdfkit qrcode bwip-js"
        ;;
esac

# Verificar se já estão instaladas
MISSING_DEPS=""
for dep in $EXT_DEPS; do
    if [ ! -d "node_modules/$dep" ]; then
        MISSING_DEPS="$MISSING_DEPS $dep"
    fi
done

if [ -n "$MISSING_DEPS" ]; then
    echo -e "${YELLOW}  Instalando:${MISSING_DEPS}${NC}"
    pnpm add $MISSING_DEPS
    
    # Compilar módulos nativos se necessário
    if [[ "$MISSING_DEPS" == *"libxmljs2"* ]]; then
        echo -e "${YELLOW}  Compilando libxmljs2...${NC}"
        cd node_modules/.pnpm/libxmljs2@*/node_modules/libxmljs2 2>/dev/null && npm run install 2>&1 | grep -v "npm warn" || true
        cd "$TARGET_DIR"
    fi
    
    if [[ "$MISSING_DEPS" == *"xsd-schema-validator"* ]]; then
        echo -e "${YELLOW}  Compilando xsd-schema-validator...${NC}"
        cd node_modules/.pnpm/xsd-schema-validator@*/node_modules/xsd-schema-validator 2>/dev/null && npm run build 2>&1 | grep -v "npm warn" || true
        cd "$TARGET_DIR"
    fi
    
    echo -e "${GREEN}  ✅ Dependências externas instaladas${NC}"
else
    echo -e "${GREEN}  ✅ Todas as dependências já instaladas${NC}"
fi
echo ""

# Voltar para o monorepo
cd "$MONOREPO_DIR"

# Passo 2: Build apenas dos pacotes necessários
echo -e "${BLUE}🔨 Passo 2: Building pacotes necessários...${NC}"

# Build das dependências primeiro
for dep in "${DEPS[@]}"; do
    echo -e "  Building @nfewizard/$dep..."
    pnpm --filter "@nfewizard/$dep" build
done

# Build do pacote principal
echo -e "  Building $MAIN_PKG..."
if [ "$MAIN_PKG" = "nfewizard-io" ]; then
    pnpm --filter "nfewizard-io" build
else
    pnpm --filter "$MAIN_PKG" build
fi

echo -e "${GREEN}✅ Build completo${NC}"
echo ""

# Passo 3: Preparar pacotes
echo -e "${BLUE}📦 Passo 3: Preparando pacotes...${NC}"
TEMP_DIR="$MONOREPO_DIR/.local-packages-single"
rm -rf "$TEMP_DIR"
mkdir -p "$TEMP_DIR/@nfewizard"

# Copiar dependências
for dep in "${DEPS[@]}"; do
    PKG_DIR="$MONOREPO_DIR/packages/$dep"
    DEST_DIR="$TEMP_DIR/@nfewizard/$dep"
    
    echo -e "  Copiando @nfewizard/$dep..."
    mkdir -p "$DEST_DIR"
    
    cp "$PKG_DIR/package.json" "$DEST_DIR/"
    cp -r "$PKG_DIR/dist" "$DEST_DIR/"
    
    # Copiar resources se existir
    [ -d "$PKG_DIR/resources" ] && cp -r "$PKG_DIR/resources" "$DEST_DIR/" || true
    [ -f "$PKG_DIR/README.md" ] && cp "$PKG_DIR/README.md" "$DEST_DIR/" || true
done

# Copiar pacote principal
if [ "$MAIN_PKG" = "nfewizard-io" ]; then
    PKG_DIR="$MONOREPO_DIR/packages/nfewizard-io"
    DEST_DIR="$TEMP_DIR/nfewizard-io"
else
    PKG_DIR="$MONOREPO_DIR/packages/$MAIN_DIR"
    DEST_DIR="$TEMP_DIR/@nfewizard/$MAIN_DIR"
fi

echo -e "  Copiando $MAIN_PKG..."
mkdir -p "$DEST_DIR"

cp "$PKG_DIR/package.json" "$DEST_DIR/"
cp -r "$PKG_DIR/dist" "$DEST_DIR/"

[ -d "$PKG_DIR/resources" ] && cp -r "$PKG_DIR/resources" "$DEST_DIR/" || true
[ -f "$PKG_DIR/README.md" ] && cp "$PKG_DIR/README.md" "$DEST_DIR/" || true

echo -e "${GREEN}✅ Pacotes preparados${NC}"
echo ""

# Passo 4: Instalar no projeto de destino
echo -e "${BLUE}🚀 Passo 4: Instalando pacotes locais...${NC}"
cd "$TARGET_DIR"

# Remover instalações antigas
rm -rf node_modules/@nfewizard 2>/dev/null || true
rm -rf node_modules/nfewizard-io 2>/dev/null || true
rm -rf node_modules/.ignored/@nfewizard 2>/dev/null || true
rm -rf node_modules/.ignored/nfewizard-io 2>/dev/null || true

# Criar diretórios
mkdir -p node_modules/@nfewizard

# Copiar dependências
for dep in "${DEPS[@]}"; do
    echo -e "  Instalando @nfewizard/$dep..."
    cp -r "$TEMP_DIR/@nfewizard/$dep" node_modules/@nfewizard/
done

# Copiar pacote principal
if [ "$MAIN_PKG" = "nfewizard-io" ]; then
    echo -e "  Instalando nfewizard-io..."
    cp -r "$TEMP_DIR/nfewizard-io" node_modules/
else
    echo -e "  Instalando $MAIN_PKG..."
    cp -r "$TEMP_DIR/@nfewizard/$MAIN_DIR" node_modules/@nfewizard/
fi

echo -e "${GREEN}✅ Pacotes locais instalados${NC}"

# Limpar temporários
echo ""
echo -e "${BLUE}🧹 Limpando arquivos temporários...${NC}"
rm -rf "$TEMP_DIR"

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Instalação de $MAIN_PKG concluída com sucesso!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${BLUE}📝 Pacotes instalados:${NC}"
for dep in "${DEPS[@]}"; do
    echo -e "  • @nfewizard/$dep@1.0.0"
done
echo -e "  • $MAIN_PKG@$(grep '"version"' "$PKG_DIR/package.json" | sed 's/.*: "\(.*\)".*/\1/')"
echo ""
echo -e "${BLUE}🧪 Agora você pode testar:${NC}"
echo -e "  cd $TARGET_DIR"
echo -e "  node seu-arquivo-de-teste.js"
echo ""
echo -e "${YELLOW}💡 Dica: Este simula exatamente o que acontece com:${NC}"
echo -e "  npm install $MAIN_PKG"
echo ""
