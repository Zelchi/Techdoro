import { app, BrowserWindow, nativeTheme } from 'electron';
import path from 'path';

const createWindow = () => {
    nativeTheme.themeSource = 'dark';
    const win = new BrowserWindow({
        icon: './src/assets/iconTechDoro.png',
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join('.', 'preload.js'),
        },
        width: 800,
        height: 600,
        minWidth: 500,
        minHeight: 300,
    });
    win.loadURL('http://localhost:5173');
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