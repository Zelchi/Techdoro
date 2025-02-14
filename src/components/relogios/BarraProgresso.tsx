import { ReactElement } from 'react';
import styled from 'styled-components'

const Caixa = styled.div`
    display: flex;
    justify-content: start;
    align-items: center;
    width: 100%;
    background-color: #9C9C9C;
    height: 10px;
    border: 2px inset gray;
`;

const Barra = styled.div<{ $progresso: number }>`
    background-color: #3C3C3C;
    width: ${({ $progresso }) => ($progresso)}%;
    border: 2px outset gray;
    height: 100%;
`;

export function BarraProgresso({ timeNow, timeMax }: time): ReactElement {

    const progresso = (timeNow / timeMax) * 100;
    const progressoInvertido = Math.abs(progresso - 100);

    return (
        <Caixa >
            <Barra $progresso={progressoInvertido} />
        </Caixa>
    );
}