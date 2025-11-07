import styled from 'styled-components'
import Clock from './Clock/Clock'
import { useState, useEffect } from 'react'
import { useSound } from '../../hooks/useSound'
import Volume from './Clock/Clock-Volume'

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
`

const Caixa = styled.div`
    display: flex;
    align-items: center;
    justify-content: start;
    height: 100%;
    width: 30%;
`

const ButtonSwitch = styled.div<{ $clicked: boolean }>`
    border-radius: 50%;
    height: 20px;
    width: 20px;
    margin-left: 10%;
    background-color: ${({ $clicked }) => ($clicked ? '#3C3C3C' : '#3C3C3C')};
    border: 2px ${({ $clicked }) => ($clicked ? 'inset' : 'outset')} gray;
`

type FrameProps = {
    volumeState?: number;
}

export default ({ volumeState }: FrameProps) => {

    const timeMaxLong = 3;
    const timeMaxShort = 3;

    const [clock, setClock] = useState(true);
    const [longClock, setLongClock] = useState({
        timeMax: timeMaxLong,
        timeNow: timeMaxLong,
    });
    const [shortClock, setShortClock] = useState({
        timeNow: timeMaxShort,
        timeMax: timeMaxShort,
    });

    const [playClick] = useSound('click', volumeState);
    const [playAlarm] = useSound("alarm", volumeState);

    const swap = () => {
        setClock(!clock);
    };

    useEffect(() => {
        if (clock && longClock.timeNow === 0) {
            playAlarm();
            setLongClock({ timeMax: timeMaxLong, timeNow: timeMaxLong });
        } else if (!clock && shortClock.timeNow === 0) {
            playAlarm();
            setShortClock({ timeMax: timeMaxShort, timeNow: timeMaxShort });
        }
    }, [longClock.timeNow, shortClock.timeNow]);

    return (
        <Container>
            <Barra>
                <Caixa>
                    <ButtonSwitch onClick={() => { swap(); playClick(); }} $clicked={clock} />
                </Caixa>
                <p>Relógio</p>
                <Volume volumeState={volumeState} />
            </Barra>
            {clock ? (
                <Clock swap={swap} alarm={playAlarm} clock={{ time: longClock, setTime: setLongClock }} type={clock} />
            ) : (
                <Clock swap={swap} alarm={playAlarm} clock={{ time: shortClock, setTime: setShortClock }} type={clock} />
            )}
        </Container>
    );
};