import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', (channel: string, ...args: any[]) => {
    ipcRenderer.send(channel, ...args);
});