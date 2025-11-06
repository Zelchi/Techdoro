import styled from 'styled-components'
import Taskbar from './components/Taskbar/Taskbar'
import Clock from './components/Clock/Clock'
import WindowBar from './components/Window/Window-Bar'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    height: 100vh;
    width: 100vw;
`

export default () => {
    return (
        <Container>
            <WindowBar />
            <Taskbar />
            <Clock />
        </Container>
    )
}