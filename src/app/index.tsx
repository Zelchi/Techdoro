import { createRoot } from 'react-dom/client';
import { Pomodoro } from './components/Window/Window'
import { BarraJanela } from './components/Window/Window-Bar'
import { Tarefas } from './components/Taskbar/Taskbar'
import styled from 'styled-components'
import './index.css'

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