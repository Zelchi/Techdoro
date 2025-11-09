import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerFlatpak } from '@electron-forge/maker-flatpak';
import { VitePlugin } from '@electron-forge/plugin-vite';

const flatpakId = 'com.zelchi.Techdoro';

const config: ForgeConfig = {
    packagerConfig: {
        asar: true,
        name: 'techdoro',
        executableName: 'techdoro',
        icon: 'src/app/assets/icon',
        extraResource: [
            'src/app/assets/icon.png',
            'src/app/assets/icon.ico',
            'src/app/assets/alarme.mp3',
            'src/app/assets/click.mp3',
        ],
    },
    makers: [
        new MakerFlatpak({
            options: {
                id: flatpakId,
                runtime: 'org.freedesktop.Platform',
                sdk: 'org.freedesktop.Sdk',
                runtimeVersion: '25.08',
                baseVersion: '25.08',
                base: 'org.electronjs.Electron2.BaseApp',
                branch: 'stable',
                icon: 'src/app/assets/icon.png',
                productName: 'Techdoro',
                genericName: 'Pomodoro Timer',
                description: 'A simple Pomodoro timer for your desktop',
                categories: ['Utility', 'Office'],
                files: [
                    ['src/app/assets/icon.png', '/share/icons/hicolor/512x512/apps/com.zelchi.Techdoro.png'],
                ],
                modules: [],
                finishArgs: [
                    '--share=ipc',
                    '--socket=wayland',
                    '--socket=fallback-x11',
                    '--socket=pulseaudio',
                    '--socket=session-bus',
                    '--talk-name=org.freedesktop.Notifications',
                ],
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