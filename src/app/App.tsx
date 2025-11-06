import WindowBar from './components/Window-Bar'
import Frame from './components/Frame/Frame'
import Taskbar from './components/Taskbar/Taskbar'
import styled from 'styled-components'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    height: 100%;
    width: 100%;
`

export default () => {
    return (
        <Container>
            <WindowBar />
            <Frame />
            <Taskbar />
        </Container>
    )
}