import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            output: {
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name?.endsWith('.mp3')) {
                        return 'assets/[name][extname]';
                    }
                    return 'assets/[name]-[hash][extname]';
                }
            }
        },
        assetsInlineLimit: 0, // Não fazer inline de nenhum asset
    },
    assetsInclude: ['**/*.mp3'],
    optimizeDeps: {
        exclude: ['*.mp3']
    }
});