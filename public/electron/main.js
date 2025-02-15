import { app, BrowserWindow, ipcMain, Notification, Tray, Menu } from 'electron';
import { fileURLToPath } from "url";
import { isDev } from './utils.js'
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const icon = path.join(__dirname, '../iconTechDoro.png');

const createWindow = () => {
    const win = new BrowserWindow({
        icon,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            sandbox: false,
            preload: path.join(__dirname, 'preload.cjs')
        },
        width: 500,
        height: 600,
        minWidth: 500,
        minHeight: 600,
    });

    (isDev()) ? win.loadURL('http://localhost:5174/') : win.loadFile(path.join(__dirname, '../index.html'))

    ipcMain.on('minimizar', () => {
        win.minimize();
    })

    ipcMain.on('maximizar', () => {
        win.isMaximized() ? win.unmaximize() : win.maximize();
    })

    ipcMain.on('fechar', () => {
        win.hide();
    });

    const notifica = new Notification({
        silent: true,
        icon,
        timeoutType: 'default',
    })

    ipcMain.on('notifiTimeLong', () => {
        notifica.title = 'Tempo acabou!';
        notifica.body = 'Vai dar uma esticada nas pernas!';
        notifica.show();
    });

    ipcMain.on('notifiTimeShort', () => {
        notifica.title = 'Intervalo acabou!';
        notifica.body = 'Retome os estudos imediatamente!!!';
        notifica.show();
    });

    notifica.on('click', () => {
        if (win.isMinimized()) {
            win.show(); win.restore();
        }
        else {
            win.show(); win.focus();
        }
    })

    const tray = new Tray(icon);
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Mostrar Janela',
            icon: path.join(__dirname, '../abrir.png'),
            role: 'window',
            type: 'normal',
            click: () => {
                win.show();
            },
        },
        {
            label: 'Fechar Techdoro',
            icon: path.join(__dirname, '../sair.png'),
            role: 'close',
            type: 'normal',
            click: () => {
                win.close();
            },
        },
    ]);
    tray.setToolTip('Techdoro')
    tray.setContextMenu(contextMenu)
    tray.on('click', () => {
        if (win.isVisible()) {
            win.hide();
        } else {
            win.show();
        }
    });
};

if (!app.requestSingleInstanceLock()) {
    app.quit();
} else {
    app.on('second-instance', () => {
        const win = BrowserWindow.getAllWindows()[0];
        if (win) {
            if (win.isMinimized()) {
                win.show(); win.restore();
            } else {
                win.show(); win.focus();
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

    app.on("window-all-closed", () => {
        if (process.platform !== 'darwin') app.quit();
    });
}