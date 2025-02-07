import styled from 'styled-components'
import icon from '../../assets/iconTechDoro.png'

const Barra = styled.div`
    width: 100vw;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: #3c3c3c;
    color: white;
    -webkit-app-region: drag;
`

const Icon = styled.img`
    width: 20px;
    height: 20px;
    margin-left: 5px;
`

const Titulo = styled.h1`
    font-size: 16px;
`

const Caixa1 = styled.div`
    display: flex;
    justify-content: start;
    align-items: center;
    width: 100px;
`

const Caixa2 = styled.div`
    display: flex;
    justify-content: end;
    align-items: center;
    width: 100px;
    gap: 10px;
`

const Minimizar = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid black;
    background-color: #9c9c9c;
`

const Maximizar = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid black;
    background-color: #6c6c6c;
`

const Fechar = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid black;
    background-color: #3c3c3c;
    margin-right: 5px;
`

export const BarraJanela = () => {
    return (
        <Barra>
            <Caixa1>
                <Icon src={icon} />
            </Caixa1>
            <Titulo>Techdoro</Titulo>

            <Caixa2>
                <Minimizar />
                <Maximizar />
                <Fechar />
            </Caixa2>
        </Barra>
    )
}