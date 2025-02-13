import { useState } from 'react'
import styled from 'styled-components'
import icon from '../../public/iconTechDoro.png'

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
    height: 20px;
    width: 20px;
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
    gap: 5px;
`

const Minimizar = styled.div<{ $minicolor: boolean }>`
    -webkit-app-region: no-drag;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px inset black;
    cursor: pointer;
    background-color: ${({ $minicolor }) => ($minicolor ? '#bcff92' : '#3f5e2c')};
`

const Maximizar = styled.div`
    -webkit-app-region: no-drag;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px inset black;
    background-color: #244064;

    &:hover {
        cursor: pointer;
        background-color: #77b2ff;
    }
`

const Fechar = styled.div`
    -webkit-app-region: no-drag;
    width: 20px;
    height: 20px;
    margin-right: 3px;
    border-radius: 50%;
    border: 2px inset black;
    background-color: #682323;

    &:hover {
        cursor: pointer;
        background-color: #ff5454;
    }
`

export const BarraJanela = () => {
    const [miniColor, setMiniColor] = useState(false);

    return (
        <Barra>
            <Caixa1>
                <Icon src={icon} />
            </Caixa1>

            <Titulo>Techdoro</Titulo>

            <Caixa2>
                <Minimizar
                    onMouseMove={() => { setMiniColor(true) }}
                    onMouseOut={() => { setMiniColor(false) }}
                    onClick={() => { window.api('minimizar'); setMiniColor(false) }}
                    $minicolor={miniColor}
                />

                <Maximizar onClick={() => { window.api('maximizar') }} />

                <Fechar onClick={() => { window.api('fechar'); }} />
            </Caixa2>
        </Barra>
    )
}