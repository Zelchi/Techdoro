import { createSlice } from "@reduxjs/toolkit";

type Window = {
    value: boolean
}

const windowState: Window = {
    value: false
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