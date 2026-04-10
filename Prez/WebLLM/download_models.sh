#!/bin/bash

# Configuration
MODELS_ROOT="./models"
BASE_URL_LLAMA="https://huggingface.co/onnx-community/Llama-3.2-1B-Instruct/resolve/main"
BASE_URL_MOONDREAM="https://huggingface.co/Xenova/moondream2/resolve/main"

# Liste des fichiers pour Llama 3.2 1B
FILES_LLAMA=(
    "config.json"
    "generation_config.json"
    "tokenizer.json"
    "tokenizer_config.json"
    "onnx/model_q4.onnx"
    "onnx/model_q4.onnx_data"
)

# Liste des fichiers pour Moondream2
FILES_MOONDREAM=(
    "config.json"
    "preprocessor_config.json"
    "tokenizer.json"
    "tokenizer_config.json"
    "onnx/vision_encoder_q4.onnx"
    "onnx/decoder_model_merged_q4.onnx"
    "onnx/embed_tokens_q4.onnx"
)

download_file() {
    local base_url=$1
    local rel_path=$2
    local target_dir=$3
    local url="${base_url}/${rel_path}?download=true"
    local dest="${target_dir}/${rel_path}"
    
    mkdir -p "$(dirname "$dest")"
    
    echo "⬇️ Downloading $rel_path..."
    curl -L -C - "$url" -o "$dest"
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to download $rel_path"
        return 1
    fi
}

echo "--- Robust Model Downloader (curl edition) ---"

# Proposer de nettoyer d'abord
# ./clean_models.sh

# Llama 3.2
TARGET_LLAMA="${MODELS_ROOT}/onnx-community/Llama-3.2-1B-Instruct"
echo -e "\n📦 Processing Llama 3.2 1B Instruct..."
for file in "${FILES_LLAMA[@]}"; do
    download_file "$BASE_URL_LLAMA" "$file" "$TARGET_LLAMA"
done

# Moondream2
TARGET_MOONDREAM="${MODELS_ROOT}/Xenova/moondream2"
echo -e "\n📦 Processing Moondream2..."
for file in "${FILES_MOONDREAM[@]}"; do
    download_file "$BASE_URL_MOONDREAM" "$file" "$TARGET_MOONDREAM"
done

echo -e "\n✨ All downloads complete!"
echo "📂 Models are in: $MODELS_ROOT"
