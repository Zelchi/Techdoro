import styled from 'styled-components'
import Clock from './Clock/Clock'
import { useCallback, useEffect, useRef, useState } from 'react'
import { GoTools, GoIssueReopened } from "react-icons/go";
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

type ClockT = {
    timeNow: number; // seconds remaining
    timeMax: number; // total seconds
}

export default () => {
    const [clock, setClock] = useState<number>(1);
    const [isRunning, setIsRunning] = useState<boolean>(false);

    const { LongMax, ShortMax, FinalMax } = useSelector((state: RootState) => state.time);

    const [longClock, setLongClock] = useState<ClockT>({ timeNow: LongMax * 60, timeMax: LongMax * 60 });
    const [shortClock, setShortClock] = useState<ClockT>({ timeNow: ShortMax * 60, timeMax: ShortMax * 60 });
    const [finalClock, setFinalClock] = useState<ClockT>({ timeNow: FinalMax * 60, timeMax: FinalMax * 60 });

    const [startedAt, setStartedAt] = useState<number | null>(null);
    const [now, setNow] = useState<number>(() => Date.now());
    const rafRef = useRef<number | null>(null);

    const [click] = useSound('click');
    const [alarm] = useSound('alarm');

    useEffect(() => {
        if (!isRunning) return;
        const tick = () => {
            setNow(Date.now());
            rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        };
    }, [isRunning]);

    const computeRemainingFor = useCallback((id: number) => {
        const state = id === 1 ? longClock : id === 2 ? shortClock : finalClock;
        if (isRunning && startedAt != null && id === clock) {
            const elapsed = (now - startedAt) / 1000;
            return Math.max(state.timeNow - elapsed, 0);
        }
        return state.timeNow;
    }, [longClock.timeNow, shortClock.timeNow, finalClock.timeNow, isRunning, startedAt, now, clock]);

    const commitElapsedForCurrent = useCallback((ts = Date.now()) => {
        if (startedAt == null) return;
        const elapsed = (ts - startedAt) / 1000;
        if (clock === 1) {
            setLongClock(prev => ({ ...prev, timeNow: Math.max(prev.timeNow - elapsed, 0) }));
        } else if (clock === 2) {
            setShortClock(prev => ({ ...prev, timeNow: Math.max(prev.timeNow - elapsed, 0) }));
        } else {
            setFinalClock(prev => ({ ...prev, timeNow: Math.max(prev.timeNow - elapsed, 0) }));
        }
    }, [clock, startedAt]);

    useEffect(() => {
        if (isRunning) {
            setStartedAt(Date.now());
        } else {
            if (startedAt != null) commitElapsedForCurrent();
            setStartedAt(null);
        }
    }, [isRunning]);

    const handleReset = useCallback(() => {
        setIsRunning(false);
        setStartedAt(null);
        if (clock === 1) setLongClock({ timeNow: LongMax * 60, timeMax: LongMax * 60 });
        if (clock === 2) setShortClock({ timeNow: ShortMax * 60, timeMax: ShortMax * 60 });
        if (clock === 3) setFinalClock({ timeNow: FinalMax * 60, timeMax: FinalMax * 60 });
    }, [clock, LongMax, ShortMax, FinalMax]);

    const handleNext = useCallback(() => {
        if (startedAt != null) commitElapsedForCurrent();
        setIsRunning(false);
        setStartedAt(null);
        setClock(prev => (prev >= 3 ? 1 : prev + 1));
    }, [commitElapsedForCurrent, startedAt]);

    useEffect(() => {
        const nextMax = LongMax * 60;
        setLongClock(prev => {
            let base = prev.timeNow;
            if (isRunning && clock === 1 && startedAt != null) {
                const elapsed = (Date.now() - startedAt) / 1000;
                base = Math.max(prev.timeNow - elapsed, 0);
            }
            return { timeNow: Math.min(base, nextMax), timeMax: nextMax };
        });
        if (isRunning && clock === 1) setStartedAt(Date.now());
    }, [LongMax]);

    useEffect(() => {
        const nextMax = ShortMax * 60;
        setShortClock(prev => {
            let base = prev.timeNow;
            if (isRunning && clock === 2 && startedAt != null) {
                const elapsed = (Date.now() - startedAt) / 1000;
                base = Math.max(prev.timeNow - elapsed, 0);
            }
            return { timeNow: Math.min(base, nextMax), timeMax: nextMax };
        });
        if (isRunning && clock === 2) setStartedAt(Date.now());
    }, [ShortMax]);

    useEffect(() => {
        const nextMax = FinalMax * 60;
        setFinalClock(prev => {
            let base = prev.timeNow;
            if (isRunning && clock === 3 && startedAt != null) {
                const elapsed = (Date.now() - startedAt) / 1000;
                base = Math.max(prev.timeNow - elapsed, 0);
            }
            return { timeNow: Math.min(base, nextMax), timeMax: nextMax };
        });
        if (isRunning && clock === 3) setStartedAt(Date.now());
    }, [FinalMax]);

    useEffect(() => {
        if (!isRunning || startedAt == null) return;
        const remaining = computeRemainingFor(clock);
        if (remaining <= 0) {
            if (clock === 1) setLongClock(prev => ({ ...prev, timeNow: 0 }));
            else if (clock === 2) setShortClock(prev => ({ ...prev, timeNow: 0 }));
            else setFinalClock(prev => ({ ...prev, timeNow: 0 }));
            setIsRunning(false);
            setStartedAt(null);
            alarm();
        }
    }, [now, isRunning, startedAt, clock, computeRemainingFor, alarm]);

    const activeState = clock === 1 ? longClock : clock === 2 ? shortClock : finalClock;
    const activeRemaining = computeRemainingFor(clock);
    const activeClockProp: ClockT = { timeNow: activeRemaining, timeMax: activeState.timeMax };

    return (
        <Container>
            <Barra>
                <Caixa><Button onClick={() => { handleNext(); click(); }}><GoIssueReopened /></Button></Caixa>
                <Caixa><Box $active={clock === 1} /><Box $active={clock === 2} /><Box $active={clock === 3} /></Caixa>
                <Caixa><Button onClick={() => { click(); }}><GoTools /></Button></Caixa>
            </Barra>
            {clock === 1 && <Clock clock={activeClockProp} running={{ isRunning, setIsRunning }} type={clock} reset={handleReset} />}
            {clock === 2 && <Clock clock={activeClockProp} running={{ isRunning, setIsRunning }} type={clock} reset={handleReset} />}
            {clock === 3 && <Clock clock={activeClockProp} running={{ isRunning, setIsRunning }} type={clock} reset={handleReset} />}
        </Container>
    );
};