import styled from 'styled-components'
import { Tarefa } from '../Tarefas'

type Props = {
    tarefa: Tarefa,
    marcarTarefa: (tarefa: Tarefa) => void
}

const Caixa = styled.div<{ $marcado: boolean }>`
    cursor: pointer;
    padding: 10px;
    background-color: ${({ $marcado }) => ($marcado ? '#1C3C1C' : '#6C6C6C')};
    border: 2px ${({ $marcado }) => ($marcado ? 'outset' : 'outset')} gray;
`

export const CheckBox = ({ tarefa, marcarTarefa }: Props) => {
    return (
        <Caixa $marcado={tarefa.completed} onClick={() => marcarTarefa(tarefa)} />
    )
}