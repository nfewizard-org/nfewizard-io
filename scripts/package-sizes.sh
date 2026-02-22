#!/bin/bash

# Script para verificar o tamanho de cada package que será publicado no npm
# Uso: ./scripts/package-sizes.sh

set -e

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║        📦 Tamanho dos Packages no NPM Registry           ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Verificar se pnpm está instalado
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}❌ pnpm não encontrado. Instale com: npm install -g pnpm${NC}"
    exit 1
fi

echo -e "${CYAN}Empacotando packages...${NC}\n"

# Array para armazenar resultados
declare -a packages
declare -a sizes
declare -a unpacked_sizes
total_size=0
total_unpacked=0

# Iterar sobre cada package
for pkg_dir in packages/*/; do
    pkg_name=$(basename "$pkg_dir")
    
    # Pular se não tiver package.json
    if [ ! -f "$pkg_dir/package.json" ]; then
        continue
    fi
    
    cd "$pkg_dir"
    
    # Executar pnpm pack e capturar informações
    echo -e "${YELLOW}Empacotando $pkg_name...${NC}"
    pack_output=$(pnpm pack 2>&1)
    
    # Pegar nome do arquivo .tgz gerado
    tarball=$(echo "$pack_output" | grep -oP "nfewizard-.*\.tgz$" | tail -1)
    
    if [ -z "$tarball" ]; then
        echo -e "${RED}  ⚠️  Erro ao empacotar $pkg_name${NC}"
        cd ../..
        continue
    fi
    
    # Pegar tamanho do arquivo
    if [ -f "$tarball" ]; then
        size_bytes=$(stat -f%z "$tarball" 2>/dev/null || stat -c%s "$tarball" 2>/dev/null)
        size_kb=$(echo "scale=1; $size_bytes/1024" | bc)
        
        # Extrair tarball temporariamente para medir tamanho descompactado
        temp_dir=$(mktemp -d)
        tar -xzf "$tarball" -C "$temp_dir" 2>/dev/null
        
        # Medir tamanho descompactado
        unpacked_bytes=$(du -sb "$temp_dir" 2>/dev/null | cut -f1)
        unpacked_kb=$(echo "scale=1; $unpacked_bytes/1024" | bc)
        
        # Formatar para exibição
        if (( $(echo "$unpacked_kb < 1024" | bc -l) )); then
            unpacked=$(printf "%.1f KB" "$unpacked_kb")
        else
            unpacked_mb=$(echo "scale=2; $unpacked_kb/1024" | bc)
            unpacked=$(printf "%.2f MB" "$unpacked_mb")
        fi
        
        # Limpar diretório temporário
        rm -rf "$temp_dir"
        
        total_unpacked=$(echo "scale=1; $total_unpacked+$unpacked_kb" | bc)
        
        packages+=("$pkg_name")
        sizes+=("$size_kb")
        unpacked_sizes+=("$unpacked")
        
        total_size=$(echo "scale=1; $total_size+$size_kb" | bc)
        
        # Remover arquivo .tgz
        rm -f "$tarball"
        
        echo -e "${GREEN}  ✓ Empacotado${NC}"
    else
        echo -e "${RED}  ✗ Arquivo não encontrado${NC}"
    fi
    
    cd ../..
    echo ""
done

# Exibir resultados em tabela
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                      Resultados                            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

printf "${CYAN}%-25s %15s %20s${NC}\n" "Package" "Compactado" "Descompactado"
echo -e "${YELLOW}────────────────────────────────────────────────────────────${NC}"

for i in "${!packages[@]}"; do
    pkg="${packages[$i]}"
    size="${sizes[$i]}"
    unpacked="${unpacked_sizes[$i]}"
    
    # Formatar tamanho
    if (( $(echo "$size < 1024" | bc -l) )); then
        size_display=$(printf "%.1f KB" "$size")
    else
        size_mb=$(echo "scale=2; $size/1024" | bc)
        size_display=$(printf "%.2f MB" "$size_mb")
    fi
    
    printf "%-25s %15s %20s\n" "@nfewizard/$pkg" "$size_display" "$unpacked"
done

echo -e "${YELLOW}────────────────────────────────────────────────────────────${NC}"

# Total
if (( $(echo "$total_size < 1024" | bc -l) )); then
    total_display=$(printf "%.1f KB" "$total_size")
else
    total_mb=$(echo "scale=2; $total_size/1024" | bc)
    total_display=$(printf "%.2f MB" "$total_mb")
fi

if (( $(echo "$total_unpacked < 1024" | bc -l) )); then
    total_unpacked_display=$(printf "%.1f KB" "$total_unpacked")
else
    total_unpacked_mb=$(echo "scale=2; $total_unpacked/1024" | bc)
    total_unpacked_display=$(printf "%.2f MB" "$total_unpacked_mb")
fi

printf "${GREEN}%-25s %15s %20s${NC}\n" "TOTAL" "$total_display" "$total_unpacked_display"
echo ""

# Informações adicionais
echo -e "${BLUE}ℹ️  Informações:${NC}"
echo -e "  • ${CYAN}Compactado${NC}: Tamanho do arquivo .tgz baixado do npm"
echo -e "  • ${CYAN}Descompactado${NC}: Tamanho após instalação no node_modules"
echo -e "  • Dependências internas (@nfewizard/*) são ${YELLOW}instaladas separadamente${NC}"
echo -e "  • Usuário que instalar nfewizard-io baixará todos os packages necessários"
echo ""

echo -e "${GREEN}✓ Análise concluída!${NC}"
