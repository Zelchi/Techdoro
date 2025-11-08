import styled from 'styled-components';

const StepRow = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
`;

const ConfigItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 10px;
    width: 100%;
    background: var(--bg-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    box-shadow: var(--shadow-1);
    font-size: 10px;
    letter-spacing: .5px;
    color: var(--text-2);
    min-width: 120px;

    span { font-size: 11px; color: var(--text-1); letter-spacing: .5px; }
    input {
        width: 70px;
        background: var(--bg-1);
        border: 1px solid var(--border);
        border-radius: var(--radius-xs);
        padding: 6px 8px;
        font-size: 12px;
        color: var(--text-1);
        outline: none;
        transition: border-color .15s, background .15s;
        text-align: center;
        appearance: textfield;
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
            appearance: none;
            margin: 0;
        }
        &:focus { border-color: var(--accent); }
    }
`;

const StepButton = styled.button`
    height: 28px;
    width: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-1);
    color: var(--text-1);
    border: 1px solid var(--border);
    border-radius: var(--radius-xs);
    cursor: pointer;
    transition: background .15s, border-color .15s, color .15s, filter .15s;
    &:active { filter: brightness(.85); }
`;

type StepFieldProps = {
    label: string;
    value: number;
    onDec: () => void;
    onInc: () => void;
};

export default ({ label, value, onDec, onInc }: StepFieldProps) => (
    <ConfigItem>
        <span>{label}</span>
        <StepRow onWheel={(e) => e.preventDefault()}>
            <StepButton type="button" onClick={onDec}>-</StepButton>
            <input
                type="number"
                min={1}
                value={value}
                readOnly
                inputMode="none"
                onWheel={(e) => e.preventDefault()}
                onKeyDown={(e) => {
                    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') e.preventDefault();
                }}
            />
            <StepButton type="button" onClick={onInc}>+</StepButton>
        </StepRow>
    </ConfigItem>
);