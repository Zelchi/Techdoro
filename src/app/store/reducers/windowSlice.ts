import { createSlice } from "@reduxjs/toolkit";

type Window = {
    value: number
}

const windowState: Window = {
    value: 1
}

const windowSlice = createSlice({
    name: 'windowSlice',
    initialState: windowState,
    reducers: {
        setWindow: (state, action) => {
            state.value = action.payload;
        }
    }
});

export const { setWindow } = windowSlice.actions;
export default windowSlice.reducer;