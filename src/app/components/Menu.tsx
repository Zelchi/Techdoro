import styled from 'styled-components';
import { GoPlay, GoClock, GoListUnordered } from 'react-icons/go';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: calc(100% - 28px);
    margin-top: 32px;
    gap: 22px;
    padding: 34px 32px 42px;
    background: var(--bg-1);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow-1);
    backdrop-filter: blur(8px) saturate(160%);
`;

const Title = styled.h1`
    font-size: 18px;
    letter-spacing: 1px;
    font-weight: 400;
    color: var(--text-1);
    text-align: center;
`;

const Subtitle = styled.p`
    font-size: 12px;
    color: var(--text-2);
    text-align: center;
    line-height: 1.4;
`;

const Actions = styled.div`
    display: flex;
    flex-direction: row;
    gap: 12px;
    width: 100%;
    justify-content: center;
`;

const ActionButton = styled.button`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 110px;
    padding: 14px 10px 16px;
    background: var(--bg-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    color: var(--text-1);
    font-size: 11px;
    letter-spacing: .5px;
    cursor: pointer;
    transition: background .15s, border-color .15s, color .15s, transform .15s;

    svg { font-size: 26px; color: var(--accent); }
    &:hover { background: var(--bg-3); border-color: var(--border-strong); svg { color: var(--accent-strong); } }
    &:active { transform: translateY(2px); }
`;

export default () => {
    return (
        <Container>
            <Title>Techdoro</Title>
            <Subtitle>Organize tarefas e ciclos de foco.<br />Modo escuro minimalista ativado.</Subtitle>
            <Actions>
                <ActionButton aria-label="Iniciar">
                    <GoPlay />
                    Iniciar
                </ActionButton>
                <ActionButton aria-label="Ciclos">
                    <GoClock />
                    Ciclos
                </ActionButton>
                <ActionButton aria-label="Tarefas">
                    <GoListUnordered />
                    Tarefas
                </ActionButton>
            </Actions>
        </Container>
    );
};