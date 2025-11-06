import { app, BrowserWindow, ipcMain, Menu, Notification, Tray, shell } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let isQuiting = false;
let notifica: Notification | null = null;

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

// Ícone para notificação (PNG é mais compatível)
const getNotificationIcon = (): string | undefined => {
    const basePath = app.isPackaged
        ? process.resourcesPath
        : path.join(process.cwd(), 'src', 'assets');
    return path.join(basePath, 'dice_icon.png');
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
    // Corrige variável sombreada: usa a global
    mainWindow = new BrowserWindow({
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

ipcMain.handle('window-minimize', () => {
    mainWindow?.minimize();
});

ipcMain.handle('window-maximize', () => {
    if (mainWindow && !mainWindow.isMaximized()) {
        mainWindow.maximize();
    }
});

ipcMain.handle('window-unmaximize', () => {
    if (mainWindow && mainWindow.isMaximized()) {
        mainWindow.unmaximize();
    }
});

ipcMain.handle('window-close', () => {
    mainWindow?.close();
});

ipcMain.handle('window-is-maximized', () => {
    return mainWindow?.isMaximized() ?? false;
});

ipcMain.handle('window-toggle-fullscreen', () => {
    if (mainWindow) {
        mainWindow.setFullScreen(!mainWindow.isFullScreen());
    }
});

ipcMain.handle('window-is-fullscreen', () => {
    return mainWindow?.isFullScreen() ?? false;
});

app.whenReady().then(() => {
    if (process.platform === 'win32') {
        app.setAppUserModelId('com.techdoro.app');
    }

    createWindow();
    createTray();

    notifica = new Notification({
        silent: true,
        icon: getNotificationIcon(),
        timeoutType: 'default',
    });

    notifica.on('click', () => {
        if (!mainWindow) return;
        if (mainWindow.isMinimized()) {
            mainWindow.show();
            mainWindow.restore();
        } else {
            mainWindow.show();
            mainWindow.focus();
        }
    });

    ipcMain.on('notifiTimeLong', () => {
        if (!notifica) return;
        notifica.title = 'Tempo acabou!';
        notifica.body = 'Vai dar uma esticada nas pernas!';
        notifica.show();
    });

    ipcMain.on('notifiTimeShort', () => {
        if (!notifica) return;
        notifica.title = 'Intervalo acabou!';
        notifica.body = 'Retome os estudos imediatamente!!!';
        notifica.show();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    } else if (mainWindow) {
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