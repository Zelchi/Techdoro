import styled from 'styled-components'
import { Tarefa } from './Taskbar'

type Props = {
    tarefa: Tarefa,
    marcarTarefa: (tarefa: Tarefa) => void
}

const Caixa = styled.div<{ $marcado: boolean }>`
    cursor: pointer;
    height: 30px;
    width: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({ $marcado }) => ($marcado ? 'rgba(34, 211, 238, 0.1)' : 'var(--bg-3)')};
    color: ${({ $marcado }) => ($marcado ? 'var(--accent-strong)' : 'var(--text-2)')};
    border: 1px solid var(--border);
    border-radius: var(--radius-xs);
    transition: background .15s, color .15s, border-color .15s;
`

export const CheckBox = ({ tarefa, marcarTarefa }: Props) => {
    return (
        <Caixa $marcado={tarefa.completed} onClick={() => marcarTarefa(tarefa)} />
    )
}