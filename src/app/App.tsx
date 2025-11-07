import WindowBar from './components/Window-Bar'
import Menu from './components/Menu'
import Frame from './components/Frame/Frame'
import Taskbar from './components/Task/Task'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { RootState } from './store/store'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    height: 100%;
    width: 100%;
`

export default () => {

    const win = useSelector((state: RootState) => state.window.value);

    return (
        <Container>
            <WindowBar />
            {win ? <Frame /> : <Menu />}
            <Taskbar />
        </Container>
    )
}