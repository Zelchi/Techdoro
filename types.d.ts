declare module '*.mp3';
declare module '*.png';
interface Window {
    api: {
        send: (channel: string, ...args: any[]) => void;
        invoke: (channel: string, ...args: any[]) => Promise<any>;
    };
}