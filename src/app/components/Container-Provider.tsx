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
    clock: string;
    setClock: Dispatch<SetStateAction<string>>;
    theme: string;
    setTheme: Dispatch<SetStateAction<string>>;
    time: number;
    setTime: Dispatch<SetStateAction<number>>;
    volume: number;
    setVolume: Dispatch<SetStateAction<number>>;
};

type Props = {
    children: ReactElement<InjectedProps>;
};

export default memo(({ children }: Props) => {
    const [clock, setClock] = useState<string>('longClock');
    const [theme, setTheme] = useState<string>('dark');
    const [time, setTime] = useState<number>(100);
    const [volume, setVolume] = useState<number>(50);

    const getLocalStorage = useCallback(() => {
        const storedClock = localStorage.getItem('clock');
        const storedTheme = localStorage.getItem('theme');
        const storedTime = localStorage.getItem('time');
        const storedVolume = localStorage.getItem('volume');

        if (storedClock) setClock(storedClock);
        if (storedTheme) setTheme(storedTheme);
        if (storedTime) setTime(Number(storedTime));
        if (storedVolume) setVolume(Number(storedVolume));
    }, []);

    useEffect(() => {
        getLocalStorage();
    }, [getLocalStorage]);

    return cloneElement(children, {
        clock,
        setClock,
        theme,
        setTheme,
        time,
        setTime,
        volume,
        setVolume,
    });
});