import { createRoot } from 'react-dom/client';
import { Pomodoro } from './components/Pomodoro'
import { BarraJanela } from './components/BarraJanela'
import { Tarefas } from './components/tarefa'
import styled from 'styled-components'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    height: 100vh;
    width: 100vw;
`

const root = createRoot(document.body);
root.render(
    <Container>
        <BarraJanela />
        <Pomodoro />
        <Tarefas />
    </Container>
);