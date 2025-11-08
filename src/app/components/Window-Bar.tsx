import { MouseEvent, use, useCallback } from 'react'
import styled from 'styled-components'
import icon from '../assets/icon.png'
import { GoX } from "react-icons/go";
import { RootState } from '../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { setWindow } from '../store/reducers/windowSlice';

const Barra = styled.div`
    width: 100%;
    height: 38px;
    padding: 0 14px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background: var(--bg-1);
    color: var(--text-1);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm) var(--radius-sm) 0 0;
    backdrop-filter: blur(8px) saturate(160%);
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

const Button = styled.button`
    -webkit-app-region: no-drag;
    height: 26px;
    width: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-2);
    color: var(--text-1);
    border: 1px solid var(--border);
    border-radius: var(--radius-xs);
    cursor: pointer;
    font-size: 14px;
    transition: background .15s, border-color .15s, color .15s;

    &:active { filter: brightness(.85); }
    &:hover { background: var(--bg-3); border-color: var(--border-strong); }
`

export default () => {

    const handleDoubleClick = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <Barra onDoubleClick={handleDoubleClick}>
            <Caixa>
                <Button><Icon draggable="false" src={icon} /> </Button>
            </Caixa>
            <Caixa>
                <Titulo>Techdoro</Titulo>
            </Caixa>
            <Caixa>
                <Button onClick={() => { window.api.send('window-close'); }} > <GoX /></Button>
            </Caixa>
        </Barra>
    )
}