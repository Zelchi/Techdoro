import styled from 'styled-components'
import { Pomodoro } from './components/relogio'
import { BarraJanela } from './components/global/BarraJanela'
import { Tarefas } from './components/tarefas'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const App = () => {
  return (
    <Container>
      <BarraJanela />
      <Pomodoro/>
      <Tarefas/>
    </Container>
  )
}

export default App