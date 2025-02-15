import { createSlice } from "@reduxjs/toolkit";


type Vol = {
    volume: number
}

const volumeState: Vol = {
    volume: 30
}

const volumeSlice = createSlice({
    name: 'volumeSlice',
    initialState: volumeState,
    reducers: {
        setVolume: (state, action) => {
            state.volume = action.payload;
        }
    }
});

export const { setVolume } = volumeSlice.actions;
export default volumeSlice.reducer;