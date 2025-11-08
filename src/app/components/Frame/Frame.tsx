import styled from 'styled-components'
import Clock from './Clock/Clock'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { GoTools, GoIssueReopened } from "react-icons/go";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { setWindow } from '../../store/reducers/windowSlice';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: start;
    margin-top: 12px;
    width: calc(100% - 28px);
    height: 210px;
    gap: 12px;
`

const Barra = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 42px;
    padding: 12px;
    background: var(--bg-1);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow-1);
    backdrop-filter: blur(8px) saturate(160%);
`

const Caixa = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;

    &:nth-child(1) { justify-content: flex-start; }
    &:nth-child(2) { justify-content: center; }
    &:nth-child(3) { justify-content: flex-end; }
`

const Button = styled.button`
    height: 30px;
    width: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-2);
    color: var(--text-1);
    border: 1px solid var(--border);
    margin: 0;
    border-radius: var(--radius-xs);
    font-size: 16px;
    cursor: pointer;
    transition: background .15s, border-color .15s, color .15s;

    &:hover { background: var(--bg-3); border-color: var(--border-strong); }
    &:active { filter: brightness(.85); }
`

const Box = styled.div<{ $active?: boolean }>`
    width: 10px;
    height: 10px;
    border: 1px solid var(--border-strong);
    background-color: ${({ $active }) => ($active ? 'var(--accent-strong)' : 'transparent')};
    border-radius: 4px;
    transition: background .25s, box-shadow .25s;
    box-shadow: ${({ $active }) => ($active ? '0 0 0 3px rgba(110,231,255,0.25)' : 'none')};
`

type ClockT = { timeNow: number; timeMax: number };

type FrameProps = {
    click: () => void;
    alarm: () => void;
}

export default ({ click, alarm }: FrameProps) => {
    const [clock, setClock] = useState<number>(1);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [focusCyclesDone, setFocusCyclesDone] = useState<number>(0);

    const { LongMax, ShortMax, FinalMax } = useSelector((state: RootState) => state.time);
    const { cyclesBeforeFinal } = useSelector((state: RootState) => state.cycles);
    const maxima = [LongMax, ShortMax, FinalMax];

    const [clocks, setClocks] = useState<ClockT[]>(
        () => maxima.map(m => ({ timeNow: m * 60, timeMax: m * 60 }))
    );

    const [startedAt, setStartedAt] = useState<number | null>(null);
    const [now, setNow] = useState<number>(() => Date.now());
    const rafRef = useRef<number | null>(null);

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
        const state = clocks[id - 1];
        if (isRunning && startedAt != null && id === clock) {
            // Se o "now" ainda não alcançou o startedAt (primeiro frame após resume), evita salto positivo.
            const rawElapsedMs = now - startedAt;
            const elapsed = rawElapsedMs > 0 ? rawElapsedMs / 1000 : 0;
            return Math.max(state.timeNow - elapsed, 0);
        }
        return state.timeNow;
    }, [clocks, isRunning, startedAt, now, clock]);

    const commitElapsedForCurrent = useCallback((ts = Date.now()) => {
        if (startedAt == null) return;
        const elapsed = (ts - startedAt) / 1000;
        setClocks(prev =>
            prev.map((c, i) =>
                i + 1 === clock ? { ...c, timeNow: Math.max(c.timeNow - elapsed, 0) } : c
            )
        );
    }, [clock, startedAt]);

    useLayoutEffect(() => {
        if (isRunning) {
            // Resume: inicializa somente se não havia timestamp e sincroniza "now" para evitar elapsed negativo.
            if (startedAt == null) {
                const t = Date.now();
                setStartedAt(t);
                setNow(t); // alinha primeiro frame
            }
            return;
        }
        // Pause: consolida o tempo uma única vez.
        if (startedAt != null) {
            commitElapsedForCurrent();
            setStartedAt(null);
        }
    }, [isRunning, commitElapsedForCurrent, startedAt]);

    const handleReset = useCallback(() => {
        setIsRunning(false);
        setStartedAt(null);
        setClocks(prev => prev.map((c, i) => i + 1 === clock ? { timeNow: maxima[i] * 60, timeMax: maxima[i] * 60 } : c));
    }, [clock, maxima]);

    const handleNext = useCallback(() => {
        if (startedAt != null) commitElapsedForCurrent();
        setIsRunning(false);
        setStartedAt(null);
        setClock(prev => (prev >= 3 ? 1 : prev + 1));
    }, [commitElapsedForCurrent, startedAt]);

    useEffect(() => {
        setClocks(prev => prev.map((c, i) => {
            const newMax = maxima[i] * 60;
            let base = c.timeNow;
            if (isRunning && clock === i + 1 && startedAt != null) {
                const elapsed = (Date.now() - startedAt) / 1000;
                base = Math.max(c.timeNow - elapsed, 0);
            }
            return { timeNow: Math.min(base, newMax), timeMax: newMax };
        }));
        if (isRunning) setStartedAt(Date.now());
    }, [LongMax, ShortMax, FinalMax]);

    useEffect(() => {
        if (!isRunning || startedAt == null) return;
        const remaining = computeRemainingFor(clock);
        if (remaining <= 0) {

            setClocks(prev => prev.map((c, i) => (i + 1 === clock ? { ...c, timeNow: 0 } : c)));

            setIsRunning(false);
            setStartedAt(null);

            alarm();
            try {
                if (clock === 1) {
                    window.api('notifiTimeLong'); 
                } else {
                    window.api('notifiTimeShort'); 
                }
            } catch (error) {
                console.error(error);
            }

            let nextClock = 1 as 1 | 2 | 3;
            if (clock === 1) {
                const nextCount = focusCyclesDone + 1;
                if (nextCount >= cyclesBeforeFinal) {
                    nextClock = 3; 
                    setFocusCyclesDone(0); 
                } else {
                    nextClock = 2;
                    setFocusCyclesDone(nextCount);
                }
            } else {
                nextClock = 1;
            }

            setClocks(prev => prev.map((c, i) => (i + 1 === nextClock ? { ...c, timeNow: c.timeMax } : c)));
            setClock(nextClock);
        }
    }, [now, isRunning, startedAt, clock, computeRemainingFor, alarm, focusCyclesDone, cyclesBeforeFinal]);

    const activeState = clocks[clock - 1];
    const activeRemaining = computeRemainingFor(clock);
    const activeClockProp: ClockT = { timeNow: activeRemaining, timeMax: activeState.timeMax };

    const dispatch = useDispatch();
    const windowStatus = useSelector((state: RootState) => state.window.value);

    const handleClick = useCallback(() => {
        dispatch(setWindow(!windowStatus));
    }, [dispatch, windowStatus]);

    return (
        <Container>
            <Barra>
                <Caixa>
                    <Button onClick={() => { handleNext(); click(); }}><GoIssueReopened /></Button>
                </Caixa>
                <Caixa>
                    <Box $active={clock === 1} />
                    <Box $active={clock === 2} />
                    <Box $active={clock === 3} />
                </Caixa>
                <Caixa>
                    <Button onClick={() => { handleClick(); click(); }}><GoTools /></Button>
                </Caixa>
            </Barra>
            <Clock
                clock={activeClockProp}
                running={{ isRunning, setIsRunning }}
                type={clock}
                reset={handleReset}
            />
        </Container>
    );
};