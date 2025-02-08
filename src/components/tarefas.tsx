import styled from 'styled-components'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    margin-top: 3%;
    width: 90%;
    border: 2px solid black;
    border-radius: 10px;
    background-color: #3c3c3c;
`

const Barra = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    border-bottom: 2px solid black;
`

const Caixa = styled.div`
    width: 100%;
    background-color: gray;
`

export const Tarefas = () => {
    return (
        <Container>
            <Barra><p>Tarefas</p></Barra> 
            <Caixa>
                aaaaaaaaaaaaa
            </Caixa>
        </Container>
    )
}