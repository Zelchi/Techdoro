import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerFlatpak } from '@electron-forge/maker-flatpak';
import { VitePlugin } from '@electron-forge/plugin-vite';

const flatpakId = 'com.zelchi.Techdoro';

const config: ForgeConfig = {
    packagerConfig: {
        asar: true,
    },
    rebuildConfig: {},
    makers: [
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