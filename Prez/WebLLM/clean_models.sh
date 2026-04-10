#!/bin/bash

# Chemins
MODELS_DIR="./models"

echo "🗑️ Suppression du dossier $MODELS_DIR..."

if [ -d "$MODELS_DIR" ]; then
    rm -rf "$MODELS_DIR"
    echo "✅ Dossier $MODELS_DIR supprimé."
else
    echo "ℹ️ Le dossier $MODELS_DIR n'existe pas."
fi

echo "🚀 Prêt pour un nouveau téléchargement."
