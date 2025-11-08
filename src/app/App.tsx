import WindowBar from './components/Window-Bar'
import Menu from './components/Menu/Menu'
import Frame from './components/Frame/Frame'
import Taskbar from './components/Task/Task'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { RootState } from './store/store'
import { useSound } from './hooks/useSound'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    height: 100%;
    width: 100%;
`

export default () => {

    const [click] = useSound('click');
    const [alarm] = useSound('alarm');

    const win = useSelector((state: RootState) => state.window.value);

    return (
        <Container>
            <WindowBar />
            {win ?
                <Frame click={click} alarm={alarm} />
                :
                <Menu click={click} />
            }
            <Taskbar />
        </Container>
    )
}