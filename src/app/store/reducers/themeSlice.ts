import { createSlice } from "@reduxjs/toolkit";

type Theme = {
    value: number
}

const getLocalStorage = (): Theme => {
    const theme = localStorage.getItem('theme');
    return {
        value: theme ? parseInt(theme) : 1
    }
}

const themeState: Theme = getLocalStorage();

const themeSlice = createSlice({
    name: 'themeSlice',
    initialState: themeState,
    reducers: {
        setTheme: (state, action) => {
            const payload = action.payload;
            state.value = payload;
            localStorage.setItem('theme', payload);
        }
    }
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;