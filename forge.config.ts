import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerMSIX } from '@electron-forge/maker-msix';
import { MakerFlatpak } from '@electron-forge/maker-flatpak';
import { VitePlugin } from '@electron-forge/plugin-vite';

const flatpakId = 'com.zelchi.Techdoro';

const config: ForgeConfig = {
    packagerConfig: {
        asar: true,
    },
    rebuildConfig: {},
    makers: [
        // Linux: Flatpak
        new MakerFlatpak({
            options: {
                id: flatpakId,
                runtimeVersion: '23.08',
                finishArgs: [
                    '--share=network',
                    '--socket=wayland',
                    '--socket=fallback-x11',
                    '--device=dri',
                    '--filesystem=home'
                ],
                files: []
            },
        }, ['linux']),

        // Windows: MSIX
        new MakerMSIX({
            // Minimal config: you can customize manifest variables below
            manifestVariables: {
                // Shown in Store / installer UI
                publisher: 'Zelchi',
            },
            // For signing, set windowsSignOptions or sign later externally
            // windowsSignOptions: { ... }
        }, ['win32'])
    ],
    plugins: [
        new VitePlugin({
            build: [
                {
                    entry: 'src/electron/main.ts',
                    config: 'vite.main.config.ts',
                    target: 'main',
                },
                {
                    entry: 'src/electron/preload.ts',
                    config: 'vite.preload.config.ts',
                    target: 'preload',
                },
            ],
            renderer: [
                {
                    name: 'main_window',
                    config: 'vite.renderer.config.ts',
                },
            ],
        }),
    ],
};

export default config;