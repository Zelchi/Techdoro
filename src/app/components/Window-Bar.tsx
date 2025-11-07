import { MouseEvent } from 'react'
import styled from 'styled-components'
import icon from '../assets/icon.png'
import { GoX } from "react-icons/go";

const Barra = styled.div`
    width: 100%;
    height: 30px;
    padding: 0 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background-color: #3c3c3c;
    color: white;
    -webkit-app-region: drag;
`

const Caixa = styled.div`
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 5px;

    &:nth-child(1) {
        justify-content: start;
    }
    &:nth-child(2) {
        justify-content: center;
    }
    &:nth-child(3) {
        justify-content: end;
    }
`

const Icon = styled.img`
    height: 80%;
`

const Titulo = styled.div`
    font-size: 14px;
`

const Button = styled.div`
    -webkit-app-region: no-drag;
    border: 1px solid black;
    cursor: pointer;

    &:hover {
        background-color: #1c1c1c;
    }
`

export default () => {

    const handleDoubleClick = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <Barra onDoubleClick={handleDoubleClick}>
            <Caixa>
                <Icon src={icon} />
            </Caixa>
            <Caixa>
                <Titulo>Techdoro</Titulo>
            </Caixa>
            <Caixa>
                <Button onClick={() => { window.api('window-close'); }} > <GoX /></Button>
            </Caixa>
        </Barra>
    )
}