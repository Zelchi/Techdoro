import { app, BrowserWindow, ipcMain, Menu, Notification, Tray, shell } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let isQuiting = false;

if (started) {
    app.quit();
}

const getIconPath = (): string | undefined => {
    const isWin = process.platform === 'win32';
    const isLinux = process.platform === 'linux';
    if (!(isWin || isLinux)) return undefined;

    if (app.isPackaged) {
        return path.join(
            process.resourcesPath,
            isWin ? 'dice_icon.ico' : 'dice_icon.png'
        );
    }
    return path.join(
        process.cwd(),
        'src',
        'assets',
        isWin ? 'dice_icon.ico' : 'dice_icon.png'
    );
};

const getIconMenu = (iconType: 'abrir' | 'sair' | 'default' = 'default'): string => {

    const iconMap = {
        abrir: 'abrir.png',
        sair: 'sair.png',
        default: 'dice_icon.png'
    };

    const iconName = iconMap[iconType];
    const basePath = app.isPackaged ? process.resourcesPath : path.join(process.cwd(), 'src', 'assets');

    return path.join(basePath, iconName);
};

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
    app.quit();
    process.exit(0);
} else {
    app.on('second-instance', () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });
}

const createWindow = () => {
    const win = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
        width: 500,
        height: 600,
        minWidth: 500,
        minHeight: 600,
        resizable: false,
        frame: false,
        icon: getIconPath(),
        backgroundColor: '#1c1c1c',
        titleBarStyle: 'hidden',
    });

    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
        mainWindow.loadFile(
            path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
        );
    }

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });

    mainWindow.webContents.on('will-navigate', (event, url) => {
        const currentURL = mainWindow?.webContents.getURL();
        if (url && currentURL && !url.startsWith(currentURL)) {
            event.preventDefault();
            shell.openExternal(url);
        }
    });

    mainWindow.once('ready-to-show', () => {
        mainWindow?.show();
    });

    mainWindow.on('maximize', () => {
        mainWindow?.webContents.send('window-maximized');
    });

    mainWindow.on('unmaximize', () => {
        mainWindow?.webContents.send('window-unmaximized');
    });

    mainWindow.on('enter-full-screen', () => {
        mainWindow?.webContents.send('window-fullscreen', true);
    });

    mainWindow.on('leave-full-screen', () => {
        mainWindow?.webContents.send('window-fullscreen', false);
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    mainWindow.on('close', (event) => {
        if (!isQuiting) {
            event.preventDefault();
            mainWindow?.hide();
            mainWindow?.setSkipTaskbar(true);
        }
    });
}

const createTray = () => {
    if (tray) return;
    tray = new Tray(getIconPath());
    tray.setToolTip('DnD Manager');
    tray.setTitle('DnD Manager');
    tray.on('click', () => {
        if (!mainWindow) return;
        if (mainWindow.isVisible()) {
            mainWindow.hide();
            mainWindow.setSkipTaskbar(true);
        } else {
            mainWindow.setSkipTaskbar(false);
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.show();
            mainWindow.focus();
        }
    });
    tray.setContextMenu(Menu.buildFromTemplate(
        [
            {
                label: 'Mostrar Janela',
                icon: getIconMenu('abrir'),
                click: () => {
                    if (!mainWindow) return;
                    if (mainWindow.isVisible()) {
                        mainWindow.hide();
                        mainWindow.setSkipTaskbar(true);
                    } else {
                        mainWindow.setSkipTaskbar(false);
                        if (mainWindow.isMinimized()) mainWindow.restore();
                        mainWindow.show();
                        mainWindow.focus();
                    }
                },
            },
            {
                label: 'Sair',
                icon: getIconMenu('sair'),
                click: () => {
                    isQuiting = true;
                    if (mainWindow) {
                        mainWindow.setSkipTaskbar(false);
                        mainWindow.destroy();
                    }
                    app.quit();
                },
            },
        ]));
}

/**
 * Minimiza a janela principal.
 * Canal IPC: window-minimize
 */
ipcMain.handle('window-minimize', () => {
    mainWindow?.minimize();
});

/**
 * Maximiza a janela, se ainda não estiver maximizada.
 * Canal IPC: window-maximize
 */
ipcMain.handle('window-maximize', () => {
    if (mainWindow && !mainWindow.isMaximized()) {
        mainWindow.maximize();
    }
});

/**
 * Restaura a janela se estiver maximizada.
 * Canal IPC: window-unmaximize
 */
ipcMain.handle('window-unmaximize', () => {
    if (mainWindow && mainWindow.isMaximized()) {
        mainWindow.unmaximize();
    }
});

/**
 * Fecha a janela principal.
 * Canal IPC: window-close
 */
ipcMain.handle('window-close', () => {
    mainWindow?.close();
});

/**
 * Informa se a janela está maximizada.
 * Canal IPC: window-is-maximized
 * Retorna: boolean
 */
ipcMain.handle('window-is-maximized', () => {
    return mainWindow?.isMaximized() ?? false;
});

/**
 * Alterna o modo de tela cheia (on/off).
 * Canal IPC: window-toggle-fullscreen
 */
ipcMain.handle('window-toggle-fullscreen', () => {
    if (mainWindow) {
        mainWindow.setFullScreen(!mainWindow.isFullScreen());
    }
});

/**
 * Informa se a janela está em tela cheia.
 * Canal IPC: window-is-fullscreen
 * Retorna: boolean
 */
ipcMain.handle('window-is-fullscreen', () => {
    return mainWindow?.isFullScreen() ?? false;
});

/**
 * Cria a janela quando o app estiver pronto.
 */
app.whenReady().then(() => {
    // Ensure correct taskbar icon behavior on Windows (pinning/notifications)
    if (process.platform === 'win32') {
        app.setAppUserModelId('app');
    }
    createWindow();
    createTray();
});

/**
 * Encerra a aplicação quando todas as janelas forem fechadas,
 * exceto no macOS, onde é comum manter o app ativo até reativação.
 */
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

/**
 * No macOS, recria a janela ao reativar o app se não houver janelas abertas.
 */
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    } else if (mainWindow) {
        // No macOS, reexibir janela ao ativar o app
        if (!mainWindow.isVisible()) {
            mainWindow.setSkipTaskbar(false);
            mainWindow.show();
        }
        mainWindow.focus();
    }
});

app.on('before-quit', () => {
    isQuiting = true;
    tray?.destroy();
    tray = null;
});