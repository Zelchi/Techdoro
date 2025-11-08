import { app, BrowserWindow, ipcMain, Menu, Notification, Tray, shell, globalShortcut } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import started from 'electron-squirrel-startup';

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let isQuiting = false;

if (started) {
    app.quit();
}

app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-gpu-compositing');
app.commandLine.appendSwitch('disable-gpu-rasterization');
app.commandLine.appendSwitch('disable-accelerated-video-decode');
app.commandLine.appendSwitch('disable-accelerated-video-encode');

const getIconPath = (size?: number): string => {

    const iconSize = size || (process.platform === 'linux' ? 32 : 512);
    
    if (process.platform === 'win32') {
        return app.isPackaged 
            ? path.join(process.resourcesPath, 'icon.ico') 
            : path.join(process.cwd(), 'src', 'app', 'assets', 'icons', '512.png');
    } else {
        if (app.isPackaged) {
            const systemIcon = path.join('/app/share/icons/hicolor', `${iconSize}x${iconSize}`, 'apps', 'com.zelchi.Techdoro.png');
            const resourceIcon = path.join(process.resourcesPath, 'icons', `${iconSize}.png`);
            const fallbackIcon = path.join(process.resourcesPath, 'icon.png');
            
            if (fs.existsSync(systemIcon)) {
                return systemIcon;
            }
            if (fs.existsSync(resourceIcon)) {
                return resourceIcon;
            }
            return fallbackIcon;
        } else {
            return path.join(process.cwd(), 'src', 'app', 'assets', 'icons', `${iconSize}.png`);
        }
    }
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

    try {
        const iconPath = process.platform === 'linux' ? getIconPath(32) : getIconPath();
        console.log('Criando tray com ícone:', iconPath);

        tray = new Tray(iconPath);
        tray.setToolTip('Techdoro');

        if (process.platform === 'darwin') {
            tray.setTitle('Techdoro');
        }

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

        const contextMenu = Menu.buildFromTemplate([
            {
                label: 'Mostrar Janela',
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
                type: 'separator'
            },
            {
                label: 'Sair',
                click: () => {
                    isQuiting = true;
                    if (mainWindow) {
                        mainWindow.setSkipTaskbar(false);
                        mainWindow.destroy();
                    }
                    app.quit();
                },
            },
        ]);

        tray.setContextMenu(contextMenu);
        console.log('Tray criado com sucesso');
    } catch (error) {
        console.error('Erro ao criar tray:', error);
    }
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

    if (Notification.isSupported()) {
        console.log('Notificações são suportadas');

        ipcMain.on('notifiTimeLong', () => {
            try {
                const notificationIcon = process.platform === 'linux' ? getIconPath(48) : getIconPath();
                
                const notif = new Notification({
                    title: 'Tempo acabou!',
                    body: 'Vai dar uma esticada nas pernas!',
                    icon: notificationIcon,
                    silent: false,
                    timeoutType: 'default',
                });

                notif.on('click', () => {
                    if (!mainWindow) return;
                    mainWindow.setSkipTaskbar(false);
                    if (mainWindow.isMinimized()) mainWindow.restore();
                    mainWindow.show();
                    mainWindow.focus();
                });

                notif.show();
                console.log('Notificação de tempo longo exibida');
            } catch (error) {
                console.error('Erro ao exibir notificação:', error);
            }
        });

        ipcMain.on('notifiTimeShort', () => {
            try {
                const notificationIcon = process.platform === 'linux' ? getIconPath(48) : getIconPath();
                
                const notif = new Notification({
                    title: 'Intervalo acabou!',
                    body: 'Retome os estudos imediatamente!!!',
                    icon: notificationIcon,
                    silent: false,
                    timeoutType: 'default',
                });

                notif.on('click', () => {
                    if (!mainWindow) return;
                    mainWindow.setSkipTaskbar(false);
                    if (mainWindow.isMinimized()) mainWindow.restore();
                    mainWindow.show();
                    mainWindow.focus();
                });

                notif.show();
                console.log('Notificação de tempo curto exibida');
            } catch (error) {
                console.error('Erro ao exibir notificação:', error);
            }
        });
    } else {
        console.error('Notificações não são suportadas neste sistema');
    }
});

app.on('window-all-closed', () => {

    if (tray && !isQuiting) {
        return;
    }

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