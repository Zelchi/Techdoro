import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { setVolume } from '../../store/reducers/volumeSlice';
import { RootState } from '../../store/store';
import { FaVolumeMute, FaVolumeDown, FaVolumeUp } from 'react-icons/fa';

const TopBar = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80%;
`;

const VolumeGroup = styled.div<{ $dragging: boolean }>`
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
    height: 30px;

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
    height: 20px;
    padding: 0 5px;
    background: var(--bg-1);
    border-radius: 999px;
    cursor: pointer;
    display: block;

    &::-webkit-slider-runnable-track {
        height: 6px;
        margin: 7px 0;
        background: transparent;
        border-radius: 999px;
    }
    &::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 16px;
        height: 16px;
        margin-top: -5px;
        border-radius: 50%;
        background: var(--text-1);
        border: 2px solid var(--bg-1);
        transition: transform .15s ease, box-shadow .2s ease;
    }

    &::-moz-range-track {
        height: 6px;
        background: transparent;
        border-radius: 999px;
    }
    &::-moz-range-progress {
        height: 6px;
        background: var(--text-1);
        border-radius: 999px 0 0 999px;
    }
    &::-moz-range-thumb {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--text-1);
        border: 2px solid var(--bg-1);
        margin-top: 0;
        transition: transform .15s ease, box-shadow .2s ease;
    }
`;

export default function VolumeBar() {
    const dispatch = useDispatch();
    const storeVolume = useSelector((state: RootState) => state.volume.volume);

    const [sliderValue, setSliderValue] = useState(storeVolume);
    const [dragging, setDragging] = useState(false);

    const valueRef = useRef(sliderValue);
    useEffect(() => { valueRef.current = sliderValue; }, [sliderValue]);

    useEffect(() => {
        if (!dragging) setSliderValue(storeVolume);
    }, [storeVolume, dragging]);

    useEffect(() => {
        if (!dragging) return;
        const endDrag = () => {
            setDragging(false);
            dispatch(setVolume(Math.max(0, Math.min(100, valueRef.current))));
        };
        window.addEventListener('mouseup', endDrag);
        window.addEventListener('touchend', endDrag);
        window.addEventListener('pointerup', endDrag);
        return () => {
            window.removeEventListener('mouseup', endDrag);
            window.removeEventListener('touchend', endDrag);
            window.removeEventListener('pointerup', endDrag);
        };
    }, [dragging, dispatch]);

    const percent = useMemo(() => Math.max(0, Math.min(100, sliderValue)), [sliderValue]);

    const Icon = useMemo(() => {
        if (percent === 0) return FaVolumeMute;
        if (percent <= 30) return FaVolumeDown;
        return FaVolumeUp;
    }, [percent]);

    const onChange = useCallback((volume: number) => {
        setSliderValue(volume);
    }, []);

    const toggleMute = useCallback(() => {
        const newVal = percent === 0 ? 50 : 0;
        setSliderValue(newVal);
        dispatch(setVolume(newVal));
    }, [percent, dispatch]);

    return (
        <TopBar>
            <VolumeGroup $dragging={dragging}>
                <IconButton onClick={toggleMute} >
                    <Icon />
                </IconButton>
                <VolumeSlider
                    min={0}
                    max={100}
                    step={1}
                    value={percent}
                    onMouseDown={() => setDragging(true)}
                    onTouchStart={() => setDragging(true)}
                    onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
                    onKeyUp={(e) => {
                        const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'];
                        if (keys.includes(e.key)) {
                            dispatch(setVolume(Math.max(0, Math.min(100, valueRef.current))));
                        }
                    }}
                    onBlur={() => {
                        dispatch(setVolume(Math.max(0, Math.min(100, valueRef.current))));
                    }}
                    aria-label="Volume"
                />
                <span style={{ fontSize: 12, opacity: .8, minWidth: 32, textAlign: 'right' }}>{percent}%</span>
            </VolumeGroup>
        </TopBar>
    );
}