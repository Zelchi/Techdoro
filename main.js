import { app, BrowserWindow, ipcMain, Notification } from 'electron';
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createWindow = () => {
    const win = new BrowserWindow({
        icon: './public/iconTechDoro.png',
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
    win.loadURL('http://localhost:5173');

    ipcMain.on('minimizar', () => {
        win.minimize();
    })

    ipcMain.on('maximizar', () => {
        win.isMaximized() ? win.unmaximize() : win.maximize();
    })

    ipcMain.on('fechar', () => {
        win.close();
    });

    ipcMain.on('notifiTimeLong', () => {
        const title = 'Tempo acabou!'
        const body = 'Vai dar uma esticada nas pernas! ò.ó'
        const silent = true
        const icon = './public/iconTechDoro.png'
        const timeoutType = 'default'
        new Notification({
            title,
            body,
            silent,
            icon,
            timeoutType,
        }).show()
    });

    ipcMain.on('notifiTimeShort', () => {
        const title = 'Intervalo acabou!'
        const body = 'Retome os estudos imediatamente!!! ò.ó'
        const silent = true
        const icon = './public/iconTechDoro.png'
        const timeoutType = 'default'
        new Notification({
            title,
            body,
            silent,
            icon,
            timeoutType,
        }).show()
    });
};

app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
})

app.on("window-all-closed", () => {
    if (process.platform !== 'darwin') app.quit();
})