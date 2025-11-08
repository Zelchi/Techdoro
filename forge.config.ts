import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerFlatpak } from '@electron-forge/maker-flatpak';
import { VitePlugin } from '@electron-forge/plugin-vite';

const flatpakId = 'com.zelchi.Techdoro';

const config: ForgeConfig = {
    packagerConfig: {
        asar: true,
        name: 'Techdoro',
        icon: 'src/app/assets/tray-icon.png',
        extraResource: [
            'src/app/assets/tray-icon.png',
            'src/app/assets/icon.png',
            'src/app/assets/icon.ico',
        ],
    },
    rebuildConfig: {},
    makers: [
        new MakerFlatpak({
            options: {
                id: flatpakId,
                runtime: 'org.freedesktop.Platform',
                runtimeVersion: '23.08',
                sdk: 'org.freedesktop.Sdk',
                base: 'org.electronjs.Electron2.BaseApp',
                baseVersion: '23.08',
                finishArgs: [
                    '--share=ipc',
                    '--socket=wayland',
                    '--socket=fallback-x11',
                    '--socket=pulseaudio',
                    '--device=dri',
                    '--filesystem=home',
                    '--talk-name=org.freedesktop.Notifications',
                    '--own-name=org.kde.StatusNotifierItem.*',
                    '--talk-name=org.kde.StatusNotifierWatcher',
                    '--talk-name=com.canonical.indicator.application',
                    '--talk-name=org.ayatana.indicator.application',
                ],
                files: [],
                modules: []
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