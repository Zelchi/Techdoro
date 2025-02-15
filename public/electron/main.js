import { app, BrowserWindow, ipcMain, Notification } from 'electron';
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
        win.close();
    });


    const notifica = new Notification({
        silent: true,
        icon,
        timeoutType: 'default',
    })

    ipcMain.on('notifiTimeLong', () => {
        const title = 'Tempo acabou!'
        const body = 'Vai dar uma esticada nas pernas!'
        notifica.title = title;
        notifica.body = body;
        notifica.show();
    });

    ipcMain.on('notifiTimeShort', () => {
        const title = 'Intervalo acabou!'
        const body = 'Retome os estudos imediatamente!!!'
        notifica.title = title;
        notifica.body = body;
        notifica.show();
    });

    notifica.on('click', () => {
        console.log('Cliquei')
        win.isMinimized() ? win.restore() : win.focus()
    })
};

const NAME_APP = 'Techdoro'

app.whenReady().then(() => {
    app.setName(NAME_APP)
    app.setAppUserModelId(NAME_APP)
    createWindow();
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });

})

app.on("window-all-closed", () => {
    if (process.platform !== 'darwin') app.quit();
})