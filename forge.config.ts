import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerFlatpak } from '@electron-forge/maker-flatpak';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerZIP } from "@electron-forge/maker-zip";
import { VitePlugin } from '@electron-forge/plugin-vite';

const version = '2.0.1';

const config: ForgeConfig = {
    packagerConfig: {
        asar: true,
        name: 'Techdoro',
        appVersion: version,
        buildVersion: version,
        executableName: 'techdoro',
        icon: 'src/renderer/app/assets/icon',
        extraResource: [
            'src/renderer/app/assets/icon.png',
            'src/renderer/app/assets/icon.ico',
            'src/renderer/app/assets/alarme.mp3',
            'src/renderer/app/assets/click.mp3',
        ],
    },
    makers: [
        new MakerSquirrel({
            name: 'Techdoro',
            authors: 'Zelchi',
            exe: 'Techdoro.exe',
            setupExe: `Techdoro-Setup-${version}.exe`,
            version: version,
            setupIcon: 'src/renderer/app/assets/icon.ico',
            description: 'A simple Pomodoro timer for your desktop',
        }, ['win32']),
        // new MakerRpm({
        //     options: {
        //         name: 'Techdoro',
        //         productName: 'Techdoro',
        //         genericName: 'Pomodoro Timer',
        //         description: 'A simple Pomodoro timer for your desktop',
        //         categories: ['Utility', 'Office'],
        //         version: version,
        //         icon: 'src/renderer/app/assets/icon.png',
        //         homepage: 'https://github.com/Zelchi/Techdoro',
        //         license: 'MIT',
        //     },
        // }, ['linux']),
        new MakerDeb({
            options: {
                name: 'Techdoro',
                productName: 'Techdoro',
                genericName: 'Pomodoro Timer',
                description: 'A simple Pomodoro timer for your desktop',
                categories: ['Utility', 'Office'],
                version: version,
                icon: 'src/renderer/app/assets/icon.png',
                homepage: 'https://github.com/Zelchi/Techdoro',
                section: 'utils',
                priority: 'optional',
            },
        }, ['linux']),
        new MakerFlatpak({
            options: {
                id: 'com.zelchi.Techdoro',
                runtime: 'org.freedesktop.Platform',
                sdk: 'org.freedesktop.Sdk',
                runtimeVersion: '25.08',
                baseVersion: '25.08',
                base: 'org.electronjs.Electron2.BaseApp',
                branch: 'stable',
                icon: 'src/renderer/app/assets/icon.png',
                productName: 'Techdoro',
                genericName: 'Pomodoro Timer',
                description: 'A simple Pomodoro timer for your desktop',
                categories: ['Utility', 'Office'],
                files: [
                    ['src/renderer/app/assets/icon.png', '/share/icons/hicolor/512x512/apps/com.zelchi.Techdoro.png'],
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
        new MakerZIP({}, ['win32', 'linux']),
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