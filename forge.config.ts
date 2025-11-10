import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerZIP } from "@electron-forge/maker-zip";
import { VitePlugin } from '@electron-forge/plugin-vite';

const version = '2.0.0';

const config: ForgeConfig = {
    packagerConfig: {
        asar: true,
        name: 'techdoro',
        appVersion: version,
        buildVersion: version,
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
        new MakerSquirrel({
            name: 'techdoro',
            authors: 'Zelchi',
            exe: 'techdoro.exe',
            setupExe: `Techdoro-Setup-${version}.exe`,
            setupIcon: 'src/app/assets/icon.ico',
            description: 'A simple Pomodoro timer for your desktop',
        }, ['win32']),
        new MakerRpm({
            options: {
                name: 'techdoro',
                productName: 'Techdoro',
                genericName: 'Pomodoro Timer',
                description: 'A simple Pomodoro timer for your desktop',
                categories: ['Utility', 'Office'],
                icon: 'src/app/assets/icon.png',
                homepage: 'https://github.com/Zelchi/Techdoro',
                license: 'MIT',
            },
        }, ['linux']),
        new MakerDeb({
            options: {
                name: 'techdoro',
                productName: 'Techdoro',
                genericName: 'Pomodoro Timer',
                description: 'A simple Pomodoro timer for your desktop',
                categories: ['Utility', 'Office'],
                icon: 'src/app/assets/icon.png',
                homepage: 'https://github.com/Zelchi/Techdoro',
                section: 'utils',
                priority: 'optional',
            },
        }, ['linux']),
        new MakerZIP({}, ['win32']),
        new MakerZIP({}, ['linux']),
        new MakerZIP({}, ['darwin'])
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