import styled from 'styled-components'
import Volume from './Clock/Clock-Volume'
import { useCallback, useState } from 'react'
import Clock from './Clock/Clock'
import { GoChevronRight } from "react-icons/go";
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
    border: 2px inset white;
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
    background-color: #3c3c3c;
    color: white;
    border: 2px inset black;

    &:hover {
        cursor: pointer;
        background-color: #4c4c4c;
    }
`

type Clock = {
    timeNow: number;
    timeMax: number;
}

export default () => {
    const [clock, setClock] = useState<number>(1);

    const { LongMax, ShortMax, FinalMax } = useSelector((state: RootState) => state.time);
    const [longClock, setLongClock] = useState<Clock>({ timeNow: 0, timeMax: LongMax });
    const [shortClock, setShortClock] = useState<Clock>({ timeNow: 0, timeMax: ShortMax });
    const [finalClock, setFinalClock] = useState<Clock>({ timeNow: 0, timeMax: FinalMax });

    const [playClick] = useSound('click');
    const [playAlarm] = useSound("alarm");

    const handleReset = useCallback(() => {
        if (clock === 1) {
            setLongClock({ timeNow: 0, timeMax: LongMax });
        }
        if (clock === 2) {
            setShortClock({ timeNow: 0, timeMax: ShortMax });
        }
        if (clock === 3) {
            setFinalClock({ timeNow: 0, timeMax: FinalMax });
        }
    }, [clock]);

    const handleClick = useCallback(() => {
        const next = clock + 1;
        if (next > 3) {
            setClock(1);
        } else {
            setClock(next);
        }
    }, [clock]);

    return (
        <Container>
            <Barra>
                <Caixa><Button onClick={handleClick}><GoChevronRight /></Button></Caixa>
                <Caixa>{clock}</Caixa>
                <Caixa>B3</Caixa>
            </Barra>
            {clock === 1 && <Clock swap={handleClick} alarm={playAlarm} clock={longClock} type={clock} reset={handleReset} />}
            {clock === 2 && <Clock swap={handleClick} alarm={playAlarm} clock={shortClock} type={clock} reset={handleReset} />}
            {clock === 3 && <Clock swap={handleClick} alarm={playAlarm} clock={finalClock} type={clock} reset={handleReset} />}
        </Container>
    );

};