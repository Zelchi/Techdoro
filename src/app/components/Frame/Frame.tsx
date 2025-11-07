import styled from 'styled-components'
import Volume from './Clock/Clock-Volume'
import { useState } from 'react'
import Clock from './Clock/Clock'
import { GoChevronRight } from "react-icons/go";

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
    padding: 0 10px;
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

const Button = styled.button`
    height: 20px;
    width: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #3c3c3c;
    color: white;
    border: 2px inset black;

    &:hover {
        cursor: pointer;
        background-color: #4c4c4c;
    }
`

export default () => {
    const [clock, setClock] = useState<number>(1);

    return (
        <Container>
            <Barra>
                <Caixa><Button><GoChevronRight /></Button></Caixa>
                <Caixa>B2</Caixa>
                <Caixa>B3</Caixa>
            </Barra>
            {/* {clock === 1 && <Clock />}
            {clock === 2 && <Clock />}
            {clock === 3 && <Clock />} */}
        </Container>
    );

};