import { createSlice } from "@reduxjs/toolkit";

type Window = {
    win: number
}

const windowState: Window = {
    win: 1
}

const windowSlice = createSlice({
    name: 'windowSlice',
    initialState: windowState,
    reducers: {
        setWindow: (state, action) => {
            state.win = action.payload;
        }
    }
});

export const { setWindow } = windowSlice.actions;
export default windowSlice.reducer;