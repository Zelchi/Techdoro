declare global {
    declare module '*.mp3';
    declare module '*.png';
    interface Window {
        api: (channel: string, ...args: any[]) => void;
    }
}
export { };