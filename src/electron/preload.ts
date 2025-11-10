import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
    send: (channel: string, ...args: any[]) => {
        const validChannels = [
            'window-minimize',
            'window-maximize',
            'window-unmaximize',
            'window-close',
            'notifiTimeLong',
            'notifiTimeShort',
        ];
        
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, ...args);
        }
    },
    invoke: async (channel: string, ...args: any[]) => {
        const validChannels = [
            'window-minimize',
            'window-maximize',
            'window-unmaximize',
            'window-close',
            'window-is-maximized',
            'window-toggle-fullscreen',
            'window-is-fullscreen',
        ];
        
        if (validChannels.includes(channel)) {
            return await ipcRenderer.invoke(channel, ...args);
        }
    }
});