import styled from 'styled-components'
import Volume from './Clock/Clock-Volume'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    margin-top: 15px;
    width: calc(100% - 30px);
`

const Barra = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #3c3c3c;
    border: 2px inset white;
    width: 100%;
    height: 30px;
`

const Caixa = styled.div`
    display: flex;
    align-items: center;
    justify-content: start;
    height: 100%;
    width: 30%;
`

const ButtonSwitch = styled.div`
    border-radius: 50%;
    height: 20px;
    width: 20px;
    margin-left: 10%;
`

export default () => {

    return (
        <Container>
            <Barra>
                <Caixa>
                    <ButtonSwitch onClick={() => { console.log('click') }} />
                </Caixa>
                <p>Clock</p>
                <Volume />
            </Barra>
        </Container>
    );

};