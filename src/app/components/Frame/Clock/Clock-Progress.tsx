import styled from 'styled-components'

const Caixa = styled.div<{ $clock: boolean }>`
    display: flex;
    justify-content: ${({ $clock }) => $clock ? 'start' : 'end'};
    align-items: center;
    width: 100%;
    background-color: #9C9C9C;
    height: 10px;
    border: 1px solid gray;
    border-radius: 15px;
`

const Barra = styled.div<{ $progresso: number }>`
    background-color: #3C3C3C;
    width: ${({ $progresso }) => ($progresso)}%;
    border: 2px outset gray;
    height: 100%;
    border-radius: 15px;
`

type ProgressBarProps = {
    timeNow: number;
    timeMax: number;
    type: number;
}

export default ({ timeNow, timeMax, type }: ProgressBarProps) => {

    const progresso = (timeNow / timeMax) * 100;
    const progressoInvertido = Math.abs(progresso - 100);

    return (
        <Caixa $clock={(type == 1 || type == 2)}>
            <Barra $progresso={progressoInvertido} />
        </Caixa>
    );
}