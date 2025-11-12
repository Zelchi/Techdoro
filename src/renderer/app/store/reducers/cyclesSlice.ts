import { createSlice } from "@reduxjs/toolkit";

export type CyclesState = {
    cyclesBeforeFinal: number;
};

const getLocalStorage = (): CyclesState => {
    const cycles = localStorage.getItem('cyclesBeforeFinal');
    return {
        cyclesBeforeFinal: cycles ? parseInt(cycles) : 4 
    };
};

const cyclesState: CyclesState = getLocalStorage();

const cyclesSlice = createSlice({
    name: 'cyclesSlice',
    initialState: cyclesState,
    reducers: {
        setCyclesBeforeFinal: (state, action) => {
            state.cyclesBeforeFinal = action.payload;
            localStorage.setItem('cyclesBeforeFinal', action.payload.toString());
        }
    }
});

export const { setCyclesBeforeFinal } = cyclesSlice.actions;
export default cyclesSlice.reducer;
