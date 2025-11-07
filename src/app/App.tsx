import WindowBar from './components/Window-Bar'
import Frame from './components/Frame/Frame'
import Taskbar from './components/Taskbar/Taskbar'
import Config from './components/Config-Menu'
import styled from 'styled-components'
import Context from './Context';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    height: 100%;
    width: 100%;
`

type Props = {
    windowState?: string;
}

export default ({ windowState }: Props) => {
    console.log(windowState);

    return (
        <Container>
            <Context>
                <WindowBar />
            </Context>
            {windowState === 'home' && <Frame />}
            {windowState === 'home' && <Taskbar />}
            {windowState === 'config' && <Config />}
        </Container>
    )
}