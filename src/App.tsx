import styled from 'styled-components'
import { Pomodoro } from './components/Pomodoro'
import { BarraJanela } from './components/BarraJanela'
import { Tarefas } from './components/tarefa'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    height: 100vh;
    width: 100vw;
`

const App = () => {
    return (
        <Container>
            <BarraJanela />
            <Pomodoro />
            <Tarefas />
        </Container>
    )
}

export default App