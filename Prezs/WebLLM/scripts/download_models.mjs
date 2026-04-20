import { pipeline, env } from '@huggingface/transformers';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MODELS_DIR = path.join(__dirname, '..', 'models');

// Configure environment for local download
env.allowLocalModels = false;
env.allowRemoteModels = true;
env.localModelPath = MODELS_DIR;
env.cacheDir = MODELS_DIR;

// Disable cache to force download into the specific directory
env.useBrowserCache = false;

async function downloadModel(modelId, task = 'text-generation') {
    console.log(`\n[Download] Starting download of ${modelId}...`);
    try {
        const { AutoTokenizer, AutoProcessor } = await import('@huggingface/transformers');
        
        // Download Tokenizer and Processor
        console.log(`[${modelId}] Loading tokenizer/processor...`);
        await AutoTokenizer.from_pretrained(modelId, { progress_callback: (p) => {} });
        await AutoProcessor.from_pretrained(modelId, { progress_callback: (p) => {} });

        if (modelId.includes('moondream')) {
            const { AutoModelForImageTextToText } = await import('@huggingface/transformers');
            await AutoModelForImageTextToText.from_pretrained(modelId, {
                device: 'cpu',
                dtype: 'q4',
                progress_callback: (progress) => {
                    if (progress.status === 'progress') {
                        process.stdout.write(`\r[${modelId}] Progress: ${Math.round(progress.progress)}% (${progress.name || ''})`);
                    } else if (progress.status === 'done') {
                        console.log(`\n[${modelId}] Done: ${progress.file}`);
                    }
                }
            });
        } else {
            const { AutoModelForCausalLM } = await import('@huggingface/transformers');
            await AutoModelForCausalLM.from_pretrained(modelId, {
                device: 'cpu',
                dtype: 'q4',
                progress_callback: (progress) => {
                    if (progress.status === 'progress') {
                        process.stdout.write(`\r[${modelId}] Progress: ${Math.round(progress.progress)}% (${progress.name || ''})`);
                    } else if (progress.status === 'done') {
                        console.log(`\n[${modelId}] Done: ${progress.file}`);
                    }
                }
            });
        }
        console.log(`\n✅ ${modelId} correctly downloaded to ${MODELS_DIR}`);
    } catch (err) {
        console.error(`\n❌ Error downloading ${modelId}:`, err.message);
    }
}

async function main() {
    console.log('--- Transformers.js Model Downloader ---');
    console.log(`Target directory: ${MODELS_DIR}`);

    // Download Llama 3.2
    await downloadModel('onnx-community/Llama-3.2-1B-Instruct');

    // Download Moondream2 (Vision)
    // For multimodal models, we might need to specify the correct task if needed
    // or just use AutoModel classes directly. Let's use image-to-text as a hint.
    await downloadModel('Xenova/moondream2', 'image-to-text');

    console.log('\n--- All downloads complete ---');
}

main();
