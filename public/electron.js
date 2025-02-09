import { app, BrowserWindow, ipcMain } from 'electron';
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createWindow = () => {
    const win = new BrowserWindow({
        icon: 'iconTechDoro.png',
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            sandbox: false,
            preload: path.join(__dirname, 'preload.cjs')
        },
        width: 500,
        height: 600,
        maxWidth: 500,
        maxHeight: 600,
        minWidth: 500,
        minHeight: 600,
        resizable: false,
    });
    win.loadFile(path.join(__dirname, 'index.html'));

    ipcMain.on('minimizar', () => {
        win.minimize();
    })

    ipcMain.on('maximizar', () => {
        win.isMaximized() ? win.unmaximize() : win.maximize();
    })

    ipcMain.on('fechar', () => {
        win.close();
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