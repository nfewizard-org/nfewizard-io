#!/bin/bash

# Script para bumpar versão dos pacotes NFeWizard
# Uso:
#   ./scripts/bump-version.sh                    → bump interativo de todos os pacotes
#   ./scripts/bump-version.sh <package>          → bump interativo de um pacote
#   ./scripts/bump-version.sh <package> <tipo>   → bump direto (patch|minor|major|x.y.z)
#
# Pode ser chamado por outros scripts via:
#   source scripts/bump-version.sh && bump_package "types" "patch"

set -e

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

PACKAGES_ALL=("types" "shared" "danfe" "nfce" "nfse")

# ──────────────────────────────────────────────────────────────
# Incrementa uma versão semver
# $1 = versão atual (ex: 1.2.3)
# $2 = tipo (patch|minor|major)
# ──────────────────────────────────────────────────────────────
semver_bump() {
    local version="$1"
    local bump_type="$2"

    local major minor patch
    IFS='.' read -r major minor patch <<< "$version"

    case "$bump_type" in
        major) major=$((major + 1)); minor=0; patch=0 ;;
        minor) minor=$((minor + 1)); patch=0 ;;
        patch) patch=$((patch + 1)) ;;
    esac

    echo "${major}.${minor}.${patch}"
}

# ──────────────────────────────────────────────────────────────
# Valida se uma string é uma versão semver válida
# ──────────────────────────────────────────────────────────────
is_valid_semver() {
    [[ "$1" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]
}

# ──────────────────────────────────────────────────────────────
# Aplica nova versão no package.json de um pacote
# $1 = nome do pacote (ex: types)
# $2 = nova versão (ex: 1.2.4)
# ──────────────────────────────────────────────────────────────
apply_version() {
    local pkg_name="$1"
    local new_version="$2"
    local pkg_dir="packages/$pkg_name"

    node -e "
        const fs = require('fs');
        const path = '$pkg_dir/package.json';
        const pkg = JSON.parse(fs.readFileSync(path, 'utf8'));
        pkg.version = '$new_version';
        fs.writeFileSync(path, JSON.stringify(pkg, null, 2) + '\n');
    "
}

# ──────────────────────────────────────────────────────────────
# Faz o bump de um único pacote, interativamente
# $1 = nome do pacote
# $2 = tipo de bump (opcional: patch|minor|major|x.y.z)
# Exporta BUMPED_VERSION com a nova versão
# ──────────────────────────────────────────────────────────────
bump_package() {
    local pkg_name="$1"
    local bump_type="$2"
    local pkg_dir="packages/$pkg_name"

    if [ ! -f "$pkg_dir/package.json" ]; then
        echo -e "${RED}❌ Pacote '$pkg_name' não encontrado em $pkg_dir${NC}"
        return 1
    fi

    local current_version
    current_version=$(node -p "require('./$pkg_dir/package.json').version")

    echo -e "${BLUE}📦 @nfewizard/${pkg_name}${NC} — versão atual: ${YELLOW}${current_version}${NC}"

    # Se não foi passado tipo, perguntar
    if [ -z "$bump_type" ]; then
        echo -e "  Escolha o tipo de bump:"
        echo -e "    ${CYAN}[1]${NC} patch  → $(semver_bump "$current_version" patch)"
        echo -e "    ${CYAN}[2]${NC} minor  → $(semver_bump "$current_version" minor)"
        echo -e "    ${CYAN}[3]${NC} major  → $(semver_bump "$current_version" major)"
        echo -e "    ${CYAN}[4]${NC} versão específica (ex: 2.1.0)"
        echo -e "    ${CYAN}[s]${NC} pular este pacote"
        echo ""
        read -rp "  Opção: " bump_choice

        case "$bump_choice" in
            1) bump_type="patch" ;;
            2) bump_type="minor" ;;
            3) bump_type="major" ;;
            4)
                read -rp "  Digite a versão (ex: 2.1.0): " bump_type
                if ! is_valid_semver "$bump_type"; then
                    echo -e "${RED}❌ Versão inválida: '$bump_type'. Use o formato x.y.z${NC}"
                    return 1
                fi
                ;;
            s|S)
                echo -e "${YELLOW}⏭️  Pulando @nfewizard/${pkg_name}${NC}"
                BUMPED_VERSION="$current_version"
                return 0
                ;;
            *)
                echo -e "${RED}❌ Opção inválida${NC}"
                return 1
                ;;
        esac
    fi

    # Calcular nova versão
    local new_version
    if is_valid_semver "$bump_type"; then
        new_version="$bump_type"
    else
        new_version=$(semver_bump "$current_version" "$bump_type")
    fi

    apply_version "$pkg_name" "$new_version"
    echo -e "${GREEN}✅ @nfewizard/${pkg_name}: ${current_version} → ${new_version}${NC}"
    BUMPED_VERSION="$new_version"
}

# ──────────────────────────────────────────────────────────────
# Bump interativo de todos os pacotes (chamável por outros scripts)
# ──────────────────────────────────────────────────────────────
bump_all_interactive() {
    echo -e "${YELLOW}Modo: bump em todos os pacotes publicáveis${NC}"
    echo ""

    echo -e "  ${CYAN}[1]${NC} Mesmo tipo de bump para todos os pacotes"
    echo -e "  ${CYAN}[2]${NC} Configurar cada pacote individualmente"
    echo ""
    read -rp "  Opção: " mode_choice

    if [ "$mode_choice" = "1" ]; then
        echo ""
        echo -e "${BLUE}Versões atuais:${NC}"
        for pkg in "${PACKAGES_ALL[@]}"; do
            v=$(node -p "require('./packages/$pkg/package.json').version")
            echo -e "  @nfewizard/${pkg}: ${YELLOW}${v}${NC}"
        done
        echo ""
        echo -e "  Escolha o tipo de bump para todos:"
        echo -e "    ${CYAN}[1]${NC} patch"
        echo -e "    ${CYAN}[2]${NC} minor"
        echo -e "    ${CYAN}[3]${NC} major"
        echo -e "    ${CYAN}[4]${NC} versão específica (mesma para todos)"
        echo ""
        read -rp "  Opção: " global_bump

        case "$global_bump" in
            1) GLOBAL_TYPE="patch" ;;
            2) GLOBAL_TYPE="minor" ;;
            3) GLOBAL_TYPE="major" ;;
            4)
                read -rp "  Digite a versão (ex: 2.0.0): " GLOBAL_TYPE
                if ! is_valid_semver "$GLOBAL_TYPE"; then
                    echo -e "${RED}❌ Versão inválida. Use o formato x.y.z${NC}"
                    return 1
                fi
                ;;
            *)
                echo -e "${RED}❌ Opção inválida${NC}"
                return 1
                ;;
        esac

        echo ""
        for pkg in "${PACKAGES_ALL[@]}"; do
            bump_package "$pkg" "$GLOBAL_TYPE"
        done
    else
        echo ""
        for pkg in "${PACKAGES_ALL[@]}"; do
            echo ""
            bump_package "$pkg" ""
        done
    fi
}

# ──────────────────────────────────────────────────────────────
# Modo standalone (script chamado diretamente)
# ──────────────────────────────────────────────────────────────
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then

    echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}   🔖 Bump de Versão — NFeWizard${NC}"
    echo -e "${BLUE}════════════════════════════════════════════════════════${NC}"
    echo ""

    PACKAGE_ARG="${1:-}"
    BUMP_ARG="${2:-}"

    if [ -n "$PACKAGE_ARG" ]; then
        if [ ! -d "packages/$PACKAGE_ARG" ]; then
            echo -e "${RED}❌ Pacote '$PACKAGE_ARG' não encontrado${NC}"
            echo ""
            echo -e "Pacotes disponíveis: ${PACKAGES_ALL[*]}"
            exit 1
        fi
        bump_package "$PACKAGE_ARG" "$BUMP_ARG"
    else
        bump_all_interactive
    fi

    echo ""
    echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}   ✅ Versões atualizadas com sucesso!${NC}"
    echo -e "${GREEN}════════════════════════════════════════════════════════${NC}"
fi
