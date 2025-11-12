import { createSlice } from "@reduxjs/toolkit";

type Volume = {
    volume: number
}

const getLocalStorage = (): Volume => {
    const volume = localStorage.getItem('volume');

    return {
        volume: volume ? parseInt(volume) : 30
    }
}

const volumeState: Volume = getLocalStorage();

const volumeSlice = createSlice({
    name: 'volumeSlice',
    initialState: volumeState,
    reducers: {
        setVolume: (state, action) => {
            const payload = action.payload;
            state.volume = payload;
            localStorage.setItem('volume', payload);
        }
    }
});

export const { setVolume } = volumeSlice.actions;
export default volumeSlice.reducer;