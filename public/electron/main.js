import { app, BrowserWindow, ipcMain, Notification, Tray, Menu } from 'electron';
import { fileURLToPath } from "url";
import { isDev } from './utils.js';
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const icon = path.join(__dirname, '../iconTechDoro.png');

let winClock;
let winTasks;

const createClockWindow = () => {
    winClock = new BrowserWindow({
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

    (isDev()) ? winClock.loadURL('http://localhost:5173/#/clock') : winClock.loadFile(path.join(__dirname, '../index.html'), { hash: 'clock' });

    winClock.on('closed', () => {
        winClock = null;
    });
};

const createTasksWindow = () => {
    winTasks = new BrowserWindow({
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

    (isDev()) ? winTasks.loadURL('http://localhost:5173/#/tasks') : winTasks.loadFile(path.join(__dirname, '../index.html'), { hash: 'tasks' });

    winTasks.on('closed', () => {
        winTasks = null;
    });
};

app.whenReady().then(() => {
    createClockWindow();
    createTasksWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createClockWindow();
            createTasksWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== 'darwin') app.quit();
});