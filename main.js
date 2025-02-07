import { app, BrowserWindow, ipcMain } from 'electron';
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createWindow = () => {
    const win = new BrowserWindow({
        icon: './src/assets/iconTechDoro.png',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            sandbox: false,
            preload: path.join(__dirname, 'preload.cjs')
        },
        width: 800,
        height: 600,
        minWidth: 500,
        minHeight: 300,
    });
    win.loadURL('http://localhost:5173');

    ipcMain.on('minimizar', () => {
        console.log('minimizar');
        win.minimize();
    })
    
    ipcMain.on('maximizar', () => {
        console.log('maximizar');
        win.maximize();
    })
    
    ipcMain.on('fechar', () => {
        console.log('fechar');
        win.close();
    })
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