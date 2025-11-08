#!/bin/bash
# Script para instalar o ícone do Techdoro no local correto

ICON_SOURCE="$HOME/.local/share/flatpak/app/com.zelchi.Techdoro/current/active/files/share/pixmaps/com.zelchi.Techdoro.png"
ICON_DIR="$HOME/.local/share/icons/hicolor/256x256/apps"
ICON_DEST="$ICON_DIR/com.zelchi.Techdoro.png"

# Criar diretório se não existir
mkdir -p "$ICON_DIR"

# Copiar ícone
if [ -f "$ICON_SOURCE" ]; then
    cp "$ICON_SOURCE" "$ICON_DEST"
    echo "✓ Ícone copiado para $ICON_DEST"
    
    # Atualizar cache de ícones
    if command -v gtk-update-icon-cache &> /dev/null; then
        gtk-update-icon-cache -f -t "$HOME/.local/share/icons/hicolor" 2>/dev/null
        echo "✓ Cache de ícones atualizado"
    fi
    
    echo "✓ Ícone do Techdoro instalado com sucesso!"
else
    echo "✗ Erro: Arquivo de ícone não encontrado em $ICON_SOURCE"
    exit 1
fi
