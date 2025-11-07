import { createSlice } from "@reduxjs/toolkit";

type Theme = {
    theme: number
}

const getLocalStorage = (): Theme => {
    const theme = localStorage.getItemItem('theme');

    return {
        theme: theme ? parseInt(theme) : 1
    }
}

const themeState: Theme = getLocalStorage();

const themeSlice = createSlice({
    name: 'themeSlice',
    initialState: themeState,
    reducers: {
        setTheme: (state, action) => {
            const payload = action.payload;
            state.theme = payload;
            localStorage.setItem('theme', payload);
        }
    }
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;