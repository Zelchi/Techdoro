import { useState, useRef, useEffect } from 'react'
import { useSound } from '../../hooks/useSound'
import { SlReload } from 'react-icons/sl'
import styled from "styled-components"

const Caixa = styled.div`
    font-family: 'Press Start 2P';
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    background-color: #1c2c2c;

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
    border: 2px inset white;
    
    &:hover {
        cursor: pointer;
        background-color: #4c4c4c;
    }
`

const Reset = styled(SlReload)`
    width: 30px;
    height: 30px;
    background-color: #3c3c3c;
    border: 2px inset white;
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

export const ShortClock = ({ swap, alarm, clock }: propClock) => {
    const { time: { timeMax, timeNow }, setTime } = clock;

    const [isRunning, setIsRunning] = useState(false)
    const [playClick] = useSound("click");

    const startTimeRef = useRef<number | null>(null)

    useEffect(() => {
        if (!isRunning) return;

        startTimeRef.current = Date.now() - (timeMax - timeNow) * 1000;

        const intervalo = setInterval(() => {
            const elapsed = Math.floor((Date.now() - (startTimeRef.current || 0)) / 1000);
            const newTime = timeMax - elapsed;

            if (newTime <= 0) {
                setTime({ timeNow: timeMax, timeMax });
                alarm();
                swap();
            } else {
                setTime({ timeNow: newTime, timeMax });
            }

        }, 1000)

        return () => clearInterval(intervalo)
    }, [isRunning, timeMax, timeNow, alarm, swap, setTime]);

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60)
        const seconds = time % 60
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    }

    return (<>
        <Caixa>
            <h1>{formatTime(timeNow)}</h1>
            <Buttons onClick={playClick}>
                {!isRunning && !(timeNow === (timeMax)) && <Branco />}
                <Button onClick={() => { setIsRunning(!isRunning) }} >
                    {isRunning ? 'Pause' : 'Start'}
                </Button>
                {!isRunning && !(timeNow === timeMax) && (<Reset onClick={() => clock.setTime({ timeNow: timeMax, timeMax })}></Reset>)}
            </Buttons>
        </Caixa>
    </>)
}