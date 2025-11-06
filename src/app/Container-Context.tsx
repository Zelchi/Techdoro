import {
    memo,
    useState,
    useEffect,
    cloneElement,
    useCallback,
    ReactElement,
    Dispatch,
    SetStateAction,
} from 'react';

type InjectedProps = {
    windowState: string;
    clockState: string;
    themeState: string;
    maxTimeState: number;
    volumeState: number;
    setApply: Dispatch<SetStateAction<boolean>>;
};

type Props = {
    children: ReactElement<InjectedProps>;
};

export default memo(({ children }: Props) => {
    const [windowState, setWindow] = useState<string>('home');
    const [clockState, setClock] = useState<string>('longClock');
    const [themeState, setTheme] = useState<string>('dark');
    const [maxTimeState, setMaxTime] = useState<number>(25);
    const [volumeState, setVolume] = useState<number>(50);
    const [applyState, setApply] = useState<boolean>(false);

    const setLocalStorage = useCallback(() => {
        const windowState = localStorage.getItem('window');
        const storedClock = localStorage.getItem('clock');
        const storedTheme = localStorage.getItem('theme');
        const storedTime = localStorage.getItem('time');
        const storedVolume = localStorage.getItem('volume');
        if (windowState) setWindow(windowState || 'home');
        if (storedClock) setClock(storedClock || 'longClock');
        if (storedTheme) setTheme(storedTheme || 'dark');
        if (storedTime) setMaxTime(Number(storedTime) || 25);
        if (storedVolume) setVolume(Number(storedVolume) || 50);
    }, []);

    useEffect(() => {
        if (applyState) setLocalStorage(); setApply(false);
    }, [applyState]);

    return cloneElement(children, {
        windowState,
        clockState,
        themeState,
        maxTimeState,
        volumeState,
        setApply,
    });
});