import styled from 'styled-components';
import { GoThumbsup } from 'react-icons/go';
import { useCallback } from 'react';
import { setWindow } from '../../store/reducers/windowSlice';
import { setTimeMax } from '../../store/reducers/timeMaxSlice';
import { setCyclesBeforeFinal } from '../../store/reducers/cyclesSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import StepField from './StepField';
import VolumeBar from './VolumeBar';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    top: 38px;
    position: fixed;
    align-items: center;
    justify-content: start;
    width: calc(100% - 28px);
    height: 210px;
    margin-top: 12px;
    background: var(--bg-1);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow-1);
    backdrop-filter: blur(8px) saturate(160%);
`;

const Configs = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    width: 90%;
    justify-content: center;
    margin-top: 10px;
`;

const ConfigBar = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 5px 12px;
`;

const Exit = styled.button`
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
    position: absolute;
    top: 5px;
    right: 12px;

    &:hover { background: var(--bg-3); border-color: var(--border-strong); }
    &:active { filter: brightness(.85); }
`

type ClockProps = { click: () => void };

const clamp1 = (n: number) => Math.max(1, n | 0);

export default ({ click }: ClockProps) => {
    const dispatch = useDispatch();
    const windowStatus = useSelector((state: RootState) => state.window.value);
    const timeState = useSelector((state: RootState) => state.time);
    const cyclesState = useSelector((state: RootState) => state.cycles as { cyclesBeforeFinal: number });

    const timeLong = timeState.LongMax;
    const timeShort = timeState.ShortMax;
    const timeFinal = timeState.FinalMax;
    const cyclesBeforeFinal = cyclesState.cyclesBeforeFinal;

    const values = {
        long: timeLong,
        short: timeShort,
        final: timeFinal,
        cycles: cyclesBeforeFinal
    };

    const fields: { key: 'long' | 'short' | 'final' | 'cycles'; label: string }[] = [
        { key: 'long', label: 'Focus' },
        { key: 'short', label: 'Short Break' },
        { key: 'final', label: 'Long Break' },
        { key: 'cycles', label: 'Cycles' }
    ];

    const toggleWindow = useCallback(() => {
        dispatch(setWindow(!windowStatus));
    }, [dispatch, windowStatus]);

    const updateTimes = useCallback((partial: Partial<{ long: number; short: number; final: number }>) => {
        const nextLong = clamp1(partial.long ?? timeLong);
        const nextShort = clamp1(partial.short ?? timeShort);
        const nextFinal = clamp1(partial.final ?? timeFinal);
        dispatch(setTimeMax({
            timeLongMax: nextLong,
            timeShortMax: nextShort,
            timeFinalMax: nextFinal
        }));
    }, [dispatch, timeLong, timeShort, timeFinal]);

    const adjust = useCallback((field: 'long' | 'short' | 'final' | 'cycles', delta: number) => {
        if (field === 'cycles') {
            dispatch(setCyclesBeforeFinal(clamp1(cyclesBeforeFinal + delta)));
            return;
        }
        const current = field === 'long' ? timeLong : field === 'short' ? timeShort : timeFinal;
        const next = clamp1(current + delta);
        updateTimes({ [field]: next } as Partial<{ long: number; short: number; final: number }>);
    }, [dispatch, cyclesBeforeFinal, timeLong, timeShort, timeFinal, updateTimes]);

    return (
        <Container>
            <ConfigBar>
                <VolumeBar />
                <Exit onClick={() => { toggleWindow(); click(); }}><GoThumbsup /></Exit>
            </ConfigBar>
            <Configs>
                {fields.map(field => (
                    <StepField
                        key={field.key}
                        label={field.label}
                        value={values[field.key]}
                        onDec={() => adjust(field.key, -1)}
                        onInc={() => adjust(field.key, +1)}
                    />
                ))}
            </Configs>
        </Container>
    );
};