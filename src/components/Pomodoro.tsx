import styled from 'styled-components'
import { Clock } from './relogios/Clock'
import { useState } from 'react'
import { useSound } from '../hooks/useSound'
import { Volume } from './relogios/Volume'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    
    margin-top: 15px;
    width: 90%;
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
    height: 20px;
    width: 20px;
    margin-left: 10%;
    background-color: ${({ $clicked }) => ($clicked ? '#3C3C3C' : '#3C3C3C')};
    border: 2px ${({ $clicked }) => ($clicked ? 'inset' : 'outset')} gray;
`

export const Pomodoro = () => {

    const timeMaxLong = 3
    const timeMaxShort = 3

    const [clock, setClock] = useState(true);
    const [longClock, setLongClock] = useState({
        timeMax: timeMaxLong,
        timeNow: timeMaxLong,
    });
    const [shortClock, setShortClock] = useState({
        timeNow: timeMaxShort,
        timeMax: timeMaxShort,
    });

    const [playClick] = useSound('click');
    const [playAlarm] = useSound("alarm");

    const swap = () => {
        setClock(!clock)
    }

    return (
        <Container>
            <Barra>
                <Caixa>
                    <ButtonSwitch onClick={() => { swap(); playClick() }} $clicked={clock} />
                </Caixa>
                <p>Relógio</p>
                <Volume />
            </Barra>
            {clock ? (
                <Clock swap={swap} alarm={playAlarm} clock={{ time: longClock, setTime: setLongClock }} type={clock} />
            ) : (
                <Clock swap={swap} alarm={playAlarm} clock={{ time: shortClock, setTime: setShortClock }} type={clock} />
            )}
        </Container>
    )
}