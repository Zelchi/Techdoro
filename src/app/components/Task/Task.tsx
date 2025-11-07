import styled, { keyframes, css } from 'styled-components';
import { useState, useEffect, useRef } from 'react';
import { CheckBox } from './Task-Checkbox'
import { useSound } from '../../hooks/useSound';
import { GoPlus, GoTrash } from 'react-icons/go';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: start;
    margin-top: 12px;
    margin-bottom: 12px;
    width: calc(100% - 28px);
    flex: 1;
    overflow: hidden;
    gap: 12px;
`;

const Caixa = styled.div`
    width: 100%;
    height: 100%;
    background: var(--bg-2);
    border: 1px solid var(--border);
    padding: 12px;
    overflow-y: auto;
    overflow-x: hidden;
    border-radius: var(--radius);
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const Form = styled.form`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    background: var(--bg-2);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 0;
    overflow: hidden;
`;

const Input = styled.input`
    font-family: 'Press Start 2P';
    padding: 12px 14px;
    border: none;
    background: var(--bg-3);
    color: var(--text-1);
    width: 100%;
    height: 44px;
    outline: none;
    font-size: 14px;
    letter-spacing: .5px;
    border-right: 1px solid var(--border);
    transition: background .15s;
    &:focus { background: var(--bg-2); }
`;

const Button = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    height: 44px;
    width: 58px;
    background: var(--bg-3);
    color: var(--accent);
    border: none;
    cursor: pointer;
    font-size: 20px;
    transition: background .15s, color .15s;
    &:hover { background: var(--bg-2); color: var(--accent-strong); }
    &:active { filter: brightness(.85); }
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
    animation: ${fade} .6s ease;
    gap: 10px;
`;

const TaskTextContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: start;
    width: 100%;
    min-height: 32px;
    margin-right: 5px;
    overflow: hidden;
`;

const scrollText = keyframes`
     0%, 10% {
        transform: translateX(0);
    }
    90%, 95% {
        transform: translateX(-100%);
    }
`;

const TaskText = styled.p<{ $completed: boolean; $shouldScroll: boolean }>`
    font-family: 'Press Start 2P';
    font-size: 14px;
    display: inline-block;
    text-overflow: ellipsis;
    width: 100%;
    color: ${({ $completed }) => ($completed ? 'var(--text-2)' : 'var(--text-1)')};
    text-decoration: ${({ $completed }) => ($completed ? 'line-through' : 'none')};
    cursor: pointer;
    white-space: nowrap;
    ${({ $shouldScroll }) => $shouldScroll && css`
        animation: ${scrollText} 10s linear infinite;
    `}
`;

const Botoes = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: end;
    gap: 6px;
`;

const DeleteButton = styled.button`
    height: 30px;
    width: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-3);
    color: #ff6b6b;
    border: 1px solid var(--border);
    border-radius: var(--radius-xs);
    cursor: pointer;
    font-size: 16px;
    transition: background .15s, color .15s, border-color .15s;
    &:hover { background: #ff3535; color: #fff; border-color: #ff3535; }
    &:active { filter: brightness(.85); }
`;

export type Tarefa = {
    id: number,
    text: string,
    completed: boolean,
}

export default () => {
    const [tarefas, setTarefas] = useState<Tarefa[]>([]);
    const [novaTarefa, setNovaTarefa] = useState('');
    const [editando, setEditando] = useState<number | null>(null);
    const [tarefaEditada, setTarefaEditada] = useState('');
    const [containerWidth, setContainerWidth] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const [playClick] = useSound("click");

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

    const geraProximoId = () => {
        if (tarefas.length) {
            return tarefas[tarefas.length - 1].id + 1;
        } else {
            return 1;
        }
    }

    const adicionarTarefa = (e: React.FormEvent) => {
        e.preventDefault();
        if (novaTarefa.trim() !== '') {
            setTarefas([...tarefas, { id: geraProximoId(), text: novaTarefa, completed: false }]);
            setNovaTarefa('');
        }
    };

    const apagarTarefa = (index: number) => {
        setTarefas(tarefas.filter((_, i) => i !== index));
    };

    const marcarTarefa = (marcada: Tarefa) => {
        const tarefa = tarefas.find((tarefa) => tarefa.id === marcada.id)
        if (tarefa) {
            tarefa.completed = !tarefa.completed;
            setTarefas([...tarefas]);
        }
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
            context.font = '16px "Press Start 2P"';
            const textWidth = context.measureText(text).width + 100;
            return textWidth > containerWidth;
        }
        return false;
    };

    return (
        <Container>
            <Form onSubmit={adicionarTarefa}>
                <Input
                    type="text"
                    value={novaTarefa}
                    onChange={(e) => setNovaTarefa(e.target.value)}
                />
                <Button aria-label="Adicionar tarefa" type="submit" onClick={() => novaTarefa && playClick()}><GoPlus /></Button>
            </Form>
            <Caixa ref={containerRef}>
                {tarefas.map((tarefa, index) => (
                    <TaskContainer key={tarefa.id}>
                        {editando === index ? (<>
                            <Input
                                type="text"
                                value={tarefaEditada}
                                onChange={(e) => setTarefaEditada(e.target.value)}
                                onBlur={() => { salvarEdicao(index); playClick() }}
                                onKeyDown={(e) => { if (e.key === 'Enter') { salvarEdicao(index); playClick(); } }}
                            />
                            <Button onClick={() => { salvarEdicao(index); playClick() }} />
                        </>) : (
                            <TaskTextContainer>
                                <TaskText
                                    $completed={tarefa.completed}
                                    $shouldScroll={shouldScroll(tarefa.text)}
                                    onClick={() => { editarTarefa(index); playClick() }}
                                >
                                    {tarefa.text}
                                </TaskText>
                            </TaskTextContainer>
                        )}
                        {editando !== index && (
                            <Botoes onClick={playClick}>
                                <CheckBox
                                    tarefa={tarefa}
                                    marcarTarefa={marcarTarefa}
                                />
                                <DeleteButton aria-label="Apagar tarefa" onClick={() => { apagarTarefa(index); }}><GoTrash /></DeleteButton>
                            </Botoes>
                        )}
                    </TaskContainer>
                ))}
            </Caixa>
        </Container>
    );
};