import { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import click from '../sound/click.mp3';
import seta from '../assets/seta2.png';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    margin-top: 3%;

    width: 90%;
    height: 62%;
`;

const Barra = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #3c3c3c;
    width: 100%;
    border: 2px inset white;
`;

const Caixa = styled.div`
    width: 100%;
    height: 100%;
    background-color: #6c6c6c;
    border: 2px inset white;
    padding: 10px;
    overflow-y: scroll;
    overflow-x: hidden;
`;

const Form = styled.form`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    width: 100%;
    padding: 10px;

    background-color: #6c6c6c;
    
    border: 2px inset white;
    border-top: none;
    border-bottom: none;
`;

const Input = styled.input`
    font-family: 'Press Start 2P';
    padding: 10px;
    border: 2px inset white;
    background-color: #9c9c9c;
    width: 100%;
    height: 40px;
    outline: none;
`;

const Button = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    height: 40px;
    background-color: #3c3c3c;
    background-image: url(${seta});
    background-size: 20px;
    background-repeat: no-repeat;
    background-position: center;
    color: white;
    border: 2px inset white;
    border-left: none;
    padding-left: 40px;

    &:hover {
        cursor: pointer;
        background-color: #555;
    }
`;

const fade = keyframes`
    0% {
        opacity: 0;
        transform: translateY(-10px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
`;

const TaskContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    animation: ${fade} 1s normal;
`;

const TaskTextContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: start;
    width: 100%;
    height: 30px;
    margin-right: 5px;
    overflow: hidden;
    text-decoration: underline;
`;

const scrollText = keyframes`
     0%, 10% {
        transform: translateX(0);
    }
    90%, 95% {
        transform: translateX(-100%);
    }
`;

const TaskText = styled.p<{ completed: boolean; shouldScroll: boolean }>`
    font-family: 'Press Start 2P';
    display: inline-block;
    text-overflow: ellipsis;
    width: 100%;
    text-decoration: ${({ completed }) => (completed ? 'line-through' : 'none')};
    cursor: pointer;
    white-space: nowrap;
    ${({ shouldScroll }) => shouldScroll && css`
        animation: ${scrollText} 10s linear infinite;
        animation-delay: 2s;
    `}
`;

const Botoes = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: end;
    gap: 5px;
`;

const TaskButton = styled.button`
    padding: 10px;
    background-color: #3c3c3c;
    color: white;
    
    &:hover {
        cursor: pointer;
        background-color: #970000;
    }
`;

const Checkbox = styled.input`
    height: 25px;
    width: 25px;
    cursor: pointer;
`;

export const Tarefas = () => {
    const [tarefas, setTarefas] = useState<{ text: string, completed: boolean }[]>([]);
    const [novaTarefa, setNovaTarefa] = useState('');
    const [editando, setEditando] = useState<number | null>(null);
    const [tarefaEditada, setTarefaEditada] = useState('');
    const [containerWidth, setContainerWidth] = useState(0);
    const audioClick = useRef<HTMLAudioElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const playClick = (): void => {
        if (audioClick.current) {
            audioClick.current.volume = 0.3;
            audioClick.current?.play();
        }
    };

    useEffect(() => {
        const tarefasSalvas = localStorage.getItem('tarefas');
        if (tarefasSalvas) {
            setTarefas(JSON.parse(tarefasSalvas));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('tarefas', JSON.stringify(tarefas));
    }, [tarefas]);

    useEffect(() => {
        const updateContainerWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
            }
        };

        updateContainerWidth();
        window.addEventListener('resize', updateContainerWidth);

        return () => {
            window.removeEventListener('resize', updateContainerWidth);
        };
    }, []);

    const adicionarTarefa = (e: React.FormEvent) => {
        e.preventDefault();
        if (novaTarefa.trim() !== '') {
            setTarefas([...tarefas, { text: novaTarefa, completed: false }]);
            setNovaTarefa('');
        }
    };

    const apagarTarefa = (index: number) => {
        setTarefas(tarefas.filter((_, i) => i !== index));
    };

    const marcarTarefa = (index: number) => {
        const novasTarefas = [...tarefas];
        novasTarefas[index].completed = !novasTarefas[index].completed;
        setTarefas(novasTarefas);
    };

    const editarTarefa = (index: number) => {
        setEditando(index);
        setTarefaEditada(tarefas[index].text);
    };

    const salvarEdicao = (index: number) => {
        const novasTarefas = [...tarefas];
        novasTarefas[index].text = tarefaEditada;
        setTarefas(novasTarefas);
        setEditando(null);
        setTarefaEditada('');
    };

    const shouldScroll = (text: string) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (context) {
            context.font = '16px Press Start 2P';
            const textWidth = context.measureText(text).width * 3 + 80;
            return textWidth > containerWidth;
        }
        return false;
    };

    return (<>
        <Container>
            <Barra><p>Tarefas</p></Barra>
            <Form onSubmit={adicionarTarefa}>
                <Input
                    type="text"
                    value={novaTarefa}
                    onChange={(e) => setNovaTarefa(e.target.value)}
                />
                <Button type="submit" onClick={() => novaTarefa && playClick()} />
            </Form>
            <Caixa ref={containerRef}>
                {tarefas.map((tarefa, index) => (
                    <TaskContainer key={index}>
                        {editando === index ? (<>
                            <Input
                                type="text"
                                value={tarefaEditada}
                                onChange={(e) => setTarefaEditada(e.target.value)}
                                onBlur={() => salvarEdicao(index)}
                                onKeyDown={(e) => e.key === 'Enter' && salvarEdicao(index)}
                                onClick={playClick}
                            />
                            <Button onClick={() => { salvarEdicao(index); playClick() }} />
                        </>) : (
                            <TaskTextContainer>
                                <TaskText
                                    completed={tarefa.completed}
                                    shouldScroll={shouldScroll(tarefa.text)}
                                    onClick={() => { editarTarefa(index); playClick() }}
                                >
                                    {tarefa.text}
                                </TaskText>
                            </TaskTextContainer>
                        )}
                        {editando !== index && (
                            <Botoes>
                                <Checkbox
                                    type="checkbox"
                                    checked={tarefa.completed}
                                    onChange={() => marcarTarefa(index)}
                                    onClick={playClick}
                                />
                                <TaskButton onClick={() => { apagarTarefa(index); playClick() }}></TaskButton>
                            </Botoes>
                        )}
                    </TaskContainer>
                ))}
            </Caixa>
        </Container>
        <audio ref={audioClick}>
            <source src={click} type="audio/mpeg" />
        </audio>
    </>);
};