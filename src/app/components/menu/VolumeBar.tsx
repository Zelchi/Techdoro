import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useMemo, useRef, useState } from 'react';
import { setVolume } from '../../store/reducers/volumeSlice';
import { RootState } from '../../store/store';
import { FaVolumeMute, FaVolumeDown, FaVolumeUp } from 'react-icons/fa';

const TopBar = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80%;
`;

const VolumeGroup = styled.div<{ dragging: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80%;
    gap: 10px;
    background: var(--bg-2);
    color: var(--text-1);
    border: 1px solid var(--border);
    padding: 6px 10px;
    border-radius: var(--radius-xs);
    transition: box-shadow .2s ease, border-color .2s ease;

    span {
        width: 60px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;

const IconButton = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    color: var(--text-1);
    border: 0;
    padding: 0;
    height: 20px;
    width: 60px;
    text-align: center;
    cursor: pointer;
    opacity: .9;
    transition: transform .15s ease, opacity .15s ease;
    &:hover { opacity: 1; }
    &:active { transform: scale(.96); }
`;

const VolumeSlider = styled.input.attrs({ type: 'range' })`
    -webkit-appearance: none;
    appearance: none;
    width: 160px;
    height: 8px;
    border-radius: 999px;
    background: var(--bg-3);
    transition: background-size .2s ease;
    cursor: pointer;

    &::-webkit-slider-runnable-track {
        height: 8px;
        background: transparent;
        border-radius: 999px;
    }

    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--text-1);
        border: 2px solid var(--bg-1);
        box-shadow: 0 0 0 0 rgba(0,0,0,0.25);
        transition: transform .15s ease, box-shadow .2s ease;
    }

    &::-moz-range-track {
        height: 8px;
        background: transparent;
        border-radius: 999px;
    }
    &::-moz-range-progress {
        height: 8px;
        background: var(--text-1);
        border-radius: 999px 0 0 999px;
    }
    &::-moz-range-thumb {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--text-1);
        border: 2px solid var(--bg-1);
        transition: transform .15s ease, box-shadow .2s ease;
    }
`;

export default function VolumeBar() {
    const dispatch = useDispatch();
    const volume = useSelector((state: RootState) => state.volume.volume);
    const [dragging, setDragging] = useState(false);
    const prevNonZero = useRef<number>(Math.max(volume, 30));

    const percent = useMemo(() => Math.max(0, Math.min(100, volume)), [volume]);

    const Icon = useMemo(() => {
        if (percent === 0) return FaVolumeMute;
        if (percent <= 30) return FaVolumeDown;
        return FaVolumeUp;
    }, [percent]);

    const onChange = useCallback((v: number) => {
        dispatch(setVolume(v));
        if (v > 0) prevNonZero.current = v;
    }, [dispatch]);

    const toggleMute = useCallback(() => {
        if (percent === 0) {
            onChange(prevNonZero.current || 30);
        } else {
            onChange(0);
        }
    }, [percent, onChange]);

    return (
        <TopBar>
            <VolumeGroup dragging={dragging}>
                <IconButton onClick={toggleMute} aria-label={percent === 0 ? 'Unmute' : 'Mute'}>
                    <Icon />
                </IconButton>
                <VolumeSlider
                    min={0}
                    max={100}
                    step={1}
                    value={percent}
                    onMouseDown={() => setDragging(true)}
                    onMouseUp={() => setDragging(false)}
                    onMouseLeave={() => setDragging(false)}
                    onTouchStart={() => setDragging(true)}
                    onTouchEnd={() => setDragging(false)}
                    onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
                    aria-label="Volume"
                />
                <span style={{ fontSize: 12, opacity: .8, minWidth: 32, textAlign: 'right' }}>{percent}%</span>
            </VolumeGroup>
        </TopBar>
    );
}
