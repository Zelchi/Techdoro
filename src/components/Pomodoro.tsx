import styled from 'styled-components'
import { LongClock } from './relogios/LongClock'
import { ShortClock } from './relogios/ShortClock'
import { useState } from 'react'

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
    width: 100%;
    background-color: #3c3c3c;
    border: 2px inset white;
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

const Volume = styled.div`
    height: 100%;
    width: 30%;
`

export const Pomodoro = () => {
    const [clock, setClock] = useState(true);

    const troca = () => {
        setClock(!clock)
    }

    return (
        <Container>
            <Barra>
                <Caixa>
                    <ButtonSwitch onClick={troca} $clicked={clock} />
                </Caixa>
                <p>Relógio</p>
                <Volume></Volume>
            </Barra>
            {clock ? <LongClock /> : <ShortClock />}
        </Container>
    )
}