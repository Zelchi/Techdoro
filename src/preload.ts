import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', ipcRenderer.send);