import { app, BrowserWindow, ipcMain, Menu, Notification, Tray, shell, globalShortcut } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let isQuiting = false;
let notification: Notification | null = null;

if (started) {
    app.quit();
}

app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-gpu-compositing');
app.commandLine.appendSwitch('disable-gpu-rasterization');
app.commandLine.appendSwitch('disable-accelerated-video-decode');
app.commandLine.appendSwitch('disable-accelerated-video-encode');

const getIconPath = (): string | undefined => {
    const isWin = process.platform === 'win32';
    const isLinux = process.platform === 'linux';
    if (!(isWin || isLinux)) return undefined;

    if (app.isPackaged) {
        return path.join(
            process.resourcesPath,
            isWin ? 'icon.ico' : 'icon.png'
        );
    }
    return path.join(
        process.cwd(),
        'src',
        'app',
        'assets',
        isWin ? 'icon.ico' : 'icon.png'
    );
};

const getIconMenu = (iconType: 'abrir' | 'sair' | 'default' = 'default'): string => {

    const iconMap = {
        abrir: 'abrir.png',
        sair: 'sair.png',
        default: 'icon.png'
    };

    const iconName = iconMap[iconType];
    const basePath = app.isPackaged ? process.resourcesPath : path.join(process.cwd(), 'src', 'app', 'assets');

    return path.join(basePath, iconName);
};

const getNotificationIcon = (): string | undefined => {
    const basePath = app.isPackaged
        ? process.resourcesPath
        : path.join(process.cwd(), 'src', 'app', 'assets');
    return path.join(basePath, 'icon.png');
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
        titleBarStyle: 'hidden',
        vibrancy: 'fullscreen-ui',
        backgroundMaterial: 'acrylic',
        backgroundColor: '#00000000',
    });

    const isDev = !!MAIN_WINDOW_VITE_DEV_SERVER_URL && !app.isPackaged;
    if (isDev) {
        mainWindow.webContents.openDevTools({ mode: 'detach' });
    }

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
    tray.setToolTip('Techdoro');
    tray.setTitle('Techdoro');
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

ipcMain.on('window-minimize', () => {
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

ipcMain.on('window-close', () => {
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

    globalShortcut.register('CommandOrControl+Shift+I', () => {
        if (mainWindow && !mainWindow.isDestroyed()) {
            if (mainWindow.webContents.isDevToolsOpened()) {
                mainWindow.webContents.closeDevTools();
            } else {
                mainWindow.webContents.openDevTools({ mode: 'detach' });
            }
        }
    });

    notification = new Notification({
        silent: true,
        icon: getNotificationIcon(),
        timeoutType: 'default',
    });

    notification.on('click', () => {
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
        if (!notification) return;
        notification.title = 'Tempo acabou!';
        notification.body = 'Vai dar uma esticada nas pernas!';
        notification.show();
    });

    ipcMain.on('notifiTimeShort', () => {
        if (!notification) return;
        notification.title = 'Intervalo acabou!';
        notification.body = 'Retome os estudos imediatamente!!!';
        notification.show();
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

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});