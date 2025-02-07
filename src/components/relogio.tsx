import { useState, useEffect } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-color: #3c3c3c;
  padding: 20px;
  border: 3px solid black;
  border-radius: 10%;
`

export const Pomodoro = () => {
    const [time, setTime] = useState(25 * 60)
    const [isRunning, setIsRunning] = useState(false)

    useEffect(() => {
        if (!isRunning) return;

        const intervalo = setInterval(() => {
            setTime((time) => {
                if (time === 0) {
                    clearInterval(intervalo)
                    return time
                }
                return time - 1
            })
        }, 1000)

        return () => clearInterval(intervalo)
    }, [isRunning]);

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60)
        const seconds = time % 60
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    }

    return (
        <Container>
            <h1>{formatTime(time)}</h1>
            <button onClick={() => setIsRunning(!isRunning)}>
                {isRunning ? 'Pause' : 'Start'}
            </button>
        </Container>
    )
}