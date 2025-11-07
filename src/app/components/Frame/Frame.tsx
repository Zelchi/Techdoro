import styled from 'styled-components'
import Clock from './Clock/Clock'
import { useCallback, useEffect, useState } from 'react'
import { GoChevronRight, GoChevronLeft } from "react-icons/go";
import { useSelector } from 'react-redux';
import { RootState } from 'src/app/store/store';
import { useSound } from '../../hooks/useSound'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    margin-top: 15px;
    width: calc(100% - 30px);
`

const Barra = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #3c3c3c;
    border: 1px solid white;
    width: 100%;
    height: 30px;
    padding: 0 10px;
`

const Caixa = styled.div`
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5px;

    &:nth-child(1) {
        justify-content: start;
    }
    &:nth-child(2) {
        justify-content: center;
    }
    &:nth-child(3) {
        justify-content: end;
    }
`

const Button = styled.button`
    height: 20px;
    width: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: black;
    color: white;
    border: 1px solid white;
    margin: 5px;

    &:hover {
        cursor: pointer;
        background-color: transparent;
    }
`

const Box = styled.div<{ $active?: boolean }>`
    width: 10px;
    height: 10px;
    border: 1px solid white;
    background-color: ${({ $active }) => ($active ? 'white' : 'transparent')};  
`

type Clock = {
    timeNow: number; // seconds remaining
    timeMax: number; // total seconds
}

export default () => {
    const [clock, setClock] = useState<number>(1);
    const [isRunning, setIsRunning] = useState<boolean>(false);

    const { LongMax, ShortMax, FinalMax } = useSelector((state: RootState) => state.time);

    const [longClock, setLongClock] = useState<Clock>({ timeNow: LongMax * 60, timeMax: LongMax * 60 });
    const [shortClock, setShortClock] = useState<Clock>({ timeNow: ShortMax * 60, timeMax: ShortMax * 60 });
    const [finalClock, setFinalClock] = useState<Clock>({ timeNow: FinalMax * 60, timeMax: FinalMax * 60 });

    const [click] = useSound('click');
    const [alarm] = useSound('alarm');

    useEffect(() => {
        setLongClock(prev => {
            const nextMax = LongMax * 60;
            const clampedNow = Math.min(prev.timeNow, nextMax);
            return { timeNow: clampedNow, timeMax: nextMax };
        });
    }, [LongMax]);

    useEffect(() => {
        setShortClock(prev => {
            const nextMax = ShortMax * 60;
            const clampedNow = Math.min(prev.timeNow, nextMax);
            return { timeNow: clampedNow, timeMax: nextMax };
        });
    }, [ShortMax]);

    useEffect(() => {
        setFinalClock(prev => {
            const nextMax = FinalMax * 60;
            const clampedNow = Math.min(prev.timeNow, nextMax);
            return { timeNow: clampedNow, timeMax: nextMax };
        });
    }, [FinalMax]);

    const handleReset = useCallback(() => {
        if (clock === 1) setLongClock({ timeNow: LongMax * 60, timeMax: LongMax * 60 });
        if (clock === 2) setShortClock({ timeNow: ShortMax * 60, timeMax: ShortMax * 60 });
        if (clock === 3) setFinalClock({ timeNow: FinalMax * 60, timeMax: FinalMax * 60 });
    }, [clock, LongMax, ShortMax, FinalMax]);

    const handleNext = useCallback(() => {
        setClock(prev => (prev >= 3 ? 1 : prev + 1));
    }, []);

    const handlePrev = useCallback(() => {
        setClock(prev => (prev <= 1 ? 3 : prev - 1));
    }, []);

    useEffect(() => {
        if (!isRunning) return;
        const interval = setInterval(() => {
            if (clock === 1) {
                setLongClock(prev => ({ ...prev, timeNow: Math.max(prev.timeNow - 1, 0) }));
            } else if (clock === 2) {
                setShortClock(prev => ({ ...prev, timeNow: Math.max(prev.timeNow - 1, 0) }));
            } else {
                setFinalClock(prev => ({ ...prev, timeNow: Math.max(prev.timeNow - 1, 0) }));
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [isRunning, clock]);

    useEffect(() => {
        const current = clock === 1 ? longClock : clock === 2 ? shortClock : finalClock;

        if (isRunning && current.timeNow <= 0) {
            setIsRunning(false);
            alarm();
        }
    }, [isRunning, clock, longClock.timeNow, shortClock.timeNow, finalClock.timeNow, alarm]);

    useEffect(() => {
        setIsRunning(false);
    }, [clock]);

    return (
        <Container>
            <Barra>
                <Caixa><Button onClick={() => { handlePrev(); click(); }}><GoChevronLeft /></Button></Caixa>
                <Caixa><Box $active={clock === 1} /><Box $active={clock === 2} /><Box $active={clock === 3} /></Caixa>
                <Caixa><Button onClick={() => { handleNext(); click(); }}><GoChevronRight /></Button></Caixa>
            </Barra>
            {clock === 1 && <Clock clock={longClock} running={{ isRunning, setIsRunning }} type={clock} reset={handleReset} />}
            {clock === 2 && <Clock clock={shortClock} running={{ isRunning, setIsRunning }} type={clock} reset={handleReset} />}
            {clock === 3 && <Clock clock={finalClock} running={{ isRunning, setIsRunning }} type={clock} reset={handleReset} />}
        </Container>
    );
};