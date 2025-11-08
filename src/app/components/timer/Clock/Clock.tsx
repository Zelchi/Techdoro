import { SlReload } from 'react-icons/sl'
import BarraProgresso from './Clock-Progress'
import styled from "styled-components"
import { useSound } from '../../../hooks/useSound'

const Caixa = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    padding: 20px;
    width: 100%;
    height: 100%;
    gap: 10px;
`

const Hora = styled.div`
    width: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;

    h1 {
        font-size: 45px;
        text-align: center;
        width: 100%;
    }
`

const Buttons = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 5px;
`

const Button = styled.button`
    font-family: 'Press Start 2P';
    font-size: 15px;
    background-color: #3c3c3c;
    color: white;
    padding: 10px;
    border: 1px solid white;
    background: var(--bg-1);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow-1);
    cursor: pointer;
    
    &:hover { background: var(--bg-3); border-color: var(--border-strong); }
    &:active { filter: brightness(.85); }
`

const Reset = styled(SlReload)`
    width: 30px;
    height: 30px;
    background-color: #3c3c3c;
    border: 1px solid white;
    padding: 5px;
    background: var(--bg-1);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow-1);
    cursor: pointer;

    &:hover { background: var(--bg-3); border-color: var(--border-strong); }
    &:active { filter: brightness(.85); }
`

const Branco = styled.button`
    width: 30px;
    height: 30px;
    background-color: transparent;
    border: none;
`

type ClockProps = {
    reset: () => void;
    clock: {
        timeNow: number;
        timeMax: number;
    }
    running: {
        isRunning: boolean;
        setIsRunning: (value: boolean) => void;
    }
    type: number;
}

export default ({ reset, clock, running, type }: ClockProps) => {

    const [click] = useSound('click');
    const { timeNow, timeMax } = clock;
    const { isRunning, setIsRunning } = running;

    const formatTime = (time: number) => {
        const total = Math.max(0, Math.floor(time));
        const minutes = Math.floor(total / 60);
        const seconds = total - minutes * 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    return (<>
        <Caixa>
            <Hora>
                <h1>{formatTime(timeNow)}</h1>
                <BarraProgresso timeNow={timeNow} timeMax={timeMax} type={type} />
            </Hora>
            <Buttons onClick={click}>
                {!isRunning && !(timeNow === (timeMax)) && <Branco />}
                <Button onClick={() => { setIsRunning(!isRunning) }} >
                    {isRunning ? 'Pause' : 'Start'}
                </Button>
                {!isRunning && !(timeNow === timeMax) && (<Reset onClick={() => reset()}></Reset>)}
            </Buttons>
        </Caixa>
    </>)
}