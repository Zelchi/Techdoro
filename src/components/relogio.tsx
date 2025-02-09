import { useState, useEffect, useRef } from 'react'
import { SlReload } from "react-icons/sl";
import click from '../sound/click.mp3'
import alarme from '../sound/alarme.mp3'
import styled from 'styled-components'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    
    margin-top: 3%;
    width: 90%;
`

const Barra = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    background-color: #3c3c3c;
    border: 2px inset white;
`

const Caixa = styled.div`
    font-family: 'Press Start 2P';
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    background-color: #5c5c5c;

    padding: 10px;
    width: 100%;

    border: 2px inset white;
    border-top: none;
`

const Buttons = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
    margin-bottom: 10px;
    gap: 5px;
`

const Button = styled.button`
    font-family: 'Press Start 2P';
    font-size: 15px;
    background-color: #3c3c3c;
    color: white;
    padding: 10px;
    border: none;
    border: 2px inset white;
    
    &:hover {
        cursor: pointer;
        background-color: #4c4c4c;
    }
`

const Reset = styled(SlReload)`
    width: 30px;
    height: 30px;
    padding: 5px;

    &:hover {
        cursor: pointer;
        background-color: #4c4c4c;
    }
`

const Branco = styled.button`
    width: 30px;
    height: 30px;
    background-color: transparent;
    border: none;
`

export const Pomodoro = () => {
    const tempo = 25 * 60

    const [time, setTime] = useState(tempo)
    const [isRunning, setIsRunning] = useState(false)
    const audioClick = useRef<HTMLAudioElement>(null)
    const audioAlarme = useRef<HTMLAudioElement>(null)
    const startTimeRef = useRef<number | null>(null)

    useEffect(() => {
        if (!isRunning) return;

        startTimeRef.current = Date.now();

        const intervalo = setInterval(() => {
            setTime(() => {
                const elapsed = Math.floor((Date.now() - (startTimeRef.current || 0)) / 1000);
                const newTime = tempo - elapsed;

                if (newTime <= 0) {
                    clearInterval(intervalo)
                    playAlarme()
                    setIsRunning(false);
                    setTime(tempo);
                    return 0;
                }

                return newTime;
            })
        }, 1000)

        return () => clearInterval(intervalo)
    }, [isRunning]);

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60)
        const seconds = time % 60
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    }

    const playClick = (): void => {
        if (audioClick.current) {
            audioClick.current.volume = 0.3;
            audioClick.current?.play()
        }
    }

    const playAlarme = (): void => {
        if (audioAlarme.current) {
            audioAlarme.current.volume = 0.3;
            audioAlarme.current?.play()
        }
    }

    return (
        <>

            <Container>
                <Barra><p>Relógio</p></Barra>
                <Caixa>
                    <h1>{formatTime(time)}</h1>
                    <Buttons>
                        {!isRunning && !(time === (tempo)) && <Branco />}
                        <Button onClick={() => { setIsRunning(!isRunning); playClick() }} >
                            {isRunning ? 'Pause' : 'Start'}
                        </Button>
                        {!isRunning && !(time === (tempo)) && (<Reset onClick={() => { setTime(tempo); playClick() }}></Reset>)}
                    </Buttons>
                </Caixa>
            </Container>
            <audio ref={audioClick}>
                <source src={click} type="audio/mpeg" />
            </audio>
            <audio ref={audioAlarme}>
                <source src={alarme} type="audio/mpeg" />
            </audio>
        </>
    )
}