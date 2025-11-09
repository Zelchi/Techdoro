import { app, BrowserWindow, ipcMain, Menu, Notification, Tray, shell, globalShortcut, nativeImage } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let notification: Notification | null = null;

if (started) {
    app.quit();
}

app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-gpu-compositing');
app.commandLine.appendSwitch('disable-gpu-rasterization');
app.commandLine.appendSwitch('disable-accelerated-video-decode');
app.commandLine.appendSwitch('disable-accelerated-video-encode');

const getIconPath = (): string => {

    if (app.isPackaged) {
        if (process.platform === 'win32') return path.join(process.resourcesPath, 'icon.ico');
        if (process.platform === 'linux') return path.join(process.resourcesPath, 'icon.png');
    } else {
        if (process.platform === 'win32') return path.join(process.cwd(), 'src', 'app', 'assets', 'icon.ico');
        if (process.platform === 'linux') return path.join(process.cwd(), 'src', 'app', 'assets', 'icon.png');
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

}

const createTray = () => {
    if (tray) return;

    const trayIconPath = getIconPath();
    const trayImage = nativeImage.createFromPath(trayIconPath);

    const resized = trayImage.resize({ width: 32, height: 32 });

    tray = new Tray(resized);
    tray.setToolTip('Techdoro');

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
                if (mainWindow) {
                    mainWindow.setSkipTaskbar(false);
                    mainWindow.destroy();
                }
                app.quit();
                process.exit(0);
            },
        },
    ]);

    tray.setContextMenu(contextMenu);

}

const createNotification = () => {

    if (!Notification.isSupported()) return;

    ipcMain.on('notifiTimeLong', () => {
        notification = new Notification({
            title: 'Tempo acabou!',
            body: 'Vai dar uma esticada nas pernas!',
            icon: getIconPath(),
            silent: false,
            timeoutType: 'default',
        });

        notification.on('click', () => {
            if (!mainWindow) return;
            mainWindow.setSkipTaskbar(false);
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.show();
            mainWindow.focus();
        });
        notification.show();
    });

    ipcMain.on('notifiTimeShort', () => {
        const notif = new Notification({
            title: 'Intervalo acabou!',
            body: 'Retome os estudos imediatamente!!!',
            icon: getIconPath(),
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
    });
};

ipcMain.on('window-minimize', () => {
    mainWindow?.hide();
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

app.whenReady().then(() => {

    if (process.platform === 'win32') app.setAppUserModelId('com.techdoro.app');

    createWindow();
    createTray();
    createNotification();

});