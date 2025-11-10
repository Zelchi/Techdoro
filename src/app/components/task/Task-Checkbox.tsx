import styled from 'styled-components'
import { Tarefa } from './Task'
import { FiCheck } from 'react-icons/fi'

type Props = {
    tarefa: Tarefa,
    marcarTarefa: (tarefa: Tarefa) => void
}

const Caixa = styled.div<{ $marcado: boolean }>`
    cursor: pointer;
    height: 30px;
    width: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-3);
    color: ${({ $marcado }) => ($marcado ? 'var(--accent-strong)' : 'var(--text-2)')};
    border: 1px solid var(--border);
    border-radius: var(--radius-xs);
    transition: background .15s, color .15s, border-color .15s;
    font-size: 18px;
`

export default ({ tarefa, marcarTarefa }: Props) => {
    return (
        <Caixa
            $marcado={tarefa.completed}
            onClick={() => marcarTarefa(tarefa)}
            role="button"
            aria-pressed={tarefa.completed}
        >
            {tarefa.completed && <FiCheck />}
        </Caixa>
    )
}