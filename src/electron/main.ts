import { app, BrowserWindow, ipcMain, Menu, Notification, Tray, nativeImage, Event, screen } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';

if (started) {
    app.quit();
}

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string;
declare const MAIN_WINDOW_VITE_NAME: string;

const getIconPath = (): string => {

    if (app.isPackaged) {
        if (process.platform === 'win32') return path.join(process.resourcesPath, 'icon.ico');
        if (process.platform === 'linux') return path.join(process.resourcesPath, 'icon.png');
    } else {
        if (process.platform === 'win32') return path.join(process.cwd(), 'src', 'renderer', 'app', 'assets', 'icon.ico');
        if (process.platform === 'linux') return path.join(process.cwd(), 'src', 'renderer', 'app', 'assets', 'icon.png');
    }

};

const createWindow = () => {
    const win = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: true,
            sandbox: false,
            devTools: true,
            backgroundThrottling: false,
        },
        width: 500,
        height: 600,
        minWidth: 500,
        minHeight: 600,
        resizable: false,
        frame: false,
        icon: getIconPath(),
        titleBarStyle: 'hidden',
        vibrancy: 'window',
        backgroundMaterial: 'acrylic',
        backgroundColor: '#00000000',
    });

    // const isDev = !!MAIN_WINDOW_VITE_DEV_SERVER_URL && !app.isPackaged;
    // if (isDev) {
    //     win.webContents.openDevTools({ mode: 'detach' });
    // }

    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        win.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
        win.loadFile(
            path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
        );
    }

    ipcMain.on('window-minimize', () => {
        win.hide();
    })

    const notify = new Notification({
        silent: true,
        icon: getIconPath(),
        timeoutType: 'default',
        urgency: 'normal',
    })

    ipcMain.on('notifiTimeLong', () => {
        notify.title = 'Tempo acabou!';
        notify.body = 'Vai dar uma esticada nas pernas!';
        notify.show();
    });

    ipcMain.on('notifiTimeShort', () => {
        notify.title = 'Intervalo acabou!';
        notify.body = 'Retome os estudos imediatamente!!!';
        notify.show();
    });

    notify.on('click', () => {
        if (win.isMinimized()) {
            win.restore();
            win.show();
        } else {
            win.show();
        }
    })

    const tray = new Tray(nativeImage.createFromPath(getIconPath()));

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Show',
            role: 'window',
            type: 'normal',
            click: () => {
                win.show();
            }
        },
        {
            label: 'Exit',
            role: 'quit',
            type: 'normal',
            click: () => {
                app.quit();
            }
        }
    ]);

    tray.setToolTip('Techdoro');
    tray.setContextMenu(contextMenu);
    tray.on('click', () => {
        if (win.isVisible()) return win.focus();
        win.show();
    });
};

if (!app.requestSingleInstanceLock()) {
    app.quit();
} else {
    app.on('second-instance', () => {
        const win = BrowserWindow.getAllWindows()[0];
        if (win) {
            if (win.isMinimized()) {
                win.restore(); win.show();
            } else {
                win.show();
            }
        }
    });

    app.whenReady().then(() => {
        app.setName(app.name)
        app.setAppUserModelId(app.name)
        createWindow();
        app.on("activate", () => {
            if (BrowserWindow.getAllWindows().length === 0) createWindow();
        });
    });

}