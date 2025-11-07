import {
    memo,
    useState,
    useEffect,
    cloneElement,
    useCallback,
    ReactElement,
} from 'react';

type InjectedProps = {
    setWindow: (path: 'home' | 'config') => void;
    setClock: (value: string) => void;
    setTheme: (value: string) => void;
    setMaxTime: (value: string) => void;
    setVolume: (value: string) => void;
    windowState: string;
    clockState: string;
    themeState: string;
    maxTimeState: string;
    volumeState: string;
};

type Props = {
    children: ReactElement<InjectedProps>;
};

export default memo(({ children }: Props) => {
    const [windowState, setWindowState] = useState<string>('home');
    const [clockState, setClockState] = useState<string>('longClock');
    const [themeState, setThemeState] = useState<string>('dark');
    const [maxTimeState, setMaxTimeState] = useState<string>('25-5');
    const [volumeState, setVolumeState] = useState<string>('50');

    const setLocalStorage = useCallback(() => {
        setWindowState(localStorage.getItem('window') ?? 'home');
        setClockState(localStorage.getItem('clock') ?? 'longClock');
        setThemeState(localStorage.getItem('theme') ?? 'dark');
        setMaxTimeState(localStorage.getItem('time') ?? '25-5');
        setVolumeState(localStorage.getItem('volume') ?? '50');
    }, []);

    useEffect(() => {
        setLocalStorage();
    }, []);

    const setWindow = useCallback((path: 'home' | 'config') => {
        setWindowState(path);
        localStorage.setItem('window', path);
    }, []);

    const setClock = useCallback((value: string) => {
        setClockState(value);
        localStorage.setItem('clock', value);
    }, []);

    const setTheme = useCallback((value: string) => {
        setThemeState(value);
        localStorage.setItem('theme', value);
    }, []);

    const setMaxTime = useCallback((value: string) => {
        setMaxTimeState(value);
        localStorage.setItem('time', value);
    }, []);

    const setVolume = useCallback((value: string) => {
        setVolumeState(value);
        localStorage.setItem('volume', value);
    }, []);

    return cloneElement(children, {
        setWindow,
        setClock,
        setTheme,
        setMaxTime,
        setVolume,
        windowState,
        clockState,
        themeState,
        maxTimeState,
        volumeState,
    });
});