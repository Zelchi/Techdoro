import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useSound } from '../../../hooks/useSound'

const Caixa = styled.div`
    display: flex;
    align-items: center;
    justify-content: end;
    height: 100%;
    width: 30%;
`

const BarraVolume = styled.input`
    height: 20px;
    width: 100%;
    margin-right: 3px;
    background-color: #313136;
    border: 2px inset white;
    outline: none;
    &::-webkit-slider-thumb {
        height: 20px;
        width: 20px;
        background-color: #3C3C3C;
        border: 2px outset gray;
        cursor: pointer;
    }
    border-radius: 15px;
`

const Button = styled.button` 
    height: 20px;
    width: 20px;
    background-color: #3C3C3C;
    border: 2px inset gray;
    margin-right: 10%;
    border-radius: 50%;
`

export default () => {
    const [modal, setModalOpen] = useState(false);
    const [range, setRange] = useState(30);
    const [cursor, setCursor] = useState(false);
    const [playClick] = useSound('click');

    useEffect(() => {
        localStorage.setItem('volume', JSON.stringify(range));
    }, [range]);

    useEffect(() => {
        const intervalo = setTimeout(() => {
            if (cursor) return;
            setModalOpen(false);
        }, 1000)

        if (!cursor) {
            return () => clearTimeout(intervalo);
        }
    }, [cursor])

    useEffect(() => {
        const vol = localStorage.getItem('volume');
        if (vol) {
            setRange(Number(vol));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('volume', JSON.stringify(range));
    }, [range]);

    return (
        <Caixa>
            {modal ?
                <BarraVolume
                    type="range"
                    min="1"
                    max="100"
                    value={range}
                    onChange={(e) => { setRange(Number(e.target.value)) }}
                    onMouseEnter={() => { setCursor(true) }}
                    onMouseLeave={() => { setCursor(false) }}
                ></BarraVolume>
                :
                <Button onClick={() => { setModalOpen(true); playClick() }}></Button>
            }
        </Caixa>
    )
}