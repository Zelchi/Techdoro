import styled from 'styled-components'
import { Clock } from './relogios/Clock'
import { useState, useEffect } from 'react'
import { useSound } from '../hooks/useSound'
import { Volume } from './relogios/Volume'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    
    margin-top: 15px;
    width: 90%;
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

const ButtonSwitch = styled.div<{ $clicked: boolean }>`
    height: 20px;
    width: 20px;
    margin-left: 10%;
    background-color: ${({ $clicked }) => ($clicked ? '#3C3C3C' : '#3C3C3C')};
    border: 2px ${({ $clicked }) => ($clicked ? 'inset' : 'outset')} gray;
`

const getInitialStreak = () => {
    const savedStreak = localStorage.getItem('streak');
    return savedStreak ? parseInt(savedStreak, 10) : 0;
};

const getInitialHoursStudied = () => {
    const savedHours = localStorage.getItem('hoursStudied');
    return savedHours ? parseFloat(savedHours) : 0;
};

export const Pomodoro = () => {

    const timeMaxLong = 25 * 60;
    const timeMaxShort = 5 * 60;

    const [clock, setClock] = useState(true);
    const [longClock, setLongClock] = useState({
        timeMax: timeMaxLong,
        timeNow: timeMaxLong,
    });
    const [shortClock, setShortClock] = useState({
        timeNow: timeMaxShort,
        timeMax: timeMaxShort,
    });

    const [playClick] = useSound('click');
    const [playAlarm] = useSound("alarm");

    const [streak, setStreak] = useState(getInitialStreak);
    const [hoursStudied, setHoursStudied] = useState(getInitialHoursStudied);

    const swap = () => {
        setClock(!clock);
    };

    const handleSessionComplete = () => {
        setHoursStudied((prev) => {
            const newHours = prev + (timeMaxLong / 3600);
            localStorage.setItem('hoursStudied', newHours.toString());
            return newHours;
        });

        const lastUsed = localStorage.getItem('lastUsed');
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toISOString().split('T')[0];

        if (lastUsed !== today) {
            if (lastUsed === yesterdayString) {
                setStreak((prev) => {
                    const newStreak = prev + 1;
                    localStorage.setItem('streak', newStreak.toString());
                    return newStreak;
                });
            } else {
                setStreak(1);
                localStorage.setItem('streak', '1');
            }
            localStorage.setItem('lastUsed', today);
        }
    };

    useEffect(() => {
        if (clock && longClock.timeNow === 0) {
            playAlarm();
            handleSessionComplete();
            setLongClock({ timeMax: timeMaxLong, timeNow: timeMaxLong });
        } else if (!clock && shortClock.timeNow === 0) {
            playAlarm();
            setShortClock({ timeMax: timeMaxShort, timeNow: timeMaxShort });
        }
    }, [longClock.timeNow, shortClock.timeNow]);

    return (
        <Container>
            <Barra>
                <Caixa>
                    <ButtonSwitch onClick={() => { swap(); playClick(); }} $clicked={clock} />
                </Caixa>
                <p>Relógio</p>
                <Volume />
            </Barra>
            {clock ? (
                <Clock swap={swap} alarm={playAlarm} clock={{ time: longClock, setTime: setLongClock }} type={clock} />
            ) : (
                <Clock swap={swap} alarm={playAlarm} clock={{ time: shortClock, setTime: setShortClock }} type={clock} />
            )}
            <Container style={{ backgroundColor: '#3c3c3c', width: '100%', border: '2px inset white', display: 'flex', alignItems: 'center' }}>
                <p>Streak: {streak}</p>
                <p>Horas: {hoursStudied.toFixed(0)}</p>
            </Container>
        </Container>
    );
};